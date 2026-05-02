'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {


    const hashedPassword = await bcrypt.hash("password", 10);

    await queryInterface.bulkInsert('Manufacturers', [
      {
        name: "Admin Manufacturer",
        email: "manufacturer@gmail.com",
        password: hashedPassword,
        phone: "9876543210",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
