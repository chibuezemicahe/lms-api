const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {db} = require('../models');

// Below is the Login controller
exports.login = async (req,res,next) =>{
    
    // Here i pull the error from the req using validation result from express-validator
    const errors = validationResult(req);

    // Here i check to see if error was gotten in the validation and then i return the error
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            message: errors.array(),
        });
    }

     // Here I pull the email and password from the req body (which is in the form)

     const {email, password } = req.body;

    try{
        
        // Here I try to fetch the user from the dataBase
        const user = await db.Users.findOne({where: { email }});

        // Here I check if finding the user Is was successful or not
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token =  jwt.sign(
            {id:user.id, role:user.role_id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.status(200).json({ message: 'Login successful', token });
      
    }catch(error){
        return res.status(500).json({
            status: 'errors',
            message: error.message,
        });
    }
}

exports.signup = async (req,res,next) =>{
    const errors = validationResult(req);
    // Here i check to see if error was gotten in the validation and then i return the error
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: 'error',
                message: errors.array(),
            });
        }
    // Pull out the details for signup from the body;
    const { name, email, password, role_id } = req.body;


    // try and catch error since there was no after validating the inputs

    try{
        // check if User Exist on the database

        const userExist = await db.Users.findOne({ where: { email } });

        if (userExist){
            return res.status(400).json({ message: 'User already exists' });
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
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}