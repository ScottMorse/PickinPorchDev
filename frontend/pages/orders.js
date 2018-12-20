import React, { Component } from 'react'

import Link from 'next/link'
import Orders from '../components/Orders'
import User from '../components/User'

export default class OrdersPage extends Component {
    render(){ return <User>
            {(data)=> {
                const { currentUser } = data.data
                if(!currentUser){
                return <div>
                    You must be logged in to do this.
                    <Link href="/signup">
                        <a>Login or Sign Up</a>
                    </Link>
                </div>
            }
            return <Orders placed={this.props.query.placed} user={currentUser}/>
            }}
        </User>
    }
}