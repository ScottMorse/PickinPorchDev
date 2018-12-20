import React, { Component } from 'react'
import SingleItem from '../components/SingleItem'

export default class ItemPage extends Component {
    render(){
        return <SingleItem {...this.props}/>
    }
}