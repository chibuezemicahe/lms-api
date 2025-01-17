const AppError = require('../utils/appError');

const globalErrorHandler = (err,req,res,next)=>{
    
    // Here I pull the error Status Code and error message from the request;
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'error';

    if(err.isOperational){

      // Log the error for debugging
        console.error('ERROR', err);
        return res.status(err.statusCode).json({
            status: err.status,
            message:err.message
        });
    };
  
   
    // Log the error for debugging
    console.error('ERROR 💥:', err.stack || err);
  
  // Send generic message for non-operational errors
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
}

module.exports = {globalErrorHandler};