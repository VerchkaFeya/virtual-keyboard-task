import { keysDataEn } from "./KeysDataEn.js";
import { keysDataRu } from "./KeysDataRu.js";
import { functiionalKeys } from "./FunctionalKeys.js";
import { arrowKeys } from "./FunctionalKeys.js";

const body = document.querySelector("body");

let lang = "en";
let capsLock = false;
let shift = false;

const generateTextArea = () => {
  const title = document.createElement("h1");
  title.classList.add("title");
  title.innerHTML = "Virtual keyboard";

  const textField = document.createElement("div");
  textField.classList.add("text-field");

  const changeLang = document.createElement("p");
  changeLang.classList.add("text-field__change-lang");
  if (lang === "en") {
    changeLang.innerHTML = "Press <span>Shift+Alt</span> to change language. \nTask created in Windows OS";
  } else {
    changeLang.innerHTML = "Нажмите <span>Shift+Alt</span> для смены языка. \nТаск выполнен в ОС Windows";
  }
  const textArea = document.createElement("textarea");
  textArea.classList.add("text-field__textarea");
  textArea.setAttribute("autofocus", "autofocus");
  textField.appendChild(changeLang);
  textField.appendChild(textArea);
  body.appendChild(title);
  body.appendChild(textField);
};

const generateKeyboardArea = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  body.append(keyboard);

  const keyboardContainer = document.createElement("div");
  keyboardContainer.classList.add("keyboard__keys-container");
  keyboard.append(keyboardContainer);
};

// generate title and text area and keyboard area
generateTextArea();
generateKeyboardArea();
class Key {
  constructor(x) {
    this.value = x.value;
    this.code = x.code;
    this.shifted = x.shifted;
    this.doubled = x.doubled;
  }

  create() {
    let key = document.createElement("div");
    key.classList.add("key");
    key.dataset.code = `${this.code}`;
    key.dataset.shifted = `${this.shifted}`;
    key.dataset.value = `${this.value}`;

    key.innerHTML = `${this.value}`;

    if (functiionalKeys.includes(`${this.code}`)) {
      key.classList.add("func-key");
    }

    if (arrowKeys.includes(`${this.code}`)) {
      key.classList.add("arrow-key");
    }

    return key;
  }
}

const generateRows = (container) => {
  let i = 1;
  while (i <= 5) {
    let row = document.createElement("div");
    row.classList.add("keyboard__row", `row${i}`);
    container.appendChild(row);
    i += 1;
  }
};

const generateKeys = (keysData, rows) => {
  // add keys for keyboard
  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      let key = new Key(keysData[i][j]).create();
      rows[i].appendChild(key);
    }
  }
};

// create rows for keyboard and keys
const keyboardContainer = document.querySelector(".keyboard__keys-container");
generateRows(keyboardContainer);
let rows = document.querySelectorAll(".keyboard__row");

// генерация клавиш в зависимости от языка
if (lang === "en") {
  generateKeys(keysDataEn, rows);
} else {
  generateKeys(keysDataRu, rows);
}