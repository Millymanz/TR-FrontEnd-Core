"use strict";

exports.defaults = function() {
  return {
    dust: {
      extensions: [ "dust" ]
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  dust:                  # config settings for the Dust compiler module\n" +
         "    lib: undefined       # use this property to provide a specific version of Dust\n" +
         "    extensions: [\"dust\"]   # default extensions for Dust files\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "dust config", config.dust ) ) {

    if ( !config.dust.lib ) {
      config.dust.lib = require( "dustjs-linkedin" );
    }

    if ( validators.isArrayOfStringsMustExist( errors, "dust.extensions", config.dust.extensions ) ) {
      if (config.dust.extensions.length === 0) {
        errors.push( "dust.extensions cannot be an empty array");
      }
    }
  }

  return errors;
};
