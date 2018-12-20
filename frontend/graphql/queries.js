import gql from 'graphql-tag'


import { perPage } from '../config'
export const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY(
        $skip: Int = 0
        $first: Int = ${perPage}
    ) {
        items(
            first: $first
            skip: $skip
            orderBy: createdAt_DESC
        ) {
            id
            title
            price
            description
            image
            largeImage
            user {
                company
            }
        }
    }
`

export const LOCAL_CART_ITEMS_QUERY = gql`
    query {
        cartItems @client
    }
`

export const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        currentUser {
            id
            email
            company
            name
            permissions
            isVendor
            isVerified
            verifySent
            saleItems {
                id
                price
                title
                image
                largeImage
                description
            }
            cart {
                id
                quantity
                item {
                    id
                    title
                    image
                    largeImage
                    price
                    description
                }
            }
            orders {
                id
                total
                datePlaced
                estimatedDelivery
                items {
                    quantity
                    title
                    price
                    description
                    image
                }
            }
        }
    }
`

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`

export const USERS_QUERY = gql`
    query USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`

export const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchQ: String!){
        items(where: {
            OR: [
                {title_contains: $searchQ}
                {description_contains: $searchQ}
            ]
        }) {
            id
            image
            title
        }
    }
`

export const GET_ITEM_QUERY = gql`
    query GET_ITEM_QUERY(
        $id: ID!
    ) {
        item(where: {
            id: $id
        }) {
            id
            title
            description
            price
            image
            largeImage
            user {
                company
            }
        }
    }
`

export const USER_SALES_PRODUCTS_QUERY = gql`
    query USER_SALES_PRODUCTS_QUERY(
        $userId: ID!
    ) {
        items(where: {
            user: {
                id: $userId
            }
        }) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`

export const ORDER_ITEMS_QUERY = gql`
    query ORDER_ITEMS_QUERY(
        $userId: ID!
    ) {
        orderItems(
            where: {
                item: {
                    user: {
                        id: $userId
                    }
                }
            }
        ) {
            id
            quantity
            title
            description
            image
            user {
                id
            }
            price
            item {
                id
                title
            }
            order {
                datePlaced
            }
        }
    }
`

export const ORDER_ITEM_SALES_QUERY = gql`
    query ORDER_ITEM_SALES_QUERY(
        $itemId: ID!
    ) {
        orderItemSales(
            where: {
                item: {
                    id: $itemId
                }
        }) {
            numberSold
            totalProfit
            orderDatas {
                datePlaced
                quantity
                price
            }
        }
    }
`

import { productsPerPage } from '../config'
export const PAGINATED_PRODUCTS_QUERY = gql`
    query PAGINATED_PRODUCTS_QUERY(
        $userId: ID!
        $skip: Int = 0
        $first: Int = ${productsPerPage}
    ) {
        items(
            first: $first
            skip: $skip
            orderBy: createdAt_DESC
            where: {
                user: {
                    id: $userId
                }
        }) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`

export const PRODUCT_PAGINATION_QUERY = gql`
    query PAGINATION_QUERY($userId: ID!) {
        itemsConnection(where: {
            user: {
                id: $userId
            }
        }) {
            aggregate {
                count
            }
        }
    }
`