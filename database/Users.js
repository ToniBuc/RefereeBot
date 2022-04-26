const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    const Users = sequelize.define('users', {
        userid: {
            type: Sequelize.INTEGER,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        yellowcards: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        redcards: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    });
    return Users;
}