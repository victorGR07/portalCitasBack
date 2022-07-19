import { MainError } from "./_main.error";

export class SintaxError extends MainError{
    constructor(e){
        super('Invalid request',400,e);
    }
}