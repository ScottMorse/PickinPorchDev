const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const stripe = require('../stripe')

const { badUsernames, badPasswords, emailRegex, nameRegex, passwordRegex } = require('../utils')
const { transport, resetEmail, verifyEmail, orderEmail } = require("../email")

const Mutation = {
    async createItem(parent, args, ctx, info){
        if(!ctx.request.userId) return null
        if(!ctx.request.user.permissions.includes('ITEMCREATE')) return null
        const item = await ctx.db.mutation.createItem({data: {
            user: {
                connect: {
                    id: ctx.request.userId
                }
            },
            ...args
        }},info)
        return item
    },
    async updateItem(parent, args, ctx, info){
        if(!ctx.request.userId) return null
        if(!ctx.request.user.permissions.includes('ITEMUPDATE')) return null
        const updates = {...args}
        delete updates.id
        const item = await ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            },
            info})
        return item
    },
    async deleteItem(parent, args, ctx, info){
        if(!ctx.request.userId) return null
        if(!ctx.request.user.permissions.includes('ITEMDELETE')) return null
        const item = await ctx.db.mutation.deleteItem({
            where: {
                id: args.id
            },
            info})
        return item
    },
    async signup(parent, args, ctx, info){
        args.email = args.email.toLowerCase()
        let user
        const existingUser = await ctx.db.query.user({where: {email: args.email}})

        if(existingUser) return {message: "Email already associated with an account"}
        if(!args.email.match(emailRegex)) return {message: "Invalid email address"}
        if(!args.name.match(nameRegex)) return {message: "Invalid user name. Security warning."}
        if(!args.password.match(passwordRegex)) return {message: "Invalid password. Security warning."}
        if(badUsernames.includes(args.name.toLowerCase())) return {message: "Invalid name. Security warning."}
        if(badPasswords.includes(args.password.toLowerCase())) return {message: "Invalid password. Security warning."}

        const permissions = args.isVendor?
            ['USER','ITEMCREATE','ITEMUPDATE','ITEMDELETE']
            : ['USER']
        await bcrypt.hash(args.password,10)
          .then(async hashedPswd => {
            await ctx.db.mutation.createUser({
                data: {
                    ...args,
                    password: hashedPswd,
                    permissions: { set: permissions }
                }
            },"{id}")
            .then(async result => {
                user = await result
                const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
                ctx.response.cookie('pickinporch_token', token, {
                    httpOnly: true,
                    maxAge: 31536000000
                })
            })
          })
        return {message: "success"}
    },
    async logout(parent,args,ctx,info){
        ctx.response.clearCookie('pickinporch_token')
        return null
    },
    async login(parent,args,ctx,info){
        let user
        findUser = async () => {
            user = await ctx.db.query.user({where: {email: args.email}}, info)
        }
        validation = async () => {
            await findUser()
              .then(async after => {
                if(!user){
                    user = await null
                }
                else{
                    await bcrypt.compare(args.password,user.password)
                    .then(async (result) => {
                        user = result ? user : null
                        if(user){
                        const token = await jwt.sign({ userId: user.id }, process.env.APP_SECRET)
                        ctx.response.cookie('pickinporch_token', token, {
                            httpOnly: true,
                            maxAge: 31536000000
                        })
                        }
                        return user
                    })
                }
              })
        }
        await validation()
        return user
    },
    async requestReset(parent, args, ctx, info){
        const user = await ctx.db.query.user({where: {email: args.email}})
        if(!user) return null
        const resetToken = await randomBytes(20).toString('hex')
        const resetTokenExpiry = Date.now() + 3600000
        const res = await ctx.db.mutation.updateUser({
            where: {
                email: args.email,
            },
            data: { resetToken, resetTokenExpiry }
        })
        const mailRes = await transport.sendMail({
            from: 'noreply@pickinporch.com',
            to: user.email,
            subject: "Pickin' Porch Password Reset",
            html: resetEmail(`<a href=${process.env.FRONTEND_URL + '/reset?resetToken=' + resetToken}>Reset your password</a>`)
        })

        return {message: "Success"}
    },
    async resetPassword(parent, args, ctx, info){
        const [user] = await ctx.db.query.users({where: {resetToken: args.resetToken, resetTokenExpiry_gte: Date.now() - 3600000}})
        if(!user) return null
        const hashedPswd = await bcrypt.hash(args.password, 10)
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {email: user.email},
            data: {password: hashedPswd,resetToken: null,resetTokenExpiry:null}
        })
        const token = jwt.sign({ userId: updatedUser.id },process.env.APP_SECRET)
        ctx.response.cookie('pickinporch_token',token,{
            httpOnly: true,
            maxAge: 31536000000
        })
        return updatedUser
    },
    async updatePermissions(parent,args,ctx,info){
        if(!ctx.request.userId) return null
        if(!ctx.request.user.permissions.includes("PERMISSIONUPDATE")) return null
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {email: args.email},
            data: {permissions: {
                set: args.permissions
            }}
        },info)
        return updatedUser
    },
    async addToCart(parent,args,ctx,info){
        const userId = ctx.request.userId
        if(!userId) return null
        const [itemAlreadyInCart] = await ctx.db.query.cartItems({
            where: {
                user: {id: userId},
                item: {id: args.itemId}
            }
        })
        if(itemAlreadyInCart){
            const item = await ctx.db.mutation.updateCartItem({
                where: {
                    id: itemAlreadyInCart.id
                },
                data: {
                    quantity: itemAlreadyInCart.quantity + 1
                }
            })
            return item
        }
        else{
            const item = await ctx.db.mutation.createCartItem({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    item: {
                        connect: {
                            id: args.itemId
                        }
                    }
                }
            })
            return item
        }
    },
    async changeCartItemQuantity(parent,args,ctx,info){
        const userId = ctx.request.userId
        if(!userId) return null
        const cartItem = await ctx.db.mutation.updateCartItem({
            where: {
                id: args.id
            },
            data: {
                quantity: args.quantity
            }
        })
        return cartItem
    },
    async deleteCartItem(parent, args, ctx, info){
        if(!ctx.request.userId) return null
        const item = await ctx.db.mutation.deleteCartItem({
            where: {
                id: args.id
            },
            info})
        return item
    },
    async placeOrder(parent, args, ctx, info){
        const { userId } = ctx.request
        if(!userId) return null
        const user = await ctx.db.query.user({
            where: {
                id: userId
            }
        }, '{id name email cart { id quantity item { id price title description image }}}')
        const { cart } = user
        const total = cart.reduce((total,cartItem)=> {
            return total + cartItem.item.price * cartItem.quantity
        },0)
        const charge = await stripe.charges.create({
            amount: total,
            currency: 'USD',
            source: args.token
        })
        const datePlaced = new Date()
        const estimatedDelivery = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))
        const order = await ctx.db.mutation.createOrder({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                total: charge.amount,
                charge: charge.id,
                datePlaced,
                estimatedDelivery
            }
        },info)
        cart.forEach(cartItem => {
            ctx.db.mutation.createOrderItem({
                data: {
                    quantity: cartItem.quantity,
                    item: {
                        connect: {
                            id: cartItem.item.id
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    order: {
                        connect: {
                            id: order.id
                        }
                    },
                    price: cartItem.item.price,
                    title: cartItem.item.title,
                    description: cartItem.item.description,
                    image: cartItem.item.image,
                }
            })
            ctx.db.mutation.deleteCartItem({
                where: {
                    id: cartItem.id
                }
            })
        })
        await transport.sendMail({
            from: 'noreply@pickinporch.com',
            to: user.email,
            subject: "Order confirmation: Pickin' Porch",
            html: orderEmail(total / 100,cart,datePlaced,estimatedDelivery)
        })
        return order
    },
    async requestVerify(parent, args, ctx, info){
        const user = await ctx.db.query.user({where: {email: args.email}})
        if(!user) return null
        const verifyToken = await randomBytes(20).toString('hex')
        const verifyTokenExpiry = Date.now() + 3600000
        const res = await ctx.db.mutation.updateUser({
            where: {
                email: args.email,
            },
            data: { verifyToken, verifyTokenExpiry, verifySent: true }
        })
        const mailRes = await transport.sendMail({
            from: 'noreply@pickinporch.com',
            to: user.email,
            subject: "Verify Account: Pickin' Porch",
            html: verifyEmail(`<a href=${process.env.FRONTEND_URL + '/verify?verifyToken=' + verifyToken}>Verify your account!</a>`)
        })
        return {message: "Success"}
    },
    async verifyAccount(parent, args, ctx, info){
        const [user] = await ctx.db.query.users({where: {verifyToken: args.verifyToken, verifyTokenExpiry_gte: Date.now() - 3600000}})
        if(!user) return null
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {email: user.email},
            data: {isVerified: true,verifyToken: null,verifyTokenExpiry:null}
        },info)
        return updatedUser
    },
};

module.exports = Mutation;