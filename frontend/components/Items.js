import React, { Component } from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import Item from './Item'
import Pagination from './Pagination'

import { perPage } from '../config'

import { PAGINATION_QUERY, ALL_ITEMS_QUERY } from '../graphql/queries'

const InnerCenter = styled.div`
    text-align: center;
    h1 {
        font-family: 'Rye'
    }
`

const ItemList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: ${props => props.theme.maxWidth};
    & > * {
        margin: 40px;
    }
`

export default class Items extends Component {
    render(){
        return (
            <Query query={PAGINATION_QUERY}>
                {({data, loading, error}) => {
                    if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                    if(error) return <p>Something went wrong!</p>
                    const pageQuery = this.props.page
                    const count = data.itemsConnection.aggregate.count
                    const pages = count > 0 ? Math.ceil(count / perPage) : 1
                    const page = pageQuery <= pages?(pageQuery >= 1 ? pageQuery : 1) : pages
                    return <InnerCenter>
                    <h1>The Shop</h1>
                    <Pagination page={page} pages={pages}/>
                    <Query query={ALL_ITEMS_QUERY} variables={{skip: perPage * (page - 1), first: perPage}}>
                    {({data,error,loading}) => {
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        if(error) return <p>Oops! Something went wrong with this page!</p>
                        return <ItemList>
                            {data.items.map(item => {
                                return <Item key={item.id} item={item}/>
                            })}
                        </ItemList>
                    }}
                    </Query>
                    <Pagination page={page} pages={pages}/>
                </InnerCenter>}}
            </Query>
        )
    }
}