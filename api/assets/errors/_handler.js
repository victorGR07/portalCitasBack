import { ValidationError } from "apollo-server-express";

import { MainError } from "./_main.error";
import { ResourseError } from "./resource.error";
import { ServerError } from "./server.error";
import { SintaxError } from "./sintax.error";


export class ErrorHandler{
    static gqlHandler(e){
        let finalError;

        if(e && e.originalError && e.originalError instanceof MainError){
            finalError = e.originalError;
        }else if(e && !e.originalError && e instanceof MainError){
            finalError = e;
        }else if(e && e instanceof ValidationError){
            finalError= new SintaxError(e);
        }else{
            finalError= new SintaxError(e);
        }

        if(finalError.setOperation && e.path){
            finalError.setOperation(e.path[0]);
        }

        if (finalError.setStacktrace && e.extensions.exception.stacktrace) {
            finalError.setStacktrace(
                e.extensions.exception.stacktrace[1].trim().replace('at ', '')
            );
        }

        if(process.env.NODE_ENV == 'DEV' ? true : false) finalError.logger();
        else finalError.notify();
        return finalError.toJSON();
    }

    static restHandler(e, req, res, next) {
        let finalError;
        
        if (e && e instanceof MainError) {
            finalError = e;
        } else if (e.status == 404) {
            finalError = new ResourseError(e);
        } else {
            finalError = new ServerError(e);
        }
        if (process.env.NODE_ENV == 'DEV' ? true : false) finalError.logger();
        else finalError.notify();

        let { HTTPCode, message } = finalError.toJSON();
        return res.status(HTTPCode).json(message);
    }
}
