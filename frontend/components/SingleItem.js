import React, { Component } from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import Item from './Item'
import ItemSalesData from './ItemSalesData'

import { GET_ITEM_QUERY } from '../graphql/queries'

const StyledItemPage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

export default class SingleItem extends Component {
    render(){
        return <Query query={GET_ITEM_QUERY} variables={{id: this.props.query.id}}>
            {({data, loading, error}) => {
                if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                if(error) return <p>Oops! Something went wrong with this page!</p>
                if(!data.item) return <p>Uh oh, item not found!</p>
                return <StyledItemPage>
                    <Item single item={data.item}/>
                    <ItemSalesData item={data.item}/>
                </StyledItemPage>
            }}
        </Query>
    }
}