export class apiError extends Error {
    statusCode : number;
    constructor(statusCode :number,message:string){
        super(message);
        this.statusCode = statusCode
        // Needed because we are extending a built-in class
        //dk how this works
        Object.setPrototypeOf(this, apiError.prototype);
    }

}