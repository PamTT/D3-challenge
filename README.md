# D3-challenge

1. To create a scatter plot between two of the data variables such as Healthcare vs. Poverty.
Using the D3 techniques taught in class and create a scatter plot that represents each state with circle elements. You'll code this graphic in the app.js file of your homework directory—make sure you pull in the data from data.csv by using the d3.csv function. Your scatter plot should ultimately appear like the image at the top of this section.


2. Include state abbreviations in the circles.


3. Create and situate your axes and labels to the left and bottom of the chart.

4. Bonus:
	1. More Data, More Dynamics
	To include more demographics and more risk factors. Place additional labels in your scatter plot and 		give them click events so that your users can decide which data to display. Animate the transitions for 	circles' locations as well as the range of your axes. Do this for two risk factors for each axis. Or, for 	an extreme challenge, create three for each axis.

	Hint: Try binding all of the CSV data to your circles. This will let you easily determine their x or y 	values when you click the labels.


	2. Incorporate d3-tip
	While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to 	determine the true value without adding another layer of data. Enter tooltips: developers can implement 	these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the 	element. Add tooltips to your circles and display each tooltip with the data that the user has selected. 	Use the d3-tip.js plugin developed by Justin Palmer—we've already included this plugin in your assignment 	directory.



Note: You'll need to use python -m http.server to run the visualization. This will host the page at localhost:8000 in your web browser.