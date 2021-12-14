import * as typoscript from "../src/typoscript";

test('print', () => {
    let result = run('print(1)')
    expect(result).toEqual("1");
});
test('var', () => {
    let result = run(`
    var a = 1
    print(a)
    `)
    expect(result).toEqual("1");
});
test('if', () => {
    let result = run(`
    if(1==2){
        print(1)
    }else{
        print(2)
    }`)
    expect(result).toEqual("2");
});
test('for', () => {
    let result = run(`
    var x=0;
    for(var i=0;i<10;i++){
        x++
    }
    print(x)`)
    expect(result).toEqual("10");
});
test('function', () => {
    let result = run(`
    function foo(x){
        print(x)
    }
    foo(1)
    `)
    expect(result).toEqual("1");
});
test('lazzy var', () => {
    let result = run(`
    var mother = 1
    print(other)
    `)
    expect(result).toEqual("1");
});
function run(code) {
    let output = ""
    typoscript.interpreter(code, (x) => {
        output += x + "\n"
    });
    return output.trim()
}