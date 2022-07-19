import { ErrorHandler } from "../errors/_handler";

export class ErrorMiddleware{
static getInstance(type){
    if(type=='gql'){
        return ErrorHandler.gqlHandler;
    }else if(type=='rest'){
        return ErrorHandler.restHandler;
    }
}
}