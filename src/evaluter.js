

import * as func from "./function";
import * as util from "./util";

export class Evaluter {
    constructor() {
        this.THRESHOLD = 0.25
    }
    Identifier(env, name) {
        let _name = util.fuzKey(env.values, name, this.THRESHOLD)
        return env.values[_name]
    }

    Assign(env, operator, identifier, value) {
        let op = this.evalute(env, operator)
        let name = util.fuzKey(env.values, identifier.name, this.THRESHOLD)
        let result = env.values[name]
        switch (op) {
            case "=":
                result = value
                break
            case "+=":
                result += value
                break
            case "-=":
                result -= value
                break
            case "*=":
                result *= value
                break
            case "/=":
                result /= value
                break
            case "%=":
                result %= value
                break
            case "<<=":
                result <<= value
                break
            case ">>=":
                result >>= value
                break
            case ">>>=":
                result >>>= value
                break
            case "|=":
                result |= value
                break
            case "^=":
                result ^= value
                break
            case "&=":
                result &= value
                break
            default:
                break;
        }
        env.values[name] = result
        return env.values[name]
    }

    Program(env, body) {
        for (const item of body) {
            this.evalute(env, item)
            if (env.is_return) {
                env.is_return = false
                return env.result
            }
        }
    }
    FunctionDeclaration(env, id, params, body) {
        let name = id.name
        let args = params.map((x) => {
            return x.name
        })
        env.functions[name] = new func.Function(name, body, args)
    }
    ForStatement(env, init, test, update, body) {
        this.evalute(env, init)
        while (this.evalute(env, test)) {
            this.evalute(env, body)
            this.evalute(env, update)
        }
    }
    Literal(env, value) {
        return value;
    }
    ExpressionStatement(env, expression) {
        return this.evalute(env, expression)
    }
    BlockStatement(env, body) {
        return this.Program(env, body)
    }
    FunctionBody(env, body) {
        return this.Program(env, body)
    }
    EmptyStatement(env) {
        return
    }
    ReturnStatement(env, argument) {
        env.result = this.evalute(env, argument)
        env.is_return = true
    }
    IfStatement(env, test, consequent, alternate) {
        let result = this.evalute(env, test)
        if (result) {
            this.evalute(env, consequent)
        } else if (alternate) {
            this.evalute(env, alternate)
        }
    }
    WhileStatement(env, test, body) {
        while (this.evalute(env, test)) {
            this.evalute(env, body)
        }
    }
    VariableDeclaration(env, declarations, kind) {
        for (const item of declarations) {
            this.evalute(env, item)
        }
    }
    VariableDeclarator(env, id, init) {
        this.Assign(env, "=", id, this.evalute(env, init))
    }
    ArrayExpression(env, elements) {
        return elements.map((x) => {
            return this.evalute(env, x)
        })
    }
    UnaryExpression(env, operator, argument, prefix) {
        switch (operator) {
            case "+":
                return this.evalute(env, argument)
            case "-":
                return -1 * this.evalute(env, argument)
            case "!":
                return !this.evalute(env, argument)
            default:
                this.evalute(env, argument)
        }
    }
    UpdateExpression(env, operator, argument, prefix) {
        let name = util.fuzKey(env.values, argument.name, this.THRESHOLD)

        switch (operator) {
            case "++":
                if (argument.type === 'Identifier') {
                    return env.values[name]++
                }
            case "--":
                if (argument.type === 'Identifier') {
                    return env.values[name]--
                }
            default:
                this.evalute(env, argument)
        }
    }
    CallExpression(env, callee, _arguments) {
        let name = util.fuzKey(Object.assign({}, env.functions, env.native_functions), callee.name, this.THRESHOLD)
        let args = _arguments.map((x) => {
            if (x.type === "Identifier") {
                let name = util.fuzKey(env.values, x.name, this.THRESHOLD)
                return env.values[name]
            }
            return this.evalute(env, x)
        })
        if (name in env.native_functions) {
            return env.native_functions[name](...args)
        }
        let hits = env.functions[name]
        if (hits) {
            let new_env = Object.assign({}, env)
            let i = 0
            for (const name of hits.args) {
                new_env.values[name] = args[i]
                i++
            }
            this.evalute(new_env, hits.body)
            return new_env.result
        }
    }
    BinaryExpression(env, operator, left, right) {
        let op = operator
        let l = this.evalute(env, left)
        let r = this.evalute(env, right)

        switch (op) {
            case "==":
                return l == r
            case "!=":
                return l != r
            case "===":
                return l === r
            case "!==":
                return l !== r
            case "<":
                return l < r
            case "<=":
                return l <= r
            case ">":
                return l > r
            case ">=":
                return l >= r
            case "<<":
                return l << r
            case ">>":
                return l >> r
            case ">>":
                return l >> r
            case ">>>":
                return l >>> r
            case "+":
                return l + r
            case "-":
                return l - r
            case "*":
                return l * r
            case "/":
                return l / r
            case "%":
                return l % r
            case "|":
                return l | r
            case "^":
                return l ^ r
            case "&":
                return l & r
            case "in":
                return l in r
            case "instanceof":
                return l instanceof r
            default:
                break;
        }
    }
    AssignmentExpression(env, operator, left, right) {
        return this.Assign(env, this.evalute(env, operator), left, this.evalute(env, right))
    }
    LogicalExpression(env, operator, left, right) {
        let op = this.evalute(env, operator)
        let l = this.evalute(env, left)
        let r = this.evalute(env, right)

        switch (op) {
            case "||":
                return l || r
            case "&&":
                return l && r
            default:
                break;
        }

    }
    MemberExpression(env, object, property, computed) {
        let ob = this.evalute(env, object)
        let pro = this.evalute(env, property)
        return ob[pro]
    }
    ConditionalExpression(env, test, consequent, alternate) {
        return this.IfStatement(env, test, consequent, alternate)
    }

    evalute(env, tree) {
        if (tree == undefined || tree.type == undefined) {
            return tree
        }
        const type = tree.type
        switch (type) {
            case "Identifier":
                return this.Identifier(env, tree.name)
            case "Program":
                return this.Program(env, tree.body)
            case "FunctionDeclaration":
                return this.FunctionDeclaration(env, tree.id, tree.params, tree.body)
            case "ForStatement":
                return this.ForStatement(env, tree.init, tree.test, tree.update, tree.body)
            case "Literal":
                return this.Literal(env, tree.value)
            case "ExpressionStatement":
                return this.ExpressionStatement(env, tree.expression)
            case "BlockStatement":
                return this.BlockStatement(env, tree.body)
            case "FunctionBody":
                return this.FunctionBody(env, tree.body)
            case "EmptyStatement":
                return this.EmptyStatement(env)
            case "ReturnStatement":
                return this.ReturnStatement(env, tree.argument)
            case "IfStatement":
                return this.IfStatement(env, tree.test, tree.consequent, tree.alternate)
            case "WhileStatement":
                return this.WhileStatement(env, tree.test, tree.body)
            case "VariableDeclaration":
                return this.VariableDeclaration(env, tree.declarations, tree.kind)
            case "VariableDeclarator":
                return this.VariableDeclarator(env, tree.id, tree.init)
            case "ArrayExpression":
                return this.ArrayExpression(env, tree.elements)
            case "UnaryExpression":
                return this.UnaryExpression(env, tree.operator, tree.argument, tree.prefix)
            case "UpdateExpression":
                return this.UpdateExpression(env, tree.operator, tree.argument, tree.prefix)
            case "CallExpression":
                return this.CallExpression(env, tree.callee, tree.arguments)
            case "BinaryExpression":
                return this.BinaryExpression(env, tree.operator, tree.left, tree.right)
            case "AssignmentExpression":
                return this.AssignmentExpression(env, tree.operator, tree.left, tree.right)
            case "LogicalExpression":
                return this.LogicalExpression(env, tree.operator, tree.left, tree.right)
            case "MemberExpression":
                return this.MemberExpression(env, tree.object, tree.property, tree.computed)
            case "ConditionalExpression":
                return this.IfStatement(env, tree.test, tree.consequent, tree.alternate)
            default:
                console.log(tree)
                break;
        }
    }
}