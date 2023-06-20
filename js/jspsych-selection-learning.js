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
			display_element.innerHTML += `
				<div id="jspsych-instructions">
					<div class="quote">
						<h2>Sampling Task</h2>
						<p>
							Now you can see what other people think. 
							Click on any of the people below to see whether that person thinks the action 
							described in the statement above is morally good or morally bad.
						</p>
					</div>
				</div>

				<div id="trial-presentation-space"></div>

				<div id="prompt-container"></div>
				
				<div class="grid-container-wrapper">
					<div class="grid-container" id="avatar-grid"></div>
				</div>`;

			// Generate circles
			const avatarCircleContainer = $('#avatar-grid');
			for (let i = 0; i < 100; i++) {
				const avatarCircle = $(`<div class='avatar-circle' id='circle${i + 1}'></div>`);
				avatarCircleContainer.append(avatarCircle);
			}

			for (let i = 0; i < 100; i++) {
				const circleId = $(`#circle${i + 1}`);
				const avatarPhoto = $(`<img class='avatar-photo' src='/avatars/${i + 1}.png'>`);
				circleId.append(avatarPhoto);
			}

			const samplingPromptContainer = $('#prompt-container');
			samplingPromptContainer.html(`
				<strong id="samplingPrompt">CLICK ON THE PERSON WHOSE OPINION YOU WOULD LIKE TO HEAR NEXT</strong><br>
				(SCROLL TO VIEW MORE)<br>`
			);

			// default values

			trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';

			var choiceLabel = "NA";
			var choice = 'NA'
			var learningStartRT = "NA";
			var trialDuration = "NA";
			var selections = []
			var rt_array = [];

			var start_time = (new Date()).getTime();

			const initLearning = (circleIndex) => {
				let tic = (new Date()).getTime();

				const trialPresentationSpace = $('#trial-presentation-space');

				const avatarContainer = document.createElement('div');
				avatarContainer.id = 'avatar-container';
				trialPresentationSpace.append(avatarContainer);

				// Create a new circle to hold the chosen avatar
				// Add it to the presentation space
				const avatarCircleSelection = document.createElement('div');
				avatarCircleSelection.className = 'avatar-circle fade-in';
				avatarCircleSelection.id = `circle` + circleIndex;
				avatarContainer.append(avatarCircleSelection);

				// Create copy of the chosen avatar photo
				// Add it inside the avatar circle
				const avatarPhotoSelection = document.createElement('img');
				avatarPhotoSelection.src = "/avatars/" + circleIndex + ".png"
				avatarPhotoSelection.className = 'avatar-photo fade-in';
				avatarCircleSelection.append(avatarPhotoSelection)

				choiceLabel = trial.avatarNames['avatar' + circleIndex]["statement"];

				const statement = document.createElement('div');
				statement.id = "statement";
				// Fade in option
				// statement.className = "fade-in";
				// statement.innerHTML = `<strong>${choiceLabel}</strong>`;
				trialPresentationSpace.append(statement);



				// Typewriter effect
				let i = 0;
				function typeWriter() {
					if (i < choiceLabel.length) {
						$("#statement").append(`<strong style="font-size: 28pt;">${choiceLabel.charAt(i)}</strong>`);
						i++;
						setTimeout(typeWriter, 40);
					}
				}

				typeWriter();

				// const samplingPrompt = $('#samplingPrompt');
				// samplingPrompt.addClass('fade-out')
				samplingPromptContainer.empty()

				avatarCircleContainer.addClass('fade-out-partial');

				setTimeout(function () {

					// fade out choices

					// fade out prompt

					const learningStartTime = (new Date()).getTime();

					//display buttons
					let buttons = [];
					if (Array.isArray(trial.button_html)) {
						if (trial.button_html.length == trial.choices.length) {
							buttons = trial.button_html;
						}
					}
					else {
						for (let i = 0; i < trial.choices.length; i++) {
							buttons.push(trial.button_html);
						}
					}

					const selectionButtons = document.createElement('div');
					selectionButtons.id = 'jspsych-selection-learning-btngroup';
					selectionButtons.className = 'center-content block-center';
					samplingPromptContainer.append("<p>Would you like to continue reading?</p>")
					samplingPromptContainer.append(selectionButtons)

					for (let l = 0; l < trial.choices.length; l++) {
						var str = buttons[l].replace(/%choice%/, trial.choices[l]);
						$('#jspsych-selection-learning-btngroup').append(
							$(str).attr('id', 'jspsych-selection-learning-button-' + l).data('choice', l).addClass('jspsych-selection-learning-button').on('click', function (e) {
								// disable all the buttons after a response
								$('.jspsych-selection-learning-button').off('click').attr('disabled', 'disabled');
								// hide button
								$('.jspsych-selection-learning-button').hide();
								choice = $('#' + this.id).data('choice');


								const curTime = Date.now();
								const learningStartRT = curTime - learningStartTime;

							})
						);
					};
					$('#jspsych-selection-learning-button-0').on('click', function (e) {
						let toc = (new Date()).getTime();
						let rt = toc - tic;
						rt_array.push(rt);

						// Fade the prompt back in
						samplingPromptContainer.html('<p id="samplingPrompt"><strong>CLICK ON THE PERSON WHOSE OPINION YOU WOULD LIKE TO HEAR NEXT</strong><br>(SCROLL TO VIEW MORE)</p>');
						// samplingPrompt.attr('class', 'fade-in');
						trialPresentationSpace.empty();

						// Fade the grid back in
						avatarCircleContainer.removeClass('fade-out-partial');
						avatarCircleContainer.addClass('fade-in');
						reattachEventListeners();

					});

					$('#jspsych-selection-learning-button-1').on('click', function (e) {
						endTrial();
					});
				}, 5000);
			};

			const clickHandlers = {};

			for (let i = 1; i <= 100; i++) {
				(function (i) {
					let circleIndex = i
					let isLearningInProgress = false; // Flag variable


					const clickHandler = function () {
						selections.push(circleIndex);
						if (!isLearningInProgress && !this.classList.contains('disabled')) {
							isLearningInProgress = true; // Set flag to indicate learning is in progress

							// Disable other circles
							for (let j = 1; j <= 100; j++) {
								if (j !== i) {
									$("#circle" + j).addClass('disabled');
								}
							}

							$("#circle" + circleIndex).css("background-color", "#5cb85c");
							initLearning(circleIndex);
						}
					};

					$("#circle" + circleIndex).on('click', clickHandler);
					clickHandlers[i] = clickHandler;

					start_time = (new Date()).getTime(); // Store the start time
				})(i);
			}

			// Function to reattach event listeners
			function reattachEventListeners() {
				for (let i = 1; i <= 100; i++) {
					$("#circle" + i)
					.removeClass('disabled')
					.on('click', clickHandlers[i]);
				}
			}


			const endTrial = () => {
				const final_time = (new Date()).getTime();
				trialDuration = final_time - start_time;
				const trial_data = {
					"selections": selections,
					"choiceLabel": choiceLabel,
					"rt_array": rt_array,
					"learningStartRT": learningStartRT,
					"trialDuration": trialDuration
				};

				jsPsych.finishTrial(trial_data);
			};
		};
	};

	SelectionLearningPlugin.info = info;

	return SelectionLearningPlugin;
})(jsPsychModule);