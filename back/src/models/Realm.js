module.exports = (sequelize, DataTypes) => 
  sequelize.define('Realm', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
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