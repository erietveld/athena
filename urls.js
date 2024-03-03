

// Initial state when the page loads
const initialState = { page: "menu" };

// Handle the popstate event
function handlePopstate(event) {
  const state = event.state;

  if (state && state.page === "menu") {
    // Show the main menu
    showMainMenu();
  } else if (state && state.page === "quiz") {
    // Show the quiz
    showQuiz();
  }
}
function showMainMenu(){
    history.pushState({ page: "menu" }, "Main Menu", "#menu");
}

export function setFilterURL(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    let binaryString = checkboxes.map(filter => filter.checked ? '1' : '0').join('');
    let fargs =  "f=" + encodeBinaryString(binaryString);
    let qargs = "q=A";
    const newURL = window.location.pathname +"?" + qargs + "&" + fargs;
    const currentState = { };
    
   // window.history.replaceState(currentState, '', newURL);

}
function applyFilterStateFromParameter(binaryString) {
    // Decompress the compressed string to get the binary representation
    // const binaryString = decompressString(filterStateString);

    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    // Apply the filter selection based on the binary string representation
    for (let i = 0; i < binaryString.length; i++) {
      const filter = filters[i]; // Assuming `filters` is an array of filter checkboxes
      filter.checked = binaryString[i] === '1';
    }
  }

let quizId;
function setQuizId(){
//A: Greek verbs
//B: Greek nouns
//C: Latin verbs
//D: Latin nouns

}

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';   
function encodeBinaryString(binaryString) {
    let encodedString = '';
  
    // Pad the binary string with leading zeros to ensure it can be divided into groups of 6 bits
    const paddedBinaryString = binaryString.padEnd(Math.ceil(binaryString.length / 6) * 6, '0');
  
    // Convert each group of 6 bits into an index and use the index to retrieve the corresponding character from the base64Chars
    for (let i = 0; i < paddedBinaryString.length; i += 6) {
      const binaryGroup = paddedBinaryString.substr(i, 6);
      const index = parseInt(binaryGroup, 2);
      encodedString += base64Chars[index];
    }
  
    return encodedString;
  }
  function decodeBinaryString(encodedString) {
    let binaryString = '';
  
    // Convert each character in the encoded string to its corresponding 6-bit binary representation
    for (let i = 0; i < encodedString.length; i++) {
      const char = encodedString[i];
      const index = base64Chars.indexOf(char);
      const binaryGroup = index.toString(2).padStart(6, '0');
      binaryString += binaryGroup;
    }
  
    return binaryString;
  }

  // Add event listener for popstate
window.addEventListener("popstate", handlePopstate);