export class Env {
    constructor() {
        this.functions = {}
        this.values = {}
        this.result = null
        this.is_return = false
        this.print = null
        this.native_functions = {}
    }
}