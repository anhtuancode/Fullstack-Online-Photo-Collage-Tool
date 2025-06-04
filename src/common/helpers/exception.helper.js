import { statusCodes } from "./status-code.helper";

export class BadRequestException extends Error {
    constructor(message){
        super(message)
        this.statusCode = statusCodes.BAD_REQUEST;
    }
}

export class UnAuthorizedException extends Error {
    constructor(message = "UnAuthorizedException"){
        super(message)
        this.statusCode = statusCodes.UNAUTHORIZED;
    }
}

export class ForBiddenException extends Error {
    constructor(message = "ForBiddenException"){
        super(message)
        this.statusCode = statusCodes.FORBIDDEN;
    }
}