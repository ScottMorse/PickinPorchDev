import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'

import User, { CURRENT_USER_QUERY } from './User'
import RequestVerifyAgain from './RequestVerifyAgain'

import { REQUEST_VERIFY_MUTATION } from '../graphql/mutations'

const StyledPage = styled.div`
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    & > div {
        font-weight: bold;
        margin: 10px;
    }
    #underline{
        text-decoration: underline;
    }
`

export default class RequestVerify extends Component {

    state = {
        verifySent: false,
    }

    reqVerify = async (requestVerify) => {
        this.setState({verifySent: true})
        await requestVerify()
    }

    render(){
        return <User>
            {(data) => {
                const { currentUser } = data.data
                if(!currentUser) return <p>Forbidden</p>
                if(currentUser.isVerified) return <p>Forbidden</p>
                return <Mutation mutation={REQUEST_VERIFY_MUTATION}
                        variables={{email: currentUser.email}}
                        refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                    {(requestVerify,{data,error,loading})=>{
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        if(error) return <p>Something went wrong</p>
                        if(this.state.verifySent || currentUser.verifySent) return <StyledPage><div>Check your email at <span id="underline">{currentUser.email}</span> to verify your account. </div><RequestVerifyAgain/></StyledPage>
                        this.reqVerify(requestVerify)
                        return <StyledPage><div>Check your email at {currentUser.email} to verify your account. </div><RequestVerifyAgain/></StyledPage>
                    }}
                </Mutation>
            }}
        </User>
    }
}