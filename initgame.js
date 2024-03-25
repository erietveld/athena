import { reset} from "./main.js";
import {setFilterURL} from "./urls.js";
import {translate} from "./translate.js";
import {preSelectSingleOptions} from "./logic.js";

var questions;
var qbank; // All currently filtered questions

const wordElement = document.getElementById('word');
export function setRepitionList(){
    qbank = repList;
    repList = [];
    selectieCount = qbank.length;
    selectNextQuestion();
}
export function setQuestions(qs){
    questions = qs;
}

export function setTigerMode(){
    trainingMode = "Tiger";
    setRepitionList();
}
export function getRepCount(){
    return repList.length;
}

export function verbLoad(){
    var naamwoordBlock = document.querySelectorAll('.naamwoorden');
    naamwoordBlock.forEach(function (naamwoordBlock) {
        naamwoordBlock.classList.add('hidden', 'hideOnReset');
    })
    loadMainQuiz();
    populateMenuItemsWerkwoorden();
    updateWordCount();        
}
export function nounLoad(nouns, adjs){

    const part1 = nouns.map(obj => {
        if (obj.cat !== "lidwoord") {
          return { ...obj, menu: "noun" };
        }
        return obj;
      });

    const part2 = adjs.map(obj => ({
        ...obj,
        "menu": "adj"
      }));
    questions = part1.concat(part2);

    var naamwoordBlock = document.querySelectorAll('.werkwoorden');
    naamwoordBlock.forEach(function (button) {
        button.parentNode.removeChild(button);
    })
    
    loadMainQuiz();
    populateMenuItemsNaamwoorden();
    updateWordCount();
}

function loadMainQuiz() {
    document.getElementById('mySidenav').classList.add('show');
    document.getElementById('header').style.display = 'flex';
    document.querySelector('.container').style.display = 'block';
    document.getElementById('mainmenu').style.display = 'none';
    document.body.style.display = 'block';
    questions = removeDuplicates(questions);
    
    qbank = questions;
    
    selectNextQuestion();
    NodeList.prototype.map = Array.prototype.map;
}

function removeDuplicates(array) {
    const result = [];
    const map = new Map();
    
    // Itereer over elk object in de array
    array.forEach(obj => {
      // Controleer of het woord al voorkomt in de map
      if (map.has(obj.word)) {
        // Voeg de antwoorden toe aan het bestaande woord in de map
        const existing = map.get(obj.word);
        existing.answers.push(...obj.answers);
      } else {
        // Voeg het nieuwe woord toe aan de map
        map.set(obj.word, { ...obj });
        result.push(obj);
      }
    });
    
    return result;
  }

function populateMenuItemsWerkwoorden() {

    const miWords = document.getElementById("miWerkwoorden");
    const categories = [...new Set(questions.map(q => q.cat))];
    addCheckboxes(categories, miWords);

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
        checkbox.addEventListener('change', filterQuestions);
    });

   
}
 // Filter questions function
 export function filterQuestions() { 
    repList = [];
    const checkedValues = document.querySelectorAll('.miFilter input[type="checkbox"]:checked').map(checkbox => checkbox.value); 
    const checkedForms = document.querySelectorAll('.miForms input[type="checkbox"]:checked').map(checkbox => checkbox.value); 
    
    var filteredQuestions = JSON.parse(JSON.stringify(questions));

    // Filter questions by checked cats
    filteredQuestions = filteredQuestions.filter(q => {
        return checkedForms.includes(q.cat);
    });

    // Filter answer
    filteredQuestions = filteredQuestions.map(q => {
        q.answers = q.answers.filter(a => {

            const parts = a.split(" ");
            if (!checkedValues.includes(parts[0])) return false;
            if (!checkedValues.includes(parts[1])) return false;
            if (parts.length>3)
            {
                if (!checkedValues.includes(parts[3])) return false;
            }
            return true;
        });

        // Remove question if no answers
        if (q.answers.length === 0) return null;
        return q;

    });

    // Filter out null values
    filteredQuestions = filteredQuestions.filter(q => q);
    qbank = filteredQuestions;
    updateWordCount(true);

    // Select all option classes under the werkwoorden div, excluding the third option-group
    var dynamicButtons = document.querySelectorAll('.options > .option-group:not(:nth-child(3)) .option');
    dynamicButtons.forEach(function(button){
        if (checkedValues.includes(button.getAttribute("data-type"))) {
            button.classList.remove('filter');
        }
        else{
            button.classList.add('filter');
        }
    }
    );
    selectNextQuestion();
}


function populateMenuItemsNaamwoorden() {
    const buttonsCards = document.querySelectorAll('.naamwoorden .option-group')[1].querySelectorAll('button');
    var cardinaliteit = [];
    buttonsCards.forEach(function (button) {
        let key = button.getAttribute('data-type');
        let val = button.textContent;
        cardinaliteit.push({key, val});
    });
    const menuCard = document.getElementById("miCard");
    addCheckboxes(cardinaliteit, menuCard);

    const buttonsNaamvallen = document.querySelector('.naamwoorden .option-group').querySelectorAll('button');
    var naamvallen = [];
    buttonsNaamvallen.forEach(function (button) {
        let key = button.getAttribute('data-type');
        let val = button.textContent;
        naamvallen.push({key, val});
    });
    const menuNaamval = document.getElementById("miNaamval");
    addCheckboxes(naamvallen, menuNaamval);

    const uncats = [...new Set(questions.filter(q => !q.menu).map(q => q.cat))];
    const translatedUnats = uncats.map(key => ({ key, val: translate(key) }));
    const catNouns = [...new Set(questions.filter(q => q.menu=="noun").map(q => q.cat))];
    const catAdjs = [...new Set(questions.filter(q => q.menu=="adj").map(q => q.cat))];

    const menuNominals = document.getElementById("miNominals");
    const menuNouns = document.getElementById("miNouns");
    const menuAdjectives = document.getElementById("miAdjectives");
    
    addCheckboxes(translatedUnats, menuNominals);
    addCheckboxes(catNouns, menuNouns);
    addCheckboxes(catAdjs, menuAdjectives);

    // Add change listener
    const checkboxes = document.getElementById("mySidenav").querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterQuestions);
    });
}


let selectieCount;
//ER: Only call this function initially and when filters are changing
function updateWordCount(setURL){
    selectieCount = qbank.length;
    if (setURL) setFilterURL();
    document.getElementById('wordCount').innerHTML = qbank.length + " " + translate("FormsSelected");
    trainingMode = "OneTime";
}



export var question;
export function selectNextQuestion() {
    if (qbank.length == 0) {
        wordElement.textContent = translate("NoQuestionsFound");
     //   "Geen vragen gevonden, maak een keuze uit het menu."
        return;
    }

    const randomIndex = Math.floor(Math.random() * qbank.length);
    question = qbank[randomIndex];
    wordElement.textContent = question.word;
    reset();
    preSelectSingleOptions();
}

export function prepNextQuestionBank(){
    if (trainingMode=="OneTime"){
        qbank = qbank.filter(item => item!=question);
        if (question.wronglyAnswered > 0){
            repList.push(question);
        }
    }
    else if (trainingMode=='Tiger'){
        if (question.wronglyAnswered==0){
            qbank = qbank.filter(item => item!=question);
        }
    }
    if (qbank.length==0){
        return false;
    }
    return true;
}

export function showResults(){

    var goodCount = selectieCount - repList.length;
    var resText = translate("scoreMessage", goodCount, selectieCount);
  
    document.getElementById('resultsMessage').innerHTML = resText;
    if (goodCount == selectieCount){
      document.getElementById('onlyRepListButton').style.display = "none";
      document.getElementById('tigerModesButton').style.display = "none";
    }
    else{
      document.getElementById('onlyRepListButton').style.display = "inline";
      document.getElementById('tigerModesButton').style.display = "inline";
    }

  }

var repList = [];
var trainingMode = "OneTime";

function addCheckboxes(list, div) {
    // Loop through categories and add checkbox for each
    list.forEach(item => {
        let key, val;
        if (typeof item === 'object') {
          key = item.key;
          val = item.val;
        } else {
          key = item;
          val = item;
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = key;
        checkbox.id = key;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.htmlFor = key;

        const labelText = document.createTextNode(val);
        label.appendChild(checkbox);
        label.appendChild(labelText);

        div.appendChild(label);
        div.appendChild(document.createElement("br"));
    });
}
