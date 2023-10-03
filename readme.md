# shapefile-fairy

[![Node.js CI](https://github.com/mapbox/shapefile-fairy/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/mapbox/shapefile-fairy/actions/workflows/test.yml)

Extracts files composing a shapefile from a .zip archive into a temporary directory and returns the path to the `.shp` file.

[![Build Status](https://travis-ci.com/mapbox/shapefile-fairy.svg?branch=master)](https://travis-ci.com/mapbox/shapefile-fairy)

## Install

```sh
$ npm install -g @mapbox/shapefile-fairy
```

## Usage

In shell scripts
```sh
# exit 1 on failure, exit 0 on success and prints output path to stdout
$ shapefile-fairy /path/to/zipped/shapefile.zip
```

In JavaScript
```javascript
var shpFairy = require('@mapbox/shapefile-fairy');

shpFairy('/path/to/zipped/shapefile.zip', function(err, output) {
  if (err) return console.error(err);
  doSomethingWith(output);
});
```
