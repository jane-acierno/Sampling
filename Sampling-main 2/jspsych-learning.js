/**
 * crossPC - learning
 * plugin for learning trials in cross-situational word learning study (production vs. comprehension, crossPC)
 * Martin Zettersten
 */

jsPsych.plugins['learning'] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('learning', 'im1', 'image');
  jsPsych.pluginAPI.registerPreload('learning', 'im2', 'image');
  jsPsych.pluginAPI.registerPreload('learning', 'audio1', 'audio');
  jsPsych.pluginAPI.registerPreload('learning', 'audio2', 'audio');

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [150, 150];
	  trial.location1 = trial.location1 || "bottom";
	  trial.location2 = trial.location2 || "topRight";
	  trial.label1 = trial.label1 || "kita";
	  trial.label2 = trial.label2 || "kita";
	  trial.audio1 = trial.audio1 || "norm_kita.m4a";
	  trial.audio2 = trial.audio2 || "norm_kita.m4a";
	  trial.duration = trial.duration || 1000;
	  trial.prompt = trial.prompt || "Learn the names for the two aliens!";
	  trial.audio = trial.audio || "false";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	  display_element.append($("<svg id='jspsych-test-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var paper = Snap("#jspsych-test-canvas");
	  
	  var topLeftCircle = paper.circle(250, 225, 90);
	  topLeftCircle.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var topRightCircle = paper.circle(550, 225, 90);
	  topRightCircle.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });

	  
	  var imageLocations = {
		  left: [175, 150],
		  right: [475, 150]
	  };
	  
	  var image1 = paper.image(trial.im1, imageLocations[trial.location1][0], imageLocations[trial.location1][1], trial.image_size[0],trial.image_size[1]);
	  var image2 = paper.image(trial.im2, imageLocations[trial.location2][0], imageLocations[trial.location2][1], trial.image_size[0],trial.image_size[1]);

	  //add prompt text
	  //display_element.append(trial.question + trial.label + "?");
	  var text = paper.text(400, 50, trial.prompt);
	  text.attr({
		  "text-anchor": "middle",
		  editable: true,
		  "font-weight": "bold"
	  });
	  
	  var label1 = paper.text(400, 225, trial.label1);
	  label1.attr({
		  opacity: 0,
		  "text-anchor": "middle",
		  "font-weight": "bold"
	  });
	  var label2 = paper.text(400, 225, trial.label2);
	  label2.attr({
		  opacity: 0,
		  "text-anchor": "middle",
		  "font-weight": "bold"
	  });

	  
	  if (trial.audio == "true") {
		  //create audio
		  var audio1 = new Audio(trial.audio1);
		  var audio2 = new Audio(trial.audio2);
	  };

	  var start_time = (new Date()).getTime();
	    
	  var trial_data={};
	  
	  //animate word presentation
	  
	  label1.animate({opacity: "1"}, 150,mina.linear, function() {
		  if (trial.audio == "true") {
			  audio1.play();
		  };
		  label1.animate({opacity: "1"}, trial.duration,mina.linear, function() {
			  label1.animate({opacity: 0}, 150,mina.linear, function() {
			  	label2.animate({opacity: 1}, 150,mina.linear, function() {
					if (trial.audio == "true") {
						audio2.play();
					};
					label2.animate({opacity: "1"}, trial.duration,mina.linear, function() {
						label2.animate({opacity: 0}, 150,mina.linear, endTrial());
					});
				});
			});
		});
	});
	  
	  
      function endTrial() {
		//var audioFeedback = new Audio(trial.audioFeedback);
		//audioFeedback.play();
        var trial_data = {
			"label1": trial.label1,
			"label2": trial.label2,
			"location1": trial.location1,
			"location2": trial.location2,
			"image1": trial.im1,
			"image2": trial.im2,
			"audio": trial.audio	
		};
		
		display_element.html('');
		jsPsych.finishTrial(trial_data);
		
      };
  };	  
		
		return plugin;
})();