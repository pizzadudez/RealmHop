module.exports = (sequelize, DataTypes) =>
  sequelize.define('Issue', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKet: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'issues',
    timestamps: false
  })