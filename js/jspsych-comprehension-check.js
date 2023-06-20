var jsPsychComprehensionCheck = (function (jspsych) {
  "use strict";

  /**
   * **SELECTION LEARNING**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author Nathan Liang
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */

  const info = {
    name: 'comprehension-check',
    description: 'Multiple-choice quiz. Only continue when answer is correct, give hints for incorrect answers.',
    parameters: {
      question: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'The strings that will be associated with a group of options.'
          },
          options: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: undefined,
            description: 'Displays options for an individual question.'
          },
          horizontal: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          name: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          },
          correct: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'Correct response',
            default: '',
            description: 'Indicates which response option is correct'
          },
          hint: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'Hint',
            default: '',
            description: 'Hint that is displayed when an incorrect response is given'
          }

        }
      },
      preamble: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Label of the button.'
      }
    }
  }

  class ComprehensionCheckPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var plugin_id_name = "jspsych-quiz-multi-choice";
      var html = "";

      // inject CSS for trial
      html += '<style id="jspsych-comprehension-check-css">';
      html += 
        ".jspsych-comprehension-check-question { margin-top: 2em; margin-bottom: 2em; text-align: center; }" +
        ".jspsych-comprehension-check-horizontal .jspsych-comprehension-check-text {  text-align: center;}" +
        ".jspsych-comprehension-check-option { line-height: 2; }" +
        ".jspsych-comprehension-check-horizontal .jspsych-comprehension-check-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}" +
        "label.jspsych-comprehension-check-text input[type='radio'] {margin-right: 1em;}";
      html += '</style>';

      // show preamble text
      if (trial.preamble !== null) {
        html += 
          '<div id="jspsych-comprehension-check-preamble" class="jspsych-comprehension-check-preamble">' + 
          trial.preamble + 
          '</div>';
      }

      // form element
      html += '<form id="jspsych-comprehension-check-form" autocomplete="off">';

      // get question based on question_order
      var question = trial.question;
      var question_id = 0;

      // create question container
      var question_classes = ['jspsych-comprehension-check-question'];
      if (question.horizontal) {
        question_classes.push('jspsych-comprehension-check-horizontal');
      }

      html += '<div id="jspsych-comprehension-check-' + question_id + '" class="' + question_classes.join(' ') + '"  data-name="' + question.name + '"' + ' data-correct="' + question.correct + '">';

      // add question text
      html += '<p class="jspsych-comprehension-check-text comprehension-check">' + question.prompt
      html += '</p>';

      // create option radio buttons
      for (var j = 0; j < question.options.length; j++) {
        // add label and question text
        var option_id_name = "jspsych-comprehension-check-option-" + question_id + "-" + j;
        var input_name = 'jspsych-comprehension-check-response-' + question_id;
        var input_id = 'jspsych-comprehension-check-response-' + question_id + '-' + j;

        // add radio button container
        html += '<div id="' + option_id_name + '" class="jspsych-comprehension-check-option">';
        html += '<label class="jspsych-comprehension-check-text" for="' + input_id + '">' + question.options[j] + '</label>';
        html += '<input type="radio" name="' + input_name + '" id="' + input_id + '" value="' + question.options[j] + '" ' + 'required' + '></input>';
        html += '</div>';
      }
      html += '</div>';

      // add hint
      html += '<div id="jspsych-comprehension-check-hint" style="visibility:hidden">' + question.hint + '</div>';


      // add submit button
      html += '<input type="submit" id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn"' + (trial.button_label ? ' value="' + trial.button_label + '"' : '') + '></input>';
      html += '</form>';

      // render
      display_element.innerHTML = html;

      document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        // measure response time
        var endTime = performance.now();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};

        var match = display_element.querySelector('#jspsych-comprehension-check-0');
        var id = "Q";
        if (match.querySelector("input[type=radio]:checked") !== null) {
          var val = match.querySelector("input[type=radio]:checked").value;
        } else {
          var val = "";
        }
        var obje = {};
        var name = id;
        if (match.attributes['data-name'].value !== '') {
          name = match.attributes['data-name'].value;
        }
        obje[name] = val;
        Object.assign(question_data, obje);

        if (val != match.attributes['data-correct'].value) {
          hintmatch = display_element.querySelector('#jspsych-comprehension-check-hint');
          console.log(hintmatch)
          hintmatch.style.visibility = "visible";
        } else {

          // save data
          var trial_data = {
            "rt": response_time,
            "response": JSON.stringify(question_data)
          };
          display_element.innerHTML = '';

          // next trial
          jsPsych.finishTrial(trial_data);
        }
      });

      var startTime = performance.now();
    };
  }


	ComprehensionCheckPlugin.info = info;

	return ComprehensionCheckPlugin;
})(jsPsychModule);