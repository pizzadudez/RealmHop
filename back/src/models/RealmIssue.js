module.exports = (sequelize, DataTypes) =>
  sequelize.define('RealmIssue', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    realm_id: {
      type: DataTypes.INTEGER, 
    },
    issue_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'realms_issues',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  })