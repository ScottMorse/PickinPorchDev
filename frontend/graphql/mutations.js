import gql from 'graphql-tag'

export const ADD_TO_CART_MUTATION = gql`
    mutation ADD_TO_CART_MUTATION($itemId: ID!) {
        addToCart(itemId: $itemId) {
            id
        }
    }
`

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`

export const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION(
        $id: ID!
    ) {
        deleteItem(
            id: $id
        ) {
            id
        }
    }
`

export const PLACE_ORDER_MUTATION = gql`
    mutation PLACE_ORDER_MUTATION($token: String!) {
        placeOrder(token: $token){
            id
            charge
            total
            estimatedDelivery
            items {
                id
                title
            }
        }
    }
`

export const DELETE_CART_ITEM_MUTATION = gql`
    mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
        deleteCartItem(id: $id){
            id
        }
    }
`

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation UPDATE_QUANTITY_MUTATION(
        $id: ID!,
        $quantity: Int!
    ) {
        changeCartItemQuantity(
            id: $id,
            quantity: $quantity
        ) {
            id
        }
    }
`

export const LOGIN_MUTATION = gql`
    mutation LOGIN_MUTATION(
            $email: String!
            $password: String!
        ) {
        login(
            email: $email
            password: $password
        ) {
            id
            email
            name
            password
        }
    }
`

export const LOGOUT_MUTATION = gql`
    mutation LOGOUT_MUTATION {
        logout {
            message
        }
    }
`

export const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $email: String!
        $name: String!
        $company: String
        $password: String!
        $isVendor: Boolean!
    ) {
        signup(
            email: $email
            name: $name
            password: $password
            company: $company
            isVendor: $isVendor
        ) {
            message
        }
    }
`

export const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION(
            $email: String!
            $permissions: [Permission]!
        ) {
        updatePermissions(
            email: $email
            permissions: $permissions
        ) {
            id
            name
            email
            permissions
        }
    }
`

export const REQUEST_MUTATION = gql`
    mutation REQUEST_MUTATION(
            $email: String!
        ) {
        requestReset (
            email: $email
        ) {
            message
        }
    }
`

export const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $resetToken: String!
        $password: String!
    ) {
        resetPassword(
            resetToken: $resetToken
            password: $password
        ) {
            id
        }
    }
`

export const REQUEST_VERIFY_MUTATION = gql`
    mutation REQUEST_VERIFY_MUTATION(
            $email: String!
        ) {
        requestVerify (
            email: $email
        ) {
            message
        }
    }
`

export const VERIFY_MUTATION = gql`
    mutation VERIFY_MUTATION(
        $verifyToken: String!
    ) {
        verifyAccount(
            verifyToken: $verifyToken
        ) {
            id
        }
    }
`

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`