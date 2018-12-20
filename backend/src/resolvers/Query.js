const { forwardTo } = require('prisma-binding') // optional use like this -> items: forwardTo('db'),
const bcrypt = require('bcryptjs')

const { hasPermission } = require('../utils')

const Query = {
    async items(parent,args,ctx,info){
        const items = await ctx.db.query.items({...args},info)
        return items
    },
    async users(parent, args, ctx, info){
        if(!ctx.request.userId) return null
        if(!hasPermission(ctx.request.user,['ADMIN','PERMISSIONUPDATE'])) return null
        return await ctx.db.query.users({},info)
    },
    async item(parent,args,ctx,info){
        const item = await ctx.db.query.item({...args},info)
        return item
    },
    async itemsConnection(parent,args,ctx,info){
        const items = await ctx.db.query.itemsConnection({...args},info)
        return items
    },
    async currentUser(parent,args,ctx,info){
        if(!ctx.request.userId) return null
        const user = await ctx.db.query.user({ where: {id: ctx.request.userId} }, info)
        return user
    },
    async allOrders(parent, args, ctx, info){
        if(!ctx.request.userId) return null
        if(!ctx.request.user.permissions.includes('VIEWORDERS')) return null
        const orders = await ctx.db.query.orders({},info)
        return orders
    },
    async userOrders(parent,args,ctx,info){
        if(!ctx.request.userId) return null
        const orders = await ctx.db.query.orders({
            where: { user : {
                id: args.userId
            }}
        })
        return orders
    },
    async orderItems(parent,args,ctx,info){
        if(!ctx.request.userId) return null
        const orderItems = await ctx.db.query.orderItems({...args},info)
        return orderItems
    },
    async orderItemSales(parent,args,ctx,info){
        if(!ctx.request.userId) return null
        const orderItems = await ctx.db.query.orderItems({...args},
            '{id quantity price item {id} order {datePlaced}}')
        let numberSold = 0
        let totalProfit = 0
        let orderDatas = []
        if(orderItems.length) 
        {
            orderItems.forEach(orderItem => {
            numberSold += orderItem.quantity
            totalProfit += orderItem.quantity * orderItem.price
            orderDatas.push({
                datePlaced: orderItem.order.datePlaced,
                quantity: orderItem.quantity,
                price: orderItem.price
            })
        })
        }
        return {
            numberSold,
            totalProfit,
            orderDatas
        }
    }
}

module.exports = Query;