module.exports = (sequelize, DataTypes) => {
  const Realm = sequelize.define('Realm', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    position: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'realms',
    timestamps: false
  });

  Realm.associate = models => {
    Realm.belongsToMany(models.Issue, {
      as: 'issues',
      foreignKey: 'realm_id',
      otherKey: 'issue_id',
      through: 'RealmIssue'
    })
  };
  return Realm;
};