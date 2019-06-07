// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 80,
    left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select chart placeholder, append SVG area to it, and set the dimensions
var svg = d3.select("#plot1")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a graphic to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial parameter for chart
var chosenYaxis = "danceability";

// Function used for updating y-scale var upon click on dropdown menu
function yScale(songData, chosenYaxis) {
    // Create scales
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(songData, d => d[chosenYaxis]) * 0.8])
        .range([chartHeight, 0]);
    return yLinearScale;
}

// Function used for updating yAxis var upon click on dropdown menu
function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Function used for updating Bars group with a transition to new bars
function renderBars(barsGroup, newYScale, chosenYaxis) {
    barsGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYaxis]))
        //.attr("width", xBandScale.bandwidth())
        .attr("height", d => chartHeight - newYScale(d[chosenYaxis]));
    //console.log(barsGroup)
    return barsGroup;
}

// Function used for updating yAxis label upon click on dropdown menu
function renderlabelGroup(ylabelGroup, chosenYaxis) {
    ylabelGroup.transition()
        .duration(1000)
        .text(chosenYaxis);
    return ylabelGroup;
}

// Function used for updating bar group with new tooltip
function updateToolTip(chosenYaxis, barsGroup) {

    if (chosenYaxis === "danceability") {
        var label = "Danceability:";
    }
    else if (chosenYaxis === "energy") {
        var label = "Energy:";
    }
    else if (chosenYaxis === "key") {
        var label = "Key:";
    }
    else if (chosenYaxis === "loudness") {
        var label = "Loudness:";
    }
    else if (chosenYaxis === "mode") {
        var label = "Mode:";
    }
    else if (chosenYaxis === "speechiness") {
        var label = "Speechiness:";
    }
    else if (chosenYaxis === "acousticness") {
        var label = "Acousticness:";
    }
    else if (chosenYaxis === "instrumentalness") {
        var label = "Instrumentalness:";
    }
    else if (chosenYaxis === "liveness") {
        var label = "Liveness:";
    }
    else if (chosenYaxis === "valence") {
        var label = "Valence:";
    }
    else if (chosenYaxis === "tempo") {
        var label = "Tempo:";
    }
    else if (chosenYaxis === "duration_ms") {
        var label = "Duration(ms):";
    }
    else if (chosenYaxis === "time_signature") {
        var label = "Time Signature:";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`Rank: ${d.id}<br>Song: ${d.name}<br>Artist(s): ${d.artists}<br>${label} ${d[chosenYaxis]}`);
        });

    barsGroup.call(toolTip);

    barsGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return barsGroup;
}

function buildPlot() {
    // Load data from top2018.csv
    d3.csv("top2018.csv", function (error, songData) {
        if (error) throw error;

        console.log(songData);
        // Parse data
        songData.forEach(function (stuff) {
            //stuff.id = +stuff.id;
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
            .domain(songData.map(d => d.name))
            .range([0, chartWidth])
            .padding(0.1);

        // Create a linear scale for the vertical axis.
        var yLinearScale = yScale(songData, chosenYaxis)

        // Create two new functions passing our scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xBandScale).tickValues([]);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Append x axis
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        // Append y axis
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // Append x axis label
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
            .classed("axis-text", true)
            .text("Top Songs (2018)");

        // Append y axis label
        var ylabelGroup = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - chartMargin.left)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text(chosenYaxis);
// console.log(chosenYaxis[0].toUpperCase(), chosenYaxis[1])


        // Create one SVG rectangle per piece of songData
        // Use the linear and band scales to position each rectangle within the chart
        var barsGroup = chartGroup.selectAll(".bar")
            .data(songData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xBandScale(d.name))
            .attr("y", d => yLinearScale(d[chosenYaxis]))
            .attr("width", xBandScale.bandwidth())
            .attr("height", d => chartHeight - yLinearScale(d[chosenYaxis]));

        var barsGroup = updateToolTip(chosenYaxis, barsGroup);
        d3.select("#drop1")
            .on("change", function (value) {
                // Get value of selection
                // var value = d3.select(this).attr("value");
                var value = d3.select("#drop1").property("value");
                chosenYaxis = value;
                yLinearScale = yScale(songData, chosenYaxis);
                yAxis = renderAxes(yLinearScale, yAxis);
                console.log(barsGroup)
                barsGroup = renderBars(barsGroup, yLinearScale, chosenYaxis);
                ylabelGroup = renderlabelGroup(ylabelGroup, chosenYaxis);
                barsGroup = updateToolTip(chosenYaxis, barsGroup);
            });
    });
}
buildPlot();