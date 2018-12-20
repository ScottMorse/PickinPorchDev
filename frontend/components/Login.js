//TODO Import style from signup instead of copy
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import styled from 'styled-components'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { LOGIN_MUTATION } from '../graphql/mutations'

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    #error {
        color: red;
    }
`

const FieldSet = styled.fieldset`
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    #submit {
        margin: 10px auto -5px auto;
        background-color: white;
    }
`

const StyledLabel = styled.label`
    display: flex;
    input {
        font-size: 18px;
    }
`

export default class SignUp extends Component {
    state = {
        email: '',
        password: '',
        invalidMessage: '',
        attempts: 0,
    }

    saveState = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    invalidate = (e) => {
        this.setState({
            invalidMessage: 'Incorrect email/password',
            attempts: this.state.attempts + 1
        })
        if(this.state.attempts === 3){
            document.getElementById('i-forgot').style.animation = "forgotAnim 1.5s linear infinite"
        }
    }

    render(){
        return <Mutation mutation={LOGIN_MUTATION} variables={{email: this.state.email, password: this.state.password}} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
            {(login,{loading, error}) => {
                let invalid = ''
                if(loading) return <p>Loading...</p>
                if(error) return <p>Oops! Something went wrong!</p>
                return <StyledForm method="post" onSubmit={async (e) => {
                    e.preventDefault()
                    const data = await login()
                    if(!data.data.login){
                        this.invalidate()
                        return
                    }
                    Router.push({
                        pathname: '/items'
                    })
                  }
                }>
            <div id="error">{this.state.invalidMessage}</div>
            <FieldSet disabled={loading} aria-busy={loading}>
                <StyledLabel htmlFor="email">
                    <input
                        type="email"
                        placeholder="Email address"
                        name="email"
                        maxLength="30"
                        value={this.state.email}
                        onChange={this.saveState}
                        required
                    />
                </StyledLabel>
                <StyledLabel htmlFor="password">
                    <input
                        type="password"
                        placeholder="Password ******"
                        name="password"
                        maxLength="30"
                        value={this.state.password}
                        onChange={this.saveState}
                        required
                    />
                </StyledLabel>
                <button className="auth-button menu-link" id="submit" type="submit">Login</button>
            </FieldSet>
        </StyledForm>
        }}
        </Mutation>
    }
}