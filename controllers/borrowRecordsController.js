const { db } = require('../models');  // Import the db object, which contains the models

exports.viewBorrowRecords = async (req,res,next)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const {count, rows} = db.borrowRecords.findAndCountAll({
           limit,
           offset
        })

        return res.status(200).json({
            status: 'success',
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            data: rows,
          });
    }catch(error){
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}