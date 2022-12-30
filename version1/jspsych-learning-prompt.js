/**
 * crossPC - learning
 * plugin for learning trials in cross-situational word learning study (production vs. comprehension, crossPC)
* initial prompt
* based on:
 * jspsych-button-response
 * Josh de Leeuw
 * Martin Zettersten
 */

jsPsych.plugins['learning-prompt'] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('learning', 'im1', 'image');
  jsPsych.pluginAPI.registerPreload('learning', 'im2', 'image');
  jsPsych.pluginAPI.registerPreload('learning', 'im3', 'image');

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [150, 150];
	  trial.location1 = trial.location1 || "bottom";
	  trial.location2 = trial.location2 || "topRight";
	  trial.prompt = trial.prompt || "Learn the names for the two aliens!";
	  trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
      trial.response_ends_trial = (typeof trial.response_ends_trial === 'undefined') ? true : trial.response_ends_trial;
      trial.timing_response = trial.timing_response || -1; // if -1, then wait for response forever
      trial.is_html = (typeof trial.is_html === 'undefined') ? false : trial.is_html;
      trial.prompt = (typeof trial.prompt === 'undefined') ? "" : trial.prompt;
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      // this array holds handlers from setTimeout calls
      // that need to be cleared if the trial ends early
      var setTimeoutHandlers = [];
	  
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
	  })
	  
      //display buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in learning-prompt plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      display_element.append('<div id="jspsych-learning-prompt-btngroup" class="center-content block-center"></div>')
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        $('#jspsych-learning-prompt-btngroup').append(
          $(str).attr('id', 'jspsych-learning-prompt-button-' + i).data('choice', i).addClass('jspsych-learning-prompt-button').on('click', function(e) {
            var choice = $('#' + this.id).data('choice');
            after_response(choice);
          })
        );
      }

      // store response
      var response = {
        rt: -1,
        button: -1
      };

      // start time
      var start_time = 0;

      // function to handle responses by the subject
      function after_response(choice) {

        // measure rt
        var end_time = Date.now();
        var rt = end_time - start_time;
        response.button = choice;
        response.rt = rt;

        // disable all the buttons after a response
        $('.jspsych-learning-prompt-button').off('click').attr('disabled', 'disabled');

        if (trial.response_ends_trial) {
          end_trial();
        }
      };

      // function to end trial when it is time
      function end_trial() {

        // kill any remaining setTimeout handlers
        for (var i = 0; i < setTimeoutHandlers.length; i++) {
          clearTimeout(setTimeoutHandlers[i]);
        }

        // gather the data to store for the trial
        var trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimulus,
          "button_pressed": response.button
        };

        // clear the display
        display_element.html('');

        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      };

      // start timing
      start_time = Date.now();


      // end trial if time limit is set
      if (trial.timing_response > 0) {
        var t2 = setTimeout(function() {
          end_trial();
        }, trial.timing_response);
        setTimeoutHandlers.push(t2);
      }

    };

    return plugin;
  })();