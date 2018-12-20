import React, { Component } from 'react'
import styled from 'styled-components'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import User from './User'
import RequestVerifyAgain from './RequestVerifyAgain'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { PLACE_ORDER_MUTATION } from '../graphql/mutations'

export default class Checkout extends Component {

    onClose = () => {
        document.getElementById('cart').focus()
    }

    onToken = async (token, placeOrder) => {
        const order = await placeOrder({
            variables: {token: token.id}
        }).catch(err => {
            console.error("Order placement error")
        })
    }

    render() { 
        return ( 
            <User>
                {data => {
                    const { currentUser } = data.data
                    if(!currentUser) return ""
                    const amount = currentUser.cart.reduce((total,cartItem) => {
                                    return total + cartItem.item.price * cartItem.quantity
                                },0)
                    const total = currentUser.cart.reduce((total,cartItem) => {
                                    return total + cartItem.quantity
                                },0)
                    return  <Mutation mutation={PLACE_ORDER_MUTATION} 
                            refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                            {(placeOrder,{data,error,loading}) => {
                                if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                                if(error) return <p>Oops! Something went wrong!</p>
                                if(!currentUser.isVerified) return <div>
                                    Please verify your account to checkout.
                                    <RequestVerifyAgain/>
                                </div>
                                return <StripeCheckout
                                    amount={amount}
                                    name="Checkout"
                                    description={`Total of ${total} item${total > 1 ? 's':''}`}
                                    stripeKey="pk_test_tdEiWpYCxXyJfzdRcSy0Z4bg"
                                    email={currentUser.email}
                                    image="https://i.imgur.com/rIhwgMU.png"
                                    color="white"
                                    shippingAddress
                                    billingAddress
                                    closed={this.onClose}
                                    token={res => {
                                        this.onToken(res,placeOrder)
                                        Router.push({pathname: '/orders',query: {placed:1}})
                                    }}
                                >
                                    {this.props.children}
                                </StripeCheckout>
                            }}
                        </Mutation>
                }}
            </User>
        )
    }
}