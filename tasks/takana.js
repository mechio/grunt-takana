/*
 * grunt-takana
 * https://github.com/mechio/takana
 *
 * Copyright (c) 2014 Mechio
 * Licensed under the MIT license.
 */

'use strict';

var path    = require('path'),
    takana  = require('takana'),
    fs      = require('fs');

module.exports = function(grunt) {
  grunt.registerTask('takana', 'start takana for this project', function() {
    this.async();
    
    var options = this.options({
      includePaths: [],
      path:         process.cwd()
    }); 

    takana.run({
      path:         fs.realpathSync(options.path),
      includePaths: options.includePaths
    });

  });
};
