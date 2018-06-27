const Joi = require('joi');

function validate({ body }, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().trim().alphanum().min(2).max(255).required(),
    description: Joi.string().trim().min(2).max(2000).required(),
    criteriaNarrative: Joi.string().trim().min(2).max(2000).required(),
    image: Joi.string().trim().min(22).required(),
    imageCaption: Joi.string().trim().min(2).max(255).allow(null).required(),
    imageAuthorIri: Joi.string().trim().min(2).max(255).allow(null).required(),
    tags: Joi.array().items(Joi.string().trim().min(2).max(255).allow(null)).required()
  });

  Joi.validate(body, schema, err => {
    if (err) {
      throw new Error(err);
    } else {
      next();
    }
  });
}

module.exports = validate;
