// -----------------------------------------------------------
// 1. INITIALIZATION & UTILITIES
// -----------------------------------------------------------
const jsPsych = initJsPsych({ display_element: 'jspsych-display', default_iti: 500 }); 
const GITHUB_PAGES_BASE = 'images/'; 

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    return results ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null;
}

// -----------------------------------------------------------
// 2. STIMULI & DATA DEFINTIONS
// -----------------------------------------------------------

// Raven Items
const raven_items = [
    { stimulus: 'Raven1.JPG', correct: '6' }, { stimulus: 'Raven4.JPG', correct: '5' },
    { stimulus: 'Raven8.JPG', correct: '2' }, { stimulus: 'Raven11.JPG', correct: '6' },
    { stimulus: 'Raven15.JPG', correct: '3' }, { stimulus: 'Raven18.JPG', correct: '8' },
    { stimulus: 'Raven21.JPG', correct: '8' }, { stimulus: 'Raven23.JPG', correct: '7' },
    { stimulus: 'Raven25.JPG', correct: '8' }, { stimulus: 'Raven30.JPG', correct: '6' },
    { stimulus: 'Raven31.JPG', correct: '5' }, { stimulus: 'Raven35.JPG', correct: '4' }
];

// Moodle Items (from experiment_final.js)
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

// Preload Images
const preload = {
    type: jsPsychPreload,
    images: raven_items.concat(moodle_items).map(i => GITHUB_PAGES_BASE + i.stimulus)
};

// -----------------------------------------------------------
// 3. TASK 1: VERBAL FLUENCY (90s each)
// -----------------------------------------------------------
let fluency_timeline = [];
["Animals", "Plants"].forEach(cat => {
    fluency_timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h2>Category: ${cat}</h2><p>List as many as possible in 90 seconds.<br>Press Enter to start.</p>`,
        choices: ['Enter']
    });
    fluency_timeline.push({
        type: jsPsychSurveyHtmlForm,
        html: `<textarea id="resp" name="response" rows="10" autofocus></textarea>`,
        trial_duration: 90000,
        on_finish: (data) => {
            const words = (data.response.response || "").trim().split(/\s+/).filter(w => w.length > 0);
            data.word_count = words.length;
            data.task = "fluency";
        }
    });
});

// -----------------------------------------------------------
// 4. TASK 2: RAVEN'S MATRICES
// -----------------------------------------------------------
const raven_procedure = {
    timeline: [{
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['1','2','3','4','5','6','7','8'],
        prompt: "<p>Choose the piece (1-8) that completes the pattern.</p>",
        data: { task: "raven", correct_key: jsPsych.timelineVariable('correct') },
        on_finish: (data) => { data.correct = (data.response === data.correct_key); }
    }],
    timeline_variables: raven_items.map(i => ({ ...i, stimulus: GITHUB_PAGES_BASE + i.stimulus }))
};

// -----------------------------------------------------------
// 5. TASK 3: MOODLE SCREENING
// -----------------------------------------------------------
const moodle_procedure = {
    timeline: [
        {
            type: jsPsychImageKeyboardResponse,
            stimulus: jsPsych.timelineVariable('stimulus'),
            choices: ['1','2','3','4','5'],
            prompt: () => `<pre>${jsPsych.timelineVariable('category_choices')}</pre>`,
            data: { task: 'Moodle_Cat', correct_key: jsPsych.timelineVariable('correct_category_key') },
            on_finish: (data) => { data.correct = (data.response === data.correct_key); }
        },
        {
            type: jsPsychImageKeyboardResponse,
            stimulus: jsPsych.timelineVariable('stimulus'),
            choices: ['1','2','3','4','5'],
            prompt: () => `<pre>${jsPsych.timelineVariable('object_choices')}</pre>`,
            data: { task: 'Moodle_Obj', correct_key: jsPsych.timelineVariable('correct_object_key') },
            on_finish: (data) => { data.correct = (data.response === data.correct_key); }
        }
    ],
    timeline_variables: moodle_items.map(i => ({ ...i, stimulus: GITHUB_PAGES_BASE + i.stimulus }))
};

// -----------------------------------------------------------
// 6. COMPLETION & QUALTRICS REDIRECT
// -----------------------------------------------------------
const final_redirect = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<h2>Tasks Complete. Saving...</h2>",
    trial_duration: 2000,
    on_finish: () => {
        const fluencyScore = jsPsych.data.get().filter({task: "fluency"}).select('word_count').sum();
        const ravenScore = jsPsych.data.get().filter({task: "raven", correct: true}).count();
        const moodleScore = (jsPsych.data.get().filter({task: 'Moodle_Obj', correct: true}).count() / 8).toFixed(2);
        
        const resId = getParameterByName('participant') || 'NO_ID';
        const url = `https://duke.qualtrics.com/jfe/form/SV_3CRfinpvLk65sBU?part1_id=${resId}&FluencyScore=${fluencyScore}&RavenScore=${ravenScore}&MoodleScore=${moodleScore}`;
        window.location.replace(url);
    }
};

// Assemble Timeline
jsPsych.run([preload, ...fluency_timeline, raven_procedure, moodle_procedure, final_redirect]);
