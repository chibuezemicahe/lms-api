// routes/books.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const booksController = require('../controllers/booksController');
const { db } = require('../models'); // Import db instead of Books directly;

const { verifyToken, authorizationRole } = require('../middlewares/authMiddleware'); 

// Route to get all books with pagination
router.get('/books', booksController.getBooks);

// Route to get a specific book by ID
router.get('/books/:id', booksController.getOneBook);

// Route to create book
router.post('/books',verifyToken, authorizationRole([1,2]), [
  check('isbn').notEmpty().withMessage('ISBN is required').isLength({ min: 10 })
    .withMessage('ISBN must be at least 10 characters long')
    .custom(async (isbn) => {
      const existingBook = await db.Books.findOne({ where: { isbn } });
      if (existingBook) {
        throw new Error('ISBN already exists');
      }
      return true;
    }),
  check('title').notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be greater than five characters'),
  check('published_date').notEmpty().withMessage('Published date is required')
    .isDate().withMessage('Published date must be a valid date'),
  check('author_id').notEmpty().withMessage('Author ID is required')
    .custom(async (author_id) => {
      const authorExists = await db.Authors.findByPk(author_id);
      if (!authorExists) {
        throw new Error('Author not found');
      }
      return true;
    }),
  check('status').notEmpty().withMessage('Status is required')
    .isIn(['Available', 'Borrowed']).withMessage('Status must be either "Available" or "Borrowed"'),
], booksController.postAddBook);

router.put('/books/:id', verifyToken, authorizationRole([1,2]),[
  check('isbn').notEmpty().withMessage('ISBN is required').isLength({ min: 10 })
    .withMessage('ISBN must be at least 10 characters long')
    .custom(async (isbn, {req}) => {
      const book = await db.Books.findOne({ where: { isbn } });
      if (book && book.id !== Number(req.params.id)) {
        throw new Error('ISBN already exists for another book');
      }
      return true;
    }),
  check('title').notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be greater than five characters'),
  check('published_date').notEmpty().withMessage('Published date is required')
    .isDate().withMessage('Published date must be a valid date'),
  check('author_id').notEmpty().withMessage('Author ID is required')
    .custom(async (author_id) => {
      const authorExists = await db.Authors.findByPk(author_id);
      if (!authorExists) {
        throw new Error('Author not found');
      }
      return true;
    }),
  check('status').notEmpty().withMessage('Status is required')
    .isIn(['Available', 'Borrowed']).withMessage('Status must be either "Available" or "Borrowed"'),
],booksController.editBooks)
module.exports = router;

router.post('/books/:id/borrow', verifyToken, authorizationRole([3]), booksController.borrowBook);
router.post('/books/:id/return', verifyToken, authorizationRole([3]), booksController.returnBook);


router.delete('/books/:id', verifyToken, authorizationRole([1]), booksController.deleteBook);