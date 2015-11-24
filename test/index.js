var test = require('tap').test;
var fixtures = require('./fixtures');
var expectations = require('./expectations');
var path = require('path');
var shpFairy = require('..');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

test('valid zipfiles', function(group) {
  Object.keys(fixtures.valid).forEach(function(k) {
    group.test(fixtures.valid[k], function(t) {
      shpFairy(fixtures.valid[k], function(err, output) {
        t.ifError(err, k + ': found valid shapefile');
        if (err) return t.end();

        var base = path.basename(output, '.shp');
        var dir = path.dirname(output);

        ['.shp', '.shx', '.dbf'].forEach(function(ext) {
          t.ok(fs.existsSync(path.join(dir, base + ext)), k + ': ' + ext + ' exists');
        });

        fs.readdirSync(dir).forEach(function(filename) {
          var ext = path.extname(filename).slice(1);
          if (!expectations.valid[k].hasOwnProperty(ext)) {
            t.fail(k + ': unexpected ' + ext + ' file created');
          }
          var stats = fs.statSync(path.join(dir, filename));
          t.equal(expectations.valid[k][ext], stats.size, k + ': ' + ext + ' is the correct size');
        });

        return t.end();
      });
    });
  });
  group.end();
});

test('invalid zipfiles', function(group) {
  Object.keys(fixtures.invalid).forEach(function(k) {
    group.test(fixtures.invalid[k], function(t) {
      shpFairy(fixtures.invalid[k], function(err, output) {
        t.ok(err, 'expected error');
        t.equal(err.message, expectations.invalid[k]);
        t.end();
      });
    });
  });
  group.end();
});

test('executable script: valid case', function(t) {
  var valid = [
    path.resolve(__dirname, '..', 'bin', 'shapefile-fairy.js'),
    fixtures.valid.world
  ].join(' ');

  exec(valid, function(err, stdout, stderr) {
    if (err) throw err;
    t.notOk(stderr, 'no errors logged');
    fs.exists(stdout.slice(0, -1), function(exists) {
      t.ok(exists, 'output exists');
      t.end();
    });
  });
});

test('executable script: invalid case', function(t) {
  var valid = [
    path.resolve(__dirname, '..', 'bin', 'shapefile-fairy.js'),
    fixtures.invalid.noshp
  ].join(' ');

  exec(valid, function(err, stdout, stderr) {
    t.ok(err, 'expected error');
    t.equal(err.code, 3, 'expected exit code');
    t.equal(stdout, 'Usage: shapefile-fairy <path to zipped shapefile>\n', 'usage logged to stdout');
    t.equal(stderr, 'ZIP file did not contain a shp file\n', 'expected error message');
    t.end();
  });
});

test('executable script: invalid case with --quiet', function(t) {
  var valid = [
    path.resolve(__dirname, '..', 'bin', 'shapefile-fairy.js'),
    fixtures.invalid.noshp,
    '--quiet'
  ].join(' ');

  exec(valid, function(err, stdout, stderr) {
    t.ok(err, 'expected error');
    t.equal(err.code, 3, 'expected exit code');
    t.equal(stdout, '', 'empty stdout');
    t.equal(stderr, 'ZIP file did not contain a shp file\n', 'expected error message');
    t.end();
  });
});
