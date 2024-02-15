document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.getElementById('word');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');

    let score = -1;
    var questions; //All questions from selected list
    var qbank; // All filtered questions
    var amReviewing = false;

    document.getElementById('GrieksNaamwoord').addEventListener('click', () => {
        // Find all buttons with class Latin and remove them from the DOM
        var latinButtons = document.querySelectorAll('.latijn');
        latinButtons.forEach(function (button) {
            button.parentNode.removeChild(button);
        });
        var naamwoordBlock = document.querySelectorAll('.werkwoorden');
        naamwoordBlock.forEach(function (button) {
            button.parentNode.removeChild(button);
        })
        questions = questionsGreekNaamwoord;
        loadMainQuiz();
        populateMenuItemsNaamwoorden();
    });
    document.getElementById('LatijnWerkwoord').addEventListener('click', loadLatijnWW);

    function loadLatijnWW() {
        var grieksButtons = document.querySelectorAll('.grieks');
        grieksButtons.forEach(function (button) {
            button.parentNode.removeChild(button);
        });
        var naamwoordBlock = document.querySelectorAll('.naamwoorden');
        naamwoordBlock.forEach(function (button) {
            button.classList.add('hidden', 'hideOnReset');
        })

        questions = qWerkwoordLatijn;
        // addWerkwoordListeners();
        loadMainQuiz();
        populateMenuItemsWerkwoorden();
    }
    addAllButtonListeners();

    function addAllButtonListeners(){
        //!!ER: Keep this order of eventListener registrations
        document.querySelectorAll('.option').forEach(group => {
            group.addEventListener('click', selectOption);
        });
        addWerkwoordListeners();
        document.querySelectorAll('.option').forEach(group => {
            group.addEventListener('click', validateAnswerComplete);
        });
    }
    

    function addWerkwoordListeners() {
        const ptcButtons = document.querySelectorAll('button[data-type="ptc"]');
        ptcButtons.forEach(button => {
            button.addEventListener('click', ptcClicked); 
        });
        
        const wijsButtons = document.querySelectorAll('.werkwoorden .option-group:nth-child(1) button');
        wijsButtons.forEach(button => {
            button.addEventListener('click', wijsUpdated);
        });
    }
    function ptcClicked(event){
        const clickedButton = event.target;
        const optionsFrameDiv = clickedButton.closest('.options-frame');
        var naamwoordBlock = optionsFrameDiv.querySelector('.naamwoorden');
        if (clickedButton.classList.contains('selected')) {
            naamwoordBlock.classList.remove('hidden');
        }
        else{
            naamwoordBlock.classList.add('hidden');
            const allNaamwoordButtons = naamwoordBlock.querySelectorAll('button');
            allNaamwoordButtons.forEach(function (button) {
                button.classList.remove('selected');
            });

        }
    }

    function wijsUpdated(event) {
        const clickedButton = event.target;
        const optionsDiv = clickedButton.closest('.options');
        const wijsButtons = optionsDiv.querySelectorAll('.option-group:nth-child(1) button');
        var disList = "";

        wijsButtons.forEach(function (button) {
            if (button.classList.contains('selected')) {
                const disGetal = button.getAttribute('data-disGetal')
                if (disGetal  !== undefined) {
                    disList += disGetal;
                }
            }
        });


        // Find all buttons in the third option-group under the options div
        const persGetalButtons = optionsDiv.querySelectorAll('.option-group:nth-child(3) button');

        // Check if any button in the third option-group is already disabled
        persGetalButtons.forEach(function (button, index) {
            if (disList.includes(index)) {
                button.classList.remove('selected');
                button.disabled = true;
            }
            else {
                button.disabled = false;
            }
        });
    }

    //TODO: Remove before flight
    if (false) {
        loadLatijnWW();
    }
    // END TODO


    document.getElementById('LatijnNaamwoord').addEventListener('click', () => {
        questions = questionsLatinNaamwoord;
        loadMainQuiz()
        populateMenuItemsNaamwoorden();
    });

    function loadMainQuiz() {
        document.getElementById('mySidenav').classList.add('show');
        document.getElementById('header').style.display = 'flex';
        document.querySelector('.container').style.display = 'block';
        document.getElementById('mainmenu').style.display = 'none';
        document.body.style.display = 'block';
        qbank = questions;

        showQuestion();
    }

    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById("mySidenav").style.width = "250px";
    });

    document.getElementById('closeMenu').addEventListener('click', () => {
        document.getElementById("mySidenav").style.width = "0px";
    });



    addOptionBtn.addEventListener('click', extraFrame);
    var currentFrameId = 0;

    // Function to get selected options from each option group
    function getSelectedOptions(currentFrame) {
        var selectedOptions = [];
        var optionGroups = currentFrame.querySelectorAll('.option-group');

        optionGroups.forEach(function (group) {
            var groupSelectedOptions = [];
            var buttons = group.querySelectorAll('.option.selected');

            buttons.forEach(function (button) {
                groupSelectedOptions.push(button.getAttribute('data-type'));
            });
            const parentVisible = !group.closest('.options').classList.contains('hidden');
            const hasEnabledButtons = group.querySelectorAll('.option:not([disabled])').length>0;

            if (parentVisible && hasEnabledButtons) {
                selectedOptions.push(groupSelectedOptions);
            }
        });

        return selectedOptions;
    }


    // Function to generate permutations of selected options
    function generatePermutations(selectedOptions) {
        if (selectedOptions.length === 0) {
            return [[]];
        }

        var firstGroup = selectedOptions[0];
        var restGroups = selectedOptions.slice(1);
        var restPermutations = generatePermutations(restGroups);

        var permutations = [];

        firstGroup.forEach(function (option) {
            restPermutations.forEach(function (permutation) {
                permutations.push([option].concat(permutation));
            });
        });

        return permutations;
    }

    function expandPermutations() {

        var currentFrame = document.getElementById('groupFrame' + currentFrameId);
        const selectedOptions = getSelectedOptions(currentFrame);
        // Generate permutations of selected options
        const permutations = generatePermutations(selectedOptions);

        if (permutations.length == 1) return;

        //Clear selections from current frame
        var selectedButtons = currentFrame.querySelectorAll('.option.selected');
        selectedButtons.forEach((button) => {
            button.classList.remove('selected');
        });

        const startFrameId = currentFrameId;
        permutations.forEach((permutation, index) => {
            var oneFrame;
            if (index == 0) {
                oneFrame = document.getElementById('groupFrame' + (startFrameId + index));
            }
            else {
                oneFrame = addFrame(false);
            }
            var optionGroups = oneFrame.querySelectorAll('.option-group');
            optionGroups.forEach((group, index2) => {
                var buttons = group.querySelectorAll('.option');

                buttons.forEach(function (button) {
                    if (button.getAttribute('data-type') === permutation[index2]) {
                        button.classList.add("selected");
                    }
                    else {
                        button.classList.add('hidden');
                    }
                });
            });
        });

    }

    function extraFrame() {
        expandPermutations();
        var currentFrame = document.getElementById('groupFrame' + currentFrameId);
        var nextFrame = addFrame(true);

        resetBtn.style.display = 'flex';

        var unselectedButtons = currentFrame.querySelectorAll('.option:not(.selected):not(.incorrect):not(.correct):not(.missed)');
        // Add 'hidden' class to unselected buttons
        unselectedButtons.forEach((button) => {
            button.className = 'option hidden';
        });

        hideForIncompleteAnswer();
        return nextFrame;
    };


    function addFrame(addEventHandler) {
        currentFrameId++;
        var container = document.getElementById('groups');
        var frameClone = document.getElementById('groupFrame0').cloneNode(true);
        frameClone.id = 'groupFrame' + currentFrameId;
        var selectedButtons = frameClone.querySelectorAll('.option');
        selectedButtons.forEach(button => {
            button.className = 'option';
        });

        frameClone.querySelectorAll('.hideOnReset').forEach(button => {
            button.classList.add('hidden');
        })
        container.appendChild(frameClone);
        addAllButtonListeners();
        return frameClone;
    }

    nextBtn.addEventListener('click', showQuestion);
    resetBtn.addEventListener('click', reset);
    function reset() {
        amReviewing = false;
        selectedAnswers = [];
        resetFrames();
        document.querySelectorAll('.hideOnReset').forEach(button => {
            button.classList.add('hidden');
        })
        document.querySelectorAll('.option').forEach(button => {
            button.className = 'option';
            button.disabled = false;
        });
        addOptionBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        checkBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        document.querySelectorAll('div').forEach(div => {
            div.classList.remove('incorrect', 'correct', 'button-with-x');
        });

    };
    // Function to remove all extra frames except for the first one
    function resetFrames() {
        var extraFrames = document.querySelectorAll('.options-frame:not(#groupFrame0)');
        extraFrames.forEach(function (frame) {
            frame.remove();
        });
        currentFrameId = 0;
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
    function markAnswers(correctAnswers) {
        var selectedOptions = document.querySelectorAll('.option.selected');
        var selectedAnswers = [];

        selectedOptions.forEach(function (option) {
            selectedAnswers.push(option.getAttribute('data-type'));
        });

        //Prepare answer array
        var ans = [];
        var chunkSize = 3; // Number of answers per group
        for (var i = 0; i < Math.ceil(selectedAnswers.length / chunkSize); i++) {
            ans[i] = selectedAnswers.slice(i * chunkSize, (i + 1) * chunkSize).join(" ");
        }

        //Prepare groups and answerOrder
        var groups = [];
        var answerOrder = [];
        var i = 0;
        var frame;
        while (frame = document.getElementById(`groupFrame${i}`)) {
            groups.push(frame);
            // Initialize the answerOrder array with -1 to indicate an unanswered question
            answerOrder.push(-1);
            i++;
        }

        //Go over the correctAnswer array to find out in what order the answers
        //are given to fill the answerOrder array. Incorrect answers that don't match any correctAnswers can be assigned the maining numbers.

        // Create a copy of correctAnswers array to preserve the original order
        var remainingAnswers = correctAnswers.slice();

        // Go through each answer and find its position in the correctAnswers array
        for (var i = 0; i < answerOrder.length; i++) {
            var index = remainingAnswers.indexOf(ans[i]);
            // If the answer is found in correctAnswers array, assign its index to answerOrder
            if (index !== -1) {
                answerOrder[i] = correctAnswers.indexOf(remainingAnswers[index]);
                // Remove the found answer from remainingAnswers to handle duplicates
                remainingAnswers.splice(index, 1);
            }
        }

        // For any unanswered questions, assign the remaining indices in correctAnswers to answerOrder
        // For answered question thwn there are no remainingAnswers, mark those frames as incorret.
        for (var j = 0; j < answerOrder.length; j++) {
            if (answerOrder[j] === -1) {
                var leftOverAnswer = remainingAnswers.shift();
                if (leftOverAnswer === undefined) {
                    markTooManyAnswers(j);
                }
                else {
                    answerOrder[j] = correctAnswers.indexOf(leftOverAnswer);
                }
            }
        }
        for (var k = 0; k < answerOrder.length; k++) {
            if (answerOrder[k] != -1) {
                verifyOneOptionGroup(groups[k], correctAnswers[answerOrder[k]]);
            }
        }

        //Not enough answers given?
        while (remainingAnswers.length > 0) {
            var remainingAnswer = remainingAnswers.shift();
            verifyOneOptionGroup(extraFrame(remainingAnswer), remainingAnswer);
        }


    }

    function markTooManyAnswers(i) {
        var groupFrame = document.getElementById(`groupFrame${i}`);
        groupFrame.classList.add('button-with-x', 'incorrect');
        groupFrame.querySelectorAll('.option-group').forEach((optionGroup) => {
            optionGroup.querySelectorAll('.option:not(.selected)').forEach(option => {
                option.classList.add('hidden');
            });
        });

    }

    function checkAnswer() {
        amReviewing = true;
        const currentWord = wordElement.textContent;
        const correctAnswer = qbank.find(question => question.word === currentWord)?.answers;
        expandPermutations();
        markAnswers(correctAnswer);

        const nrOfMistakes = document.querySelectorAll('div[class*="incorrect"]');
        var correct = nrOfMistakes.length == 0;
        if (!correct) {
            score--;
            if (score < -1) {
                score = -1;
            }
        }
        else {
            score++;
        }
        updateScoring();
        resetButtons(nrOfMistakes); // Reset buttons
    }

    function verifyOneOptionGroup(optionGroup, answerGroepString) {
        var answerGroep = answerGroepString.split(" ");
        var groupCorrect = true;
        optionGroup.querySelectorAll('.option-group').forEach((optionGroup, index) => {
            // Loop over alle opties binnen de huidige optiegroep
            const correctSingleAnswer = answerGroep[index];
            var hasMadeSelection = (optionGroup.querySelectorAll('.option.selected').length > 0);

            optionGroup.querySelectorAll('.option').forEach(option => {
                const dataType = option.getAttribute('data-type');
                const isSelected = option.classList.contains('selected');
                const isThisButtonCorrect = (dataType == correctSingleAnswer);
                option.classList.remove('selected');

                // Voeg klassen toe op basis van de resultaten
                if (isSelected && isThisButtonCorrect) {
                    option.classList.add('correct');
                    option.classList.remove('hidden');

                } else if (isSelected && !isThisButtonCorrect) {
                    // option.classList.add('incorrect'); //Not needed to mark as red as well
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
                else if (!isSelected && !isThisButtonCorrect) {
                    option.classList.add('hidden');
                }
            });
        });

        const optionFrame = optionGroup.closest('.options-frame');
        if (groupCorrect) {
            optionFrame.classList.add('correct');
        }
        else {
            optionFrame.classList.add('incorrect');
        }
    }

    function resetButtons(nrOfIncorrect) {
        checkBtn.style.display = 'none';
        addOptionBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        nextBtn.style.display = 'flex';
    }

    function selectOption(event) {
        if (amReviewing) return;

        const selectedButton = event.target;
        // const isAlreadySelected = selectedButton.classList.contains('selected');

        // Toggle the "selected" class
        selectedButton.classList.toggle('selected');
    }
    function validateAnswerComplete(event){
        const selectedButton = event.target;
        // Get the parent options-frame of the selected button
        const optionsFrame = selectedButton.closest('.options-frame');

        // Get all option groups within the options-frame
        const optionGroups = optionsFrame.querySelectorAll('.option-group');

        // Flag to track if at least one option is selected in each group
        let isValid = true;

        // Iterate over each option group
        optionGroups.forEach(function (group) {
            
            // Check if parent options is maybe hidden (and thus this optionGroup as well)
            const parentOptions = group.closest('.options');
            const parentVisible = !parentOptions.classList.contains('hidden');
            // Get all selected options within the group
            const selectedOptions = group.querySelectorAll('.option.selected');
            const notDisabledButtons = group.querySelectorAll('.option:not([disabled])');

            // Check if at least one option is selected
            if (selectedOptions.length === 0 && parentVisible && notDisabledButtons.length>0) {
                isValid = false;
            }
        });

        if (isValid) {
            addOptionBtn.style.display = 'flex';
            checkBtn.classList.add('active');
            checkBtn.style.display = 'flex'; // Display the "Check" button
        }
        else {
            hideForIncompleteAnswer();
        }
    }

    function hideForIncompleteAnswer() {
        checkBtn.classList.remove('active');
        checkBtn.style.display = 'none';
        addOptionBtn.style.display = 'none';
    }

    
    checkBtn.addEventListener('click', checkAnswer);

    function populateMenuItemsWerkwoorden() {

        const miWords = document.getElementById("miWerkwoorden");
        const categories = [...new Set(questions.map(q => q.cat))];
        addCheckboxes(categories, miWords);

        // Flatten all answers into one array
        // const allAnswers = questions.flatMap(q => q.answers);

        const buttonsWijs = document.querySelector('.werkwoorden .option-group').querySelectorAll('button');
        var wijzen = [];
        // Loop through each button and extract its data-type value
        buttonsWijs.forEach(function (button) {
            var dataType = button.getAttribute('data-type');
            wijzen.push(dataType);
        });
        const miWijs = document.getElementById("miWijs");
        addCheckboxes(wijzen, miWijs);

        
        const buttonsTijd = document.querySelectorAll('.werkwoorden .option-group')[1].querySelectorAll('button');
        var tijden = [];
        buttonsTijd.forEach(function (button) {
            var dataType = button.getAttribute('data-type');
            tijden.push(dataType);
        });
        const miTijd = document.getElementById("miTijd");
        addCheckboxes(tijden, miTijd);

        const buttonsDias= document.querySelectorAll('.werkwoorden .option-group')[3].querySelectorAll('button');
        var dias = [];
        buttonsDias.forEach(function (button) {
            var dataType = button.getAttribute('data-type');
            dias.push(dataType);
        });
        const miDiathese = document.getElementById("miDiathese");
        addCheckboxes(dias, miDiathese);
        
        // Add change listener
        const checkboxes = document.getElementById("mySidenav").querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterWerkwoordQuestions);
        });

        // Filter questions function
        function filterWerkwoordQuestions() {
            NodeList.prototype.map = Array.prototype.map;
            const checkedValues = document.querySelectorAll('.miWW input[type="checkbox"]:checked').map(checkbox => checkbox.value); 

            const checkedWWs = document.querySelectorAll('#miWerkwoorden input[type="checkbox"]:checked').map(checkbox => checkbox.value); 
            
            var filteredQuestions = JSON.parse(JSON.stringify(questions));

            // Filter questions by checked cats
            filteredQuestions = filteredQuestions.filter(q => {
                return checkedWWs.includes(q.cat);
            });

            // Filter answer
            filteredQuestions = filteredQuestions.map(q => {
                q.answers = q.answers.filter(a => {
                    // Split answer
                    const parts = a.split(" ");

                    if (!checkedValues.includes(parts[0])
                        || !checkedValues.includes(parts[1])
                        || (!checkedValues.includes(parts[3]) )) return false;
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

    function populateMenuItemsNaamwoorden() {
        // Get reference to menu div
        const menuWords = document.getElementById("miNaamwoorden");
        const menuNaamval = document.getElementById("miNaamval");
        const menuCard = document.getElementById("miCard");

        // Flatten all answers into one array
        const allAnswers = questions.flatMap(q => q.answers);

        // Find all buttons under the first option-group under the first option class
        var buttons = document.querySelector('.naamwoorden .option-group').querySelectorAll('button');

        // Initialize an empty array to store data-type values
        var naamvallen = [];

        // Loop through each button and extract its data-type value
        buttons.forEach(function (button) {
            var dataType = button.getAttribute('data-type');
            naamvallen.push(dataType);
        });

        const cardinaliteit = [...new Set(
            allAnswers.map(a => a.split(" ")[1])
        )];

        // Get unique category values
        const categories = [...new Set(questions.map(q => q.cat))];
        addCheckboxes(categories, menuWords);
        addCheckboxes(naamvallen, menuNaamval);
        addCheckboxes(cardinaliteit, menuCard);

        // Get checkboxes inside menuWords
        const wordCB = menuWords.querySelectorAll('input[type="checkbox"]');
        const naamvalsCB = menuNaamval.querySelectorAll('input[type="checkbox"]');
        const cardinaliteitCB = menuCard.querySelectorAll('input[type="checkbox"]');

        // Add change listener
        const checkboxes = document.getElementById("mySidenav").querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterNaamwoordQuestions);
        });

        // Filter questions function
        function filterNaamwoordQuestions() {

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

    function addCheckboxes(list, div) {
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
        var emoticon = document.getElementById("emoticon")
        emoticon.innerHTML = emoticonHtml;

        if (score % 10 == 7) {
            emoticon.classList.add('rotate');

            // Remove the 'rotate' class after the animation completes
            setTimeout(function () {
                emoticon.classList.remove('rotate');
            }, 500); // Duration of the animation in milliseconds
        }
    }

});
