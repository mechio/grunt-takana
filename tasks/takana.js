/*
 * grunt-takana
 * https://github.com/mechio/takana
 *
 * Copyright (c) 2014 Mechio
 * Licensed under the MIT license.
 */

'use strict';

var url     = require('url');
var path    = require('path');
var Client  = require('takana').Client;

module.exports = function(grunt) {
  grunt.registerTask('takana', 'Adds this project to Takana.', function() {
    var done = this.async();
    var cwd = process.cwd();

    var options = this.options({
      name: path.basename(cwd),
      path: cwd,
      includePaths: []
    });

    var client = new Client();

    var scriptTag = "<script>var a=document.createElement(\"script\");a.setAttribute(\"type\",\"text/javascript\");a.setAttribute(\"src\",\"http://\"+window.location.hostname+\":48626/takana.js\");a.setAttribute(\"data-project\",\"" + options.name + "\");document.body.appendChild(a);</script>";

    client.start(function() {
      grunt.log.subhead('Takana');
      grunt.log.oklns(' background process active');
      client.addProject(options, function() {
        grunt.log.oklns(' linked \'' + options.path + '\'');
        grunt.log.subhead('Install Takana (you only need to do this once per project)');
        grunt.log.writeln('1) add this JavaScript code just before the \'</body>\' tag on your webpages');
        grunt.log.writeln('');
        grunt.log.writeln(scriptTag);
        grunt.log.writeln('');
        grunt.log.writeln('2) $ npm install -g takana');
        grunt.log.writeln('3) $ takana sublime:install');
        grunt.log.writeln('4) Refresh your browser');
        grunt.log.writeln('5) Edit CSS or SCSS in Sublime Text');
        grunt.log.writeln('6) See your styles applied in real-time.');
        done()
      });
    });
  });

  return;
};
