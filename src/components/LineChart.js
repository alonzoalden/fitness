import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';
import moment from 'moment';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dates: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      dates: nextProps.dates
    })
  }

  render() {

    if (this.state.data.length === 0) {
      return (
        <p>loading</p>
      );
    }
    // set units, margin, sizes
    var margin = { top: 20, right: 20, bottom: 70, left: 50 };
    var width = 700 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var padding = 100
    //parse date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    //set ranges
    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);


    // initialize and append the svg canvas to faux-DOM
    var node = ReactFauxDOM.createElement('div');

    var svg = d3.select(node).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      // format the data
      this.state.data.forEach((d) => {


          d.kilojoules = !d.kilojoules ? 0 : +d.kilojoules;

          console.log(d.kilojoules)
      });

      this.state.dates.forEach((d) => {
          d = parseTime(new Date(d).toISOString().slice(0,10));


      });
      // Scale the range of the data
      x.domain([new Date(this.state.dates[0]), new Date(this.state.dates[this.state.dates.length-1])]);

      y.domain([0, d3.max(this.state.data, function(d) { return d.kilojoules; })]);

    // //define the line
    var valueline = d3.line()
        .x(function(d) { return x(d); })
        .y(function(d) { return y(d.kilojoules); });

      // Add the valueline path.
      svg.append("path")
          .datum(this.state.data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", valueline);


      // Add the X Axis
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%b-%d-%Y")))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");


      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("kilojoules");

    return node.toReact();

  }
};

export default LineChart;