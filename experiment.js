// DEFINE GLOBAL VARIABLES
let timeline = [];

// /* init connection with pavlovia.org */
// const pavlovia_init = {
// 	type: "pavlovia",
// 	command: "init"
// };
// timeline.push(pavlovia_init);

const jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  display_element: 'jspsych-target',
  show_progress_bar: false,
  default_iti: 0,
  on_finish: function (data) {
    window.location.href = 'https://app.prolific.co/submissions/complete?cc=1D1E1F3D';
    jsPsych.data.displayData('csv');
  }
});

const subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
const study_id = jsPsych.data.getURLVariable('STUDY_ID');
const session_id = jsPsych.data.getURLVariable('SESSION_ID');
let participant_condition = jsPsych.randomization.sampleWithoutReplacement(['epistemic', 'moral'], 1)[0];

jsPsych.data.addProperties({
  subject_id: subject_id,
  study_id: study_id,
  session_id: session_id,
  participant_condition: participant_condition
});

// Survey Options
const valueOpinionOptions = [
  'Yes',
  'Somewhat',
  'No'
];

// Need for (Cognitive) Closure (NFC)
const nfcResponses = [
  "Extremely uncharacteristic",
  "Somewhat uncharacteristic",
  "Uncertain",
  "Somewhat characteristic",
  "Extremely characteristic"
];

// Political Ideology
const politicalResponses = [
  "1 (Extremely liberal)",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 (Extremely conservative)",
];

// Experimenter Demand Effects
const demandEffectsResponses = [
  "1 = Not at all",
  "2",
  "3",
  "4",
  "5 = Very much so"
];

// Device Type
const deviceTypeResponses = [
  "Laptop/Desktop",
  "iPad/Tablet",
  "Other"
];

// Personality: The Big Five
const bigFiveResponses = [
  "Completely Disagree",
  "Disagree",
  "Slightly Disagree",
  "Slightly Agree",
  "Agree",
  "Completely Agree"
];

// ENTER FULLSCREEN //
const enterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};

// timeline.push(enterFullscreen)

// CONSENT FORM //
const consentForm = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'consent',
      prompt: `
            <p style="text-align:left;">
              You are being asked to participate in a research study titled 
              "Social Judgment and Decision-Making." You were selected to participate in 
              this project because you are an adult over age 18. This study is sponsored by 
              Boston College and the John Templeton Foundation.
            </p>
            <p style="text-align: left;">
              The purpose of this study is to understand how we weigh information about 
              others. This study will be conducted through this online survey. The survey 
              should take you between 15–45 minutes to complete. There are no direct 
              benefits to you, but you may feel gratified knowing that you helped further 
              the scholarly work in this research area, and we will compensate you for your 
              participation at a rate of $9.00/hour. In some cases, we will ask you about 
              your opinions; in other cases, we will ask you to try to answer questions and 
              prompts accurately. When we ask for the latter, we will also provide 
              additional compensation for each correct response. That rate will be $0.05 
              per correct response. There are no costs to you associated with your 
              participation.
            </p>
            <p style="text-align: left;">
              The researchers do not believe participation would entail any risks or 
              discomforts beyond those ordinarily encountered in everyday life.
            </p>
            <p style="text-align: left;">
              This Principal Investigator, Dr. Liane Young, will exert all reasonable efforts 
              to keep your responses and your identity confidential. We will not maintain 
              within our research data any information that uniquely identifies you, such as 
              your name, location, or Internet Protocol (IP) address. In any report we 
              publish, we will not include any information that will make it possible to 
              identify a participant. Data that includes user-ID information will be collected 
              and stored via third-party servers like Qualtrics or Pavlovia. Data collected 
              from the experiment will be coded to remove your name or any other 
              personal identifiers. All records will be secured in a locked cabinet in our lab. 
              The Institutional Review Board at Boston College and internal Boston College 
              auditors may review the research records. State or federal laws or court 
              orders may also require that information from research study records be 
              released. Otherwise, the researchers will not release to others any 
              information that could indicate your identity unless you give your permission, 
              or unless the researchers become legally required to do so.
            </p>
            <p style="text-align: left;">
              Although the survey will not prompt you directly to identify yourself by 
              name, email address or the like, the survey will include several demographic 
              items that would prompt you to provide certain demographic information, 
              such as your age, gender, ethnicity, education level and the like. In 
              combination, responses to such questions could suggest your identity. 
              Regardless, please know that the researchers will make no purposeful effort 
              to discern your identity based on such information. Additionally, please note 
              that you may opt to leave any such questions blank.
            </p>
            <p style="text-align: left;">
              Your participation is voluntary. If you choose not to participate it will not 
              affect your relations with Boston College. Some questions on the survey, 
              such as comprehension questions, may be required in order to complete the 
              survey and receive compensation. However, you may still choose to end 
              your participation in the study at any time. If you have questions or concerns 
              concerning this research you may contact the Principal Investigator at 
              <a href="tel:16175520240">+1 (617) 552-0240</a>
              or <a href="mailto:liane.young@bc.edu">liane.young@bc.edu</a>. If you have 
              questions about your rights as a research participant, you may contact the
              Office for Research Protections, Boston College, at 
              <a href="tel:16175524778">+1 (617) 552-4778</a> or
              <a href="mailto:irb@bc.edu">irb@bc.edu</a>.
            </p>
            <p style="text-align: left;">
              If you agree to the statements above and agree to participate in this study,
              please select the “Consent given” button below to continue.
            </p>`,
      options: ["Consent not given", "Consent given"],
      horizontal: true,
      required: true,
    }
  ],
  preamble: '<h2 style="text-align: center"><strong>Consent Form</strong></h2>',

  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (jsPsych.data.get().last(1).values()[0].response.consent == "Consent not given") {
      jsPsych.endExperiment(`
            <p class="jspsych-center">
              You did not consent to participate in this study.<br>
              Please return this study in Prolific.
            </p>`
      );
    }
  }
};

timeline.push(consentForm);


// EPISTEMIC INSTRUCTIONS //
const instructionsEpistemic = {
  type: jsPsychInstructions,
  pages: [`
        <h2><strong>Instructions (1/7)</strong></h2>
        <p style="text-align: left;">
          Welcome to this experiment! On the following pages, you will see a 
          series of statements describing actions taken by prominent people, 
          such as celebrities and historical figures.
          <strong>All of the people from these statements are real people.</strong>
        </p>
        <p style="text-align: left;">
          Your task is to assess the percentage of individuals in the United States 
          who believe each statement to be true or false. In order to accomplish this, 
          we will present you with the viewpoints of a sample that represents the entire nation.
        </p>
        <p style="text-align: left;">
          <strong>
            We are interested in both your perceptions of the beliefs held by the American public 
            and your personal opinions.
          </strong>
        </p>`,

    `<h2><strong>Instructions (2/7)</strong></h2>
        <p style="text-align: left;">
          We found out what percentage of people in the U.S. believe the statements you will see are true 
          or false in a previous study. For that study, we made sure to recruit a nationally representative 
          sample so that the views of those participants should accurately represent the views of people 
          in the <strong>U.S. more broadly.</strong>
        </p>`,

    `<h2><strong>Instructions (3/7)</strong></h2>
        <p style="text-align: left;">
          These statements are all structured the same way. They will make a claim about something a real 
          person from history did do, and then some of the outcomes of that supposed action. Your job is 
          to tell us whether you think other people think the statement about that person is or is not true.
        </p>`,

    `<h2><strong>Instructions (4/7)</strong></h2>
        <p style="text-align: left;">
          For example, if you saw the following statement:
        </p>
        <blockquote>
          “Robert Oppenheimer developed the atomic bomb, which ended World War II 
          but also enabled the devastation of Hiroshima and Nagasaki.”
        </blockquote>
        
        <p style="text-align: left;">
          Your job would be to evaluate what percentage of people you think believe that
          “Robert Oppenheimer developed the atomic bomb, which ended World War II 
          but also enabled the devastation of Hiroshima and Nagasaki.” is a 
          <strong>true (or false) statement.</strong>
        </p>`,

    `<h2><strong>Instructions (5/7)</strong></h2>
        <div class="quote">
          <h3>Example Claim</h3>
          <blockquote>
            “Robert Oppenheimer developed the atomic bomb, which ended World War II 
            but also enabled the devastation of Hiroshima and Nagasaki.”
          </blockquote>
        </div><br>
        <label for="practice-slider-epistemic-estimate-percent">
          As practice, please estimate what percentage of people in the U.S. believe, 
          based on these outcomes, that this claim is either true or false:<br><br>
          <strong>
            <code style='font-size: 10pt;' id="practice-slider-epistemic-estimate-percent-label">
              <i class="fa-solid fa-arrow-left" id="fa-arrow-left"></i>&nbsp;(slide to adjust)&nbsp;<i class="fa-solid fa-arrow-right" id="fa-arrow-right"></i>
            </code>
          </strong>
        </label>
        <div style="position: relative;">
          <input 
            name="practice-slider-epistemic-estimate-percent" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="practice-slider-epistemic-estimate-percent"
            oninput="
              this.classList.remove('incomplete')
              $('#practice-slider-epistemic-estimate-percent-label').addClass('fade-out')

              let rawRating = parseFloat(this.value);
              let downRating = (100 - rawRating) + '%';
              let upRating = rawRating + '%';
            
              $('#slider-downRating').text(downRating);
              $('#slider-upRating').text(upRating);
            "
          >
          <output style="position: absolute; left: 0%; font-size: 14pt;" id="slider-downRating">50%</output>
          <output style="position: absolute; right: 0%; font-size: 14pt;" id="slider-upRating">50%</output><br>
          <span class="jspsych-slider-left-anchor">
            <strong>Definitely false</strong>
          </span>
          <span class="jspsych-slider-right-anchor">
           <strong>Definitely true</strong>
          </span>
        </div>`,

    `<h2><strong>Instructions (6/7)</strong></h2>
        <p style="text-align: left;">
          To help you share your opinion about the statements, you will have the opportunity 
          to see what people in that previous study thought about the statements. You will see 
          avatars representing people who participated in that study.
        </p>
        <p style="text-align: left;">
          Every time you click on an avatar, you will see whether that 
          <strong>one person thought that particular statement was true or false.</strong> 
          You can view the opinions of as many people as you'd like before making your estimate.
        </p>`,

    `<h2><strong>Instructions (7/7)</strong></h2>
        <p style="text-align: left;">
          We will ask you several other questions about these statements,
          including how curious you are to learn more about what other people think about them.
          When answering questions about curiosity, sometimes people say that they are curious
          about <em>everything</em> when they actually differ slightly in how curious they are.
        </p>
        <p style="text-align: left;">  
          When answering the question of how curious you are, keep in mind that <strong>you shouldn't
          say you are extremely curious about all of them.</strong> Make sure to reserve answering that way
          for the options you are the absolute most curious to learn about.
        </p>`
  ],
  show_clickable_nav: true
};

// MORAL INSTRUCTIONS //
const instructionsMoral = {
  type: jsPsychInstructions,
  pages: [`
        <h2><strong>Instructions (1/7)</strong></h2>
        <p style="text-align: left;">
          Welcome to this experiment! On the following pages, you will see a series of 
          statements describing actions taken by prominent people, such as celebrities 
          and historical figures. Some of these actions are generally considered morally
          good actions. All of the people from the statements are real people.
        </p>
        <p style="text-align: left;">
          Your task is to assess the percentage of individuals in the United States who 
          consider it a morally good action. In order to accomplish this, we will present 
          you with the viewpoints of a sample that represents the entire nation. 
        </p>
        <p style="text-align: left;">
          <strong>
            We are interested in both your perceptions of the beliefs held by the American public 
            and your personal opinions.
          </strong>
        </p>`,

    `<h2><strong>Instructions (2/7)</strong></h2>
        <p style="text-align: left;">
          We found out what percentage of people in the U.S. believe that each action you will see is 
          considered morally good in a previous study. For that study, we made sure to recruit a 
          nationally representative sample so that the views of those participants should accurately 
          represent the views of people in the <strong>U.S. more broadly.</strong>
        </p>`,

    `<h2><strong>Instructions (3/7)</strong></h2>
        <p style="text-align: left;">
          These statements are all structured the same way. They will make a claim about something 
          a real person from history did (or did not) do, and then some of the outcomes of that 
          supposed action. Your job is to tell us whether you think other people think the actions 
          depicted in the statements you see are morally good or not. You should not evaluate how 
          likely the statement about the person is true or false, just your opinion about what 
          you think other people think about the morality of the actions depicted.
        </p>`,

    `<h2><strong>Instructions (4/7)</strong></h2>
        <p style="text-align: left;">
          For example, if you saw the following statement:
        </p>
        <blockquote>
          “Robert Oppenheimer developed the atomic bomb, which ended World War II 
          but also enabled the devastation of Hiroshima and Nagasaki.”
        </blockquote>
        <p style="text-align: left;">
          Your job would be to evaluate what percentage of people you think believe that
          “Robert Oppenheimer developed the atomic bomb, which ended World War II 
          but also enabled the devastation of Hiroshima and Nagasaki.” is a 
          <strong>morally good (or bad) action.</strong>
        </p>`,

    `<h2><strong>Instructions (5/7)</strong></h2>
        <div class="quote">
          <h3>Example Claim</h3>
          <blockquote>
            “Robert Oppenheimer developed the atomic bomb, which ended World War II 
            but also enabled the devastation of Hiroshima and Nagasaki.”
          </blockquote>
        </div><br>
        <label for="practice-slider-moral-estimate-percent">
          As practice, please estimate what percentage of people in the U.S. believe, 
          based on these outcomes, that Robert Oppenheimer is morally good or morally bad:<br><br>
          <strong>
            <code style="font-size: 10pt;" id="practice-slider-moral-estimate-percent-label">
              <i class="fa-solid fa-arrow-left" id="fa-arrow-left"></i>&nbsp;(slide to adjust)&nbsp;<i class="fa-solid fa-arrow-right" id="fa-arrow-right"></i>
            </code>
          </strong>
        </label>
        <div style="position: relative;">
          <input 
            name="practice-slider-moral-estimate-percent" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="practice-slider-moral-estimate-percent"
            oninput="
              this.classList.remove('incomplete')
              $('#practice-slider-moral-estimate-percent-label').addClass('fade-out')

              let rawRating = parseFloat(this.value);
              let downRating = (100 - rawRating) + '%';
              let upRating = rawRating + '%';
            
              $('#slider-downRating').text(downRating);
              $('#slider-upRating').text(upRating);
            "
          >
          <output style="position: absolute; left: 0%; font-size: 14pt;" id="slider-downRating">50%</output>
          <output style="position: absolute; right: 0%; font-size: 14pt; "id="slider-upRating">50%</output><br>
          <span class="jspsych-slider-left-anchor">
            Believe Robert Oppenheimer is <strong>morally bad</strong>
          </span>
          <span class="jspsych-slider-right-anchor">
            Believe Robert Oppenheimer is <strong>morally good</strong>
          </span>
        </div>`,

    `<h2><strong>Instructions (6/7)</strong></h2>
        <p style="text-align: left;">
          To help you share your opinion about the statements, you will have the opportunity 
          to see what people in that previous study thought about the statements. You will see 
          avatars representing people who participated in that study.
        </p>
        <p style="text-align: left;">
          Every time you click on an avatar, you will see whether that 
          <strong>one person thought that particular statement was morally good or bad.</strong> 
          You can view the opinions of as many people as you'd like before making your estimate.
        </p>`,

    `<h2><strong>Instructions (7/7)</strong></h2>
        <p style="text-align: left;">
          We will ask you several other questions about these statements,
          including how curious you are to learn more about what other people think about them.
          When answering questions about curiosity, sometimes people say that they are curious
          about <em>everything</em> when they actually differ slightly in how curious they are.
        </p>
        <p style="text-align: left;">
          When answering the question of how curious you are, keep in mind that <strong>you shouldn't
          say you are extremely curious about all of them.</strong> Make sure to reserve answering that way
          for the options you are the absolute most curious to learn about.
        </p>`
  ],
  show_clickable_nav: true
};

// if (participant_condition === 'epistemic') {
//   timeline.push(instructionsEpistemic);
// } else if (participant_condition === 'moral') {
//   timeline.push(instructionsMoral);
// };

const instructionsEpistemicComprehensionCheck = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'epistemic_comp_check_1',
      prompt: `
            <strong>
              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
              For each statement, your task is to:
            </strong>`,
      options: [
        "Estimate the percentage of people in the U.S. who believe the statement is true",
        "Estimate the percentage of people in the U.S. who believe the actions that the historical figures took were morally good",
        "Estimate the percentage of people in the U.S. who agree with me about the statement",
        "Estimate the percentage of people in the U.S. who have heard this statement before"
      ],
      correct: 'Estimate the percentage of people in the U.S. who believe the statement is true',
      hint: `That's not quite right. Remember, you are trying to estimate what percentage of people in the U.S. believe the statement is true</em>.`,
      required: true,
    },
    {
      name: 'epistemic_comp_check_2',
      prompt: `
            <strong>
              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
              You can view the opinions of as many people as you'd like before making your estimate.
            </strong>`,
      options: [
        "True",
        "False"
      ],
      correct: 'True',
      hint: `That's not quite right. Remember, you will have the chance to view the opinions of as many people as you'd like before making your estimate.`,
      required: true,
    },
    //        {
    //          name: 'epistemic_comp_check_3',
    //          prompt: `
    //            <strong>
    //              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
    //              You will earn a bonus for each statement if your estimate is within __ percent of the true number:
    //            </strong>`,
    //          options: ["5%", "10%", "15%", "20%"],
    //          correct: "10%",
    //          hint: `That's not quite right. Remember, you will earn a bonus for each statement if your estimate is within <em>10%</em> of the true number.`,
    //          required: true
    //        },
  ],
  preamble: `
        <h2 style="text-align: center;">Instructions Review</h2> 
        <p style="text-align: left;"> 
          The experiment will begin on the next page.
          
          As a reminder, you will see a series of statements and be asked to estimate 
          how many people think the outcome of the action in the statement is morally good (vs. morally bad).<br><br>

          We will first ask you a few questions about the statement you will see and what you think 
          before you get to see any information about what others think. Then, you will see a page 
          of many different avatars that each represent real participants' morally good vs. morally bad 
          opinions about the outcomes of the action in the statement you read.<br><br>

          <strong>
            You are free to review as many opinions as you would like before providing us 
            your final estimate of the percentage of people in the U.S. who consider 
            the outcome of the action to be morally good (vs. morally bad).
          </strong>

          To make sure you fully understand the instructions for this study, please answer the questions below: 
        </p>`,
};

const instructionsMoralComprehensionCheck = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'moral_comp_check_1',
      prompt: `
            <strong>
              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
              For each statement, your task is to:
            </strong>`,
      options: [
        "Estimate the percentage of people in the U.S. who believe the statement is true",
        "Estimate the percentage of people in the U.S. who believe the actions that the historical figures took were morally good",
        "Estimate the percentage of people in the U.S. who agree with me about the statement",
        "Estimate the percentage of people in the U.S. who have heard this statement before"
      ],
      correct: 'Estimate the percentage of people in the U.S. who believe the actions that the historical figures took were morally good',
      hint: `That's not quite right. Remember, you are trying to estimate what percentage of people in the U.S. believe the actions that the historical figures took were <em>morally good</em>.`,
      required: true,
    },
    {
      name: 'moral_comp_check_2',
      prompt: `
            <strong>
              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
              You can view the opinions of as many people as you'd like before making your estimate:
            </strong>`,
      options: [
        "True",
        "False"
      ],
      correct: 'True',
      hint: `That's not quite right. Remember, you will have the chance to view the opinions of as many people as you'd like before making your estimate.`,
      required: true,
    },
    //        {
    //          name: 'moral_comp_check_3',
    //          prompt: `
    //            <strong>
    //              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
    //              You will earn a bonus for each statement if your estimate is within __ percent of the true number:
    //            </strong>`,
    //          options: ["5%", "10%", "15%", "20%"],
    //          correct: "10%",
    //          hint: `That's not quite right. Remember, you will earn a bonus for each statement if your estimate is within <em>10%</em> of the true number.`,
    //          required: true
    //        },
  ],
  preamble: `
        <h2 style="text-align: center;">Instructions</h2> 
        <p style="text-align: left;"> 
          The experiment will begin on the next page.
          
          As a reminder, you will see a series of statements and be asked to estimate 
          how many people think the outcome of the action in the statement is morally good (vs. morally bad).<br><br>

          We will first ask you a few questions about the statement you will see and what you think 
          before you get to see any information about what others think. Then, you will see a page 
          of many different avatars that each represent real participants' morally good vs. morally bad 
          opinions about the outcomes of the action in the statement you read.<br><br>

          <strong>
            You are free to review as many opinions as you would like before providing us 
            your final estimate of the percentage of people in the U.S. who consider 
            the outcome of the action to be morally good (vs. morally bad).
          </strong>

          To make sure you fully understand the instructions for this study, please answer the questions below: 
        </p>`,
};

// if (participant_condition === 'epistemic') {
//   timeline.push(instructionsEpistemicComprehensionCheck);
// } else if (participant_condition === 'moral') {
//   timeline.push(instructionsMoralComprehensionCheck);
// };

// Epistemic Pre-Predictions: Self //
const prePredictionsEpistemicSelf = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, which revolutionized medical 
            treatments and contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Before you see what other people think about the statement, we want to know what you think:
        </p><br><br><br>`,
  html: `
        <!-- Pre-Sampling Epistemic Claim Rating -->

        <label for="pre-slider-epistemic-claim" class="jspsych-survey-multi-choice-question">
          To what extent do you think this claim is true or false?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-epistemic-claim" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-epistemic-claim"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Definitely false</span>
          <span class="jspsych-slider-right-anchor">Definitely true</span>
        </div><br><br><br>


        <!-- Pre-Sampling Epistemic Plausible Rating -->

        <label for="pre-slider-epistemic-plausible" class="jspsych-survey-multi-choice-question">
          To what extent do you think the content of this claim is plausible?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-epistemic-plausible" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-epistemic-plausible"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Definitely implausible</span>
          <span class="jspsych-slider-right-anchor">Definitely plausible</span>
        </div><br><br><br>


        <!-- Pre-Sampling Epistemic Curiosity -->

        <label for="pre-slider-epistemic-curious" class="jspsych-survey-multi-choice-question">
          How curious are you to learn about what other people think about this statement?<br><br>
          <em style="font-size: 10pt;">
            Remember that when answering the following question about how curious you are, 
            keep in mind that you should only say you are extremely curious for the 
            statements you are absolutely most curious to learn about.
          </em>
        </label>
        <div style="position: relative;">
          <input
            name="pre-slider-epistemic-curious" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-epistemic-curious"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Not at all curious</span>
          <span class="jspsych-slider-right-anchor">Extremely curious</span>
        </div><br><br><br>`,
  button_label: "Next",
  data: {
    task: 'Pre-Sampling Epistemic Self'
  },
  request_response: true
};

// Epistemic Pre-Predictions: Other //
const prePredictionsEpistemicOther = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, which revolutionized 
            medical treatments and contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Before you see what other people think about the statement, we want to know what you think:
        </p><br><br><br>`,
  html: `
        <!-- Pre-Sampling Epistemic Estimate Rating -->

        <label for="pre-slider-epistemic-estimate-percent" class="jspsych-survey-multi-choice-question">
          What percentage of people in the U.S. do you think consider this claim is true vs. think this is false?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-epistemic-estimate-percent" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-epistemic-estimate-percent"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');
              $('#pre-slider-epistemic-estimate-percent-label').addClass('fade-out');

              let rawRating = parseFloat(this.value);
              let downRating = (100 - rawRating) + '%';
              let upRating = rawRating + '%';
            
              $('#slider-downRating').text(downRating);
              $('#slider-upRating').text(upRating);
            "
          >
          <output style="position: absolute; left: 0%; font-size: 14pt;" id="slider-downRating">50%</output>
          <output style="position: absolute; right: 0%; font-size: 14pt;"id="slider-upRating">50%</output><br>
          <span class="jspsych-slider-left-anchor">Believe this claim is false</span>
          <span class="jspsych-slider-right-anchor">Believe this claim is true</span>
        </div><br><br><br>


        <!-- Pre-Sampling Epistemic Estimate Confidence -->

        <label for="pre-slider-epistemic-confidence" class="jspsych-survey-multi-choice-question">
          How confident are you in your answer?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-epistemic-confidence" 
            type="range" 
            class="jspsych-slider incomplete"
            value="50" min="0" max="100" step="1" 
            id="pre-slider-epistemic-confidence"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Not at all confident</span>
          <span class="jspsych-slider-right-anchor">Completely confident</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Pre-Sampling Epistemic Other'
  },
  request_response: true
};

// Moral Pre-Predictions: Self //
const prePredictionsMoralSelf = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, which revolutionized medical treatments and contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Before you see what other people think about 
          the statement, we want to know what you think:
        </p><br><br><br>`,
  html: `
        <!-- Pre-Sampling Moral Action Rating -->

        <label for="pre-slider-moral-action" class="jspsych-survey-multi-choice-question">
          To what extent do you think this <em>action</em> is morally good or morally bad?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-moral-action" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-moral-action"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
        >
          <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
          <span class="jspsych-slider-right-anchor">Definitely morally good</span>
        </div><br><br><br>


        <!-- Pre-Sampling Moral Person Rating -->

        <label for="pre-slider-moral-person" class="jspsych-survey-multi-choice-question">
          To what extent do you think this <em>person</em> is morally good or morally bad?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-moral-person"
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-moral-person"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
          <span class="jspsych-slider-right-anchor">Definitely morally good</span>
        </div><br><br><br>


        <!-- Pre-Sampling Moral Curiosity -->

        <label for="pre-slider-moral-curious" class="jspsych-survey-multi-choice-question">
          How curious are you to learn about what other people think about this statement?<br><br>
          <em style="font-size: 10pt;">
            Remember that when answering the following question about how curious you are, 
            keep in mind that you should only say you are extremely curious for the 
            statements you are absolutely most curious to learn about.
          </em>
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-moral-curious" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-moral-curious"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Not at all curious</span>
          <span class="jspsych-slider-right-anchor">Extremely curious</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Pre-Sampling Moral Self'
  },
  request_response: true
};

// Moral Pre-Predictions: Other //
const prePredictionsMoralOther = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, which revolutionized medical treatments and contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Before you see what other people think about the statement, we want to know what you think:
        </p><br>`,
  html: `
        <!-- Pre-Sampling Moral Estimate Rating -->

        <label for="pre-slider-moral-estimate-percent" class="jspsych-survey-multi-choice-question">
          What percentage of people in the U.S. do you think consider this action to be morally good vs. think this is morally bad?
        </label>
        <div style="position: relative;">
          <input 
            name="pre-slider-moral-estimate-percent" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-moral-estimate-percent"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');

              let rawRating = parseFloat(this.value);
              let downRating = (100 - rawRating) + '%';
              let upRating = rawRating + '%';
            
              $('#slider-downRating').text(downRating);
              $('#slider-upRating').text(upRating);
            "
          >
          <output style="position: absolute; left: 0%; font-size: 14pt;" id="slider-downRating">50%</output>
          <output style="position: absolute; right: 0%; font-size: 14pt;"id="slider-upRating">50%</output><br>
          <span class="jspsych-slider-left-anchor">Believe this action is morally bad</span>
          <span class="jspsych-slider-right-anchor">Believe this action is morally good</span>
        </div><br><br><br>


        <!-- Pre-Sampling Moral Estimate Confidence -->

        <label for="pre-slider-moral-confidence" class="jspsych-survey-multi-choice-question">
          How confident are you in your answer?
        <div style="position: relative;">
          <input 
            name="pre-slider-moral-confidence" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="pre-slider-moral-confidence"
            oninput="
              this.classList.remove('incomplete');
              this.classList.add('clicked');"
          >
          <span class="jspsych-slider-left-anchor">Not at all confident</span>
          <span class="jspsych-slider-right-anchor">Completely confident</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Pre-Sampling Moral Other'
  },
  request_response: true
};

if (participant_condition === 'epistemic') {
  timeline.push(
    prePredictionsEpistemicSelf,
    prePredictionsEpistemicOther
  );
} else if (participant_condition === 'moral') {
  timeline.push(
    prePredictionsMoralSelf,
    prePredictionsMoralOther
  );
};

const epistemicStatements = [
  `"Norman Borlaug, fathering the Green Revolution, increased crop yields worldwide but contributed to environmental degradation."`
];

const moralStatements = [
  `"Fritz Haber, developing the Haber-Bosch process, revolutionized agriculture but also enabled the creation of deadly chemical weapons."`
];

const epistemicTrueResponsesArray = [
  `"I reckon this is right."`,
  `"Looks true to me."`,
  `"I feel like this is on point."`,
  `"This seems legit to me."`,
  `"I'm pretty sure this is right."`,
  `"It's my gut feeling this is true."`,
  `"I'm convinced this is the real deal."`,
  `"I'm betting this is correct."`,
  `"This rings true for me."`,
  `"Smells like truth to me."`,
  `"I'm down with this being true."`,
  `"My vibe says this is accurate."`,
  `"I'm vibing with this as truth."`,
  `"My money's on this being right."`,
  `"It's pretty clear to me this is true."`,
  `"To me, this hits the bullseye."`,
  `"Sounds about right to me."`,
  `"I think we're onto something here."`,
  `"I'm picking up what this is putting down."`,
  `"I can roll with this being true."`,
  `"This is feeling true to me."`,
  `"I'd say this is spot-on."`,
  `"This looks legit to me."`,
  `"I'm thinking this is the real deal."`,
  `"I'm sensing truth here."`,
  `"I'm totally on board with this."`,
  `"This feels like a bullseye to me."`,
  `"I bet this is accurate."`,
  `"This is passing my smell test."`,
  `"No BS detected here."`,
  `"Something's right here, I reckon."`,
  `"This adds up to me."`,
  `"I'm calling truth on this."`,
  `"This strikes me as accurate."`,
  `"This sits right with me."`,
  `"I'm sold on this."`,
  `"This looks like a home run."`,
  `"My spidey senses say this is true."`,
  `"I think we're barking up the right tree here."`,
  `"This one's landing for me."`,

  `"I reckon this is right."`,
  `"Looks true to me."`,
  `"I feel like this is on point."`,
  `"This seems legit to me."`,
  `"I'm pretty sure this is right."`,
  `"It's my gut feeling this is true."`,
  `"I'm convinced this is the real deal."`,
  `"I'm betting this is correct."`,
  `"This rings true for me."`,
  `"Smells like truth to me."`,
  `"I'm down with this being true."`,
  `"My vibe says this is accurate."`,
  `"I'm vibing with this as truth."`,
  `"My money's on this being right."`,
  `"It's pretty clear to me this is true."`,
  `"To me, this hits the bullseye."`,
  `"Sounds about right to me."`,
  `"I think we're onto something here."`,
  `"I'm picking up what this is putting down."`,
  `"I can roll with this being true."`,
  `"This is feeling true to me."`,
  `"I'd say this is spot-on."`,
  `"This looks legit to me."`,
  `"I'm thinking this is the real deal."`,
  `"I'm sensing truth here."`,
  `"I'm totally on board with this."`,
  `"This feels like a bullseye to me."`,
  `"I bet this is accurate."`,
  `"This is passing my smell test."`,
  `"No BS detected here."`,
  `"Something's right here, I reckon."`,
  `"This adds up to me."`,
  `"I'm calling truth on this."`,
  `"This strikes me as accurate."`,
  `"This sits right with me."`,
  `"I'm sold on this."`,
  `"This looks like a home run."`,
  `"My spidey senses say this is true."`,
  `"I think we're barking up the right tree here."`,
  `"This one's landing for me."`,

  `"I reckon this is right."`,
  `"Looks true to me."`,
  `"I feel like this is on point."`,
  `"This seems legit to me."`,
  `"I'm pretty sure this is right."`,
  `"It's my gut feeling this is true."`,
  `"I'm convinced this is the real deal."`,
  `"I'm betting this is correct."`,
  `"This rings true for me."`,
  `"Smells like truth to me."`,
  `"I'm down with this being true."`,
  `"My vibe says this is accurate."`,
  `"I'm vibing with this as truth."`,
  `"My money's on this being right."`,
  `"It's pretty clear to me this is true."`,
  `"To me, this hits the bullseye."`,
  `"Sounds about right to me."`,
  `"I think we're onto something here."`,
  `"I'm picking up what this is putting down."`,
  `"I can roll with this being true."`
];

const epistemicFalseResponsesArray = [
  `"This is false."`,
  `"I reckon this is off."`,
  `"Doesn't look right to me."`,
  `"I feel like this is off base."`,
  `"This seems fishy to me."`,
  `"I'm pretty sure this ain't right."`,
  `"My gut says this is wrong."`,
  `"I'm not buying this."`,
  `"I'm doubting this is correct."`,
  `"This doesn't ring true for me."`,
  `"Smells like a fib to me."`,
  `"I'm not down with this being true."`,
  `"My vibe says this is off."`,
  `"I'm not vibing with this as truth."`,
  `"My money's on this being off."`,
  `"It's pretty clear to me this is false."`,
  `"To me, this misses the mark."`,
  `"Doesn't sound right to me."`,
  `"I think we're off track here."`,
  `"I'm not picking up what this is putting down."`,
  `"I can't roll with this being true."`,
  `"I do not feel like this is actually true."`,
  `"I'd say this is a no-go."`,
  `"This is looking sketchy to me."`,
  `"I'm thinking this isn't the case."`,
  `"I think this is false."`,
  `"Not sure I'm on board with this."`,
  `"This feels like a misfire to me."`,
  `"I bet this isn't accurate."`,
  `"This isn't passing my smell test."`,
  `"This is tripping my BS detector."`,
  `"Something's off here, I reckon."`,
  `"This doesn't add up to me."`,
  `"I'm calling shenanigans on this."`,
  `"This strikes me as wrong."`,
  `"This doesn't sit right with me."`,
  `"I'm not sold on this."`,
  `"This looks like a swing and a miss."`,
  `"My spidey senses say this isn't true."`,
  `"I think we're barking up the wrong tree here."`,

  `"This is false."`,
  `"I reckon this is off."`,
  `"Doesn't look right to me."`,
  `"I feel like this is off base."`,
  `"This seems fishy to me."`,
  `"I'm pretty sure this ain't right."`,
  `"My gut says this is wrong."`,
  `"I'm not buying this."`,
  `"I'm doubting this is correct."`,
  `"This doesn't ring true for me."`,
  `"Smells like a fib to me."`,
  `"I'm not down with this being true."`,
  `"My vibe says this is off."`,
  `"I'm not vibing with this as truth."`,
  `"My money's on this being off."`,
  `"It's pretty clear to me this is false."`,
  `"To me, this misses the mark."`,
  `"Doesn't sound right to me."`,
  `"I think we're off track here."`,
  `"I'm not picking up what this is putting down."`,
  `"I can't roll with this being true."`,
  `"I do not feel like this is actually true."`,
  `"I'd say this is a no-go."`,
  `"This is looking sketchy to me."`,
  `"I'm thinking this isn't the case."`,
  `"I think this is false."`,
  `"Not sure I'm on board with this."`,
  `"This feels like a misfire to me."`,
  `"I bet this isn't accurate."`,
  `"This isn't passing my smell test."`,
  `"This is tripping my BS detector."`,
  `"Something's off here, I reckon."`,
  `"This doesn't add up to me."`,
  `"I'm calling shenanigans on this."`,
  `"This strikes me as wrong."`,
  `"This doesn't sit right with me."`,
  `"I'm not sold on this."`,
  `"This looks like a swing and a miss."`,
  `"My spidey senses say this isn't true."`,
  `"I think we're barking up the wrong tree here."`,

  `"This is false."`,
  `"I reckon this is off."`,
  `"Doesn't look right to me."`,
  `"I feel like this is off base."`,
  `"This seems fishy to me."`,
  `"I'm pretty sure this ain't right."`,
  `"My gut says this is wrong."`,
  `"I'm not buying this."`,
  `"I'm doubting this is correct."`,
  `"This doesn't ring true for me."`,
  `"Smells like a fib to me."`,
  `"I'm not down with this being true."`,
  `"My vibe says this is off."`,
  `"I'm not vibing with this as truth."`,
  `"My money's on this being off."`,
  `"It's pretty clear to me this is false."`,
  `"To me, this misses the mark."`,
  `"Doesn't sound right to me."`,
  `"I think we're off track here."`,
  `"I'm not picking up what this is putting down."`
];

const moralGoodResponsesArray = [
  `"I think this person is morally good."`,
  `"This person seems morally good to me."`,
  `"They're as honest as the day is long, in my book."`,
  `"This one's got a heart of gold, I reckon."`,
  `"They're a good person, no doubt about it."`,
  `"This person's pure and good, through and through."`,
  `"They're as good as they come."`,
  `"I'm pretty convinced they're a good stand-up person."`,
  `"They've got a moral code that's rock solid."`,
  `"I'd stake my reputation on them being decent."`,
  `"They're about as morally good as you can get."`,
  `"This one's got their moral ducks in a row."`,
  `"They're good people, for sure."`,
  `"I believe they've got their moral act together."`,
  `"I'd put my money on them being upright."`,
  `"This person's got good vibes, all around."`,
  `"They're a straight arrow, if you ask me."`,
  `"I reckon they're morally sound."`,
  `"They're a paragon of virtue, in my eyes."`,
  `"I feel like they're one of the good ones."`,
  `"They've got a moral compass that's on point."`,

  `"I think this person is morally good."`,
  `"This person seems morally good to me."`,
  `"They're as honest as the day is long, in my book."`,
  `"This one's got a heart of gold, I reckon."`,
  `"They're a good person, no doubt about it."`,
  `"This person's pure and good, through and through."`,
  `"They're as good as they come."`,
  `"I'm pretty convinced they're a good stand-up person."`,
  `"They've got a moral code that's rock solid."`,
  `"I'd stake my reputation on them being decent."`,
  `"They're about as morally good as you can get."`,
  `"This one's got their moral ducks in a row."`,
  `"They're good people, for sure."`,
  `"I believe they've got their moral act together."`,
  `"I'd put my money on them being upright."`,
  `"This person's got good vibes, all around."`,
  `"They're a straight arrow, if you ask me."`,
  `"I reckon they're morally sound."`,
  `"They're a paragon of virtue, in my eyes."`,
  `"I feel like they're one of the good ones."`,
  `"They've got a moral compass that's on point."`,

  `"I think this person is morally good."`,
  `"This person seems morally good to me."`,
  `"They're as honest as the day is long, in my book."`,
  `"This one's got a heart of gold, I reckon."`,
  `"They're a good person, no doubt about it."`,
  `"This person's pure and good, through and through."`,
  `"They're as good as they come."`,
  `"I'm pretty convinced they're a good stand-up person."`,
  `"They've got a moral code that's rock solid."`,
  `"I'd stake my reputation on them being decent."`,
  `"They're about as morally good as you can get."`
];

const moralBadResponsesArray = [
  `"I think this person is morally bad."`,
  `"This person seems morally bad to me."`,
  `"This one's morally bad."`,
  `"They're a bad apple, no doubt about it."`,
  `"This person's sketchy, through and through."`,
  `"This person is morally bad."`,
  `"I'm pretty convinced they're not on the up-and-up."`,
  `"They've got a moral code that's warped."`,
  `"I wouldn't trust them as far as I could throw them."`,
  `"They're morally off the rails, for sure."`,
  `"This one's got their moral wires crossed."`,
  `"They're bad news, for sure."`,
  `"I believe they've got a skewed sense of right and wrong."`,
  `"I wouldn't bet on them doing the right thing."`,
  `"This person gives off bad vibes, all around."`,
  `"They're morally twisted, if you ask me."`,
  `"I reckon they're morally bankrupt."`,
  `"They're a moral train wreck, in my eyes."`,
  `"I feel like they're one of the bad ones."`,
  `"They've got a moral compass that's way off."`,

  `"I think this person is morally bad."`,
  `"This person seems morally bad to me."`,
  `"This one's morally bad."`,
  `"They're a bad apple, no doubt about it."`,
  `"This person's sketchy, through and through."`,
  `"This person is morally bad."`,
  `"I'm pretty convinced they're not on the up-and-up."`,
  `"They've got a moral code that's warped."`,
  `"I wouldn't trust them as far as I could throw them."`,
  `"They're morally off the rails, for sure."`,
  `"This one's got their moral wires crossed."`,
  `"They're bad news, for sure."`,
  `"I believe they've got a skewed sense of right and wrong."`,
  `"I wouldn't bet on them doing the right thing."`,
  `"This person gives off bad vibes, all around."`,
  `"They're morally twisted, if you ask me."`,
  `"I reckon they're morally bankrupt."`,
  `"They're a moral train wreck, in my eyes."`,
  `"I feel like they're one of the bad ones."`,
  `"They've got a moral compass that's way off."`,

  `"I think this person is morally bad."`,
  `"This person seems morally bad to me."`,
  `"This one's morally bad."`,
  `"They're a bad apple, no doubt about it."`,
  `"This person's sketchy, through and through."`,
  `"This person is morally bad."`,
  `"I'm pretty convinced they're not on the up-and-up."`,
  `"They've got a moral code that's warped."`,
  `"I wouldn't trust them as far as I could throw them."`,
  `"They're morally off the rails, for sure."`
];

const avatarNames = Array.from({ length: 100 }, (_, i) => "avatar" + i);
const avatarPhotos = Array.from({ length: 100 }, (_, i) => `./avatars/photo${i + 1}.png`);

//associate words and items (images) in a dictionary
let avatarDictionary = {};
for (let i = 0; i < 100; i++) {

  // convert each item to a dictionary containing the image and the word // use normally
  avatarData = {
    photo: avatarPhotos[i],
    statement: epistemicTrueResponsesArray[i]
  };

  // add this dictionary to the overall stimulus dictionary
  avatarDictionary[avatarNames[i]] = avatarData;
};

// to balance where the target is on each trial
const currentLocationList = [...Array(100).keys()];

let select = {
  type: jsPsychSelectionLearning,
  currentLocationList: currentLocationList,
  avatarNames: avatarDictionary,
  condition: participant_condition,
  choices: [
    "<i class='fa-solid fa-rotate-left'></i>&nbsp;&nbsp;Read more",
    "<i class='fa-solid fa-circle-check' style='color: green'></i>&nbsp;&nbsp;I'm all done"
  ],
  data: {
    trialType: "selection"
  }
};

for (let i = 1; i <= 100; i++) {
  let imageProperty = 'image' + i;
  let imageIndex = currentLocationList[i - 1];
  let imageValue = avatarDictionary[avatarNames[imageIndex]].image;

  select = Object.assign(select, { [imageProperty]: imageValue });
};

timeline.push(select);


// Epistemic Post-Predictions: Self //
const postPredictionsEpistemicSelf = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, 
            which revolutionized medical treatments and 
            contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Now that you've had the chance to see what other people 
          think about the statement, we want to know what you think again.
          Please answer the following questions:<br><br>
        </p><br>`,
  html: `
        <!-- Post-Sampling Epistemic Estimate Rating -->

        <label for="post-slider-epistemic-claim">
          To what extent do you think this claim is true or false?
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-epistemic-claim" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-epistemic-claim"
            oninput="this.classList.remove('incomplete');"
          >
          <span class="jspsych-slider-left-anchor">Definitely false</span>
          <span class="jspsych-slider-right-anchor">Definitely true</span>
        </div><br><br><br>
        

        <!-- Post-Sampling Epistemic Plausible Rating -->

        <label for="post-slider-epistemic-plausible" class="jspsych-survey-multi-choice-question">
          To what extent do you think the content of this claim is plausible?
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-epistemic-plausible" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-epistemic-plausible"
            oninput="this.classList.remove('incomplete')"
          >
          <span class="jspsych-slider-left-anchor">Definitely implausible</span>
          <span class="jspsych-slider-right-anchor">Definitely plausible</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Estimate'
  },
  request_response: true
}

// Epistemic Post-Predictions: Other //
const postPredictionsEpistemicOther = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, 
            which revolutionized medical treatments and 
            contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Now that you've had the chance to see what other people 
          think about the statement, we want to know what you think again.
          Please answer the following questions:<br><br>
        </p><br>`,
  html: `
        <!-- Post-Sampling Epistemic Estimate -->

        <label for="post-slider-epistemic-estimate-percent" class="jspsych-survey-multi-choice-question">
          What percentage of people in the U.S. do you think believe this claim is true vs. think this is false?
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-epistemic-estimate-percent" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-epistemic-estimate-percent"
            oninput="
              this.classList.remove('incomplete');
              $('#post-slider-epistemic-estimate-percent-label').addClass('fade-out');

              let rawRating = parseFloat(this.value);
              let downRating = (100 - rawRating) + '%';
              let upRating = rawRating + '%';
            
              $('#slider-downRating').text(downRating);
              $('#slider-upRating').text(upRating);
            "
          >
          <output style="position: absolute; left: 0; font-size: 14pt;" id="slider-downRating">50%</output>
          <output style="position: absolute; right: 0; font-size: 14pt;"id="slider-upRating">50%</output><br>
          <span class="jspsych-slider-left-anchor">Believe this claim is false</span>
          <span class="jspsych-slider-right-anchor">Believe this claim is true</span>
        </div><br><br><br>


        <!-- Post-Sampling Epistemic Estimate Confidence -->

        <label for="post-slider-epistemic-confidence" class="jspsych-survey-multi-choice-question">
          How confident are you in your answer?
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-epistemic-confidence" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-epistemic-confidence"
            oninput="this.classList.remove('incomplete');"
          >
          <span class="jspsych-slider-left-anchor">Not at all confident</span>
          <span class="jspsych-slider-right-anchor">Completely confident</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Estimate'
  },
  request_response: true
};

// Moral Post-Predictions Self //
const postPredictionsMoralSelf = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, which revolutionized medical treatments and contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Now that you've had the chance to see what other people 
          think about the statement, we want to know what you think again.
          Please answer the following questions:
        </p><br><br><br>`,
  html: `
        <!-- Post-Sampling Moral Action Rating -->

        <label for="post-slider-moral-action" class="jspsych-survey-multi-choice-question">
          To what extent do you think this <em>action</em> is morally good or morally bad? 
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-moral-action" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-moral-action"
            oninput="this.classList.remove('incomplete');"
          >
          <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
          <span class="jspsych-slider-right-anchor">Definitely morally good</span>
        </div><br><br><br>
        

        <!-- Post-Sampling Moral Person Rating -->

        <label for="post-slider-moral-person" class="jspsych-survey-multi-choice-question">
          To what extent do you think this <em>person</em> is morally good or morally bad? 
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-moral-person"
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-moral-person"
            oninput="this.classList.remove('incomplete');"
          >
          <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
          <span class="jspsych-slider-right-anchor">Definitely morally good</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Estimate'
  },
  request_response: true
};

// Moral Post-Predictions Other //
const postPredictionsMoralOther = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <div class="quote">
          <h3>Statement #1</h3>
          <blockquote>
            "Marie Curie discovered radium and polonium, which revolutionized medical treatments and contributed to the development of nuclear weapons."
          </blockquote>
        </div>
        <p class="jspsych-survey-multi-choice-preamble">
          Now that you've had the chance to see what other people 
          think about the statement, we want to know what you think again.
          Please answer the following questions:
        </p><br><br><br>`,
  html: `
        <!-- Post-Sampling Moral Estimate Rating -->

        <label for="post-slider-moral-estimate-percent" class="jspsych-survey-multi-choice-question">
          What percentage of people in the U.S. do you think consider this action to be morally good vs. think this is morally bad?
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-moral-estimate-percent" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-moral-estimate-percent"
            oninput="
              this.classList.remove('incomplete');
            
              let rawRating = parseFloat(this.value);
              let downRating = (100 - rawRating) + '%';
              let upRating = rawRating + '%';
            
              $('#slider-downRating').text(downRating);
              $('#slider-upRating').text(upRating);
            "
          >
          <output style="position: absolute; left: 0%; font-size: 14pt;" id="slider-downRating">50%</output>
          <output style="position: absolute; right: 0%; font-size: 14pt;"id="slider-upRating">50%</output><br>
          <span class="jspsych-slider-left-anchor">Believe this action is morally bad</span>
          <span class="jspsych-slider-right-anchor">Believe this action is morally good</span>
        </div><br><br><br>

        
        <!-- Post-Sampling Moral Estimate Confidence -->

        <label for="post-slider-moral-confidence" class="jspsych-survey-multi-choice-question">
          How confident are you in your answer?
        </label>
        <div style="position: relative;">
          <input 
            name="post-slider-moral-confidence" 
            type="range" 
            class="jspsych-slider incomplete" 
            value="50" min="0" max="100" step="1" 
            id="post-slider-moral-confidence"
            oninput="this.classList.remove('incomplete');"
          >
          <span class="jspsych-slider-left-anchor">Not at all confident</span>
          <span class="jspsych-slider-right-anchor">Completely confident</span>
        </div><br><br><br>`,
  button_label: 'Next',
  data: {
    task: 'Estimate'
  },
  request_response: true
};

if (participant_condition === 'epistemic') {
  timeline.push(
    postPredictionsEpistemicSelf,
    postPredictionsEpistemicOther
  );
} else if (participant_condition === 'moral') {
  timeline.push(
    postPredictionsMoralSelf,
    postPredictionsMoralOther
  );
};

// Value Opinion Question //
const valueOpinionQuestions = {
  type: jsPsychSurveyMultiChoice,
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Do you value the opinion of the following people?
        </p>`,
  randomize_question_order: true,
  questions: [
    {
      name: 'liberal_value_opinion',
      prompt: '<p class="jspsych-survey-multi-choice-question">Liberals</p>',
      options: valueOpinionOptions,
      horizontal: true
    },
    {
      name: 'conservative_value_opinion',
      prompt: '<p class="jspsych-survey-multi-choice-question">Conservatives</p>',
      options: valueOpinionOptions,
      horizontal: true
    }
  ],
  request_response: true
};

timeline.push(valueOpinionQuestions);

// Need for Cognitive Control //
const nfcQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'nfc_1_simple_complex',
      prompt: '<p class="jspsych-survey-multi-choice-question">I would prefer complex to simple problems.</p>',
      options: nfcResponses,
    },
    {
      name: 'nfc_2_responsibility',
      prompt: `<p class="jspsych-survey-multi-choice-question">
              I like to have the responsibility of handling a situation that requires a lot of thinking.</p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc_3_not_fun',
      prompt: '<p class="jspsych-survey-multi-choice-question">Thinking is not my idea of fun.</p>',
      options: nfcResponses,
    },
    {
      name: 'nfc_4_little_thought',
      prompt: `<p class="jspsych-survey-multi-choice-question">
              I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.</p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc_5_new_solutions',
      prompt: `<p class="jspsych-survey-multi-choice-question">I really enjoy a task that involves coming up with new solutions to problems.</p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc_6_intellectual',
      prompt: `<p class="jspsych-survey-multi-choice-question">
              I would prefer a task that is intellectual, difficult, and important to one than is somewhat important but does not require much thought.</p>`,
      options: nfcResponses,
    }
  ],
  randomize_question_order: true,
  request_response: true,
  preamble: `<p class="jspsych-survey-multi-choice-preamble">
          Please indicate how much you agree with each of the following statements, or how true it is about you using the scale provided:</p>`,
  scale_width: 500
};

timeline.push(nfcQuestions);

const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Using the scales provided, please respond to each question about you as an individual:
        </p>`,
  html: `
        <!-- Age -->

        <div class="jspsych-survey-multi-choice-question">
          <label for="age">How old are you?</label><br>
          <input 
            type="number" 
            id="age" 
            name="age" 
            min="18" max="100" 
            style="padding: 5px; width: 40px;" 
            class="incomplete"
            oninput="
              this.classList.remove('incomplete')
            "
          >
        </div>
        

        <!-- Race/Ethnicity -->

        <div class="jspsych-survey-multi-choice-question">
          <legend>Please indicate how you identify yourself:</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-indigenous" 
              name="race_ethnicity" 
              value="race_ethnicity_indigenous" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-indigenous">Indigenous American or Alaskan Native</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-asian" 
              name="race_ethnicity" 
              value="race_ethnicity_asian" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-asian">Asian or Asian-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-black" 
              name="race_ethnicity" 
              value="race_ethnicity_black" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-black">African or African-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-native" 
              name="race_ethnicity" 
              value="race_ethnicity_native" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-native">Native Hawaiian or other Pacific Islander</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-white" 
              name="race_ethnicity" 
              value="race_ethnicity_white" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-white">White</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-hispanic" 
              name="race_ethnicity" 
              value="race_ethnicity_hispanic" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-hispanic">Hispanic/Latino/a/e/x</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-other" 
              name="race_ethnicity" 
              value="race_ethnicity_other" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox"
              id="race-ethnicity-prefer-not" 
              name="race_ethnicity" 
              value="race_ethnicity_prefer_not" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll('.demographics-race-ethnicity');
                for (var i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-prefer-not">Prefer not to disclose</label>
          </div>
        </div>


        <!-- Gender -->
        
        <div class="jspsych-survey-multi-choice-question">
          <legend>With which gender do you most closely identify?</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-man" 
              name="gender" 
              value="gender_man" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll('.demographics-gender');
                for (var i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-man">Man</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-woman" 
              name="gender" 
              value="gender_woman" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll('.demographics-gender');
                for (var i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-woman">Woman</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-non-binary" 
              name="gender" 
              value="gender_non_binary" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll('.demographics-gender');
                for (var i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-non-binary">Non-binary</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-other" 
              name="gender" 
              value="gender_other" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll('.demographics-gender');
                for (var i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-prefer-not" 
              name="gender" 
              value="gender_prefer_not" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll('.demographics-gender');
                for (var i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-prefer-not">Prefer not to disclose</label>
          </div>
        </div>
        
        <style id="jspsych-survey-multi-choice-css">
          .jspsych-survey-multi-choice-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }
          .jspsych-survey-multi-choice-option { font-size: 10pt; line-height: 2; }
          .jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option { 
            display: inline-block; margin-left: 1em; margin-right: 1em; vertical-align: top; text-align: center; 
          } label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}
        </style>
      `,
  button_label: 'Next',
  data: {
    task: 'Estimate'
  },
  request_response: true,
  on_finish: function (data) {
    const demographics = data.response;

    let age = Number(demographics['age']);
    let race = demographics['race_ethnicity'];
    let gender = demographics['gender'];
  }
};

timeline.push(demographicsQuestions);

const politicsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'political_ideology_economic',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>economic</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political_ideology_social',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>social</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political_ideology_overall',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your <strong>overall</strong> political beliefs?
            </p>`,
      options: politicalResponses,
      horizontal: true
    }
  ],
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Please answer the following questions about your political ideology:
        </p>`,
  request_response: true
};

timeline.push(politicsQuestions);

const demandDeviceQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'device',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
              What kind of device did you use to complete this study?
            </p>`,
      options: deviceTypeResponses,
      horizontal: true
    },
    {
      name: 'pressure',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
              Did you feel pressure to respond in a particular way to any of the questions?
            </p>`,
      options: demandEffectsResponses,
      horizontal: true
    },
    {
      name: 'judgment',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
              Did you feel as though you might be judged for your responses to the questions you answered?
            </p>`,
      options: demandEffectsResponses,
      horizontal: true
    }
  ],
  randomize_question_order: true,
  request_response: true,
  scale_width: 500,
  preamble:
    `<p class="jspsych-survey-multi-choice-preamble">
          For these final questions, please answer as honestly as you can.
          The answers to these questions will <strong>not</strong> affect whether or not you receive credit/payment for participation!
        </p>`
};

timeline.push(demandDeviceQuestions);

const bigFiveQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: "extraversion_1",
      prompt: `
            <p class="jspsych-survey-multi-choice-question"> \
              I see myself as <strong>extraverted, enthusiastic.</strong> \
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "agreeableness_2_r",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>critical, quarrelsome.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "conscientiousness_3",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>dependable, self-disciplined.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "emotional_stability_4_r",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>anxious, easily upset.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "openness_5",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>open to new experiences, complex.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "extraversion_6_r",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>reserved, quiet.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "agreeableness_7",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>sympathetic, warm.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "conscientiousness_8_r",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>disorganized, careless.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "emotional_stability_9",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>calm, emotionally stable.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "openness_10_r",
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              I see myself as <strong>conventional, uncreative.</strong>
            </p>`,
      options: bigFiveResponses,
      horizontal: true
    }
  ],
  randomize_question_order: true,
  request_response: true,
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Here are a number of personality traits that may or may not apply to you.
          Please choose the options next to each statement to indicate the extent 
          to which you agree or disagree with that statement. You should rate the 
          extent to which the <strong>pair</strong> of traits applies to you, even
          if one characteristic applies more strongly than the other. Show how much
          you agree with the items below. You can work quickly; your first feeling 
          is generally best.
        </p>`
};

timeline.push(bigFiveQuestions);

// CREATE FINAL EXPERIMENT MESSAGE/ DEBRIEF AFTER DATA SUCCESSFULLY STORED
// including a random code participants can use to confirm they took the study (for payment on Amazon Mechanical Turk)

//create random code for final message
//start code creation script
function randomLetter() {
  const a_z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let int = Math.floor(Math.random() * a_z.length);
  let randLetter = a_z[int];
  return randLetter;
};

const secretCode = "Crossact"; // this is the 'key'
let code = "";

for (let i = 0; i < 7; i++) {
  code = code.concat(randomLetter());
};

code = code.concat(secretCode);

for (let i = 0; i < 10; i++) {
  code = code.concat(randomLetter());
};
//end code creation script

//debrief and code message

const finalInstructions = {
  type: jsPsychInstructions,
  size: 400,
  pages: [
    `<div class="jspsych-center">
      Thanks for participating! You will be redirected in <> seconds.
    </div>`
  ],
  show_clickable_nav: false
};

//add instructions trial to experiment
timeline.push(finalInstructions);

// Exit fullscreen
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
};

timeline.push(exitFullscreen);

// PRELOADING
// this should be handled within the plugins, but I've gotten mixed results relying on this,
// so to be extra sure, preload all relevant files prior to starting the experiment

//preload all images
const imageSet = avatarPhotos;

// /* finish connection with pavlovia.org */
// const pavlovia_finish = {
// 	type: "pavlovia",
// 	command: "finish"
// 	};
// timeline.push(pavlovia_finish);

jsPsych.pluginAPI.preloadImages(imageSet, function () {
  startExperiment();
});

// START & RUN EXPERIMENT
// including unctions that handle storing the data

//function for Javascript-PHP communication
//function saveData(filename, filedata){
//	$.ajax({
//		type:'post',
//		cache: false,
//		url: 'save_data.php', // this is the path to the PHP script for storing the data
//		data: {filename: filename, filedata: filedata}
//	});
//};

//function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
}