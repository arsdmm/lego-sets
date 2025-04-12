const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Theme = sequelize.define("Theme", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING
}, {
  timestamps: false,
  tableName: "themes"
});

const Set = sequelize.define("Set", {
  set_num: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING,
  year: DataTypes.INTEGER,
  num_parts: DataTypes.INTEGER,
  img_url: DataTypes.STRING,
  theme_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Theme,
      key: "id"
    }
  }
}, {
  timestamps: false,
  tableName: "sets"
});

Set.belongsTo(Theme, { foreignKey: "theme_id" });

module.exports = { Set, Theme };
