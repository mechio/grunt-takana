(function() {
  "use strict";
  var Schema, fs, path, sass, _;

  sass = require("node-sass");

  path = require("path");

  Schema = require("jugglingdb").Schema;

  fs = require("fs");

  _ = require("underscore");

  module.exports = function(grunt) {
    var registerProject;
    grunt.registerMultiTask("takana", "Compile SCSS to CSS", function() {
      var done, options,
        _this = this;
      done = this.async();
      options = this.options({
        includePaths: [],
        outputStyle: "nested"
      });
      return registerProject(function() {
        return grunt.util.async.forEachSeries(_this.files, (function(el, next) {
          return sass.render({
            file: el.src[0],
            success: function(css) {
              grunt.file.write(el.dest, css);
              return next();
            },
            error: function(err) {
              return grunt.warn(err);
            },
            includePaths: options.includePaths,
            outputStyle: options.outputStyle
          });
        }));
      });
    });
    registerProject = function(cb) {
      var Project, database, name, schema, supportDir;
      supportDir = path.join(process.env.HOME, 'Library/Application Support/Takana/');
      database = path.join(supportDir, 'takana.db');
      schema = new Schema('sqlite3', {
        database: database
      });
      if (!(fs.existsSync(supportDir)) || !(fs.existsSync(database))) {
        grunt.log.writeln(["Takana: couldn't find Mac app, is Takana installed?"]);
        cb();
        return;
      }
      Project = schema.define("Project", {
        path: {
          type: String
        },
        name: {
          type: String
        },
        createdAt: {
          type: Number,
          "default": Date.now
        }
      });
      Project.validatesUniquenessOf('name', {
        message: 'name is not unique'
      });
      Project.validatesUniquenessOf('path', {
        message: 'path is not unique'
      });
      name = path.basename(process.cwd());
      path = process.cwd();
      return Project.all(function(err, projects) {
        var existingProject, project;
        existingProject = _.find(projects, function(project) {
          return project.name === name || project.path === path;
        });
        if (existingProject) {
          grunt.log.oklns("Takana: syncing project '" + name + "' (" + path + ")");
          return cb();
        } else {
          grunt.log.write("Takana: adding project '" + name + "' (" + path + ")...");
          project = new Project({
            path: path,
            name: name
          });
          return project.save(function(err, project) {
            if (err) {
              grunt.log.error("failed");
              grunt.log.error(err);
            } else {
              grunt.log.oklns("OK");
            }
            return cb();
          });
        }
      });
    };
    return this;
  };

}).call(this);
