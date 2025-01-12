const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {

    // Here I create and associate the Role to users using Role.hasMany
    class Role extends Model {
        static associate(model) {
          Role.hasMany(model.Users, { foreignKey: 'role_id' });
        }
      }

    // Here I initialize the role Model with various columns  
    Role.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
        },
        {
            sequelize,
            modelName:'Role'
        }
    
    );

    return Role;
}