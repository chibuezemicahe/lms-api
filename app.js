const express = require ('express');
const mysql = require ('mysql2');
const env = require('dotenv').config();
const cors = require('cors');
const app = express();
const { initializeSequelize, db} = require('./models/index');
const PORT = process.env.PORT || 3000;


// Here I import the routes
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/author');
const authRoute = require('./routes/auth')
const borrowRecordsRoute = require('./routes/borrowRecords');
// Cors MiddleWare setup happens below

// Middleware to parse JSON
app.use(express.json());

app.use(cors({
    origin:'*',
    methods:['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false
}))



// Global Error Handler Middleware
app.use((err,req,res,next)=>{
    console.log(  err.stack  );

    res.staus(err.status || 500 ).json({
        success: false,
        message: err.message
    })
})

//Here I implent the routes middleware

app.use(borrowRecordsRoute);
app.use(bookRoutes);
app.use(authorRoutes);
app.use(authRoute);



// Here I Sync the database and start the server

initializeSequelize()
.then((sequelize) => {
  // Now I sync the Sequelize models (including Role)
  return sequelize.sync();
})
.then(async () => {
  // Check if roles exist and create them if they don't
  const roles = ['Admin', 'Librarian', 'Member'];

  for (const roleName of roles) {
    const existingRole = await db.Role.findOne({ where: { name: roleName } });
    if (!existingRole) {
      await db.Role.create({ name: roleName });
    }
  }

  console.log('Database synced!');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Error syncing the database:', err);
});