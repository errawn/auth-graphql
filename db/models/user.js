'use strict';

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
    	type: DataTypes.STRING,
    	allowNull: false,
      unique: true,
    	validate: {
    		isEmail: true
    	}
    },
    password: {
    	type: DataTypes.STRING,
    	allowNull: false
    }
  }, {});
  
  User.associate = function(models) {
    // associations can be defined here
  };

  User.hook('beforeSave', (user, options) => {
    user.password = bcrypt.hashSync(user.password, 8)
  });

  return User;
};