import React, { Component } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import Logo from './Logo'
import Logout from './Logout'
import User from './User'

const StyledLanding = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    opacity: 0;
    background-color: whitesmoke;
    transition: opacity 0.5s ease;
    #background {
        position: absolute;
        width: inherit;
        height: 100vh;
        background-image: url('/static/imgs/hero.jpeg');
        background-position: center;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        box-shadow: 0 0 30px 30px whitesmoke, 0px 50px 50px -50px inset whitesmoke;
        margin: 0;
        filter: brightness(1.1) saturate(1.2);
    }
    & * {
        z-index: 11;
    }
    h1 {
        font-family: "Rye";
        font-size: 65px;
        margin: 20px 0 0 0 ;
        user-select:none;
        text-align: center;
        @media screen and (max-width: 480px){
            font-size: 45px;
            white-space: nowrap;
        }
    }
    h2 {
        font-family: "Rye";
        margin: -2px 0 20px 0;
        font-size: 20px;
        text-align: center;
        @media screen and (max-width: 480px){
            font-size: 16px;
        }
    }
    #links {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255,255,255,0.75);
        box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.4);
        border-radius: 15%;
        height: 200px;
        width: 250px;
        overflow: hidden;
        #welcome-mess{
            margin: -25px 0 10px 0;
            opacity: 0.5;
            color: lightslategray;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
            width: 100%;
            height: 33px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            padding-bottom: 2px;
            text-align: center;
            border-bottom: 1px solid lightgray;
            box-shadow: 0px 2px 10px -2px rgba(0,0,0,0.1);
        }
        #shop{
            margin-bottom: 10px;
            background-color: rgb(115, 230, 0);
            color: mintcream;
        }
        #logs {
            display: flex;
            a {
                color: whitesmoke;
            }
        }
        #welcome-back{
            margin-bottom: 2px;
            text-align: center;
            margin-top: -20px;
            font-size: 20px;
            color: darkslategray;
        }
        #not-you{
            display: flex;
            margin: 2px;
            margin-bottom: -20px;
            align-items: center;
            button {
                margin-left: 5px;
            }
        }
        @media screen and (max-width: 768px){
            position: absolute;
            margin-top: 35vh;
        }
    }
    a {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(77, 148, 255);
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        border-radius: 9%;
        text-align: center;
        white-space: nowrap;
        font-weight: bolder;
        font-size: 18px;
        box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.4);
        width: 100px;
        height: 30px;
        padding: 30px;
        margin: 5px;
    }
    #shop-2{
        margin-bottom: 10px;
        background-color: rgb(77, 148, 255);
        color: whitesmoke;
    }
`

const nonDigRegEx = new RegExp(/[^-\d]/,'g')

export default class Landing extends Component {

    repositionLanding = (el) => {
        const currMargTop = parseInt(el.style.marginTop.replace(nonDigRegEx,''))
        const currMargLeft = parseInt(el.style.marginLeft.replace(nonDigRegEx,''))
        el.style.marginTop = currMargTop - el.offsetTop + "px"
        el.style.marginLeft = currMargLeft - el.offsetLeft + "px"
    }

    componentDidMount(){
        const landing = document.getElementById('landing')
        landing.style.marginLeft = -landing.offsetLeft + "px"
        landing.style.marginTop = -landing.offsetTop + "px"
        landing.style.opacity = 1
        window.addEventListener('resize',()=>this.repositionLanding(landing))
    }

    render() { 
        return <User>
            {data => {
                const { currentUser } = data.data

                return <StyledLanding id="landing">
                    <div id="background"></div>
                    <h1>Pickin' Porch</h1>
                    <h2>Quality Gear for Quality Players</h2>
                    <Logo scale="1.3" viewBox="0 0 300 190"/>
                    {!currentUser ? <div id="links">
                        <p id="welcome-mess">Welcome</p>
                        <Link href="/items">
                            <a id="shop">The Shop</a>
                        </Link>
                        <div id="logs">
                            <Link href="/signup">
                                <a id="sign-up">Sign Up</a>
                            </Link>
                            <Link href="/login">
                                <a id="log-in">Log In</a>
                            </Link>
                        </div>
                    </div>
                    : <div id="links">
                        <p id="welcome-back">Welcome back, <br/> {currentUser.name}!</p>
                        <Link href="/items">
                            <a id="shop-2">Go Shop</a>
                        </Link>
                        <div id="not-you">Not you?  <Logout/></div>
                    </div>
                    }
                </StyledLanding>
            }}
        </User>
    }
}