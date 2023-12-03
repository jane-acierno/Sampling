var jsPsychSurveyMultiChoice = (function (jspsych) {
    'use strict';

    const info = {
        name: "survey-multi-choice",
        parameters: {
            /** Array containing one or more objects with parameters for the question(s) that should be shown on the page. */
            questions: {
                type: jspsych.ParameterType.COMPLEX,
                array: true,
                pretty_name: "Questions",
                nested: {
                    /** Question prompt. */
                    prompt: {
                        type: jspsych.ParameterType.HTML_STRING,
                        pretty_name: "Prompt",
                        default: undefined,
                    },
                    /** Array of multiple choice options for this question. */
                    options: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "Options",
                        array: true,
                        default: undefined,
                    },
                    /** Whether or not a response to this question must be given in order to continue. */
                    required: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "Required",
                        default: false,
                    },
                    /** If true, then the question will be centered and options will be displayed horizontally. */
                    horizontal: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "Horizontal",
                        default: false,
                    },
                    /** If true, then the question will have right and left anchors **/
                    anchor: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "Anchored Question",
                        default: false,
                    },
                    /** Array of anchors for this question. */
                    labels: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "Anchor Labels",
                        array: true,
                        default: ['Left anchor', 'Right anchor'],
                    },
                    /** Name of the question in the trial data. If no name is given, the questions are named Q0, Q1, etc. */
                    name: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "Question Name",
                        default: "",
                    },
                    /** Indicates which response option is correct. */
                    correct: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: 'Correct response',
                        default: '',
                        description: 'Indicates which response option is correct'
                    },
                    /** Provides hint upon submission of incorrect response option. */
                    hint: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: 'Hint',
                        default: '',
                        description: 'Hint that is displayed when an incorrect response is given'
                    }
                },
            },
            /** If true, the order of the questions in the 'questions' array will be randomized. */
            randomize_question_order: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Randomize Question Order",
                default: false,
            },
            /** HTML-formatted string to display at top of the page above all of the questions. */
            preamble: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Preamble",
                default: null,
            },
            /** Label of the button to submit responses. */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button label",
                default: "Continue",
            },
            /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
            autocomplete: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Allow autocomplete",
                default: false,
            },
            /** If true, then a response to every question is required to advance without a popup. If false, then responses to questions can be left blank without a popup. */
            request_response: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Request response",
                default: false
            }
        },
    };
    /**
     * **survey-multi-choice**
     *
     * jsPsych plugin for presenting multiple choice survey questions
     *
     * @author Shane Martin
     * @see {@link https://www.jspsych.org/plugins/jspsych-survey-multi-choice/ survey-multi-choice plugin documentation on jspsych.org}
     */
    class SurveyMultiChoicePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            var plugin_id_name = "jspsych-survey-multi-choice";
            var html =
                `<div id="confirm-popup" class="popup">
                    <h2>Confirmation</h2>
                    <p>
                        There is at least one unanswered question.<br>
                        Are you sure you would like to advance?
                    </p>
                    <div id="jspsych-selection-learning-btngroup" class="center-content block-center">
                        <button class="jspsych-btn jspsych-selection-learning-button" id="confirm-yes">Yes</button>
                        <button class="jspsych-btn jspsych-selection-learning-button" id="confirm-no">No</button>
                    </div>
                </div>
                <div id="overlay"></div>`;

            // inject CSS for trial
            html += '<style id="jspsych-survey-multi-choice-css">';
            html +=
                `.jspsych-survey-multi-choice-question { 
                    margin-top: 2em; 
                    margin-bottom: 1em; 
                    text-align: left; 
                }` +
                `.jspsych-survey-multi-choice-option { 
                    font-size: 10pt; 
                    line-height: 2; 
                }` +
                `.jspsych-survey-multi-choice-horizontal 
                 .jspsych-survey-multi-choice-option { 
                    display: inline-block; 
                    margin-left: 1em; 
                    margin-right: 1em; 
                    vertical-align: top; 
                    text-align: center; 
                }` +
                `label.jspsych-survey-multi-choice-text input[type='radio'] { 
                    margin-right: 1em; 
                }`;
            html += "</style>";

            // show preamble text
            if (trial.preamble !== null) {
                html +=
                    '<div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">' +
                    trial.preamble +
                    '</div>';
            }
            // form element
            if (trial.autocomplete) {
                html += '<form id="jspsych-survey-multi-choice-form">';
            }
            else {
                html += '<form id="jspsych-survey-multi-choice-form" autocomplete="off">';
            }
            // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
            // so that the data are always associated with the same question regardless of order
            var question_order = [];
            for (let i = 0; i < trial.questions.length; i++) {
                question_order.push(i);
            }
            if (trial.randomize_question_order) {
                question_order = this.jsPsych.randomization.shuffle(question_order);
            }
            // add multiple-choice questions
            for (let i = 0; i < trial.questions.length; i++) {
                // get question based on question_order
                var question = trial.questions[question_order[i]];
                var question_id = question_order[i];
                // create question container
                var question_classes = ["jspsych-survey-multi-choice-question"];
                if (question.horizontal) {
                    question_classes.push("jspsych-survey-multi-choice-horizontal");
                }
                html +=
                    '<div id="jspsych-survey-multi-choice-' +
                    question_id +
                    '" class="' +
                    question_classes.join(" ") +
                    '"  data-name="' +
                    question.name +
                    '" data-correct="' +
                    question.correct +
                    '">';

                // add question text
                html += '<p class="jspsych-survey-multi-choice-text survey-multi-choice">' + question.prompt;

                // create option radio buttons
                for (let j = 0; j < question.options.length; j++) {
                    // add label and question text
                    var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
                    var input_name = "jspsych-survey-multi-choice-response-" + question_id;
                    var input_id = "jspsych-survey-multi-choice-response-" + question_id + "-" + j;
                    var required_attr = question.required ? "required" : "";
                    // add radio button container
                    html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-choice-option">';
                    html += '<label class="jspsych-survey-multi-choice-text" for="' + input_id + '">';

                    // if horizontal question format, place label above radio
                    if (question.horizontal) {
                        html += question.options[j] + "</label><br>";
                    }

                    if (trial.request_response) {
                        html +=
                            '<input type="radio" name="' +
                            input_name +
                            '" id="' +
                            input_id +
                            '" value="' +
                            question.options[j] +
                            '" ' +
                            required_attr +
                            'class="incomplete" oninput="var inputElements = document.querySelectorAll(\'input[name=' + input_name + ']\'); \
                            for (var i = 0; i < inputElements.length; i++) { \
                                inputElements[i].classList.remove(\'incomplete\'); \
                            };"' +
                            '></label>';
                    } else {
                        html +=
                            '<input type="radio" name="' +
                            input_name +
                            '" id="' +
                            input_id +
                            '" value="' +
                            question.options[j] +
                            '" ' +
                            required_attr +
                            '"></label>';
                    };

                    // if not horizontal question format, place label beside ratio
                    if (!question.horizontal) {
                        html += question.options[j] + "</label>";
                    };
                    html += "</div>";

                };
                // add hint
                if (question.hint) {
                    html += '<div class="jspsych-survey-multi-choice-hint" style="visibility: hidden;">' + question.hint + '</div>';
                };

                if (question.anchor) {
                    html += 
                        '<br><span class="jspsych-multi-choice-left-anchor">' + 
                            question.labels[0] + 
                        '</span><span class="jspsych-multi-choice-right-anchor">' + 
                            question.labels[1] + 
                        '</span>';
                }

                html += "</div>";
            };

            html +=
                '<input type="submit" id="' +
                plugin_id_name +
                '-next" class="' +
                plugin_id_name +
                ' jspsych-btn"' +
                (trial.button_label ? ' value="' + trial.button_label + '"' : "") +
                "></input>";
            html += "</form>";
            
            display_element.innerHTML = html;
            document.querySelector("form").addEventListener("submit", (event) => {
                event.preventDefault();

                if (trial.request_response) {
                    let incompleteResponse = false;
                    $('input').each(function () {
                        if ($(this).hasClass('incomplete')) {
                            incompleteResponse = true;
                            return false; // Exit the loop early if a disabled slider is found
                        };
                    });

                    if (incompleteResponse) {
                        let that = this;

                        $('#overlay').fadeIn();
                        $('#confirm-popup').fadeIn();

                        $('#confirm-yes').click(function () {
                            $('#overlay').fadeOut();
                            $('#confirm-popup').fadeOut();

                            // measure response time
                            var endTime = performance.now();
                            var response_time = Math.round(endTime - startTime);
                            // create object to hold responses
                            var question_data = {};
                            if (question.correct) {
                                var correctCheck = [...Array(trial.questions.length).fill(false)];
                            }
                            for (let i = 0; i < trial.questions.length; i++) {
                                var match = display_element.querySelector("#jspsych-survey-multi-choice-" + i);
                                var id = "Q" + i;
                                var val;
                                if (match.querySelector("input[type=radio]:checked") !== null) {
                                    val = match.querySelector("input[type=radio]:checked").value;
                                }
                                else {
                                    val = "";
                                }
                                var obje = {};
                                var name = id;
                                if (match.attributes["data-name"].value !== "") {
                                    name = match.attributes["data-name"].value;
                                }
                                obje[name] = val;
                                Object.assign(question_data, obje);

                                if (question.hint) {
                                    let hintmatch = display_element.getElementsByClassName('jspsych-survey-multi-choice-hint');
                                    if (val != match.attributes['data-correct'].value) {
                                        hintmatch.item(i).style.visibility = "visible";
                                        hintmatch.item(i).classList.add('fade-in');
                                    } else {
                                        hintmatch.item(i).style.visibility = "hidden";
                                        correctCheck[i] = true;
                                    }
                                } 
                            }   
                            if (question.hint) {
                                if (JSON.stringify(correctCheck) === JSON.stringify([...Array(trial.questions.length).fill(true)])) {
                                    var trial_data = {
                                        rt: response_time,
                                        response: question_data,
                                        question_order: question_order,
                                    };
                                    display_element.innerHTML = "";
                                    // next trial
                                    that.jsPsych.finishTrial(trial_data);
                                }
                            } else {
                                var trial_data = {
                                    rt: response_time,
                                    response: question_data,
                                    question_order: question_order,
                                };
                                display_element.innerHTML = "";
                                // next trial
                                that.jsPsych.finishTrial(trial_data);
                            }
                        });

                        $('#confirm-no').click(function () {
                            $('#overlay').fadeOut();
                            $('#confirm-popup').fadeOut();
                        });
                    } else {
                        // measure response time
                        var endTime = performance.now();
                        var response_time = Math.round(endTime - startTime);
                        // create object to hold responses
                        var question_data = {};
                        if (question.correct) {
                            var correctCheck = [...Array(trial.questions.length).fill(false)];
                        };
                        for (let i = 0; i < trial.questions.length; i++) {
                            var match = display_element.querySelector("#jspsych-survey-multi-choice-" + i);
                            let id = "Q" + i;
                            var val;
                            if (match.querySelector("input[type=radio]:checked") !== null) {
                                val = match.querySelector("input[type=radio]:checked").value;
                            }
                            else {
                                val = "";
                            }
                            var obje = {};
                            var name = id;
                            if (match.attributes["data-name"].value !== "") {
                                name = match.attributes["data-name"].value;
                            }
                            obje[name] = val;
                            Object.assign(question_data, obje);

                            if (question.hint) {
                                let hintmatch = display_element.getElementsByClassName('jspsych-survey-multi-choice-hint');
                                if (val != match.attributes['data-correct'].value) {
                                    hintmatch.item(i).style.visibility = "visible";
                                    hintmatch.item(i).classList.add('fade-in');
                                } else {
                                    hintmatch.item(i).style.visibility = "hidden";
                                    correctCheck[i] = true;
                                };
                            };
                        };
                        if (question.hint) {
                            if (JSON.stringify(correctCheck) === JSON.stringify([...Array(trial.questions.length).fill(true)])) {
                                var trial_data = {
                                    rt: response_time,
                                    response: question_data,
                                    question_order: question_order
                                };
                                display_element.innerHTML = "";
                                // next trial
                                this.jsPsych.finishTrial(trial_data);
                            };
                        } else {
                            var trial_data = {
                                rt: response_time,
                                response: question_data,
                                question_order: question_order
                            };
                            display_element.innerHTML = "";
                            // next trial
                            this.jsPsych.finishTrial(trial_data);
                        };
                    };
                } else {
                    // measure response time
                    var endTime = performance.now();
                    var response_time = Math.round(endTime - startTime);
                    // create object to hold responses
                    var question_data = {};
                    if (question.correct) {
                        var correctCheck = [...Array(trial.questions.length).fill(false)];
                    };
                    for (let i = 0; i < trial.questions.length; i++) {
                        var match = display_element.querySelector("#jspsych-survey-multi-choice-" + i);
                        var id = "Q" + i;
                        var val;
                        if (match.querySelector("input[type=radio]:checked") !== null) {
                            val = match.querySelector("input[type=radio]:checked").value;
                        } else {
                            val = "";
                        };
                        var obje = {};
                        var name = id;
                        if (match.attributes["data-name"].value !== "") {
                            name = match.attributes["data-name"].value;
                        };
                        obje[name] = val;
                        Object.assign(question_data, obje);

                        if (question.hint) {
                            let hintmatch = display_element.getElementsByClassName('jspsych-survey-multi-choice-hint');
                            if (val != match.attributes['data-correct'].value) {
                                hintmatch.item(i).style.visibility = "visible";
                                hintmatch.item(i).classList.add('fade-in');
                            } else {
                                hintmatch.item(i).style.visibility = "hidden";
                                correctCheck[i] = true;
                            };
                        };
                    };
                    if (question.hint) {
                        if (JSON.stringify(correctCheck) === JSON.stringify([...Array(trial.questions.length).fill(true)])) {
                            var trial_data = {
                                rt: response_time,
                                response: question_data,
                                question_order: question_order,
                            };
                            display_element.innerHTML = "";
                            // next trial
                            this.jsPsych.finishTrial(trial_data);
                        }
                    } else {
                        var trial_data = {
                            rt: response_time,
                            response: question_data,
                            question_order: question_order,
                        };
                        display_element.innerHTML = "";
                        // next trial
                        this.jsPsych.finishTrial(trial_data);
                    };
                };
            });
            var startTime = performance.now();
        }
        simulate(trial, simulation_mode, simulation_options, load_callback) {
            if (simulation_mode == "data-only") {
                load_callback();
                this.simulate_data_only(trial, simulation_options);
            }
            if (simulation_mode == "visual") {
                this.simulate_visual(trial, simulation_options, load_callback);
            }
        }
        create_simulation_data(trial, simulation_options) {
            const question_data = {};
            let rt = 1000;
            for (const q of trial.questions) {
                const name = q.name ? q.name : `Q${trial.questions.indexOf(q)}`;
                question_data[name] = this.jsPsych.randomization.sampleWithoutReplacement(q.options, 1)[0];
                rt += this.jsPsych.randomization.sampleExGaussian(1500, 400, 1 / 200, true);
            }
            const default_data = {
                response: question_data,
                rt: rt,
                question_order: trial.randomize_question_order
                    ? this.jsPsych.randomization.shuffle([...Array(trial.questions.length).keys()])
                    : [...Array(trial.questions.length).keys()],
            };
            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }
        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }
        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();
            this.trial(display_element, trial);
            load_callback();
            const answers = Object.entries(data.response);
            for (let i = 0; i < answers.length; i++) {
                this.jsPsych.pluginAPI.clickTarget(display_element
                    .querySelector(`#jspsych-survey-multi-choice-response-${i}-${trial.questions[i].options
                        .indexOf(answers[i][1])}`), ((data.rt - 1000) / answers.length) * (i + 1));
            }
            this.jsPsych.pluginAPI.clickTarget(
                display_element.querySelector("#jspsych-survey-multi-choice-next"), data.rt
            );
        }
    }
    SurveyMultiChoicePlugin.info = info;

    return SurveyMultiChoicePlugin;

})(jsPsychModule);
