/*
 * grunt-takana
 * https://github.com/mechio/grunt-takana
 *
 * Copyright (c) 2013 nc
 * Licensed under the MIT license.
 */

'use strict';

var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var fs = require('fs');
var underscore = require('underscore');

var DEBUG = false;

module.exports = function(grunt) {

  function resolvePath (string) {
    if (string.substr(0,1) === '~') {
      string = process.env.HOME + string.substr(1);
      return path.resolve(string);
    };
  };

  grunt.registerTask('takana', 'register load paths', function() {
    var done = this.async();

    var options = this.options({
      includePaths: [],
      projectName: path.basename(process.cwd()),
      projectPath: process.cwd()
    });

    grunt.log.writeln(["Takana: integrating with project " + options.projectName]);

    var dbFile = resolvePath("~/Library/Application Support/Edge/takana.db");
    var exists = fs.existsSync(dbFile);

    if (exists) {
      var db = new sqlite3.Database(dbFile);

      var Project = function(name) {
        this.name = name;

        var _this = this;

        this.find            = function(callback) {
          var findSQL = "SELECT id, name FROM projects WHERE name IS '" + _this.name + "'";
          if (DEBUG) {
            console.log("running %j", findSQL) 
          }

          db.get(findSQL, function(error, row) {
            if (error || !row) {
              callback(error, null);
            } else {
              _this.id = row.id;
              callback(null, _this);     
            };
          });
        };

        this.create          = function(callback) {
          var createSQL = "INSERT INTO projects ( name, path ) VALUES (?, ?)";
          if (DEBUG) {
            console.log("running %j", createSQL);
          }

          grunt.log.write("Takana: creating project...");

          db.run(createSQL, _this.name, options.projectPath, function(error, lastId, changes) {
            if (error) {
              grunt.log.writeln("failed");
              grunt.log.error("Please contact support <help@usetakana.com>");
              callback(error, null);

            } else {
              _this.find(function(error, project) {
                if (error) {
                  grunt.log.write("failed");
                  grunt.log.error("Please contact support <help@usetakana.com>");
                  callback(error, null);
                } else {
                  grunt.log.writeln("created")
                  grunt.log.subhead("Add this script tag just before </body> on every page you want to run Takana on")
                  grunt.log.writeln("\t<script data-project=\"" + project.name + "\" src=\"http://localhost:48626/edge.js\"></script>");
                  grunt.log.subhead("\t... or get the Chrome extension")
                  grunt.log.writeln("\thttps://chrome.google.com/webstore/detail/takana/bldhkhmklhojenikmgdcpdbjfffoeidb?hl=en\n")

                  callback(null, project);
                }
              });
            };
          });
        }

        this.findOrCreate    = function(callback) {
          this.find(function(error, project) {
            if (error || !project) {
              grunt.log.error("could not find existing project...creating one instead");
              _this.create(callback);

            } else {
              callback(null, project);
            }
          });
        };

        this.updateLoadPaths = function(loadPaths, callback) {
          var findSQL   = "SELECT id, path FROM load_paths WHERE project_id IS '" + _this.id + "'";
          var updateSQL = "INSERT INTO load_paths ( project_id, path ) VALUES ";
          if (DEBUG) {
            console.log("running %j", findSQL);
          }

          db.all(findSQL, function(error, rows) {
            if (error) { 
              callback(error, null); 
            } else {
              var paths      = underscore.pluck(rows, 'path');
              var pathsToAdd = underscore.difference(loadPaths, paths);

              if (DEBUG) {
                console.log("paths to add are %j", pathsToAdd);
              }

              if (pathsToAdd.length > 0) {
                var values = underscore.map(pathsToAdd, function(path) {
                  return "( " + _this.id + ", '" + path +  "' )";
                });

                values = values.join(',');

                var sql = updateSQL + values;

                if (DEBUG) {
                  console.log("running %j", sql);
                }
                db.exec(sql, callback);

              } else {
                callback(null, false);
              };
            };
          });
        };    

        return this;
      };

      var project = new Project(options.projectName);

      project.findOrCreate(function(error, project) {
        if (error || !project) {
          grunt.log.error(["Takana: could not find or create project " + options.projectName]);

          db.close();

        } else {
          project.updateLoadPaths(options.includePaths, function(error, added) {
            if (error) {
              grunt.log.error(["Takana: could not add load paths", error]);
            } else {
              if (!added) {
                grunt.log.writeln(["Takana: includePaths are up to date"]);
              } else {
                grunt.log.writeln(["Takana: added includePaths"]);
              };
            };

            db.close();
          });
        };
      });

    } else {
      grunt.log.writeln("Takana: could not find Takana on this machine. Be a 10x developer by using Takana today - visit http://usetakana.com for more information");
    };
  });

};
