'use strict';

const glob = require('glob');
const issuer = require('../../.issuer-rc.json');
const path = require('path');

function findImage() {
  const pattern = path.resolve(__dirname,
    '../assets/issuer-image.@(svg|jpg|jpeg|png)');
  const files = glob.sync(pattern);
  if (files.length > 1) {
    throw Error(`Found more than one image matching '${pattern}' pattern!`);
  }
  return (files.length === 0) ? '' : files[0];
}

if (!issuer.imagePath) issuer.imagePath = findImage();

module.exports = issuer;
