import React, { Component } from 'react'
import styled from 'styled-components'

import User from './User'
import Checkout from './Checkout'
import CartItem from './CartItem'
import Logo from './Logo'

import formatCurrency from '../utils/formatCurrency'

const StyledCart = styled.div`
    display: flex;
    #my-cart{
        button{
            margin-right: 5px;
        }
        margin-right: 20px;
        display: flex;
        align-items: center;
    }
    #cart {
        position: fixed;
        height: 100vh;
        width: 500px;
        margin-top: 1px;
        margin-left: 1px;
        background-color: white;
        background-image: url('/static/imgs/texture.png');
        z-index: 10;
        box-shadow: ${props => props.open ? "0 0 5px 5px rgba(0,0,0,0.2)" : "0 0 0 0 white"};
        transform: ${props => props.open ? "translateX(0px)" : "translateX(500px)"};
        transition: transform 0.5s ease, box-shadow 0.5s ease;
        #x-button-cart {
            font-size: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: deepskyblue;
            color: whitesmoke;
            border-radius: 50%;
            width: 35px;
            height: 30px;
            font-weight: bold;
            padding-bottom: 35px;
        }
        #cart-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 20px;
            h3 {
                font-family: "Rye";
                align-self: center;
                font-size: 30px;
                margin-bottom: 0;
                margin-top: 20px;
            }
            #logo {
                align-self: center;
                margin-top: 0;
                margin-bottom: 10px;
            }
            max-height: 92vh;
            overflow-y: scroll;
            .drop-down::-webkit-scrollbar {
                -webkit-appearance: none;
                width: 8px;
            }
            .drop-down::-webkit-scrollbar-thumb {
                border-radius: 8px;
                background-color: rgba(0,0,0,0.5);
                -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
            }
        }
        #cart-total{
            margin: 5px;
            font-weight: bold;
            padding: 2px;
        }
        @media screen and (max-width: 500px){
            width: 100vw;
        }
    }
`

import { TransitionGroup, CSSTransition } from 'react-transition-group'

const StyledCounter = styled.div`
`

const CountAnimWrap = styled.span`
    .count{
        width: 25px;
        height: 25px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        margin-top: -10px;
        background-color: gold;
        border-radius: 50%;
        transition: all 0.5s ease-in;
        backface-visibility: hidden;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }
    .count-exit{
        position: absolute;
        transform: rotateX(0) translateY(-25px);
    }
    .count-exit-active{
        position: absolute;
        transform: rotateX(0.5turn) translateY(-25px);
    }
    .count-enter{
        position: absolute;
        transform: rotateX(0.5turn);
    }
    .count-enter-active{
        position: absolute;
        transform: rotateX(0);
    }
`

const CartCount = ({count}) => <CountAnimWrap><TransitionGroup>
    <CSSTransition
        unmountOnExit
        className="count" 
        classNames="count" 
        key={count} 
        timeout={{enter:500,exit:500}}
    >
        <StyledCounter>{count}</StyledCounter>
    </CSSTransition>
    </TransitionGroup>
</CountAnimWrap>



const nonDigRegEx = new RegExp(/[^-\d]/,'g')

export default class Cart extends Component {

    state = {
        open: false,
    }

    componentDidMount(){
        const cartEl = document.getElementById('cart')
        const offsetRight = Math.floor(window.innerWidth - Math.floor(cartEl.offsetLeft + cartEl.offsetWidth))
        cartEl.style.marginLeft = offsetRight + "px"
        cartEl.style.marginTop = "-" + cartEl.offsetTop + "px"
        this.repositionCart(cartEl)
        window.addEventListener('resize',() => this.repositionCart(cartEl))
    }

    repositionCart = (el) => {
        const currMargTop = parseInt(el.style.marginTop.replace(nonDigRegEx,''))
        el.style.marginTop = currMargTop - el.offsetTop + "px"
        const offsetRight = Math.floor(window.innerWidth - Math.floor(el.offsetLeft + el.offsetWidth))
        const currMargLeft = parseInt(el.style.marginLeft.replace(nonDigRegEx,''))
        el.style.marginLeft = currMargLeft + offsetRight + "px"
    }

    showCart = (e) => {
        const cartEl = document.getElementById('cart')
        cartEl.style.marginLeft = "0"
        cartEl.style.marginTop = "0"
        this.repositionCart(cartEl)
        this.setState({open: true})
    }

    closeCart = () => {
        this.setState({open: false})
    }

    render(){
        let total = 0
        return <User>
                {data => {
                    const { currentUser } = data.data
                    if(!currentUser) return <div id="cart"><span id="my-cart"></span></div>
                    if(currentUser.isVendor) return <div id="cart"><span id="my-cart"></span></div>
                    return <StyledCart open={this.state.open}>
                    <span id="my-cart"><button className="auth-button" onClick={this.showCart}>My Cart</button>
                    <CartCount id="cart-count" count={currentUser.cart.reduce((count,cartItem) => {
                        return count + cartItem.quantity
                    },0)}/></span>
                    <div id="cart">
                        <div id="cart-content">
                            <button id="x-button-cart" onClick={this.closeCart}>X</button>
                            <h3>My Cart</h3>
                            <Logo scale="0.7" viewBox="0 0 300 190"/>
                            {currentUser.cart.length == 0 ? "No items":
                            currentUser.cart.map((cartItem,i) => {
                                if(i == 0) total = 0
                                total += cartItem.item ? cartItem.item.price * cartItem.quantity : 0
                                return <CartItem key={cartItem.id} cartId={cartItem.id} quantity={cartItem.quantity} item={cartItem.item}/>
                            })
                            }
                            <div id="cart-total">{currentUser.cart.length != 0 ? "Total: " + formatCurrency(total):""}</div>
                            {currentUser.cart.length != 0 ? <Checkout/>:""}
                        </div>
                    </div>
                    </StyledCart>
                }}
            </User>
    }
}