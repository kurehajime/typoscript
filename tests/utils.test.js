import * as util from "../src/util";

test('lvd', () => {
    //swap
    let result = util.lvd("cat", "car")
    expect(result).toEqual(1);
    //del
    result = util.lvd("mother", "other")
    expect(result).toEqual(1);
    //add
    result = util.lvd("other", "mother")
    expect(result).toEqual(1);

    // result = util.lvd("winternalization", "internalization")
    // expect(result).toEqual(1);
});

test('fuzKey', () => {
    let dict = { internalization: 1 }
    let result = util.fuzKey(dict, "internalization", 0)
    expect(result).toEqual("internalization");

    // result = util.fuzKey(dict, "winternalization", 1)
    // expect(result).toEqual("internalization");

});