var jsPsychSelectionLearning = (function (jspsych) {
	"use strict";

	/**
	 * **SELECTION LEARNING**
	 *
	 * SHORT PLUGIN DESCRIPTION
	 *
	 * @author Nathan Liang
	 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
	 */

	// Default values for images / labels: ["image1", "image2", ..., "imageN"]
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
		};

		trial(display_element, trial) {
			display_element.innerHTML +=
				// Pt. 1: Box
				`<div id="jspsych-instructions">
					<div class="quote">
						<h2>Search Task</h2>
						<p>
							Now you can see what other people think.
							Click on an avatar to see that person's opinion on the following sentence:
						</p>
						<blockquote>
							${trial.statement}
						</blockquote>
					</div>
				</div>` +

				// Pt. 2: Box
				`<section id="trial-presentation-space" class="popup"></section><div id="overlay"></div>` +

				// Pt. 3: Prompt
				`<div id="prompt-container"></div>` +

				// Pt. 4: Avatar Grid
				`<div class="grid-container-wrapper">
					<div class="grid-container" id="avatar-grid"></div>
				</div>` +

				// Pt. 5: Navigation Button
				`<div id="jspsych-selection-advance-btngroup" class="center-content block-center"></div>`;

			// Ratings
			const selectionRatingsDict = {
				// <!-- Q12: Roentgen -->
				moralRatingsQ12: [
					0, 3, 4, 27, 30, 42, 43, 45, 46, 47, 
					48, 49, 51, 51, 52, 52, 52, 53, 53, 54,
					54, 56, 57, 57, 58, 58, 60, 60, 60, 60, 
					61, 61, 62, 62, 63, 63, 64, 64, 64, 65, 
					66, 67, 68, 68, 68, 70, 71, 72, 73, 73, 
					73, 74, 74, 75, 75, 75, 75, 77, 77, 77, 
					78, 78, 78, 78, 79, 79, 80, 81, 82, 82, 
					82, 82, 83, 84, 85, 86, 86, 89, 89, 91, 
					91, 93, 95, 95, 96, 96, 97, 98, 100, 100, 
					100, 100, 100, 100, 100, 100, 100, 100, 100, 100
				],

				// <!-- Q26 -->
				moralRatingsQ26: [
					0, 2, 3, 3, 6, 7, 9, 14, 15, 16, 
					17, 18, 19, 20, 21, 22, 25, 25, 26, 27,
					27, 28, 29, 31, 34, 34, 35, 38, 39, 39, 
					40, 40, 41, 42, 42, 43, 44, 44, 45, 46, 
					47, 47, 47, 47, 48, 48, 48, 49, 49, 49, 
					49, 49, 50, 50, 50, 51, 51, 52, 52, 52, 
					52, 53, 54, 55, 55, 57, 58, 58, 59, 61, 
					62, 62, 63, 63, 65, 66, 66, 67, 67, 68, 
					69, 70, 70, 70, 73, 74, 75, 76, 78, 79, 
					83, 83, 85, 88, 92, 94, 99, 99, 100, 100
				],

				// <!-- Q27 -->
				moralRatingsQ27: [
					100, 86, 69, 44, 64, 71, 84, 56, 61, 51,
					57, 51, 78, 82, 91, 100, 85, 60, 67, 94,
					65, 87, 90, 58, 78, 64, 58, 76, 62, 89,
					87, 97, 77, 78, 98, 47, 78, 96, 48, 81,
					88, 86, 100, 78, 65, 69, 71, 73, 46, 56,
					56, 100, 69, 92, 82, 94, 87, 62, 60, 82,
					96, 90, 60, 99, 96, 79, 83, 65, 95, 70,
					66, 90, 78, 84, 49, 54, 75, 80, 76, 74,
					50, 72, 87, 71, 74, 55, 70, 67, 83, 100,
					49, 67, 66, 82, 66, 80, 75, 80, 75, 77
				],

				// <!-- Q29 -->
				moralRatingsQ29: [
					44, 46, 47, 48, 49, 49, 50, 51, 51, 54,
					55, 56, 56, 56, 57, 58, 58, 60, 60, 60, 
					61, 62, 62, 64, 64, 65, 65, 65, 66, 66, 
					66, 67, 67, 67, 69, 69, 69, 70, 70, 71, 
					71, 71, 72, 73, 74, 74, 75, 75, 75, 76, 
					76, 77, 77, 78, 78, 78, 78, 78, 78, 79, 
					80, 80, 80, 81, 82, 82, 82, 82, 83, 83, 
					84, 84, 85, 86, 86, 87, 87, 87, 87, 88, 
					89, 90, 90, 90, 91, 92, 94, 94, 95, 96, 
					96, 96, 97, 98, 99, 100, 100, 100, 100, 100
				],

				// <!-- Q30 -->
				moralRatingsQ30: [
					4, 5, 8, 14, 16, 16, 18, 19, 25, 25, 
					26, 26, 28, 32, 34, 35, 45, 47, 48, 48,
					48, 49, 49, 49, 49, 49, 49, 49, 49, 50, 
					50, 50, 51, 52, 52, 53, 54, 55, 57, 58, 
					60, 61, 62, 63, 63, 63, 64, 64, 64, 64, 
					65, 65, 65, 66, 67, 69, 70, 70, 70, 70, 
					72, 73, 73, 75, 76, 77, 78, 79, 80, 80, 
					81, 81, 82, 82, 82, 83, 83, 85, 85, 86, 
					88, 88, 89, 89, 89, 89, 93, 95, 95, 97, 
					99, 100, 100, 100, 100, 100, 100, 100, 100, 100
				]
			};

			const trialPresentationSpace = $('#trial-presentation-space');

			// randomizedAvatarNumberArray = [1, 2, 3, ..., 100]
			const randomizedAvatarNumberArray = jsPsych.randomization.shuffle([...Array(100).keys()].map(x => x + 1));

			// Generate circles
			const avatarGrid = $('#avatar-grid');
			for (let i = 0; i < randomizedAvatarNumberArray.length; i++) {
				const avatarCircle = $(`<div class='avatar-circle clickable' id='circle${randomizedAvatarNumberArray[i]}'></div>`);
				avatarGrid.append(avatarCircle);
				const circleId = $(`#circle${randomizedAvatarNumberArray[i]}`);
				const avatarPhoto = $(`<img class='avatar-photo' src='./avatars/avatar${randomizedAvatarNumberArray[i]}.webp'>`);
				circleId.append(avatarPhoto);
			};

			// Pull ratings array depending on condition and trial statement
			var selectionRatings = {
				0: jsPsych.randomization.shuffle(selectionRatingsDict['moralRatingsQ12']),
				1: jsPsych.randomization.shuffle(selectionRatingsDict['moralRatingsQ26']),
				2: jsPsych.randomization.shuffle(selectionRatingsDict['moralRatingsQ27']),
				3: jsPsych.randomization.shuffle(selectionRatingsDict['moralRatingsQ29']),
				4: jsPsych.randomization.shuffle(selectionRatingsDict['moralRatingsQ30'])
			}

			// Pt. 3: Prompt
			const samplingPromptContainer = $('#prompt-container');
			samplingPromptContainer.html(`
				<strong id="samplingPrompt" style="text-transform: uppercase;">
					click on the person whose opinion you would like to read next
				</strong>
				<br>
				(SCROLL TO VIEW MORE)
				<br>`
			);

			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';

			let avatarSelections = [];
			let avatarPositionIndices = [];
			let avatarPositionXIndices = [];
			let avatarPositionYIndices = [];

			// Reaction times for clicking on boxes
			let clickRtArray = [];

			// Reaction times for viewing each box
			let viewRtArray = [];

			// All possible data
			let sliderRatings = [];

			// Actual revealed values
			let selectedSliderRatings = [];
			
			for (let i = 0; i < randomizedAvatarNumberArray.length; i++) {
				sliderRatings.push(selectionRatings[trials[trial.trialIndex]][i]);
			};

			var advanceButton = `<button class="jspsych-btn"><i class='fa-solid fa-circle-check' style='color: green'></i>&nbsp;&nbsp;I'm all done</button>`
			$('#jspsych-selection-advance-btngroup').append(
				$(advanceButton).attr('id', 'jspsych-selection-advance-btn')
					.data('choice', 1)
					.addClass('jspsych-selection-advance-btn')
					.on('click', function (e) {
						endTrial();
					})
			);

			let startTime = (new Date()).getTime();

			const initLearning = (avatarIndex, avatarNumber) => {
				// RT: START STOPWATCH (VIEW)
				let viewTic = (new Date()).getTime();

				$('#overlay').fadeIn();
				trialPresentationSpace.empty();
				trialPresentationSpace.fadeIn();

				const trialFormat = $(`<div id="trial-format"></div>`);
				const trialFeedback = $(`<div id="selection-buttons"></div>`);
				const avatarContainer = $('<div id="avatar-container"></div>')

				// Create a new circle to hold the chosen avatar
				// Add it to the presentation space
				const avatarCircleSelection = $('<div></div>', {
					class: 'avatar-circle',
					id: `circle${avatarNumber}`
				}).appendTo(avatarContainer);

				// Create copy of the chosen avatar photo
				// Add it inside the avatar circle
				$('<img>', {
					src: `./avatars/avatar${avatarNumber}.webp`,
					class: 'avatar-photo'
				}).appendTo(avatarCircleSelection);

				let ratingPrompt = "How morally good or morally bad do you think this action is?"
				let textDownRating = "Extremely morally bad";
				let textUpRating = "Extremely morally good";

				const labelElement = $('<label>', {
					for: "rating-slider",
				}).text(ratingPrompt);

				const inputElement = $('<input>', {
					id: 'rating-slider',
					class: 'jspsych-slider bipolar-clicked',
					name: 'rating-slider',
					type: 'range',
					value: sliderRatings[avatarIndex],
					min: 0, max: 100, step: 1,
					disabled: true
				});

				const sliderRating = $('<div>', {
					style: 'position: relative;',
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

				trialFormat.append(avatarContainer, sliderRating);
				trialPresentationSpace.html(`<div></div>`);
				trialPresentationSpace.append(trialFormat);

				samplingPromptContainer.empty();
				avatarGrid.addClass('fade-out-partial');

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
					trialPresentationSpace.html(trialFormat);

					trialFeedback.html(`
						<hr></hr>
						<p>Would you like to continue sampling?</p>
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
					$('#jspsych-selection-learning-button-0').on('click', function (e) {
						let viewToc = (new Date()).getTime();
						let viewRt = viewToc - viewTic;
						viewRtArray.push(viewRt);

						// RT: STOP STOPWATCH (CLICK)
						let clickToc = (new Date()).getTime();
						let clickRt = clickToc - (startTime + clickRtArray.reduce((acc, curr) => acc + curr, 0) + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						clickRtArray.push(clickRt);

						$('#overlay').fadeOut();
						trialPresentationSpace.html(`<div id="trial-format"></div><div id="selection-format"></div>`);
						trialPresentationSpace.empty().hide();
						trialFormat.html(`<div id="trial-format"></div>`);
						trialFeedback.html('<div id="selection-buttons"></div>');

						// Fade the prompt back in
						samplingPromptContainer.html(
							`<p id="samplingPrompt" style="text-transform: uppercase;">
								<strong>click on the person whose opinion you would like to read next</strong><br>
								(scroll to view more)
							</p>`
						);

						// Fade the grid back in
						avatarGrid.removeClass('fade-out-partial')
							.addClass('fade-in');
						reattachEventListeners();
					});

					$('#jspsych-selection-learning-button-1').on('click', function (e) {
						// RT: STOP STOPWATCH (VIEW)
						let viewToc = (new Date()).getTime();
						let viewRt = viewToc - viewTic;
						viewRtArray.push(viewRt);

						// RT: STOP STOPWATCH (CLICK)
						let clickToc = (new Date()).getTime();
						if (clickRtArray.length === 0) {
							var clickRt = clickToc - (startTime + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						}
						else { 
							var clickRt = clickToc - (startTime + clickRtArray.reduce((acc, curr) => acc + curr, 0) + viewRtArray.reduce((acc, curr) => acc + curr, 0));
						}

						clickRtArray.push(clickRt);
						console.log(clickRtArray);

						endTrial();
					});

				}, 1000); //changed this from 5000 to 3000 for the pilot because it feels very long, now 1000
			};

			const clickHandlers = {};
			let currentSelection = null; // Track the current selection

			for (let avatarIndex = 0; avatarIndex < 100; avatarIndex++) {
				(function (avatarIndex) {
					let avatarNumber = avatarIndex + 1;
					let isLearningInProgress = false; // Flag variable
					const clickHandler = function () {

						if (currentSelection !== avatarNumber) {
							// <!-- Find actual index of the avatar --> //
							avatarSelections.push(avatarNumber); // Push circle # to selections
							selectedSliderRatings.push(sliderRatings[avatarIndex]); // Push selected slider rating to selections
							currentSelection = avatarNumber; // Update current selection

							// <!-- Find positional index of the avatar --> //
							// Assuming you have an ID or a class for the parent div
							var parentDiv = document.getElementById('avatar-grid'); // or use document.querySelector if you have a class
							var childDivs = parentDiv.children; // or parentDiv.querySelectorAll('div') if you need a more specific selector

							// Function to find the index of a specific sub-div
							function findSubDivIndex(subDivId) {
								for (var i = 0; i < childDivs.length; i++) {
									if (childDivs[i].id === subDivId) { // or use another property to identify the sub-div
										return i; // Returns the index of the sub-div
									}
								}
								return -1; // Return -1 if the sub-div is not found
							}

							let avatarPositionIndex = findSubDivIndex('circle' + avatarNumber);
							avatarPositionIndices.push(avatarPositionIndex);

							let avatarPositionXIndex = avatarPositionIndex % 4;
							avatarPositionXIndices.push(avatarPositionXIndex);

							let avatarPositionYIndex = Math.floor(avatarPositionIndex / 4);
							avatarPositionYIndices.push(avatarPositionYIndex);
						}

						if (!isLearningInProgress && !this.classList.contains('disabled')) {
							isLearningInProgress = true; // Set flag to indicate learning is in progress

							// Disable other circles
							for (let j = 1; j <= 100; j++) {
								if (j !== avatarNumber) {
									$("#circle" + j).addClass('disabled');
								};
							};

							$("#circle" + avatarNumber).css("background-color", "#bbb");  // Fades background color
							$("#circle" + avatarNumber).css("border-color", "rgba(0, 0, 0, 0.25)");
							$("#circle" + avatarNumber).find("img.avatar-photo").css("opacity", "0.5");  // Fades avatar photo
							initLearning(avatarIndex, avatarNumber);  // Start trial
							isLearningInProgress = false;
						}
					};

					$("#circle" + avatarNumber).on('click', clickHandler);
					clickHandlers[avatarIndex] = clickHandler;

				})(avatarIndex);
			}

			// Function to reattach event listeners
			function reattachEventListeners() {
				for (let circleIndex = 0; circleIndex < 100; circleIndex++) {
					let circleNumber = circleIndex + 1;
					$("#circle" + circleNumber)
						.removeClass('disabled')
						.on('click', clickHandlers[circleIndex]);  // needs to start at 0
				}
				currentSelection = null; // Reset current selection for new phase
			}

			const endTrial = () => {
				display_element.innerHTML = "";  // Clear the DOM

				// Record the final time
				const finalTime = (new Date()).getTime();
				const taskDuration = finalTime - startTime;
				const trial_data = {
					"avatar_selections": avatarSelections.join(','),
					"avatar_position_indices": avatarPositionIndices.join(','),
					"avatar_position_x_indices": avatarPositionXIndices.join(','),
					"avatar_position_y_indices": avatarPositionYIndices.join(','),
					"click_rt_array": clickRtArray.join(','),
					"view_rt_array": viewRtArray.join(','),
					"slider_ratings": sliderRatings.join(','),
					"selected_slider_ratings": selectedSliderRatings.join(','),
					"task_duration": taskDuration
				};

				jsPsych.finishTrial(trial_data);
			};
		};
	};

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);