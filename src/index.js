import css from "./css/main.css";
import img from './assets/typo.png';
import * as typoscript from "./typoscript";

function main() {
    const runButton = document.querySelector("#run")
    runButton.addEventListener('click', run);
}
function run() {
    const code = document.querySelector("#code")
    const result = document.querySelector("#result")
    let output = ""
    typoscript.interpreter(code.value, (x) => {
        output += x + "\n"
        result.value = output
        result.scrollTop = result.scrollHeight;
    }, (title, default_value) => {
        return window.prompt(title, default_value)
    });
}



document.addEventListener('DOMContentLoaded', main);
