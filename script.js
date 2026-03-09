document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const ideaInput = document.getElementById('ideaInput');
    const userSelect = document.getElementById('userSelect');
    const ideaList = document.getElementById('ideaList');

    // Function to add a new idea
    const createIdea = () => {
        const ideaText = ideaInput.value.trim();
        const userName = userSelect.value;

        // Validation
        if (!userName) {
            alert('Please select a name first!');
            return;
        }
        if (!ideaText) {
            alert('Please enter an idea!');
            return;
        }

        // Create elements
        const li = document.createElement('li');
        li.className = 'idea-card';
        
        li.innerHTML = `
            <div class="idea-text">${ideaText}</div>
            <div class="idea-meta">suggested by <span>${userName}</span></div>
            <button class="delete-btn" title="Remove Idea">&times;</button>
        `;

        // Add to list
        ideaList.prepend(li);

        // Clear inputs
        ideaInput.value = '';
        userSelect.selectedIndex = 0;
    };

    // Event Listeners
    addBtn.addEventListener('click', createIdea);

    // Allow "Enter" key to submit
    ideaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createIdea();
    });

    // Event Delegation for delete buttons
    ideaList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.idea-card');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => card.remove(), 200);
        }
    });
});