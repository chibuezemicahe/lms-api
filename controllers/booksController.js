// controllers/booksController.js
const { db } = require('../models');  // Here I Import the db object, which contains the models
const { validationResult } = require('express-validator');


// Here i get all the books and apply pagination to fetch 10 books per page
exports.getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    /*
      findAndCountAll() is a Sequelize method used to retrieve records from a database table, and it also provides 
      a count of the total number of records that match the query.
      This method returns an object with two key properties:
      count: The total number of records that match the query (ignoring pagination).
      rows: The actual data records (rows) that match the query, limited by the pagination (limit and offset).
    */

    /*
      Example of the Response from findAndCountAll():
      Imagine you have 100 books in total, but you only want to retrieve 10 books per page (limit: 10) and you are on page 3 (page: 3). The findAndCountAll() method would return an object like this:

      javascript
      Copy code
      {
        count: 100,  // Total number of books in the database
        rows: [      // The actual books on the current page (page 3)
          { id: 21, title: 'Book 21', ... },
          { id: 22, title: 'Book 22', ... },
          { id: 23, title: 'Book 23', ... },
          ...
        ]
      }

    */
    const { count, rows } = await db.Books.findAndCountAll({
      limit,
      offset,
    });

    return res.status(200).json({
      status: 'success',
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


// Here i fetch one book using its id
exports.getOneBook = async (req, res, next) => {
  try {

    // Here I fetch Book Id from the  query parameter
    const { id } = req.params;

    const fetchSpecificBook = await db.Books.findOne({
      where: { id },
    });

    if (!fetchSpecificBook) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: fetchSpecificBook,
    });

    console.log('Success fetch Books')

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


// Here i add book to the database
exports.postAddBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: errors.array(),
    });
  }

  const { isbn, title, published_date, author_id, status } = req.body;

  try {
    const newBook = await db.Books.create({
      isbn,
      title,
      published_date,
      author_id,
      status,
    });

    return res.status(201).json({
      status: 'success',
      data: newBook,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


// Here I edit the book
exports.editBooks = async (req,res,next) => {
  const {id} = req.params;
  // Here i do my validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: errors.array(),
    });
  }
  try{
    const existingBook = await db.Books.findOne({
    where:{id: Number(id)} 
  });


   // Here i check if the book exist or not
   if(!existingBook){
    return res.status(404).json({
      status: 'error',
      message: 'Author Does not exist',
    });
  }

  // Here i extract the details from the request body
  const {isbn,title, published_date, author_id, status} = req.body;

  // Here i update the detaails in the database using the details extracted from the req body 
  await existingBook.update({
    isbn: isbn || existingBook.isbn,
    title: title || existingBook.title,
    published_date: published_date || existingBook.published_date,
    author_id: author_id || existingBook.author_id,
    status: status || existingBook.status,
  });
  

  // Then i return the save details in the respons as a Json
    return res.status(200).json({
      status: 'success',
      message: 'Book details updated successfully',
      data: existingBook,
    });



  }catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
  
}


// Here I delete Book (Only Admin roles can do this)

exports.deleteBook = async(req, res, next)=>{
  const {id} = req.params;
  try{
    
    // Here I find the book by its id
    const existingBook = await db.Books.findOne({
      where:{id:Number(id)}
    });
      
    // here i check if the book is existing
    if(!existingBook){
      return res.status(404).json({
        status: 'error',
        message: 'Book does not exist',
      });
    }

    await existingBook.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Book deleted successfully',
    });

  }catch(error){
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}

exports.borrowBook = async (req, res, next) => {
  const {id}  = req.params;
  const userId = req.user.id;

  try{
    const existingBook = await db.Books.findOne({where:{id:Number(id)}});

    if(!existingBook){
      return res.status(404).json({
        status: 'error',
        message: 'Book does not exist',
      });
    }


    // Here i check if the book they selected is available or borrowed

    if (existingBook.status !== 'Available'){
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    
    // Here I Update the book status to Borrowed
    existingBook.status = 'Borrowed';
    await existingBook.save();

    // Here I  Create a borrow record
    await db.BorrowRecords.create({
      user_id: userId,
      book_id: existingBook.id,
      borrowed_at: new Date(),
      due_at: new Date(new Date().setDate(new Date().getDate() + 14)), // Due in 14 days
    });

    return res.status(200).json({  status: 'success', message: 'Book borrowed successfully' });

  }catch(error){
    return res.status(500).json({  status: 'error', message: error.message });
  }
}

exports.returnBooks = async (req, res, next ) => {
  const {id} = req.params;

  const userId = req.user.id;

  try{
      const existingBook = await db.Books.findOne({where: { id } });
      
    if (!existingBook) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    // Check if the book is already available
    if (book.status === 'Available') {
      return res.status(400).json({
        status: 'error',
        message: 'Book is already returned',
      });
    }

     // Find the borrow record
     const borrowRecord = await db.BorrowRecords.findOne({
      where: { book_id: id, user_id: userId, returned_at: null },
    });

    if (!borrowRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'No borrow record found for this book and user',
      });
    }

    // Update the book status to Available
    borrowRecord.status = 'Available';
    // Mark the borrow record as returned
    borrowRecord.returned_at = new Date();
    await borrowRecord.save();

    return res.status(200).json({
      status: 'success',
      message: 'Book returned successfully',
    });

  }
  
  catch(error){
    res.status(500).json({
      status:'error',
      message:error.message
    })
  }
}