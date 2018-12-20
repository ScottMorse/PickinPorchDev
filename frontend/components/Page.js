import React, { Component } from 'react'
import Header from '../components/Header'
import Meta from '../components/Meta'
import Footer from '../components/Footer'
import styled, { ThemeProvider, injectGlobal } from 'styled-components'

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans|Rye');
  html{
    font-size: 10px;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  *, *:before, *:after {
      box-sizing: inherit;
  }
  body{
    margin: 0;
    font-size: 1.5rem;
  }
  a {
      text-decoration: none;
      color: blue;
  }
  button, input[type=submit] {
    background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
 }
  }
  .auth-button{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: whitesmoke;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    border-radius: 5% / 20%;
    color: darkslategray;
    border: none;
    text-align: center;
    font-weight: bolder;
    font-size: 16px;
    box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.2);
    margin: 5px auto 0 auto;
    padding: 5px;
  }
  button:hover {
      cursor:pointer;
  }
  .page-transition-enter {
        opacity: 0;
    }
    .page-transition-enter-active {
        opacity: 1;
        transition: opacity 300ms;
    }
    .page-transition-exit {
        opacity: 1;
    }
    .page-transition-exit-active {
        opacity: 0;
        transition: opacity 300ms;
    }
`

const theme = {
    red: '#FF0000',
    black: '#393939',
    blue: '#3576FF',
    grey: '#3A3A3A',
    lightgrey: '#E1E1E1',
    offwhite: '#EDEDED',
    maxWidth: '1000px',
    bs: '0 12px 24px 0 rgba(0,0,0,0.09)',
}

const StyledPage = styled.div`
   font-family: 'Open Sans';
   background: white;
   color: ${props => props.theme.black};
   overflow-x: hidden;
`

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem;
    min-height: 300px;
`

export default class Page extends Component {
    render(){
        return (
            <ThemeProvider theme={theme}>
                <StyledPage>
                    <Meta/>
                    <Header {...this.props.children.props}/>
                    <Inner id="main">
                        {this.props.children} 
                    </Inner>
                    <Footer/>
                </StyledPage>
            </ThemeProvider>
        )
    }
}