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
    });
}



document.addEventListener('DOMContentLoaded', main);
