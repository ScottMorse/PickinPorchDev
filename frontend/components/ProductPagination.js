import React, { Component } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const StyledPaginator = styled.div`
    display: flex;
    justify-content: center;
    & > * {
        width: 82px;
        padding: 3px;
    }
    .wrapper{
        border: 2px solid lightgray;
    }
    .wrapper:first-child{
        border-right: none;
    }
    .wrapper:last-child{
        border-left: none;
    }
`

export default class ProductPagination extends Component {
    render(){
        const page = this.props.page
        const pages = this.props.pages
        return <StyledPaginator>
                    <span className="wrapper"><Link prefetch href={{
                        pathname: 'myproducts',
                        query: { page: parseInt(page) - 1}
                    }}>
                        <a style={{
                            visibility: page > 1 ? 'unset':'hidden'
                        }}>Prev</a>
                    </Link></span>
                    <span className="wrapper"><div>Page {page} / {pages}</div></span>
                    <span className="wrapper"><Link prefetch href={{
                        pathname: 'myproducts',
                        query: { page: parseInt(page) + 1}
                    }}>
                        <a style={{
                            visibility: page < pages ? 'unset':'hidden'
                        }}>Next</a>
                    </Link></span>
            </StyledPaginator>
    }
}