"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("Users", {
      fields: ["Username"],
      type: "unique",
      name: "unique_username_constraint",
    });

    // Add unique constraint to email
    await queryInterface.addConstraint("Users", {
      fields: ["Email"],
      type: "unique",
      name: "unique_email_constraint",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // Remove unique constraint from username
    await queryInterface.removeConstraint(
      "Users",
      "unique_username_constraint"
    );

    // Remove unique constraint from email
    await queryInterface.removeConstraint("Users", "unique_email_constraint");
  },
};
