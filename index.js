var zipfile = require('zipfile');
var path = require('path');
var os = require('os');
var fs = require('fs');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var queue = require('queue-async');

module.exports = function(filepath, callback) {
  filepath = path.resolve(filepath);

  fs.exists(filepath, function(exists) {
    if (!exists) return callback(new Error('No such file: ' + filepath));

    var zf = new zipfile.ZipFile(filepath);
    var files = getShapeFiles(zf);
    if (!files) return callback(invalid('Failed to find a shapefile in your zip'));

    extractFiles(zf, files, callback);
  });
};

function invalid(msg) {
  var err = new Error(msg);
  err.code = 'EINVALID';
  return err;
}

function getShapeFiles(zf) {
  // File exts to look for according to http://en.wikipedia.org/wiki/Shapefile
  var exts = [
    '.shp',
    '.shx',
    '.dbf',
    '.prj',
    '.sbn',
    '.sbx',
    '.fbn',
    '.fbx',
    '.ain',
    '.aih',
    '.ixs',
    '.mxs',
    '.atx',
    '.xml',
    '.cpg',
    '.qix'
  ];

  // Must contain some files
  if (zf.names.length === 0) return false;
  var filenames = zf.names;

  // Find .shp files
  var shapefileName = filenames.filter(function(filename) {
    if (path.extname(filename) === '.shp' && filename.indexOf("__MACOSX") === -1) return filename;
  });

  // Must contain exactly one .shp file
  if (shapefileName.length !== 1){
    return false;
  }

  // Find the shapefile's basename and dir inside the zip
  var shapefileBase = path.basename(shapefileName[0], '.shp');
  var shapefilePath = path.dirname(shapefileName[0]);

  // Find all the shapefile-files
  var shapeFiles = filenames.reduce(function(memo, filename) {
    var ext = path.extname(filename);
    if (ext === '.xml') ext = '.shp.xml';
    var base = path.basename(filename, ext);
    var dir = path.dirname(filename);

    if (base === shapefileBase &&
      dir === shapefilePath &&
      exts.indexOf(ext) > -1) memo[ext.slice(1)] = filename;

    return memo;
  }, {});

  // Must have the 3 required files
  if (!shapeFiles.shp || !shapeFiles.dbf || !shapeFiles.shx) return false;

  // Passed!
  return shapeFiles;
}

function sanitizeName(filename) {
  return path.basename(filename)
    .replace(/ /g, '_')
    .replace(/\\\\/g, '_');
}

function extractFiles(zf, files, callback) {
  var dir = path.join(
    os.tmpdir(),
    path.basename(files.shp, '.shp'),
    crypto.randomBytes(12).toString('hex')
  );

  function writeFile(filename, cb) {
    var cleanName = sanitizeName(filename);

    zf.readFile(filename, function(err, data) {
      if (err) return cb(invalid('Error reading file while unpacking!'));

      var outfile = path.join(dir, cleanName);
      fs.writeFile(outfile, data, function(err) {
        if (err) return cb(new Error('Error writing file while unpacking!'));
        cb();
      });
    });
  }

  mkdirp(dir, function(err) {
    if (err) return callback(err);

    var q = queue();

    Object.keys(files).forEach(function(ext) {
      q.defer(writeFile, files[ext]);
    });

    q.await(function(err) {
      if (err) return callback(err);
      callback(null, path.join(dir, sanitizeName(files.shp)));
    });
  });
}
