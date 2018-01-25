import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
//import { LineChart } from 'rd3'

class Axis extends React.Component {
    componentDidUpdate () { this.renderAxis(); }
    componentDidMount () { this.renderAxis(); }
    renderAxis () {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.axis);

    }
    render () {

        var translate = 'translate(0,"+(this.props.h)+")';

        return (
            <g className="axis" transform={this.props.axisType=='x'?translate:""} >
            </g>
        );
    }

}

class Grid extends React.Component {
    componentDidUpdate () { this.renderGrid() }
    componentDidMount () { this.renderGrid() }
    renderGrid() {
        var node = ReactDOM.findDOMNode(this)
        d3.select(node).call(this.props.grid)
    }
    render () {
        var translate = "translate(0,"+(this.props.h)+")"
        return (
            <g className="y-grid" transform={this.props.gridType === 'x' ? translate : ""} />
        )
    }
}


class Dots extends React.Component { 
    render () {

        let _self = this

        //remove last & first point
        let data = this.props.data

        let circles = data.map(function(d, i){
            return (<circle
                        className="dot" r="7" cx={_self.props.x(d.long)} cy={_self.props.y(d.lat)} fill="#7dc7f4"
                        stroke="#3f5175" strokeWidth="5px" key={i}
                    />)
        })

        return (
            <g>
                {circles}
            </g>
        );
    }
}


class LineChart extends React.Component {
    constructor(props) {
      super(props);
      this.setState = this.setState.bind(this)
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
    	console.log(this.props.stopData)

        let margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.props.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);


        let x = d3.scale.linear()
            .domain([-74.1,d3.max(this.props.orderData,function(d){
                return d.long
            })])
            .range([0, w])


        var y = d3.scale.linear()
            .domain([40.6,d3.max(this.props.orderData,function(d){
                return d.lat;
            })])
            .range([h, 0]);

        var line = d3.svg.line()
            .x(function (d) {
                return x(d.long);
            })
            .y(function (d) {
                return y(d.lat);
            })

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickValues(this.props.orderData.map(function(d,i){
                if(i>0)
                    return d.long;
            }).splice(1))
            .ticks(4);

        var xGrid = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(5)
            .tickSize(-h, 0, 0)
            .tickFormat("");


        var yGrid = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5)
            .tickSize(-w, 0, 0)
            .tickFormat("");

        let transform = 'translate(' + margin.left + ',' + margin.top + ')';
        return (
            <div>
                <svg id={this.props.chartId} width={this.props.width} height={this.props.height}>

                    <g transform={transform}>

                        <Grid h={h} grid={yGrid} gridType="y"/>
                        <Grid h={h} grid={xGrid} gridType="x"/>

                   { /*<Axis h={h} axis={yAxis} axisType="y" />
                                       <Axis h={h} axis={xAxis} axisType="x"/>
                   */}
                        <path stroke="green" d={line(this.props.orderData)} fill="none"/>

                        <Dots data={this.props.orderData} x={x} y={y} />

                    </g>
                </svg>
            </div>
      )
    }
  }


const SalesLineChart = (props) => {
    console.log("yo", props.stopData)
    return (
        <div>
            <h3>G train
            </h3>
            <div className="bottom-right-svg">
                <LineChart orderData={props.stopData} />
            </div>
        </div>
    )
}

module.exports = SalesLineChart

//PropsTypes
LineChart.propTypes = {
	width: PropTypes.number,
    height: PropTypes.number,
    chartId: PropTypes.string
}

LineChart.defaultProps = {
    width: 1280,
    height: 1280,
    chartId: 'v1_chart'
}


Axis.propTypes = {
    h: PropTypes.number,
    axis: PropTypes.func,
    axisType: PropTypes.oneOf(['x','y'])
}

Grid.propTypes = {
    h: PropTypes.number,
    grid: PropTypes.func,
    gridType: PropTypes.oneOf(['x','y'])
}

Dots.propTypes = {
    data: PropTypes.array,
    x: PropTypes.func,
    y: PropTypes.func

}