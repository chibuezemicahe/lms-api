const {Model,DataTypes} = require('sequelize');

module.exports = (sequelize)=>{

    class Users extends Model{
        // This is where i create the table association between user and role
      static associate(model) {
            Users.belongsTo(model.Role, { foreignKey: 'role_id' });
            Users.hasMany(model.BorrowRecords, {foreignKey: 'user_id'})
        }
    }

    // Here i initialize the User table and its various coulumns 
    Users.init({
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },

    //Here i call the model name
    {
        sequelize,
        modelName:'Users'
    }
)

return Users;

}

