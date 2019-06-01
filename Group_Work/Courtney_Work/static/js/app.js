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

// Initial Params
var chosenYaxis = "danceability";

// Function used for updating y-scale var upon click on dropdown menu
function yScale(songData, chosenYaxis) {
    // create scales
    var yLinearScale = d3.scaleBand()
        .domain(d3.min(songData, d => d[chosenYaxis]) * 0.8)
        .range([height, 0]);
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
        .attr("y", d => newYScale(d[chosenYaxis]));

    return barsGroup;
}

// Function used for updating bar group with new tooltip
function updateToolTip(chosenYaxis, barGroup) {

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
            return (`Rank: ${d.id}<br>${d.name}<br>${d.artists}<br>${label} ${d[chosenYaxis]}`);
        });

    barGroup.call(toolTip);

    barGroup.on("mouseover", function (data) {
        toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    return barsGroup;
}


function buildPlot() {
    // Retrieve data from the JSON and execute everything below
    var url = "/api/songs";
    d3.json(url).then(function (err, response) {
        if (err) throw err;

        console.log(response);
        var data = response;

        // Parse data
        data.forEach(function(stuff) {
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
          });

        // Create x scale function
        var xBandScale = d3.scaleBand()
            .domain(data.length*0.8)
            .range(0, width)

        // y scale function from earlier
        var yLinearScale = yScale(data, chosenYaxis)

        // Create initial axis functions


//         var canvas = d3.select("#plot1")
//             .append(“svg”)
//             .attr(“width”, width + margin.left + margin.right)
//             .attr(“height”, height + margin.top + margin.bottom)
//             .append(“g”)
//             .attr(“transform”, “translate(” + margin.left + “, ” + margin.top + “) ”);

//         //     var layout = {
//         //       scope: "usa",
//         //       title: "Pet Pals",
//         //       showlegend: false,
//         //       height: 600,
//         //             // width: 980,
//         //       geo: {
//         //         scope: "usa",
//         //         projection: {
//         //           type: "albers usa"
//         //         },
//         //         showland: true,
//         //         landcolor: "rgb(217, 217, 217)",
//         //         subunitwidth: 1,
//         //         countrywidth: 1,
//         //         subunitcolor: "rgb(255,255,255)",
//         //         countrycolor: "rgb(255,255,255)"
//         //       }
//         //     };

//         //     Plotly.newPlot("plot", data, layout);
//     });
// }

// buildPlot();
