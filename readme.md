# shapefile-fairy

Extracts files composing a shapefile from a .zip archive into a temporary directory and returns the path to the `.shp` file.

## Install

```sh
$ npm install -g shapefile-fairy
```

## Usage

In shell scripts
```sh
# exit 1 on failure, exit 0 on success and prints output path to stdout
$ shapefile-fairy /path/to/zipped/shapefile.zip
```

In JavaScript
```javascript
var shpFairy = require('shapefile-fairy');

shpFairy('/path/to/zipped/shapefile.zip', function(err, output) {
  if (err) return console.error(err);
  doSomethingWith(output);
});
```
