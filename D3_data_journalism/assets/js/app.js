var svgHeight = 500;
var svgWidth = 850;

var chartMargin = {
    top: 30,
    right: 50,
    bottom: 50,
    left: 50
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Create an SVG wrapper,
// Select id = "scatter", append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// function used for updating x-scale & y-scale var upon click on axis label
function  xScale(allData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[chosenXAxis]) * 0.8,
        d3.max(allData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

return xLinearScale;
}

function  yScale(allData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[chosenXAxis]) * 0.8,
        d3.max(allData, d => d[chosenXAxis]) * 1.2
    ])
    .range([chartHeight,0]);

return yLinearScale;
}


// function used for updating xAxis and yAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisBottom(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis,newYScale, chosenYAxis ) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
}

// function for update state abbr
function renderText(textGroup, newXScale, chosenXAxis,newYScale, chosenYAxis ) {

    textGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;
    if (chosenXAxis === "poverty") {
        label = "In Poverty (%):";
    }
    else if (chosenXAxis === "age") {
        label = "Age: ";
    }
    else {
      label = "Income (Median):";
    }

    if (chosenYAxis === "obese") {
        label = "Obesity (%):";
    }
    else if (chosenXAxis === "asmokes") {
        label = "Smokes (%): ";
    }
    else {
      label = "Lack of Healthcare (%):";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>
        Poverty: ${d.poverty}<br>
        Obesity: ${d.obesity}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(dataa) {
      toolTip.show(dataa);
    })
      // onmouseout event
      .on("mouseout", function(dataa, index) {
        toolTip.hide(dataa);
      });
  
    return circlesGroup;
}

// Import data from the data.csv file and execute everything below
// =====================================
d3.csv("/assets/data/data.csv").then(function(anyData) {
    console.log(anyData);
    
    // Cast the poverty and healthcare value to number for each piece of sateData
    // ===================================
    anyData.forEach(function(dataa) {
    dataa.poverty = +dataa.poverty;
    dataa.age = +dataa.age;
    dataa.income = +dataa.income;
    dataa.obesity = +dataa.obesity;
    dataa.smokes = +dataa.smokes;
    dataa.healthcare = +dataa.healthcare;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(anyData, chosenXAxis);

   // yLinearScale function
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(anyData, d => d.healthcare)])
    .range([chartHeight, 0]);
    
    // Create initial axis functions
    // =============================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var LeftAxis = d3.axisLeft(yLinearScale);

    // Append the axes
    //append x-axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .style("font-size", "15px").call(bottomAxis);

    //append y-axis
    chartGroup.append("g")
        .style("font-size", "15px").call(LeftAxis);

    // append initial circles
    // ================================================== 
    var circlesGroup = chartGroup.selectAll("circle")
        .data(anyData)
    .enter()
    .append("circle")
        .attr("cx",d => xLinearScale(d[chosenXAxis]))
        .attr("cy",d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .style("fill", "green");

    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median");
    
    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare(%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    
    // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            //replace chosen axis with value
            chosenXAxis == value;
            console.log(chosenXAxia);

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "age") {
             ageLabel
                .classed("active", true)
                .classed("inactive", false);
             povertyLabel
                .classed("active", false)
                .classed("inactive", true);
             incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }

            if (chosenXAxis === "poverty") {
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyLabel
                 .classed("active", true)
                 .classed("inactive", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
               }
            
            else {
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }  
    });
    
}).catch(function(error) {
  console.log(error);


});



