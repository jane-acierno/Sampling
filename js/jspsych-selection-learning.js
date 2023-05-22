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
			var numRows = 10; var numCols = 4;

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
			for (var i = 1; i <= 40; i++) {
				var circleName = "circle" + i;
				circleDict[i - 1] = window[circleName];
			}

			circleSet.attr({
				fill: "#0275d8",
				stroke: "#000",
				strokeWidth: 5
			});

			var imageLocations = {};

			for (var i = 1; i <= 40; i++) {
				var row = Math.ceil(i / 4);
				var col = ((i - 1) % 4) + 1;
				var posX = 200 * col - 150;
				var posY = 200 * row + 75;
				imageLocations["pos" + i] = [posX, posY];
			}

			var images = [];

			for (var i = 1; i <= 40; i++) {
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
			for (var i = 1; i <= 40; i++) {
				var imageName = "image" + i;
				imageDict[i - 1] = window[imageName];
			}

			var circleImageSet = Snap.set(
				...Object.keys(circleDict).slice(0, 40).map(key => circleDict[key]),
				...Object.keys(imageDict).slice(0, 40).map(key => imageDict[key]),
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
				choiceLabel = trial.stims[trial.stimNames[trial.curLocationList[choiceIndex]]]["word"];
				choice = trial.stims[trial.stimNames[trial.curLocationList[choiceIndex]]]["image"];
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

			image1.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle1.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 0;
				initLearning(choiceIndex, rt);
			});

			image2.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle2.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 1;
				initLearning(choiceIndex, rt);
			});

			image3.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle3.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 2;
				initLearning(choiceIndex, rt);
			});

			image4.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle4.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 3;
				initLearning(choiceIndex, rt);
			});

			image5.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle5.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 4;
				initLearning(choiceIndex, rt);
			});

			image6.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle6.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 5;
				initLearning(choiceIndex, rt);
			});

			image7.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle7.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 6;
				initLearning(choiceIndex, rt);
			});

			image8.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle8.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 7;
				initLearning(choiceIndex, rt);
			});

			image9.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle9.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 8;
				initLearning(choiceIndex, rt);
			});

			image10.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle10.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 9;
				initLearning(choiceIndex, rt);
			});


			image11.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle11.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 10;
				initLearning(choiceIndex, rt);
			});

			image12.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle12.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 11;
				initLearning(choiceIndex, rt);
			});

			image13.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle13.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 12;
				initLearning(choiceIndex, rt);
			});

			image14.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle14.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 13;
				initLearning(choiceIndex, rt);
			});

			image15.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle15.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 14;
				initLearning(choiceIndex, rt);
			});

			image16.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle16.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 15;
				initLearning(choiceIndex, rt);
			});

			image17.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle17.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 16;
				initLearning(choiceIndex, rt);
			});

			image18.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle18.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 17;
				initLearning(choiceIndex, rt);
			});

			image19.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle19.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 18;
				initLearning(choiceIndex, rt);
			});

			image20.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle20.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 10;
				initLearning(choiceIndex, rt);
			});

			image21.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle21.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 20;
				initLearning(choiceIndex, rt);
			});

			image22.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle22.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 21;
				initLearning(choiceIndex, rt);
			});

			image23.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle23.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 22;
				initLearning(choiceIndex, rt);
			});

			image24.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle24.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 23;
				initLearning(choiceIndex, rt);
			});

			image25.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle25.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 24;
				initLearning(choiceIndex, rt);
			});

			image26.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle26.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 25;
				initLearning(choiceIndex, rt);
			});

			image27.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle27.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 26;
				initLearning(choiceIndex, rt);
			});

			image28.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle28.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 27;
				initLearning(choiceIndex, rt);
			});

			image29.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle29.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 28;
				initLearning(choiceIndex, rt);
			});

			image30.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle30.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 29;
				initLearning(choiceIndex, rt);
			});


			image31.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle31.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 30;
				initLearning(choiceIndex, rt);
			});

			image32.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle32.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 31;
				initLearning(choiceIndex, rt);
			});

			image33.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle33.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 32;
				initLearning(choiceIndex, rt);
			});

			image34.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle34.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 33;
				initLearning(choiceIndex, rt);
			});

			image35.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle35.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 34;
				initLearning(choiceIndex, rt);
			});

			image36.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle36.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 35;
				initLearning(choiceIndex, rt);
			});

			image37.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle37.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 36;
				initLearning(choiceIndex, rt);
			});

			image38.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle38.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 37;
				initLearning(choiceIndex, rt);
			});

			image39.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle39.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 38;
				initLearning(choiceIndex, rt);
			});

			image40.click(function () {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle40.attr({
					fill: "#5cb85c"
				});
				choiceIndex = 39;
				initLearning(choiceIndex, rt);
			});


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
					this.jsPsych.finishTrial(trial_data);
				}, trial.finalPause);
			};
		};
	};

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);


