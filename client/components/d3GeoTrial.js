import * as topojson from "topojson-client"
import React, { Component } from 'react'
import * as d3 from 'd3'
import allRoutes from '../../allRoutes'
import allStops from '../../allStops'


export default class CongressionalDistricts extends Component {
    constructor(props) {
      super(props)
      this.state = {
        nycBoroughs: null
      }
    }

    componentWillMount() {
        d3.queue()
          .defer(d3.json, "https://raw.githubusercontent.com/bsmithgall/bsmithgall.github.io/master/js/json/nyc-boroughs.topojson")
          .await((error, nycBoroughs) => {
              this.setState({
                  nycBoroughs
              });
          })
    }

    componentDidUpdate() {
        console.log(allStops.features)
        const svg = d3.select(this.refs.anchor),
              { width, height } = this.props;

        const projection = d3.geoMercator()
          .center([-73.94, 40.70])
          .scale(150000)
          .translate([width / 2, height / 2])

        const path = d3.geoPath(projection);

        const nycBoroughs = this.state.nycBoroughs;

        svg.append("g")
           .attr("id", "nycBoroughs")
           .selectAll("path")
           .data(topojson.feature(nycBoroughs, nycBoroughs.objects["nyc-borough-boundaries-polygon"]).features)
           .enter().append("path")
           .attr("d", path)
           .style('fill', "white")

        svg.append("g")
           .attr("id", "routes")
           .selectAll("path")
           .data(this.props.singleRoute)
           .enter().append("path")
           .attr("d", path)
           .style('stroke', '#FF6319')

        svg.append("g")
          .attr("id", "stops")
          .selectAll("path")
          .data(this.props.singleTrainStops)
          .enter().append("circle")
          .attr("r", 2)
          .attr("cx", function(d) {return projection(d.geometry.coordinates)[0]})
          .attr("cy", function(d) {return projection(d.geometry.coordinates)[1]})
 
    }

    render() {


        const { nycBoroughs } = this.state;

        if (!nycBoroughs) {
            return null;
        }

        return <g ref="anchor" />;
    }
}
