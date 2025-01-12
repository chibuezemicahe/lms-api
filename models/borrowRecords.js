const {Model,DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class BorrowRecords extends Model{
        static associations(model){
            BorrowRecords.belongsTo(model.User, { foreignKey: 'user_id' });
            BorrowRecords.belongsTo(model.Book, { foreignKey: 'book_id' });

        }
    }

    BorrowRecords.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false,
        },
        user_id:{
            type: DataTypes.INTEGER,
            references:{
                model:'Users',
                key:'id',
            },
            allowNull:false,
            onDelete: 'CASCADE',  //This handles user deletion by removing their borrow records
            
        },
        book_id:{
            type:DataTypes.INTEGER,
            references:{
                model:'Books',
                key:'id',
            },
            allowNull:false,
            onDelete: 'CASCADE',  //  This Handle books deletion by removing related borrow records
        },

        borrowed_at:{
            type:DataTypes.DATE,
            allowNull:false,
        },
        due_at:{
            type:DataTypes.DATE,
            allowNull:false,
        },
        returned_at:{
            type:DataTypes.DATE,
        }
    },
    {
        sequelize,
        modelName: 'BorrowRecords'
    }
)

return BorrowRecords;

}