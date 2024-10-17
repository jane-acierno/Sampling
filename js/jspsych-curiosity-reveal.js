var jsPsychCuriosityReveal = (function (jspsych) {
	"use strict";

	/**
	 * **CURIOSITY TASK**
	 *
	 * SHORT PLUGIN DESCRIPTION
	 *
	 * @author Nathan Liang
	 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
	 */

	const info = {
		name: "curiosity-reveal",
		parameters: {
			choices: {
				type: jspsych.ParameterType.STRING,
				pretty_name: "Choices",
				default: undefined,
				array: true,
			},
			choicesOnFinish: {
				type: jspsych.ParameterType.STRING,
				pretty_name: "Choices on Finish",
				default: undefined,
				array: true,
			}
		}
	};

	class CuriosityRevealPlugin {
		constructor(jsPsych) {
			this.jsPsych = jsPsych;
		};

		trial(display_element, trial) {
			display_element.innerHTML +=
				// Pt. 1: Instructions
				`<section id="curiosity-instructions">
					<h2>Reveal True Values</h2>
					<p>
						Now you have the option to view the 
						<strong>true average value</strong><br>
						of people's ratings of each of the 
						${trials.length} statements you saw.
					</p>
					<p style="font-size: 12pt;">
						You can click on any of the statements below to reveal ratings of its true average value. 
						You can select to view all of the averages, just one or two, or none. 
						If you do not want to see the averages, please click the continue button 
						at the bottom of the page to advance.
					</p>
				</section>` +

				// Pt. 2: Popup On Clicking Any Box
				`<section id="trial-presentation-space" class="popup"></section><div id="overlay"></div>` +

				// Pt. 3: Clickable Boxes
				`<section class="box-container-wrapper">
				<div class="box-container" id="true-value-boxes-grid"></div>
				</section>` +

				// Pt. 4: Navigation Buttons
				`<div id="jspsych-curiosity-advance-btngroup" class="center-content block-center"></div>`;
				
			// Ratings
			const trueRatingsDict = {
				0: 70.72, // Roentgen
				1: 49.09, // Akon
				2: 74.86, // Gandhi
				3: 58.93, // Lovelace
				4: 63.50  // Turing
			};

			const trialPresentationSpace = $('#trial-presentation-space');

			// Generate parent container grid for clickable boxes
			const boxesGrid = $('#true-value-boxes-grid');

			// Populate parent container with boxes
			for (let i = 0; i < trials.length; i++) {
				const statementBox = $(`
					<div id="box${i}">
						<div class="quote clickable">
							<h2>Trial ${i + 1}</h2>
							<blockquote>${statements[trials[i]]}</blockquote>
						</div>
					</div>
				`);
				boxesGrid.append(statementBox);
			};

			
			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
			



			// RECORD DATA
			let boxSelections = [];

			// Track number of clicks
			let boxSelectionFlag = [false, false, false];
			
			// Reaction times for clicking on boxes
			let clickRtArray = [];

			// Reaction times for viewing each box
			let viewRtArray = [];

			// True average ratings to display as static sliders for each trial
			let sliderRatings = [];
			
			for (let i = 0; i < trials.length; i++) {
				sliderRatings.push(trueRatingsDict[trials[i]]);
			};

			let buttons = [];
			if (Array.isArray(trial.button_html)) {
				if (trial.button_html.length == trial.choices.length) {
					buttons = trial.button_html;
				};
			} else {
				for (let i = 0; i < trial.choices.length; i++) {
					buttons.push(trial.button_html);
				};
			};
			
			// Scroll to top on load
			window.onload = function() {
				window.scrollTo(0, 0);
			};



			var advanceButton = `<button class="jspsych-btn"><i class='fa-solid fa-circle-check' style='color: green'></i>&nbsp;&nbsp;I'm all done</button>`
			$('#jspsych-curiosity-advance-btngroup').append(
				$(advanceButton).attr('id', 'jspsych-curiosity-advance-btn')
					.data('choice', 1)
					.addClass('jspsych-curiosity-advance-btngroup')
					.on('click', function (e) {
						endTrial();
					})
			);

			let startTime = (new Date()).getTime();
			
			const initReveal = (boxIndex) => {

				// RT: START STOPWATCH (VIEW)
				let viewTic = (new Date()).getTime();

				$('#overlay').fadeIn();
				trialPresentationSpace.empty();
				trialPresentationSpace.fadeIn();

				const trialFormat = $(`<div id="trial-format"></div>`);
				const trialFeedback = $(`<div id="selection-buttons"></div>`);
				const boxContainer = $('<div id="box-container"></div>');

				let ratingPrompt = null;
				let textDownRating = null;
				let textUpRating = null;

				ratingPrompt = "How morally good or morally bad do you think this action is?"
				textDownRating = "Extremely morally bad";
				textUpRating = "Extremely morally good";

				const labelElement = $('<label>', {
					for: "rating-slider",
				}).text(ratingPrompt);

				const inputElement = $('<input>', {
					name: 'rating-slider',
					type: 'range',
					class: 'jspsych-slider bipolar-clicked unclickable',
					value: trueRatingsDict[trials[boxIndex]],
					min: 0, max: 100, step: 1,
					id: 'rating-slider',
					oninput: `
						this.classList.remove('bipolar-clicked');
						$('#rating-slider').addClass('fade-out');
					`,
					disabled: true
				});

				const sliderRating = $('<div>', {
					style: 'position: relative;'
				}).append(
					labelElement,
					inputElement,
					$('<br>'),
					$('<span>', {
						style: 'position: absolute; left: 0; font-size: 10pt;',
						text: textDownRating
					}),
					$('<span>', {
						style: 'position: absolute; right: 0; font-size: 10pt;',
						text: textUpRating
					})
				);


				const value = trueRatingsDict[trials[boxIndex]];
				const percentage = value; // Assuming this is already a percentage

				const bigNumber = $(`
					<div class="circle-container">
						<svg class="circle-svg" width="150" height="150" viewBox="0 0 36 36">
							<path class="circle-bg"
									d="M18 2.0845
									a 15.9155 15.9155 0 0 1 0 31.831
									a 15.9155 15.9155 0 0 1 0 -31.831"/>
							<path class="circle-progress"
									d="M18 2.0845
									a 15.9155 15.9155 0 0 1 0 31.831
									a 15.9155 15.9155 0 0 1 0 -31.831"/>
						</svg>					
						<h1 class="big-number">
							<i class="fa-solid fa-people-group"></i><br>
							${value.toFixed(2)}
						</h1>
					</div>`);

				// Append the bigNumber to the trialFormat first
				trialFormat.append(bigNumber, sliderRating);

				// Allow the DOM to update first, then animate
				setTimeout(() => {
					const circleProgress = bigNumber.find('.circle-progress');
					const dashArrayValue = (percentage / 100) * 100; // Calculate the stroke-dasharray value
					circleProgress.css('stroke-dasharray', `${dashArrayValue}, 100`);
				}, 0);

				trialPresentationSpace.html(`<div><h3>True Average Value</h3></div>`);
				trialPresentationSpace.append(trialFormat);

				boxContainer.addClass('fade-out-partial');

				setTimeout(function () {

					let buttons = [];
					if (Array.isArray(trial.button_html)) {
						if (trial.button_html.length == trial.choices.length) {
							buttons = trial.button_html;
						};
					} else {
						for (let i = 0; i < trial.choices.length; i++) {
							buttons.push(trial.button_html);
						};
					};
					trialPresentationSpace.html(`<h3>True Average Value</h3>`)
					trialPresentationSpace.append(trialFormat);

					trialFeedback.html(`
						<hr></hr>
						<p>Would you like to view the true average value for another trial?</p>
						<div id="jspsych-selection-learning-btngroup" class="center-content block-center"></div>`
					);

					trialPresentationSpace.append(trialFeedback);

					for (let l = 0; l < trial.choices.length; l++) {
						var str = buttons[l].replace(/%choice%/, trial.choices[l]);
						$('#jspsych-selection-learning-btngroup').append(
							$(str).attr('id', 'jspsych-selection-learning-button-' + l)
								.data('choice', l)
								.addClass('jspsych-selection-learning-button')
								.on('click', function (e) {

									// disable all the buttons after a response
									$('.jspsych-selection-learning-button').off('click')
										.attr('disabled', 'disabled');

									// hide button
									$('.jspsych-selection-learning-button').hide();
									let choice = $('#' + this.id).data('choice');
								})
						);
					};

					// Click view others
					$('#jspsych-selection-learning-button-0').on('click', function (e) {
						let viewToc = (new Date()).getTime();
						let viewRt = viewToc - viewTic;
						viewRtArray.push(viewRt);

						// RT: STOP STOPWATCH (CLICK)
						let clickToc = (new Date()).getTime();
						let clickRt = clickToc - (startTime + clickRtArray.reduce((acc, curr) => acc + curr, 0) + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						clickRtArray.push(clickRt);
						console.log(clickRtArray);

						$('#overlay').fadeOut();
						trialPresentationSpace.html(`<div id="trial-format"></div><div id="selection-format"></div>`).empty().hide();
						trialFormat.html('<div id="trial-format"></div>');
						trialFeedback.html('<div id="selection-buttons"></div>');
						
						// Fade the prompt back in
						if (boxSelectionFlag.every((val, index) => val === [true, true, true][index])) {

							const reviewButton = `<button class="jspsych-btn"><i class='fa-solid fa-rotate-left'></i>&nbsp;&nbsp;View again</button>`
							
							$('#jspsych-curiosity-advance-btngroup').append(
								$(reviewButton).attr('id', 'jspsych-curiosity-review-btn')
									.data('choice', 1)
									.addClass('jspsych-curiosity-review-btn')
									.on('click', function (e) {
										for (let boxIndex = 0; boxIndex <= 3; boxIndex++) {									
											$("#box" + boxIndex + " > div").css("background-color", "rgba(238, 238, 238, 1)");  // Fades background color back in
											$("#box" + boxIndex + " > div").css("color", "rgba(0, 0, 0, 1)");  // Fades background text back in 
											$("#box" + boxIndex + " > div").css("border-color", "rgba(0, 0, 0, 1)");  // Fades background text back in
										};
										$("#jspsych-curiosity-review-btn").remove();
										boxSelectionFlag = [false, false, false];

										for (let j = 0; j < trials.length; j++) {
											$("#box" + j).removeClass('disabled');
										};
									})
							);

							$('#jspsych-selection-learning-button-1').on('click', function (e) {
								endTrial();
							});

						} else {
							// Fade the selection options back in
							boxContainer.removeClass('fade-out-partial')
								.addClass('fade-in');
							reattachEventListeners();
						}
					});

					// Click advance
					$('#jspsych-selection-learning-button-1').on('click', function (e) {
						let viewToc = (new Date()).getTime();
						let viewRt = viewToc - viewTic;
						viewRtArray.push(viewRt);
						endTrial();
					});

				}, 1000); // changed this from 5000 to 3000 for the pilot because it feels very long, now 1000

			};


			const clickHandlers = {};
			let currentSelection = null; // Track the current selection

			for (let i = 0; i < trials.length; i++) {
				(function (i) {
					
					let boxIndex = i
					let isRevealInProgress = false; // Flag variable
					const clickHandler = function () {

						if (currentSelection !== boxIndex) {
							boxSelections.push(boxIndex); // Push box index to selections
							boxSelectionFlag[boxIndex] = true; // Set flag to true
							currentSelection = boxIndex; // Update current selection
						}

						if (!isRevealInProgress && !this.classList.contains('disabled')) {


							isRevealInProgress = true; // Set flag to indicate learning is in progress

							// Disable other boxes
							for (let j = 0; j < trials.length; j++) {
								$("#box" + j).addClass('disabled');
							};

							$("#box" + boxIndex + " > div").css("background-color", "rgba(238, 238, 238, 0.5)");  // Fades background color
							$("#box" + boxIndex + " > div").css("color", "rgba(0, 0, 0, 0.25)");  // Fades background text
							$("#box" + boxIndex + " > div").css("border-color", "rgba(0, 0, 0, 0.25)");  // Fades background text
							
							// Start trial
							initReveal(boxIndex);
							isRevealInProgress = false;
						}
					};

					$("#box" + boxIndex).on('click', clickHandler);
					clickHandlers[i] = clickHandler;

				})(i);
			}

			// Function to reattach event listeners
			function reattachEventListeners() {
				for (let i = 0; i < trials.length; i++) {
					$("#box" + i)
						.removeClass('disabled')
						.on('click', clickHandlers[i]);
				}
				currentSelection = null; // Reset current selection for new phase
			}

			const endTrial = () => {
				// Clear the DOM
				display_element.innerHTML = "";

				// Record the final time
				const finalTime = (new Date()).getTime();
				const taskDuration = finalTime - startTime;
				const trial_data = {
					"box_selections": boxSelections.join(','),
					"click_rt_array": clickRtArray.join(','),
					"view_rt_array": viewRtArray.join(','),
					"task_duration": taskDuration
				};
				jsPsych.finishTrial(trial_data);
			};
		};
	};

	CuriosityRevealPlugin.info = info;

	return CuriosityRevealPlugin;
})(jsPsychModule);