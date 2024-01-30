document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.querySelector('.word');
    const checkBtn = document.getElementById('checkBtn');
    const extraOptionBtn = document.getElementById('extraOptionBtn');
    const firstGroup = document.getElementById('firstGroup');
    const secondGroup = document.getElementById('extraOptions');
    const optionGroups = document.querySelectorAll('.option-group');
    const extraOptions = document.getElementById('extraOptions');

    /*
const questions = [
    { word: "ὁ", cat: "lidwoord", answers: ["nom ev m"] },
    { word: "ἔργον", cat: "ἔργον", answers: ["nom ev n", "acc ev n"] },
         ];*/

    let selectedAnswers = [];
    let score = -1;
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
        extraOptionBtn.style.display = 'flex';
        tweedeOptie = true;
        extraOptionBtn.innerText = "Toch maar 1 optie?";
    }

    function resetSecondBlock() {
        extraOptions.style.display = 'none';
        tweedeOptie = false;
        extraOptionBtn.innerText = "Nog een optie?";

        const extraOptionButtons = extraOptions.querySelectorAll('.option');
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
        resetButtons();
    }
    function verifyTwoAnswers(correctAnswer) {
        const firstAnswer = selectedAnswers.slice(0, 3).join(" ");
        const secondAnswer = selectedAnswers.slice(3).join(" ");
        if ((correctAnswer[1] == firstAnswer) || (correctAnswer[0] == secondAnswer)) {
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
        const correctAnswer = qbank.find(question => question.word === currentWord)?.answers;
        //console.log('Correct Answer: ', correctAnswer);
        const correctFirstAnswer = correctAnswer[0].split(" ");
        //  console.log('Correct AnswerA: ', correctFirstAnswer);
        const selectedAnswersString = selectedAnswers.join(' ');
        //console.log('Selected Answer: ', selectedAnswersString);
        if (correctAnswer.length == 2) {
            verifyTwoAnswers(correctAnswer);
        }
        else {
            verifyOneOptionGroup(firstGroup, correctFirstAnswer);

            if ((selectedAnswers.length > 3) && (correctAnswer.length == 1)) {
                secondGroup.querySelectorAll('.option-group').forEach((optionGroup, index) => {
                    // Loop over alle opties binnen de huidige optiegroep
                    optionGroup.querySelectorAll('.option').forEach(option => {
                        option.classList.add('incorrect');
                        fullAnswerCorrect = false;
                    });
                });
            }
        }
        const nrOfIncorrect = 0;
        //document.querySelectorAll('button[class*="incorrect"]');
        
        if (nrOfIncorrect.length>0){
           // console.log("incorrect");
            score --;
            if (score<-1){
                score = -1;
            }
        }
        else{
            //console.log("correct");
            score++;
        }
        updateScoring();
        resetButtonsAfterTimeout(); // Reset button classes after 2 seconds
    }

    function verifyOneOptionGroup(optionGroup, answerGroep) {
     
     
        // Loop over elke optiegroep binnen de eerste groep
        optionGroup.querySelectorAll('.option-group').forEach((optionGroup, index) => {
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
                }
                else if (!isSelected && isCorrect) {
                    option.classList.add('correct');
                }
                else if (!hasMadeSelection && !isCorrect) {
                    option.classList.add('incorrect');
                }
            });
        });
    }

    function resetButtonsAfterTimeout() {
        extraOptionBtn.style.display = 'none';
        checkBtn.style.display = 'none';
        setTimeout(() => {
            resetButtons(); // Reset button classes after 2 seconds
            showQuestion();
        }, 2000);
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
        if ((selectedAnswers.length === 3 && !tweedeOptie) ||
            (selectedAnswers.length === 6 && tweedeOptie)) {
            //checkBtn.disabled = false;
            extraOptionBtn.style.display = 'flex';
            checkBtn.classList.add('active');
            checkBtn.style.display = 'flex'; // Display the "Check" button
        }
        else {
            checkBtn.classList.remove('active');
            //extraOptionBtn.style.display = 'none';
            checkBtn.style.display = 'none';
        }
    }

    optionGroups.forEach(group => {
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
                });

                // Remove question if no answers
                if (q.answers.length === 0) return null;
                return q;

            });

            // Filter out null values
            filteredQuestions = filteredQuestions.filter(q => q);

              // console.log("FilterQ: " + filteredQuestions);
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
        "128520",
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
    function updateScoring(){
            if (score <0 ) return;

            const emoticonIndex = Math.floor(score / 3);
            const repeats = score % 3;
          
            let codedEmoticon;

            if(emoticonIndex >= emoticons.length) {
              codedEmoticon = baseCode + (emoticonIndex - emoticons.length); 
            } else {
              codedEmoticon = emoticons[emoticonIndex];
            }

            let emoticonHtml = '';
           
            for(let i = -1; i < repeats; i++) {
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
