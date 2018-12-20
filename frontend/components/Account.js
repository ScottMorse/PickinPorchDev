import { Component } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const StyledAccount = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    div {
        margin: 5px;
        font-weight: bold;
    }
    button {
        background: lightskyblue;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
        padding: 5px;
    }
    #request-form{
        background: whitesmoke;
        #reset-title {
            border-radius: 0%;
            box-shadow: none;
            margin-bottom: -10px;
        }
    }
`

import User from './User'
import RequestReset from './RequestReset'
import RequestVerifyAgain from './RequestVerifyAgain'

export default class Account extends Component {
    render(){
        return (
            <User>
                {(data) => {
                    const { currentUser } = data.data
                    if(!currentUser) {
                        return <StyledAccount>
                            You're not logged in.
                            <Link href="/signup">
                                <a>Create an account</a>
                            </Link>
                            <Link href="/login">
                                <a>Log in</a>
                            </Link>
                        </StyledAccount>
                    }
                    return <StyledAccount>
                        <h2>{currentUser.name}: Account</h2>
                        <div id="account-type">
                            Account type: {currentUser ? currentUser.isVendor ? "Vendor (" + currentUser.company + ")":"Customer" : ""}
                        </div>
                        <div id="account-verified">
                            Verified account: {currentUser ? currentUser.isVerified ? "Yes":"No" : ""}
                            {currentUser ? currentUser.isVerified ? "":<RequestVerifyAgain/> : ""}
                        </div>
                        <div id="account-email">
                            Email: {currentUser.email}
                        </div>
                        <div id="account-password">
                            <RequestReset accountPage email={currentUser.email}/>
                        </div>
                    </StyledAccount>
                }}
            </User>
        )
    }
}