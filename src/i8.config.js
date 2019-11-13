// ./i8.config.js
import itl from "itl";
const i8 = new itl({
    endPoint: "http://localhost:8080/languages",
    defaultLanguage: "en", // the language is used in the app
    selectedLanguage: "fr", // optional, if a different language is set while using the app, it will ignore this option
})

i8.setLanguage("fr")

// To print out a list of not-translated phrases, added this line
// Then from the browser console, run printNotTranslatedList
window.printNotTranslatedList = itl.getUnlisted

export default i8;