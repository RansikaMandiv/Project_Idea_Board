document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const modeText = themeToggle ? themeToggle.querySelector('.mode-text') : null;
    const body = document.body;

    // Check for saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (modeText) modeText.textContent = 'Light Mode';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (modeText) modeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        });
    }

    // --- Navigation Logic ---
    const ideaLink = document.getElementById('idea-board-link');
    const gpaLink = document.getElementById('gpa-calc-link');
    const timerLink = document.getElementById('study-timer-link');
    
    const dashboardView = document.getElementById('dashboard-view');
    const ideaView = document.getElementById('idea-view');
    const gpaView = document.getElementById('gpa-view');
    const timerView = document.getElementById('timer-view');

    const views = [dashboardView, ideaView, gpaView, timerView];

    const showView = (targetView) => {
        views.forEach(view => {
            if (view) {
                view.style.display = 'none';
                view.style.animation = 'none'; // Reset animation
            }
        });
        if (targetView) {
            targetView.style.display = 'block';
            // Force reflow to restart animation
            void targetView.offsetWidth;
            targetView.style.animation = 'fadeIn 0.5s ease-out forwards';
        }
    };

    if (ideaLink) {
        ideaLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView(ideaView);
        });
    }

    if (gpaLink) {
        gpaLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView(gpaView);
        });
    }

    if (timerLink) {
        timerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView(timerView);
        });
    }

    // --- GPA Calculator Logic ---
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateGpaBtn = document.getElementById('calculate-gpa-btn');
    const resetGpaBtn = document.getElementById('reset-gpa-btn');
    const gpaResultContainer = document.getElementById('gpa-result-container');
    const finalGpaSpan = document.getElementById('final-gpa');
    const displayGpaStat = document.getElementById('display-gpa-stat');

    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'E': 0.0, 'F': 0.0
    };

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'course-row';
            row.innerHTML = `
                <input type="text" placeholder="Course Name" class="course-name">
                <input type="number" placeholder="Credits" class="course-credits" min="1" step="1">
                <input type="text" placeholder="Grade (e.g. A)" class="course-grade" maxlength="2">
                <button class="remove-course-btn">&times;</button>
            `;
            courseList.appendChild(row);
        });
    }

    if (courseList) {
        courseList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-course-btn')) {
                e.target.closest('.course-row').remove();
            }
        });

        // Ensure uppercase for grade input and integer for credits
        courseList.addEventListener('input', (e) => {
            if (e.target.classList.contains('course-grade')) {
                e.target.value = e.target.value.toUpperCase();
            }
            if (e.target.classList.contains('course-credits')) {
                e.target.value = Math.floor(e.target.value);
            }
        });

        // Proactive duplicate course name check
        courseList.addEventListener('change', (e) => {
            if (e.target.classList.contains('course-name')) {
                const currentInput = e.target;
                const value = currentInput.value.trim().toLowerCase();
                if (!value) return;

                const otherInputs = Array.from(courseList.querySelectorAll('.course-name'))
                    .filter(input => input !== currentInput);
                
                const isDuplicate = otherInputs.some(input => input.value.trim().toLowerCase() === value);

                if (isDuplicate) {
                    alert(`The course "${currentInput.value.trim()}" has already been added!`);
                    currentInput.value = '';
                    setTimeout(() => currentInput.focus(), 10);
                }
            }
        });
    }

    if (calculateGpaBtn) {
        calculateGpaBtn.addEventListener('click', () => {
            const rows = courseList.querySelectorAll('.course-row:not(.header)');
            let totalPoints = 0;
            let totalCredits = 0;
            let hasError = false;
            let hasDuplicate = false;
            const courseNames = new Set();

            rows.forEach(row => {
                const nameInput = row.querySelector('.course-name');
                const creditsInput = row.querySelector('.course-credits');
                const gradeInput = row.querySelector('.course-grade');
                
                const courseName = nameInput.value.trim().toLowerCase();
                const credits = parseInt(creditsInput.value);
                const gradeText = gradeInput.value.toUpperCase().trim();
                const grade = gradePoints[gradeText];

                if (courseName) {
                    if (courseNames.has(courseName)) {
                        hasDuplicate = true;
                        nameInput.style.border = '1px solid #ff4d4d';
                    } else {
                        courseNames.add(courseName);
                        nameInput.style.border = '';
                    }
                }

                if (isNaN(credits) || credits <= 0) {
                    // Skip empty/invalid credits but mark as potential error if grade exists
                    if (gradeText) hasError = true;
                    return;
                }

                if (grade === undefined) {
                    if (gradeText) {
                        alert(`Invalid grade: ${gradeText}. Please use A, B, C, D, F (with +/- if applicable).`);
                        hasError = true;
                    }
                    return;
                }

                totalPoints += (grade * credits);
                totalCredits += credits;
            });

            if (hasDuplicate) {
                alert('Duplicate course name found! Please ensure each course has a unique name.');
                return;
            }

            if (hasError) return;

            if (totalCredits > 0) {
                const gpa = (totalPoints / totalCredits).toFixed(2);
                finalGpaSpan.textContent = gpa;
                if (displayGpaStat) displayGpaStat.textContent = gpa;
                gpaResultContainer.style.display = 'block';
            } else {
                alert('Please enter valid credits and grades for at least one course.');
            }
        });
    }

    if (resetGpaBtn) {
        resetGpaBtn.addEventListener('click', () => {
            // Remove all rows except the header
            const rows = courseList.querySelectorAll('.course-row:not(.header)');
            rows.forEach(row => row.remove());
            
            // Add one empty row back for convenience
            const row = document.createElement('div');
            row.className = 'course-row';
            row.innerHTML = `
                <input type="text" placeholder="Course Name" class="course-name">
                <input type="number" placeholder="Credits" class="course-credits" min="1" step="1">
                <input type="text" placeholder="Grade (e.g. A)" class="course-grade" maxlength="2">
                <button class="remove-course-btn">&times;</button>
            `;
            courseList.appendChild(row);

            // Hide results
            gpaResultContainer.style.display = 'none';
            finalGpaSpan.textContent = '0.00';
            if (displayGpaStat) displayGpaStat.textContent = '0.00';
        });
    }

    // --- Study Timer Logic ---
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const alarmSound = document.getElementById('alarm-sound');
    const manualMinutes = document.getElementById('manual-minutes');
    const minutesVal = document.getElementById('minutes-val');

    if (timerDisplay) {
        let initialMinutes = 25;
        let timeLeft = initialMinutes * 60;
        let timerInterval = null;

        const updateDisplay = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        if (manualMinutes) {
            manualMinutes.addEventListener('input', (e) => {
                if (timerInterval) return;
                initialMinutes = parseInt(e.target.value);
                minutesVal.textContent = initialMinutes;
                timeLeft = initialMinutes * 60;
                updateDisplay();
            });
        }

        const startTimer = () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = 'Start';
                manualMinutes.disabled = false;
                return;
            }

            startBtn.textContent = 'Pause';
            manualMinutes.disabled = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    startBtn.textContent = 'Start';
                    manualMinutes.disabled = false;
                    
                    if (alarmSound) alarmSound.play().catch(e => console.log('Audio playback failed:', e));
                    
                    timeLeft = initialMinutes * 60;
                    updateDisplay();

                    setTimeout(() => {
                        alert('Time is up! Take a break.');
                        if (alarmSound) {
                            alarmSound.pause();
                            alarmSound.currentTime = 0;
                        }
                    }, 500);
                }
            }, 1000);
        };

        const resetTimer = () => {
            clearInterval(timerInterval);
            timerInterval = null;
            timeLeft = initialMinutes * 60;
            updateDisplay();
            startBtn.textContent = 'Start';
            manualMinutes.disabled = false;
            if (alarmSound) {
                alarmSound.pause();
                alarmSound.currentTime = 0;
            }
        };

        if (startBtn) startBtn.addEventListener('click', startTimer);
        if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    }

    // --- Idea Board Logic (index.html) ---
    const addBtn = document.getElementById('addBtn');
    const ideaInput = document.getElementById('ideaInput');
    const userSelect = document.getElementById('userSelect');
    const ideaList = document.getElementById('ideaList');
    const countValue = document.getElementById('countValue');

    if (addBtn && ideaList) {
        const updateCounter = () => {
            const count = ideaList.querySelectorAll('.idea-card').length;
            countValue.textContent = count;
        };

        const saveIdeas = () => {
            const ideas = Array.from(ideaList.querySelectorAll('.idea-card')).map(card => ({
                text: card.querySelector('.idea-text').textContent,
                user: card.querySelector('.idea-meta span').textContent
            }));
            localStorage.setItem('ideaBoardData', JSON.stringify(ideas));
        };

        const loadIdeas = () => {
            const savedData = localStorage.getItem('ideaBoardData');
            if (savedData) {
                const ideas = JSON.parse(savedData);
                ideaList.innerHTML = ''; // Clear default hardcoded ideas
                ideas.reverse().forEach(idea => {
                    const li = document.createElement('li');
                    li.className = 'idea-card';
                    li.innerHTML = `
                        <div class="idea-text">${idea.text}</div>
                        <div class="idea-meta">suggested by <span>${idea.user}</span></div>
                        <button class="delete-btn" title="Remove Idea">&times;</button>
                    `;
                    ideaList.prepend(li);
                });
                updateCounter();
            }
        };

        const createIdea = () => {
            const ideaText = ideaInput.value.trim();
            const userName = userSelect.value;

            if (!userName) {
                alert('Please select a name first!');
                return;
            }
            if (!ideaText) {
                alert('Please enter an idea!');
                return;
            }

            // Check for duplicate ideas
            const existingIdeas = Array.from(ideaList.querySelectorAll('.idea-text'))
                .map(el => el.textContent.trim().toLowerCase());
            
            if (existingIdeas.includes(ideaText.toLowerCase())) {
                alert('This idea has already been added to the board!');
                return;
            }

            const li = document.createElement('li');
            li.className = 'idea-card';
            li.innerHTML = `
                <div class="idea-text">${ideaText}</div>
                <div class="idea-meta">suggested by <span>${userName}</span></div>
                <button class="delete-btn" title="Remove Idea">&times;</button>
            `;

            ideaList.prepend(li);
            updateCounter();
            saveIdeas();
            ideaInput.value = '';
            userSelect.selectedIndex = 0;
        };

        loadIdeas();

        addBtn.addEventListener('click', createIdea);

        ideaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') createIdea();
        });

        ideaList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const card = e.target.closest('.idea-card');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.remove();
                    updateCounter();
                    saveIdeas();
                }, 200);
            }
        });
    }
});
