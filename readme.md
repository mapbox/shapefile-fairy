# shapefile-fairy

![the shapefile fairy](https://cloud.githubusercontent.com/assets/83384/4899176/353c1124-6419-11e4-9d3c-6c84f4da4148.png)

Extracts files composing a shapefile from a .zip archive into a temporary directory and returns the path to the `.shp` file.

[![Build Status](https://travis-ci.org/mapbox/shapefile-fairy.svg?branch=master)](https://travis-ci.org/mapbox/shapefile-fairy)

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
