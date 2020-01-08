module.exports = (sequelize, DataTypes) => 
  sequelize.define('Realm', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKet: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'realms',
    timestamps: false
  })