const { db } = require('../models');  // Import the db object, which contains the models
const AppError = require('../utils/appError');

exports.viewBorrowRecords = async (req,res,next)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate query parameters
        if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
            throw new Error ('Page and limit must be positive integers.',400);
        }

        const offset = (page - 1) * limit;
        const {count, rows} = db.borrowRecords.findAndCountAll({
           limit,
           offset
        })

        if (count === 0){
            throw new AppError('No Records Was Found',404)
        }

        return res.status(200).json({
            status: 'success',
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            data: rows,
          });
    }catch(error){
        console.error('Error fetching borrow records:', error); // Log the error
        next(error)
    }
}