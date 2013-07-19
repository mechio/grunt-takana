# grunt-takana

> Takana grunt plugin

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-takana --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-takana');
```

## The "takana" task

### Overview
In your project's Gruntfile, add a section named `takana` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  takana: {
    options: {
      projectName: "web-project-name" //optional
			includePaths: [] 						    //optional
    },
  },
})
```

### Options

#### options.projectName
Type: `String`
Default value: CURRENT_WORKING_DIRECTORy

A string value that is used as the Takana project name.

#### options.includePaths
Type: `Array`
Default value: []

A list of paths that should be used by the Sass compiler when @importing files.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  takana: {
    options: {},

  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.1.0 - first working version released
