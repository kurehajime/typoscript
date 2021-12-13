import * as peggy from "peggy";
import * as jspeg from "./jspeg";
import * as evaluter from "./evaluter";
import * as env from "./env";

export function interpreter(code, printFunc) {
    const parser = peggy.generate(jspeg.peg_rule)
    const parsed = parser.parse(code)
    const _evaluter = new evaluter.Evaluter()
    const _env = new env.Env()
    _env.native_functions["print"] = printFunc
    _evaluter.evalute(_env, parsed)
}
