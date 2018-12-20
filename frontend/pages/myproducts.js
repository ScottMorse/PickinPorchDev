import React, { Component } from 'react'

import User from '../components/User'
import RequestVerifyAgain from '../components/RequestVerifyAgain'

import MyProducts from '../components/MyProducts'


export default class MyProductsPage extends Component{
    render(){
        return <User>
            {(data) => {
                const { currentUser } = data.data
                if(!currentUser) return <p>Forbidden: For vendor accounts only</p>
                if(!currentUser.isVendor) return <p>Forbidden: For vendor accounts only</p>
                if(!currentUser.isVerified) return <div>
                    <div>Please verify your account for this feature.</div>
                    <RequestVerifyAgain/>
                </div>
                return <MyProducts page={this.props.query.page || 1}/>
            }}
        </User>
    }
}