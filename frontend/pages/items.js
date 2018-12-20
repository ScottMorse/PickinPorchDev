import { Component } from 'react'
import Items from '../components/Items'

export default class Home extends Component {
    render(){
        return (
            <div>
                <Items page={this.props.query.page || 1}/>
            </div>
        )
    }
}