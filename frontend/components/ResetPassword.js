import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { RESET_MUTATION } from '../graphql/mutations'

import User from './User'

import { passwordMessages } from './SignUp' 
import { passwordRegex } from '../utils/badInput'

const StyledForm = styled.form`
    font-size: 20px;
    display: flex;
    font-weight: bold;
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
        font-size: 18px;
        border-radius: 5%/10%;
    }
`

const FieldSet = styled.fieldset`
    border: none;
    .pmess {
        color: lightcoral;
        font-size: 14px;
        max-width: 150px;
        margin-left: auto;
        margin-right: auto;
    }
`

const StyledLabel = styled.label`
    display: flex;
    font-size: 18px;
    flex-direction: column;
    margin: 10px;
    input {
        font-size: 16px;
    }
`

export default class Reset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }

    state = {
        password: '',
        message: '',
        confirmPassword: '',
        passwordMessage: '',
    }

    saveState = (e) => {
        const val = e.target.value
        if(e.target.name == "password"){
            try{
                passwordMessages.forEach((check) => {
                    if(!val.match(check[0])){
                        this.setState({
                            passwordMessage: check[1]
                        })
                        throw new Error
                    }
                    this.setState({passwordMessage: "✓"})
                })
            }catch(e){}
        }
        if(this.state.confirmPassword != "" || e.target.name == "confirmPassword"){
            if((e.target.name == "confirmPassword" && this.state.password != val) || e.target.name == "password" && this.state.confirmPassword != val){
                this.invalidate()
            }
            else{
                this.setState({message: "✓"})
            }
        }
        this.setState({
            [e.target.name]: val
        })
    }

    invalidate = () => {
        this.setState({
            message: 'Passwords do not match'
        })
    }

    render(){
        return <User>
            {data => {
                return <Mutation mutation={RESET_MUTATION} 
                        variables={{
                            resetToken: this.props.resetToken,
                            password: this.state.password,
                        }}
                        refetchQueries={[{query: CURRENT_USER_QUERY}]}
                        >
                    {(resetPassword,{data, loading, error}) => {
                        console.log(error)
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        if(error) return <p>Oops! Something went wrong!</p>
                        return <StyledForm method="post" onSubmit={async (e) => {
                            e.preventDefault()
                            if(this.state.password != this.state.confirmPassword){
                                this.invalidate()
                                return
                            }
                            if(!this.state.password.match(passwordRegex)){
                                this.setState({message: "Password does not meet criteria."})
                                return
                            }
                            await resetPassword()
                            Router.push({
                                pathname: '/'
                            })
                        }
                        }>
                    Reset password
                    <FieldSet disabled={loading} aria-busy={loading}>
                        <StyledLabel htmlFor="password">
                            New Password
                            <input
                                type="password"
                                placeholder="******"
                                name="password"
                                maxLength="30"
                                value={this.state.password}
                                onChange={this.saveState}
                                required
                            />
                            </StyledLabel>
                        <div className="pmess">{this.state.passwordMessage}</div>
                        <StyledLabel htmlFor="confirmPassword">
                            Confirm Password
                            <input
                                type="password"
                                placeholder="******"
                                name="confirmPassword"
                                maxLength="30"
                                value={this.state.confirmPassword}
                                onChange={this.saveState}
                                required
                            />
                        </StyledLabel>
                        <div className="pmess">{this.state.message}</div>
                        <button type="submit">Reset password</button>
                    </FieldSet>
                </StyledForm>
                }}
            </Mutation>
            }}
        </User>
    }
}