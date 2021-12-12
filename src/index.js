import * as typoscript from "./typoscript";

function main() {
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
