import React, { Component } from 'react'

import Router from 'next/router'
import NProgress from 'nprogress'
import Nav from './Nav'
import Link from 'next/link'
import styled from 'styled-components'
import Logo from './Logo'
import AuthArea from './AuthArea'

import Cart from './Cart'
import Search from './Search'

Router.onRouteChangeStart = () => {
    NProgress.start()
}
Router.onRouteChangeComplete = () => {
    NProgress.done()
}
Router.onRouteChangeError = () => {
    NProgress.done()
}

const StyledHeader = styled.header`
    .bar {
        border-bottom: 10px solid ${props => props.theme.black};
        /* border-bottom: 10px solid deepskyblue; */
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-end;
        align-items: stretch;
        width: 100vw;
        @media screen and (max-width: 480px){
            padding-top: 40px;
        }
        #guitars {
            position: absolute;
            width: inherit;
            height: 250px;
            background: url('/static/imgs/guitar1.png') left bottom no-repeat, url('/static/imgs/guitar2.png') right bottom no-repeat;
            background-size: contain;
            background-position: bottom;
            background-repeat: repeat-x;
            opacity: 0.3;
            @media screen and (max-width: 480px){
                opacity: 0.09
            }
            #mask{
                width: 150vw;
                margin-left: -25vw;
                height: inherit;
                background-image: radial-gradient(circle, rgba(255,255,255,1),rgba(255,255,255,0.7), rgba(255,255,255,0)),
                                    linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0));
                @media screen and (max-width: 480px){
                    display: none;
                }
            }
        }
    }
    .sub-bar {
        display: flex;
        height: 50px;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px solid ${props => props.theme.lightgrey};
        padding: 0 20px 0 20px;
        @media screen and (max-width: 768px){
            justify-content: space-between;
        }
        @media (min-width: 1000px){
            padding-left: calc((100vw - 1000px) / 2);
            padding-right: calc((100vw - 1000px) / 2);
        }
        #search{
            display: flex;
        }
    }
`
const StyledTitle = styled.h1`
    font-size: 6rem;
    margin: 0.2em auto 0 auto;
    position: relative;
    z-index: 0;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Rye";
    text-align: center;
    a {
        padding: 0.5rem 1rem;
        color: ${props => props.theme.black};
        font-family: "Rye";
        text-decoration: none;
        margin-top: 0px;
    }
    @media (max-width: 480px){
        margin-bottom: 0.6em;
    }
`

const MenuWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    @media screen and (max-width: 768px){
        justify-content: space-between;
    }
    @media (min-width: 1000px){
        width: 1000px;
        margin-left: auto;
        margin-right: auto;
    }
`

const SearchSpan = styled.span`
    filter: contrast(0) brightness(1.5);
    @media screen and (max-width: 480px){
        margin-left: -10px;
        margin-right: 10px;
    }
`

export default class Header extends Component {
    render(){
        return <StyledHeader>
        <div className="bar">
            <div id="guitars">
                <div id="mask"></div>
            </div>
            <StyledTitle>
                <Link href="/">
                    <a>Pickin' Porch</a>
                </Link>
                <Logo scale="1" viewBox="0 0 300 160"/>
            </StyledTitle>
        <MenuWrapper>
            <Nav/>
            <AuthArea path={this.props.pathname}/>
        </MenuWrapper>
        </div>
        <div className="sub-bar">
            <div id="search"> 
                <SearchSpan>&#x1F50D;</SearchSpan> 
                <Search/>
            </div>
            <Cart/>
        </div>
    </StyledHeader>
    }
}