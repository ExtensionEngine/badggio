'use strict';

const issuer = require('./issuer/issuer.loader').load();
const path = require('path');

const parseBool = (str = '') => str.toLowerCase() === 'true';

module.exports = {
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  ip: process.env.IP,
  staticFolder: path.resolve(__dirname, '../dist'),
  uploadLimit: '10mb',
  cors: {
    allowedOrigins: [],
    allowedHeaders: []
  },
  auth: {
    saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10),
    scheme: process.env.AUTH_JWT_SCHEME || 'JWT',
    secret: process.env.AUTH_JWT_SECRET,
    issuer: process.env.AUTH_JWT_ISSUER,
    audience: process.env.AUTH_JWT_AUDIENCE
  },
  email: {
    sender: process.env.EMAIL_ADDRESS,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || null,
    ssl: process.env.EMAIL_SSL,
    tls: process.env.EMAIL_TLS
  },
  storage: {
    amazon: {
      key: process.env.STORAGE_KEY,
      secret: process.env.STORAGE_SECRET,
      region: process.env.STORAGE_REGION,
      bucket: process.env.STORAGE_BUCKET
    },
    filesystem: {
      path: process.env.STORAGE_PATH
    },
    provider: process.env.STORAGE_PROVIDER
  },
  issuer,
  recipients: {
    hashed: parseBool(process.env.RECIPIENTS_HASHED),
    salted: parseBool(process.env.RECIPIENTS_SALTED)
  }
};
