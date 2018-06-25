'use strict';

module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
    	type: DataTypes.STRING,
    	allowNull: false,
    	unique: true
    },
    body: {
    	type: DataTypes.TEXT,
    	allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    
  });
  
  Post.associate = function(models) {
  	Post.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
  }

  return Post;
};