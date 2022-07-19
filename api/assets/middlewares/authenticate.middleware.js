import { UnauthorizedError } from "../errors/unauthorized.error";


const TOKENDEACCESOWS=process.env.TOKENDEACCESOWS

export class AuthenticateMiddleware{
    
    static validateRequest(next){
        return (root,args,context,info)=>{
            if(!context.user_info)
            throw new UnauthorizedError(
                new Error('Informacion de usuario no ingresada')
            );
            return next (root,args,context,info);
        };
    }
    

    static async validateWsRequest(req, res, next) {
        let auth = req.headers.authorization;
        if (!auth)
            return res.status(401).json({
                message: 'Token no detectado',
                description: {
                    HTTPStatus: 401
                }
            });

            if(auth.split(' ')[0]!='Bearer')   return res.status(401).json({message: 'Token incompleto',description: {HTTPStatus: 401}});

        let token = auth.split(' ')[1];

        if (!token)
        return res.status(401).json({
            message: 'Token incompleto',
            description: {
                HTTPStatus: 401
            }
        });


        if (token!=TOKENDEACCESOWS)
            return res.status(401).json({
                message: 'Token invalido',
                description: {
                    HTTPStatus: 401
                }
            });

        try {
            return next();
        } catch (e) {
            return res.status(401).json({
                message: 'Invalid user',
                description: {
                    HTTPStatus: 401
                }
            });
        }
    }
}