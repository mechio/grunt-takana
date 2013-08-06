(function() {
  "use strict";
  var WebSocketClient, fs, path, sass, shell, _;

  sass = require("node-sass");

  path = require("path");

  fs = require("fs");

  _ = require("underscore");

  WebSocketClient = require("websocket").client;

  shell = require("shelljs");

  module.exports = function(grunt) {
    var connect, launchAndConnect, printInstallationInstructions, projectName, projectPath, register, waitForConnection;
    grunt.registerTask("install_takana", "Integrates project with Takana", function() {
      var done, options,
        _this = this;
      done = this.async();
      options = this.options({
        path: projectPath(),
        name: projectName(),
        shouldLaunch: true
      });
      return register(options, function() {
        printInstallationInstructions(options.name);
        return done();
      });
    });
    grunt.registerMultiTask("takana", "Compile SCSS to CSS", function() {
      var done, options,
        _this = this;
      done = this.async();
      options = this.options({
        includePaths: [],
        outputStyle: "nested",
        path: projectPath(),
        name: projectName(),
        shouldLaunch: false
      });
      return register(options, function() {
        grunt.log.writeln("Compiling Sass files");
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
        }), done());
      });
    });
    projectName = function() {
      return path.basename(process.cwd());
    };
    projectPath = function() {
      return process.cwd();
    };
    printInstallationInstructions = function(name) {
      grunt.log.subhead("Integrate Takana with ");
      grunt.log.writeln("Add this script tag just before </body> on every page you want to live edit");
      return grunt.log.writeln("<script data-project=\"" + name + "\" src=\"http://localhost:48626/takana.js\"></script>");
    };
    connect = function(cb) {
      var client,
        _this = this;
      client = new WebSocketClient();
      client.on("connectFailed", function(error) {
        return cb(error, null);
      });
      client.on("connect", function(connection) {
        return cb(null, connection);
      });
      return client.connect("ws://localhost:48626/control");
    };
    waitForConnection = function(cb) {
      var failureTimeout, onConnect, timedOut, timeout;
      timeout = 5000;
      timedOut = false;
      failureTimeout = setTimeout(function() {
        timedOut = true;
        return cb(true, null);
      }, timeout);
      onConnect = function(err, connection) {
        if (err && !timedOut) {
          return setTimeout(function() {
            return connect(onConnect);
          }, 1000);
        } else {
          clearTimeout(failureTimeout);
          return cb(null, connection);
        }
      };
      return connect(onConnect);
    };
    launchAndConnect = function(cb) {
      return connect(function(err, connection) {
        if (err) {
          shell.exec("open -a Takana");
          return waitForConnection(cb);
        } else {
          return cb(err, connection);
        }
      });
    };
    register = function(options, cb) {
      var connectionManager, supportDir;
      supportDir = path.join(process.env.HOME, 'Library/Application Support/Takana/');
      if (!(fs.existsSync(supportDir))) {
        grunt.log.error("Couldn't find Takana Mac app, is it installed?");
        return;
      }
      connectionManager = connect;
      if (options.shouldLaunch) {
        connectionManager = launchAndConnect;
      }
      return connectionManager(function(err, connection) {
        var message, projectData;
        if (err) {
          return cb();
        } else if (connection) {
          projectData = {
            path: options.path,
            name: options.name
          };
          if (options.includePaths) {
            projectData.includePaths = options.includePaths;
          }
          message = {
            event: 'project/add',
            data: projectData
          };
          connection.send(JSON.stringify(message));
          grunt.log.write("Syncing project with Takana...");
          message = {
            event: 'project/update',
            data: projectData
          };
          connection.send(JSON.stringify(message));
          connection.on("error", function(error) {
            grunt.error("Couldn't register project, connection failed", error);
            connection.close();
            return cb();
          });
          connection.on("close", function() {
            return cb();
          });
          return connection.on("message", function(message) {
            grunt.log.ok();
            connection.close();
            return cb();
          });
        }
      });
    };
    return this;
  };

}).call(this);
