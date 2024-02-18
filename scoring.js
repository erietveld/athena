import { setReviewing, getSelectedOptions } from "./main.js";
import { correctAnswers } from "./initgame.js";
import { expandPermutations, extraFrame } from "./logic.js";

let score = -1;

function markAnswers() {
    var ans = [];
    var groups = [];
    var answerOrder = [];
    var i = 0;
    var frame;
    while (frame = document.getElementById(`groupFrame${i}`)) {
        groups.push(frame);
        // Initialize the answerOrder array with -1 to indicate an unanswered question
        ans.push(getSelectedOptions(frame));
        answerOrder.push(-1);
        i++;
    }

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

export function checkAnswer() {
    setReviewing();

    // const currentWord = wordElement.textContent;
    // const correctAnswers = qbank.find(question => question.word === currentWord)?.answers;
    expandPermutations();

    markAnswers();

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
function resetButtons(nrOfIncorrect) {
    checkBtn.style.display = 'none';
    addOptionBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    nextBtn.style.display = 'flex';
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
                option.closest('.options').classList.remove('hidden');
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


const baseEmoticonCode = 127872;
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
        codedEmoticon = baseEmoticonCode + (emoticonIndex - emoticons.length);
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
