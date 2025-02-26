
export class CustomError extends Error{
    statusCode: number;

    constructor(message: string, statusCode: number){
        if (message) {
            super(message);
        } else {
            super("Something went wrong!")
        }
        
        this.statusCode = statusCode;

        //this - The object where the stack trace will be attached.
        //this.constructor - The class to remove from the trace.
        Error.captureStackTrace(this, this.constructor)
    }
}