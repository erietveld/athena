document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.querySelector('.word');
    const options = document.querySelector('.options');
    const checkBtn = document.getElementById('checkBtn');
    const checkBtn2 = document.getElementById('checkBtn2');
    const optionGroups = document.querySelectorAll('.option-group');

    const questions = [
        { word: 'woord1', answer: ['nom ev m','nom mv f'] },
        { word: 'woord2', answer: ['gen mv f']},
        // Add more questions if needed
    ];

    let selectedAnswers = [];

    // Selecteer de extra optie-knop
    const extraOptionBtn = document.getElementById('extraOptionBtn');

    // Selecteer het extra optieblok
    const extraOptions = document.getElementById('extraOptions');
    var tweedeOptie = false;

    // Voeg een event listener toe om te luisteren naar klikgebeurtenissen op de extra optie-knop
    extraOptionBtn.addEventListener('click', function() {
        // Als het extra optieblok bestaat
        

        if (extraOptions && !tweedeOptie) {
            // Toon het extra optieblok
            extraOptions.style.display = 'flex';
            tweedeOptie = true;
            extraOptionBtn.innerText = "toch maar 1 optie";
        }
        else{
            extraOptions.style.display = 'none';
            tweedeOptie = false;
            extraOptionBtn.innerText = "nog een optie";

            const extraOptionButtons = extraOptions.querySelectorAll('.option');
            extraOptionButtons.forEach(button => {
                button.classList.remove('selected');
            });
            selectedAnswers.splice(3);
            console.log("selected answers" + selectedAnswers);
        }
        updateCheckButtonVisibility();
    });


    function showQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];
        wordElement.textContent = question.word;
        selectedAnswers = [];
        resetButtons(); // Reset button classes
        checkBtn.style.display = 'none'; // Hide the "Check" button
    }

    function checkAnswer() {
        const currentWord = wordElement.textContent;
        const correctAnswer= questions.find(question => question.word === currentWord)?.answer;
        console.log('Correct Answers:', correctAnswer);
        const selectedAnswersString = selectedAnswers.join(' ');
        console.log('Selected Answers:', selectedAnswersString);
    }

    function checkAnswers(){
        const currentWord = wordElement.textContent;
        const correctAnswerGroups = questions.find(question => question.word === currentWord)?.answer;
        console.log('Correct Answers:', correctAnswerGroups);
        const selectedAnswersString = selectedAnswers.join(' ');
        console.log('Selected Answers:', selectedAnswersString);
        const isCorrect = correctAnswers.some(answer => answer === selectedAnswersString);

        
        if (correctAnswerGroups) {
            const correctAnswerIndices = correctAnswerGroups.map(answerGroup => {
                const correctAnswers = answerGroup.split(' ');
                return correctAnswers.map(answer => selectedAnswers.indexOf(answer));
            });
            
            const selectedAnswerIndices = selectedAnswers.map(answer => answer.split(' ').map(part => {
                const option = optionGroups.find(group => group.querySelector(`[data-type="${part}"]`));
                return Array.from(option.querySelectorAll('.option')).indexOf(option.querySelector(`[data-type="${part}"]`));
            }));
            
            let isCorrect = correctAnswerIndices.some(correctIndices =>
                selectedAnswerIndices.every(selectedIndices =>
                    correctIndices.every((correctIndex, index) => selectedIndices[index] === correctIndex)
                )
            );
            
            optionGroups.forEach(group => {
                const selectedButton = group.querySelector('.selected');
                const selectedButtonType = selectedButton.dataset.type;
                const correctButtonType = correctAnswerGroups[0].split(' ')[0];
                if (selectedButtonType === correctButtonType && isCorrect) {
                    selectedButton.classList.add('correct');
                } else if (selectedButton) {
                    selectedButton.classList.add('incorrect');
                }
            });
        } else {
            console.log('Question not found for the current word:', currentWord);
        }
        
        resetButtonsAfterTimeout(); // Reset button classes after 2 seconds
    }

    

    function checkAnswersOld() {
        const currentWord = wordElement.textContent;
        const correctAnswers = questions.find(question => question.word === currentWord)?.answers;
        console.log('Correct Answers:', correctAnswers);
        console.log('Selected Answers:', selectedAnswers);
        
        if (correctAnswers) {
            const correctIndices = correctAnswers.map(answer => selectedAnswers.indexOf(answer));
            console.log('correctIndices', correctIndices);
            optionGroups.forEach((group, index) => {
                const selectedButton = group.querySelector('.selected');
                const correctButton = group.querySelectorAll('.option')[correctIndices[index]];
                
                if (selectedButton && correctButton && selectedButton === correctButton) {
                    selectedButton.classList.add('correct');
                } else if (selectedButton) {
                    selectedButton.classList.add('incorrect');
                }
                
                if (correctButton) {
                    correctButton.classList.add('correct');
                }
            });
        } else {
            console.log('Question not found for the current word:', currentWord);
        }
        
        resetButtonsAfterTimeout(); // Reset button classes after 2 seconds
    }
    

    function resetButtons() {
        optionGroups.forEach(group => {
            const buttons = group.querySelectorAll('.option');
            buttons.forEach(button => {
                button.classList.remove('selected', 'correct', 'incorrect');
            });
        });
    }

    function resetButtonsAfterTimeout() {
        setTimeout(() => {
            resetButtons(); // Reset button classes after 2 seconds
            showQuestion();
        }, 2000);
    }

    function selectOption(event) {
        const selectedButton = event.target;
        const selectedOption = selectedButton.dataset.type;
        const group = selectedButton.closest('.option-group');

        // Deselect previously selected option in the same group
        const previouslySelectedButton = group.querySelector('.selected');
        if (previouslySelectedButton) {
            previouslySelectedButton.classList.remove('selected');
        }

        // Select the clicked option
        selectedButton.classList.add('selected');

        // Update selectedAnswers array
        const groupIndex = Array.from(optionGroups).indexOf(group);
        selectedAnswers[groupIndex] = selectedOption;
        updateCheckButtonVisibility();
    }
    function updateCheckButtonVisibility() {
        // Check if all three answers are selected
       // checkBtn.style.display = 'none';
        checkBtn.disabled = true;
        if ((selectedAnswers.length === 3 && !tweedeOptie) || 
           (selectedAnswers.length === 6 && tweedeOptie))
        {
            checkBtn.disabled = false;
            checkBtn.style.display = 'flex'; // Display the "Check" button
        }
    }

    optionGroups.forEach(group => {
        group.addEventListener('click', selectOption);
    });

    checkBtn.addEventListener('click', checkAnswer);

    // Initial setup
    showQuestion();
});
