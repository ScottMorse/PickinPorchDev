import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import User from './User'

import { ALL_ITEMS_QUERY } from '../graphql/queries'
import { DELETE_ITEM_MUTATION } from '../graphql/mutations'

export default class DeleteItem extends Component {

    state = {
        text: "Delete"
    }

    render(){
        return <User>
            {(data)=> {
                const { currentUser } = data.data
                const { item } = this.props
                if(!currentUser) return ""
                if(!currentUser.permissions.includes('ITEMDELETE')) return ""
                if(!currentUser.saleItems.map(saleItem => saleItem.id).includes(item.id)) return ""
                return <Mutation mutation={DELETE_ITEM_MUTATION} variables={{id: item.id}} refetchQueries={[{query: ALL_ITEMS_QUERY}]}>
                {(deleteItem,{data, error, loading}) => {
                    if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                    if(error) return <p>Oops! Something went wrong with this page! (Failed to delete)</p>
                    return <button onClick={(async (e) => {
                        if(this.state.text != "Delete") return
                        if(!confirm(`Are you sure you want to delete this product?: ${item.title}`)){return}
                        const deletion = await deleteItem()
                        if(!deletion.data.deleteItem){
                            this.setState({text: "Permission denied"})
                            return
                        }
                        Router.push({
                            pathname: '/'
                        })
                    })}>{this.state.text}</button>
                }}
                </Mutation>
            }}
        </User>
    }
}