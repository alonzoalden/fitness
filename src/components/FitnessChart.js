/**
*
* PhaseView
*
*/

import React from 'react';
import './FitnessChart.css';
import * as d3 from 'd3';
import data from './data.csv'

class FitnessChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  d3setup(props) {

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%d-%b-%y");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return x(d); })
      .y(function(d) { return y(d); });

  var data = [1, 2, 3, 3, 3, 2, 3, 3, 2, 3, 4];
  var data1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#graph").append("svg")
      .data(data)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Get the data

  // format the data
  // data.forEach(function(d) {
  //     d = Number(d);
  //     // if (d) { d = +d.suffer_score };
  // });

  // Scale the range of the data

    x.domain(d3.extent(data1, function(d) { return d }));
    y.domain([1, 100]);

  // // Add the valueline path.
  // svg.append("path")
  //     .data(data)
  //     .attr("class", "line")
  //     .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisRight(y));



  }

  componentWillReceiveProps(nextProps) {
    // this.d3setup(nextProps.data)
    console.log(nextProps.data, 'sssss')
  }



  render() {
      console.log('asdf', this.props.data)
    return (
      <div id="graph">
      </div>
    );

    }
  }


export default FitnessChart;
