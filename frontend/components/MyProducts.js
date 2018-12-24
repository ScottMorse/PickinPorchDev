import React, { Component } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import Link from 'next/link'

import { productsPerPage } from '../config'

import User from './User'
import ProductPagination from './ProductPagination'
import TotalProfits from './TotalProfits'

import { PAGINATED_PRODUCTS_QUERY, PRODUCT_PAGINATION_QUERY } from '../graphql/queries'

const StyledProductsPage = styled.div`
    h1{
        font-family: "Rye";
        text-align: center;
    }
    h2{
        text-align: center;
    }
    #make-new-product{
        text-align: center;
        font-size: 18px;
    }
`

const StyledProdcuts = styled.div`
    #user-products{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .user-product{
        display: flex;
        border: 2px solid grey;
        width: 300px;
        min-width: 300px;
        height: 100px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 30px 15px 0 15px;
        border: 2px solid lightgrey;
        font-size: 12px;
        text-align: center;
        border-radius: 5%/10%;
        box-shadow: 2px 3px 15px -2px rgba(0,0,0,0.3);
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
        overflow: hidden;
    }
    .user-product-details-wrap{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
    }
    .user-product-title{
        font-size: 15px;
        font-weight: bold;
        max-height: 150px;
        height: 150px;
        margin: 15px;
        padding-bottom: 5px;
        border-bottom: 2px solid lightgrey;
    }
    .edit{
        font-size: 16px;
    }
`

const ProdImage = styled.div`
    background-image: url("${props => props.url}");
    background-position: center;
    background-size: cover;
    width: 100px;
    height: 100px
`

export default class MyProducts extends Component{
    render(){
        return <User>
            {(data) => {
                const { currentUser } = data.data
                if(!currentUser) {Router.push({pathname: '/signup'}); return}
                if(!currentUser.isVendor) return <p>Forbidden: For vendor accounts only</p>
                return <StyledProductsPage>
                    <h1>{currentUser.company}</h1>
                    <Query query={PRODUCT_PAGINATION_QUERY} variables={{userId: currentUser.id}}>
                {({data, loading, error}) => {
                    if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                    if(error) return <p>Something went wrong!</p>
                    const pageQuery = this.props.page
                    const count = data.itemsConnection.aggregate.count
                    const pages = count > 0 ? Math.ceil(count / productsPerPage) : 1
                    const page = pageQuery <= pages?(pageQuery >= 1 ? pageQuery : 1) : pages
                    return <Query query={PAGINATED_PRODUCTS_QUERY} 
                            variables={{
                                userId: currentUser.id,
                                skip: productsPerPage * (page - 1), 
                                first: productsPerPage
                            }}>
                    {({data,error,loading}) => {
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        if(error) return <p>Oops! Something went wrong!</p>
                        const { items } = data
                        return <StyledProdcuts>
                            <div id="user-products-wrap">
                                <div id="make-new-product">
                                    <Link href="/sell">
                                        <a>Add a new product</a>
                                    </Link>
                                </div>
                                <h2>Your Products: </h2>
                                <ProductPagination page={page} pages={pages}/>
                                <div id="user-products">
                                    {items.length ? items.map(item => {
                                        return <div key={item.id} className="user-product">
                                            <ProdImage url={item.image}></ProdImage>
                                            <div className="user-product-details-wrap">
                                                <div className="user-product-title">

                                                    <Link href={{
                                                        pathname: '/itempage',
                                                        query: { id: item.id }
                                                    }}>
                                                        <a>{item.title}</a>
                                                    </Link></div>
                                                <Link href={{
                                                    pathname: 'update',
                                                    query: { id: item.id }
                                                }}>
                                                    <a className="edit">Edit this item</a>
                                                </Link>
                                            </div>
                                        </div>
                                    }) : "You have not listed any products yet."}
                                </div>
                            </div>
                        </StyledProdcuts>
                    }}
                </Query>
            }}
            </Query>
            </StyledProductsPage>}}
        </User>
    }
}