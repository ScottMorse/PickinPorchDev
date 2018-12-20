import React, { Component } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import SignUp from '../components/SignUp'
import User from '../components/User'

const StyledSignup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    #sign-up{
        margin: 10px;
    }
    #options{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: lightskyblue;
        box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.4);
        border-radius: 20%;
        min-height: 250px;
        width: 300px;
        padding: 0 50px;
        overflow: hidden;
        h1 {
            margin: 10px 0 10px 0;
        }
        input {
            font-size: 18px;
        }
    }
    & * {
        border: none;
    }
`

export default class Signup extends Component {
    render(){
        return <User>
        {(data) => {
            const { currentUser } = data.data
            if(currentUser){
                return <StyledSignup>
                <div id="options">
                    <div>You are already logged in.</div>
                    <div>Logout?</div>
                    <div><SignUp/></div>
                </div>
                </StyledSignup>
            }
            return <StyledSignup>
            <div id="sign-up">
                Have an account already?
                <Link href="/login">
                    <a> Login</a>
                </Link>
            </div>
            <div id="options">
                <h1>Sign Up</h1>
                <SignUp/>
            </div>
        </StyledSignup>}}
        </User>
    }
}