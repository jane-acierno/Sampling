var jsPsychProductionTestSinglepic = (function (jspsych) {
	"use strict";
  
	const info = {
	  name: "ProductionTestSinglepic",
	  parameters: {
		parameter_name: {
		  type: jspsych.ParameterType.INT,
		  default: undefined,
		},
		parameter_name2: {
		  type: jspsych.ParameterType.IMAGE,
		  default: undefined,
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
	class ProductionTestSinglepicPlugin {
	  constructor(jsPsych) {
		this.jsPsych = jsPsych;
	  }
	  trial(display_element, trial) {
		// default values
		trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
		trial.canvas_size = trial.canvas_size || [1024,385];
		trial.image_size = trial.image_size || [150, 150];
		trial.targetLocation = trial.targetLocation || "top";
  
		
		// if any trial variables are functions
		// this evaluates the function and replaces
		// it with the output of the function
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
		
		display_element.append($("<svg id='jspsych-test-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));
  
		var paper = Snap("#jspsych-test-canvas");
		
		
		var bottomCircle = paper.circle(400, 225, 90);
		bottomCircle.attr({
			fill: "#FFD3D6",
			stroke: "#000",
			strokeWidth: 5
		});
  
		
		var imageLocations = {
			top: [325,150]
		};
		
		var targetImage = paper.image(trial.targetIm, imageLocations[trial.targetLocation][0], imageLocations[trial.targetLocation][1], trial.image_size[0],trial.image_size[1]);
  
		//add prompt text
		//display_element.append(trial.question + trial.label + "?");
		var text = paper.text(400, 30, trial.question);
		var text2 = paper.text(400, 55, trial.question2);
		var finishText = paper.text(400, 75, trial.finishText);
		text.attr({
			"text-anchor": "middle",
			editable: true,
			"font-weight": "bold"
		});
		text2.attr({
			"text-anchor": "middle",
			editable: true
		});
		finishText.attr({
			"text-anchor": "middle",
			editable: true
		});
		
		
		var boxID = ""
  
		display_element.append($('<div>', {
		  "id": 'jspsych-produce-3',
		}));
		$("#jspsych-produce-3").append('<textarea id="jspsych-prodbox-3" cols="10" rows="1" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"></textarea>');
		boxID = "jspsych-prodbox-3";
		// bottomCircle.attr({
		// 		  fill: "#00ccff",
		// });
		
  
		//display buttons
		var buttons = [];
		if (Array.isArray(trial.button_html)) {
		  if (trial.button_html.length == trial.choices.length) {
			buttons = trial.button_html;
		  } else {
			console.error('Error in button-response plugin. The length of the button_html array does not equal the length of the choices array');
		  }
		} else {
		  for (var i = 0; i < trial.choices.length; i++) {
			buttons.push(trial.button_html);
		  }
		}
		display_element.append('<div id="jspsych-button-response-btngroup" class="center-content block-center"></div>')
		for (var i = 0; i < trial.choices.length; i++) {
		  var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
		  $('#jspsych-button-response-btngroup').append(
			$(str).attr('id', 'jspsych-button-response-button-' + i).data('choice', i).addClass('jspsych-button-response-button').on('click', function(e) {
			  var choice = $('#' + this.id).data('choice');
			  after_response(choice);
			})
		  );
		};
		
		
		
		//create audio
		//var audio = new Audio(trial.audio);
		
		var numIncorrectEntries = 0;
		var rt = "NA";
		
		var start_time = (new Date()).getTime();
		  
		var trial_data={};
		
		function after_response(choice) {
			var end_time = (new Date()).getTime();
			rt = end_time - start_time;
			
			$("#jspsych-button-response-stimulus").addClass('responded');
			// disable all the buttons after a response
			//$('.jspsych-button-response-button').off('click').attr('disabled', 'disabled');
			$('.jspsych-button-response-button').attr('disabled', 'disabled');
			
			var val = document.getElementById(boxID).value;
			console.log(val);
			
			//give warning message if string is empty
			if (val == "") {
				console.log("No response.")
				var feedbackText = paper.text(400, 375, trial.feedback);
				feedbackText.attr({
					"text-anchor": "middle",
					editable: true,
					fill: "#FF0000",
					"font-weight": "bold"
				});
				numIncorrectEntries++;
				$('.jspsych-button-response-button').removeAttr('disabled');
			} else {
				endTrial(val);
			};
		};
  
		
		function endTrial(rating) {
		  //var audioFeedback = new Audio(trial.audioFeedback);
		  //audioFeedback.play();
		  var trial_data = {
			  "label": trial.label,
			  "targetLocation": trial.targetLocation,
			  "targetImage": trial.targetIm,
			  "prodLabel": rating,
			  "rt": rt,
			  "numIncorrectEntries": numIncorrectEntries
			  
		  };
		  
		  
		  // setTimeout(function(){
		  // 	display_element.html('');
		  // 	jsPsych.finishTrial(trial_data);
		  // },500);
		  display_element.html('');
		  this.jsPsych.finishTrial(trial_data);
		};
	  };
	};
	ProductionTestSinglepicPlugin.info = info;
  
	return ProductionTestSinglepicPlugin;
  })(jsPsychModule);
  

/**
 * crossact - prod-test
 * plugin for production test trials in cross-situational word learning study (production vs. comprehension, crossPC)
 * Martin Zettersten
 */

// jsPsych.plugins['production-test-singlepic'] = (function() {

//   var plugin = {};
  
//   jsPsych.pluginAPI.registerPreload('prod-test-singlepic', 'targetIm', 'image');
