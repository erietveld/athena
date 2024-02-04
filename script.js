document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.querySelector('.word');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');

    const firstGroup = document.getElementById('firstGroup');

    const secondGroup = document.getElementById('secondGroup');
    const secondOptionBtn = document.getElementById('secondOptionBtn');
    const secondGroupFrame = document.getElementById('secondGroupFrame');

    const thirdGroup = document.getElementById('thirdGroup');
    const thirdOptionBtn = document.getElementById('thirdOptionBtn');
    const thirdGroupFrame = document.getElementById('thirdGroupFrame');

    const optionButtons = document.querySelectorAll('.option');
    const optionGroups = document.querySelectorAll('.option-group');
    const optionsFrames = document.querySelectorAll('.options-frame');

    let selectedAnswers = [];
    let score = -1;
    var nrOfAnswers = 1;

    secondOptionBtn.addEventListener('click', extraBlock);
    thirdOptionBtn.addEventListener('click', extraBlock);
    function extraBlock() {
        if (nrOfAnswers == 1) {
            nrOfAnswers = 2;
            showSecondBlock();
            showReset();
        }
        else if (nrOfAnswers == 2) {
            nrOfAnswers = 3;
            showThirdBlock();
            showReset();
        }
        else {
            //    resetSecondBlock();
        }
        updateCheckButtonVisibility();
    };

    nextBtn.addEventListener('click', showQuestion);
    resetBtn.addEventListener('click', reset);
    function reset() {
        nrOfAnswers = 1;
        selectedAnswers = [];
        optionButtons.forEach(button => {
            button.classList.remove('selected', 'correct', 'incorrect', 'hidden', 'missed', 'button-with-x');
        });
        secondGroupFrame.style.display = 'none';
        secondOptionBtn.style.display = 'none';
        thirdGroupFrame.style.display = 'none';
        thirdOptionBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        checkBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        document.querySelectorAll('div').forEach(div => {
            div.classList.remove('incorrect','correct', 'button-with-x');
            });

    };

    // Loop through each options-frame div and attach a click event listener
    // optionsFrames.forEach(optionsFrame => {
    //     optionsFrame.addEventListener('click', () => {
    //         // Your event handling code here
    //       //  console.log("Clicked on an options-frame div");
    //         var hiddenButtons = optionsFrame.querySelectorAll('.option.hidden');
    //         hiddenButtons.forEach(function(button) {
    //             button.classList.remove('hidden');
    //         });
    //     });
    // });

    function showSecondBlock() {
        var unselectedButtons = firstGroup.querySelectorAll('.option:not(.selected):not(.incorrect):not(.correct)');
        // Add 'hidden' class to unselected buttons
        unselectedButtons.forEach(function (button) {
            button.classList.add('hidden');
        });

        secondGroupFrame.style.display = 'flex';
        secondOptionBtn.style.display = 'none';
    }

    function showThirdBlock() {
        var unselectedButtons = secondGroup.querySelectorAll('.option:not(.selected):not(.incorrect):not(.correct)');
        // Add 'hidden' class to unselected buttons
        unselectedButtons.forEach(function (button) {
            button.classList.add('hidden');
        });

        thirdGroupFrame.style.display = 'flex';
        thirdOptionBtn.style.display = 'none';

        //  extraOptionBtn.innerText = "Toch maar 1 optie?";
    }
    function showReset() {
        resetBtn.style.display = 'flex';
    }

    function resetSecondBlock() {
        // secondGroup.style.display = 'none';
        // nrOfAnswers = false;
        //secondOptionBtn.innerText = "Nog een optie?";

        const extraOptionButtons = secondGroup.querySelectorAll('.option');
        extraOptionButtons.forEach(button => {
            button.classList.remove('selected');
        });
        selectedAnswers.splice(3);
    }

    function showQuestion() {
        if (qbank.length == 0) {
            wordElement.textContent = "Geen vragen gevonden, maak een keuze uit het menu."
            return;
        }
        const randomIndex = Math.floor(Math.random() * qbank.length);
        const question = qbank[randomIndex];
        wordElement.textContent = question.word;
        selectedAnswers = [];
        reset();
    }
    function verifyTwoAnswers(correctAnswer) {
        const firstAnswer = selectedAnswers.slice(0, 3).join(" ");
        const secondAnswer = selectedAnswers.slice(3).join(" ");
        if ((correctAnswer[1] == firstAnswer) || (correctAnswer[0] == secondAnswer)) {
            verifyOneOptionGroup(firstGroup, correctAnswer[1]);
            verifyOneOptionGroup(secondGroup, correctAnswer[0]);
        }
        else {
            verifyOneOptionGroup(firstGroup, correctAnswer[0]);
            verifyOneOptionGroup(secondGroup, correctAnswer[1]);
        }
        showSecondBlock();
    }
    function verifyThreeAnswers(correctAnswers) {
        var ans = [];
        ans[0] = selectedAnswers.slice(0, 3).join(" ");
        ans[1] = selectedAnswers.slice(3, 6).join(" ");
        ans[2] = selectedAnswers.slice(6).join(" ");
        var groups = [firstGroup, secondGroup, thirdGroup];

        //Go over the correctAnswer array to find out in what order the answers
        //are given to fill the answerOrder array. Incorrect answers that don't match any correctAnswers can be assigned the maining numbers.

        // Create a copy of correctAnswers array to preserve the original order
        var remainingAnswers = correctAnswers.slice();

        // Initialize the answerOrder array with -1 to indicate an unanswered question
        var answerOrder = [-1, -1, -1];

        // Go through each answer and find its position in the correctAnswers array
        for (var i = 0; i < ans.length; i++) {
            var index = remainingAnswers.indexOf(ans[i]);
            // If the answer is found in correctAnswers array, assign its index to answerOrder
            if (index !== -1) {
                answerOrder[i] = correctAnswers.indexOf(remainingAnswers[index]);
                // Remove the found answer from remainingAnswers to handle duplicates
                remainingAnswers.splice(index, 1);
            }
        }

        // For any unanswered questions, assign the remaining indices in correctAnswers to answerOrder
        for (var j = 0; j < answerOrder.length; j++) {
            if (answerOrder[j] === -1) {
                answerOrder[j] = correctAnswers.indexOf(remainingAnswers.shift());

            }
        }

        verifyOneOptionGroup(groups[0], correctAnswers[answerOrder[0]]);
        verifyOneOptionGroup(groups[1], correctAnswers[answerOrder[1]]);
        verifyOneOptionGroup(groups[2], correctAnswers[answerOrder[2]]);

        secondGroupFrame.style.display = 'flex';
        thirdGroupFrame.style.display = 'flex';
      //  showSecondBlock();
      //  showThirdBlock();
    }

    function markTooManyAnswers(correctAnswerlength) {
        if (correctAnswerlength == 3) return;
        const nrOfAnwersGiven = selectedAnswers.length / 3;
        if (correctAnswerlength < 3 && nrOfAnwersGiven == 3) {
            thirdGroup.querySelectorAll('.option-group').forEach((optionGroup) => {
                optionGroup.querySelectorAll('.option:not(.selected)').forEach(option => {
                  //  option.classList.add('incorrect');
                    option.classList.add('hidden');
                });
            });
            thirdGroup.closest('.options-frame').classList.add('button-with-x');
        }
        if (correctAnswerlength == 1 && nrOfAnwersGiven > 1) {
            secondGroup.querySelectorAll('.option-group').forEach((optionGroup) => {
                optionGroup.querySelectorAll('.option:not(.selected)').forEach(option => {
                 //   option.classList.add('incorrect');
                    option.classList.add('hidden');
                });
            });
            secondGroup.closest('.options-frame').classList.add('button-with-x');
        }

    }

    function checkAnswer() {
        const currentWord = wordElement.textContent;
        const correctAnswer = qbank.find(question => question.word === currentWord)?.answers;

        markTooManyAnswers(correctAnswer.length);
        if (correctAnswer.length == 2) {
            verifyTwoAnswers(correctAnswer);
        }
        else if (correctAnswer.length == 1) {
            verifyOneOptionGroup(firstGroup, correctAnswer[0]);
        }
        else if (correctAnswer.length == 3) {
            verifyThreeAnswers(correctAnswer);
        }
        const nrOfIncorrect = document.querySelectorAll('div[class*="incorrect"]');
        var correct = nrOfIncorrect.length == 0;
        if (!correct) {
            // console.log("incorrect");
            score--;
            if (score < -1) {
                score = -1;
            }
        }
        else {
            //console.log("correct");
            score++;
        }
        updateScoring();
        resetButtonsAfterTimeout(nrOfIncorrect); // Reset button classes after 2 seconds
    }

    function verifyOneOptionGroup(optionGroup, answerGroepString) {
        var answerGroep = answerGroepString.split(" ");
        optionGroup.querySelectorAll('.option-group').forEach((optionGroup, index) => {
            // Loop over alle opties binnen de huidige optiegroep
            const correctSingleAnswer = answerGroep[index];
            var hasMadeSelection = (optionGroup.querySelectorAll('.option.selected').length > 0);
            
            var groupCorrect = true;
            optionGroup.querySelectorAll('.option').forEach(option => {
                const dataType = option.getAttribute('data-type');
                const isSelected = option.classList.contains('selected');
                const isThisButtonCorrect = (dataType == correctSingleAnswer);
                
                // Voeg klassen toe op basis van de resultaten
                if (isSelected && isThisButtonCorrect) {
                    option.classList.add('correct');
                    option.classList.remove('hidden');

                } else if (isSelected && !isThisButtonCorrect) {
                   // option.classList.add('incorrect');
                    option.classList.add('button-with-x');
                    groupCorrect = false;
                }
                else if (!isSelected && isThisButtonCorrect) {
                    option.classList.add('missed');
                    option.classList.remove('hidden');
                    groupCorrect = false;
                }
                else if (!hasMadeSelection && !isThisButtonCorrect) {
                    option.classList.add('hidden');
                }
                else if (!isSelected && !isThisButtonCorrect){
                   option.classList.add('hidden');
                }
            });

            const optionFrame = optionGroup.closest('.options-frame');
            if (groupCorrect){
                optionFrame.classList.add('correct');
            }
            else{
                optionFrame.classList.add('incorrect');
            }
        });
    }

    function resetButtonsAfterTimeout(nrOfIncorrect) {
        checkBtn.style.display = 'none';
        secondOptionBtn.style.display = 'none';
        thirdOptionBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        nextBtn.style.display = 'flex';
        // var delay = 2000;
        // if (!correct) delay = 10000;
        // setTimeout(() => {

        //     showQuestion();
        // }, delay);
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
        // checkBtn.disabled = true;
        if (((selectedAnswers.length === 3) && (nrOfAnswers == 1)) ||
            ((selectedAnswers.length === 6) && (nrOfAnswers == 2)) ||
            ((selectedAnswers.length === 9) && (nrOfAnswers == 3))
        ) {
            if (nrOfAnswers == 1) secondOptionBtn.style.display = 'flex';
            else if (nrOfAnswers == 2) thirdOptionBtn.style.display = 'flex';

            checkBtn.classList.add('active');
            checkBtn.style.display = 'flex'; // Display the "Check" button
        }
        else {
            checkBtn.classList.remove('active');
            //extraOptionBtn.style.display = 'none';
            checkBtn.style.display = 'none';
        }
    }

    optionButtons.forEach(group => {
        group.addEventListener('click', selectOption);
    });

    checkBtn.addEventListener('click', checkAnswer);


    function populateMenuItems() {
        // Get reference to menu div
        const menuWords = document.getElementById("menuWords");
        const menuNaamval = document.getElementById("menuNaamval");
        const menuCard = document.getElementById("menuCard");

        // Flatten all answers into one array
        const allAnswers = questions.flatMap(q => q.answers);

        // Get unique values by splitting on space and taking the parts
        const naamvals = [...new Set(
            allAnswers.map(a => a.split(" ")[0])
        )];

        const cardinaliteit = [...new Set(
            allAnswers.map(a => a.split(" ")[1])
        )];

        // Get unique category values
        const categories = [...new Set(questions.map(q => q.cat))];
        addCheckbox(categories, menuWords);
        addCheckbox(naamvals, menuNaamval);
        addCheckbox(cardinaliteit, menuCard);

        // Get checkboxes inside menuWords
        const wordCB = menuWords.querySelectorAll('input[type="checkbox"]');
        const naamvalsCB = menuNaamval.querySelectorAll('input[type="checkbox"]');
        const cardinaliteitCB = menuCard.querySelectorAll('input[type="checkbox"]');

        // Add change listener
        const checkboxes = document.getElementById("mySidenav").querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterWoordQuestions);
        });

        // Filter questions function
        function filterWoordQuestions() {

            // Get checked values
            const checkedCats = [];
            wordCB.forEach(cb => {
                if (cb.checked) checkedCats.push(cb.value);
            });
            const checkedNV = [];
            naamvalsCB.forEach(cb => {
                if (cb.checked) checkedNV.push(cb.value);
            });
            const checkedCard = [];
            cardinaliteitCB.forEach(cb => {
                if (cb.checked) checkedCard.push(cb.value);
            });

            var filteredQuestions = JSON.parse(JSON.stringify(questions));

            // Filter questions by checked cats
            filteredQuestions = filteredQuestions.filter(q => {
                return checkedCats.includes(q.cat);
            });

            // Filter answer
            filteredQuestions = filteredQuestions.map(q => {
                q.answers = q.answers.filter(a => {
                    // Split answer
                    const parts = a.split(" ");
                    // Check first part
                    if (!checkedNV.includes(parts[0])) return false;
                    // Check second part  
                    if (!checkedCard.includes(parts[1])) return false;
                    return true;
                });

                // Remove question if no answers
                if (q.answers.length === 0) return null;
                return q;

            });

            // Filter out null values
            filteredQuestions = filteredQuestions.filter(q => q);
            qbank = filteredQuestions;
            showQuestion();
        }
    }
    function addCheckbox(list, div) {
        // Loop through categories and add checkbox for each
        list.forEach(cat => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = cat;
            checkbox.id = cat;
            checkbox.checked = true;

            const label = document.createElement("label");
            label.htmlFor = cat;
            label.textContent = cat;

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });
    }

    // Initial setup
    populateMenuItems();
    //Since the are all checked by default set qbank to questions
    var qbank = questions;

    showQuestion();

    const baseCode = 127872;
    const emoticons = [
        "128512",
        "129392",
        "128641",
        "128515",
        "128540",
        "128558",
        "128580",
        "129312",
        "128007",
        "129327",
        "128568",
        "128571",
        "128585",
        "128640",
    ];
    function updateScoring() {
        if (score < 0) return;

        const emoticonIndex = Math.floor(score / 3);
        const repeats = score % 3;

        let codedEmoticon;

        if (emoticonIndex >= emoticons.length) {
            codedEmoticon = baseCode + (emoticonIndex - emoticons.length);
        } else {
            codedEmoticon = emoticons[emoticonIndex];
        }

        let emoticonHtml = '';

        for (let i = -1; i < repeats; i++) {
            emoticonHtml += "&#" + codedEmoticon + ";";
        }

        document.getElementById("emoticon").innerHTML = emoticonHtml;
    }

});

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
