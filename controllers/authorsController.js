const { where } = require('sequelize');
const {db} = require('../models');
const {validationResult} = require('express-validator');


/* This export is for adding an Author and Role based Access Control was implemented meaning only certain
individuals with certail role (Admin, Librarian) can add an author to the database.
*/
exports.postAuthor = async (req, res, next ) => {
  
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array(),
      });
    }
  

    const {name, bio, birthdate } = req.body;

    try{
        const newAuthor = await db.Authors.create({
            name,
            bio,
            birthdate,
          });
          res.status(201).json({
            status: 'success',
            data: newAuthor,
          });
    }
    catch(error){
        return error.status(500).json({
            status:'error',
            message:error.message
        })
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
    return res.status(200).json({
      status:"Successful",
      data:getAllAuthors
    })

  }
  catch(error){
   return res.status(500).json({
      status:'error',
      message:error.message
    })  
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
        return res.status(404).json({
          status: 'error',
          message: 'Author not found',
        });
    }

    // If the author is found, return the details
    return res.status(200).json({
      status: 'success',
      data: findOneAuthor,
    });

  }
  catch(error){
    return res.status(500).json({
      status: 'error',
      message:error.message
    });

}
}

exports.editAuthorDetails = async (req,res,next) =>{
const {id} = req.params;

try{

  // Here I Go to the database to find the author 
  const existingAuthor = await db.Authors.findOne({
    where: { id: Number(id) },
  });

  // Here i check if the author exist or not
  if(!existingAuthor){
    return res.status(404).json({
      status: 'error',
      message: 'Author Does not exist',
    });
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
  return res.status(500).json({
    status: 'error',
    message:error.message
  });

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
      return res.status(404).json({
        status: 'error',
        message: 'Author Does not exist',
      });
    }

    // Delete the author
    await existingAuthor.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Author deleted successfully',
    });


  } catch (error){

    return res.status(500).json({
      status:error,
      message:error.message
    })
  }

}