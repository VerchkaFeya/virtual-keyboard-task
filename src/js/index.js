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

const textArea = document.querySelector("textarea");

// функция ищет и меняет всо содержимое клавиш на большие буквы и значения с шифтом
const changeToUpperCase = () => {
  document.querySelectorAll(".key").forEach(item => {
    if (!item.classList.contains("arrow-key") && !item.classList.contains("func-key") && item.dataset.shifted !== "null") {
      let key = item;
      key.innerHTML = key.dataset.shifted;
    }
  });
};

// функция ищет и  меняет все содержимое клавиш на маленькие буквы и значения без шифта
const changeToLowerCase = () => {
  document.querySelectorAll(".key").forEach(item => {
    if (!item.classList.contains("arrow-key") && !item.classList.contains("func-key") && item.dataset.shifted !== "null") {
      let key = item;
      key.innerHTML = key.dataset.value;
    }
  });
};

// функция ищет и меняет содержимое ТОЛЬКО буквенных клавиш на большие
const changeToUpperCaseCapsLock = () => {
  document.querySelectorAll(".key").forEach(item => {
    let code = item.dataset.code;
    if (code.indexOf("Key") !== -1) {
      let key = item;
      key.innerHTML = key.innerHTML.toLocaleUpperCase();
    }
  });
};

// функция вставляет значение клавиши в место где стоит курсор (не касается backspace, del, arrows)
const insertKeyValue = (node, insertValue) => {
  let text = node.value;
  let cursor = node.selectionStart;
  let chunk1 = text.slice(0, cursor);
  let chunk2 = text.slice(cursor);
  chunk1 += insertValue;
  text = chunk1 + chunk2;
  node.value = text;
  node.selectionStart = cursor + insertValue.length;
  node.selectionEnd = cursor + insertValue.length;
};

const insertDeleteValue = (node) => {
  let text = node.value;
  let cursor = node.selectionStart;
  let chunk1 = text.slice(0, cursor);
  let chunk2 = text.slice(cursor + 1);
  text = chunk1 + chunk2;
  textArea.value = text;
  textArea.selectionStart = cursor;
  textArea.selectionEnd = cursor;
};

const insertBackspaceValue = (node) => {
  let text = node.value;
  let cursor = node.selectionStart;
  let endCursor = node.selectionEnd;
  if (cursor === endCursor) {
    let chunk1 = text.slice(0, cursor - 1);
    let chunk2 = text.slice(cursor);
    text = chunk1 + chunk2;
    node.value = text;
    node.selectionStart = cursor - 1;
    node.selectionEnd = cursor - 1;
  }
};

const insertKeyValueOnClick = (e) => {
  let key = e.target;
  if (key.classList.contains("key")) {
    textArea.focus();
    if (key.dataset.code.indexOf("Key") !== -1) {
      console.log("letter clicked!");
      if (capsLock && !shift) {
        insertKeyValue(textArea, `${key.dataset.shifted}`);
      } else if (capsLock && shift) {
        insertKeyValue(textArea, `${key.dataset.value}`);
      } else if (!capsLock && shift) {
        insertKeyValue(textArea, `${key.dataset.shifted}`);
      } else if (!capsLock && !shift) {
        insertKeyValue(textArea, `${key.dataset.value}`);
      }
    }
    if (!functiionalKeys.includes(key.dataset.code) && !arrowKeys.includes(key.dataset.code) && key.dataset.code.indexOf("Key") === -1) {
      console.log("double value keys clicked!");
      if (capsLock && !shift) {
        insertKeyValue(textArea, `${key.dataset.value}`);
      } else if (capsLock && shift) {
        insertKeyValue(textArea, `${key.dataset.shifted}`);
      } else if (!capsLock && shift) {
        insertKeyValue(textArea, `${key.dataset.shifted}`);
      } else if (!capsLock && !shift) {
        insertKeyValue(textArea, `${key.dataset.value}`);
      }
    }
    if (arrowKeys.includes(key.dataset.code)) {
      console.log("arrow cliked");
      let cursor = textArea.selectionStart;
      if (key.dataset.code === "ArrowLeft") {
        textArea.selectionStart = cursor - 1;
        textArea.selectionEnd = cursor - 1;
      } else if (key.dataset.code === "ArrowRight") {
        textArea.selectionStart = cursor + 1;
        textArea.selectionEnd = cursor + 1;
      } else if (key.dataset.code === "ArrowUp") {
        insertKeyValue(textArea, "↑");
      } else if (key.dataset.code === "ArrowDown") {
        insertKeyValue(textArea, "↓");
      }
    }
    if (key.dataset.code === "Tab") {
      insertKeyValue(textArea, "    ");
    }
    if (key.dataset.code === "Delete") {
      insertDeleteValue(textArea);
    }
    if (key.dataset.code === "Backspace") {
      insertBackspaceValue(textArea);
    }
    if (key.dataset.code === "Space") {
      insertKeyValue(textArea, " ");
    }
    if (key.dataset.code === "Enter") {
      insertKeyValue(textArea, "\n");
    }
    if (key.dataset.code === "CapsLock") {
      console.log("CAPS cliked");
      if (capsLock) {
        capsLock = false;
        key.classList.remove("pressed");
        changeToLowerCase();
      } else {
        capsLock = true;
        key.classList.add("pressed");
        changeToUpperCaseCapsLock();
      }
    }
  }
};

// вставка символов при зажатии клавиш
window.addEventListener("keydown", (e) => {
  // console.log(`Key down: ${e.code} and ${e.key}`);
  textArea.focus();
  document.querySelector(`.key[data-code="${e.code}"]`).classList.add("pressed");
  e.preventDefault();

  if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
    shift = true;
    changeToUpperCase();
  }
});

// вставка символов при отжатии клавиш
window.addEventListener("keyup", (e) => {
  if (e.code !== "CapsLock") {
    document.querySelector(`.key[data-code="${e.code}"]`).classList.remove("pressed");
  }
  if (e.code === "CapsLock" && capsLock === false) {
    capsLock = true;
    changeToUpperCaseCapsLock();
  } else if (e.code === "CapsLock" && capsLock === true) {
    capsLock = false;
    changeToLowerCase();
    document.querySelector(`.key[data-code="${e.code}"]`).classList.remove("pressed");
  }
  if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
    shift = false;
    changeToLowerCase();
  }

  if (e.code.indexOf("Key") !== -1) {
    let key = document.querySelector(`.key[data-code="${e.code}"]`);
    if (capsLock && !shift) {
      console.log("caps pressed and shift unpressed");
      insertKeyValue(textArea, `${key.dataset.shifted}`);
    } else if (capsLock && shift) {
      insertKeyValue(textArea, `${key.dataset.value}`);
      console.log("caps pressed and shift pressed");
    } else if (!capsLock && shift) {
      console.log("caps unpressed and shift pressed");
      insertKeyValue(textArea, `${key.dataset.shifted}`);
    } else if (!capsLock && !shift) {
      console.log("caps unpressed and shift unpressed");
      insertKeyValue(textArea, `${key.dataset.value}`);
    }
  }

  if (!functiionalKeys.includes(e.code) && !arrowKeys.includes(e.code) && e.code.indexOf("Key") === -1) {
    let key = document.querySelector(`.key[data-code="${e.code}"]`);
    if (capsLock && !shift) {
      console.log("caps pressed and shift unpressed");
      insertKeyValue(textArea, `${key.dataset.value}`);
    } else if (capsLock && shift) {
      insertKeyValue(textArea, `${key.dataset.shifted}`);
      console.log("caps pressed and shift pressed");
    } else if (!capsLock && shift) {
      console.log("caps unpressed and shift pressed");
      insertKeyValue(textArea, `${key.dataset.shifted}`);
    } else if (!capsLock && !shift) {
      console.log("caps unpressed and shift unpressed");
      insertKeyValue(textArea, `${key.dataset.value}`);
    }
  }

  if (e.code === "Tab") {
    insertKeyValue(textArea, "    ");
  }
  if (e.code === "Delete") {
    insertDeleteValue(textArea);
  }
  if (e.code === "Backspace") {
    insertBackspaceValue(textArea);
  }
  if (e.code === "Enter") {
    insertKeyValue(textArea, "\n");
  }
  if (e.code === "Space") {
    insertKeyValue(textArea, " ");
  }
  if (e.code.indexOf("Arrow") !== -1) {
    let cursor = textArea.selectionStart;
    if (e.code === "ArrowLeft") {
      textArea.selectionStart = cursor - 1;
      textArea.selectionEnd = cursor - 1;
    } else if (e.code === "ArrowRight") {
      textArea.selectionStart = cursor + 1;
      textArea.selectionEnd = cursor + 1;
    } else if (e.code === "ArrowUp") {
      insertKeyValue(textArea, "↑");
    } else if (e.code === "ArrowDown") {
      insertKeyValue(textArea, "↓");
    }
  }
});

// window.addEventListener("keydown", (e) => {console.log(e.code); console.log(e.key)});
window.addEventListener("click", insertKeyValueOnClick);

// смена языка и генерация заново клавиатуры при зажатии клавиш шифт и альт
document.addEventListener("keydown", function (event) {
  if (event.shiftKey && event.altKey) {
    console.log("CHANGE LANG");
    console.log(lang);
    if (lang === "en") {
      lang = "ru";
    } else {
      lang = "en";
    }
    console.log(lang);
    keyboardContainer.innerHTML = "";
    generateRows(keyboardContainer);
    rows = document.querySelectorAll(".keyboard__row");
    if (lang === "ru") {
      generateKeys(keysDataRu, rows);
      document.querySelector(".text-field__change-lang").innerHTML = "Нажмите <span>Shift+Alt</span> для смены языка. \nТаск выполнен в ОС Windows";
    } else {
      generateKeys(keysDataEn, rows);
      document.querySelector(".text-field__change-lang").innerHTML = "Press <span>Shift+Alt</span> to change language. \nTask created in Windows OS";
    }
  }
});