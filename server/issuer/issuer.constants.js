'use strict';

const glob = require('glob');
const issuer = require('../../.issuer-rc.json');
const path = require('path');

function findImage(imagePath) {
  let pattern;
  if (imagePath) {
    pattern = path.resolve(__dirname, '../../', imagePath);
  } else {
    pattern = path.resolve(__dirname,
      '../assets/issuer-image.@(svg|jpg|jpeg|png)');
  }

  const files = glob.sync(pattern);
  if (files.length > 1) {
    throw Error(`Found more than one image matching '${pattern}' pattern!`);
  }
  return (files.length === 1) ? files[0] : '';
}

issuer.imagePath = findImage(issuer.imagePath);

module.exports = issuer;
