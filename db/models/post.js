'use strict';

const models = require('./');

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
    }
  }, {
    underscored: true
  });
  
  Post.associate = function(models) {
  	
  }

  return Post;
};