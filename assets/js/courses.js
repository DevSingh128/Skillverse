// Course and Quiz Management
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;

// Course Functions
async function loadCourseContent(courseId) {
    try {
        const course = await apiCall(`${API_ENDPOINTS.courses}/${courseId}`);
        if (course) {
            renderCourseContent(course);
        } else {
            loadMockCourse(courseId);
        }
    } catch (error) {
        console.error('Error loading course:', error);
        loadMockCourse(courseId);
    }
}

function loadMockCourse(courseId) {
    const mockCourses = {
        'web-dev': {
            id: 'web-dev',
            title: 'Web Development Fundamentals',
            description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
            video: 'https://www.youtube.com/embed/UB1O30fR-EE',
            modules: [
                { 
                    id: 1, 
                    title: 'HTML Structure and Semantics', 
                    description: 'Learn the foundation of web markup',
                    completed: true,
                    duration: '45 min'
                },
                { 
                    id: 2, 
                    title: 'CSS Styling and Layout', 
                    description: 'Master visual design and positioning',
                    completed: true,
                    duration: '60 min'
                },
                { 
                    id: 3, 
                    title: 'JavaScript Fundamentals', 
                    description: 'Add interactivity to your websites',
                    completed: false,
                    current: true,
                    duration: '75 min'
                },
                { 
                    id: 4, 
                    title: 'DOM Manipulation', 
                    description: 'Dynamic content and user interaction',
                    completed: false,
                    locked: true,
                    duration: '50 min'
                }
            ],
            totalDuration: '230 min',
            enrolled: true,
            progress: 60
        },
        'data-science': {
            id: 'data-science',
            title: 'Data Science with Python',
            description: 'Introduction to data science concepts and Python programming.',
            video: 'https://www.youtube.com/embed/ua-CiDNNj30',
            modules: [
                { 
                    id: 1, 
                    title: 'Python Basics', 
                    description: 'Variables, data types, control structures',
                    completed: false,
                    current: true,
                    duration: '90 min'
                },
                { 
                    id: 2, 
                    title: 'Data Structures', 
                    description: 'Lists, dictionaries, sets',
                    completed: false,
                    locked: true,
                    duration: '75 min'
                },
                { 
                    id: 3, 
                    title: 'NumPy and Pandas', 
                    description: 'Data manipulation libraries',
                    completed: false,
                    locked: true,
                    duration: '120 min'
                },
                { 
                    id: 4, 
                    title: 'Data Visualization', 
                    description: 'Creating charts and graphs',
                    completed: false,
                    locked: true,
                    duration: '60 min'
                }
            ],
            totalDuration: '345 min',
            enrolled: false,
            progress: 0
        }
    };
    
    const course = mockCourses[courseId];
    if (course) {
        renderCourseContent(course);
    }
}

function renderCourseContent(course) {
    // Update course header
    const courseTitle = document.getElementById('courseTitle');
    const courseDescription = document.getElementById('courseDescription');
    const courseVideo = document.getElementById('courseVideo');
    
    if (courseTitle) courseTitle.textContent = course.title;
    if (courseDescription) courseDescription.textContent = course.description;
    if (courseVideo && course.video) courseVideo.src = course.video;
    
    // Render modules
    const modulesContainer = document.getElementById('courseModules');
    if (modulesContainer) {
        modulesContainer.innerHTML = course.modules.map((module, index) => `
            <div class="module-card ${module.locked ? 'locked' : ''}" onclick="${module.locked ? '' : `startModule(${module.id})`}">
                <i class="fas ${getModuleIcon(module)} module-icon"></i>
                <div>
                    <h4>Module ${module.id}: ${module.title}</h4>
                    <p>${module.description}</p>
                    <small>${module.duration}</small>
                </div>
                <div class="module-status ${getModuleStatus(module)}">
                    <i class="fas ${getModuleStatusIcon(module)}"></i>
                </div>
            </div>
        `).join('');
    }
    
    // Update enrollment status
    updateEnrollmentButton(course);
}

function getModuleIcon(module) {
    if (module.locked) return 'fa-lock';
    if (module.completed) return 'fa-check';
    if (module.current) return 'fa-play';
    return 'fa-play';
}

function getModuleStatus(module) {
    if (module.completed) return 'completed';
    if (module.current) return 'current';
    if (module.locked) return 'locked';
    return '';
}

function getModuleStatusIcon(module) {
    if (module.completed) return 'fa-check';
    if (module.current) return 'fa-play';
    if (module.locked) return 'fa-lock';
    return 'fa-circle';
}

function updateEnrollmentButton(course) {
    const enrollBtn = document.querySelector('.btn-secondary');
    if (enrollBtn) {
        if (course.enrolled) {
            enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
            enrollBtn.classList.add('enrolled');
        } else {
            enrollBtn.innerHTML = '<i class="fas fa-bookmark"></i> Enroll in Course';
            enrollBtn.classList.remove('enrolled');
        }
    }
}

function startModule(moduleId) {
    showSuccess(`Starting Module ${moduleId}`);
    // Here you would load the specific module content
}

function enrollCourse() {
    const courseId = new URLSearchParams(window.location.search).get('id') || 'web-dev';
    showSuccess(`Successfully enrolled in course!`);
    
    // Update UI to reflect enrollment
    setTimeout(() => {
        const enrollBtn = document.querySelector('.btn-secondary');
        if (enrollBtn) {
            enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
            enrollBtn.classList.add('enrolled');
        }
    }, 1000);
}

// Quiz Functions
function startQuiz(courseId = null) {
    currentQuiz = getMockQuiz(courseId || 'web-dev');
    currentQuestionIndex = 0;
    userAnswers = [];
    quizStartTime = Date.now();
    
    if (window.location.pathname.includes('quiz.html')) {
        initQuizInterface();
    } else {
        window.location.href = `quiz.html?course=${courseId || 'web-dev'}`;
    }
}

function getMockQuiz(courseId) {
    const quizzes = {
        'web-dev': {
            title: 'Web Development Fundamentals Quiz',
            questions: [
                {
                    question: "What does HTML stand for?",
                    options: [
                        "Hyper Text Markup Language",
                        "High Tech Modern Language", 
                        "Home Tool Markup Language",
                        "Hyperlink and Text Markup Language"
                    ],
                    correct: 0
                },
                {
                    question: "Which CSS property is used for changing the background color?",
                    options: [
                        "color",
                        "bgcolor", 
                        "background-color",
                        "background"
                    ],
                    correct: 2
                },
                {
                    question: "What is the correct way to create a function in JavaScript?",
                    options: [
                        "function = myFunction() {}",
                        "function myFunction() {}", 
                        "create myFunction() {}",
                        "def myFunction() {}"
                    ],
                    correct: 1
                },
                {
                    question: "Which HTML element is used to define internal CSS?",
                    options: [
                        "<css>",
                        "<script>", 
                        "<style>",
                        "<link>"
                    ],
                    correct: 2
                },
                {
                    question: "How do you select an element with id 'demo' in CSS?",
                    options: [
                        ".demo",
                        "#demo", 
                        "demo",
                        "*demo"
                    ],
                    correct: 1
                }
            ]
        }
    };
    
    return quizzes[courseId] || quizzes['web-dev'];
}

function initQuizInterface() {
    if (!currentQuiz) {
        const courseId = new URLSearchParams(window.location.search).get('course') || 'web-dev';
        currentQuiz = getMockQuiz(courseId);
    }
    
    updateQuizHeader();
    showQuestion(currentQuestionIndex);
    updateNavigationButtons();
}

function updateQuizHeader() {
    const quizTitle = document.getElementById('quizTitle');
    const questionCounter = document.getElementById('questionCounter');
    const progressBar = document.getElementById('progressBar');
    
    if (quizTitle) quizTitle.textContent = currentQuiz.title;
    if (questionCounter) {
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
    }
    if (progressBar) {
        const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function showQuestion(index) {
    // Hide all questions
    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    
    // Show current question
    const currentQuestionElement = document.getElementById(`question-${index}`);
    if (currentQuestionElement) {
        currentQuestionElement.classList.add('active');
        return;
    }
    
    // Create question dynamically if not exists
    const quizContent = document.getElementById('quizContent');
    if (!quizContent || !currentQuiz) return;
    
    const question = currentQuiz.questions[index];
    quizContent.innerHTML = `
        <div class="question active">
            <h3 class="question-title">${question.question}</h3>
            <div class="options">
                ${question.options.map((option, optIndex) => `
                    <div class="option" onclick="selectOption(${index}, ${optIndex})" data-option="${optIndex}">
                        <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Restore previous selection if exists
    if (userAnswers[index] !== undefined) {
        const selectedOption = quizContent.querySelector(`[data-option="${userAnswers[index]}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
}

function selectOption(questionIndex, optionIndex) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-option="${optionIndex}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Store answer
    userAnswers[questionIndex] = optionIndex;
    
    // Update navigation buttons
    updateNavigationButtons();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuizHeader();
        showQuestion(currentQuestionIndex);
        updateNavigationButtons();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        updateQuizHeader();
        showQuestion(currentQuestionIndex);
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn && submitBtn) {
        const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
        nextBtn.style.display = isLastQuestion ? 'none' : 'block';
        submitBtn.style.display = isLastQuestion ? 'block' : 'none';
    }
}

function submitQuiz() {
    if (userAnswers.length < currentQuiz.questions.length) {
        if (!confirm('You haven\'t answered all questions. Submit anyway?')) {
            return;
        }
    }
    
    const results = calculateQuizResults();
    showQuizResults(results);
}

function calculateQuizResults() {
    let correctAnswers = 0;
    const totalQuestions = currentQuiz.questions.length;
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    userAnswers.forEach((answer, index) => {
        if (answer === currentQuiz.questions[index].correct) {
            correctAnswers++;
        }
    });
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return {
        correctAnswers,
        totalQuestions,
        percentage,
        timeTaken,
        passed: percentage >= 70
    };
}

function showQuizResults(results) {
    const modal = document.getElementById('resultsModal');
    const finalScore = document.getElementById('finalScore');
    const correctAnswers = document.getElementById('correctAnswers');
    const totalQuestions = document.getElementById('totalQuestions');
    
    if (finalScore) finalScore.textContent = `${results.percentage}%`;
    if (correctAnswers) correctAnswers.textContent = results.correctAnswers;
    if (totalQuestions) totalQuestions.textContent = results.totalQuestions;
    
    // Update result message based on score
    const resultMessage = document.querySelector('.quiz-results h2');
    if (resultMessage) {
        if (results.passed) {
            resultMessage.textContent = 'Congratulations!';
            resultMessage.style.color = 'var(--success-color)';
        } else {
            resultMessage.textContent = 'Keep Practicing!';
            resultMessage.style.color = 'var(--warning-color)';
        }
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function getCertificate() {
    showSuccess('Certificate generated! Check your profile for the download.');
    closeModal('resultsModal');
}

function retakeQuiz() {
    if (confirm('Are you sure you want to retake the quiz? This will reset your current progress.')) {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizStartTime = Date.now();
        closeModal('resultsModal');
        initQuizInterface();
    }
}

// Video player controls
function setupVideoControls() {
    const video = document.getElementById('courseVideo');
    if (!video) return;
    
    // Track video progress
    video.addEventListener('timeupdate', function() {
        const progress = (this.currentTime / this.duration) * 100;
        saveVideoProgress(progress);
    });
    
    video.addEventListener('ended', function() {
        markModuleCompleted();
    });
}

function saveVideoProgress(progress) {
    const courseId = new URLSearchParams(window.location.search).get('id') || 'web-dev';
    const moduleId = getCurrentModuleId();
    
    // Save to localStorage for demo
    const progressKey = `course_${courseId}_module_${moduleId}_progress`;
    localStorage.setItem(progressKey, progress);
}

function getCurrentModuleId() {
    // In a real app, this would be determined by the current module being viewed
    return 1;
}

function markModuleCompleted() {
    showSuccess('Module completed! Great job!');
    // Update module status in UI
}

// Notes functionality
let courseNotes = [];

function addNote() {
    const noteText = prompt('Enter your note:');
    if (noteText && noteText.trim()) {
        const note = {
            id: Date.now(),
            text: noteText.trim(),
            timestamp: new Date().toISOString(),
            moduleId: getCurrentModuleId()
        };
        
        courseNotes.push(note);
        saveCourseNotes();
        renderNotes();
        showSuccess('Note added successfully!');
    }
}

function saveCourseNotes() {
    const courseId = new URLSearchParams(window.location.search).get('id') || 'web-dev';
    localStorage.setItem(`course_${courseId}_notes`, JSON.stringify(courseNotes));
}

function loadCourseNotes() {
    const courseId = new URLSearchParams(window.location.search).get('id') || 'web-dev';
    const savedNotes = localStorage.getItem(`course_${courseId}_notes`);
    if (savedNotes) {
        courseNotes = JSON.parse(savedNotes);
        renderNotes();
    }
}

function renderNotes() {
    const notesContainer = document.getElementById('courseNotes');
    if (!notesContainer) return;
    
    notesContainer.innerHTML = courseNotes.map(note => `
        <div class="note-item">
            <div class="note-content">${note.text}</div>
            <div class="note-meta">
                <span class="note-date">${formatTimeAgo(note.timestamp)}</span>
                <button class="note-delete" onclick="deleteNote(${note.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        courseNotes = courseNotes.filter(note => note.id !== noteId);
        saveCourseNotes();
        renderNotes();
        showSuccess('Note deleted');
    }
}

// Course completion tracking
function updateCourseProgress() {
    const courseId = new URLSearchParams(window.location.search).get('id') || 'web-dev';
    const completedModules = getCompletedModulesCount(courseId);
    const totalModules = getTotalModulesCount(courseId);
    const progress = Math.round((completedModules / totalModules) * 100);
    
    // Update progress bar if exists
    const progressBar = document.getElementById('courseProgress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    // Update progress text
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `${progress}% Complete (${completedModules}/${totalModules} modules)`;
    }
    
    return progress;
}

function getCompletedModulesCount(courseId) {
    // Mock implementation - in real app, this would come from API
    return 2;
}

function getTotalModulesCount(courseId) {
    // Mock implementation
    return 4;
}

// Course rating and feedback
function rateCourse(rating) {
    showSuccess(`Thank you for rating this course ${rating} stars!`);
    
    // Update UI to show selected rating
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
            star.style.color = '#ffd700';
        } else {
            star.classList.remove('selected');
            star.style.color = '#e2e8f0';
        }
    });
}

function submitCourseFeedback() {
    const feedback = document.getElementById('courseFeedback');
    if (feedback && feedback.value.trim()) {
        showSuccess('Thank you for your feedback!');
        feedback.value = '';
    }
}

// Keyboard shortcuts for quiz navigation
function setupQuizKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!currentQuiz) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentQuestionIndex > 0) {
                    previousQuestion();
                }
                break;
            case 'ArrowRight':
                if (currentQuestionIndex < currentQuiz.questions.length - 1) {
                    nextQuestion();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                const optionIndex = parseInt(e.key) - 1;
                if (optionIndex < currentQuiz.questions[currentQuestionIndex].options.length) {
                    selectOption(currentQuestionIndex, optionIndex);
                }
                break;
            case 'Enter':
                if (currentQuestionIndex === currentQuiz.questions.length - 1) {
                    submitQuiz();
                } else {
                    nextQuestion();
                }
                break;
        }
    });
}

// Initialize course page
function initCourse() {
    const courseId = new URLSearchParams(window.location.search).get('id') || 'web-dev';
    
    loadCourseContent(courseId);
    setupVideoControls();
    loadCourseNotes();
    updateCourseProgress();
    
    // Setup note taking
    const addNoteBtn = document.getElementById('addNote');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', addNote);
    }
    
    // Setup rating system
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => rateCourse(index + 1));
    });
    
    // Setup feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitCourseFeedback();
        });
    }
}

// Initialize quiz page
function initQuiz() {
    const courseId = new URLSearchParams(window.location.search).get('course') || 'web-dev';
    startQuiz(courseId);
    setupQuizKeyboardShortcuts();
}

// Export functions for global access
window.startModule = startModule;
window.enrollCourse = enrollCourse;
window.startQuiz = startQuiz;
window.selectOption = selectOption;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.submitQuiz = submitQuiz;
window.getCertificate = getCertificate;
window.retakeQuiz = retakeQuiz;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.rateCourse = rateCourse;