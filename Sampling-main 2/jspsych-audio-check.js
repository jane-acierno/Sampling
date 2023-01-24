/**
 * jspsych-single-audio
 * Josh de Leeuw
 *
 * plugin for playing an audio file and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["audio-check"] = (function() {

  var plugin = {};

  //var context = new AudioContext();

  jsPsych.pluginAPI.registerPreload('single-audio', 'stimulus', 'audio');

  plugin.trial = function(display_element, trial) {

    // default parameters
    trial.choices = trial.choices || [];
    trial.response_ends_trial = (typeof trial.response_ends_trial === 'undefined') ? true : trial.response_ends_trial;
    // timing parameters
    trial.timing_response = trial.timing_response || -1; // if -1, then wait for response forever
    trial.prompt = (typeof trial.prompt === 'undefined') ? "" : trial.prompt;
	trial.columns = trial.columns || 40;
	trial.rows = trial.rows || 1;
	trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);


    // play stimulus
    // var source = context.createBufferSource();
    // source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
    // source.connect(context.destination);
    // startTime = context.currentTime + 0.1;
    // source.start(startTime);

	var audio = new Audio(trial.stimulus);

    // show prompt if there is one
    if (trial.prompt !== "") {
      display_element.append(trial.prompt);
    }
	
    // add audioplay button
    display_element.append($('<button>', {
      'id': 'jspsych-audio-play',
      'class': 'jspsych-btn jspsych-survey-text'
    }));
    $("#jspsych-audio-play").html('Play');
    $("#jspsych-audio-play").click(function() {
		audio.play();
	});
	
    // create div
    display_element.append($('<div>', {
      "id": 'jspsych-survey-text',
      "class": 'jspsych-survey-text-question'
    }));
	
	//add text box
	$("#jspsych-survey-text").append('<textarea id="jspsych-survey-text-response" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"></textarea>');
	//$("#jspsych-survey-text").append('<textarea id="jspsych-survey-text-response" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></textarea>');


	var startTime = (new Date()).getTime();
	
    // add submit button
    display_element.append($('<button>', {
      'id': 'jspsych-survey-text-next',
      'class': 'jspsych-btn jspsych-survey-text'
    }));
    $("#jspsych-survey-text-next").html('Submit Answers');
    $("#jspsych-survey-text-next").click(function() {
		end_trial();
	});
	

    // function to end trial when it is time
    var end_trial = function() {
		
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;
		
		var val = document.getElementById("jspsych-survey-text-response").value;
		console.log(val);

      // stop the audio file if it is playing
      audio.pause();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response_time,
        "stimulus": trial.stimulus,
        "response": val
      };

      // clear the display
      display_element.html('');

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };
	
  };

  return plugin;
})();
