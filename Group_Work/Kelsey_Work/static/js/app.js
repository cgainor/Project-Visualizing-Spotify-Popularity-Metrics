var wrapperNode = document.getElementById('wrapper')
var scrollDownNode = document.querySelector('.scroll-down')
var linkNodes = document.querySelector('.links')

var vh = window.innerHeight

/* STORE SOME KEY LOCATIONS */

/* ~ le fin ~
 * The point where you cannot scroll down any further.
 */
var fin = wrapperNode.clientHeight - vh + linkNodes.clientHeight

function calculateAnimations() {
  return [
    /* animate Cs */
    { range: [-1, fin * 0.5],   selector: '.c', type: 'scale', style: 'transform:translateY', from: 0, to: 25, unit: 'px' },
    { range: [fin * 0.5, fin],  selector: '.c', type: 'scale', style: 'transform:translateY', from: 25, to: 0, unit: 'px' },
    { range: [fin * 0.4, fin],  selector: '.c', type: 'change', style: 'color', to: '#ffb515' },

    /* animate Hs */
    { range: [-1, fin * 0.5],   selector: '.h', type: 'scale', style: 'transform:scaleX', from: 1, to: 0.5 },
    { range: [-1, fin * 0.5],   selector: '.h', type: 'scale', style: 'transform:scaleY', from: 1, to: 0.5 },
    { range: [fin * 0.5, fin],  selector: '.h', type: 'scale', style: 'transform:scaleX', from: 0.5, to: 1 },
    { range: [fin * 0.5, fin],  selector: '.h', type: 'scale', style: 'transform:scaleY', from: 0.5, to: 1 },
    { range: [fin * 0.3, fin],  selector: '.h', type: 'change', style: 'color', to: '#1fd1ec' },

    /* animate Os */
    { range: [fin * 0.1, fin],  selector: '.o', type: 'randomizeColor' },

    /* animate Rs */
    { range: [-1, fin * 0.5],   selector: '.r', type: 'scale', style: 'transform:rotateX', from: 0, to: 90, unit: 'deg' },
    { range: [fin * 0.5, fin],  selector: '.r', type: 'scale', style: 'transform:rotateX', from: 90, to: 0, unit: 'deg' },
    { range: [fin * 0.3, fin],  selector: '.r', type: 'change', style: 'color', to: '#8382f9' },

    /* animate Es */
    { range: [fin * 0.3, fin],  selector: '.e', type: 'change', style: 'color', to: '#ff1b9b' },

    /* animate Gs */
    { range: [-1, fin * 0.5],   selectors: ['.g', '.j'], type: 'scale', style: 'transform:rotateZ', from: 0, to: 180, unit: 'deg' },
    { range: [fin * 0.5, fin],  selectors: ['.g', '.j'], type: 'scale', style: 'transform:rotateZ', from: 180, to: 360, unit: 'deg' },
    { range: [fin * 0.4, fin],  selectors: ['.g', '.j'], type: 'change', style: 'color', to: '#ff8b1c' },

    /* animate As */
    { range: [-1, fin * 0.5],   selectors: ['.a', '.s'], type: 'scale', style: 'transform:rotateZ', from: 0, to: -180, unit: 'deg' },
    { range: [fin * 0.5, fin],  selectors: ['.a', '.s'], type: 'scale', style: 'transform:rotateZ', from: -180, to: -360, unit: 'deg' },
    { range: [fin * 0.4, fin],  selectors: ['.a', '.s'], type: 'change', style: 'color', to: '#c05bdb' },

    /* animate Ps */
    { range: [-1, fin * 0.5],   selectors: ['.p', '.dash'], type: 'scale', style: 'opacity', from: 1, to: 0.1 },
    { range: [fin * 0.5, fin],  selectors: ['.p', '.dash'], type: 'scale', style: 'opacity', from: 0.1, to: 1 },
    { range: [fin * 0.4, fin],  selectors: ['.p', '.dash'], type: 'change', style: 'color', to: '#ff537c' },

    /* animate line */
    { range: [-1, fin],         selector: '.line', type: 'scale', style: 'width', from: 0.01, to: 50, unit: '%' },
    { range: [-1, fin],         selector: '.line', type: 'scale', style: 'opacity', from: 0, to: 1 },

    /* animate arrow */
    { range: [0.6 * fin, fin], selector: '.scroll-down', type: 'scale', style: 'opacity', from: 1, to: 0 },
    { range: [fin - 30, fin],   selector: '.scroll-down', type: 'change', style: 'display', to: 'none' },

    /* animate links */
    { range: [0.8 * fin, fin], selector: '.links', type: 'scale', style: 'opacity', from: 0, to: 1 }
  ]
}

// Instantiate choreographer.
var choreographer = new Choreographer({
  animations: calculateAnimations(),
  customFunctions: {
    randomizeColor: function(data) {
      var chars = '0123456789abcdef'.split('')
      var hex = '#'

      while (hex.length < 7) {
        hex += chars[Math.round(Math.random() * (chars.length - 1))]
      }

      data.node.style.color = hex
    }
  }
})

function animate() {
  var scrollPosition = (wrapperNode.getBoundingClientRect().top - wrapperNode.offsetTop) * -1
  choreographer.runAnimationsAt(scrollPosition)
}

document.body.addEventListener('scroll', animate)

animate()

window.addEventListener('resize', function() {
  choreographer.updateAnimations(calculateAnimations())
})

/* MAIN CODE IS BELOW; ABOVE IS JUST THE MOVING TEXT */



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

    var toolTip = d3.tip().attr("class", "tooltip")
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

// try{
function buildPlot() {
    // Retrieve data from the JSON and execute everything below
    var url = "/api/songs";
    d3.json(url).then(function (response) {
        console.log(response.song_data[0]);
        var data = response.song_data;

        // Parse data
        data.forEach(function (stuff) {
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
            console.log(stuff);
        });
        
        // Create x scale function
        var xBandScale = d3.scaleBand()
            .domain(data.length * 0.8)
            .range(0, width)

        // y scale function from earlier
        var yLinearScale = yScale(data, chosenYaxis)

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Append y axis
        chartGroup.append("g")
            .call(leftAxis);

        // Append initial bars
        var barsGroup = chartGroup.selectAll("bar")
            .data(data)
            .enter()
            .append("bar")
            .attr("x", d => xLinearScale(d.name))
            .attr("y", d => yLinearScale(d[chosenYaxis]))
            .attr("fill", "lightblue")
            .attr("opacity", ".5");

        // Append x axis
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
            .classed("axis-text", true)
            .text("Top Songs (2018");

        // Create group for multiple y axes labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate($)`)

        // // Get every column value
        // var elements = ["danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo", "duration_ms", "time_signature"]

        // var selector = d3.select("#drop1")
        //             .selectAll("option")
        //             .data(elements)
        //             .enter().append("option")
        //             .attr("value", function (d) {
        //                 return d;
        //             })
        //             .text(function (d) {
        //                 return d;
        //             })

//         // Update ToolTip function above json import
//         var barsGroup = updateToolTip(chosenYaxis, barsGroup);

//         // Y Axis labels event listener
//         labelsGroup.selectall("text")
//             .on("click", function () {
//                 // Get value of selection
//                 var value = d3.select(this).attr("value");
//                 if (value !== chosenYaxis) {
//                     // Replaces chosen Y axis with value
//                     chosenYaxis = value;
//                     console.log(chosenYaxis)

//                     // updates y scale for new data
//                     yLinearScale = yScale(data, chosenYaxis);

//                     // updates y axis with transition
//                     yAxis = renderAxes(yLinearScale, yAxis);

//                     // updates bars with new y values
//                     barsGroup = renderBars(barsGroup, yLinearScale, chosenYaxis);

//                     // updates tooltips with new info
//                     barsGroup = updateToolTip(chosenYaxis, barsGroup);
                // }
            // })
        });
// };
// }

}

buildPlot();

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
      var svg = d3.select("#metricCircles")
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
        d3.csv("resources/top2018.csv", function(data) {
      
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