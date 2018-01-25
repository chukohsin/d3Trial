import React, { Component } from 'react'
import CongressionalDistricts from './d3GeoTrial'
import allRoutes from '../../allRoutes'
import allStops from '../../allStops'


export default class D3Trial extends Component {
	constructor(props) {
		super(props)
		this.state = {
			targetLine: ""
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit (event) {
		event.preventDefault()
		this.setState({ targetLine: event.target.targetLine.value })
	}


	

	//How about express and local ex. 6/7
	

	render () {
		console.log(this.state)
		const lines = ["1", "2", "3", "4", "5", "6", "7", "A", "C", "E", "B", "D", "F", "M", "J", "Z", "N", "Q", "R", "W", "G", "L", "S"]
		const singleRoute = allRoutes.features.filter(route => route.properties.route_id === this.state.targetLine)
		const singleTrainStops = allStops.features.filter(stop => {
			let stopSet = new Set(stop.properties.Routes_ALL.split(' '))
			return stopSet.has(this.state.targetLine)
		})
		return (
	        <div>
	       		<h1>hello nyc</h1>
	     		<form onSubmit={this.handleSubmit}>
	     			<select name="targetLine">
	     				{
	     					lines.map((line, i) => (<option key={line} value={line}>{line}</option>))
	     				}
	     			</select>
	     			<button type="submit" value="Submit">Submit</button>
	     		</form>
	            <svg width="1280" height="960">
	                <CongressionalDistricts width={1280} height={960} singleRoute={singleRoute} singleTrainStops={singleTrainStops}/>
	            </svg>
	      	</div>
		)
	}	
}



