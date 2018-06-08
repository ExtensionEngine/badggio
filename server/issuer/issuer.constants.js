'use strict';

const issuer = require('./issuer.validator');
const normalizeUrl = require('normalize-url');
const { HOSTNAME, NODE_ENV, PORT } = process.env;

const protocol = NODE_ENV === 'production' ? 'https' : 'http';
const fullUrl = `${protocol}://${HOSTNAME}:${PORT}`;
const url = normalizeUrl(fullUrl);

issuer.issuerUrl = `${url}/issuer/issuer.json`;
issuer.imageUrl = `${url}/issuer/image`;
issuer.publicKeyUrl = `${url}/issuer/publicKey.json`;

module.exports = issuer;
