mimosa-copy
===========

This is a Mimosa file copying "compiler". It copies files from a Mimosa project's source directory to its output directory.

For more information regarding Mimosa, see http://mimosa.io.

## Overview

Some files, for instance CoffeeScript, have specific compilers that are responsible for transforming input text (the `watch.sourceDir` in `mimosa-config`) to output text (the `watch.compiledDir` in `mimosa-config`).

This is a generic file copier for the Mimosa build tool serves as the "compiler" for files that do not need transformation.  

## Default Config

```javascript
copy: {
  extensions:
    ["js",  "css", "png", "jpg",
     "jpeg","gif", "html","php",
     "eot", "svg", "ttf", "woff",
     "otf", "yaml","kml", "ico",
     "htc", "htm", "json","txt",
     "xml", "xsd", "map", "md",
     "mp4"],
  exclude:[]
}
````

#### `extensions` array of strings
The extensions of files to copy from `sourceDir` to `compiledDir`. If you find yourself editing this list, consider [filing an issue](https://github.com/dbashford/mimosa-copy/issues/new) to get your extension added to the defaults.

#### `exclude` array of regex/string
Used to match files that should not be copied but that you might still want processed. String paths can be absolute or relative to the `watch.sourceDir`. Regexes are applied to the entire path.
