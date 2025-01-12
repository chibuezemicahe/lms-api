// models/books.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Books extends Model {
    static associations(model){
      Books.hasMany(model.BorrowRecords, {foreignKey: 'book_id'})
      Books.belongsTo(model.Author, {foreignKey:'author_id'});
    }
  }

  Books.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      published_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Authors',
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Available', 'Borrowed'),
        allowNull: false,
      },
    },
    {
      sequelize,  // The sequelize instance
      modelName: 'Books',
    }
  );

  return Books;
};