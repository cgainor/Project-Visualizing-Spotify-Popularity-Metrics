///////////// PLOT 2 /////////////

var randomColor = (function () {
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();

    var hslToRgb = function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
    };
})

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 80, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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
    .range([0, width])
    .padding(1);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myyAxis")


// A function that create / update the plot for a given variable:
function update(selectedVar) {

    d3.csv("top2018.csv", function (data) {

        // X axis
        x.domain(data.map(function (d) { return d.name; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x).tickValues([]));

        // Add Y axis
        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
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
            .attr("x1", function (d) { console.log(x(d.name)); return x(d.name); })
            .attr("x2", function (d) { return x(d.name); })
            .attr("y1", y(0))
            .attr("y2", function (d) { return y(d[selectedVar]); })
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
            .attr("cx", function (d) { return x(d.name); })
            .attr("cy", function (d) { return y(d[selectedVar]); })
            .attr("r", 8)
            .style("fill", function () {
                return "hsl(" + Math.random() * 360 + ",100%,50%)"
            });

        // u.updateToolTip(yAxis, u)

        // var KtoolTip = d3.select("body")
        //     .append("div")
        //     .classed("tooltipK", true);
        var KtoolTip = d3.tip()
            .attr("class", "Ktooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`<strong>${d.name}<strong><hr>${d.artists}`);
            });
        u.call(KtoolTip);

        // Step 2: Create "mouseover" event listener to display tooltip
        u.on("mouseover", function (d) {
            // KtoolTip.style("display", "block")
            //     .html(
            //         `<strong>${d.name}<strong><hr>${d.artists}`)
            //     .style("left", d3.event.pageX + "px")
            //     .style("top", d3.event.pageY + "px")
            //     .style("fill", "white");
            KtoolTip.show(d)
        })
            // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function (d) {
                // KtoolTip.style("display", "none");
                KtoolTip.hide(d);
            });
        return u;
    });

}

// Initialize plot
update('danceability')
// updateToolTip()