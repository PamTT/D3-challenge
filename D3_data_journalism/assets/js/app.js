var svgHeight = 500;
var svgWidth = 960;

var chartMargin = {
    top: 30,
    right: 50,
    bottom: 120,
    left: 100
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
    var yLinearScale = d3.scaleLinear()
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
  
    // add events
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
    var yLinearScale = yScale(anyData, chosenYAxis);

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
        .style("font-size", "15px")
        .call(bottomAxis);

    //append y-axis
    chartGroup.append("g")
        .classed("y-axis", true)
        .style("font-size", "15px")
        .call(LeftAxis);

    // append initial circles
    // ================================================== 
    var circlesGroup = chartGroup.selectAll("circle")
        .data(anyData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx",d => xLinearScale(d[chosenXAxis]))
        .attr("cy",d => yLinearScale(d.healthcare))
        .attr("r", 10)
        ;

    // appen initiax text
    // ===============================================
    var textGroup = chartGroup.selectAll(".stateText")
        .data(anyData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x",d => xLinearScale(d[chosenXAxis]))
        .attr("y",d => yLinearScale(d.healthcare))
        .attr("dy", 2)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr})
        ;

    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20 + chartMargin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("aText",true)
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("aText",true)
        .classed("active", true)
        .text("Age (Median");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("aText",true)
        .classed("active", true)
        .text("Household Income (Median");
    
    // Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - chartMargin.left/4},${chartHeight / 2})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("aText",true)
        .classed("active", true)
        .text("Lacks Healthcare(%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("aText",true)
        .classed("active", true)
        .text("Smokes (%)");

      var obeseLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("aText",true)
        .classed("active", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            //replace chosen axis with value
            chosenXAxis = value;
            console.log(chosenXAxia);

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(anyData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
             povertyLabel
                .classed("active", true)
                .classed("inactive", false);
             ageLabel
                .classed("active", false)
                .classed("inactive", true);
             incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }

            else if (chosenXAxis === "age") {
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                 .classed("active", true)
                 .classed("inactive", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
               }
            
            else {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }  
    });

    // y axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            //replace chosen axis with value
            chosenYAxis = value;
            console.log(chosenYAxia);

            // functions here found above csv import
            // updates Y scale for new data
            yLinearScale = yScale(anyData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderAxes(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "obesity") {
             obeseLabel
                .classed("active", true)
                .classed("inactive", false);
             smokesLabel
                .classed("active", false)
                .classed("inactive", true);
             healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            }

            else if (chosenXAxis === "smokes") {
              smokesLabel
              obeseLabel
              .classed("active", false)
              .classed("inactive", true);
           smokesLabel
              .classed("active", true)
              .classed("inactive", false);
           healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
               }
            
            else {
              healthcareLabel
              obeseLabel
              .classed("active", false)
              .classed("inactive", true);
           smokesLabel
              .classed("active", false)
              .classed("inactive", true);
           healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            }
        }  
    });

    
}).catch(function(error) {
  console.log(error);

});



