import { MainError} from "./_main.error";

export class ServerError extends MainError{
    constructor(e){
        super ('Operation failed',500,e);
    }
    setOperation(operation) {
        this._operation = operation;
    }

    setStacktrace(stacktrace) {
        this._stacktrace = stacktrace;
    }

    toJSON() {
        let res = { ...super.toJSON() };
        if (this._operation && this._stacktrace) {
            res.location = {
                operation: this._operation,
                stacktrace: this._stacktrace
            };
        }
        return res;
    }

}