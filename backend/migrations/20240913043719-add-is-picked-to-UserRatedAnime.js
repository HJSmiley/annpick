// migration 파일 예시
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("UserRatedAnime", "is_picked", {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // 기본값 false
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("UserRatedAnime", "is_picked");
  },
};
