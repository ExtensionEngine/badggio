'use script';

function setUsername({ body }, res, next) {
  if (body.email) body.username = body.email;
  next();
}

module.exports = { setUsername };
