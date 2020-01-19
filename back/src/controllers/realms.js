const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const realms = await models.Realm.findAll({
      order: [
        ['position', 'ASC NULLS LAST'],
        ['issues', 'created_at', 'DESC']
      ],
      include: [
        { 
          association: 'issues',
          attributes: ['id', 'created_at'],
          include: [
            {
              association: 'issue'
            }
          ]
        }
      ]
    });
    res.status(200).json(realms);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.updateRealm = async (req, res, next) => {
  try {
    if (req.body.position === null) {
      // when reselecting realms set position at the bottom 
      req.body.position = (await models.Realm.max('position')) + 1
    }
    await models.Realm.update(
      req.body, 
      { where: { id: req.params.id } }
    );
    const realm = await models.Realm.findByPk(req.params.id, {
      order: [['issues', 'created_at', 'DESC']],
      include: [
        { 
          association: 'issues',
          attributes: ['id', 'created_at'],
          include: [
            {
              association: 'issue'
            }
          ]
        }
      ]
    });
    res.status(200).json(realm);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.addIssue = async (req, res, next) => {
  try {
    await models.RealmIssue.create({
      realm_id: req.body.realm_id,
      issue_id: req.body.issue_id
    });
    await models.Realm.update({
      selected: false,
      position: null
    }, {
      where: {
        id: req.body.realm_id
      }
    });
    const realm = await models.Realm.findByPk(req.body.realm_id, {
      order: [['issues', 'created_at', 'DESC']],
      include: [
        { 
          association: 'issues',
          attributes: ['id', 'created_at'],
          include: [
            {
              association: 'issue'
            }
          ]
        }
      ]
    });
    res.status(200).json(realm);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.updatePositions = async (req, res, next) => {
  try {
    const updates = [];
    req.body.order.forEach((id, idx) => 
      updates.push(models.Realm.update({
        position: idx
      }, {
        where: { id: id }
      }))
    );
    await models.Sequelize.Promise.all(updates);
    res.status(200).json({ status: true })
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};