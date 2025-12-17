// this is made for to create a method and export usually when we call mongoDB so we have write codes many time so to sort that we will use this

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch.apply((err) => next(err)) // gpt use karke samajh lo adv. syntax
    }
}



export {asyncHandler}


// const asyncHandler = () => {}  -> pass to one function
// const asyncHandler = (fn) => () => {}  -> from one to another function
// const asyncHandler = (fn) => async() => {}  -> to make it async 


// asyncHandler is a higher order function -> functions which accepts functions as a parameter and return them and treat them as variable 



// const asyncHandler = (fn) => async(req, res, next) => {
//     try{

//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }   