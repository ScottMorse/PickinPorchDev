import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo'

import User from './User'

import { USERS_QUERY } from '../graphql/queries'
import { UPDATE_PERMISSIONS_MUTATION } from '../graphql/mutations'

class UserTableRow extends Component {

    checkPermission = (permission) => {
        return this.props.permissions.includes(permission)
    }

    state = {
        ITEMCREATE: this.checkPermission("ITEMCREATE"),
        ITEMUPDATE: this.checkPermission("ITEMUPDATE"),
        ITEMDELETE: this.checkPermission("ITEMDELETE"),
        ADMIN: this.checkPermission("ADMIN"),
        PERMISSIONUPDATE: this.checkPermission("PERMISSIONUPDATE"),
        updated: false,
    }

    handleCheck = (e) => {
        this.setState({
            [e.target.name]: !this.state[e.target.name]
        })
    }

    render(){
        const { name, email, permissions } = this.props
        return <tr>
            <th>{name}</th>
            <th>{email}</th>
            <th>
                <input 
                    name="ADMIN"
                    type="checkbox" 
                    checked={this.state["ADMIN"]}
                    onChange={this.handleCheck}
                    />
            </th>
            <th>
                <input 
                    name="PERMISSIONUPDATE"
                    type="checkbox" 
                    checked={this.state["PERMISSIONUPDATE"]}
                    onChange={this.handleCheck}
                    />
            </th>
            <th>
                <input 
                    name="ITEMCREATE"
                    type="checkbox" 
                    checked={this.state["ITEMCREATE"]}
                    onChange={this.handleCheck}
                />
            </th>
            <th>
                <input
                    name="ITEMUPDATE"
                    type="checkbox" 
                    checked={this.state["ITEMUPDATE"]}
                    onChange={this.handleCheck}
                    />
            </th>
            <th>
                <input 
                    name="ITEMDELETE"
                    type="checkbox" 
                    checked={this.state["ITEMDELETE"]}
                    onChange={this.handleCheck}
                    />
            </th>
            <th>
                <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={
                    {email: email,
                    permissions: [...Object.keys(this.state).filter(key => {
                        return this.state[key] && key != 'updated'
                        }),"USER"]
                      }
                    }>
                    {(updatePermissions,{data,loading,error}) => {
                        if(error) return <p>Something went wrong</p>
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        return <button onClick={ async (e) => {
                            const updatedUser = await updatePermissions()
                            if(updatedUser){
                                this.setState({updated: true})
                            }
                        }}>UPDATE{this.state.updated ? 'D!':''}</button>
                    }}
                </Mutation>
            </th>
        </tr>
    }
}

export default class Permissions extends Component{

    createUsers = (usersArray) => {
        return usersArray.concat().sort((a,b) => a.permissions.includes('ADMIN')?-1:1).map((user,index) => {
            return <UserTableRow key={index} name={user.name} email={user.email} permissions={user.permissions}/>
        })
    }

    render(){
        return <User>
            {(data)=> {
                if(data.loading){
                    return <div>Loading...<div className="spinner-icon"></div></div>
                }
                if(!data.data.currentUser){
                    return <div>You do not have permission to use this page.</div>
                }
                return <Query query={USERS_QUERY}>
                    {({data, loading, error}) => {
                        if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                        if(error) return <div>Oops! Something went wrong with this page</div>
                        if(!data.users){
                            return <div>You do not have permission to use this page.</div>
                        }
                        return <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Admin</th>
                                    <th>Update Permissions</th>
                                    <th>Create Items</th>
                                    <th>Update Items</th>
                                    <th>Delete Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.createUsers(data.users)}
                            </tbody>
                        </table>
                    }}
                </Query>
            }}
        </User>
    }
}