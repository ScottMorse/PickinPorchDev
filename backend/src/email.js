const nodemailer = require('nodemailer')

exports.transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

const style = `
    @import url('https://fonts.googleapis.com/css?family=Rye');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    .pickin-email { 
        font-family: 'Open Sans';
        font-size: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h1 {
        font-family: Rye;
        user-select: none;
    }
    .link > a,.delivery {
        background: deepskyblue;
        padding: 5px;
        font-weight: bold;
        border-radius: 5% / 15%;
        color: white;
        box-shadow: 3px 2px 5px rgba(0,0,0,0.3);
        text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
        text-decoration: none;
    }
    .logo-wrap{
        border-radius: 50%;
        overflow: hidden;
        width: 100px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px;
        margin-top: -0.2em;
    }
    .total {
        font-weight: bold;
    }
`

const logo = `
<span class="logo-wrap">
<svg width="180" height="90" viewBox="0 0 300 195">
    <circle stroke="#000000" transform="" id="circle1" strokeWidth="0px" cy="98px" fill="#393939" r="49px" cx="150px"></circle>
    <circle stroke="#393939" transform="" id="circle2" strokeWidth="5px" cy="98px" fill="none" r="54px" cx="150px"></circle>
    <line stroke="#393939" y1="122px" id="line1" strokeWidth="5px" x1="0px" y2="122px" x2="300px" transform=""></line>
    <line stroke="#393939" y1="82px" strokeWidth="5px" x1="0px" id="line2" y2="82px" x2="300px" transform=""></line>
    <line stroke="#393939" y1="92px" strokeWidth="5px" x1="0px" id="line3" y2="92px" x2="300px" transform=""></line>
    <line stroke="#393939" y1="102px" strokeWidth="5px" x1="0px" id="line4" y2="102px" x2="300px" transform=""></line>
    <line stroke="#393939" y1="112px" strokeWidth="5px" x1="0px" id="line5" y2="112px" x2="300px" transform=""></line>
    <line stroke="#393939" y1="72px" strokeWidth="5px" x1="0px" id="line6" y2="72px" x2="300px" transform=""></line>
</svg>
</span>
`

exports.resetEmail = text => `
    <style>
        ${style}
    </style>
    <div class="pickin-email">
        <h1>Pickin' Porch</h1>
        ${logo}
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.  Click the link below to go create a new one.</p>
        <div class="link">${text}</div>
    </div>
` 

exports.verifyEmail = text => `
        <style>
            ${style}
        </style>
        <div class="pickin-email">
        <h1>Pickin' Porch</h1>
            ${logo}
        <h3>Please Verify Your Account:</h3>
        <div class="link">${text}</div>
    </div>
`

exports.orderEmail = (total,cart,datePlaced,estimatedDelivery) => `
        <style>
        ${style}
        </style>
        <div class="pickin-email">
        <h1>Pickin' Porch</h1>
        ${logo}
        <h2>Your Order (${datePlaced.toLocaleDateString()})</h2>
        <div>${cart.length} item${cart.length > 1 ? "s":""}</div>
        <div id="cart-items">
            ${cart.map(cartItem => `
                <div class="item">
                    <div class="item-title">${cartItem.item.title} x${cartItem.quantity}</div>
                    <div class="item-price">$${cartItem.item.price / 100}</div>
                </div>
            `).join('')}
        </div>
        <div class="total">Total: $${total}</div>
        <div class="delivery">Estimated Delivery: ${estimatedDelivery.toLocaleDateString()}</div>
    </div>
`