const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authorsController = require('../controllers/authorsController');
const { verifyToken, authorizationRole } = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleWare')

router.get('/authors/:id', authorsController.getSingleAuthor);
router.get('/authors', authorsController.getAuthors);


// Here I implement Role based access control on the route of the  Author creation and validation as well
router.post('/authors',verifyToken, authorizationRole([1, 2]), [check('name').notEmpty().isLength({min:3})
    .withMessage('Name must be at least 3 characters long'), check('birthdate').isDate()
    .withMessage('Date field must be a valid date'),], validationMiddleware,
    authorsController.postAuthor
);

router.put('/authors/:id',verifyToken, authorizationRole([1, 2]),  [check('name').notEmpty().isLength({min:3})
    .withMessage('Name must be at least 3 characters long'), check('birthdate').isDate()
    .withMessage('Date field must be a valid date'),],validationMiddleware, authorsController.editAuthorDetails
);

router.delete('/authors/:id',verifyToken, authorizationRole([1, 2]), authorsController.deleteAuthor
);


module.exports = router;
