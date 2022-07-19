import { ForbiddenError } from "../errors/ForbiddenError";
import { verify } from "jsonwebtoken";
import { AES, enc } from "crypto-js";

const DECRYPT_KEY = process.env.KEY; 

export class Authenticate { 
  constructor() {}

  static _context(headers) {
    if (headers.authorization) {
      let authorization = headers.authorization.trim().split("Bearer ");
      if (authorization.length == 2) {
        if (authorization[1].trim().split(" ").length == 1) {
          try {
            let code = verify(authorization[1].trim(), DECRYPT_KEY).usuario;
            code = AES.decrypt(code, DECRYPT_KEY).toString(enc.Utf8);
            let user = JSON.parse(code);
            return {
              id: user.id,
              description: `${user.nombre} ${user.primer_apellido} ${user.segundo_apellido}`,
              workplace: user.centroTrabajo.nombre,
              region: user.centroTrabajo.region.nombre
            };
          } catch (e) {
            return undefined;
          }
        }
      }
    }
    return undefined;
  }

  static authenticated(next) {
    return (root, args, context, info) => {
      if (!context.user)
        throw new ForbiddenError("Claves de acceso incorrectas");
      return next(root, args, context, info);
    };
  }
}
