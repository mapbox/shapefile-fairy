var path = require('path');

module.exports = {
  valid: {
    world: path.join(__dirname, 'valid.world.zip'),
    caps: path.join(__dirname, 'valid.world.caps.zip'),
    backslash_single: path.join(__dirname, 'valid.backslash-single.zip'),
    backslash_double: path.join(__dirname, 'valid.backslash-double.zip'),
    everything: path.join(__dirname, 'valid.everything.zip') // all viable file extentions for a shapefile
  },
  invalid: {
    noshp: path.join(__dirname, 'invalid.noshp.zip'),
    nodbf: path.join(__dirname, 'invalid.nodbf.zip'),
    noshx: path.join(__dirname, 'invalid.noshx.zip'),
    empty: path.join(__dirname, 'invalid.empty.zip'),
    onlyshp: path.join(__dirname, 'invalid.onlyshp.zip'),
    multishp: path.join(__dirname, 'invalid.multishp.zip'),
    nozip: path.join(__dirname, 'invalid-zip')
  }
};
