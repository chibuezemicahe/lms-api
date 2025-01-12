const {Model,DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    class Authors extends Model {
        static associations(model){
            Authors.hasMany(model.Books,{ foreignKey: 'author_id' })
        }
    }

    Authors.init(
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement: true,
                allowNull:false
            },
            name:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            bio:{
                type:DataTypes.TEXT,
                allowNull:true,
            },
            birthdate:{
                type:DataTypes.DATE,
                allowNull:true,
            },
        },
        {
            sequelize,
            modelName:'Authors'
        }
    )

    return Authors;
}