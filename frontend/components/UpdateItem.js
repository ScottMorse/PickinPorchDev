import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import Router from 'next/router'
import styled, { keyframes } from 'styled-components'

import { ALL_ITEMS_QUERY, GET_ITEM_QUERY } from '../graphql/queries'
import { UPDATE_ITEM_MUTATION } from '../graphql/mutations'

import Error from './ErrorMessage'

const StyledForm = styled.form`
`

const LoadingAnimation = keyframes`
    100% {background-position: 300px 0}
`

const FieldSet = styled.fieldset`
    display: flex;
    flex-direction: column;
    align-items: center;

    label{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 15px;
    }
    [type=file]{
        margin-right: -40px;
        margin-top: 10px;
    }
    button{
        margin: auto;
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
const emptyState = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
}

let dataReceived = {}

const dollarRegex = new RegExp(/[\d]+\./)

export default class UpdateItem extends Component {
    state = emptyState

    componentDidMount(){
        this.setState({...dataReceived.item})
        window.addEventListener('click',this.setNum)
    }

    handleChange = (e) => {
        const { name, type, value } = e.target
        const val = type === 'number' ? 
            value.includes('.')
                ? value.replace(dollarRegex,'').length > 2 
                    ? parseFloat(value).toFixed(2) 
                    : parseFloat(value)
                : parseFloat(value)
                : value
        e.target.value = val
        this.setState({ [name]: val })
    }

    setNum = () => {
        const price = document.getElementById('price')
        if(price){
            price.value = parseFloat(price.value).toFixed(2)
        }
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

    update = (cache, payload) => {
        const data = cache.readQuery({ query: GET_ITEM_QUERY, variables: {id: payload.data.updateItem.id}})
        data.item = payload.data.updateItem
        cache.writeQuery({ query: GET_ITEM_QUERY, data})
    }

    fillInitialState = (data) => {
        if(this.state == emptyState && data.item != emptyState){
            this.setState({...data.item})
        }
    }

    doSomething = () => {console.log('anything')}

    render(){
        return <Query query={GET_ITEM_QUERY} variables={{id:this.props.id}}>
            {({data, error, loading}) => {
                if(loading) return <p>Loading...</p>
                if(error) return <p>Oops! Something went wrong with this page!</p>
                if(!data.item) return <p>Uh oh, item not found!</p>
                if(this.state == emptyState && data.item != emptyState){
                    dataReceived = data
                }
                return <Mutation mutation={UPDATE_ITEM_MUTATION} variables={{id: this.props.id,...this.state,price:Math.round(this.state.price * 100)}} update={this.update} refetchQueries={[{query: ALL_ITEMS_QUERY}]}>
                {(updateItem,{ loading, error, called}) => (
                    <StyledForm id="form" onSubmit={(async e => {
                        e.preventDefault()
                        const update = await updateItem()
                        if(!update.data.updateItem){
                            document.getElementById('form').innerHTML = "You don't have permission to update items right now."
                            return
                        }
                        Router.push({
                            pathname: '/itempage',
                            query: { id: update.data.updateItem.id}
                        })
                        })}>
                        <Error error={error}/>
                        <FieldSet disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">
                                Title
                                <input type="text" id="title" name="title" placeholder="Product title" defaultValue={data.item.title || ''} onChange={this.handleChange} required/>
                            </label>
                            <label htmlFor="price">
                                Price
                                <span>$<input step="any" type="number" id="price" name="price" placeholder="Product price" defaultValue={(data.item.price / 100).toFixed(2) || 0} onChange={this.handleChange} required/></span>
                            </label>
                            <label htmlFor="description">
                                Description
                                <input type="text" id="description" name="description" placeholder="Product description" defaultValue={data.item.description || ''} onChange={this.handleChange} required/>
                            </label>
                            <label htmlFor="image">
                                Image (recommended): 
                                <input type="file" id="image" name="image" placeholder="Upload an Image" onChange={this.uploadFile}/>
                            </label>
                            <button type="submit">Submit</button>
                        </FieldSet>
                    </StyledForm>
                    )}
                </Mutation>}}
            </Query>
    }
}

export { CREATE_ITEM_MUTATION }
export { GET_ITEM_QUERY }