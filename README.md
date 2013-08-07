# grunt-takana

[Grunt][grunt] tasks to compile SCSS to CSS using [node-sass](https://github.com/andrew/node-sass)

*Requires grunt 0.4.*

## Overview

This task compiles Sass using node-sass based on libsass the C Sass compiler. It is much faster than the Ruby based compiler though it doesn't support Compass.

It also integrates your Grunt-based project with Takana [http://usetakana.com] so you can live-edit Sass and CSS stylesheets within your project. Changing HTML and JavaScript files will auto-refresh your browser too.

## Getting Started

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install --save-dev grunt-takana
```

[grunt]: http://gruntjs.com
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started


## Documentation

See the [Gruntfile](https://github.com/mechio/grunt-takana/blob/master/Gruntfile.coffee) in this repo for a full example.

### Options


#### includePaths

Type: `Array`  
Default: `[]`

Import paths to include.


#### outputStyle

Type: `String`  
Default: `nested`

Specify the CSS output style. Available styles are 'nested', 'expanded', 'compact', 'compressed'.

*According to the [node-sass](https://github.com/andrew/node-sass) documentation, there is currently a problem with lib-sass so this option is best avoided for the time being.*


### Example config

```javascript
grunt.initConfig({
  sass: {                 // Task
    dist: {               // Target
      files: {            // Dictionary of files
        'main.css': 'main.scss'   // 'destination': 'source'
      }
    },
    dev: {                // Another target
      options: {            // Dictionary of render options
        includePaths: [
          'path/to/imports/'
        ]
      },
      files: {
        'main.css': 'main.scss'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-takana');
grunt.registerTask('default', ['takana']);
```


### Example usage

#### Install Takana

Run `grunt install_takana` to print the Takana JavaScript integration snippet and integrate Takana with your Grunt project

#### Compile

```javascript
grunt.initConfig({
  sass: {
    dist: {
      files: {
        'main.css': 'main.scss'
      }
    }
  }
});
```


#### Compile with render options

If you specify `options`, they will be passed along to the [node-sass](https://github.com/andrew/node-sass) `render` method.

```javascript
grunt.initConfig({
  sass: {
    dist: {
      options: {
        includePaths: ['imports/are/here/'],
        outputStyle: 'nested'
      },
      files: {
        'main.css': 'main.scss'
      }
    }
  }
});
```


#### Compile multiple files

You can also compile multiple files into multiple destinations.

```javascript
grunt.initConfig({
  sass: {
    files: {
      'main.css': 'main.scss',
      'widgets.css': 'widgets.sass'
    }
  }
});
```
