import React, { Component } from 'react'
import styled from 'styled-components'

const LogoSvg = styled.svg`
    margin-top: -0.2em;
`

const LogoWrapper = styled.div`
    border-radius: 50%;
    overflow: hidden;
    width: 100px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px;
    margin-top: -0.2em;
    transform: scale(${props => props.scale});
`

export default class Logo extends Component {
    render(){
        return <LogoWrapper id="logo" scale={this.props.scale}><LogoSvg width="180" height="90" viewBox={this.props.viewBox}>
        <circle stroke="#000000" transform="" id="circle1" strokeWidth="0px" cy="98px" fill="#393939" r="49px" cx="150px"></circle>
        <circle stroke="#393939" transform="" id="circle2" strokeWidth="5px" cy="98px" fill="none" r="54px" cx="150px"></circle>
        <line stroke="#393939" y1="122px" id="line1" strokeWidth="5px" x1="0px" y2="122px" x2="300px" transform=""></line>
        <line stroke="#393939" y1="82px" strokeWidth="5px" x1="0px" id="line2" y2="82px" x2="300px" transform=""></line>
        <line stroke="#393939" y1="92px" strokeWidth="5px" x1="0px" id="line3" y2="92px" x2="300px" transform=""></line>
        <line stroke="#393939" y1="102px" strokeWidth="5px" x1="0px" id="line4" y2="102px" x2="300px" transform=""></line>
        <line stroke="#393939" y1="112px" strokeWidth="5px" x1="0px" id="line5" y2="112px" x2="300px" transform=""></line>
        <line stroke="#393939" y1="72px" strokeWidth="5px" x1="0px" id="line6" y2="72px" x2="300px" transform=""></line>
    </LogoSvg></LogoWrapper>
    }
}