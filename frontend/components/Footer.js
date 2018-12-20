import React, { Component } from 'react'
import styled from 'styled-components'

const StyledFooter = styled.div`
    height: 200px;
    margin-top: 100px;
    background: lightgrey;
    color: darkslategray;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    & > * {
        margin: 5px;
    }
    #links {
        display: flex;
        justify-content: center;
        font-size: 30px;
        a {
            transition: filter 0.35s ease;
            display: flex;
            justify-content: center;
            color: darkslategray;
            filter: invert(0) brightness(1);
        }
        a:hover {
            filter: invert(1) brightness(2);
        }
        img {
            margin-left: 5px;
        }
    }
`

export default class Footer extends Component {

    render(){
        return <StyledFooter id="footer">
            <div id="links">
                <a target="_blank" href="https://github.com/ScottMorse/Pickin-Porch">
                    GitHub <img src='/static/imgs/github.png'/>
                </a>
            </div>
            <div id="copy">© 2018 Scott Morse</div>
            <div id="test">This is a prototype website only.  
                It will not charge any credit card.
            </div>
        </StyledFooter>
    }
}