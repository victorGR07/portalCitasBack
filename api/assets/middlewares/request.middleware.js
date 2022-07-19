import { UnauthorizedError } from "../errors/unauthorized.error";

export class RequestMiddleware{
    static getClient({connection,headers,method}){
        return {
            ip_address: headers['x-forwarded-for'] || connection.remoteAddress,
            browser_agent: !headers['user-agent']
                ? 'No user agent'
                : headers['user-agent'],
            method: method
        }
    }
}