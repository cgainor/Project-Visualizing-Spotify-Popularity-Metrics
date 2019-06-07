///////////// PLOT 3 /////////////

var RsvgWidth = 1200;
var RsvgHeight = 600;

var Rmargin = {
    Rtop: 30,
    Rright: 30,
    Rbottom: 80,
    Rleft: 100
};

var Rwidth = RsvgWidth - Rmargin.Rleft - Rmargin.Rright;
var Rheight = RsvgHeight - Rmargin.Rtop - Rmargin.Rbottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var Rsvg = d3
    .select("#plot3")
    .append("svg")
    .attr("width", RsvgWidth)
    .attr("height", RsvgHeight);

// Append an SVG group
var RchartGroup = Rsvg.append("g")
    .attr("transform", `translate(${Rmargin.Rleft}, ${Rmargin.Rtop})`);

// Initial Params
var RchosenXAxis = "danceability";

// function used for updating x-scale var upon click on axis label
function RxScale(songData, RchosenXAxis) {
    // create scales
    var RxLinearScale = d3.scaleLinear()
        .domain([d3.min(songData, d => d[RchosenXAxis]) * 0.8,
        d3.max(songData, d => d[RchosenXAxis]) * 1.2
        ])
        .range([0, Rwidth]);

    return RxLinearScale;

}

// function used for updating xAxis var upon click on axis label
function RrenderAxes(RnewXScale, RxAxis) {
    var RbottomAxis = d3.axisBottom(RnewXScale);

    RxAxis.transition()
        .duration(1000)
        .call(RbottomAxis);

    return RxAxis;
}

// function used for updating circles group with a transition to
// new circles
function RrenderCircles(RcirclesGroup, RnewXScale, RchosenXAxis) {

    RcirclesGroup.transition()
        .duration(1000)
        .attr("cx", d => RnewXScale(d[RchosenXAxis]));

    return RcirclesGroup;
}

// function used for updating circles group with new tooltip
function RupdateToolTip(RchosenXAxis, RcirclesGroup) {

    if (RchosenXAxis === "danceability") {
        var Rlabel = "Danceability:";
    }
    else {
        var Rlabel = "Tempo:";
    }

    var RtoolTip = d3.tip()
        .attr("class", "tooltipR")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.name}<br>${d.artists}<br>${Rlabel} ${d[RchosenXAxis]}`);
        });

    RcirclesGroup.call(RtoolTip);

    RcirclesGroup.on("mouseover", function (data) {
        RtoolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            RtoolTip.hide(data);
        });

    return RcirclesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("top2018.csv", function (songData) {

    // parse data
    songData.forEach(function (data) {
        data.id = +data.id;
        data.artists = +data.artists;
        data.danceability = +data.danceability;
        data.energy = +data.energy;
        data.key = +data.key;
        data.loudness = +data.loudness
        data.tempo = +data.tempo;
    });


    // xLinearScale function above csv import
    var RxLinearScale = RxScale(songData, RchosenXAxis);

    // Create y scale function
    var RyLinearScale = d3.scaleLinear()
        .domain([0, d3.max(songData, d => d.energy)])
        .range([height, 0]);

    // Create initial axis functions
    var RbottomAxis = d3.axisBottom(RxLinearScale);
    var RleftAxis = d3.axisLeft(RyLinearScale);

    // append x axis
    var RxAxis = RchartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${Rheight})`)
        .call(RbottomAxis);

    // append y axis
    RchartGroup.append("g")
        .call(RleftAxis);

    // append initial circles
    var RcirclesGroup = RchartGroup.selectAll("circle")
        .data(songData)
        .enter()
        .append("circle")
        .attr("cx", d => RxLinearScale(d[RchosenXAxis]))
        .attr("cy", d => RyLinearScale(d.danceability))
        .attr("r", 12)
        .attr("fill", "lightgreen")
        .attr("opacity", ".5");
    // .text(data.num_hits);

    // Create group for  2 x- axis labels
    var RlabelsGroup = RchartGroup.append("g")
        .attr("transform", `translate(${Rwidth / 2}, ${Rheight + 20})`);

    var RdanceabilityLabel = RlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "danceability") // value to grab for event listener
        .classed("active", true)
        .text("Danceability");

    var RtempoLabel = RlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "tempo") // value to grab for event listener
        .classed("inactive", true)
        .text("Tempo");

    // append y axis
    RchartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - Rmargin.Rleft)
        .attr("x", 0 - (Rheight / 2))
        .attr("dy", "1em")
        .classed("axis-textR", true)
        .text("Energy");

    // updateToolTip function above csv import
    var RcirclesGroup = RupdateToolTip(RchosenXAxis, RcirclesGroup);

    // x axis labels event listener
    RlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var Rvalue = d3.select(this).attr("value");
            if (Rvalue !== RchosenXAxis) {

                // replaces chosenXAxis with value
                RchosenXAxis = Rvalue;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                RxLinearScale = RxScale(songData, RchosenXAxis);

                // updates x axis with transition
                RxAxis = RrenderAxes(RxLinearScale, RxAxis);

                // updates circles with new x values
                RcirclesGroup = RrenderCircles(RcirclesGroup, RxLinearScale, RchosenXAxis);

                // updates tooltips with new info
                RcirclesGroup = RupdateToolTip(RchosenXAxis, RcirclesGroup);

                // changes classes to change bold text
                if (RchosenXAxis === "danceability") {
                    RdanceabilityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    RtempoLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    RdanceabilityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    RtempoLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
});