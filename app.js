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
        .domain([0, d3.max(songData, d => d[chosenYaxis]) * 1.2])
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
        .attr("height", d => chartHeight - newYScale(d[chosenYaxis]));
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
            return (`Song: ${d.name}<br>Artist(s): ${d.artists}<br>${label} ${d[chosenYaxis]}`);
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
    
        // console.log(songData);
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







///////////// PLOT 2 /////////////
var randomColor = (function(){
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();
  
    var hslToRgb = function (h, s, l){
        var r, g, b;
  
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
  
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
  
        return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
    }; })
  
  
      // set the dimensions and margins of the graph
      var margin = {top: 30, right: 30, bottom: 70, left: 60},
          width = 900 - margin.left - margin.right,
          height = 800 - margin.top - margin.bottom;
      
      // append the svg object to the body of the page
      var svg = d3.select("#my_dataviz")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
      
      // Initialize the X axis
      var x = d3.scaleBand()
        .range([ 0, width ])
        .padding(1);
      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
      
      // Initialize the Y axis
      var y = d3.scaleLinear()
        .range([ height, 0]);
      var yAxis = svg.append("g")
        .attr("class", "myyAxis")
      
      
      // A function that create / update the plot for a given variable:
      function update(selectedVar) {
      
        // Parse the Data
        d3.csv("top2018.csv", function(data) {
      
          // X axis
          x.domain(data.map(function(d) { return d.name; }))
          xAxis.transition().duration(1000).call(d3.axisBottom(x))
      
          // Add Y axis
          y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
          yAxis.transition().duration(1000).call(d3.axisLeft(y));
      
          // variable u: map data to existing circle
          var j = svg.selectAll(".myLine")
            .data(data)
          // update lines
          j
            .enter()
            .append("line")
            .attr("class", "myLine")
            .merge(j)
            .transition()
            .duration(1000)
              .attr("x1", function(d) { console.log(x(d.name)) ; return x(d.name); })
              .attr("x2", function(d) { return x(d.name); })
              .attr("y1", y(0))
              .attr("y2", function(d) { return y(d[selectedVar]); })
              .attr("stroke", "grey")
      
  
      
          // variable u: map data to existing circle
          var u = svg.selectAll("circle")
            .data(data)
          // update bars
          u
            .enter()
            .append("circle")
            .attr("id", "circleBasicTooltip")
            .merge(u)
            .transition()
            .duration(1000)
              .attr("cx", function(d) { return x(d.name); })
              .attr("cy", function(d) { return y(d[selectedVar]); })
              .attr("r", 8)
              .style("fill",function() {
              return "hsl(" + Math.random() * 360 + ",100%,50%)"});
  
              // u.updateToolTip(yAxis, u)
                  
              var toolTip = d3.select("body")
        .append("div")
        .classed("tooltip", true);
  
      // Step 2: Create "mouseover" event listener to display tooltip
      u.on("mouseover", function(d) {
        toolTip.style("display", "block")
            .html(
              `<strong>${d.name}<strong><hr>${d.artists}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
            .style("fill", "white");
      })
        // Step 3: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function() {
          toolTip.style("display", "none");
        });
  
          });
  
      }
      
        
      
      
      
      // Initialize plot
      update('danceability')
      // updateToolTip()
      
      
      