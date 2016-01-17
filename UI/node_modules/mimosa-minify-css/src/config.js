"use strict";

exports.defaults = function() {
  return {
    minifyCSS: {
      exclude:[/\.min\./],
      options:{
        processImport:false,
        debug:true
      }
    }
  };
};


exports.placeholder = function () {
  var ph = "\n  minifyCSS:                    # Configuration for minifying/cleaning css using the\n" +
     "                                # --minify flag\n" +
     "    exclude:[/\\.min\\./]         # List of string paths and regexes to match files to exclude\n" +
     "                                # when running minification. Any path with \".min.\" in its name,\n" +
     "                                # is assumed to already be minified and is ignored by default.\n" +
     "                                # Paths can be relative to the watch.compiledDir, or absolute. \n" +
     "                                # Paths are to compiled files,  so '.css' rather than '.styl'\n" +
     "    options:                    =# Options for clean-css package, see list of options here\n" +
     "                                # https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically\n" +
     "      processImport: false      # defaults to not processing (stripping) @import statements";

  return ph;
};

exports.validate = function( config, validators )  {
  var errors = [];
  if ( validators.ifExistsIsObject( errors, "minifyCSS config", config.minifyCSS ) ) {
    validators.ifExistsFileExcludeWithRegexAndString( errors, "minifyCSS.exclude", config.minifyCSS, config.watch.compiledDir );
    if ( validators.ifExistsIsObject( errors, "minifyCSS.options", config.minifyCSS.options ) ) {
      if ( !config.minifyCSS.options ) {
        config.minifyCSS.options = {};
      }

      config.minifyCSS.options.debug = true;
    }
  }
  return errors;
};
