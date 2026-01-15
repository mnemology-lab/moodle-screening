// -----------------------------------------------------------
// 1. INITIALIZATION & UTILITIES
// -----------------------------------------------------------
const jsPsych = initJsPsych({ 
    display_element: 'jspsych-display',
    default_iti: 500, 
}); 

const GITHUB_PAGES_BASE = 'images/'; // Ensure your Raven images are in this folder

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// -----------------------------------------------------------
// 2. STIMULI DEFINITIONS
// -----------------------------------------------------------

// Standardized mapping: Keys 1-8
const test_stimuli = [
    { stimulus: 'Raven1.JPG',  correct: '6' },
    { stimulus: 'Raven4.JPG',  correct: '5' },
    { stimulus: 'Raven8.JPG',  correct: '2' },
    { stimulus: 'Raven11.JPG', correct: '6' },
    { stimulus: 'Raven15.JPG', correct: '3' },
    { stimulus: 'Raven18.JPG', correct: '8' },
    { stimulus: 'Raven21.JPG', correct: '8' },
    { stimulus: 'Raven23.JPG', correct: '7' },
    { stimulus: 'Raven25.JPG', correct: '8' },
    { stimulus: 'Raven30.JPG', correct: '6' },
    { stimulus: 'Raven31.JPG', correct: '5' },
    { stimulus: 'Raven35.JPG', correct: '4' }
];

const all_stimuli = test_stimuli.map(item => {
    return { ...item, stimulus: GITHUB_PAGES_BASE + item.stimulus };
});

// -----------------------------------------------------------
// 3. TRIAL TEMPLATES
// -----------------------------------------------------------

const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px; color: white;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500
};

const raven_trial = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['1', '2', '3', '4', '5', '6', '7', '8'],
    stimulus_height: 600,
    maintain_aspect_ratio: true,
    prompt: '<p>Press the number key (1-8) that completes the pattern.</p>',
    trial_duration: 100000, 
    data: { 
        task_part: 'raven_test',
        correct_key: jsPsych.timelineVariable('correct')
    },
    on_finish: function(data) {
        data.correct = (data.response === data.correct_key);
    }
};

// -----------------------------------------------------------
// 4. TIMELINE
// -----------------------------------------------------------

let timeline = [];

// Preload
timeline.push({
    type: jsPsychPreload,
    images: function() { return all_stimuli.map(s => s.stimulus); },
    message: '<p>Loading Pattern Task...</p>'
});

// Intro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2>Pattern Completion Task</h2>
        <p>You will see patterns with a missing piece.</p>
        <p>Your task is to choose the piece that correctly completes the pattern.</p>
        <p>Use keys <strong>1 through 8</strong> to answer.</p>
        <p style="margin-top: 30px;">Press <strong>Enter</strong> to begin.</p>
    `,
    choices: ['Enter']
});

// Test Loop
const test_procedure = {
    timeline: [fixation, raven_trial],
    timeline_variables: all_stimuli,
    randomize_order: false 
};
timeline.push(test_procedure);

// -----------------------------------------------------------
// 5. REDIRECT (LOOPBACK)
// -----------------------------------------------------------

const final_redirect = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div>
            <h2>Task Complete.</h2>
            <p>Saving results...</p>
        </div>
    `,
    choices: "NO_KEYS",
    trial_duration: 2000, 
    on_finish: function() {
        // 1. Calculate Score (Total Correct)
        const correct_trials = jsPsych.data.get().filter({task_part: 'raven_test', correct: true}).count();
        
        // 2. Get ID from URL
        let response_id = getParameterByName('participant');
        if (!response_id) response_id = 'NO_ID';

        // 3. Redirect to Qualtrics (SENDING part3_id)
        const base_url = 'https://duke.qualtrics.com/jfe/form/SV_3CRfinpvLk65sBU';
        
        // Logic: Input was 'participant' (contains part2_id) -> Output is 'part3_id' (Flag 2)
        const target = `${base_url}?part3_id=${response_id}&RavenScore=${correct_trials}`;
        
        window.location.replace(target);
    }
};

timeline.push(final_redirect);

jsPsych.run(timeline);
