import React, { Component } from 'react'
import styled from 'styled-components'

import { Mutation } from 'react-apollo'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { DELETE_CART_ITEM_MUTATION, UPDATE_QUANTITY_MUTATION } from '../graphql/mutations'

import formatCurrency from '../utils/formatCurrency'

const StyledCartItem = styled.div`
    .cart-item-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 2px solid gray;
        border-radius: 2% / 15%;
        padding: 5px;
        box-shadow: 3px 2px 5px rgba(0,0,0,0.3);
        margin-bottom: 10px;
        width: 450px;
        @media screen and (max-width: 500px){
            width: 88vw;
        }
    }
    .cart-item-wrap > *{
        margin-right: 5px;
    }
    .cart-item-title{
        font-weight: bold;
        width: 33%;
    }
    .quantity-area{
        display: flex;
        flex-direction: column;
        @media screen and (min-width: 500px){
            display: unset;
        }
    }
    .select-quantity{
        background: white;
    }
    .quantity{
        background: rgb(240,240,240);
        box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        margin: 5px;
        padding: 2px;
        border-radius: 10%;
        border: 2px solid lightskyblue;
        @media screen and (max-width: 500px){
            font-size: 12px;
        }
    }
    .cart-item-price{
        text-align: right;
        background: whitesmoke;
        padding: 2px;
        border-radius: 10%;
        margin-left: -20px;
        @media screen and (max-width: 500px){
            font-size: 12px;
        }
    }
    .delete-cart-item{
        background: red;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        min-width: 30px;
        min-height: 30px;
        font-weight: bold;
        font-size: 20px;
    }
`
let previousQuantity
export default class CartItem extends Component {

    state = {
        id: this.props.cartId,
        quantity: this.props.quantity,
    }

    componentDidMount(){
        previousQuantity = this.props.quantity
    }

    componentDidUpdate(){
    }

    handleChange = (e) => {
        this.setState({
            quantity: parseInt(e.target.value)
        })
    }

    render(){
        const { item, quantity, cartId } = this.props
        return <StyledCartItem>
            <Mutation mutation={UPDATE_QUANTITY_MUTATION} variables={this.state} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                {(updateQuantity,{data,loading,error}) => {
                    if(loading) return "Loading..."
                    if(error) return "Oops, something went wrong!"
                    return <div className="cart-item-wrap">
                        {item ? [<div key="shut" className="cart-item-title">{item.title}</div>,
                        <div key="please" className="cart-item-price">
                            {formatCurrency(item.price * quantity)}
                            <div className="quantity-2">x{quantity}</div>
                        </div>,
                        <form key="up" onSubmit={async (e) => {
                            e.preventDefault()
                            const result = await updateQuantity()
                        }}>
                            <div className="quantity-area"><select className="select-quantity" value={this.state.quantity} onChange={this.handleChange}>
                                {[...Array(100).keys()].map(num => {
                                    num += 1
                                    return <option key={num}>{num}</option>
                                })}
                            </select>
                            <button className="quantity" type="submit">Update<br/>Quantity</button></div>
                        </form>]
                        : <div className="not-available">An item from your cart is no longer available</div>
                        }
                        <Mutation mutation={DELETE_CART_ITEM_MUTATION} 
                        variables={{id: cartId}} 
                        refetchQueries={[{query: CURRENT_USER_QUERY}]}
                        optimisticResponse={{
                            __typename: 'Mutation',
                            deleteCartItem: {
                                __typename: 'CartItem',
                                id: cartId
                            }
                        }}>
                            {(deleteCartItem,{data,loading,error}) => {
                                if(loading) return "Loading..."
                                if(error) return "Something went wrong!"
                                return <button className="delete-cart-item" onClick={async () => {
                                    const deletedItem = await deleteCartItem()
                                }}>X</button>
                            }}
                        </Mutation>
                    </div>
                }}
            </Mutation>
        </StyledCartItem>
    }
}