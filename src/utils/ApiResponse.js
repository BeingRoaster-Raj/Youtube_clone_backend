class ApiResponse {
    constructor(statusCode, data = null, message = "Request successful") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400    //(search - server status codes)  200-399 -> success , 400-599 -> failure
    }
}

export{ ApiResponse }