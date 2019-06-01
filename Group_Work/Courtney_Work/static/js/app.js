// Set size of SVG
var svgWidth = 960;
var svgHeight = 500;

// Set margin of Graphic
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Set size of graphic
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG graphic that that will hold our chart, and shift by left and right margins
var svg = d3
    .select("#plot1")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group/graphic
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function used for x-scale
function xScale(songData) {
    // create scales
    var xBandScale = d3.scaleBand()
        .domain(songData.length)
        .range([0, width]);
    return xBandScale;
}

// Function used for updating y-scale var upon click on dropdown menu




function buildPlot() {
    /* data route */
    var url = "/api/songs";
    d3.json(url).then(function (response) {

        console.log(response);
        var data = response;

        var canvas = d3.select("#plot1")
            .append(“svg”)
            .attr(“width”, width + margin.left + margin.right)
            .attr(“height”, height + margin.top + margin.bottom)
            .append(“g”)
            .attr(“transform”, “translate(” + margin.left + “, ” + margin.top + “) ”);

        //     var layout = {
        //       scope: "usa",
        //       title: "Pet Pals",
        //       showlegend: false,
        //       height: 600,
        //             // width: 980,
        //       geo: {
        //         scope: "usa",
        //         projection: {
        //           type: "albers usa"
        //         },
        //         showland: true,
        //         landcolor: "rgb(217, 217, 217)",
        //         subunitwidth: 1,
        //         countrywidth: 1,
        //         subunitcolor: "rgb(255,255,255)",
        //         countrycolor: "rgb(255,255,255)"
        //       }
        //     };

        //     Plotly.newPlot("plot", data, layout);
    });
}

buildPlot();
