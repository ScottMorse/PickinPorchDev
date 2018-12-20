import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { CURRENT_USER_QUERY } from '../graphql/queries'
import { RESET_MUTATION } from '../graphql/mutations'

const StyledForm = styled.form`
`

const FieldSet = styled.fieldset`
`

const StyledLabel = styled.label`
    display: flex;
`

export default class Reset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }

    state = {
        password: '',
        confirmPassword: ''
    }

    saveState = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    invalidate = () => {
        this.setState({
            message: 'Passwords do not match'
        })
    }

    render(){
        return <Mutation mutation={RESET_MUTATION} 
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                }}
                refetchQueries={[{query: CURRENT_USER_QUERY}]}
                >
            {(resetPassword,{data, loading, error}) => {
                console.log(error)
                if(error) return <p>Oops! Something went wrong!</p>
                return <StyledForm method="post" onSubmit={async (e) => {
                    e.preventDefault()
                    if(this.state.password != this.state.confirmPassword){
                        this.invalidate()
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
                    Password
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
                <button type="submit">Reset password</button>
            </FieldSet>
        </StyledForm>
        }}
    </Mutation>
    }
}