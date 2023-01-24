/**
 * crossact - test
 * plugin for beginning comprehension test trials in cross-situational word learning study (crossact)
 * Martin Zettersten
 */

jsPsych.plugins['comprehension-test-prompt'] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image1', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image2', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image3', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image4', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image5', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image6', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image7', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image8', 'image');

  plugin.trial = function(display_element, trial) {
	  
      // default values
	  trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [150, 150];
	  //trial.audio = trial.audio || "stims/bleep.wav";
	  trial.label = trial.label || "kita";
	  trial.question = trial.question || "Click on the START button to begin the trial.";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	  display_element.append($("<svg id='jspsych-test-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var paper = Snap("#jspsych-test-canvas");
	  
	  var circle1 = paper.circle(125, 325, 90);
	  circle1.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle2 = paper.circle(325, 325, 90);
	  circle2.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle3 = paper.circle(525, 325, 90);
	  circle3.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle4 = paper.circle(725, 325, 90);
	  circle4.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle5 = paper.circle(125, 525, 90);
	  circle5.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle6 = paper.circle(325, 525, 90);
	  circle6.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle7 = paper.circle(525, 525, 90);
	  circle7.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle8 = paper.circle(725, 525, 90);
	  circle8.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });

	  
	  var imageLocations = {
		  pos1: [50, 250],
		  pos2: [250, 250],
		  pos3: [450, 250],
		  pos4: [650, 250],
		  pos5: [50, 450],
		  pos6: [250, 450],
		  pos7: [450, 450],
		  pos8: [650, 450],
	  };
	  
	  var image1 = paper.image(trial.image1, imageLocations["pos1"][0], imageLocations["pos1"][1], trial.image_size[0],trial.image_size[1]);
	  var image2 = paper.image(trial.image2, imageLocations["pos2"][0], imageLocations["pos2"][1], trial.image_size[0],trial.image_size[1]);
	  var image3 = paper.image(trial.image3, imageLocations["pos3"][0], imageLocations["pos3"][1], trial.image_size[0],trial.image_size[1]);
	  var image4 = paper.image(trial.image4, imageLocations["pos4"][0], imageLocations["pos4"][1], trial.image_size[0],trial.image_size[1]);
	  var image5 = paper.image(trial.image5, imageLocations["pos5"][0], imageLocations["pos5"][1], trial.image_size[0],trial.image_size[1]);
	  var image6 = paper.image(trial.image6, imageLocations["pos6"][0], imageLocations["pos6"][1], trial.image_size[0],trial.image_size[1]);
	  var image7 = paper.image(trial.image7, imageLocations["pos7"][0], imageLocations["pos7"][1], trial.image_size[0],trial.image_size[1]);
	  var image8 = paper.image(trial.image8, imageLocations["pos8"][0], imageLocations["pos8"][1], trial.image_size[0],trial.image_size[1]);
	  	  
	  //add prompt text
	  //display_element.append(trial.question + trial.label + "?");
	  var text = paper.text(425, 50, trial.question);
	  //var labelText = paper.text(400, 225, trial.label);
	  text.attr({
		  "text-anchor": "middle",
		  editable: true,
		  "font-weight": "bold"
	  });
	  // labelText.attr({
	  // 		  "text-anchor": "middle",
	  // 		  editable: true,
	  // 		  "font-weight": "bold",
	  // 		  "font-size": "25px"
	  // });
	  //create audio
	  //var audio = new Audio(trial.audio);
	  
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
	  console.log(buttons);
      display_element.append('<div id="jspsych-comp-test-prompt-btngroup" class="center-content block-center"></div>')
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        $('#jspsych-comp-test-prompt-btngroup').append(
          $(str).attr('id', 'jspsych-button-response-button-' + i).data('choice', i).addClass('jspsych-button-response-button').on('click', function(e) {
            var choice = $('#' + this.id).data('choice');
            after_response(choice);
          })
        );
      };

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
		  endTrial();
	
	  };
	  
	  function endTrial() {
  		//var audioFeedback = new Audio(trial.audioFeedback);
  		//audioFeedback.play();
		var trial_data = {
			"label": trial.label,
			"image1": trial.image1,
			"image2": trial.image2,
			"image3": trial.image3,
			"image4": trial.image4,
			"image5": trial.image5,
			"image6": trial.image6,
			"image7": trial.image7,
			"image8": trial.image8,
			"targetLocation": trial.targetLocation,
			"targetImage": trial.targetImage,
			"rt": rt
		};
		
  		display_element.html('');
  		jsPsych.finishTrial(trial_data);
	};
  	
  };

return plugin;

})();