import { Authenticate } from "./Authenticate";

export class Context {
  constructor() {}

  static centralize({ req, res }) {
    
    return {
      request: req,
      response: res,
      user: Authenticate._context(req.headers),
      client: _getClient(req),
      public_ip: _getPublicIp(req)
    };
  }

  static generalCentralize(req) {
    return _getClient(req);
  }
}

function _getClient(req) {
  return {
    ip_address:
      req.connection.remoteAddress === `::1`
        ? `127.0.0.1`
        : req.connection.remoteAddress,
    browser_agent: !req.headers["user-agent"]
      ? `No user agent`
      : req.headers["user-agent"],
    method: req.method
  };
}

function _getPublicIp({ headers }) {
  return headers.public_ip ? headers.public_ip : null;
}