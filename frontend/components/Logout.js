import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import styled from 'styled-components'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { LOGOUT_MUTATION } from '../graphql/mutations'

const StyledLogout = styled.button`
    font-size: 12px;
`

export default class Logout extends Component {
    render(){
        return <Mutation mutation={LOGOUT_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
            {(logout,{data,loading,error})=>{
                if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                if(error) return <p>Oops! Something went wrong!</p>
                return <form method="post" onSubmit={async (e)=>{
                    e.preventDefault()
                    await logout()
                    Router.push({
                        pathname: '/'
                    })
                }}><StyledLogout className="auth-button menu-link" type="submit">Logout</StyledLogout></form>
            }}
        </Mutation>
    }
}