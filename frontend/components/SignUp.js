//TODO Loading aria animation
//TODO Error handling user parameters
//TODO Styling

import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import styled from 'styled-components'

import { badUsernames, nameRegex, emailRegex, passwordRegex,
        upperCase, lowerCase, numeric, special, eightChar } from '../utils/badInput'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { SIGNUP_MUTATION } from '../graphql/mutations'

const StyledForm = styled.form`
    #error{
        background: lightcoral;
        color: white;
        margin: 5px;
        font-weight: bold;
    }
    #vendor {
        display: flex;
        justify-content: center;
        align-items: center;
        .switch {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 26px;
            margin-left: 10px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 25px;
            border: 2px solid white;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 2px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
        background-color: chartreuse;
        }

        input:focus + .slider {
        box-shadow: 0 0 1px chartreuse;
        }

        input:checked + .slider:before {
        -webkit-transform: translateX(18px);
        -ms-transform: translateX(18px);
        transform: translateX(18px);
        }
    }
    
`

const FieldSet = styled.fieldset`
    input {
        margin-bottom: 1px;
        border: 2px solid lightgray;
    }
`

const StyledLabel = styled.label`
    display: ${props => props.show ? "flex":"none"};
`

const StyledPassMess = styled.div`
    color: ${props => props.good ? "chartreuse":"red"}
`

export const passwordMessages = [
    [lowerCase,"Must contain a lowercase character"],
    [upperCase,"Must contain an uppercase character"],
    [numeric,"Must contain a digit 0-9"],
    [special,"Must contain a special character"],
    [eightChar,"Must contain at least 8 characters"],
]

const messages = [
    ["name",nameRegex,"Name can only have letters and numbers"],
    ["company",nameRegex,"Company name can only have letters and numbers"],
    ["email",emailRegex,"Invalid email"],
    ["password",passwordRegex,"Password is not strong enough"]
]

const multiSpace = new RegExp(/ [\s]+/)

export default class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        company: '',
        isVendor: false,
        message: '',
        passwordMessage: ''
    }

    saveState = (e) => {
        const val = e.target.value
        if(e.target.name == "name" || e.target.name == "company" && val.match(multiSpace)){
            e.target.value = val.replace(multiSpace," ")
        }
        this.setState({
            [e.target.name]: e.target.value
        })
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
    }

    handleVendor = (e) => {
        this.setState({
            isVendor: !this.state.isVendor
        })
    }

    render(){
        return <Mutation mutation={SIGNUP_MUTATION} variables={{name: this.state.name,email: this.state.email,password: this.state.password,company: this.state.company,isVendor: this.state.isVendor}} 
                refetchQueries={[{query: CURRENT_USER_QUERY}]}>
            {(signup,{data, loading, error}) => {
                if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                if(error) return <p>Ooops! Something went wrong!</p>
                return <span><StyledForm method="post" onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                        if(badUsernames.includes(this.state.name)){
                            this.setState({message: "This name is reserved"})
                            throw new Error
                        }
                        messages.forEach(mess => {
                        if(!this.state[mess[0]].match(mess[1])){
                            if(!this.state.isVendor && mess[0] == "company"){}
                            else{
                                this.setState({
                                    message: mess[2]
                                })
                                throw new Error
                            }
                        }
                    })
                    } catch(e){
                        console.log(e)
                        return
                    }
                    console.log('here')
                    const {data: { signup: {message}}} = await signup()
                    if(message !== "success"){
                        this.setState({message})
                    }
                    else{
                        Router.push({
                        pathname: '/sendverify'
                    })
                    }
                  }
                }>
            <div id="error">{this.state.message}</div>
            <div id="vendor" onChange={this.handleVendor}>
                <div>I am a vendor </div>
                <label className="switch">
                    <input type="checkbox"/>
                    <span className="slider"></span>
                </label>
                {/* <label htmlFor="yes">
                    Yes
                    <input id="yes" type="radio" name="vendor" onChange={this.handleVendor} checked={this.state.isVendor}/>
                </label>
                <label htmlFor="no">
                    No
                    <input id="no" type="radio" name="vendor" onChange={this.handleVendor} checked={!this.state.isVendor}/>
                </label> */}
            </div>
            <FieldSet disabled={loading} aria-busy={loading}>
                <StyledLabel show htmlFor="name">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        maxLength="30"
                        value={this.state.name}
                        onChange={this.saveState}
                        required
                    />
                </StyledLabel>
                <StyledLabel show={this.state.isVendor} htmlFor="company">
                    <input
                        type="text"
                        placeholder="Company"
                        name="company"
                        maxLength="30"
                        value={this.state.company}
                        onChange={this.saveState}
                    />
                </StyledLabel>
                <StyledLabel show htmlFor="email">
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
                <StyledLabel show htmlFor="password">
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
                <StyledPassMess good={this.state.passwordMessage === "✓"} id="pass-mess">{this.state.passwordMessage}</StyledPassMess>
                <button className="auth-button" type="submit">Sign Up!</button>
            </FieldSet>
        </StyledForm>
        </span>
            }}
        </Mutation>
    }
}