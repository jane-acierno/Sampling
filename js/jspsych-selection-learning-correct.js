var jsPsychSelectionLearning = (function (jspsych) {
	"use strict";

	/**
	 * **SELECTION LEARNING**
	 *
	 * SHORT PLUGIN DESCRIPTION
	 *
	 * @author Martin Zettersten + Nathan Liang
	 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
	 */

	var advance = false;

	const defaultImages = [...Array(40)].map((_, i) => `image${i + 1}`);
	const defaultLabels = [...Array(40)].map((_, i) => `label${i + 1}`);

	const info = {
		name: "selection-learning",
		parameters: {
			selection_learning: {
				type: jspsych.ParameterType.IMAGE,
				default: defaultImages
			},
			selection_labels: {
				type: jspsych.ParameterType.HTML_STRING,
				default: defaultLabels
			},
			choices: {
				type: jspsych.ParameterType.STRING,
				pretty_name: "Choices",
				default: undefined,
				array: true,
			}
		}
	};

	class SelectionLearningPlugin {
		constructor(jsPsych) {
			this.jsPsych = jsPsych;
		}

		trial(display_element, trial) {

			// default values
			trial.canvas_size = trial.canvas_size || [1024, 2048];
			trial.image_size = trial.image_size || [150, 150];
			trial.question = trial.question || "Click on the person whose opinion you would like to hear next.";
			trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;
			trial.duration = trial.duration || 1000;
			trial.imageArrayKey = trial.imageArrayKey || Array.from({ length: 40 }, (_, i) => i.toString());
			trial.circleArrayKey = trial.circleArrayKey || Array.from({ length: 40 }, (_, i) => i.toString());
			trial.imageArrayIndex = trial.imageArrayIndex || Array.from({ length: 40 }, (_, i) => i);
			trial.circleArrayIndex = trial.circleArrayIndex || Array.from({ length: 40 }, (_, i) => i);
			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
			trial.finalPause = trial.finalPause || 0;

			display_element.innerHTML += `<svg id='jspsych-test-canvas' width=${trial.canvas_size[0]} height=${trial.canvas_size[1]}></svg>`
			var paper = Snap("#jspsych-test-canvas");

			var choice = "NA";
			var choiceIndex = "NA";
			var choiceKey = "NA";
			var choiceLabel = "NA";
			var choiceImage = "NA";
			var choiceCircle = "NA";

			var rt = "NA";
			var learningImage = "NA";
			var learningStartRT = "NA";
			var trialDuration = "NA";
			var prompt = "NA";

			// Create a snap set by pushing to circleSet and populate circleDict with circles 1-40

			// Define the dimensions of the grid
			var numRows = 10;
			var numCols = 4;

			// Define the properties of the circles
			var circleRadius = 90;
			var circleSpacing = 200;

			// Loop through the rows and columns to create the circles
			var circles = [];

			for (var row = 0; row < numRows; row++) {
				for (var col = 0; col < numCols; col++) {
					var circleIndex = row * numCols + col + 1;
					var x = 125 + col * circleSpacing;
					var y = 350 + row * circleSpacing;

					var circle = paper.circle(x, y, circleRadius);
					circle.attr({
						fill: "white",
						stroke: "black",
						strokeWidth: 2
					});

					circles.push(circle);
				}
			}

			// Shuffle the image and label arrays
			this.jsPsych.randomization.shuffle(trial.imageArrayKey);
			this.jsPsych.randomization.shuffle(trial.circleArrayKey);

			// Create image and label dictionary
			var imageDict = {};
			var labelDict = {};

			for (var i = 0; i < trial.selection_learning.length; i++) {
				imageDict[trial.imageArrayKey[i]] = trial.selection_learning[i];
				labelDict[trial.circleArrayKey[i]] = trial.selection_labels[i];
			}

			// Display the circles and assign click event listeners
			var circleSet = paper.set();
			var circleDict = {};

			for (var i = 0; i < circles.length; i++) {
				var circle = circles[i];
				var circleKey = trial.circleArrayKey[i];

				circleSet.push(circle);
				circleDict[circleKey] = circle;

				circle.data("index", i);
				circle.data("key", circleKey);
				circle.data("selected", false);

				circle.click(function () {
					if (!advance) {
						var index = this.data("index");
						var key = this.data("key");
						var selected = this.data("selected");

						if (!selected) {
							choice = "selection";
							choiceIndex = index;
							choiceKey = key;
							choiceLabel = labelDict[key];
							choiceImage = imageDict[trial.imageArrayKey[index]];
							choiceCircle = this;

							// Set selected state and appearance
							this.data("selected", true);
							this.attr({
								fill: "lightblue"
							});
						} else {
							// Deselect the current choice
							choice = "NA";
							choiceIndex = "NA";
							choiceKey = "NA";
							choiceLabel = "NA";
							choiceImage = "NA";
							choiceCircle = "NA";

							// Reset appearance
							this.data("selected", false);
							this.attr({
								fill: "white"
							});
						}
					}
				});
			}

			// Display the question prompt
			display_element.innerHTML += `<p>${trial.question}</p>`;

			// Display the choices
			if (trial.choices && trial.choices.length > 0) {
				var choiceButtons = trial.choices.map(function (choice, index) {
					return trial.button_html.replace(/%choice%/g, choice);
				});

				display_element.innerHTML += '<div id="jspsych-test-buttons" class="jspsych-test-buttons">' + choiceButtons.join('') + '</div>';

				for (var i = 0; i < trial.choices.length; i++) {
					display_element.querySelector('#jspsych-test-buttons').querySelectorAll('.jspsych-btn')[i].addEventListener('click', function (e) {
						var choiceMade = trial.choices.indexOf(e.target.innerHTML);
						if (choiceMade === choiceIndex) {
							advance = true;
						}
					});
				}
			}

			// Record the start time of the trial
			var startTime = performance.now();

			// Function to end the trial
			var endTrial = function () {
				// Record the trial duration
				trialDuration = performance.now() - startTime;

				// Clear the display
				display_element.innerHTML = '';

				// Data to be saved
				var trial_data = {
					choice: choice,
					choice_index: choiceIndex,
					choice_key: choiceKey,
					choice_label: choiceLabel,
					choice_image: choiceImage,
					rt: trialDuration
				};

				// Move on to the next trial
				jsPsych.finishTrial(trial_data);
			};

			// Function to check if the required choice has been made and end the trial
			var checkChoice = function () {
				if (advance) {
					endTrial();
				} else {
					// Display an error message if required choice is not made
					display_element.innerHTML += '<p style="color: red;">Please make the required choice.</p>';
				}
			};

			// End trial if the trial_duration is set
			if (trial.trial_duration !== null) {
				jsPsych.pluginAPI.setTimeout(function () {
					checkChoice();
				}, trial.trial_duration);
			}

			// Add a button to manually end the trial
			display_element.innerHTML += '<button id="jspsych-html-button-response-next" class="jspsych-btn">Finish Trial</button>';

			// Event listener for the button
			display_element.querySelector('#jspsych-html-button-response-next').addEventListener('click', function () {
				checkChoice();
			});
		};
	}

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);
