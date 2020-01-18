const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const realms = await models.Realm.findAll({
      include: [
        { 
          association: 'issues',
          attributes: ['created_at'],
          include: [
            {
              association: 'issue'
            }
          ]
        }
      ],
      order: [['position', 'ASC']]
    });
    res.status(200).json(realms);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.updateRealm = async (req, res, next) => {
  try {
    await models.Realm.update(
      req.body, 
      { where: { id: req.params.id } }
    );
    const realm = await models.Realm.findByPk(req.params.id, {
      include: [
        { 
          association: 'issues',
          attributes: ['created_at'],
          include: [
            {
              association: 'issue'
            }
          ]
        }
      ],
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
    await models.Realm.update({ selected: false }, {
      where: { id: req.body.realm_id }
    })
    const realm = await models.Realm.findByPk(req.body.realm_id, {
      include: [
        { 
          association: 'issues',
          attributes: ['created_at'],
          include: [
            {
              association: 'issue'
            }
          ]
        }
      ],
    });
    res.status(200).json(realm);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.updatePositions = async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};