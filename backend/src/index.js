require('dotenv').config()
const cookieParser = require('cookie-parser')
const createServer = require('./createServer')
const jwt = require('jsonwebtoken')
const db = require('./db')

const server = createServer()

server.express.use(cookieParser())

server.express.use(async (req,res,next) => {
    const { pickinporch_token } = req.cookies
    if(pickinporch_token) {
        const { userId } = await jwt.verify(pickinporch_token, process.env.APP_SECRET)
        req.userId = userId
    }
    next()
})

server.express.use(async (req,res,next) => {
    if(!req.userId) return next()
    req.user = await db.query.user(
        {where: {id: req.userId}},
        '{id,name,isVendor,company,email,permissions}'
    )
    next()
})

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }
}, details => {
    console.log(`Server running on port ${details.port}`)
})