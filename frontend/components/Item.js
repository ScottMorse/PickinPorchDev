import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from 'next/link'
import Router from 'next/router'

import formatCurrency from '../utils/formatCurrency'
import DeleteItem from './DeleteItem'
import User from './User'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { ADD_TO_CART_MUTATION } from '../graphql/mutations'

const StyledItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: ${props => props.single ? "none":"2px solid lightgrey"};
    box-shadow: ${props => props.single ? "none":"2px 3px 15px -2px rgba(0,0,0,0.3)"};
    width: 300px;
    min-height: 300px;
    border-radius: 10%;
    min-width: 300px;
    #reverser {
        display: ${props => props.single ? "flex":"unset"};
        flex-direction: column-reverse;
    }
`

const ImageWrap = styled.div`
    margin: 5px auto 10px auto;
    height: ${props => props.single ? "300px":"160px"};
    width: ${props => props.single ? "300px":"160px"};
    justify-self: flex-start;
    .item-image {
        width: inherit;
        height: inherit;
        background-size: ${props => props.single ? "contain":"cover"};
        background-repeat: no-repeat;
        background-position: center;
        box-shadow: ${props => props.single ? "none":"2px 3px 15px -2px rgba(0,0,0,0.3)"};
        border-radius: ${props => props.single ? "0%":"50%"};
        border: ${props => props.single ? "none":"2px solid gray"};
        &:hover{
            cursor: pointer;
        }
        .large-image-wrap {
            display: flex;
            display: none;
            z-index: 100;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,0.2);
            position: fixed;
            justify-content: center;
            align-items: center;
            margin-bottom: auto;
            .large-image {
                min-width: 300px;
                max-width: 90vw;
                min-height: 300px;
                max-height: 500px;
                border: 10px solid whitesmoke;
                box-shadow: 0 0 5px 5px rgba(0,0,0,0.25);
            }
        }
    }
`

const Title = styled.h2`
    margin: 0;
    max-width: ${props => props.single ? "300px":"250px"};
    a {
        font-weight: bold;
        letter-spacing: -1px;
        color: ${props => props.single ? props.theme.black:"mediumblue"};
        padding: ${props => props.single ? "5px":"none"};
        border-radius: 5%/15%;
    }
    text-align: center;
`

const Price = styled.div`
    margin-top: 5px;
    font-weight: ${props => props.single ? "bold":"unset"};
    font-size: ${props => props.single ? "18px":"initial"};
`

const Description = styled.p`
    margin: 10px;
`

const ButtonList = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    & > * {
        width: 34%;
        border: 1px solid lightgrey;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cart-button{
        background: ${props => props.theme.black};
        background: red;
        color: white;
        font-weight: bold;
    }
`

class ItemImage extends Component {

    showLargeImage = (e) => {
        if(!e.target.id){
            const el = e.target.children[0]
            el.style.display = "flex"
            if(el.offsetTop != 0){
                el.style.marginTop = -el.offsetTop + "px"
                el.style.marginLeft = -el.offsetLeft + "px"
            }
        }
        else if(e.target.id == "a"){
            const el = e.target
            el.style.display = 'none'
        }
        else{
            e.target.parentElement.style.display = 'none'
        }
    }

    render(){
        const { id, title, image, largeImage } = this.props.item
        if(image) return (
            <div className="item-image" role="img" onClick={this.showLargeImage} aria-label={title} style={{backgroundImage: `url("${image}")`}}>
                <div id="a" className="large-image-wrap">
                    <img id="b" src={largeImage || image} className="large-image"/>
                </div>
            </div>
        )
        else return <div></div>
    }
}

export default class Item extends Component {

    state = {
        addedToCart: false,
        buttonText: 'Add To Cart'
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
    }

    render(){
        const {item}  = this.props
        return <User>
        {(data)=> {
            const { currentUser } = data.data
            return <StyledItem vendor={(currentUser ? currentUser.isVendor:false)} single={this.props.single}>
            <span id="reverser"><ImageWrap vendor={(currentUser ? currentUser.isVendor:false)} single={this.props.single}>
                {item.image && <ItemImage item={item}/>}
            </ImageWrap>
            <Title single={this.props.single}>
                <Link href={{
                    pathname: '/itempage',
                    query: { id: item.id }
                }}>
                    <a>{item.title}</a>
                </Link>
            </Title></span>
            {this.props.single ? <div id="sold-by">Sold by {item.user.company}</div>:""}
            <Price single={this.props.single}>
                {formatCurrency(item.price)}
            </Price>
            <Description single={this.props.single}>
                {this.props.single ? item.description : item.description.length > 33 ? item.description.slice(0,33) + "..." : item.description}
            </Description>
            <ButtonList>
                {!currentUser ? "" :
                 !currentUser.permissions.includes('ITEMUPDATE') ? "":
                 !currentUser.saleItems.map(saleItem => saleItem.id).includes(item.id) ? "" : <Link href={{
                        pathname: 'update',
                        query: { id: item.id }
                    }}>
                        <a>Edit</a>
                    </Link>}
                <Mutation mutation={ADD_TO_CART_MUTATION} variables={{itemId: item.id}} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                    {(addToCart,{cartData,loading,error}) => {
                        if(loading) return <button className="cart-button">Loading...</button>
                        if(error) return <p>Something went wrong!</p>
                        return !currentUser ? 
                            <button className="cart-button" onClick={ async () => {
                                    Router.push({
                                        pathname: '/signup'
                                    })
                            }}>{this.state.buttonText}</button> 
                        : currentUser.isVendor ? "" :
                            <button className="cart-button" onClick={ async () => {
                                if(!this.state.addedToCart){
                                    await addToCart()
                                    this.setState({
                                        addedToCart: true,
                                        buttonText: 'Added!'
                                    })
                                }
                            }}>{this.state.buttonText}</button>
                    }}
                </Mutation>
                <DeleteItem item={item}/>
            </ButtonList>
        </StyledItem>
        }}
    </User>
    }
}