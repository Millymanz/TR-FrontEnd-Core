"use strict";

exports.defaults = function() {
  return {
    copy: {
      extensions: ["js","css","png","jpg","jpeg","gif","html","php","eot","svg","ttf","woff","woff2","otf","yaml","kml","ico","htc","htm","json","txt","xml","xsd","map","md","mp4","mp3","swf"],
      exclude: []
    }
  };
};

exports.validate = function(config, validators) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "copy config", config.copy) ) {
    validators.isArrayOfStrings( errors, "copy.extensions", config.copy.extensions );
    validators.ifExistsFileExcludeWithRegexAndString( errors, "copy.exclude", config.copy, config.watch.sourceDir );
  }

  return errors;
};
