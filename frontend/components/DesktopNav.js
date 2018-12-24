import React, { Component } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const StyledNav = styled.div`
    display: flex;
    align-items: flex-end;
    margin-top: -1em;
    margin-left: 10px;
    & > * {
        margin-right: 10px;
    }
    z-index: 10;
`
const NavA = styled.a`
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 0;
    padding: 1px 4px 0 4px;
    border-radius: 10% 10% 0 0 / 20% 20% 0 0;
    background: ${props => props.theme.black};
    color: whitesmoke;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    &:hover{
        cursor: pointer;
    }
`

export default class DesktopNav extends Component {

    render(){
        if(!this.props) return <span></span>
        const { currentUser } = this.props
        return <StyledNav>
            <Link href="../items">
                <NavA>{currentUser ? currentUser.isVendor ? "VIEW " :"" :"VIEW "}SHOP</NavA>
            </Link>
            {currentUser ?
                !currentUser.isVendor ? <Link href="/orders">
                    <NavA>MY ORDERS</NavA>
                </Link> : ""
                : ""
            }
            {currentUser ?
                currentUser.isVendor ? <Link href="/myproducts">
                    <NavA>MY PRODUCTS</NavA>
                </Link> : ""
                : ""
            }
            {currentUser ?
                currentUser.isVendor ? <Link href="/sales">
                    <NavA>MY SALES</NavA>
                </Link> : ""
                : ""
            }
            {currentUser ?
                <Link href="/account" prefetch>
                    <NavA>ACCOUNT</NavA>
                </Link>
                : ""
            }
        </StyledNav>
    }
}