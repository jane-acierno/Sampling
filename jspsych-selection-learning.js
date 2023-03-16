var jsPsychSelectionLearning = (function (jspsych) {
	"use strict";
  
	const info = {
		name: "selection-learning",
		parameters: {
			selection_learning: {
			type: jspsych.ParameterType.IMAGE,
			default: ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8'],
			},
			selection_learning: {
			type: jspsych.ParameterType.AUDIO,
			default: ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8'],
			},
		},
	};
  
	/**
	 * **PLUGIN-NAME**
	 *
	 * SHORT PLUGIN DESCRIPTION
	 *
	 * @author Martin Zettersten + Nathan Liang
	 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
	 */
	class SelectionLearningPlugin {
	  	constructor(jsPsych) {
			this.jsPsych = jsPsych;
		}
	  
	  	trial(display_element, trial) {

			// default values
			trial.canvas_size = trial.canvas_size || [1024, 700];
			trial.image_size = trial.image_size || [150, 150];
			trial.audio = trial.audio || "true";
			trial.question = trial.question || "Click on the person whose opinion you want to hear next.";
			trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;
			trial.duration = trial.duration || 1000;
			trial.imageArrayKey = trial.imageArrayKey || ["0","1","2","3","4","5","6","7"];
			trial.circleArrayKey = trial.circleArrayKey || ["0","1","2","3","4","5","6","7"];
			trial.imageArrayIndex = trial.imageArrayIndex || [0, 1, 2, 3, 4, 5, 6, 7];
			trial.circleArrayIndex = trial.circleArrayIndex || [0, 1, 2, 3, 4, 5, 6, 7];
			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
			trial.finalPause = trial.finalPause || 500;

			display_element.innerHTML += `<svg id='jspsych-test-canvas' width=${trial.canvas_size[0]} height=${trial.canvas_size[1]}></svg>`
			var paper = Snap("#jspsych-test-canvas");
			
			var choice = "NA";
			var choiceImage = "NA";
			var choiceCircle = "NA";
			var choiceIndex = "NA";
			var choiceKey = "NA";
			var choiceLabel = "NA";

			var randomChoice = "NA";
			var randomImage = "NA";
			var randomCircle = "NA";
			var randomIndex = "NA";
			var randomKey = "NA";
			var randomLabel = "NA";
			
			var rt = "NA";
			var learningImage = "NA";
			var learningStartRT = "NA";
			var trialDuration = "NA";
			var word1 = "NA";
			var word2 = "NA";
			var curImageArrayIndex = trial.imageArrayIndex;
			
			var circle1 = paper.circle(125, 350, 90);
			var circle2 = paper.circle(325, 350, 90);
			var circle3 = paper.circle(525, 350, 90);
			var circle4 = paper.circle(725, 350, 90);
			var circle5 = paper.circle(125, 550, 90);
			var circle6 = paper.circle(325, 550, 90);
			var circle7 = paper.circle(525, 550, 90);
			var circle8 = paper.circle(725, 550, 90);
			
			// create circle set and dict
			var circleSet = Snap.set(circle1, circle2, circle3, circle4, circle5, circle6, circle7, circle8);
			var circleDict = {0: circle1, 1: circle2,2: circle3, 3: circle4, 4: circle5, 5: circle6, 6: circle7, 7: circle8};
			
			circleSet.attr({
				fill: "#00ccff",
				stroke: "#000",
				strokeWidth: 5});
			
			var imageLocations = {
				pos1: [50, 275],
				pos2: [250, 275],
				pos3: [450, 275],
				pos4: [650, 275],
				pos5: [50, 475],
				pos6: [250, 475],
				pos7: [450, 475],
				pos8: [650, 475],
			};
			
			var topLeftCircle = paper.circle(275, 125, 90);
			topLeftCircle.attr({
				fill: "#FFD3D6",
				stroke: "#000",
				strokeWidth: 5,
				opacity: 0
			});
			
			var topRightCircle = paper.circle(575, 125, 90);
			topRightCircle.attr({
				fill: "#FFD3D6",
				stroke: "#000",
				strokeWidth: 5,
				opacity: 0
			});
	
			var imageLocationsLearning = {
				left: [200, 50],
				right: [500, 50]
			};
			
			var image1 = paper.image(trial.image1, imageLocations["pos1"][0], imageLocations["pos1"][1], trial.image_size[0],trial.image_size[1]);
			var image2 = paper.image(trial.image2, imageLocations["pos2"][0], imageLocations["pos2"][1], trial.image_size[0],trial.image_size[1]);
			var image3 = paper.image(trial.image3, imageLocations["pos3"][0], imageLocations["pos3"][1], trial.image_size[0],trial.image_size[1]);
			var image4 = paper.image(trial.image4, imageLocations["pos4"][0], imageLocations["pos4"][1], trial.image_size[0],trial.image_size[1]);
			var image5 = paper.image(trial.image5, imageLocations["pos5"][0], imageLocations["pos5"][1], trial.image_size[0],trial.image_size[1]);
			var image6 = paper.image(trial.image6, imageLocations["pos6"][0], imageLocations["pos6"][1], trial.image_size[0],trial.image_size[1]);
			var image7 = paper.image(trial.image7, imageLocations["pos7"][0], imageLocations["pos7"][1], trial.image_size[0],trial.image_size[1]);
			var image8 = paper.image(trial.image8, imageLocations["pos8"][0], imageLocations["pos8"][1], trial.image_size[0],trial.image_size[1]);
			
			var imageSet = Snap.set(image1, image2, image3, image4, image5, image6, image7, image8);
			var imageDict = {0: image1, 1: image2, 2: image3, 3: image4, 4: image5, 5: image6, 6: image7, 7: image8};
			
			var circleImageSet = Snap.set(
				circle1, circle2, circle3, circle4, circle5, circle6, circle7, circle8, 
				image1, image2, image3, image4, image5,	image6,	image7,	image8);
			
			//add prompt text
			//display_element.append(trial.question + trial.label + "?");
			var text = paper.text(425, 235, trial.question);
			text.attr({
				"text-anchor": "middle",
				"font-weight": "bold"
			});
			//create audio
			//var audio = new Audio(trial.audio);
			
			
			var start_time = (new Date()).getTime();
			var trial_data = {};
			
			image1.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle1.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 0;
				init_learning(choiceIndex, rt);
			});
	
			image2.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle2.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 1;
				init_learning(choiceIndex, rt);
			});
	
			image3.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle3.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 2;
				init_learning(choiceIndex, rt);
			});
	
			image4.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle4.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 3;
				init_learning(choiceIndex, rt);
			});
	
			image5.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle5.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 4;
				init_learning(choiceIndex, rt);
			});
	
			image6.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle6.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 5;
				init_learning(choiceIndex, rt);
			});
	
			image7.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle7.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 6;
				init_learning(choiceIndex, rt);
			});
	
			image8.click(function() {
				var end_time = (new Date()).getTime();
				rt = end_time - start_time;
				circle8.attr({
					fill: "#FFD3D6"
				});
				choiceIndex = 7;
				init_learning(choiceIndex, rt);
			});
			
			const init_learning = (choiceIndex, rt) => {
				image1.unclick();
				image2.unclick();
				image3.unclick();
				image4.unclick();
				image5.unclick();
				image6.unclick();
				image7.unclick();
				image8.unclick();
				
				// choice info
				choiceLabel = trial.stims[trial.stimNames[trial.curLocationList[choiceIndex]]]["word"];
				choice = trial.stims[trial.stimNames[trial.curLocationList[choiceIndex]]]["image"];
				choiceKey = trial.imageArrayIndex[choiceIndex];
				choiceImage = imageDict[choiceKey];
				choiceCircle = circleDict[choiceKey];
				
				// remove choice index (image that was chosen)
				curImageArrayIndex.splice(choiceIndex, 1);
				
				// make random choice
				randomIndex = this.jsPsych.randomization.sampleWithReplacement(curImageArrayIndex, 1)[0];
				randomKey = trial.imageArrayKey[randomIndex]
			
				// random choice info
				randomLabel = trial.stims[trial.stimNames[trial.curLocationList[randomIndex]]]["word"];
				randomChoice = trial.stims[trial.stimNames[trial.curLocationList[randomIndex]]]["image"];
				randomImage = imageDict[randomKey];
				randomCircle = circleDict[randomKey];
				
				// create images
				var limage1 = paper.image(
					choice, 
					imageLocationsLearning[trial.learningPos[0]][0], 
					imageLocationsLearning[trial.learningPos[0]][1], 
					trial.image_size[0],
					trial.image_size[1]
				);

				var limage2 = paper.image(
					randomChoice, 
					imageLocationsLearning[trial.learningPos[1]][0], 
					imageLocationsLearning[trial.learningPos[1]][1], 
					trial.image_size[0],
					trial.image_size[1]
				);

				// learning event
				learningImage = Snap.set(topRightCircle, topLeftCircle, limage1, limage2);
				learningImage.attr({opacity: 0});
				
				setTimeout(function () {

					// color random circle
					randomCircle.animate(
						{fill: "#FFD3D6"}, 500, function () {
							setTimeout(
								function () {

									//fade out choices
									text.animate({opacity: 0}, 500, mina.linear);
									circleImageSet.animate(
										{opacity: 0}, 500, mina.linear, function () {
											
											//fade in learning images
											learningImage.animate(
												{opacity: 1}, 500, mina.linear, function () {
													playLearningTrial();
												}
											);
										}
									);
								}, 
							500);
						}
					);
				}, 500);
			};
	
	
			function playLearningTrial () {
				
				var learningStartTime = (new Date()).getTime();
				
				// introduce learning instruction
				var learningInstr = paper.text(425, 20, trial.learningText);
				learningInstr.attr({
					opacity: 1,
					"text-anchor": "middle",
					"font-weight": "bold"
				});
				
				// define words
				if (trial.wordOrder == "choiceFirst") {
					word1 = choiceLabel;
					word2 = randomLabel;
				} else {
					word2 = choiceLabel;
					word1 = randomLabel;
				}
				var label1 = paper.text(425, 125, word1);
				label1.attr({
					opacity: 0,
					"text-anchor": "middle",
					"font-weight": "bold"
				});
				var label2 = paper.text(425, 125, word2);
				label2.attr({
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

				display_element.innerHTML += `<div id="jspsych-selection-learning-btngroup" class="center-content block-center"></div>`
				for (var i = 0; i < trial.choices.length; i++) {
					var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
					$('#jspsych-selection-learning-btngroup').append(
						$(str).attr('id', 'jspsych-selection-learning-button-' + i).data('choice', i).addClass('jspsych-selection-learning-button').on('click', function(e) {
						// disable all the buttons after a response
						$('.jspsych-selection-learning-button').off('click').attr('disabled', 'disabled');
							//hide button
						$('.jspsych-selection-learning-button').hide();
						var choice = $('#' + this.id).data('choice');
						var curTime = Date.now();
						var learningStartRT = curTime - learningStartTime;
						playAudio(label1, label2);})
					);
				};
			};
	
	
			function playAudio(label1,label2) {
				
				if (trial.audio == "true") {
					// create audio
					var audio1 = new Audio("stims/"+word1+".m4a");
					var audio2 = new Audio("stims/"+word2+".m4a");
				};
				
				label1.animate({opacity: 1}, 150, mina.linear, function() {
					if (trial.audio == "true") {
						audio1.play();
					};
					label1.animate({opacity: 1}, trial.duration, mina.linear, function() {
						label1.animate({opacity: 0}, 150, mina.linear, function() {
							label2.animate({opacity: 1}, 150, mina.linear, function() {
							if (trial.audio == "true") {
								audio2.play();
							};
							label2.animate({opacity: 1}, trial.duration, mina.linear, function() {
								label2.animate({opacity: 0}, 150,mina.linear, endTrial());
							});
						});
					});
				});
			});
			};
			
			const endTrial = () => {
				var final_time = (new Date()).getTime();
				trialDuration = final_time - start_time;
				var trial_data = {
					"image1": trial.image1,
					"image2": trial.image2,
					"image3": trial.image3,
					"image4": trial.image4,
					"image5": trial.image5,
					"image6": trial.image6,
					"image7": trial.image7,
					"image8": trial.image8,
					"choice": choiceIndex,
					"choiceImage": choice,
					"randomChoice": randomIndex,
					"randomImage": randomChoice,
					"learningLocationChoice": trial.learningPos[0],
					"learningLocationRandom": trial.learningPos[1],
					"choiceLabel":choiceLabel,
					"randomLabel":randomLabel,
					"word1": word1,
					"word2": word2,
					"rt": rt,
					"learningStartRT": learningStartRT,
					"trialDuration": trialDuration
				};
		
				setTimeout(function(){
					display_element.innerHTML = ``;
					this.jsPsych.finishTrial(trial_data);
				}, trial.finalPause);	
			};
		}
	}
	SelectionLearningPlugin.info = info;
  
	return SelectionLearningPlugin;
})(jsPsychModule);