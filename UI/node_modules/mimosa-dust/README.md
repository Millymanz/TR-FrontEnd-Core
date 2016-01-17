mimosa-dust
===========

## Overview

This is a Dust compiler for the Mimosa build tool. This module is for use with Mimosa `2.0+`.  This replicates the functionality of the Dust compiler that was built into Mimosa before `2.0`.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'dust'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile Dust files during `mimosa watch` and `mimosa build`.

This module utilizes all of the built-in template behavior that comes with Mimosa's basic template compiler.  See the [mimosa website](http://mimosa.io/compilers.html#mt) for more information about how templates are treated or check out the various [`template` configuration options](http://mimosa.io/configuration.html#templates).

## Default Config

```coffeescript
dust:
  lib: undefined
  extensions: ["dust"]
```

* `lib`: You may want to use this module but may not be ready to use the latest version of Dust. Using the `lib` property you can provide a specific version of Dust if the one being used by this module isn't to your liking. To provide a specific version, you must have it `npm install`ed into your project and then provide it to `lib`. For instance: `lib: require('dustjs-linkedin')`.
* `extensions`: an array of strings, the extensions of your Dust files.