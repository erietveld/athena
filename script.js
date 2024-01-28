document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.querySelector('.word');
    const checkBtn = document.getElementById('checkBtn');
    const firstGroup = document.getElementById('firstGroup');
    const secondGroup = document.getElementById('extraOptions');
    const optionGroups = document.querySelectorAll('.option-group');
    /*
        const questions = [
            { word: 'woord1', answer: ['nom ev m','nom mv f'] },
            { word: 'woord2', answer: ['gen mv f']},
            // Add more questions if needed
        ];*/

    let selectedAnswers = [];

    // Selecteer de extra optie-knop
    const extraOptionBtn = document.getElementById('extraOptionBtn');

    // Selecteer het extra optieblok
    const extraOptions = document.getElementById('extraOptions');
    var tweedeOptie = false;
 
    // Voeg een event listener toe om te luisteren naar klikgebeurtenissen op de extra optie-knop
    extraOptionBtn.addEventListener('click', function () {

        if (extraOptions && !tweedeOptie) {
            setSecondBlock();
        }
        else {
            resetSecondBlock();
        }
        updateCheckButtonVisibility();
    });

    function setSecondBlock() {
        // Toon het extra optieblok
        extraOptions.style.display = 'flex';
        tweedeOptie = true;
        extraOptionBtn.innerText = "Toch maar 1 optie";
    }

    function resetSecondBlock() {
        extraOptions.style.display = 'none';
        tweedeOptie = false;
        extraOptionBtn.innerText = "Nog een optie";

        const extraOptionButtons = extraOptions.querySelectorAll('.option');
        extraOptionButtons.forEach(button => {
            button.classList.remove('selected');
        });
        selectedAnswers.splice(3);
    }

    function showQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];
        wordElement.textContent = question.word;
        selectedAnswers = [];
        resetButtons(); // Reset button classes
        checkBtn.disabled = true;
        // checkBtn.style.display = 'none'; // Hide the "Check" button
    }
    function verifyTwoAnswers(correctAnswer){        
        const firstAnswer = selectedAnswers.slice(0, 3).join(" ");
        const secondAnswer = selectedAnswers.slice(3).join(" ");
        if ((correctAnswer[1] == firstAnswer) || (correctAnswer[0] == secondAnswer)){
            verifyOneOptionGroup(firstGroup, correctAnswer[1].split(" "));
            verifyOneOptionGroup(secondGroup, correctAnswer[0].split(" "));
        }
        else {
            verifyOneOptionGroup(firstGroup, correctAnswer[0].split(" "));
            verifyOneOptionGroup(secondGroup, correctAnswer[1].split(" "));
        }
        setSecondBlock();
    }

    function checkAnswer() {
        const currentWord = wordElement.textContent;  
        const correctAnswer = questions.find(question => question.word === currentWord)?.answers;
        console.log('Correct Answer: ', correctAnswer);
        const correctFirstAnswer = correctAnswer[0].split(" ");
      //  console.log('Correct AnswerA: ', correctFirstAnswer);
        const selectedAnswersString = selectedAnswers.join(' ');
        console.log('Selected Answer: ', selectedAnswersString);
        if (correctAnswer.length == 2) {
            verifyTwoAnswers(correctAnswer);
            return;
        }

        verifyOneOptionGroup(firstGroup, correctFirstAnswer);

        if ((selectedAnswers.length > 3) && (correctAnswer.length == 1)){
            secondGroup.querySelectorAll('.option-group').forEach((optionGroup, index)  => {
                // Loop over alle opties binnen de huidige optiegroep
                optionGroup.querySelectorAll('.option').forEach(option => {
                    option.classList.add('incorrect');
                    fullAnswerCorrect = false; 
                });
            });
        }

       // resetButtonsAfterTimeout(); // Reset button classes after 2 seconds
    }

    function verifyOneOptionGroup(optionGroup, answerGroep){
        console.log("answerGroep" + answerGroep);
        console.log("optionGroup" + optionGroup);
        var fullAnswerCorrect = true;
        // Loop over elke optiegroep binnen de eerste groep
        optionGroup.querySelectorAll('.option-group').forEach((optionGroup, index)  => {
            // Loop over alle opties binnen de huidige optiegroep
            const correctSingleAnswer = answerGroep[index];
            var hasMadeSelection = (optionGroup.querySelectorAll('.option.selected').length > 0);
            optionGroup.querySelectorAll('.option').forEach(option => {
                const dataType = option.getAttribute('data-type');
                const isSelected = option.classList.contains('selected');
                const isCorrect = (dataType == correctSingleAnswer);

                // Voeg klassen toe op basis van de resultaten
                if (isSelected && isCorrect) {
                    option.classList.add('correct');
                } else if (isSelected && !isCorrect) {
                    option.classList.add('incorrect');
                    fullAnswerCorrect = false; 
                }
                else if (!isSelected && isCorrect) {
                    fullAnswerCorrect = false; 
                    option.classList.add('correct');
                }
                else if (!hasMadeSelection && !isCorrect){
                    option.classList.add('incorrect');
                }
            });
        });


    }

    function resetButtons() {
        optionGroups.forEach(group => {
            const buttons = group.querySelectorAll('.option');
            buttons.forEach(button => {
                button.classList.remove('selected', 'correct', 'incorrect');
            });
        });
        resetSecondBlock();
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
      //  console.log("Updating checkbutotn visiblity");
        checkBtn.disabled = true;
        if ((selectedAnswers.length === 3 && !tweedeOptie) ||
            (selectedAnswers.length === 6 && tweedeOptie)) {
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
