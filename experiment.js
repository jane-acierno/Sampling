// DEFINE GLOBAL VARIABLES
let timeline = [];

// jsPsych Initialization
const jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  show_progress_bar: false,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }
});

const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
const studyId = jsPsych.data.getURLVariable('STUDY_ID');
const sessionId = jsPsych.data.getURLVariable('SESSION_ID');

const filename = `${participantId + "_" + studyId + "_" + sessionId}.csv`;

// Randomize assignment of condition: epistemic / moral
let participantCondition = jsPsych.randomization.sampleWithoutReplacement(['epistemic', 'moral'], 1)[0];

// Random assignment of statements: pick 2 of 5 statements
const trials = jsPsych.randomization.shuffle([0, 1, 2, 3, 4]).slice(0, 2);

jsPsych.data.addProperties({
  participantId: participantId,
  studyId: studyId,
  sessionId: sessionId,
  participantCondition: participantCondition
});

// Options
const valueOpinionOptions = ['Yes', 'Somewhat', 'No'];

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

timeline.push(enterFullscreen)

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
      required: true
    }
  ],
  preamble: '<h2 style="text-align: center"><strong>Consent Form</strong></h2>',

  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (jsPsych.data.get().last(1).values()[0].response.consent == "Consent not given") {
      jsPsych.endExperiment(
        `<p class="jspsych-center">
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
        <h2><strong>Instructions (1/6)</strong></h2>
        <p style="text-align: left;">
          Welcome to this experiment! On the following pages, you will see a 
          series of statements describing actions taken by prominent people, 
          such as celebrities and historical figures.
          <strong>All of the people in these statements are real people.</strong>
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

    `<h2><strong>Instructions (2/6)</strong></h2>
        <p style="text-align: left;">
          In a previous study, we found out what percentage of people in the U.S. believe the statements 
          you will see are true or false. For that study, we made sure to recruit a nationally representative 
          sample so that the views of those participants should accurately represent the views of people 
          in the <strong>U.S. more broadly</strong>.
        </p>`,

    `<h2><strong>Instructions (3/6)</strong></h2>
        <p style="text-align: left;">
          These statements are all structured the same way. They will make a claim about something a real 
          person from history did do, and then some of the outcomes of that supposed action. Your job is 
          to tell us whether you think other people think the statement about that person is or is not true.
        </p>`,

    `<h2><strong>Instructions (4/6)</strong></h2>
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

    `<h2><strong>Instructions (5/6)</strong></h2>
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

    `<h2><strong>Instructions (6/6)</strong></h2>
        <p style="text-align: left;">
          To help you share your opinion about the statements, you will have the opportunity 
          to see what people in that previous study thought about the statements. You will see 
          avatars representing people who participated in that study.
        </p>
        <p style="text-align: left;">
          Every time you click on an avatar, you will see whether that 
          <strong>one person thought that particular statement was true or false.</strong> 
          You can view the opinions of as many people as you'd like before making your estimate.
        </p>`
  ],
  show_clickable_nav: true,
};

// MORAL INSTRUCTIONS //
const instructionsMoral = {
  type: jsPsychInstructions,
  pages: [
    `<h2><strong>Instructions (1/6)</strong></h2>
    <p style="text-align: left;">
      Welcome to this experiment! On the following pages, you will see a series of 
      statements describing actions taken by prominent people, such as celebrities 
      and historical figures. All of the people in these statements are real people.
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

    `<h2><strong>Instructions (2/6)</strong></h2>
    <p style="text-align: left;">
      We found out what percentage of people in the U.S. believe that each action you will see is 
      considered morally good in a previous study. For that study, we made sure to recruit a 
      nationally representative sample so that the views of those participants should accurately 
      represent the views of people in the <strong>U.S. more broadly</strong>.
    </p>`,

    `<h2><strong>Instructions (3/6)</strong></h2>
    <p style="text-align: left;">
      These statements are all structured the same way. They will make a claim about something 
      a real person from history did (or did not) do, and then some of the outcomes of that 
      supposed action. Your job is to tell us whether you think other people think the actions 
      depicted in the statements you see are morally good or not. You should not evaluate how 
      likely the statement about the person is true or false, just your opinion about what 
      you think other people think about the morality of the actions depicted.
    </p>`,

    `<h2><strong>Instructions (4/6)</strong></h2>
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

    `<h2><strong>Instructions (5/6)</strong></h2>
    <div class="quote">
      <h3>Example Claim</h3>
      <blockquote>
        “Robert Oppenheimer developed the atomic bomb, which ended World War II 
        but also enabled the devastation of Hiroshima and Nagasaki.”
      </blockquote>
    </div><br>
    <label for="practice-slider-moral-estimate-percent">
      As practice, please estimate what percentage of people in the U.S. believe, 
      based on these outcomes, that this action is morally good or morally bad:<br><br>
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
          this.classList.remove('incomplete');
          this.classList.add('clicked');
          $('#practice-slider-moral-estimate-percent-label').addClass('fade-out');

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
        <strong>Definitely morally bad</strong>
      </span>
      <span class="jspsych-slider-right-anchor">
        <strong>Definitely morally good</strong>
      </span>
    </div>`,

    `<h2><strong>Instructions (6/6)</strong></h2>
    <p style="text-align: left;">
      To help you share your opinion about the statements, you will have the opportunity 
      to see what people in that previous study thought about the statements. You will see 
      avatars representing people who participated in that study.
    </p>
    
    <p style="text-align: left;">
      Every time you click on an avatar, you will see whether that 
      <strong>one person thought that particular statement was morally good or bad.</strong> 
      You can view the opinions of as many people as you'd like before making your estimate.
    </p>`
  ],
  show_clickable_nav: true
};

const instructionsEpistemicComprehensionCheck = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'epistemic_comp_check_1',
      prompt: '<strong><i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;For each statement, your task is to:</strong>',
      options: [
        "Estimate the percentage of people in the U.S. who believe the statement is true",
        "Estimate the percentage of people in the U.S. who believe the actions that the historical figures took were morally good",
        "Estimate the percentage of people in the U.S. who agree with me about the statement",
        "Estimate the percentage of people in the U.S. who have heard this statement before"
      ],
      correct: 'Estimate the percentage of people in the U.S. who believe the statement is true',
      hint: `That's not quite right. Remember, you are trying to estimate what percentage of people in the U.S. believe the statement is <strong>true</strong></em>.`,
      required: true,
    },
    {
      name: 'epistemic_comp_check_2',
      prompt: `
            <strong>
              <i class="fa-solid fa-circle-question"></i>&nbsp;&nbsp;
              You can view the opinions of as many people as you'd like before making your estimate.
            </strong>`,
      options: ["True", "False"],
      correct: 'True',
      hint: `That's not quite right. Remember, you will have the chance to view the opinions of <strong>as many people as you'd like</strong> before making your estimate.`,
      required: true,
    },
  ],
  preamble:
    `<h2 style="text-align: center;">Instructions Review</h2> 
    <p style="text-align: left;"> 
      The experiment will begin on the next page.
      
      As a reminder, you will see a series of statements and be asked to estimate 
      how many people think the outcome of the action in the statement is true (vs. false).<br><br>

      We will first ask you a few questions about the statement you will see and what you think 
      before you get to see any information about what others think. Then, you will see a page 
      of many different avatars that each represent real participants' opinions 
      about the outcomes of the action in the statement you read.<br><br>

      <strong>
        You are free to review as many opinions as you would like before providing us 
        your final estimate of the percentage of people in the U.S. who consider 
        the outcome of the action to be true (vs. false).
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
      hint: `That's not quite right. Remember, you are trying to estimate what percentage of people in the U.S. believe the actions that the historical figures took were <strong>morally good</strong>.`,
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
      hint: `That's not quite right. Remember, you will have the chance to view the opinions of <strong>as many people as you'd like</strong> before making your estimate.`,
      required: true,
    },
  ],
  preamble: `
    <h2 style="text-align: center;">Instructions</h2> 
    <p style="text-align: left;"> 
      The experiment will begin on the next page.
      
      As a reminder, you will see a series of statements and be asked to estimate 
      how many people think the outcome of the action in the statement is morally good (vs. morally bad).<br><br>

      We will first ask you a few questions about the statement you will see and what you think 
      before you get to see any information about what others think. Then, you will see a page 
      of many different avatars that each represent real participants' opinions about 
      the outcomes of the action in the statement you read.<br><br>

      <strong>
        You are free to review as many opinions as you would like before providing us 
        your final estimate of the percentage of people in the U.S. who consider 
        the outcome of the action to be morally good (vs. morally bad).
      </strong>

      To make sure you fully understand the instructions for this study, please answer the questions below: 
    </p>`,
};

// 12: Roentgen
// 26: Akon
// 27: Gandhi
// 29: Lovelace
// 30: Turing

const statements = [
  `"Wilhelm Roentgen invented X-rays, which revolutionized medical imaging but increased radiation exposure."`,
  `"Akon created the 'Akon Lighting Africa' initiative, which initiated renewable energy projects in Africa but supported authoritarian regimes."`,
  `"Mahatma Gandhi led nonviolent resistance against British colonial rule, which led to the partition of the country but brought about political change."`,
  `"Ada Lovelace pioneered computer programming, which led to the displacement of manual laborers but laid the foundation for modern computing."`,
  `"Alan Turing broke the Enigma code during World War II, which led to the development of mass surveillance technologies but helped end the war."`,
];


// Epistemic Pre-Predictions: Self //
function prePredictionsEpistemicSelf(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble:
      `<div class="quote">
        <h3>Statement #` + (trialIndex + 1) + `</h3>
        <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
      </div>
      <p class="jspsych-survey-multi-choice-preamble">
        Before you see what other people think about the statement, we want to know what you think:
      </p><br><br>`,
    html: `
      <!-- Pre-Sampling Epistemic Claim Rating -->
      
      <input type="hidden" name="pre-slider-epistemic-claim-clicked" value="false">
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
            this.classList.add('clicked');
            document.getElementsByName('pre-slider-epistemic-claim-clicked')[0].value = 'true';
          "
        >
        <span class="jspsych-slider-left-anchor">Definitely false</span>
        <span class="jspsych-slider-right-anchor">Definitely true</span>
      </div><br><br><br>


      <!-- Pre-Sampling Epistemic Plausible Rating -->

      <input type="hidden" name="pre-slider-epistemic-plausible-clicked" value="false">
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
            this.classList.add('clicked');
            document.getElementsByName('pre-slider-epistemic-plausible-clicked')[0].value = 'true';
          "
        >
        <span class="jspsych-slider-left-anchor">Definitely implausible</span>
        <span class="jspsych-slider-right-anchor">Definitely plausible</span>
      </div><br><br><br>


      <!-- Pre-Sampling Epistemic Curiosity -->

      <input type="hidden" name="pre-slider-epistemic-curious-clicked" value="false">
      <label for="pre-slider-epistemic-curious" class="jspsych-survey-multi-choice-question">
        How curious are you to learn about what other people think about this statement?<br>
        <em style="font-size: 10pt;">
          Remember that when answering the following question about how curious you are, 
          keep in mind that you should only say you are extremely curious for the 
          statements you are <u>absolutely</u> most curious to learn about.
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
            this.classList.add('clicked');
            document.getElementsByName('pre-slider-epistemic-curious-clicked')[0].value = 'true';
          "
        >
        <span class="jspsych-slider-left-anchor">Not at all curious</span>
        <span class="jspsych-slider-right-anchor">Extremely curious</span>
      </div><br><br><br>`,
    button_label: "Next",
    request_response: true,
    on_finish: function (data) {
      let preSamplingEpistemicSelfData = data.response;

      let pre_slider_epistemic_claim_check = preSamplingEpistemicSelfData['pre-slider-epistemic-claim-clicked'] === 'true' ? preSamplingEpistemicSelfData['pre-slider-epistemic-claim'] : null;
      let pre_slider_epistemic_plausible_check = preSamplingEpistemicSelfData['pre-slider-epistemic-plausible-clicked'] === 'true' ? preSamplingEpistemicSelfData['pre-slider-epistemic-plausible'] : null;
      let pre_slider_epistemic_curious_check = preSamplingEpistemicSelfData['pre-slider-epistemic-curious-clicked'] === 'true' ? preSamplingEpistemicSelfData['pre-slider-epistemic-curious'] : null;

      preSamplingEpistemicSelfData = {
        pre_slider_epistemic_claim: pre_slider_epistemic_claim_check,
        pre_slider_epistemic_plausible: pre_slider_epistemic_plausible_check,
        pre_slider_epistemic_curious: pre_slider_epistemic_curious_check
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(preSamplingEpistemicSelfData);
    }
  };
};

// Epistemic Pre-Predictions: Other //
function prePredictionsEpistemicOther(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Before you see what other people think about the statement, we want to know what you think:
          </p><br><br>`,
    html: `
          <!-- Pre-Sampling Epistemic Estimate Rating -->

          <input type="hidden" name="pre-slider-epistemic-estimate-percent-clicked" value="false">
          <label for="pre-slider-epistemic-estimate-percent" class="jspsych-survey-multi-choice-question">
            What percentage of people in the U.S. do you think believe this claim is true vs. think this is false?
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
                document.getElementsByName('pre-slider-epistemic-estimate-percent-clicked')[0].value = 'true';
                
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

          <input type="hidden" name="pre-slider-epistemic-confidence-clicked" value="false">
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
                this.classList.add('clicked');
                document.getElementsByName('pre-slider-epistemic-confidence-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Not at all confident</span>
            <span class="jspsych-slider-right-anchor">Completely confident</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let preSamplingEpistemicOtherData = data.response;

      let pre_slider_epistemic_estimate_percent_check = preSamplingEpistemicOtherData['pre-slider-epistemic-estimate-percent-clicked'] === 'true' ? preSamplingEpistemicOtherData['pre-slider-epistemic-estimate-percent'] : null;
      let pre_slider_epistemic_confidence_check = preSamplingEpistemicOtherData['pre-slider-epistemic-confidence-clicked'] === 'true' ? preSamplingEpistemicOtherData['pre-slider-epistemic-confidence'] : null;

      preSamplingEpistemicOtherData = {
        pre_slider_epistemic_estimate_percent: pre_slider_epistemic_estimate_percent_check,
        pre_slider_epistemic_confidence: pre_slider_epistemic_confidence_check,
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(preSamplingEpistemicOtherData);
    }
  };
};

// Moral Pre-Predictions: Self //
function prePredictionsMoralSelf(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Before you see what other people think about 
            the statement, we want to know what you think:
          </p><br><br>`,
    html: `
          <!-- Pre-Sampling Moral Action Rating -->
          
          <input type="hidden" name="pre-slider-moral-action-clicked" value="false">
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
                this.classList.add('clicked');
                document.getElementsByName('pre-slider-moral-action-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
            <span class="jspsych-slider-right-anchor">Definitely morally good</span>
          </div><br><br><br>


          <!-- Pre-Sampling Moral Person Rating -->

          <input type="hidden" name="pre-slider-moral-person-clicked" value="false">
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
                this.classList.add('clicked');
                document.getElementsByName('pre-slider-moral-person-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
            <span class="jspsych-slider-right-anchor">Definitely morally good</span>
          </div><br><br><br>


          <!-- Pre-Sampling Moral Curiosity -->

          <input type="hidden" name="pre-slider-moral-curious-clicked" value="false">
          <label for="pre-slider-moral-curious" class="jspsych-survey-multi-choice-question">
            How curious are you to learn about what other people think about this statement?<br>
            <em style="font-size: 10pt;">
              Remember that when answering the following question about how curious you are, 
              keep in mind that you should only say you are extremely curious for the 
              statements <u>you are absolutely</u> most curious to learn about.
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
                this.classList.add('clicked');
                document.getElementsByName('pre-slider-moral-curious-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Not at all curious</span>
            <span class="jspsych-slider-right-anchor">Extremely curious</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let preSamplingMoralSelfData = data.response;

      let pre_slider_moral_action_check = preSamplingMoralSelfData['pre-slider-moral-action-clicked'] === 'true' ? preSamplingMoralSelfData['pre-slider-moral-action'] : null;
      let pre_slider_moral_person_check = preSamplingMoralSelfData['pre-slider-moral-person-clicked'] === 'true' ? preSamplingMoralSelfData['pre-slider-moral-person'] : null;
      let pre_slider_moral_curious_check = preSamplingMoralSelfData['pre-slider-moral-curious-clicked'] === 'true' ? preSamplingMoralSelfData['pre-slider-moral-curious'] : null;

      preSamplingMoralSelfData = {
        pre_slider_moral_action: pre_slider_moral_action_check,
        pre_slider_moral_person: pre_slider_moral_person_check,
        pre_slider_moral_curious: pre_slider_moral_curious_check
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(preSamplingMoralSelfData);
    }
  };
};

// Moral Pre-Predictions: Other //
function prePredictionsMoralOther(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Before you see what other people think about the statement, we want to know what you think:
          </p><br><br>`,
    html: `
          <!-- Pre-Sampling Moral Estimate Rating -->

          <input type="hidden" name="pre-slider-moral-estimate-percent-clicked" value="false">
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
                document.getElementsByName('post-slider-moral-estimate-percent-clicked')[0].value = 'true';

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

          <input type="hidden" name="pre-slider-moral-confidence-clicked" value="false">
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
                this.classList.add('clicked');
                document.getElementsByName('pre-slider-moral-confidence-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Not at all confident</span>
            <span class="jspsych-slider-right-anchor">Completely confident</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let preSamplingMoralOtherData = data.response;

      let pre_slider_moral_estimate_percent_check = preSamplingMoralOtherData['pre-slider-moral-estimate-percent-clicked'] === 'true' ? preSamplingMoralOtherData['pre-slider-moral-estimate-percent'] : null;
      let pre_slider_moral_confidence_check = preSamplingMoralOtherData['pre-slider-moral-confidence-clicked'] === 'true' ? preSamplingMoralOtherData['pre-slider-moral-confidence'] : null;

      preSamplingMoralOtherData = {
        pre_slider_moral_estimate_percent: pre_slider_moral_estimate_percent_check,
        pre_slider_moral_confidence: pre_slider_moral_confidence_check,
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(preSamplingMoralOtherData);
    }
  };
};

function selectionTask(trialIndex, participantCondition) {
  return {
    type: jsPsychSelectionLearning,
    trialIndex: trialIndex,
    avatars: avatarDictionary,
    participantCondition: participantCondition,
    statement: statements[trials[trialIndex]],
    choices: [
      "<i class='fa-solid fa-rotate-left'></i>&nbsp;&nbsp;Continue sampling",
      "<i class='fa-solid fa-circle-check' style='color: green'></i>&nbsp;&nbsp;I'm all done"
    ]
  };
};

const avatarNames = Array.from({ length: 100 }, (_, i) => "avatar" + i);
const avatarPhotos = Array.from({ length: 100 }, (_, i) => `./avatars/avatar${i + 1}.webp`);

let avatarDictionary = {};

for (let i = 0; i < 100; i++) {
  let avatarData = { avatar: avatarPhotos[i] };
  avatarDictionary[avatarNames[i + 1]] = avatarData;

  let avatarName = 'image' + i;
  let avatar = avatarDictionary[avatarNames[i + 1]].image;

  selectionTask = Object.assign(selectionTask, { [avatarName]: avatar });
};

// Epistemic Post-Predictions: Self //
function postPredictionsEpistemicSelf(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Now that you've had the chance to see what other people 
            think about the statement, we want to know what you think again.
            Please answer the following questions:
          </p><br><br>`,
    html: `
          <!-- Post-Sampling Epistemic Estimate Rating -->

          <input type="hidden" name="post-slider-epistemic-claim-clicked" value="false">
          <label for="post-slider-epistemic-claim" class="jspsych-survey-multi-choice-question">
            To what extent do you think this claim is true or false?
          </label>
          <div style="position: relative;">
            <input 
              name="post-slider-epistemic-claim" 
              type="range" 
              class="jspsych-slider incomplete" 
              value="50" min="0" max="100" step="1" 
              id="post-slider-epistemic-claim"
              oninput="
                this.classList.remove('incomplete');
                this.classList.add('clicked');
                document.getElementsByName('post-slider-epistemic-claim-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Definitely false</span>
            <span class="jspsych-slider-right-anchor">Definitely true</span>
          </div><br><br><br>
          

          <!-- Post-Sampling Epistemic Plausible Rating -->

          <input type="hidden" name="post-slider-epistemic-plausible-clicked" value="false">
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
              oninput="
                this.classList.remove('incomplete');
                this.classList.add('clicked');
                document.getElementsByName('post-slider-epistemic-plausible-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Definitely implausible</span>
            <span class="jspsych-slider-right-anchor">Definitely plausible</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let postSamplingEpistemicSelfData = data.response;

      let post_slider_epistemic_claim_check = postSamplingEpistemicSelfData['post-slider-epistemic-claim-clicked'] === 'true' ? postSamplingEpistemicSelfData['post-slider-epistemic-claim'] : null;
      let post_slider_epistemic_plausible_check = postSamplingEpistemicSelfData['post-slider-epistemic-plausible-clicked'] === 'true' ? postSamplingEpistemicSelfData['post-slider-epistemic-plausible'] : null;

      postSamplingEpistemicSelfData = {
        post_slider_epistemic_claim: post_slider_epistemic_claim_check,
        post_slider_epistemic_plausible: post_slider_epistemic_plausible_check
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(postSamplingEpistemicSelfData);
    }
  };
};

// Epistemic Post-Predictions: Other //
function postPredictionsEpistemicOther(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Now that you've had the chance to see what other people 
            think about the statement, we want to know what you think again.
            Please answer the following questions:
          </p><br><br>`,
    html: `
          <!-- Post-Sampling Epistemic Estimate -->

          <input type="hidden" name="post-slider-epistemic-estimate-percent-clicked" value="false">
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
                this.classList.add('clicked');
                document.getElementsByName('post-slider-epistemic-estimate-percent-clicked')[0].value = 'true';
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

          <input type="hidden" name="post-slider-epistemic-confidence-clicked" value="false">
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
              oninput="
                this.classList.remove('incomplete');
                this.classList.add('clicked');
                document.getElementsByName('post-slider-epistemic-confidence-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Not at all confident</span>
            <span class="jspsych-slider-right-anchor">Completely confident</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let postSamplingEpistemicOtherData = data.response;

      let post_slider_epistemic_estimate_percent_check = postSamplingEpistemicOtherData['post-slider-epistemic-estimate-percent-clicked'] === 'true' ? postSamplingEpistemicOtherData['post-slider-epistemic-estimate-percent'] : null;
      let post_slider_epistemic_confidence_check = postSamplingEpistemicOtherData['post-slider-epistemic-confidence-clicked'] === 'true' ? postSamplingEpistemicOtherData['post-slider-epistemic-confidence'] : null;

      postSamplingEpistemicOtherData = {
        post_slider_epistemic_estimate_percent: post_slider_epistemic_estimate_percent_check,
        post_slider_epistemic_confidence: post_slider_epistemic_confidence_check
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(postSamplingEpistemicOtherData);
    }
  };
};

// Moral Post-Predictions Self //
function postPredictionsMoralSelf(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Now that you've had the chance to see what other people 
            think about the statement, we want to know what you think again.
            Please answer the following questions:
          </p><br><br>`,
    html: `
          <!-- Post-Sampling Moral Action Rating -->

          <input type="hidden" name="post-slider-moral-action-clicked" value="false">
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
              oninput="
                this.classList.remove('incomplete');
                this.classList.add('clicked');
                document.getElementsByName('post-slider-moral-action-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
            <span class="jspsych-slider-right-anchor">Definitely morally good</span>
          </div><br><br><br>
          

          <!-- Post-Sampling Moral Person Rating -->

          <input type="hidden" name="post-slider-moral-person-clicked" value="false">
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
              oninput="
                this.classList.remove('incomplete');
                this.classList.add('clicked');
                document.getElementsByName('post-slider-moral-person-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Definitely morally bad</span>
            <span class="jspsych-slider-right-anchor">Definitely morally good</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let postSamplingMoralSelfData = data.response;

      let post_slider_moral_action_check = postSamplingMoralSelfData['post-slider-moral-action-clicked'] === 'true' ? postSamplingMoralSelfData['post-slider-moral-action'] : null;
      let post_slider_moral_person_check = postSamplingMoralSelfData['post-slider-moral-person-clicked'] === 'true' ? postSamplingMoralSelfData['post-slider-moral-person'] : null;

      postSamplingMoralSelfData = {
        post_slider_moral_action: post_slider_moral_action_check,
        post_slider_moral_person: post_slider_moral_person_check
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(postSamplingMoralSelfData);
    }
  };
};

// Moral Post-Predictions Other //
function postPredictionsMoralOther(trialIndex) {
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
          <div class="quote">
            <h3>Statement #` + (trialIndex + 1) + `</h3>
            <blockquote>` + statements[trials[trialIndex]] + `</blockquote>
          </div>
          <p class="jspsych-survey-multi-choice-preamble">
            Now that you've had the chance to see what other people 
            think about the statement, we want to know what you think again.
            Please answer the following questions:
          </p><br><br>`,
    html: `
          <!-- Post-Sampling Moral Estimate Rating -->

          <input type="hidden" name="post-slider-moral-estimate-percent-clicked" value="false">
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
                this.classList.add('clicked');
                document.getElementsByName('post-slider-moral-estimate-percent-clicked')[0].value = 'true';
              
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
          
          <input type="hidden" name="post-slider-moral-confidence-clicked" value="false">
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
              oninput="
                this.classList.remove('incomplete');
                this.classList.add('clicked');
                document.getElementsByName('post-slider-moral-confidence-clicked')[0].value = 'true';
              "
            >
            <span class="jspsych-slider-left-anchor">Not at all confident</span>
            <span class="jspsych-slider-right-anchor">Completely confident</span>
          </div><br><br><br>`,
    button_label: 'Next',
    request_response: true,
    on_finish: function (data) {
      let postSamplingMoralOtherData = data.response;

      let post_slider_moral_estimate_percent_check = postSamplingMoralOtherData['post-slider-moral-estimate-percent-clicked'] === 'true' ? postSamplingMoralOtherData['post-slider-moral-estimate-percent'] : null;
      let post_slider_moral_confidence_check = postSamplingMoralOtherData['post-slider-moral-confidence-clicked'] === 'true' ? postSamplingMoralOtherData['post-slider-moral-confidence'] : null;


      postSamplingMoralOtherData = {
        post_slider_moral_estimate_percent: post_slider_moral_estimate_percent_check,
        post_slider_moral_confidence: post_slider_moral_confidence_check
      };

      jsPsych.data
        .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
        .addToAll(postSamplingMoralOtherData);
    }
  };
};

function newTrialPage(trialIndex) {
  return {
    type: jsPsychInstructions,
    pages: [`
          <h2><strong>Trial ` + (trialIndex + 1) + `/` + trials.length + ` Completed!</strong></h2>
          <p style="text-align: left;">
            Great Job! You will now advance to the second trial. 
            Please click the button below to continue.
          </p>`
    ],
    show_clickable_nav: true
  };
};

if (participantCondition === 'epistemic') {
  timeline.push(
    instructionsEpistemic,
    instructionsEpistemicComprehensionCheck
  );
  for (let trialIndex = 0; trialIndex < trials.length; trialIndex++) {
    timeline.push(
      prePredictionsEpistemicSelf(trialIndex),
      prePredictionsEpistemicOther(trialIndex),
      selectionTask(trialIndex, participantCondition),
      postPredictionsEpistemicSelf(trialIndex),
      postPredictionsEpistemicOther(trialIndex),
    );
    if (trialIndex != trials.length - 1) {
      timeline.push(
        newTrialPage(trialIndex)
      );
    };
  };
} else if (participantCondition === 'moral') {
  timeline.push(
    instructionsMoral,
    instructionsMoralComprehensionCheck
  );
  for (let trialIndex = 0; trialIndex < trials.length; trialIndex++) {
    timeline.push(
      prePredictionsMoralSelf(trialIndex),
      prePredictionsMoralOther(trialIndex),
      selectionTask(trialIndex, participantCondition),
      postPredictionsMoralSelf(trialIndex),
      postPredictionsMoralOther(trialIndex),
    );
    if (trialIndex != trials.length - 1) {
      timeline.push(
        newTrialPage(trialIndex)
      );
    };
  };
};


// DEMOGRAPHICS //

// Need for Cognitive Control //
const nfcQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'nfc-1-simple-complex',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          I would prefer complex to simple problems.
        </p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc-2-responsibility',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          I like to have the responsibility of handling a situation that requires a lot of thinking.
        </p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc-3-not-fun',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          Thinking is not my idea of fun.
        </p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc-4-little-thought',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          I would rather do something that requires little thought than 
          something that is sure to challenge my thinking abilities.
        </p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc-5-new-solutions',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          I really enjoy a task that involves coming up with new solutions to problems.
        </p>`,
      options: nfcResponses,
    },
    {
      name: 'nfc-6-intellectual',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          I would prefer a task that is intellectual, difficult, and important to one 
          that is somewhat important but does not require much thought.
        </p>`,
      options: nfcResponses,
    }
  ],
  randomize_question_order: true,
  request_response: true,
  preamble:
    `<p class="jspsych-survey-multi-choice-preamble">
      Please indicate how much you agree with each of the following statements,
      or how true it is about you using the scale provided:
    </p>`,
  scale_width: 500,
  on_finish: function (data) {
    let nfcData = data.response;

    nfcData = {
      nfc_1_simple_complex: nfcData['nfc-1-simple-complex'],
      nfc_2_responsibility: nfcData['nfc-2-responsibility'],
      nfc_3_not_fun: nfcData['nfc-3-not-fun'],
      nfc_4_little_thought: nfcData['nfc-4-little-thought'],
      nfc_5_new_solutions: nfcData['nfc-5-new-solutions'],
      nfc_6_intellectual: nfcData['nfc-6-intellectual']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(nfcData);
  }
};

timeline.push(nfcQuestions);

const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble:
    `<p class="jspsych-survey-multi-choice-preamble">
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
              this.classList.remove('incomplete');
              this.classList.add('clicked');
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
              name="race-ethnicity-indigenous" 
              value="Indigenous American or Alaskan Native" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-asian" 
              value="Asian or Asian-American" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-black" 
              value="African or African-American" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-native" 
              value="Native Hawaiian or Pacific Islander" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-white" 
              value="White" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-hispanic" 
              value="Hispanic/Latino/a/e/x" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-other" 
              value="Other" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="race-ethnicity-prefer-not" 
              value="Prefer not to disclose" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
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
              name="gender-man" 
              value="Man" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
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
              name="gender-woman" 
              value="Woman" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
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
              name="gender-non-binary" 
              value="Non-binary" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
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
              name="gender-other" 
              value="Other" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
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
              name="gender-prefer-not" 
              value="Prefer not to disclose" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-prefer-not">Prefer not to disclose</label>
          </div>
        </div>
        
        <style id="jspsych-survey-multi-choice-css">
          .jspsych-survey-multi-choice-question { 
            margin-top: 2em; 
            margin-bottom: 2em; 
            text-align: left; 
          } .jspsych-survey-multi-choice-option { 
            font-size: 10pt; 
            line-height: 2; 
          } .jspsych-survey-multi-choice-horizontal 
            .jspsych-survey-multi-choice-option { 
            display: inline-block; 
            margin-left: 1em; 
            margin-right: 1em; 
            vertical-align: top; 
            text-align: center; 
          } label.jspsych-survey-multi-choice-text input[type='radio'] {
            margin-right: 1em;
          }
        </style>
      `,
  button_label: 'Next',
  request_response: true,
  on_finish: function (data) {
    let demographicsData = data.response;

    // Age
    const age = Number(demographicsData['age']);

    // Gender
    let gender = '';
    if (demographicsData['gender-man']) {
      gender = 'Man';
    } else if (demographicsData['gender-woman']) {
      gender = 'Woman';
    } else if (demographicsData['gender-non-binary']) {
      gender = 'Non-Binary';
    } else if (demographicsData['gender-other']) {
      gender = 'Other';
    }

    // Create a new object with the formatted data
    demographicsData = {
      age: age,
      race_ethnicity_indigenous: demographicsData['race-ethnicity-indigenous'],
      race_ethnicity_asian: demographicsData['race-ethnicity-asian'],
      race_ethnicity_black: demographicsData['race-ethnicity-black'],
      race_ethnicity_native: demographicsData['race-ethnicity-native'],
      race_ethnicity_white: demographicsData['race-ethnicity-white'],
      race_ethnicity_hispanic: demographicsData['race-ethnicity-hispanic'],
      race_ethnicity_other: demographicsData['race-ethnicity-other'],
      race_ethnicity_na: demographicsData['race-ethnicity-prefer-not'],
      gender: gender
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(demographicsData);
  }
};

timeline.push(demographicsQuestions);


const politicsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'political-ideology-economic',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>economic</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-social',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>social</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-overall',
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
  request_response: true,
  on_finish: function (data) {
    let politicalData = data.response;

    politicalData = {
      political_ideology_economic: politicalData['political-ideology-economic'],
      political_ideology_social: politicalData['political-ideology-social'],
      political_ideology_overall: politicalData['political-ideology-overall']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(politicalData);
  }
};

timeline.push(politicsQuestions);

const bigFiveQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: "extraversion-1",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>extroverted, enthusiastic.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "agreeableness-2-r",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>critical, quarrelsome.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "conscientiousness-3",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>dependable, self-disciplined.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "emotional-stability-4-r",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>anxious, easily upset.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "openness-5",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>open to new experiences, complex.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "extraversion-6-r",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>reserved, quiet.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "agreeableness-7",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>sympathetic, warm.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "conscientiousness-8-r",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>disorganized, careless.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "emotional-stability-9",
      prompt: `
        <p class="jspsych-survey-multi-choice-question">
          I see myself as <strong>calm, emotionally stable.</strong>
        </p>`,
      options: bigFiveResponses,
      horizontal: true
    },
    {
      name: "openness-10-r",
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
    </p>`,
  on_finish: function (data) {
    let bigFiveData = data.response;

    bigFiveData = {
      extraversion_1: bigFiveData['extraversion-1'],
      agreeableness_2_r: bigFiveData['agreeableness-2-r'],
      conscientiousness_3: bigFiveData['conscientiousness-3'],
      emotional_stability_4_r: bigFiveData['emotional_stability-4-r'],
      openness_5: bigFiveData['openness-5'],
      extraversion_6_r: bigFiveData['extraversion-6-r'],
      agreeableness_7: bigFiveData['agreeableness-7'],
      conscientiousness_8_r: bigFiveData['conscientiousness-8-r'],
      emotional_stability_9: bigFiveData['emotional_stability-9'],
      openness_10_r: bigFiveData['openness-10-r']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(bigFiveData);
  }
};

timeline.push(bigFiveQuestions);


const demandEffectsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
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
      </p>`,
  on_finish: function (data) {
    let demandEffectsData = data.response;

    demandEffectsData = {
      pressure: demandEffectsData['pressure'],
      judgment: demandEffectsData['judgment']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(demandEffectsData);
  }
};

timeline.push(demandEffectsQuestions);


// Guess Study Purpose / Questions + Comments
var feedback = {
  type: jsPsychSurveyText,
  questions: [
    {
      name: 'guess-study-purpose',
      prompt:
        `<p class="jspsych-survey-multi-choice-question" style='text-align: "center !important;"'>
          What do you think this study was about?
        </p>`,
      rows: 10
    },
    {
      name: 'feedback',
      prompt:
        `<p class="jspsych-survey-multi-choice-question" style='text-align: "center !important;"'>
          Do you have any additional comments? We appreciate any and all feedback!
        </p>`,
      rows: 10
    }
  ],
  on_finish: function (data) {
    function countdown(start, end) {
      var timer = setInterval(function() {
        if (start <= end) {
          clearInterval(timer);
        } else {
          start--;
          document.getElementById("countdown").innerHTML = start;
        }
      }, 1000);
    }
    
    countdown(5, 0);

    let purposeFeedbackData = data.response;

    purposeFeedbackData = {
      guess_study_purpose: purposeFeedbackData['guess-study-purpose'],
      feedback: purposeFeedbackData['feedback']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(purposeFeedbackData);

    jsPsych.endExperiment(
      `<p class="jspsych-center">
        Thanks for participating! You will be redirected in <span id="countdown">5</span> seconds.
      </p>`
    );
    setTimeout(function () {
      window.location.href = "https://app.prolific.com/submissions/complete?cc=C39SMEHT";
    }, 5000)
  }
}

timeline.push(feedback);

// Exit fullscreen
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
};

timeline.push(exitFullscreen);

// DataPipe conclude data collection
const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "oA2BJCIcu8jQ",
  filename: filename,
  data_string: () => jsPsych.data.get().csv()
};

timeline.push(save_data);

// Preload all images
const imageSet = avatarPhotos;

jsPsych.pluginAPI.preloadImages(imageSet, function () {
  startExperiment();
});

// Function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
};