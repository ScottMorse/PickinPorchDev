import React, { Component } from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'

import User from './User'
import RequestVerifyAgain from './RequestVerifyAgain'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { VERIFY_MUTATION } from '../graphql/mutations'

const StyledVerify = styled.div`
    display: flex;
    justify-content: center;
    div {
        display: flex;
        justify-content: space-between;
        background-color: chartreuse;
        padding: 10px;
        font-size: 25px;
        color: white;
        box-shadow: 3px 2px 5px rgba(0,0,0,0.3);
        text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
        font-weight: bold;
        border-radius: 2% / 15%;
        opacity: 1;
        width: 500px;
        white-space: nowrap;
        transition: opacity 0.8s ease-in-out, width 1s ease-out;
        animation: loadAnim 1s;
        animation-delay: 0.2s;
        animation-fill-mode: backwards;
        animation-iteration-count: 1;
        user-select: none;
    }
    @keyframes loadAnim {
        0% {
            opacity: 0;
            width: 1px;
        }
        100% {
            opacity: 1;
            width: 500px;
        }
    }
`

export default class Verify extends Component {

    state = {
        message: "Loading...",
        executed: false,
        completed: false,
    }

    verifyAcc = async (verifyAccount) => {
        this.setState({executed: true})
        await verifyAccount()
        this.setState({completed: true})
    }

    render(){
        return <User>
            {data => {
                const { currentUser } = data.data
                if(!currentUser) return <p>Forbidden</p>
                if(currentUser.isVerified) return <StyledVerify><div id="verified"><span>✓</span><span>You're verified!</span><span>✓</span></div></StyledVerify>
                return <Mutation mutation={VERIFY_MUTATION} 
                    variables={{
                        verifyToken: this.props.verifyToken,
                    }}
                    refetchQueries={[{query: CURRENT_USER_QUERY}]}
                    >
                    {(verifyAccount,{data, loading, error}) => {
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        if(error) return <p>Oops! Something went wrong!</p>
                        if(!this.state.executed) {
                            this.verifyAcc(verifyAccount)
                            return <div>Loading...<div className="spinner-icon"></div></div>
                        }
                        return <div>
                            <p>{this.state.executed && this.state.completed ? "Invalid link. " : <div>Loading...<div className="spinner-icon"></div></div>}</p>
                            {this.state.executed && this.state.completed  ? <RequestVerifyAgain/> : ""}
                        </div>
                    }}
                </Mutation>
            }}
        </User>
}}