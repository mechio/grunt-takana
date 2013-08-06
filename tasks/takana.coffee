"use strict"
sass        = require("node-sass")
path        = require("path")
Schema      = require("jugglingdb").Schema
fs          = require("fs")
_           = require("underscore")

module.exports = (grunt) ->
  grunt.registerMultiTask "takana", "Compile SCSS to CSS", ->
    done = @async()

    options = @options(
      includePaths: []
      outputStyle: "nested"
    )

    registerProject =>

      grunt.util.async.forEachSeries @files, ((el, next) ->
        sass.render
          file: el.src[0]
          success: (css) ->
            grunt.file.write el.dest, css
            next()

          error: (err) ->
            grunt.warn err

          includePaths: options.includePaths
          outputStyle: options.outputStyle
      )

  registerProject = (cb) ->
    supportDir = path.join(process.env.HOME, 'Library/Application Support/Takana/')
    database   = path.join(supportDir, 'takana.db')
    schema     = new Schema('sqlite3', database: database)

    if !(fs.existsSync(supportDir)) || !(fs.existsSync(database))
      grunt.log.writeln ["Takana: couldn't find Mac app, is Takana installed?"]
      cb() 
      return

    Project = schema.define("Project",
      path:
        type    : String
      name:
        type    : String
      createdAt:
        type    : Number
        default : Date.now
    )

    Project.validatesUniquenessOf('name', message: 'name is not unique')
    Project.validatesUniquenessOf('path', message: 'path is not unique')

    name = path.basename(process.cwd())
    path = process.cwd()

    Project.all (err, projects) ->
      existingProject = _.find projects, (project) ->  
        return project.name == name || project.path == path

      if existingProject
        grunt.log.oklns "Takana: syncing project '#{name}' (#{path})"
        cb()

      else
        grunt.log.write "Takana: adding project '#{name}' (#{path})..."

        project = new Project(path: path, name: name)
        project.save (err, project) ->
          if (err)
            grunt.log.error "failed"
            grunt.log.error err
          else
            grunt.log.oklns "OK"

          cb()

  @