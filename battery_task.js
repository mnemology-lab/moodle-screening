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

// --- Raven Practice Items ---
const raven_practice_images = [
    'raven_bsp_nurtafel2.jpg', 
    'raven_bsp.jpg', 
    'raven_bsp2.jpg'
];

// --- Moodle Items ---
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
    images: raven_items.map(i => GITHUB_PAGES_BASE + i.stimulus)
            .concat(moodle_items.map(i => GITHUB_PAGES_BASE + i.stimulus))
            .concat(raven_practice_images.map(i => GITHUB_PAGES_BASE + i)),
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
            In this screening battery, you will complete three different tasks:<br><br>
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
            <p>Your task is to write down all the words you can think of that fall into this category.</p>
            <p><strong>Please follow these rules:</strong></p>
            <ul>
                <li>Only nouns count.</li>
                <li>NOT allowed are: proper nouns (e.g., specific brand names like "IKEA").</li>
                <li>Do not list multiple words that have the same word stem (e.g., "armchair" and "chair").</li>
                <li>Do not repeat words.</li>
            </ul>
            <p>You will see 2 total categories. You have exactly <strong>90 seconds</strong> per category to list as many words as possible.</p>
            <p>The screen will automatically advance when time is up.</p>
        </div>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to begin.</p>
    `,
    choices: ['Enter']
};

let fluency_timeline = [fluency_instructions];

// FIX #1: We use an index to show generic prompts ("Category 1") instead of names.
const fluency_categories = ["Animals", "Plants"];

fluency_categories.forEach((cat, index) => {

    // Prompt screen - HIDDEN CATEGORY
    fluency_timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <h2 style="color:white;">Category ${index + 1}</h2>
            <p style="color:white; font-size: 20px;">
                Press <strong>Enter</strong> to reveal the category name and start the 90-second timer immediately.
            </p>
        `,
        choices: ['Enter']
    });

    // Timed fluency task - REVEAL CATEGORY
    fluency_timeline.push({
        type: jsPsychSurveyHtmlForm,
        html: `
            <div style="color: white; text-align: center;">
                <h2>Category: <span style="text-decoration: underline; color: #4CAF50;">${cat}</span></h2>

                <div id="timer_display"
                     style="font-size:24px; font-weight:bold; color:#FF5733; margin-bottom:10px;">
                    Time Remaining: 90
                </div>

                <textarea id="resp" name="response" rows="15" cols="60"
                    style="font-size:18px; padding:10px; border-radius:5px;"
                    autofocus></textarea>

                <p id="timeout_msg"
                   style="display:none; color:#FFD700; font-size:18px;">
                    Time is up. Please wait…
                </p>
            </div>

            <style>
                #jspsych-survey-html-form-next { display: none; }
            </style>
        `,
        trial_duration: 90000, // 90 seconds
        on_load: function() {
            let time_left = 90; // Set to 90 for actual experiment
            const textarea = document.getElementById('resp');
            const display = document.getElementById('timer_display');
            const msg = document.getElementById('timeout_msg');

            // Timer logic
            const interval = setInterval(() => {
                time_left--;
                display.textContent = `Time Remaining: ${time_left}`;

                if (time_left <= 0) {
                    clearInterval(interval);
                    textarea.disabled = true;
                    msg.style.display = 'block';

                    jsPsych.finishTrial({
                        response: { response: textarea.value }
                    });
                }
            }, 1000);
        },
        on_finish: function(data) {
            const text = (data.response.response || "").trim();
            // Basic word count for immediate scoring
            const words = text
                .split(/[\n,]+/)
                .map(w => w.trim())
                .filter(w => w.length > 0);

            data.word_count = words.length;
            data.task = "fluency";
            data.category = cat;
            // Store raw text for export
            data.raw_text = text.replace(/[\n\r]+/g, " "); // Flatten newlines
        }
    });
});


// -----------------------------------------------------------
// 5. TASK 2: RAVEN'S MATRICES
// -----------------------------------------------------------

const raven_intro_1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Part 2: Completing Patterns</h2>
        <div style="color:white; text-align:left; max-width:800px; margin:auto; font-size:18px;">
            <p>In this part of the experiment, you will see 12 panels, each containing an incomplete pattern.</p>
            <p>Choose the answer option that correctly completes the pattern.</p>
        </div>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to continue.</p>
    `,
    choices: ['Enter']
};

const raven_practice_1_view = {
    type: jsPsychImageKeyboardResponse,
    stimulus: GITHUB_PAGES_BASE + 'raven_bsp_nurtafel2.jpg',
    choices: ['Enter'],
    stimulus_height: 500,
    prompt: `<p style="color:white;">Press <strong>Enter</strong> to see the options.</p>`
};

const raven_practice_1_respond = {
    type: jsPsychImageKeyboardResponse,
    stimulus: GITHUB_PAGES_BASE + 'raven_bsp.jpg',
    choices: ['1','2','3','4','5','6','7','8'],
    stimulus_height: 500,
    prompt: `<p style="color:white;">Press <strong>1–8</strong> to select your answer.</p>`,
    data: { task: "raven_practice" }
};

const raven_practice_feedback_1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Practice Feedback</h2>
        <p style="color:white;">In this example, the correct solution was number <strong>8</strong>.</p>
        <p style="color:white;">Press <strong>Enter</strong> to try one more.</p>
    `,
    choices: ['Enter']
};

const raven_practice_2_respond = {
    type: jsPsychImageKeyboardResponse,
    stimulus: GITHUB_PAGES_BASE + 'raven_bsp2.jpg',
    choices: ['1','2','3','4','5','6','7','8'],
    stimulus_height: 500,
    prompt: `<p style="color:white;">Press <strong>1–8</strong>.</p>`,
    data: { task: "raven_practice" }
};

const raven_practice_feedback_2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Ready to start?</h2>
        <p style="color:white;">The correct solution was number <strong>4</strong>.</p>
        <p style="color:white;">You have <strong>100 seconds</strong> per puzzle.</p>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to begin the Raven task.</p>
    `,
    choices: ['Enter']
};

const raven_procedure = {
    timeline: [{
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['1','2','3','4','5','6','7','8'],
        stimulus_height: 600,
        trial_duration: 100000, 
        prompt: "<p style='color:white;'>Choose the piece (1-8) that completes the pattern.</p>",
        data: { task: "raven", correct_key: jsPsych.timelineVariable('correct') },
        on_finish: (data) => { 
            data.correct = (data.response === data.correct_key); 
        }
    }],
    timeline_variables: raven_items.map(i => ({ ...i, stimulus: GITHUB_PAGES_BASE + i.stimulus }))
};

// -----------------------------------------------------------
// 6. TASK 3: MOODLE SCREENING
// -----------------------------------------------------------

const moodle_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2 style="color:white;">Part 3: Object Recognition</h2>
        <div style="color:white; text-align:left; max-width:800px; margin:auto; font-size:18px;">
            <p>You will see black-and-white pictures. Each picture hides a familiar object.</p>
            <p><strong>Step 1:</strong> Press <strong>Enter</strong> the moment you identify the object (Max 18s).</p>
            <p><strong>Step 2:</strong> Choose the Category (1-5).</p>
            <p><strong>Step 3:</strong> Choose the Object Name (1-5).</p>
        </div>
        <p style="color:white; margin-top:30px;">Press <strong>Enter</strong> to start.</p>
    `,
    choices: ['Enter']
};

const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:80px; color: white;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500
};

// 1. Show Image
const mooney_image_template = {
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['Enter'],
    render_on_canvas: false,
    stimulus_height: 600, 
    trial_duration: 18000, 
    prompt: '<p style="color: white;">Press <strong>Enter</strong> if you identify the object.</p>',
    data: { 
        task_part: 'Image_Recognition',
        correct_category_key: jsPsych.timelineVariable('correct_category_key'),
        correct_object_key: jsPsych.timelineVariable('correct_object_key')
    },
    on_finish: function(data) {
        data.object_identified = (data.response !== null);
    }
};

// 2. Category Choice
const category_choice_template = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return `
            <div style="text-align: left; color: white; max-width: 800px; margin: auto;">
                <h2>Category Choice</h2>
                <pre style="font-size: 20px; background: #333; padding: 15px;">${jsPsych.timelineVariable('category_choices')}</pre>
                <p>Press 1-5.</p>
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
        const prev_data = jsPsych.data.get().last(1).values[0];
        return prev_data.object_identified;
    }
};

// 3. Object Choice
const object_choice_template = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return `
            <div style="text-align: left; color: white; max-width: 800px; margin: auto;">
                <h2>Object Choice</h2>
                <pre style="font-size: 20px; background: #333; padding: 15px;">${jsPsych.timelineVariable('object_choices')}</pre>
                <p>Press 1-5.</p>
            </div>
        `;
    },
    choices: ['1', '2', '3', '4', '5'],
    trial_duration: 10000,
    data: { 
        task: 'Moodle_Obj', 
        correct_B: jsPsych.timelineVariable('correct_object_key') 
    },
    on_finish: function(data) {
        data.correct = (data.response === data.correct_B);
    },
    conditional_function: function() {
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
// 7. COMPLETION & QUALTRICS REDIRECT (Updated for Scoring & Raw Data)
// -----------------------------------------------------------

const final_redirect = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<h2 style='color:white;'>Tasks Complete. Saving data...</h2><p style='color:white;'>Please wait while you are redirected to Qualtrics.</p>",
    choices: "NO_KEYS",
    trial_duration: 3000,
    on_finish: () => {
        // --- 1. Get ID ---
        let resId = getParameterByName('participant');
        if (!resId || resId === 'null') { resId = 'NO_ID'; }

        // --- 2. Calculate SCORING & RAW DATA ---
        
        // A) FLUENCY
        const fluencyTrials = jsPsych.data.get().filter({task: "fluency"}).values();
        const fluencyScore = fluencyTrials.reduce((sum, trial) => sum + (trial.word_count || 0), 0);
        // Combine all raw text into one string (Example: "Cat1: dog, cat | Cat2: tree, bush")
        const fluencyRaw = fluencyTrials.map(t => `${t.category}: ${t.raw_text}`).join(' | ');

        // B) RAVEN
        const ravenTrials = jsPsych.data.get().filter({task: "raven"}).values();
        const ravenScore = ravenTrials.filter(t => t.correct).length;
        // Create a string of results (e.g., "10111" where 1=correct, 0=incorrect)
        // We use map to extract correctness (1 or 0) and join them.
        const ravenRaw = ravenTrials.map(t => t.correct ? '1' : '0').join('');

        // C) MOODLE (Strict Scoring: Cat + Obj must be correct)
        // We need to pair the Category trial with the Object trial.
        // We filter for the identification trials to define the loop.
        const moodleAttempts = jsPsych.data.get().filter({task_part: 'Image_Recognition'});
        let moodleStrictCorrect = 0;
        let moodleRawData = []; // To store 1 or 0 for each image

        // Iterate through every image shown
        moodleAttempts.values().forEach(imgTrial => {
            // Find the subsequent Category and Object trials for this specific image
            // We use the timestamp or trial_index to ensure we look *after* the image trial
            
            // Check if identified
            if (!imgTrial.object_identified) {
                moodleRawData.push('0'); // Skipped, so incorrect
                return;
            }

            // Get the next 2 trials (Cat and Obj)
            // Note: In timeline, they strictly follow Image.
            // Safe method: Look for trials that happened immediately after this trial index
            const nextTrials = jsPsych.data.get().filterCustom(t => t.trial_index > imgTrial.trial_index && t.trial_index <= imgTrial.trial_index + 2).values();
            
            const catTrial = nextTrials.find(t => t.task_part === 'Moodle_Cat');
            const objTrial = nextTrials.find(t => t.task === 'Moodle_Obj');

            // Strict scoring check
            if (catTrial && catTrial.correct && objTrial && objTrial.correct) {
                moodleStrictCorrect++;
                moodleRawData.push('1');
            } else {
                moodleRawData.push('0');
            }
        });

        const moodleScore = (moodleStrictCorrect / 8).toFixed(2); // Fraction of 8
        const moodleRaw = moodleRawData.join('');

        // --- 3. Build URL ---
        // Warning: URLs have a length limit (approx 2000 chars). Fluency text can be long.
        // We truncate fluencyRaw if it's dangerously long to prevent the redirect from breaking.
        let safeFluencyRaw = fluencyRaw;
        if (safeFluencyRaw.length > 1000) {
            safeFluencyRaw = safeFluencyRaw.substring(0, 1000) + "...(TRUNCATED)";
        }

        const baseUrl = "https://duke.qualtrics.com/jfe/form/SV_3gFtKzZ3XQOGBTw";
        
        // We use encodeURIComponent to ensure special characters (spaces, commas) don't break the URL
        const redirectUrl = `${baseUrl}?part1_ID=${resId}` +
                            `&FluencyScore=${fluencyScore}` +
                            `&RavenScore=${ravenScore}` +
                            `&MoodleScore=${moodleScore}` +
                            `&RavenRaw=${ravenRaw}` +
                            `&MoodleRaw=${moodleRaw}` +
                            `&FluencyRaw=${encodeURIComponent(safeFluencyRaw)}`;
        
        console.log("Redirecting to:", redirectUrl);
        window.location.replace(redirectUrl);
    }
};

// -----------------------------------------------------------
// 8. RUN EXPERIMENT
// -----------------------------------------------------------

const timeline = [
    preload,
    general_intro,
    ...fluency_timeline,
    raven_intro_1,
    raven_practice_1_view,
    raven_practice_1_respond,
    raven_practice_feedback_1,
    raven_practice_2_respond,
    raven_practice_feedback_2,
    raven_procedure,
    moodle_instructions,
    moodle_procedure,
    final_redirect
];

jsPsych.run(timeline);
