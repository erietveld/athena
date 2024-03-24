let translations = {};


function getUserLanguage() {
    // return "nl";
    // Get the user's preferred language
    let language = navigator.language || navigator.userLanguage;
    // Remove the region specifier (if present)
    language = language.split('-')[0];
    return language;
}

export function translate(key, ...params) {
    // Retrieve the translation based on the key
    const translation = translations[key] || key;
  
    // Replace placeholders in the translation with dynamic parameters
    let translatedText = translation.replace(/{(\d+)}/g, (match, index) => {
      const paramIndex = parseInt(index, 10);
      return params[paramIndex];
    });
  
    return translatedText;
  }

async function loadTranslations(language) {
    try {
        const response = await fetch(`./translations/${language}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${language}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return {};
    }
}


export function translateHtmlElements() {
    const userLanguage = getUserLanguage();
    //translations = loadTranslations(userLanguage);
    loadTranslations(userLanguage).then(t =>{
        translations = t;
        if (getUserLanguage() != "nl") {
            document.querySelectorAll('[data-translate]').forEach(async element => {
                const translationKey = element.dataset.translate;
                const translatedText = translate(translationKey);
                element.textContent = translatedText;
            });
        }
        document.querySelectorAll('.column').forEach(async element => {
            element.style.display = "block";
        });
    }

    )


}