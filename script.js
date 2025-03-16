// Hebrew learning data - organized by levels
const hebrewData = {
    // Level 1: Basic letters
    1: [
        { hebrew: 'א', english: 'Alef', pronunciation: 'Silent letter' },
        { hebrew: 'ב', english: 'Bet', pronunciation: 'B as in "boy"' },
        { hebrew: 'ג', english: 'Gimel', pronunciation: 'G as in "girl"' },
        { hebrew: 'ד', english: 'Dalet', pronunciation: 'D as in "door"' },
        { hebrew: 'ה', english: 'Hey', pronunciation: 'H as in "hello"' },
        { hebrew: 'ו', english: 'Vav', pronunciation: 'V as in "very"' },
        { hebrew: 'ז', english: 'Zayin', pronunciation: 'Z as in "zebra"' },
        { hebrew: 'ח', english: 'Chet', pronunciation: 'Ch as in "Bach"' }
    ],
    
    // Level 2: More letters
    2: [
        { hebrew: 'ט', english: 'Tet', pronunciation: 'T as in "time"' },
        { hebrew: 'י', english: 'Yod', pronunciation: 'Y as in "yes"' },
        { hebrew: 'כ', english: 'Kaf', pronunciation: 'K as in "kite"' },
        { hebrew: 'ל', english: 'Lamed', pronunciation: 'L as in "lion"' },
        { hebrew: 'מ', english: 'Mem', pronunciation: 'M as in "mom"' },
        { hebrew: 'נ', english: 'Nun', pronunciation: 'N as in "no"' },
        { hebrew: 'ס', english: 'Samech', pronunciation: 'S as in "sun"' },
        { hebrew: 'ע', english: 'Ayin', pronunciation: 'Silent guttural sound' }
    ],
    
    // Level 3: Final letters and more
    3: [
        { hebrew: 'פ', english: 'Peh', pronunciation: 'P as in "pen"' },
        { hebrew: 'צ', english: 'Tsadi', pronunciation: 'Ts as in "cats"' },
        { hebrew: 'ק', english: 'Qof', pronunciation: 'K as in "king"' },
        { hebrew: 'ר', english: 'Resh', pronunciation: 'R as in "red"' },
        { hebrew: 'ש', english: 'Shin', pronunciation: 'Sh as in "shoe"' },
        { hebrew: 'ת', english: 'Tav', pronunciation: 'T as in "table"' },
        { hebrew: 'ך', english: 'Final Kaf', pronunciation: 'Same as Kaf, used at end of word' },
        { hebrew: 'ם', english: 'Final Mem', pronunciation: 'Same as Mem, used at end of word' }
    ],
    
    // Level 4: Basic words
    4: [
        { hebrew: 'שלום', english: 'Hello/Peace', pronunciation: 'sha-LOM' },
        { hebrew: 'תודה', english: 'Thank you', pronunciation: 'to-DA' },
        { hebrew: 'כן', english: 'Yes', pronunciation: 'ken' },
        { hebrew: 'לא', english: 'No', pronunciation: 'lo' },
        { hebrew: 'אבא', english: 'Dad', pronunciation: 'A-ba' },
        { hebrew: 'אמא', english: 'Mom', pronunciation: 'E-ma' },
        { hebrew: 'מים', english: 'Water', pronunciation: 'MA-yim' },
        { hebrew: 'לחם', english: 'Bread', pronunciation: 'LE-chem' }
    ],
    
    // Level 5: More words and phrases
    5: [
        { hebrew: 'בוקר טוב', english: 'Good morning', pronunciation: 'BO-ker tov' },
        { hebrew: 'לילה טוב', english: 'Good night', pronunciation: 'LAI-la tov' },
        { hebrew: 'מה שלומך', english: 'How are you', pronunciation: 'ma shlo-MECH' },
        { hebrew: 'אני', english: 'I/Me', pronunciation: 'a-NI' },
        { hebrew: 'אתה', english: 'You (male)', pronunciation: 'a-TA' },
        { hebrew: 'את', english: 'You (female)', pronunciation: 'at' },
        { hebrew: 'בית ספר', english: 'School', pronunciation: 'beit SE-fer' },
        { hebrew: 'חבר', english: 'Friend', pronunciation: 'cha-VER' }
    ]
};

// Game state
let currentLevel = 1;
let score = 0;
let currentQuestion = null;
let options = [];
let canAnswer = true;

// DOM elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const hebrewDisplay = document.getElementById('hebrew-display');
const optionsContainer = document.getElementById('options-container');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const levelSelectorContainer = document.getElementById('level-selector-container');
const levelSelectorButton = document.getElementById('level-selector-btn');

// Initialize the game
function initGame() {
    updateScoreDisplay();
    nextQuestion();
    createLevelSelector();
    
    // Event listeners
    nextButton.addEventListener('click', nextQuestion);
    levelSelectorButton.addEventListener('click', toggleLevelSelector);
}

// Update score and level display
function updateScoreDisplay() {
    scoreElement.textContent = score;
    levelElement.textContent = currentLevel;
}

// Generate a new question with requestAnimationFrame for smoother updates
function nextQuestion() {
    canAnswer = true;
    feedbackElement.classList.add('hidden');
    
    // Check if level should increase
    if (score >= currentLevel * 8 && currentLevel < Object.keys(hebrewData).length) {
        currentLevel++;
        updateScoreDisplay();
    }
    
    const currentLevelData = hebrewData[currentLevel];
    
    // Select random item for question
    currentQuestion = currentLevelData[Math.floor(Math.random() * currentLevelData.length)];
    
    // Generate options (1 correct, 3 incorrect)
    generateOptions(currentLevelData);
    
    // Use requestAnimationFrame to ensure both updates happen in the same paint cycle
    requestAnimationFrame(() => {
        // Display the Hebrew
        hebrewDisplay.textContent = currentQuestion.hebrew;
        
        // Display options
        displayOptions();
    });
}

// Generate answer options
function generateOptions(data) {
    options = [currentQuestion]; // Add correct answer
    
    // Create a copy of the data without the current question
    const remainingOptions = data.filter(item => item.hebrew !== currentQuestion.hebrew);
    
    // Shuffle and take first 3
    const shuffled = remainingOptions.sort(() => 0.5 - Math.random());
    options = options.concat(shuffled.slice(0, 3));
    
    // Shuffle the options
    options = options.sort(() => 0.5 - Math.random());
}

// Display options on screen - optimized for speed
function displayOptions() {
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.english;
        optionElement.addEventListener('click', () => checkAnswer(option));
        fragment.appendChild(optionElement);
    });
    
    // Clear and update the container in one operation
    optionsContainer.innerHTML = '';
    optionsContainer.appendChild(fragment);
}

// Check if the selected answer is correct
function checkAnswer(selectedOption) {
    if (!canAnswer) return;
    
    canAnswer = false;
    const optionElements = document.querySelectorAll('.option');
    
    // Find the selected option element
    const selectedElement = Array.from(optionElements).find(
        el => el.textContent === selectedOption.english
    );
    
    if (selectedOption.hebrew === currentQuestion.hebrew) {
        // Correct answer
        selectedElement.classList.add('correct');
        showFeedback(true);
        score += currentLevel;
        updateScoreDisplay();
    } else {
        // Incorrect answer
        selectedElement.classList.add('incorrect');
        
        // Highlight the correct answer
        const correctElement = Array.from(optionElements).find(
            el => el.textContent === currentQuestion.english
        );
        correctElement.classList.add('correct');
        
        showFeedback(false);
    }
    
    // Automatically move to next question after delay
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// Show feedback message
function showFeedback(isCorrect) {
    feedbackElement.textContent = isCorrect 
        ? `Correct! ${currentQuestion.hebrew} is ${currentQuestion.english} (${currentQuestion.pronunciation})`
        : `Oops! ${currentQuestion.hebrew} means ${currentQuestion.english} (${currentQuestion.pronunciation})`;
    
    feedbackElement.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
    feedbackElement.classList.remove('hidden');
}

// Create level selector
function createLevelSelector() {
    const levelCount = Object.keys(hebrewData).length;
    
    for (let i = 1; i <= levelCount; i++) {
        const levelButton = document.createElement('button');
        levelButton.className = 'level-btn';
        levelButton.textContent = `Level ${i}`;
        levelButton.dataset.level = i;
        
        levelButton.addEventListener('click', function() {
            changeLevel(parseInt(this.dataset.level));
            toggleLevelSelector(); // Hide the selector after selection
        });
        
        levelSelectorContainer.appendChild(levelButton);
    }
    
    // Initially hide the level selector
    levelSelectorContainer.classList.add('hidden');
}

// Toggle level selector visibility
function toggleLevelSelector() {
    levelSelectorContainer.classList.toggle('hidden');
    
    // Highlight current level
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(btn => {
        if (parseInt(btn.dataset.level) === currentLevel) {
            btn.classList.add('current-level');
        } else {
            btn.classList.remove('current-level');
        }
    });
}

// Change to a specific level
function changeLevel(level) {
    if (level >= 1 && level <= Object.keys(hebrewData).length) {
        currentLevel = level;
        updateScoreDisplay();
        nextQuestion();
    }
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame); 