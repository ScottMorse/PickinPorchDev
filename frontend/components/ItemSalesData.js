import React, { Component } from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import { ORDER_ITEM_SALES_QUERY } from '../graphql/queries'

import User from './User'

const StyledSalesData = styled.div`
    width: 100%;
    margin-top: 50px;
    #data {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        & > * {
            width: 300px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 40px;
            margin-bottom: 10px;
            border: 2px solid ${props => props.theme.black};
            font-size: 18px;
            text-align: center;
            border-radius: 5%/10%;
            box-shadow: 2px 3px 15px -2px rgba(0,0,0,0.3);
            font-weight: bold;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
        }
        .orange {
            border-color: darkorange;
        }
        .blue {
            border-color: navy;
        }
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
            if(!currentUser.saleItems.map(saleItem => saleItem.id).includes(this.props.item.id)) return ""
            return <Query query={ORDER_ITEM_SALES_QUERY} variables={{itemId: this.props.item.id}}>
                {({data,error,loading})=>{
                    if(error) return <p>Oops! Something went wrong!</p>
                    if(loading) return <p>Loading...</p>
                    const { numberSold, totalProfit, orderDatas } = data.orderItemSales
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

                    let allTimeUnits = 0
                    let allTimeProfits = 0
                    let yearUnits = 0
                    let yearProfits = 0

                    let unitMax = 0
                    let profitMax = 0
                    orderDatas.forEach(orderData => {

                        allTimeUnits += orderData.quantity
                        allTimeProfits += orderData.quantity * orderData.price / 100

                        const orderDate = new Date(Date.parse(orderData.datePlaced))
                        let monthIndex = orderDate.getMonth() - currentMonth
                        if(monthIndex < 0) monthIndex += 12
                        if(unitsSold[monthIndex].x.getFullYear() === orderDate.getFullYear()){
                            yearUnits += orderData.quantity
                            unitsSold[monthIndex].y += orderData.quantity
                            yearProfits += orderData.quantity * (orderData.price / 100)
                            profits[monthIndex].y += orderData.quantity * (orderData.price / 100)
                        }
                    })
                    unitsSold.forEach(monthData => {
                        if(monthData.y > unitMax) unitMax = monthData.y
                    })
                    profits.forEach(monthData => {
                        if(monthData.y > profitMax) profitMax = monthData.y
                    })
                    const unitMaxY = unitMax?
                        parseInt('1' + '0'.repeat((''+unitMax).length)) : 100
                    const profitMaxY = profitMax?
                        parseInt('1' + '0'.repeat((''+parseInt(profitMax)).length)) : 100
                    const unitIntvlY = unitMaxY / 10
                    const profitIntvlY = profitMaxY / 10
                    const options = {
                                theme: "light2",
                                animationEnabled: true,
                                title:{
                                    text: "Sales for Your Product"
                                },
                                subtitles: [{
                                    text: this.props.item.title
                                }],
                                axisX: {
                                    title: "Month"
                                },
                                axisY: {
                                    title: "Units Sold",
                                    titleFontColor: "darkorange",
                                    lineColor: "darkorange",
                                    labelFontColor: "darkorange",
                                    tickColor: "darkorange",
                                    includeZero: false,
                                    minimum: 0,
                                    maximum: unitMaxY,
                                    interval: unitIntvlY
                                },
                                axisY2: {
                                    title: "Profit (USD)",
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
                                    name: "Units Sold",
                                    showInLegend: true,
                                    xValueFormatString: "MMM YYYY",
                                    yValueFormatString: "#,##0 Unit(s)",
                                    dataPoints: unitsSold,
                                    color: "darkorange"
                                },
                                {
                                    type: "column",
                                    name: "Profit",
                                    axisYType: "secondary",
                                    showInLegend: true,
                                    xValueFormatString: "MMM YYYY",
                                    yValueFormatString: "$#,##0.#",
                                    dataPoints: profits,
                                    color: "navy"
                                }]
                            }
                    return <StyledSalesData>
                        {CanvasJS ? <CanvasJSChart options = {options} 
                                        onRef={ref => this.chart = ref}
                                    /> : "Loading..."}
                        <div id="data">
                            <div id="total-num" className="orange">
                                Units sold (all time): {allTimeUnits}
                            </div>
                            <div id="total-profits" className="blue">
                                Revenue (all time): ${allTimeProfits}
                            </div>
                            <div id="year-num" className="orange">
                                Units sold (past year): {yearUnits}
                            </div>
                            <div id="year-profits" className="blue">
                                Revenue (past year): ${yearProfits}
                            </div>
                        </div>
                    </StyledSalesData>
                }}
            </Query>
        }}
        </User>
    }
}