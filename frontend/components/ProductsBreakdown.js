import React, { Component } from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const StyledBreakdown = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    & > * {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .current-month,.previous-month {
        margin-top: -5px;
        font-weight: bold;
    }
    h2{
        font-size: 35px;
        margin: 40px 0 0 0;
    }
    h3{
        margin-bottom: 5px;
    }
`

const monthNames = [
    "Jan","Feb","March",
    "April","May","June",
    "July","August","September",
    "October","November","December"
]

export default class ProductsBreakdown extends Component {
    render(){
        const { productTotals } = this.props
        if(!productTotals) return <p>No sales data to show yet.</p>

        const productTotalsArr = Object.values(productTotals).slice()

        productTotalsArr.sort((a,b) => a.units > b.units ? -1:1)
        const topSellers = productTotalsArr.slice(0,productTotalsArr.length >= 3 ? 3:productTotals.length)
        
        productTotalsArr.sort((a,b) => a.profits > b.profits ? -1:1)
        
        const topProfits = productTotalsArr.slice(0,productTotalsArr.length >= 3 ? 3:productTotals.length)

        const today = new Date()
        const currentMonth = today.getMonth() + ":" + today.getFullYear()
        const previousMonth = currentMonth[0] !== "0" ? 
            today.getMonth() - 1 + ":" + today.getFullYear()
            : "11:" + today.getFullYear() - 1
        const currentMonthString = monthNames[today.getMonth()] + " " + today.getFullYear()
        const previousMonthString = currentMonth[0] !== "0" ?
            monthNames[today.getMonth() - 1] + " " + today.getFullYear()
            : "December " + (today.getFullYear() - 1)

        const currentMonthTotals = productTotalsArr.filter(product => {
            return product.months[currentMonth]
        })
        const previousMonthTotals = productTotalsArr.filter(product => {
            return product.months[previousMonth]
        })

        currentMonthTotals.sort((a,b) => a.months[currentMonth].units > b.months[currentMonth].units ? -1:1)
        const currentMonthTopSellers = currentMonthTotals.slice(0,currentMonthTotals.length >= 3 ? 3:currentMonthTotals.length)

        currentMonthTotals.sort((a,b) => a.months[currentMonth].profits > b.months[currentMonth].profits ? -1:1)
        const currentMonthTopProfits = currentMonthTotals.slice(0,currentMonthTotals.length >= 3 ? 3:currentMonthTotals.length)

        previousMonthTotals.sort((a,b) => a.months[previousMonth].units > b.months[previousMonth].units ? -1:1)
        const previousMonthTopSellers = previousMonthTotals.slice(0,previousMonthTotals.length >= 3 ? 3:previousMonthTotals.length)

        previousMonthTotals.sort((a,b) => a.months[previousMonth].profits > b.months[previousMonth].profits ? -1:1)
        const previousMonthTopProfits = previousMonthTotals.slice(0,previousMonthTotals.length >= 3 ? 3:previousMonthTotals.length)

        return <StyledBreakdown>
            <h2>Your Data:</h2>
            <div id="top-sellers">
                <h3>Best selling products of all time (by quantity):</h3>
                <div className="top-products">
                    {topSellers.map((product,i) => {
                        return <div key={product.id} className="product">
                            {i+1}: <Link href={{
                                        pathname: '/itempage',
                                        query: { id: product.id }
                                    }}>
                                        <a>{product.title}</a>
                                    </Link> ({product.units} sold)
                        </div>
                    })}
                </div>
            </div>
            <div id="top-profits">
                <h3>Top products of all time by revenue:</h3>
                <div className="top-products">
                    {topProfits.map((product,i) => {
                        return <div key={product.id} className="product">
                            {i+1}: <Link href={{
                                        pathname: '/itempage',
                                        query: { id: product.id }
                                    }}>
                                        <a>{product.title}</a>
                                    </Link> (${(product.profits / 100).toFixed(2)} total)
                        </div>
                    })}
                </div>
            </div>
            {currentMonthTopSellers.length ? 
            <div id="top-sellers-current">
                <h3>Your best sellers this month:</h3>
                <div className="current-month">{currentMonthString}</div>
                <div className="top-products">
                    {currentMonthTopSellers.map((product,i) => {
                        return <div key={product.id} className="product">
                            {i+1}: <Link href={{
                                        pathname: '/itempage',
                                        query: { id: product.id }
                                    }}>
                                        <a>{product.title}</a>
                                    </Link> ({product.months[currentMonth].units} sold)
                        </div>
                    })}
                </div>
            </div>
            :""}
            {currentMonthTopProfits.length ? 
            <div id="top-profits-current">
                <h3>Your best revenue-generating products this month:</h3>
                <div className="current-month">{currentMonthString}</div>
                <div className="top-products">
                    {currentMonthTopProfits.map((product,i) => {
                        return <div key={product.id} className="product">
                            {i+1}: <Link href={{
                                        pathname: '/itempage',
                                        query: { id: product.id }
                                    }}>
                                        <a>{product.title}</a>
                                    </Link> (${(product.months[currentMonth].profits / 100).toFixed(2)} total)
                        </div>
                    })}
                </div>
            </div>
            :""}
            {previousMonthTopSellers.length ? 
            <div id="top-sellers-previous">
                <h3>Your best sellers last month:</h3>
                <div className="previous-month">{previousMonthString}</div>
                <div className="top-products">
                    {previousMonthTopSellers.map((product,i) => {
                        return <div key={product.id} className="product">
                            {i+1}: <Link href={{
                                        pathname: '/itempage',
                                        query: { id: product.id }
                                    }}>
                                        <a>{product.title}</a>
                                    </Link> ({product.months[previousMonth].units} sold)
                        </div>
                    })}
                </div>
            </div>
            :""}
            {previousMonthTopProfits.length ? 
            <div id="top-profits-previous">
                <h3>Your best revenue-generating products last month:</h3>
                <div className="previous-month">{previousMonthString}</div>
                <div className="top-products">
                    {previousMonthTopProfits.map((product,i) => {
                        return <div key={product.id} className="product">
                            {i+1}: <Link href={{
                                        pathname: '/itempage',
                                        query: { id: product.id }
                                    }}>
                                        <a>{product.title}</a>
                                    </Link> (${(product.months[previousMonth].profits / 100).toFixed(2)} total)
                        </div>
                    })}
                </div>
            </div>
            :""}
        </StyledBreakdown>
    }
}