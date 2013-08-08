"use strict"
sass                = require("node-sass")
path                = require("path")
fs                  = require("fs")
_                   = require("underscore")
WebSocketClient     = require("websocket").client
shell               = require("shelljs")

module.exports = (grunt) ->
  grunt.registerTask "install_takana", "Integrates project with Takana", ->
    done = @async()

    options = @options(
      path: projectPath()
      name: projectName()
      shouldLaunch: true
    )

    register options, =>  
      printInstallationInstructions(options.name)   
      done() 

  grunt.registerMultiTask "takana", "Compile SCSS to CSS", ->
    done = @async()

    options = @options(
      includePaths: []
      outputStyle: "nested"
      path: projectPath()
      name: projectName()
      shouldLaunch: false
    )

    register options, =>
      grunt.log.writeln "Compiling Sass files"
      grunt.util.async.forEachSeries @files, ((el, next) ->
        sass.render
          file: el.src[0]
          success: (css) ->
            grunt.file.write el.dest, css
            next()

          error: (err) ->
            grunt.warn err

          includePaths: options.includePaths
          outputStyle:  options.outputStyle
      ), @async()

  projectName = ->
    path.basename(process.cwd())

  projectPath = ->
    process.cwd()

  printInstallationInstructions = (name) ->
    grunt.log.subhead("Integrate Takana with #{}")
    grunt.log.writeln("Add this script tag just before </body> on every page you want to live edit")
    grunt.log.writeln("<script data-project=\"" + name + "\" src=\"http://localhost:48626/takana.js\"></script>")


  # attempts to create a websocket connection
  connect = (cb) ->
    client = new WebSocketClient()

    client.on "connectFailed", (error) =>
      cb(error, null)

    client.on "connect", (connection) ->
      cb(null, connection)

    client.connect "ws://localhost:48626/control"

  # auto-retries and waits 5 seconds before timing out 
  waitForConnection = (cb) ->
    timeout = 5000
    timedOut = false

    failureTimeout = setTimeout ->
      timedOut = true
      cb(true, null)
    , timeout

    onConnect = (err, connection) ->
      if err && !timedOut
        setTimeout ->
          connect onConnect
        , 1000

      else 
        clearTimeout failureTimeout
        cb(null, connection)

    connect onConnect

  launchAndConnect = (cb) ->
    # try and connect once (Takana is already running)
    connect (err, connection) ->
      if err
        shell.exec("open -a Takana")
        waitForConnection cb
      else
        cb(err, connection)


  register = (options, cb) -> 
    supportDir = path.join(process.env.HOME, 'Library/Application Support/Takana/')

    if !(fs.existsSync(supportDir))
      grunt.log.error "Couldn't find Takana Mac app, is it installed?"
      return

    connectionManager = connect
    if options.shouldLaunch
      connectionManager = launchAndConnect

    connectionManager (err, connection) ->
      if err
        cb()

      else if connection 
        projectData = 
          path: options.path
          name: options.name

        projectData.includePaths = options.includePaths if options.includePaths

        message = 
          event: 'project/add'
          data: projectData

        connection.send JSON.stringify(message)

        grunt.log.write "Syncing project with Takana..."

        message = 
          event: 'project/update'
          data: projectData

        connection.send JSON.stringify(message)

        connection.on "error", (error) ->
          grunt.error "Couldn't register project, connection failed", error
          connection.close()
          cb()

        connection.on "close", ->
          cb()

        connection.on "message", (message) ->
          grunt.log.ok()
          connection.close()
          cb()
  @