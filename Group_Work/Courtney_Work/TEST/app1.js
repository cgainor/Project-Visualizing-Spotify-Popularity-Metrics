// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
var chosenYaxis = "danceability";
// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


function yScale(songData, chosenYaxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(songData, d => d[chosenYaxis]) * 0.8, d3.max(songData, d => d[chosenYaxis]) * 0.8])
        .range([chartHeight, 0]);
    return yLinearScale;
}

function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}

function renderBars(barsGroup, newYScale, chosenYaxis) {
  barsGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYaxis]));
  console.log(barsGroup)
  return barsGroup;
}

function buildPlot() {
// Load data from hours-of-tv-watched.csv
d3.csv("top2018.csv", function(error, tvData) {
    if (error) throw error;

    console.log(tvData);
  // Parse data
  tvData.forEach(function (stuff) {
    stuff.id = +stuff.id;
    stuff.danceability = +stuff.danceability;
    stuff.energy = +stuff.energy;
    stuff.key = +stuff.key;
    stuff.loudness = +stuff.loudness;
    stuff.mode = +stuff.mode;
    stuff.speechiness = +stuff.speechiness;
    stuff.acousticness = +stuff.acousticness;
    stuff.instrumentalness = +stuff.instrumentalness;
    stuff.liveness = +stuff.liveness;
    stuff.valence = +stuff.valence;
    stuff.tempo = +stuff.tempo;
    stuff.duration_ms = +stuff.duration_ms;
    stuff.time_signature = +stuff.time_signature;
    // console.log(stuff);
  });
  
  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(tvData.map(d => d.name))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(tvData, d => d[chosenYaxis]) * 0.8])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(tvData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.name))
    .attr("y", d => yLinearScale(d[chosenYaxis]))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d[chosenYaxis]));


    d3.select("#drop1")
    .on("change", function (value) {
        // Get value of selection
        // var value = d3.select(this).attr("value");
        var value = d3.select("#drop1").property("value");
        chosenYaxis = value;
        yLinearScale = yScale(tvData, chosenYaxis);
        yAxis = renderAxes(yLinearScale, yAxis);
        chartGroup = renderBars(chartGroup, yLinearScale, chosenYaxis);

        //buildPlot2();
    });

});

}

buildPlot();