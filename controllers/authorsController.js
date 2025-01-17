const { where } = require('sequelize');
const {db} = require('../models');
const AppError = require('../utils/appError');


/* This export is for adding an Author and Role based Access Control was implemented meaning only certain
individuals with certail role (Admin, Librarian) can add an author to the database.
*/
exports.postAuthor = async (req, res, next ) => {
  
    const {name, bio, birthdate } = req.body;

    try{
        const newAuthor = await db.Authors.create({
            name,
            bio,
            birthdate,
          });

          if (!newAuthor){
            throw new AppError('Author Creation Failed',500)
          }

          return res.status(201).json({
            status: 'success',
            data: newAuthor,
          });
    }
    catch(error){
      next(error);
    }

}

exports.getAuthors = async (req,res,next) => {
  const {page=1, limit =10 } = req.query;

    try{
      const {name, birthdate} = req.query;

      const whereClause = {};

      if (name){
        whereClause.name = { [db.Sequelize.Op.like]: `%${name}%` };; // Here I perform a partial match for name
      }

      if(birthdate){
        whereClause.birthdate = birthdate
      }

      const getAllAuthors = await db.Authors.findAll({
          where:whereClause,
          limit,
          offset: (page - 1) * limit
    });

    if (!getAllAuthors){
      throw new AppError('Geting Authors From Database Failed',500 );
    }

    return res.status(200).json({
      status:"Successful",
      data:getAllAuthors
    })

  }
  catch(error){
    next(error);
  }
}

exports.getSingleAuthor = async (req, res, next )=>{
  
  try{
    // Here I fetch Author Id from the  query parameter
    const { id } = req.params;

    // Here i fetch the single author from the Database
    const findOneAuthor = await db.Authors.findOne({
      where: { id: Number(id) },
    })

    // If no author is found, return a 404 response
    if(!findOneAuthor){
      throw new AppError('Author not found', 404)
    }

    // If the author is found, return the details
    return res.status(200).json({
      status: 'success',
      data: findOneAuthor,
    });

  }
  catch(error){
    next(error);
}
}

exports.editAuthorDetails = async (req,res,next) =>{
const {id} = req.params;

try{

  // Here I Go to the database to find the author 
  const existingAuthor = await db.Authors.findOne({
    where: { id: Number(id) },
  });

  // Here i check if the author exist or not and then throw an error based on if it is true or false
  if(!existingAuthor){
   
    throw new AppError('Author Does not exist', 404)
   
  }

  // Here i pull out the details from the request body

  const {name, bio, birthdate} = req.body;  

  //Here I make the update to the neccessart fields
  existingAuthor.name = name || existingAuthor.name;
  existingAuthor.bio = bio || existingAuthor.bio;
  existingAuthor.birthdate = birthdate || existingAuthor.birthdate;

  // Then i save it
  await existingAuthor.save();

  // Then i return the save details in the respons as a Json
  return res.status(200).json({
    status: 'success',
    message: 'Author details updated successfully',
    data: existingAuthor,
  });
}
catch(error){
  next(error);
}
}


exports.deleteAuthor = async (req,res,next ) => {

  // Here i get the author Id from the req param

  const {id} = req.params;

  try{

    const existingAuthor = await db.Authors.findOne({
      where: { id: Number(id)}
    });

    if(!existingAuthor){
      throw new AppError('Author Does not exist',404);
    }
    // Delete the author
    await existingAuthor.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Author deleted successfully',
    });
  } catch (error){
    next(error);
  }
}