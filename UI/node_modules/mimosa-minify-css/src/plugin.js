"use strict";

var logger = null
  , clean = null;

var _minifyCSS = function( mimosaConfig, options, next ) {

  if ( options.files && options.files.length ) {

    if ( !clean ) {
      var cleanCSS  = require( "clean-css" );
      clean = cleanCSS( mimosaConfig.minifyCSS.options );
    }

    options.files.forEach( function ( file, i ) {
      var fileName = file.outputFileName;
      var text = file.outputFileText;
      if ( text ) {
        if ( mimosaConfig.minifyCSS.excludeRegex && fileName.match( mimosaConfig.minifyCSS.excludeRegex ) ) {
          logger.debug( "Not going to minify [[ " + fileName + " ]], it has been excluded with a regex." );
        } else if ( mimosaConfig.minifyCSS.exclude.indexOf( fileName ) > -1 ) {
          logger.debug( "Not going to minify [[ " + fileName + " ]], it has been excluded with a string path." );
        } else {
          if ( logger.isDebug() ) {
            logger.debug( "Running minification on [[ " + fileName + " ]]" );
          }
          file.outputFileText = clean.minify( text );
          if ( clean.stats ) {
            var sizeDiff = clean.stats.originalSize - clean.stats.minifiedSize;
            if ( sizeDiff ) {
              var pcnt = Math.round( ( sizeDiff / clean.stats.originalSize  ) * 100 );
              mimosaConfig.log.info( "Saved [[ " + sizeDiff + " (" + pcnt + "%) ]] characters for file [[ " + file.inputFileName + " ]]");
            }
          }
        }
      }

      if ( i === options.files.length - 1 ) {
        next();
      }

    });
  } else {
    next();
  }
};

exports.registration = function ( mimosaConfig, register ) {
  if ( mimosaConfig.isOptimize || mimosaConfig.isMinify ) {
    logger = mimosaConfig.log;
    var e = mimosaConfig.extensions;
    register( ["add","update","buildExtension", "buildFile"], "beforeWrite", _minifyCSS, e.css );
  }
};
