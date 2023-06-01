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

	const defaultImages = [...Array(100)].map((_, i) => `image${i + 1}`);
	const defaultLabels = [...Array(100)].map((_, i) => `label${i + 1}`);

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

			// Instructions
			display_element.innerHTML +=
				`<div id="jspsych-instructions">
					<div style="margin-top: 50px; padding: 20px; background-color: #eee; border: black 2px solid; border-radius: 5px;">
					<strong>
						<h2>Sampling Task:</h2>
						<p>Now you can see what other people think. Click on any of the people below to see whether that person thinks the action described in the statement above is morally good or morally bad.</p>
					</strong>
					</div>
					<!-- <p id='prompt'><strong>Click on the person whose opinion you would like to read next.</strong></p> -->
					<br>
				</div>`


			// default values
			trial.image_size = trial.image_size || [150, 150];
			trial.question = trial.question || "Click on the person whose opinion you would like to hear next.";
			trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;
			trial.duration = trial.duration || 1000;	
			trial.imageArrayKey = trial.imageArrayKey || Array.from({ length: 100 }, (_, i) => i.toString());
			trial.circleArrayKey = trial.circleArrayKey || Array.from({ length: 100 }, (_, i) => i.toString());
			trial.imageArrayIndex = trial.imageArrayIndex || Array.from({ length: 100 }, (_, i) => i);
			trial.circleArrayIndex = trial.circleArrayIndex || Array.from({ length: 100 }, (_, i) => i);
			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
			trial.finalPause = trial.finalPause || 0;

			display_element.innerHTML += `<svg id='jspsych-test-canvas' width=150% height="5012px"></svg>`
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

			// Create a snap set by pushing to circleSet and populate circleDict with circles 1-100

			// Define the dimensions of the grid
			var numRows = 20; var numCols = 5;

			// Define the properties of the circles
			var circleRadius = 90; var circleSpacing = 200;

			// Loop through the rows and columns to create the circles
			var circles = [];

			for (var row = 0; row < numRows; row++) {
				for (var col = 0; col < numCols; col++) {
					var circleIndex = row * numCols + col + 1;
					var x = 125 + col * circleSpacing;
					var y = 350 + row * circleSpacing;
					var circleName = "circle" + circleIndex;
					window[circleName] = paper.circle(x, y, circleRadius);
					circles.push(window[circleName]);
				}
			}

			var circleSet = Snap.set.apply(null, circles);


			var circleDict = {};
			for (var i = 1; i <= 100; i++) {
				var circleName = "circle" + i;
				circleDict[i - 1] = window[circleName];
			}

			circleSet.attr({
				fill: "#0275d8",
				stroke: "#000",
				strokeWidth: 5
			});

			var imageLocations = {};

			for (var i = 1; i <= 100; i++) {
				var row = Math.ceil(i / 5);
				var col = ((i - 1) % 5) + 1;
				var posX = 200 * col - 150;
				var posY = 200 * row + 75;
				imageLocations["pos" + i] = [posX, posY];
			}

			var images = [];

			for (var i = 1; i <= 100; i++) {
				window['image' + i] = paper.image(
					trial['image' + i],
					imageLocations['pos' + i][0],
					imageLocations['pos' + i][1],
					trial.image_size[0],
					trial.image_size[1]
				);
				images.push(window[imageName]);
			}

			var imageSet = Snap.set.apply(null, images);


			var imageDict = {};
			for (var i = 1; i <= 100; i++) {
				var imageName = "image" + i;
				imageDict[i - 1] = window[imageName];
			}

			var circleImageSet = Snap.set(
				...Object.keys(circleDict).slice(0, 100).map(key => circleDict[key]),
				...Object.keys(imageDict).slice(0, 100).map(key => imageDict[key]),
			);


			// Prompt Text
			var prompt = paper.text(425, 235, trial.question);
			prompt.attr({
				"text-anchor": "middle",
				"font-weight": "bold"
			});

			var start_time = (new Date()).getTime();
			var trial_data = {};



			let profileImage;
			let profileCircle;
			let sentence;


			const initLearning = (choiceIndex, rt) => {

				// choice info
				choiceLabel = trial.stims[trial.stimNames[trial.currentLocationList[choiceIndex]]]["word"];
				choice = trial.stims[trial.stimNames[trial.currentLocationList[choiceIndex]]]["image"];
				choiceKey = trial.imageArrayIndex[choiceIndex];
				choiceImage = imageDict[choiceKey];
				choiceCircle = circleDict[choiceKey];

				// create circles
				profileCircle = paper.circle(275, 125, 90);

				profileCircle.attr({
					fill: "#5cb85c",
					stroke: "#000",
					strokeWidth: 5,
					opacity: 0,
				});

				// create images
				profileImage = paper.image(
					choice,
					200, 50,
					trial.image_size[0],
					trial.image_size[1]
				);

				// define words
				sentence = paper.text(425, 125, choiceLabel);
				sentence.attr({
					opacity: 0,
					"text-anchor": "right",
					"font-weight": "bold"
				});

				// learning event
				learningImage = Snap.set(
					profileCircle, profileImage, // outline circle + profile picture
					sentence
				);

				learningImage.attr({ opacity: 0 });

				setTimeout(function () {

					// fade out choices
					prompt.animate({ opacity: 0 }, 500, mina.linear);

					circleImageSet.animate(
						{ opacity: 0.2 }, 500, mina.linear, function () {

							// fade in learning images
							learningImage.animate(
								{ opacity: 1 }, 500, mina.linear, function () {
									playLearningTrial();
								}
							);
						}
					);

				}, 500);


			};

			function playLearningTrial() {

				var learningStartTime = (new Date()).getTime();


				// introduce learning instruction
				var learningInstr = paper.text(425, 20, trial.learningText);
				learningInstr.attr({
					opacity: 1,
					"text-anchor": "middle",
					"font-weight": "bold"
				});

				// define words
				var sentence = paper.text(425, 125, choiceLabel);
				sentence.attr({
					opacity: 0,
					"text-anchor": "middle",
					"font-weight": "bold"
				});

				//display buttons
				var buttons = [];
				if (Array.isArray(trial.button_html)) {
					if (trial.button_html.length == trial.choices.length) {
						buttons = trial.button_html;
					} else {
						console.error('Error in selection-learning plugin. The length of the button_html array does not equal the length of the choices array');
					}
				}
				else {
					for (var i = 0; i < trial.choices.length; i++) {
						buttons.push(trial.button_html);
					}
				}

				setTimeout(function () {
					var divElement = document.createElement('div');
					divElement.id = 'jspsych-selection-learning-btngroup';
					divElement.className = 'center-content block-center';

					divElement.style.textAlign = "center";
					divElement.style.margin = "200px";
					// TODO: Prevent multiple clicks


					// var svgElement = document.getElementById("jspsych-target");
					// var upperDisplayElement = svgElement.parentNode;

					var referenceElement = display_element.firstChild;
					display_element.insertBefore(divElement, referenceElement)

					for (var l = 0; l < trial.choices.length; l++) {
						var str = buttons[l].replace(/%choice%/, trial.choices[l]);
						$('#jspsych-selection-learning-btngroup').append(
							$(str).attr('id', 'jspsych-selection-learning-button-' + l).data('choice', l).addClass('jspsych-selection-learning-button').on('click', function (e) {
								// disable all the buttons after a response
								$('.jspsych-selection-learning-button').off('click').attr('disabled', 'disabled');
								// hide button
								$('.jspsych-selection-learning-button').hide();
								choice = $('#' + this.id).data('choice');


								var curTime = Date.now();
								var learningStartRT = curTime - learningStartTime;

							})
						);
					};
					$('#jspsych-selection-learning-button-0').on('click', function (e) {
						circleImageSet.animate(
							{ opacity: 1 }, 500, mina.linear, function () {

								// fade in learning images
								learningImage.remove();

								setTimeout(function () {
									prompt.animate({ opacity: 1 }, 500, mina.linear);
								}, 500);
							}
						);

					});

					$('#jspsych-selection-learning-button-1').on('click', function (e) {
						endTrial();
					});

				}, 1000);
			};

			var images = Array.from({length: 100}, (_, i) => eval(`image${i+1}`));
			var circles = Array.from({length: 100}, (_, i) => eval(`circle${i+1}`));


			for (var i = 0; i < images.length; i++) {
				(function (index) {
					images[index].click(function () {
					var end_time = (new Date()).getTime();
					var rt = end_time - start_time;
					circles[index].attr({
						fill: "#5cb85c"
					});
					var choiceIndex = index;
					initLearning(choiceIndex, rt);
					});
				})(i);
			}
			


			const endTrial = () => {
				var final_time = (new Date()).getTime();
				trialDuration = final_time - start_time;
				var trial_data = {
					"choiceLabel": choiceLabel,
					"image1": trial.image1,
					"image2": trial.image2,
					"image3": trial.image3,
					"image4": trial.image4,
					"image5": trial.image5,
					"image6": trial.image6,
					"image7": trial.image7,
					"image8": trial.image8,
					"learningLocationChoice": trial.learningPos[0],
					"rt": rt,
					"learningStartRT": learningStartRT,
					"trialDuration": trialDuration
				};

				setTimeout(function () {
					jsPsych.finishTrial(trial_data);
				}, trial.finalPause);
			};
		};
	};

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);