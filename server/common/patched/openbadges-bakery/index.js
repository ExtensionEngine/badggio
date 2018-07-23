'use strict';

const png = require('openbadges-bakery/lib/png');
const bakePatch = require('./png-bake.patch');

png.bake = bakePatch;

module.exports = require('openbadges-bakery');
