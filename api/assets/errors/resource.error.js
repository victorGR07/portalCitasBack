import { MainError } from "./_main.error";

export class ResourseError extends MainError{
    constructor (e){
        super('Resource not found', 404, e);
    }
}