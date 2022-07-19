import { RequestMiddleware } from "./request.middleware";

export class ContextMiddleware{
    static async centralize({req,res}){
        return{
            request: req,
            response: res,
            client: RequestMiddleware.getClient(req),
            operation:{
                enity:'without_entity'
            }
        };
    }
}