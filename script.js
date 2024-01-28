document.addEventListener('DOMContentLoaded', function() {
    const wordElement = document.querySelector('.word');
    const options = document.querySelector('.options');
    const checkBtn = document.getElementById('checkBtn');
    const optionButtons = document.querySelectorAll('.option');

    const questions = [
        { word: 'woord1', answers: ['nom', 'ev', 'm'] },
        { word: 'woord2', answers: ['gen', 'mv', 'f'] },
        // Voeg meer vragen toe indien nodig
    ];

    let currentQuestionIndex = 0;
    let currentQuestion = questions[currentQuestionIndex];

    function showQuestion() {
        wordElement.textContent = currentQuestion.word;
        options.style.display = 'block';
        checkBtn.style.display = 'block';
    }

    function resetOptions() {
        optionButtons.forEach(button => {
            button.classList.remove('selected');
        });
    }

    function selectOption(event) {
        const selectedButton = event.target;
        resetOptions();
        selectedButton.classList.add('selected');
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', selectOption);
    });

    checkBtn.addEventListener('click', function() {
        const selectedOptions = document.querySelectorAll('.option.selected');
        if (selectedOptions.length === 3) {
            const selectedTypes = Array.from(selectedOptions).map(option => option.dataset.type);
            const correctAnswers = currentQuestion.answers;
            const isCorrect = selectedTypes.every(type => correctAnswers.includes(type));

            if (isCorrect) {
                selectedOptions.forEach(option => {
                    option.classList.add('correct');
                });
                setTimeout(() => {
                    selectedOptions.forEach(option => {
                        option.classList.remove('correct');
                    });
                    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
                    currentQuestion = questions[currentQuestionIndex];
                    showQuestion();
                    resetOptions();
                }, 2000);
            } else {
                // Handle incorrect answer
                console.log('Incorrect answer');
            }
        } else {
            // Prompt user to select all options
            console.log('Please select all options');
        }
    });

    // Initial setup
    showQuestion();
});
