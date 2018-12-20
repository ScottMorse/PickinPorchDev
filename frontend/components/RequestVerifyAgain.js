import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'

import User from './User'

import { REQUEST_VERIFY_MUTATION } from '../graphql/mutations'

const StyledButton = styled.button`
`

export default class RequestVerifyAgains extends Component {

    state = {
        message: "Send email again",
        sent: false
    }

    render(){
        return <User>
            {(data) => {
                const { currentUser } = data.data
                if(!currentUser) return ""
                if(currentUser.isVerified) return ""
                return <Mutation mutation={REQUEST_VERIFY_MUTATION}
                        variables={{email: currentUser.email}}>
                    {(requestVerify,{data,error,loading})=>{
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Something went wrong</p>
                        return <StyledButton className="auth-button" onClick={async (e) =>{
                            if(this.state.sent) return
                            await requestVerify()
                            this.setState({sent:true,message:"Email sent to " + currentUser.email + "!"})
                        }}>
                            {this.state.message}
                        </StyledButton>
                    }}
                </Mutation>
            }}
        </User>
    }
}