import React, { Component } from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import { ORDER_ITEMS_QUERY } from '../graphql/queries'

import User from './User'
import ProductsBreakdown from './ProductsBreakdown'

const StyledSalesData = styled.div`
    h1{
        font-family: "Rye";
        text-align: center;
        font-size: 40px;
    }
`

let CanvasJS, CanvasJSChart
export default class ItemSalesData extends Component {

    state = {
        loaded: false
    }

    componentDidMount(){
        const canvasjs = require('../utils/canvasjs.react')
        CanvasJS = canvasjs.CanvasJS
        CanvasJSChart = canvasjs.CanvasJSChart
        this.setState({loaded: true})
    }

    render(){
        return <User>
        {(data) => {
            const { currentUser } = data.data
            if(!currentUser) return ""
            if(!currentUser.isVendor) return ""
            return <Query query={ORDER_ITEMS_QUERY} variables={{userId: currentUser.id}}>
                {({data,error,loading})=>{
                    if(error) return <p>Oops! Something went wrong!</p>
                    if(loading) return <div>Loading...<div className="spinner-icon"></div></div>
                    const { orderItems } = data
                    const currentMonth = new Date().getMonth() + 1
                    const currentYear = new Date().getFullYear()
                    const dates = [...Array(12).keys()].map(num => {
                        let newMonth = num + currentMonth
                        newMonth = newMonth < 12 ? newMonth : newMonth - 12
                        return new Date(
                            newMonth <= currentMonth - 1 ? currentYear : currentYear - 1,
                            newMonth,
                            1
                        )
                    })
                    let unitsSold = dates.map(date => {return {x: date,y: 0}})
                    let profits = dates.map(date => {return {x: date,y: 0}})
                    let unitMax = 0
                    let profitMax = 0
                    const productTotals = {}
                    orderItems.forEach(orderItem => {
                        const productTotal = productTotals[orderItem.item.id]
                        const orderDate = new Date(Date.parse(orderItem.order.datePlaced))
                        const monthPlaced = orderDate.getMonth()
                        const yearPlaced = orderDate.getFullYear()
                        if(productTotal){
                            productTotal.units += orderItem.quantity
                            productTotal.profits += orderItem.quantity * orderItem.price
                            const relevantMonth = productTotal.months[monthPlaced + ":" + yearPlaced]
                            relevantMonth.units += orderItem.quantity
                            relevantMonth.profits += orderItem.quantity * orderItem.price
                        }
                        else{
                            productTotals[orderItem.item.id] = {
                                id: orderItem.item.id,
                                title: orderItem.title,
                                months: {
                                    [monthPlaced + ":" + yearPlaced]: {
                                        units: orderItem.quantity,
                                        profits: orderItem.price * orderItem.quantity
                                    }
                                },
                                units: orderItem.quantity,
                                profits: orderItem.price * orderItem.quantity
                            }
                        }
                        let monthIndex = monthPlaced - currentMonth
                        if(monthIndex < 0) monthIndex += 12
                        if(unitsSold[monthIndex].x.getFullYear() === yearPlaced){
                            unitsSold[monthIndex].y += orderItem.quantity
                            profits[monthIndex].y += orderItem.quantity * (orderItem.price / 100)
                        }
                    })
                    unitsSold.forEach(monthData => {
                        if(monthData.y > unitMax) unitMax = monthData.y
                    })
                    profits.forEach(monthData => {
                        if(monthData.y > profitMax) profitMax = monthData.y
                    })
                    const profitMaxY = profitMax?
                        parseInt('1' + '0'.repeat((''+parseInt(profitMax)).length)) : 100
                    const profitIntvlY = profitMaxY / 10
                    const options = {
                                theme: "light2",
                                animationEnabled: true,
                                title:{
                                    text: "Your Total Sales"
                                },
                                subtitles: [{
                                    text: "Past Year"
                                }],
                                axisX: {
                                    title: "Month",
                                    labelFontColor: "navy",
                                    titleFontColor: "navy"
                                },
                                axisY: {
                                    title: "Revenue (USD)",
                                    titleFontColor: "navy",
                                    lineColor: "navy",
                                    labelFontColor: "navy",
                                    tickColor: "navy",
                                    includeZero: true,
                                    minimum: 0,
                                    maximum: profitMaxY,
                                    interval: profitIntvlY
                                },
                                toolTip: {
                                    shared: true
                                },
                                legend: {
                                    cursor: "pointer",
                                    itemclick: this.toggleDataSeries
                                },
                                data: [{
                                    type: "column",
                                    name: "Products Sold",
                                    showInLegend: false,
                                    xValueFormatString: "MMM YYYY",
                                    yValueFormatString: "#,##0",
                                    dataPoints: unitsSold,
                                },
                                {
                                    type: "column",
                                    name: "Profit",
                                    showInLegend: false,
                                    xValueFormatString: "MMM YYYY",
                                    yValueFormatString: "$#,##0.#",
                                    dataPoints: profits,
                                    color: "navy"
                                }]
                            }
                    return <StyledSalesData>
                        <h1>{currentUser.company}</h1>
                        {CanvasJS ? <CanvasJSChart options = {options} 
                                        onRef={ref => this.chart = ref}
                                    /> : <div>Loading...<div className="spinner-icon"></div></div>}
                            <ProductsBreakdown productTotals={productTotals}/>
                    </StyledSalesData>
                }}
            </Query>
        }}
        </User>
    }
}