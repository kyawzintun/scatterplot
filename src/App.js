import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import * as d3 from "d3";

const jsonUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

class App extends Component {

  componentDidMount() {
    fetch(jsonUrl)
    .then(res => { return res.json() })
    .then( res => {
      console.log(res);
      this.drawScatterPlot(res);
    })
  }

  drawScatterPlot(res) {
    let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    let fastedTime = res[0].Seconds;
    let data = res;
    data.forEach((finish) => {
      finish.behind = finish.Seconds - fastedTime;
      if(finish.Doping !== '') {
        finish.legend = 'Doping Allegations';
      } else {
        finish.legend = 'No Doping Allegations';
      }
    })

    let formatTime = d3.timeFormat("%H:%M"),
    formatMinutes = function(d) {
      let t = new Date(2012,0,1,0,d);
      t.setSeconds(t.getSeconds()+d);
      return formatTime(t);
    };

    var margin = {top: 20, right: 80, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var x = d3.scaleLinear().domain([60 * 3.5, 0]).range([0, width]);
    var y = d3.scaleLinear().domain([1, 36]).range([0, height]);

    var valueline = d3.line()
    .x(function(d) { return x(d.Seconds); })
    .y(function(d) { return y(d.Place); });


    var svg = d3.select("div.Graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");    

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

    let node = svg.selectAll(".dot").data(data).enter().append('g');

    node.append("circle")
      .attr('class', 'dot')
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.behind); })
      .attr("cy", function(d) { return y(d.Place); })
      .attr("fill", function(d) {
        return d.Doping === "" ? "#333" : "#f44";
      })
      .attr("data-legend", function(d) { return d.legend; })
      .on("mouseover", function(d) {
        div.transition()
          .duration(100)
          .style("opacity", .9);
        div.html(
          "<div class='info'>"+  
            "<div class='player-info'>"+ 
              "<p><span>"+ d.Name + ":" + d.Nationality + "</span></p>"+
              "<p><span>Year:"+ d.Year + ":Time:" + d.Time + "</span></p>"
            +"</div><div class='doping-status'>"+d.Doping
          +"</div></div>")     
          .style("left", (d3.event.pageX + 5) + "px")             
          .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(100)
          .style("opacity", 0);
      });

    node.append("text")
      .attr('class', 'point-label')
      .attr("x", function(d) { return ( x(d.behind)+10 ); })
      .attr("y", function(d) { return ( y(d.Place)+5); })
      .text(function(d){
        return d.Name;
      })

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6).tickFormat(formatMinutes))
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Minutes Behind Fastest Time");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(8))
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ranking")

    svg.append("circle")
    .attr('class', 'dot')
    .attr("r", 5)
    .attr("cx", 590)
    .attr("cy", 347)
    .attr("fill", "#333")

    svg.append("text")
      .attr('class', 'point-label')
      .attr("x", 600)
      .attr("y", 350.7142857142857)
      .text("No doping allegations")

    svg.append("circle")
      .attr('class', 'dot')
      .attr("r", 5)
      .attr("cx", 610)
      .attr("cy", 395)
      .attr("fill", "#f44")
    
    svg.append("text")
      .attr('class', 'point-label')
      .attr("x", 620)
      .attr("y", 397.8571428571429)
      .text("Riders with doping allegations")
  }

  render() {
    return (
      <div className="container">
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>D3 Scatterplot Visualization</h2>
          </div>
          <div className="App-intro">
            <h2>Doping in Professional Bicycle Racing</h2>
            <p>35 Fastest times up Alpe d'Huez</p>
            <p>Normalized to 13.8km distance</p>
          </div>
        </div>
        <div className="Graph"></div>
      </div>
    );
  }
}

export default App;
