import React, { Component } from 'react'
import Downshift from 'downshift'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import { SEARCH_ITEMS_QUERY } from '../graphql/queries'

const StyledAutocom = styled.div`
    .drop-down::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 5px;
    }
    .drop-down::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0,0,0,0.5);
        /* -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5); */
    }
    #search {
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        font-size: 20px;
        height: 30px;
        width: 250px;
        @media screen and (max-width: 480px){
            width: 160px;
            margin-left: -10px;
            font-size: 18px;
        }
    }
    .drop-down{
        display: ${({resultsHidden}) => resultsHidden ? 'none' : 'flex'};
        flex-direction: column;
        position: absolute;
        z-index: 10;
        background-color: whitesmoke;
        max-height: 200px;
        overflow-y: scroll;
        font-size: 20px;
        user-select: none;
        border: 1px solid gray;
        font-weight: bold;
        box-shadow: 2px 5px 15px -2px rgba(0,0,0,0.4);
        @media screen and (max-width: 480px){
            margin-left: -10px;
            font-size: 18px;
        }
    }
`

const SearchItem = styled.div`
    background-color: ${({highlighted}) => highlighted ? "lightsteelblue" : "none"};
    border-top: 2px solid lightgrey;
    border-right: none;
    border-left: none;
    padding-right: 10px;
    font-weight: normal;
    color: blue;
    white-space: nowrap;
    &:hover{
        cursor: pointer;
    }
    &:not(:last-child){
        border-bottom: none;
    }
`

const emptyRegex = new RegExp(/^[\s]*$/)

export default class AutoComplete extends Component {

    state = {
        items: [],
        loading: false,
        resultsHidden: false
    }

    componentDidMount(){
        window.addEventListener('click',this.clickOutside)
    }

    clickOutside = (e) => {
        if(!e.target.classList.contains('drop')){
            this.setState({resultsHidden: true})
        }
        else{
            this.setState({resultsHidden: false})
        }
    }

    routeToItem = (item) => {
        Router.push({
            pathname: '/itempage',
            query: { id: item.id }
        })
    }

    handleChange = debounce(async (e,client) => {
        this.setState({loading: true})
        if(e.target.value.match(emptyRegex)){
            this.setState({items:[]})
            return
        }
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchQ: e.target.value }
        })
        this.setState({
            items: res.data.items,
            loading: false
        })
    },500)

    render(){
        return <StyledAutocom resultsHidden={this.state.resultsHidden}>
            <Downshift onChange={this.routeToItem} itemToString={item => (item === null ? "" : item.title)}>
                {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
                    <div>
                        <ApolloConsumer>
                        {(client) => (
                            <input id="search" type="search" {...getInputProps({
                                type: "search",
                                placeholder: "Search products",
                                id: "search",
                                className: "drop", 
                                onChange: (e) => {
                                    e.persist()
                                    this.handleChange(e,client)
                                }
                            })}/>
                        )}
                        </ApolloConsumer>
                        <div className="drop-down drop">
                            {this.state.items.length > 0 ? <div className="search-item drop">Search results:</div> : ""}
                            {this.state.loading ? <div className="search-item drop">Searching...</div> : this.state.items.map((item,i) => {
                                return <SearchItem {...getItemProps({item})} key={i} highlighted={i === highlightedIndex} className="search-item drop">
                                    <div className="drop">{item.title}</div>
                                </SearchItem>
                            })}
                        </div>
                    </div>
                )}
            </Downshift>
        </StyledAutocom>
    }
}