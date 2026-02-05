import { translateHtmlElements} from "./translate.js";
import { verbLoad, nounLoad, setQuestions, selectNextQuestion, setRepitionList, filterQuestions, setTigerMode, showResults } from './initgame.js';
import { qLatinVerb, qLatinNoun, qGreekVerb, qGreekNoun, qGreekAdjective, qLatinAdjectives, qLatinPronouns, qGreekPronouns } from "./questions.js";
import { checkAnswer, resetScore,testScoring } from './scoring.js';
import { validateAnswerComplete, extraFrame, resetFrames, removeLastFrame } from './logic.js';
import { setQuiz,applyFilterStateFromParameter} from './urls.js';

window.addEventListener('load', async function () {

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('q')) { 
        const qValue = urlParams.get('q');
        const fValue = urlParams.get('f');
        if (qValue=='a') handleLatinVerbsClick();
        else if (qValue=='b') handleLatinNounsClick();
        else if (qValue=='c') handleGreekVerbsClick();
        else if (qValue=='d') handleGreekNounsClick();
        else{
            window.location.href = 'index.html';
            return;
        }
        if (fValue){
            applyFilterStateFromParameter(fValue);
            filterQuestions();
        }
    }
    else{
        window.location.href = 'index.html';
        return;
    }

    //TODO: Remove before flight
    const testingMode = urlParams.get('mode');
    if (testingMode === 'test') {
        const testBtn = document.getElementById('testBtn');
        testBtn.style.display = "block";
        testBtn.addEventListener('click', () => {
            testScoring();
        });
         const qEricTest= [
            { "word": "mensae", "cat": "mensa", "answers": ["nom ev m"] },
          //  { "word": "1. ind praes 1e-ev act", "cat": "Eric", "answers": ["ind praes 1e-ev act"] },
         //   { "word": "2. ind praes 1e-ev act", "cat": "Eric", "answers": ["ind praes 1e-ev act"] },
         ];

        var greekOnlyButtons = document.querySelectorAll('.greekOnly');
        greekOnlyButtons.forEach(function (button) {
            button.parentNode.removeChild(button);
        });
        setQuestions(qEricTest);
        // nounLoad();
        nounLoad(qEricTest, []);
        //verbLoad();
       // translations = await loadTranslations("nl");
    }
    // END TODO


    addAllButtonListeners();
    addScoreOverviewListeners();

    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("mySidenav").style.display = "block";
    });

    const menu = document.getElementById('mySidenav');
    document.getElementById('closeMenu').addEventListener('click', () => {
       menu.style.width = "0px";
    });
    window.addEventListener('click', function(event) {
        const isHamburgerClicked = document.getElementById('hamburger').contains(event.target);
        const isClickedInsideMenu = menu.contains(event.target);
        if (menu.style.width="250px" && !isClickedInsideMenu  && !isHamburgerClicked){
            menu.style.width = "0px";
        }
    })
  
    const addOptionBtn = document.getElementById('addOptionBtn');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');

    addOptionBtn.addEventListener('click', extraFrame);
    nextBtn.addEventListener('click', selectNextQuestion);
    resetBtn.addEventListener('click', resetLastOption);
    checkBtn.addEventListener('click', checkAnswer);
  
});




function handleLatinVerbsClick() {
    var greekButtons = document.querySelectorAll('.greekOnly');
    greekButtons.forEach(function (button) {
      button.parentNode.removeChild(button);
    });
    setQuestions(qLatinVerb);
    verbLoad();
    setQuiz("a");
}

function handleLatinNounsClick(){
    nounLoad(qLatinNoun, qLatinAdjectives, qLatinPronouns);
    setQuiz("b");
}
function handleGreekVerbsClick(){
    var latinButtons = document.querySelectorAll('.latinOnly');
    latinButtons.forEach(function (button) {
        button.parentNode.removeChild(button);
    });
    setQuestions(qGreekVerb);
    verbLoad();
    setQuiz("c");
}
function handleGreekNounsClick(){
    // Find all buttons with class Latin and remove them from the DOM
    var latinButtons = document.querySelectorAll('.latinOnly');
    latinButtons.forEach(function (button) {
        button.parentNode.removeChild(button);
    });
    nounLoad(qGreekNoun, qGreekAdjective, qGreekPronouns);
    setQuiz("d");
}


export function addAllButtonListeners(){
    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', quizButtonSelected);
    });
}
export function quizButtonSelected(button, skipSelect=false){
    if (amReviewing) return;

    if (button.target){
        button = button.target;
    }
    //ER: Order is important!
    if (!skipSelect){
        button.classList.toggle('selected');
    }
    const dt = button.getAttribute('data-type');
    if(dt=="ptc"){
        ptcClicked(button);
    }
    const isVerMoodButton = button.parentElement.matches('.werkwoorden .option-group:nth-child(1)');
    if (isVerMoodButton){
        wijsClicked(button);
    }
    validateAnswerComplete(button);
}


function addScoreOverviewListeners(){
    const slidingWindow = document.getElementById('slidingWindow');
    const container = document.querySelector('.container');

    document.getElementById('seeResultsBtn').addEventListener('click', () => {
        document.getElementById('swContainer').style.display = "block";

        let menuWidth = slidingWindow.offsetWidth;
        const screenWidth = window.innerWidth;
        let rightPosition = (screenWidth - menuWidth) / 2;
        slidingWindow.style.right = rightPosition + 'px';
        container.style.pointerEvents = 'none'; // Disable clicks on the underlying content
        //Remove hamburger, emotions and potentially opened menu.  
        document.getElementById('header').style.visibility="hidden";
        document.getElementById("mySidenav").style.width = "0px"; 

        showResults();
        resetScore();
        
    }); 

    function closeSlidingWindow(){
        slidingWindow.style.right = '-100%';
        container.style.pointerEvents = 'auto'; // Enable clicks on the underlying content
        document.getElementById('header').style.visibility="visible";
        document.getElementById('seeResultsBtn').style.display="none";
    }

    document.getElementById('onlyRepListButton').addEventListener('click', () => {
        closeSlidingWindow();
        setRepitionList();
    });

    document.getElementById('newSelectionButton').addEventListener('click', () => {
        closeSlidingWindow();
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("mySidenav").style.display = "block";
        filterQuestions();
    });

    document.getElementById('everythingAgainButton').addEventListener('click', () => {
        closeSlidingWindow();
        filterQuestions();
    });
    document.getElementById('tigerModesButton').addEventListener('click', () => {
        closeSlidingWindow();
        setTigerMode();
    });
    

}

function ptcClicked(clickedButton){
    const optionsFrameDiv = clickedButton.closest('.options-frame');
    var naamwoordBlock = optionsFrameDiv.querySelector('.naamwoorden');
    if (clickedButton.classList.contains('selected')) {
        naamwoordBlock.classList.remove('hidden');
        //Independant of filter settings, let's enable all options under naamwoord now
        naamwoordBlock.querySelectorAll('button').forEach(function (button) {
            button.classList.remove('filter');
        });
    }
    else{
        naamwoordBlock.classList.add('hidden');
        const allNaamwoordButtons = naamwoordBlock.querySelectorAll('button');
        allNaamwoordButtons.forEach(function (button) {
            button.classList.remove('selected');
        });

    }
}

function wijsClicked(clickedButton){
    
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

function resetLastOption(){
    document.querySelectorAll('.hideOnReset').forEach(button => {
        button.classList.add('hidden');
    });
    checkBtn.classList.add('active');
    checkBtn.style.display = 'flex'; 
    
    addOptionBtn.style.display = 'block';
    removeLastFrame();

    document.querySelectorAll('.option').forEach(button => {
        if (button.classList.contains('selected')) {
            quizButtonSelected(button, true);
        }
    });
    return;
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
        const hasNoEnabledButtons  = group.querySelectorAll('.option:not([disabled])').length==0;
        const hasNoVisibleButtons = group.querySelectorAll('.option:not(.hidden)').length==0;

        if (hasNoEnabledButtons || hasNoVisibleButtons){
            selectedOptions.push(['x']);
        }
        else if (parentVisible){
            selectedOptions.push(groupSelectedOptions);
        }
    });

    return selectedOptions;
}
//ER: Keep at bottom to make sure on Safari where the functions aren't hoisted the reference doesn't fail.
translateHtmlElements();