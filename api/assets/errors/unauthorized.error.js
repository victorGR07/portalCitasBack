import { MainError } from "./_main.error";

export class UnauthorizedError extends MainError{
    constructor(e){
        super('Requiered credentials',401,e);
    }
}