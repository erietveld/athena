import { getSelectedOptions, addAllButtonListeners } from "./main.js";

function hideForIncompleteAnswer() {
    checkBtn.classList.remove('active');
    checkBtn.style.display = 'none';
    addOptionBtn.style.display = 'none';
}

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

export function expandPermutations() {

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
        const optionGroups = oneFrame.querySelectorAll('.option-group');

        optionGroups.forEach(group => {
            const hasEnabledButtons = group.querySelectorAll('.option:not([disabled])').length > 0;
            if (!hasEnabledButtons){
                group.querySelectorAll('.option').forEach((button) =>
                {
                  button.classList.add('hidden');
                });
            }
            else{
                
                group.closest('.options').classList.remove('hidden');
            }
            return hasEnabledButtons;
        });

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

export function extraFrame() {
    expandPermutations();
    var currentFrame = document.getElementById('groupFrame' + currentFrameId);
    var nextFrame = addFrame(true);

    resetBtn.style.display = 'flex';

    var unselectedButtons = currentFrame.querySelectorAll('.option:not(.selected):not(.incorrect):not(.correct):not(.missed)');
    // Add 'hidden' class to unselected buttons
    unselectedButtons.forEach((button) => {
        button.classList.add('hidden');
    });

    hideForIncompleteAnswer();
    return nextFrame;
};
var currentFrameId = 0;
// Function to remove all extra frames except for the first one
export function resetFrames() {
    var extraFrames = document.querySelectorAll('.options-frame:not(#groupFrame0)');
    extraFrames.forEach(function (frame) {
        frame.remove();
    });
    currentFrameId = 0;
}
export function removeLastFrame() {
    document.getElementById('groupFrame' + currentFrameId).remove();
    currentFrameId--;

    const lastOptionFrame = document.getElementById('groupFrame' + currentFrameId);
    lastOptionFrame.querySelectorAll('.option').forEach(button => {
        // const isFiltered = button.classList.contains('filter');
        button.classList.remove("hidden");
    });
    if(currentFrameId==0){
        document.getElementById('resetBtn').style.display = 'none';
    }
}

function addFrame(isEditable) {
    currentFrameId++;
    var container = document.getElementById('groups');
    var frameClone = document.getElementById('groupFrame0').cloneNode(true);
    frameClone.id = 'groupFrame' + currentFrameId;
    var allButtons = frameClone.querySelectorAll('.option');
    allButtons.forEach(button => {
        if (button.disabled){
            button.disabled = false;
        }
        if (button.classList.contains('filter')){
            button.className = 'option filter';
        }
        else{
        button.className = 'option';
        }
    });


    frameClone.querySelectorAll('.hideOnReset').forEach(button => {
        button.classList.add('hidden');
    })

    container.appendChild(frameClone);
    addAllButtonListeners();
    return frameClone;
}


export function validateAnswerComplete(button){
    //const selectedButton = event.target;
    // Get the parent options-frame of the selected button
    const optionsFrame = button.closest('.options-frame');

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
