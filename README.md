# itl - A simple JavasSript library for phrases translation

Note that it works with [itl-server](https://github.com/hieunc229/itl-server)

## 1. Installation

First, you will need to prepare a translation spreadsheet and setup `itl-server`. (Tutorial will be updated)

### 1.1. Install itl library

```js
// using NPM
npm install itl --save

// or Yarn
yarn add itl
```

### 1.2. Create config file

Best to leave it in the root or `src` folder of your app

```js
// ./i8.config.js
import GoGlobal from "itl";
const i8 = new GoGlobal({
    endPoint: "(your itl-server enpoint)",
    defaultLanguage: "en", // the language is used in the app
    selectedLanguage: "fr", // optional, if a different language is set while using the app, it will ignore this option
})

// To print out a list of not-translated phrases, added this line
// Then from the browser console, run printNotTranslatedList
window.printNotTranslatedList = itl.getUnlisted

export default i8;
```

## 2. How to use it?

From here, everytime you need to translate a phrase, you will load `i8` from the `i8.config.js` file created above.

### 2.1. Syntax
```js
i8.text(
    phrase: string, 
    options?: { 
        data?: { [variable]: string: string | number }, 
        case?: "upper" | "lower" | "capital" | "title" // "capital" by default
    }
)

// or use a shorter form "i8.t"
```


### 2.2. Examples

```js
import i8 from "./i8.config.js";

// Set a reference language, load from server if it doesn't find in the cache storage
await i8.setLanguage("fr");

i8.text("Hello"); // => Salut
i8.text("Hello, __name__!", { data: { name: "Tiffany" } }); // => Bonjour, Tiffany!
```
