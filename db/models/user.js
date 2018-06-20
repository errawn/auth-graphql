'use strict';

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
    	type: DataTypes.STRING,
    	allowNull: false,
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
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);

  });

  return User;
};