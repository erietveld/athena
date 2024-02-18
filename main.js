import { qLatinVerb, qLatinNoun, qGreekVerb, qGreekNoun } from './questions.js';
import { checkAnswer} from './scoring.js';
import { verbLoad, nounLoad, setQuestions, showQuestion } from './initgame.js';
import { validateAnswerComplete, extraFrame, resetFrames } from './logic.js';

document.addEventListener('DOMContentLoaded', function () {
    const addOptionBtn = document.getElementById('addOptionBtn');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');

    addMainMenuListeners();
    addAllButtonListeners();
  
    //TODO: Remove before flight
    if (false) {
        var grieksButtons = document.querySelectorAll('.grieks');
        grieksButtons.forEach(function (button) {
            button.parentNode.removeChild(button);
        });
        setQuestions(qLatinVerb);
        verbLoad();
    }
    // END TODO


    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("mySidenav").style.display = "block";
    });

    document.getElementById('closeMenu').addEventListener('click', () => {
        document.getElementById("mySidenav").style.width = "0px";
    });

    addOptionBtn.addEventListener('click', extraFrame);
    nextBtn.addEventListener('click', showQuestion);
    resetBtn.addEventListener('click', reset);
    checkBtn.addEventListener('click', checkAnswer);

});

function addMainMenuListeners() {
    document.getElementById('LatijnWerkwoord').addEventListener('click', () => {
        var grieksButtons = document.querySelectorAll('.grieks');
        grieksButtons.forEach(function (button) {
            button.parentNode.removeChild(button);
        });
        setQuestions(qLatinVerb);
        verbLoad();
    });
    document.getElementById('LatijnNaamwoord').addEventListener('click', () => {
        setQuestions(qLatinNoun);
        nounLoad();
    });
    document.getElementById('GrieksWerkwoord').addEventListener('click', () => {
        setQuestions(qGreekVerb);
        verbLoad();
    });
    document.getElementById('GrieksNaamwoord').addEventListener('click', () => {
        // Find all buttons with class Latin and remove them from the DOM
        var latinButtons = document.querySelectorAll('.latijn');
        latinButtons.forEach(function (button) {
            button.parentNode.removeChild(button);
        });
        setQuestions(qGreekNoun);
        nounLoad();
    });
}

export function addAllButtonListeners(){
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


var amReviewing = false;
export function setReviewing(){
    amReviewing = true;
}

function selectOption(event) {
    if (amReviewing) return;
    const selectedButton = event.target;
    selectedButton.classList.toggle('selected');
}

export function reset() {
    amReviewing = false;
    resetFrames();
    document.querySelectorAll('.hideOnReset').forEach(button => {
        button.classList.add('hidden');
    })
    document.querySelectorAll('.option').forEach(button => {
        if (button.classList.contains('filter')){
            button.className = 'option filter';
        }
        else{
        button.className = 'option';
        }
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

// Function to get selected options from each option group
export function getSelectedOptions(currentFrame) {
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
        if (!hasEnabledButtons){
            selectedOptions.push(['x']);
        }
    });

    return selectedOptions;
}