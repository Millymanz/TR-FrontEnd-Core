"use strict";

var logger = null
  , config = require( "./config" )
  , getExtensions = function ( mimosaConfig ) {
    logger = mimosaConfig.log;
    return mimosaConfig.copy.extensions;
  };

var compile = function ( mimosaConfig, options, next ) {

  if ( options.files && options.files.length ) {
    var c = mimosaConfig.copy;

    options.files.forEach( function ( file ) {
      var inputFile = file.inputFileName;

      if ( file.outputFileText ) {
        if ( logger.isDebug() ) {
          logger.debug( "skipping copy file [[ " + inputFile + " ]], file aleady has output text." );
        }
      } else if ( c && c.excludeRegex && inputFile.match( c.excludeRegex ) ) {
        if ( logger.isDebug() ) {
          logger.debug( "skipping copy file [[ " + inputFile + " ]], file is excluded via regex" );
        }
      } else if ( c.exclude.indexOf( inputFile ) > -1 ) {
        if ( logger.isDebug() ) {
          logger.debug( "skipping copy file [[ " + inputFile + " ]], file is excluded via string path" );
        }
      } else {
        file.outputFileText = file.inputFileText;
      }
    });
  }

  next();
};

module.exports = {
  name: "copy",
  compilerType: "copy",
  compile: compile,
  extensions: getExtensions,
  defaults: config.defaults,
  validate: config.validate
};
