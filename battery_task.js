// -----------------------------------------------------------
// 1. INITIALIZATION & UTILITIES
// -----------------------------------------------------------
const jsPsych = initJsPsych({
    display_element: 'jspsych-display',
    default_iti: 500,
    on_finish: function() {
        // Fallback safety: if redirect fails, show data
        // jsPsych.data.displayData();
    }
});

// Ensure this matches your GitHub folder structure exactly
const GITHUB_PAGES_BASE = 'images/';

// Utility to get URL parameters (e.g., from Qualtrics)
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// -----------------------------------------------------------
// 2. STIMULI & ITEMS
// -----------------------------------------------------------

// --- Raven Items ---
const raven_items = [
    { stimulus: 'raven1.jpg', correct: '6' }, { stimulus: 'raven4.jpg', correct: '5' },
    { stimulus: 'raven8.jpg', correct: '2' }, { stimulus: 'raven11.jpg', correct: '6' },
    { stimulus: 'raven15.jpg', correct: '3' }, { stimulus: 'raven18.jpg', correct: '8' },
    { stimulus: 'raven21.jpg', correct: '8' }, { stimulus: 'raven23.jpg', correct: '7' },
    { stimulus: 'raven25.jpg', correct: '8' }, { stimulus: 'raven30.jpg', correct: '6' },
    { stimulus: 'raven31.jpg', correct: '5' }, { stimulus: 'raven35.jpg', correct: '4' }
];

// --- Moodle Items (Copied from experiment_final.js) ---
const moodle_items = [
    { stimulus: 'A_cougar_sigma_3.jpg', correct_category_key: '1', correct_object_key: '3', category_choices: '1) mammal\n2) insect\n3) reptile\n4) household item\n5) bird', object_choices: '1) bunny\n2) rat\n3) cougar\n4) mountain\n5) crocodile' },
    { stimulus: 'A_bee_sigma_7.jpg', correct_category_key: '1', correct_object_key: '3', category_choices: '1) insect\n2) mammal\n3) reptile\n4) household item\n5) bird', object_choices: '1) spider\n2) cactus\n3) bee\n4) clown\n5) octopus' },
    { stimulus: '0_dolphin.new_gauss3.jpg', correct_category_key: '2', correct_object_key: '4', category_choices: '1) insect\n2) mammal\n3) reptile\n4) household item\n5) bird', object_choices: '1) duck\n2) ant\n3) crocodile\n4) dolphin\n5) horse' },
    { stimulus: '0_ant_gauss2.jpg', correct_category_key: '2', correct_object_key: '4', category_choices: '1) bird\n2) insect\n3) reptile\n4) household item\n5) mammal', object_choices: '1) bat\n2) butterfly\n3) dog\n4) ant\n5) chicken' },
    { stimulus: '0_pigeon_filt1_gauss2.jpg', correct_category_key: '4', correct_object_key: '5', category_choices: '1) mammal\n2) insect\n3) reptile\n4) bird\n5) household item', object_choices: '1) oyster\n2) leaf\n3) nursery\n4) turtle\n5) pigeon' },
    { stimulus: '0_sloth_gauss4.jpg', correct_category_key: '4', correct_object_key: '5', category_choices: '1) household item\n2) insect\n3) reptile\n4) mammal\n5) bird', object_choices: '1) squirrel\n2) crab\n3) monkey\n4) panda\n5) sloth' },
    { stimulus: '0_snake2_new_gauss2.jpg', correct_category_key: '5', correct_object_key: '2', category_choices: '1) mammal\n2) insect\n3) bird\n4) household item\n5) reptile', object_choices: '1) sailing boat\n2) snake\n3) tooth brush\n4) duck\n5) beetle' },
    { stimulus: '0_wateringcan_gauss4.jpg', correct_category_key: '5', correct_object_key: '2', category_choices: '1) mammal\n2) insect\n3) reptile\n4) bird\n5) household item', object_choices: '1) desktop\n2) watering can\n3) cabin\n4) knife\n5) lantern' }
];

// --- Preload ---
const preload = {
    type: jsPsychPreload,
    images: raven_items.concat(moodle_items).map(i => GITHUB_PAGES_BASE + i.stimulus),
    message: '<p style="color: white; font-size: 24px;">Loading tasks...</p>'
};

// -----------------------------------------------------------
// 3. INSTRUCTIONS (General)
// -----------------------------------------------------------
const general_intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h1 style="color:white;">Welcome</h1>
        <p style="color:white; text-align:left; max-width:800px; margin:auto;">
            In this task battery you will complete three different blocks:<br><br>
            a) <strong>Word fluency task</strong> (5 min)<br>
            b) <strong>Pattern completion task</strong> (10 min)<br>
            c) <strong>Object recognition task</strong> (6 min)<br><br>
            We will start with the <strong>Word fluency task</strong>.
        </p>
        <p style="color:white; margin-top:50px;">Press <strong>Enter</strong> to continue.</p>
    `,
    choices: ['Enter']
};

// -----------------------------------------------------------
// 4. TASK 1: VERBAL FLUENCY (90s fixed)
// -----------------------------------------------------------

const fluency_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Part 1: Generating Words</h2>
        <div style="color:white; text-align:left; max-width:800px; margin:auto; font-size: 18px;">
            <p>In this task, you will be shown individual categories (e.g., “Furniture”).</p>
            <p>Your task is to write down all the names you can think of that fall into this category.</p>
            <p><strong>Please follow these rules:</strong></p>
            <ul>
                <li>Only nouns count as words!</li>
                <li>NOT allowed are: proper names (e.g., specific brand names like "Ikea").</li>
                <li>Do not use words with the same word stem (e.g., "waterbed" if you already wrote "bed").</li>
                <li>Do not repeat words.</li>
            </ul>
            <p>You will receive 2 categories. You have exactly <strong>90 seconds</strong> per category.</p>
            <p>The screen will automatically advance when time is up.</p>
        </div>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to begin.</p>
    `,
    choices: ['Enter']
};

let fluency_timeline = [fluency_instructions];

["Animals", "Plants"].forEach(cat => {
    // 1. Prompt
    fluency_timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h2 style="color:white;">Category: ${cat}</h2><p style="color:white;">Press Enter to start the 90-second timer.</p>`,
        choices: ['Enter']
    });

    // 2. Task with Timer
    fluency_timeline.push({
        type: jsPsychSurveyHtmlForm,
        html: `
            <div style="color: white; text-align: center;">
                <h2>Category: <span style="text-decoration: underline;">${cat}</span></h2>
                <div id="timer_display" style="font-size: 24px; font-weight: bold; color: #FF5733; margin-bottom: 10px;">Time Remaining: 90</div>
                <textarea id="resp" name="response" rows="15" cols="60" style="font-size:18px; padding:10px; border-radius:5px;" autofocus></textarea>
                <p>Type as many words as possible. Separate words with a comma or new line.</p>
            </div>
            <style>
                /* Hide the default button to enforce strict timing */
                #jspsych-survey-html-form-next { display: none; }
            </style>
        `,
        trial_duration: 90000, // 90 Seconds exactly
        on_load: function() {
            // Visual Timer Logic
            var time_left = 90;
            var interval = setInterval(function(){
                time_left--;
                var display = document.getElementById('timer_display');
                if(display) {
                    display.innerHTML = "Time Remaining: " + time_left;
                }
                if(time_left <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        },
        on_finish: (data) => {
            // Simple word count estimate
            const text = (data.response.response || "").trim();
            // Split by newlines, commas, or spaces
            const words = text.split(/[\n,]+/).filter(w => w.trim().length > 0);
            data.word_count = words.length;
            data.task = "fluency";
        }
    });
});

// -----------------------------------------------------------
// 5. TASK 2: RAVEN'S MATRICES
// -----------------------------------------------------------

const raven_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Part 2: Completing Patterns</h2>
        <div style="color:white; text-align:left; max-width:800px; margin:auto; font-size:18px;">
            <p>In this part, you will see patterns with a missing piece.</p>
            <p>Each panel consists of images that follow a systematic rule (horizontally and vertically).</p>
            <p>Your task is to choose the piece from the 8 options below that correctly completes the pattern.</p>
            <p>Use the number keys <strong>1-8</strong> on your keyboard to select your answer.</p>
            <p>Try to be as accurate as possible.</p>
        </div>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to start the Raven task.</p>
    `,
    choices: ['Enter']
};

const raven_procedure = {
    timeline: [{
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['1','2','3','4','5','6','7','8'],
        stimulus_height: 600, // Ensure images fit
        prompt: "<p style='color:white;'>Choose the piece (1-8) that completes the pattern.</p>",
        data: { task: "raven", correct_key: jsPsych.timelineVariable('correct') },
        on_finish: (data) => { data.correct = (data.response === data.correct_key); }
    }],
    timeline_variables: raven_items.map(i => ({ ...i, stimulus: GITHUB_PAGES_BASE + i.stimulus }))
};

// -----------------------------------------------------------
// 6. TASK 3: MOODLE SCREENING (Logic from experiment_final.js)
// -----------------------------------------------------------

const moodle_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Part 3: Object Recognition</h2>
        <div style="color:white; text-align:left; max-width:800px; margin:auto; font-size:18px;">
            <p>You will see black-and-white pictures (Mooney images). Each picture hides a familiar object.</p>
            <p><strong>Step 1:</strong> Press <strong>Enter</strong> the moment you identify the object (Max 18 seconds).</p>
            <p><strong>Step 2:</strong> Choose the correct category (e.g., mammal, bird).</p>
            <p><strong>Step 3:</strong> Choose the exact object name.</p>
            <p>For Steps 2 and 3, use the number keys <strong>1-5</strong>. You have 10 seconds for each choice.</p>
        </div>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to start the final task.</p>
    `,
    choices: ['Enter']
};

const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:80px; color: white;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500
};

// 1. Show Image (Max 18s) - Press Enter if recognized
const mooney_image_template = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['Enter'],
    render_on_canvas: false,
    stimulus_height: 600, 
    trial_duration: 18000, 
    prompt: '<p style="color: white;">Press <strong>Enter</strong> the moment you identify the object.</p>',
    data: { 
        task_part: 'Image_Recognition',
        correct_category_key: jsPsych.timelineVariable('correct_category_key'),
        correct_object_key: jsPsych.timelineVariable('correct_object_key')
    },
    on_finish: function(data) {
        data.object_identified = (data.response !== null);
    }
};

// 2. Category Choice (10s) - Only if identified
const category_choice_template = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return `
            <div style="text-align: left; color: white; max-width: 800px; margin: auto;">
                <h2>Category Choice</h2>
                <p>What category is the object from?</p>
                <pre style="font-size: 20px; background: #333; padding: 15px;">${jsPsych.timelineVariable('category_choices')}</pre>
                <p>Press the corresponding number key (1-5).</p>
            </div>
        `;
    },
    choices: ['1', '2', '3', '4', '5'],
    trial_duration: 10000,
    data: { task_part: 'Moodle_Cat', correct_A: jsPsych.timelineVariable('correct_category_key') },
    on_finish: function(data) {
        data.correct = (data.response === data.correct_A);
    },
    conditional_function: function() {
        // Only run if they pressed Enter in the previous trial
        const prev_data = jsPsych.data.get().last(1).values[0];
        return prev_data.object_identified;
    }
};

// 3. Object Choice (10s) - Only if identified
const object_choice_template = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return `
            <div style="text-align: left; color: white; max-width: 800px; margin: auto;">
                <h2>Object Choice</h2>
                <p>Which object did you see?</p>
                <pre style="font-size: 20px; background: #333; padding: 15px;">${jsPsych.timelineVariable('object_choices')}</pre>
                <p>Press the corresponding number key (1-5).</p>
            </div>
        `;
    },
    choices: ['1', '2', '3', '4', '5'],
    trial_duration: 10000,
    data: { 
        task: 'Moodle_Obj', // Used for scoring
        correct_B: jsPsych.timelineVariable('correct_object_key') 
    },
    on_finish: function(data) {
        data.correct = (data.response === data.correct_B);
    },
    conditional_function: function() {
        // Look back 2 trials (Image trial) to check if identified
        // Note: We filter by task_part to find the specific image trial
        const image_trial_data = jsPsych.data.get().filter({task_part: 'Image_Recognition'}).last(1).values[0];
        return image_trial_data && image_trial_data.object_identified;
    }
};

const moodle_procedure = {
    timeline: [fixation, mooney_image_template, category_choice_template, object_choice_template],
    timeline_variables: moodle_items.map(i => ({ ...i, stimulus: GITHUB_PAGES_BASE + i.stimulus })),
    randomize_order: true
};

// -----------------------------------------------------------
// 7. COMPLETION & QUALTRICS REDIRECT
// -----------------------------------------------------------

const final_redirect = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<h2 style='color:white;'>Tasks Complete. Saving data...</h2><p style='color:white;'>Please wait while you are redirected to Qualtrics.</p>",
    choices: "NO_KEYS",
    trial_duration: 3000,
    on_finish: () => {
        // --- SCORING ---
        // Fluency: Sum of word counts
        const fluencyScore = jsPsych.data.get().filter({task: "fluency"}).select('word_count').sum();
        
        // Raven: Count correct answers
        const ravenScore = jsPsych.data.get().filter({task: "raven", correct: true}).count();
        
        // Moodle: Percentage correct (only counting the final object identification)
        // Note: Using 8 as denominator as there are 8 trials
        const moodleCorrect = jsPsych.data.get().filter({task: 'Moodle_Obj', correct: true}).count();
        const moodleScore = (moodleCorrect / 8).toFixed(2);
        
        // --- REDIRECT ---
        // 1. Get ID from URL (input parameter 'participant')
        let resId = getParameterByName('participant');
        if (!resId || resId === 'null') { resId = 'NO_ID'; }

        // 2. Build URL (Output parameter 'part1_ID' capitalized)
        const baseUrl = "https://duke.qualtrics.com/jfe/form/SV_3CRfinpvLk65sBU";
        // Ensure variable names match Qualtrics Embedded Data exactly
        const redirectUrl = `${baseUrl}?part1_ID=${resId}&FluencyScore=${fluencyScore}&RavenScore=${ravenScore}&MoodleScore=${moodleScore}`;
        
        console.log("Redirecting to:", redirectUrl);
        window.location.replace(redirectUrl);
    }
};

// -----------------------------------------------------------
// 8. RUN EXPERIMENT
// -----------------------------------------------------------

// Assemble the full timeline
const timeline = [
    preload,
    general_intro,
    ...fluency_timeline,
    raven_instructions,
    raven_procedure,
    moodle_instructions,
    moodle_procedure,
    final_redirect
];

jsPsych.run(timeline);
