class ApiRespone {
    constructor(statusCode, data = null, message = "Request successful") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400    // api ke jitne server hote hai unke status code hote hai(search - server status codes)  200-399 -> success , 400-599 -> failure
    }
}