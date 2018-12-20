import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'

import { CURRENT_USER_QUERY } from './User'
import { REQUEST_MUTATION } from '../graphql/mutations'

const StyledForm = styled.form`
    background-color: chartreuse;
    border-radius: 5% / 10%;
    margin-top: 5px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    #reset-title {
        font-size: 18px;
        background: rgba(255,255,255,0.4);
        box-shadow: 1px 2px 10px -2px rgba(0,0,0,0.3);
        padding: 5px;
        margin: 5px;
        border-radius: 5%/20%;
    }
`

const FieldSet = styled.fieldset`
    border: none;
`

const StyledLabel = styled.label`
    display: ${props => props.hidden ? "none":"flex"};
    background: whitesmoke;
    padding: 5px;
    margin-bottom: 10px;
    border-radius: 5%/20%;
    box-shadow: 1px 2px 10px -2px rgba(0,0,0,0.3);
`

export default class Request extends Component {
    state = {
        email: '',
        message: ''
    }

    saveState = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    success = (email) => {
        this.setState({
            message: `Reset link emailed to ${email}!`
        })
    }

    invalid = () => {
        this.setState({
            message: 'No user for email found'
        })
    }

    render(){
        return <Mutation mutation={REQUEST_MUTATION} variables={{email: this.props.accountPage ? this.props.email : this.state.email}} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
            {(requestReset,{loading, error, called}) => {
                if(loading) return <p>Loading...</p>
                if(error) return <p>Oops! Something went wrong!</p>
                return <StyledForm id='request-form' method="post" onSubmit={async (e) => {
                    e.preventDefault()
                    const data = await requestReset()
                    if(!data.data.requestReset){
                        this.invalid()
                        return
                    }
                    this.success(this.props.accountPage ? this.props.email : this.state.email)
                  }
                }>
            <span id="reset-title">Reset your password</span>
            <div>{this.state.message}</div>
            <FieldSet disabled={loading} aria-busy={loading}>
                <StyledLabel hidden={this.props.accountPage} htmlFor="email">
                    Email
                    <input
                        type="email"
                        placeholder="Email address"
                        name="email"
                        maxLength="30"
                        value={this.state.email}
                        onChange={this.saveState}
                        required={!this.props.accountPage}
                    />
                </StyledLabel>
                <button className="auth-button" type="submit">Request reset</button>
            </FieldSet>
        </StyledForm>
            }}
        </Mutation>
    }
}