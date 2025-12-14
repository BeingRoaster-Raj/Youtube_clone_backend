class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = [],
        stack = ""
    ){
        super(message)  // overwriteing the message property of the Error class 
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = this.errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor) 
        }
    }
}