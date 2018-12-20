import React, { Component } from 'react'
import styled from 'styled-components'

import formatMoney from '../utils/formatCurrency'

const StyledOrders = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    #orders {
        max-height: 800px;
        overflow-y: scroll;
        .drop-down::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 5px;
        }
        .drop-down::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: rgba(0,0,0,0.5);
            /* -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5); */
        }
    }
    .user-order {
        border: 2px solid gray;
        border-radius: 5% / 15%;
        padding: 5px;
        box-shadow: 3px 2px 5px rgba(0,0,0,0.3);
        margin: 10px;
        width: 300px;
        .order-placed{
            font-weight: bold;
        }
    }
    .recent{
        background: chartreuse;
    }
    #was-placed{
        background-color: chartreuse;
        padding: 10px;
        font-size: 25px;
        color: white;
        box-shadow: 3px 2px 5px rgba(0,0,0,0.3);
        text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
        font-weight: bold;
        border-radius: 2% / 15%;
        opacity: 0;
        max-width: 1px;
        white-space: nowrap;
        transition: opacity 0.8s ease-in-out, max-width 1s ease-out;
    }
`

const millisecondRegex = new RegExp(/:[\d][\d] /)

const weekdays = [
    'Sun','Mon',
    'Tue','Wed',
    'Thu','Fri','Sat'
]

export default class Orders extends Component {

    componentDidMount(){
        if(this.props.placed){
            const wasPlaced = document.getElementById('was-placed')
            setTimeout(()=>{wasPlaced.style.opacity = 1;wasPlaced.style.maxWidth = "500px"},200)
        }
    }

    render() {
        const { orders } = this.props.user
        orders.sort((a,b) => a.datePlaced < b.datePlaced ? 1:-1)
        return <StyledOrders>
            {this.props.placed ? <div id="was-placed">✓ Your order was placed! ✓</div> : ""}
            <h2>My Orders:</h2>
            <div id="orders">
            {orders.length ? orders.map((order,i) => {
                const placedDate = new Date(Date.parse(order.datePlaced))
                const estimatedDelivery = order.estimatedDelivery ? new Date(Date.parse(order.estimatedDelivery)) : null
                const numItems = order.items.reduce((total,item) => item.quantity + total,0)
                return <div key={order.id} className={"user-order" + (this.props.placed && i == 0 ? " recent":"")}>
                        <div className="order-placed">Order placed: {weekdays[placedDate.getDay()] + ' ' + placedDate.toLocaleDateString() + " " + placedDate.toLocaleTimeString().replace(millisecondRegex," ")}</div>
                        <div>Total: {formatMoney(order.total)} ({numItems} item{numItems == 1 ? "":"s"})</div>
                        <div>{estimatedDelivery ? 
                        `Estimated delivery: ${weekdays[estimatedDelivery.getDay()]} ${estimatedDelivery.toLocaleDateString()}`
                        : ""}</div>
                </div>
            }): "No orders yet!"}
            </div>
        </StyledOrders>
    }
}
