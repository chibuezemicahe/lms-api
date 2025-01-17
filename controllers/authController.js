const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {db} = require('../models');
const AppError = require('../utils/appError');

// Below is the Login controller
exports.login = async (req,res,next) =>{   
     // Here I pull the email and password from the req body (which is in the form)
     const {email, password } = req.body;

    try{
        
        // Here I try to fetch the user from the dataBase
        const user = await db.Users.findOne({where: { email }});

        // Here I check if finding the user Is was successful or not
        if (!user) {
            throw new AppError('User Not Found', 404)
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid Credentials', 401)
        }

        const token =  jwt.sign(
            {id:user.id, role:user.role_id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.status(200).json({ message: 'Login successful', token });
      
    }catch(error){
     next(error);
    }
}

exports.signup = async (req,res,next) =>{
    // Pull out the details for signup from the body;
    const { name, email, password, role_id } = req.body;


    // try and catch error since there was no after validating the inputs

    try{
        // check if User Exist on the database

        const userExist = await db.Users.findOne({ where: { email } });

        if (userExist){
            throw new AppError('User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        
        const newUser = await db.Users.create({
            name,
            email,
            password: hashedPassword,
            role_id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (!newUser){
            throw new AppError('User Creation Failed', 500);
        }
        return res.status(201).json({            
            message: 'User created successfully',
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role_id: newUser.role_id,
            },
        })
    }
    catch(error){
        next(error);
    }
}