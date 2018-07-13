'use strict';

const KEYWORD = 'openbadges';
const pngitxt = require('png-itxt');
const { iTXt } = pngitxt;

function bake(options, callback) {
  options = options || {};
  let assertion = options.url || options.data || options.assertion || options.signature;
  const { image: imageStream } = options;

  if (!imageStream) {
    return callback(new Error('Must pass an `image` option'));
  }

  if (!assertion) {
    return callback(new Error('Must pass an `assertion` or `signature` option'));
  }

  if (typeof assertion === 'object') {
    assertion = JSON.stringify(assertion);
  }

  const bakedStream = imageStream
    .pipe(pngitxt.set({ keyword: KEYWORD, value: null }, true))
    .pipe(pngitxt.set({ type: iTXt, keyword: KEYWORD, value: assertion }));

  return callback(null, bakedStream);
}

module.exports = bake;
