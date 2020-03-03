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
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
  });

  Realm.associate = models => {
    Realm.hasMany(models.RealmIssue, {
      foreignKey: 'realm_id',
      as: 'issues'
    });
  };
  return Realm;
};