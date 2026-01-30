// this is made for to create a method and export usually when we call mongoDB so we have write codes many time so to sort that we will use this

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err)) // adv. syntax
    }
}



export {asyncHandler}
