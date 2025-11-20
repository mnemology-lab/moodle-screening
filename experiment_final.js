<!DOCTYPE html>
<html>
<head>
    <title>Mooney Screening Task</title>
    <link rel="stylesheet" href="jspsych/css/jspsych.css"> 
    
    <style>
        body {
            /* Basic body styling (centering, background, font) */
            background-color: black;
            color: white;
            font-family: "Open Sans", "Arial", sans-serif; 
            text-align: center;
            
            /* FIX: Increase base font size and line spacing */
            font-size: 18px; 
            line-height: 1.6; 
        }
        
        /* Ensure the main jsPsych container is centered and takes full height */
        #jspsych-display {
            margin: 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh; /* Ensures content is vertically centered */
        }

        /* FIX 1: Image Sizing for Consistency and Quality */
        /* Target images displayed by the jsPsych plugin */
        #jspsych-display img {
            max-width: 600px; /* Set a maximum width for all images */
            max-height: 600px; /* Set a maximum height to control size */
            width: auto; /* Allow width to scale proportionally */
            height: auto; /* Allow height to scale proportionally */
            object-fit: contain; /* Ensures the whole image is visible */
            margin: 20px 0; /* Add vertical margin around image */
            
            /* Since the images are already Mooney images, good quality is assumed based on file. 
               This scaling ensures they are presented consistently. */
        }

        /* FIX 2: Text Styling for Headings and Choice Containers */
        
        /* Ensure H2 elements within the jsPsych trials are white and larger */
        h2 {
            color: white;
            font-size: 28px;
            margin-bottom: 20px;
        }
        
        /* This ensures the text containers for choices are properly formatted */
        .stimulus-text-container {
            color: white;
            text-align: left;
            
            /* FIX: Increase font size and line spacing for choice options */
            font-size: 22px; 
            line-height: 1.8; 
            
            white-space: pre-wrap; 
            margin: 20px auto; /* Center choices */
            max-width: 600px; 
        }
        
        /* Targets the instruction text paragraphs for larger font */
        #jspsych-content p {
            font-size: 20px;
            line-height: 1.7;
        }

    </style>
    
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    
    <div id="jspsych-display"></div>

    <script src="jspsych/jspsych.js"></script>

    <script src="jspsych/plugin-preload.js"></script>
    <script src="jspsych/plugin-html-keyboard-response.js"></script>
    <script src="jspsych/plugin-image-keyboard-response.js"></script>

    <script src="experiment_final.js"></script>
    
</body>
</html>
