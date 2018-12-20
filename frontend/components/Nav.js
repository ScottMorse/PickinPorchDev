import React, { Component } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import User from './User'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

export default class Nav extends Component {

    state = {
        windowW: null
    }

    componentDidMount(){
        this.setState({windowW: window.innerWidth})
        window.addEventListener('resize',this.resizeWindow)
    }

    resizeWindow = debounce(() => {
        this.setState({windowW: window.innerWidth})
    },100)

    render(){
        return  <User>
        {(data) => {
            const { currentUser } = data.data
            return this.state.windowW <= 768 ? <MobileNav currentUser={currentUser}/> : <DesktopNav currentUser={currentUser}/>
        }}
        </User>
    }
}