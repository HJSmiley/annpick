"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Tag", "category", {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: "Uncategorized", // 선택 사항
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tag", "category");
  },
};
