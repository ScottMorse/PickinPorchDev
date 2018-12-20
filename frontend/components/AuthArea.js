import React, { Component } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import User from './User'
import Logout from './Logout'

const StyledAuthArea = styled.div`
    margin-right: 10px;
    margin-top: -27px;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    color: ${props => props.theme.black};
    text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
    button {
        margin-bottom: 5px;
        background-color: deepskyblue;
        color: white;
    }
`

const AuthA = styled.a`
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 0;
    padding: 1px 4px 0 4px;
    margin-left: 5px;
    border-radius: 10% 10% 0 0 / 20% 20% 0 0;
    background: deepskyblue;
    color: white;
    &:hover{
        cursor: pointer;
    }
    @media screen and (max-width: 440px){
        font-size: 16px;
    }
`

const MyName = styled.div`
    align-self: center;
    margin-right: 5px;
`

export default class AuthArea extends Component {
    render(){
        return <User>
        {(data) => {
            const { currentUser } = data.data
            if(currentUser){
                return <StyledAuthArea>
                    <MyName>Welcome, {currentUser.name}{currentUser.isVendor ? " (vendor)" : ""}!</MyName>
                    <Logout/>
                </StyledAuthArea>
            }
            else{
                return (
                    <StyledAuthArea>
                        <Link href="/signup">
                            <AuthA>Sign Up</AuthA>
                        </Link>
                        <Link href="/login">
                            <AuthA>Login</AuthA>
                        </Link>
                    </StyledAuthArea>
                )
            }
        }}
    </User>
    }
}