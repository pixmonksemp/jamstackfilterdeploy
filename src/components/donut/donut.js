import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GENERIC_COLOR_CODES } from '../../common/common-constants'
import './style.scss'
import { getOrgSpecificColorCode } from '../util/common-util'

let genricColorCode = []

const mapStateToProps = (state) => {
    return {
        getFilterDataValue: state.stateData.getFilterdata
    }
}
class Donut extends Component {
    static propTypes = {
        value: PropTypes.number, // value the chart should donutchart-trackshow
        valuelabel: PropTypes.string, // label for the chart
        color: PropTypes.bool,
        size: PropTypes.number, // diameter of chart
        strokewidth: PropTypes.number, // width of chart line
        strokecolor: PropTypes.string,
        donutTextColor: PropTypes.string,
        donutTextSize: PropTypes.string,
        percentage: PropTypes.bool,
        usd: PropTypes.bool,
        textSize: PropTypes.bool,
        textSizeContentQuality: PropTypes.bool,
        contentQuality: PropTypes.bool,
        style: PropTypes.bool,
        xAxis: PropTypes.number,
        yAxis: PropTypes.number,
        modulename: PropTypes.string
    }
    static defaultProps = {
        value: 0,
        valuelabel: '',
        color: false,
        size: 182,
        strokewidth: 10,
        donutTextSize: '22px',
        percentage: false,
        usd: false,
        contentQuality: false,
        textSizeContentQuality: false,
        style: false,
        xAxis: 32.5,
        yAxis: 35.5,
        modulename: GENERIC_COLOR_CODES
    }

    render() {
        const { getFilterDataValue, modulename } = this.props
        const halfsize = this.props.size * 0.5
        const radius = halfsize - this.props.strokewidth * 0.5
        const circumference = 2 * Math.PI * radius
        let strokeval
        genricColorCode = getOrgSpecificColorCode(getFilterDataValue, modulename)
        if (this.props.percentage) {
            strokeval = (this.props.value * circumference) / 100
        } else if (this.props.usd) {
            strokeval = (this.props.value * circumference) / 100
        }
        //This method is not used for now maybe use it later
        //  else {
        //     strokeval = (this.props.value * circumference) / 5
        // }

        const dashval = strokeval + ' ' + circumference
        const trackstyle = { strokeWidth: this.props.strokewidth }
        const indicatorstyle = {
            strokeWidth: this.props.strokewidth,
            strokeDasharray: dashval,
            stroke: this.props.strokecolor ? this.props.strokecolor : genricColorCode.length ? genricColorCode[0] : []
        }
        const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')'
        let renderChart
        if (this.props.percentage) {
            renderChart = this.props.style ? (
                <tspan className="donut-text-percent">{'%'}</tspan>
            ) : (
                <tspan style={{ fontSize: this.props.donutTextSize }}>
                    {'%'}
                </tspan>
            )
        } else if (this.props.usd) {
            renderChart = (
                <tspan
                    style={{ fontSize: '25px' }}
                    className="donutchart-text-usd"
                >
                    {' ' + 'USD'}
                </tspan>
            )
        }
        //This method is not used for now maybe use it later
        // else {
        //     renderChart = (
        //         <tspan className="donutchart-text-star">{'\u2605'} </tspan>
        //     )
        // }

        return (
            <div>
                {this.props.color ? (
                    this.props.contentQuality ? (
                        <div>
                            <svg
                                width={this.props.size}
                                height={this.props.size}
                                className="donutchart"
                            >
                                <circle
                                    r={radius}
                                    cx={halfsize}
                                    cy={halfsize}
                                    transform={rotateval}
                                    style={trackstyle}
                                    className="donutchart-track-true"
                                />

                                <circle
                                    r={radius}
                                    cx={halfsize}
                                    cy={halfsize}
                                    transform={rotateval}
                                    style={indicatorstyle}
                                    className="donutchart-contentQuality-true"
                                />

                                {this.props.textSizeContentQuality ? (
                                    <text
                                        className="donutchart-textsize-contentQuality"
                                        x={80}
                                        y={89}
                                        style={{ textAnchor: 'middle' }}
                                    >
                                        <tspan className="donutchart-textsize-val-contentQuality">
                                            {this.props.value}
                                        </tspan>
                                        {renderChart}
                                        <tspan
                                            className="donutchart-textsize-label-contentQuality"
                                            x={halfsize}
                                            y={halfsize + 10}
                                        >
                                            {this.props.valuelabel}
                                        </tspan>
                                    </text>
                                ) : (
                                    <text
                                        x={this.props.xAxis}
                                        y={this.props.yAxis}
                                        style={{
                                            textAnchor: 'middle',
                                            fontFamily: 'Barlow-Medium',
                                            fill: this.props.donutTextColor
                                        }}
                                    >
                                        <tspan
                                            style={{
                                                fontSize: this.props
                                                    .donutTextSize
                                            }}
                                        >
                                            {this.props.value}
                                        </tspan>
                                        {renderChart}
                                        <tspan
                                            className="donutchart-text-label"
                                            x={halfsize}
                                            y={halfsize + 10}
                                        >
                                            {this.props.valuelabel}
                                        </tspan>
                                    </text>
                                )}
                            </svg>
                        </div>
                    ) : (
                        <div>
                            <svg
                                width={this.props.size}
                                height={this.props.size}
                                className="donutchart"
                            >
                                <circle
                                    r={radius}
                                    cx={halfsize}
                                    cy={halfsize}
                                    transform={rotateval}
                                    style={trackstyle}
                                    className="donutchart-track-true"
                                />

                                <circle
                                    r={radius}
                                    cx={halfsize}
                                    cy={halfsize}
                                    transform={rotateval}
                                    style={indicatorstyle}
                                    className="donutchart-indicator-true"
                                />

                                {this.props.textSize ? (
                                    <text
                                        className="donutchart-textsize"
                                        x={105}
                                        y={110}
                                        style={{ textAnchor: 'middle' }}
                                    >
                                        <tspan className="donutchart-textsize-val">
                                            {this.props.value}
                                        </tspan>
                                        {renderChart}

                                        <tspan
                                            className="donutchart-textsize-label"
                                            x={halfsize}
                                            y={halfsize + 10}
                                        >
                                            {this.props.valuelabel}
                                        </tspan>
                                    </text>
                                ) : (
                                    <text
                                        x={this.props.xAxis}
                                        y={this.props.yAxis}
                                        style={{
                                            textAnchor: 'middle',
                                            fontFamily: 'Barlow-Medium',
                                            fill: this.props.donutTextColor ? this.props.donutTextColor : genricColorCode.length ? genricColorCode[0] : []
                                        }}
                                    >
                                        <tspan
                                            style={{
                                                fontSize: this.props
                                                    .donutTextSize
                                            }}
                                        >
                                            {this.props.value}
                                        </tspan>
                                        {renderChart}

                                        <tspan
                                            className="donutchart-text-label"
                                            x={halfsize}
                                            y={halfsize + 10}
                                        >
                                            {this.props.valuelabel}
                                        </tspan>
                                    </text>
                                )}
                            </svg>
                        </div>
                    )
                ) : (
                    <div>
                        <svg
                            width={this.props.size}
                            height={this.props.size}
                            className="donutchart"
                        >
                            <circle
                                r={radius}
                                cx={halfsize}
                                cy={halfsize}
                                transform={rotateval}
                                style={trackstyle}
                                className="donutchart-track"
                            />
                            <circle
                                r={radius}
                                cx={halfsize}
                                cy={halfsize}
                                transform={rotateval}
                                style={indicatorstyle}
                                className="donutchart-indicator"
                            />

                            <text
                                x={this.props.xAxis}
                                y={this.props.yAxis}
                                style={{
                                    textAnchor: 'middle',
                                    fontFamily: 'Barlow-Medium',
                                    fill: this.props.donutTextColor ? this.props.donutTextColor : genricColorCode.length ? genricColorCode[0] : []
                                }}
                            >
                                <tspan
                                    style={{ fontSize: this.props.donutTextSize }}
                                >
                                    {this.props.value}
                                </tspan>
                                {renderChart}
                                <tspan
                                    className="donutchart-text-label"
                                    x={halfsize}
                                    y={halfsize + 20}
                                >
                                    {this.props.valuelabel}
                                </tspan>
                            </text>
                        </svg>
                    </div>
                )}
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Donut)