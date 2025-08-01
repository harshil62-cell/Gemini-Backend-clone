const {constants}=require("../constants");
const errorHandler =(err,req,res,next)=>{
    const statusCode=res.statusCode ? res.statusCode:500;
    switch(statusCode){
        case constants.VALIDATION_ERROR:
            res.json({
                title:"Validation Failed",
                message:err.message,
                stackTrace:err.stack,
            });
        case constants.NOT_FOUND:
            res.json({
                title:"Not Found",
                message:err.message,
                stackTrace:err.stack,
            })
        case constants.FORBIDDEN:
            res.json({
                title:"You are forbidden",
                message:err.message,
                stackTrace:err.stack,
            })
        case constants.UNAUTHORIZED:
            res.json({
                title:"You are not authorized",
                message:err.message,
                stackTrace:err.stack,
            })
        case constants.SERVER_ERROR:
            res.json({
                title:"Server Error",
                message:err.message,
                stackTrace:err.stack,
            })
        default:
            console.log("No error all good");
            break;
    }

};

module.exports={
    errorHandler,
}