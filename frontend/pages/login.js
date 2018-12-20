import React, { Component } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import Login from '../components/Login'
import RequestReset from '../components/RequestReset'
import User from '../components/User'
import Logout from '../components/Logout'

export const StyledLogin = styled.div`
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
        height: 250px;
        width: 300px;
        padding: 0 50px;
        overflow: hidden;
        h1 {
            margin: -10px 0 10px 0;
        }
        #request {
            position: absolute;
            height: 250px;
            width: inherit;
            background-color: chartreuse;
            border-radius: 20%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        #close-request-button{
            font-weight: bold;
            font-size: 30px;
            min-width: 40px;
            box-shadow: 1px 2px 10px -2px rgba(0,0,0,0.3);
            border-radius: 50%;
            margin: 0 auto 0 auto;
            background: rgba(255,255,255,0.4);
        }
    }
    input {
        margin-bottom: 1px;
        border: 2px solid lightgray;
    }
    @keyframes forgotAnim {
        0% { background: whitesmoke }
        50% { background: chartreuse }

    }
`

export default class LoginPage extends Component {

    state = {
        showReset: false
    }

    showReset = () => {
        this.setState({showReset: true})
    }

    hideReset = () => {
        this.setState({showReset: false})
    }

    render(){
        return <User>
        {(data) => {
            const { currentUser } = data.data
            if(currentUser){
                return <StyledLogin>
                <div id="options">
                    <div>You are already logged in.</div>
                    <div>Logout?</div>
                    <div><Logout/></div>
                </div>
                </StyledLogin>
            }
            return <StyledLogin>
            <div id="sign-up">
                Don't have an account yet?
                <Link href="/signup">
                    <a> Sign Up</a>
                </Link>
            </div>
            <div id="options">
                <h1>Login</h1>
                <Login/>
                {this.state.showReset ?
                    <div id="request"><button id="close-request-button" onClick={this.hideReset}>X</button><RequestReset/></div>
                    : <button id="i-forgot" className="auth-button" onClick={this.showReset}>I Forgot My Password</button>
                }
            </div>
        </StyledLogin>}}
        </User>
    }
}