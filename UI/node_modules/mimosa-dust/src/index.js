"use strict";

var path = require( "path" )
  , config = require( "./config" )
  , getExtensions = function ( mimosaConfig ) {
    return mimosaConfig.dust.extensions;
  };

var prefix = function ( mimosaConfig, libraryPath ) {
  if ( mimosaConfig.template.wrapType === "amd" ) {
    return "define(['" + libraryPath + "'], function (dust){ ";
  } else {
    if ( mimosaConfig.template.wrapType === "common" ) {
      return "var dust = require('" + mimosaConfig.template.commonLibPath + "');\n";
    }
  }

  return "";
};

var suffix = function ( mimosaConfig ) {
  if ( mimosaConfig.template.wrapType === "amd" ) {
    return "return dust; });";
  } else {
    if ( mimosaConfig.template.wrapType === "common" ) {
      return "\nmodule.exports = dust;";
    }
  }

  return "";
};

var compile = function ( mimosaConfig, file, cb ) {
  var error, output;

  try {
    output = mimosaConfig.dust.lib.compile( file.inputFileText, file.templateName );
  } catch (err) {
    error = err;
  }

  cb( error, output );
};

module.exports = {
  name: "dust",
  compilerType: "template",
  clientLibrary: path.join( __dirname, "client", "dust.js" ),
  handlesNamespacing: true,
  compile: compile,
  suffix: suffix,
  prefix: prefix,
  extensions: getExtensions,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
