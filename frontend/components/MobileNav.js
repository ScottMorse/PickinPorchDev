import React, { Component } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import debounce from 'lodash.debounce'
import Logout from './Logout'

const StyledMobileNav = styled.div`
    #menu-button{
        position: fixed;
        font-size: 18px;
        background: rgba(251, 251, 251, 0.5);
        padding: 5px;
        border-radius: 10%;
        box-shadow: 2px 3px 10px -2px rgba(0,0,0,0.3);
        z-index: 10;
    }
    #menu {
        transform: ${props => props.open ? "translateX(0)":"translateX(-120vw)"};
        margin: 0;
        transition: transform 0.5s ease;
        height: 100vh;
        width: 100vw;
        position: fixed;
        background: white;
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: center;
        & * {
            z-index: 12;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
        }
        #bckg-mask{
            position: absolute;
            height: inherit;
            width: inherit;
            background-image: url('/static/imgs/hero.jpeg');
            background-size: cover;
            background-position: -30vh 10vh;
            background-repeat: no-repeat;
            opacity: 0.75;
            filter: brightness(1.2) contrast(1.3);
        }
        #inner-menu{
            background: rgba(255,255,255,0.4);
            box-shadow: 2px 3px 15px -2px rgba(0,0,0,0.4);
            border-radius: 10%;
            margin-top: 10vh;
            padding: 20px;
        }
        #x-button {
            align-self: flex-start;
            font-size: 40px;
            margin-left: 10px;
            margin-top: 5px;
            color: white;
            background: skyblue;
            border-radius: 50%;
            width: 50px;
        }
        h1{
            font-family: "Rye";
            font-size: 25px;
            margin-top: 0;
            margin-bottom: 5px;
            text-align: center;
        }
        h2 {
            font-family: "Rye";
            font-size: 30px;
            margin-top: 50px;
            margin-bottom: 5px;
            text-align: center;
        }
        h3 {
            font-family: "Rye";
            font-size: 16px;
            margin-top: 0;
            text-align: center;
        }
        #user {
            display: flex;
            flex-direction: column;
            font-weight: bold;
            align-items: center;
            font-size: 22px;
            div {
                display: flex;
                align-items: center;
                a,button {
                    margin-right: 10px;
                    font-size: 22px;
                    font-weight: bold;
                    padding: 0 6px 0 6px;
                    height: 30px;
                    background-color: deepskyblue !important;
                    box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.3);
                    color: whitesmoke;
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
                }
                a {
                    padding-bottom: 5px;
                    padding-top: 1px;
                }
            }
        }
        #links {
            display: flex;
            flex-direction: column;
            text-align: center;
            a {
                font-size: 22px;
                margin-top: 20px;
                background-color: mintcream;
                box-shadow: 0px 2px 15px -2px rgba(0,0,0,0.3);
            }
        }
    }
`

const nonDigRegEx = new RegExp(/[^-\d]/,'g')

export default class MobileNav extends Component {

    state = {
        open: false
    }

    componentDidMount(){
        const menu = document.getElementById('menu')
        const menuButton = document.getElementById('menu-button')
        menu.style.marginTop = -menu.offsetTop + "px"
        menuButton.style.marginTop = -menuButton.offsetTop + 5 + "px"
        menuButton.style.marginLeft = -menuButton.offsetLeft + 5 + "px"
        window.addEventListener('resize',()=>{this.repositionMenu(menu);this.repositionButton(menuButton)})
        document.querySelectorAll('.menu-link').forEach(link => link.addEventListener('click',this.closeMenu))
    }

    repositionMenu = debounce((menu) => {
        const currMargTop = parseInt(menu.style.marginTop.replace(nonDigRegEx,''))
        menu.style.marginTop = currMargTop - menu.offsetTop + "px"
    },100)

    repositionButton = debounce((menuButton) => {
        const currMargTop = parseInt(menuButton.style.marginTop.replace(nonDigRegEx,''))
        const currMargLeft = parseInt(menuButton.style.marginLeft.replace(nonDigRegEx,''))
        menuButton.style.marginTop = currMargTop - (menuButton.offsetTop - 5) + "px"
        menuButton.style.marginLeft = currMargLeft - (menuButton.offsetLeft - 5) + "px"
    },100)

    showMenu = () => {
        this.setState({open: true})
    }
    
    closeMenu = () => {
        this.setState({open: false})
    }

    render(){
        const { currentUser } = this.props
        return <StyledMobileNav open={this.state.open}>
            <button id="menu-button" onClick={this.showMenu}>☰ Menu</button>
            <div id="menu">
                <div id="bckg-mask"></div>
                <button id="x-button" onClick={this.closeMenu}>X</button>
                <h2>Pickin' Porch</h2>
                <h3>Quality Gear for Quality Players</h3>
                <span id="inner-menu">
                    <h1>Menu</h1>
                { currentUser ? <div id="user">{currentUser.name} {currentUser.isVendor?"(vendor)":""}
                    <div className="menu-link">
                        <Link href="/account">
                            <a className="auth-button menu-link">Account</a>
                        </Link>
                        <Logout/>
                    </div>
                </div>
                : <div id="user">
                    <div className="menu-link">
                        <Link href="/login">
                            <a className="auth-button menu-link">Login</a>
                        </Link>
                        <Link href="/signup">
                            <a className="auth-button menu-link">Sign Up</a>
                        </Link>
                    </div>
                </div>}
                { currentUser ?
                  currentUser.isVendor ? 
                  <div id="links" className="menu-link">
                    <Link href="/myproducts">
                        <a className="auth-button menu-link">My Products</a>
                    </Link>
                    <Link href="/sales">
                        <a className="auth-button menu-link">My Sales</a>
                    </Link>
                  </div>
                  : <div id="links" className="menu-link">
                        <Link href="/orders">
                            <a className="auth-button menu-link">My Orders</a>
                        </Link>
                  </div>
                  : ""}</span>
            </div>
        </StyledMobileNav>
    }
}