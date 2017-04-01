import React from 'react';
import './LineChart.css';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';
import moment from 'moment';


class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    })
    console.log(this.state)

  }

  render() {

    if (this.state.data.length === 0) {
      return (
        <p>loading</p>
      );
    } else {

    // set units, margin, sizes
    var margin = { top: 20, right: 25, bottom: 70, left:80 };
    var width = 825 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var padding = 100
    //parse date / time


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


      // x.domain(this.state.data.map(function(d) { return d.formattedDate}  ));
      // Scale the range of the data
      x.domain([new Date(this.state.data[0].formattedDate), new Date(this.state.data[this.state.data.length-1].formattedDate)])

      // y.domain([0, d3.max(this.state.data, function(d) { return d.kilojoules; })]);
      y.domain([0, d3.max(this.state.data, function(d) { return d.kilojoules; }) + 200]);



    // //define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.formattedDate); })
        .y(function(d) { return y(d.kilojoules); });

      // //Add the valueline path.
      // svg.append("path")
      //     .datum(this.state.data)
      //     .attr("fill", "none")
      //     .attr("stroke", "steelblue")
      //     .attr("stroke-linejoin", "round")
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke-width", .5)
      //     .attr("d", valueline);

     //append the x grid line
      svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
              .ticks(5)
              .tickSize(-height)
              .tickFormat("")
          )
          .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2")
          .selectAll(".tick text").attr("x", 4).attr("dy", -4);

     //append the y grid line
      svg.append("g")
          .attr("class", "grid")
          .call(d3.axisLeft(y)
              .ticks(3)
              .tickSize(-width)
              .tickFormat("")
          )
          .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2")
          .selectAll(".tick text").attr("x", 4).attr("dy", -4);


      // Add the X Axis
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .ticks(10)
        .tickFormat(d3.timeFormat("%b-%Y")))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "2.10em")
        .attr("dy", ".7em")


      // Add the Y Axis
      svg.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y)
            .ticks(15)
            .tickFormat(function(d) {
              return this.parentNode.nextSibling
                ? d
                : d + ' Kilojoules'
            }))

      svg.selectAll(".bar")
      .data(this.state.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", "3px")
      .attr("x", function(d) { return x(d.formattedDate); })
      .attr("y", function(d) { return y(d.kilojoules); })
      .attr("height", function(d) { return height - y(d.kilojoules); });


    return node.toReact();
    }
  }
};

export default LineChart;
