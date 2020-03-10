const Joi = require('@hapi/joi');

const validate = field => {
  const schema = {
    // Shards
    selectShards: Joi.object().keys({
      shard_ids: Joi.array()
        .items(Joi.number())
        .required(),
      insert_last: Joi.boolean(),
    }),
    selectShard: Joi.object().keys({
      insert_last: Joi.boolean(),
    }),
    updatePositions: Joi.object().keys({
      ordered_ids: Joi.array()
        .items(Joi.number())
        .required(),
    }),
    addIssue: Joi.object().keys({
      issue_id: Joi.number().required(),
    }),
    connectShard: Joi.object().keys({
      parent_id: Joi.number().required(),
    }),
    // Realms
    realmConnection: Joi.object().keys({
      first: Joi.number().required(),
      second: Joi.number().required(),
    }),
  };

  return (req, res, next) => {
    const { error } = schema[field].validate(req.body, { abortEarly: false });
    if (error) {
      const { details } = error;
      const message = details.map(e => e.message).join(',\n');
      console.log('Validation error:\n', message);
      res.status(422).send(message);
    } else {
      next();
    }
  };
};

module.exports = validate;
