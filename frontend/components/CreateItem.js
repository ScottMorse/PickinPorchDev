//TODO Stylings

import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import styled, { keyframes } from 'styled-components'

import Error from './ErrorMessage'
import User from './User'
import RequestVerifyAgain from './RequestVerifyAgain'

import { ALL_ITEMS_QUERY, PRODUCT_PAGINATION_QUERY } from '../graphql/queries'
import { CREATE_ITEM_MUTATION } from '../graphql/mutations'

const PageWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: lightsteelblue;
    box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.4);
    border-radius: 20%;
    width: 290px;
    padding: 0 50px;
`

const LoadingAnimation = keyframes`
    100% {background-position: 300px 0}
`

const FieldSet = styled.fieldset`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    label{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 15px;
        font-weight: bold;
        font-size: 16px;
    }
    input[type=text],input[type=number] {
        font-size: 16px;
    }
    [type=file]{
        margin-right: -40px;
        margin-top: 10px;
    }
    button{
        margin: auto;
        border-radius: 5%/15%;
    }
    &[disabled] > *{
        opacity: 0.5;
    }
    &[aria-busy='true']::before {
        content: 'Loading';
        text-align: center;
        text-shadow: 2px 2px 2px whitesmoke;
        color: yellow;
        border: 3px double white;
        border-top: none;
        border-bottom: none;
        font-family: 'Sub-display';
        font-size: 2em;
        width: 300px;
        height: 30px;
        margin: auto;
        background-image: url('/static/imgs/bach.png');
        background-color: black;
        background-size: 300px;
        filter: invert(1);
        animation: ${LoadingAnimation} 1.8s linear infinite;
    }
    
`

const dollarRegex = new RegExp(/[\d]*\./)

export default class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    }

    handleChange = (e) => {
        const { name, type, value } = e.target
        const val = type === 'number' 
        ? 
        value.includes('.')
            ? value.replace(dollarRegex,'').length > 2 
                ? parseFloat(value).toFixed(2) 
                : parseFloat(value)
            : parseFloat(value)
        : value
        this.setState({ [name]: val })
    }

    uploadFile = async (e) => {
        const file = e.target.files[0]
        const data = new FormData()
        data.append('file',file)
        data.append('upload_preset','pickinporch')

        const res = await fetch('https://api.cloudinary.com/v1_1/dwvfnnayw/image/upload/', {
            method: 'POST',
            body: data
        }) 
        const result = await res.json()
        this.setState({
            image: result.secure_url,
            largeImage: result.eager[0].secure_url
        })
    }

    render(){
        return <User>
            {(data) => {
                const { currentUser } = data.data
                if(!currentUser) return <p>Forbidden: for vendor accounts only</p>
                if(!currentUser.isVendor) return <p>Forbidden: for vendor accounts only</p>
                if(!currentUser.isVerified) return <div>
                    <div>Please verify your account for this feature.</div>
                    <RequestVerifyAgain/>
                </div>
                return <Mutation mutation={CREATE_ITEM_MUTATION} 
                variables={{...this.state,price:Math.round(this.state.price * 100)}} 
                refetchQueries={[{query: ALL_ITEMS_QUERY}]}>
                {(createItem,{ loading, error, called, data}) => (
                    <PageWrap>
                    <h1>Add a new product</h1>
                    <StyledForm id="form" onSubmit={(async e => {
                        e.preventDefault()
                        const res = await createItem()
                        if(!res.data.createItem){
                           document.getElementById('form').innerHTML = "You don't have permission to sell items right now.  You may need to create a vendor account by signing up with one."
                           return
                        }
                        Router.push({
                            pathname: '/itempage',
                            query: { id: res.data.createItem.id}
                        })
                        })}>
                        <Error error={error}/>
                        <FieldSet disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">
                                Title
                                <input type="text" id="title" name="title" placeholder="Product title" value={this.state.title} onChange={this.handleChange} required/>
                            </label>
                            <label htmlFor="price">
                                Price
                                <span>$<input type="number" id="price" name="price" placeholder="Product price" value={this.state.price != ''?this.state.price : ''} onChange={this.handleChange} required/></span>
                            </label>
                            <label htmlFor="description">
                                Description
                                <input type="text" id="description" name="description" placeholder="Product description" value={this.state.description} onChange={this.handleChange} required/>
                            </label>
                            <label htmlFor="image">
                                Image (recommended): 
                                <input type="file" id="image" name="image" placeholder="Upload an Image" onChange={this.uploadFile}/>
                            </label>
                            <button className="auth-button" type="submit">Submit</button>
                        </FieldSet>
                    </StyledForm></PageWrap>
                )}
                </Mutation>
            }}
        </User>
    }
}

export { CREATE_ITEM_MUTATION }