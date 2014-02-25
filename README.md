# grunt-takana

> Live edit SCSS stylesheets

# What is this?
grunt-takana is a Grunt plugin for Takana. With Takana you can see changes you make to SCSS or CSS files in Sublime Text instantly in your browser. 

# Getting started
This plugin works with grunt. If you haven't used grunt before, or are using another asset pipeline head over to mechio/takana and follow the instructions there.

For grunt users:
`npm install grunt-takana`

Then add this snippet to your Gruntfile
`grunt.loadNpmTasks('grunt-takana');`

And run `grunt takana` follow the instructions provided.

# Documentation

Options:

## includePaths

Type: `Array`
Default: `[]`

Import paths to include, the same option grunt-sass uses.
