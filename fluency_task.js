// -----------------------------------------------------------
// 1. INITIALIZATION & UTILITIES
// -----------------------------------------------------------
const jsPsych = initJsPsych({ 
    display_element: 'jspsych-display',
    default_iti: 500, 
}); 

// Task Settings
const time_limit_ms = 90000; // 90 seconds per block
const categories = ["Animals", "Plants"];

// URL Parameter Parser
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// -----------------------------------------------------------
// 2. TRIAL TEMPLATES
// -----------------------------------------------------------

const category_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        return `
            <div>
                <h2>New Category: <span style="color: yellow;">${jsPsych.timelineVariable('category')}</span></h2>
                <p>On the next screen, you will have <strong>${time_limit_ms / 1000} seconds</strong>.</p>
                <p>Write down as many words as you can that belong to this category.</p>
                <div style="text-align: left; display: inline-block; margin-top: 20px; border: 1px solid #444; padding: 20px;">
                    <p><strong>Rules:</strong></p>
                    <ul>
                        <li>Only nouns count!</li>
                        <li>No proper names (e.g., "Bob").</li>
                        <li>Do not repeat words.</li>
                        <li>Different forms of the same word (e.g., "Mouse", "Mice") do not count.</li>
                    </ul>
                </div>
                <p style="margin-top: 30px;">Press <strong>Enter</strong> to begin.</p>
            </div>
        `;
    },
    choices: ['Enter']
};

const fluency_trial = {
    type: jsPsychSurveyHtmlForm,
    preamble: function() {
        return `<h2>Category: ${jsPsych.timelineVariable('category')}</h2>`;
    },
    html: `
        <p>Type your words below (separated by spaces or new lines):</p>
        <textarea id="fluency-response" name="response" rows="10" autofocus></textarea>
    `,
    button_label: "Continue (or wait for timer)",
    trial_duration: time_limit_ms,
    data: { 
        task_part: 'fluency_input',
        category: jsPsych.timelineVariable('category')
    },
    on_load: function() {
        document.getElementById('fluency-response').focus();
    },
    on_finish: function(data) {
        // Calculate Word Count
        let resp_string = data.response.response || "";
        // Clean string: replace line breaks with spaces, remove double spaces
        let clean_string = resp_string.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
        
        let word_count = 0;
        if (clean_string.length > 0) {
            word_count = clean_string.split(" ").length;
        }
        data.word_count = word_count;
    }
};

const block_procedure = {
    timeline: [category_instruction, fluency_trial],
    timeline_variables: categories.map(c => ({ category: c })),
    randomize_order: false 
};

// -----------------------------------------------------------
// 3. INSTRUCTIONS & TIMELINE
// -----------------------------------------------------------

let timeline = [];

timeline.push({ 
    type: jsPsychHtmlKeyboardResponse, 
    stimulus: `
        <h2>Word Fluency Task</h2>
        <p>In this task, you will generate words belonging to specific categories.</p>
        <p>You will have limited time for each category.</p>
        <p style="margin-top: 30px;">Press <strong>SPACEBAR</strong> to continue.</p>`, 
    choices: [' ']
});

timeline.push(block_procedure);

// -----------------------------------------------------------
// 4. REDIRECT (LOOPBACK)
// -----------------------------------------------------------

const final_redirect = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div>
            <h2>Fluency Task Complete.</h2>
            <p>Saving data...</p>
        </div>
    `,
    choices: "NO_KEYS",
    trial_duration: 2000, 
    on_finish: function() {
        // 1. Calculate Score (Total Words)
        const trials = jsPsych.data.get().filter({task_part: 'fluency_input'});
        const total_words = trials.select('word_count').sum();
        
        // 2. Get ID from URL
        let response_id = getParameterByName('participant');
        if (!response_id) response_id = 'NO_ID';

        // 3. Redirect to Qualtrics (SENDING part2_id)
        // NOTE: Replace the URL below with your actual Qualtrics Survey URL
        const base_url = 'https://duke.qualtrics.com/jfe/form/SV_3CRfinpvLk65sBU'; 
        
        // Logic: Input was 'participant' (Start) -> Output is 'part2_id' (Flag 1)
        const target = `${base_url}?part2_id=${response_id}&FluencyScore=${total_words}`;
        
        window.location.replace(target);
    }
};

timeline.push(final_redirect);

jsPsych.run(timeline);
