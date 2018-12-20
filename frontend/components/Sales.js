import React, { Component } from 'react'
import styled from 'styled-components'

import User from './User'
import RequestVerifyAgain from './RequestVerifyAgain'
import TotalProfits from './TotalProfits'

const StyledSales = styled.div`
`

export default class Saless extends Component {
    render(){
        return <User>
        {(data) => {
            const { currentUser } = data.data
            if(!currentUser) return <p>Forbidden: for vendor accounts only</p>
            if(!currentUser.isVendor) return <p>Forbidden: for vendor accounts only</p>
            if(!currentUser.isVerified) return <div>
                    <div>Please verify your account for this feature.</div>
                    <RequestVerifyAgain/>
                </div>
            return <StyledSales>
                <TotalProfits/>
            </StyledSales>
        }}
    </User>
    }
}