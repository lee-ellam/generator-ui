'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.option('no-install', {
      type: Boolean,
      required: false,
      defaults: false,
      desc: 'When specified, npm dependencies are not installed'
    });
  },

  promptUser: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.blue('JustGiving UI module') + ' generator!'
    ));

    var prompts = [{
        name: 'projectName',
        message: 'What\'s the name of your module?'
      },
      {
        name: 'projectDescription',
        message: 'Give a short description of your module'
      },
      {
        name: 'githubOrganisation',
        message: 'What is your GitHub organisation?',
        default: 'JustGiving'
      },
      {
        name: 'githubUsername',
        message: 'What is your GitHub username?'
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of module do you want to create?',
        choices: [{
            name: 'Empty',
            value: 'empty'
          },
          {
            name: 'CSS',
            value: 'css'
          },
          {
            name: 'JavaScript',
            value: 'js'
          },
          {
            name: 'Template',
            value: 'template'
          },
          {
            name: 'Component (all of the above)',
            value: 'component'
        }]
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.projectType = props.projectType;
      this.projectName = props.projectName;
      this.projectDescription = props.projectDescription;
      this.githubUsername = props.githubUsername;
      this.githubOrganisation = props.githubOrganisation;

      done();
    }.bind(this));
  },

  moduleFilesAndDirs: function() {
    // create dirs
    var done = this.async();

    mkdirp('src');

    switch (this.projectType) {
      case 'empty':
        break;
      case 'css':
        mkdirp('src/less');
        this.copy(
          this.templatePath('src/less/index.less'),
          this.destinationPath('src/less/index.less')
        );
        break;
      case 'js':
        mkdirp('src/js');
        mkdirp('test');
        this.copy(
          this.templatePath('src/js/index.js'),
          this.destinationPath('src/js/index.js')
        );
        this.copy(
          this.templatePath('test/index.spec.js'),
          this.destinationPath('test/index.spec.js')
        );
        break;
      case 'template':
        mkdirp('src/templates');
        this.copy(
          this.templatePath('src/templates/index.html'),
          this.destinationPath('src/templates/index.html')
        );
        break;
      case 'component':
        mkdirp('src/less');
        mkdirp('src/js');
        mkdirp('src/templates');
        mkdirp('test');
        this.copy(
          this.templatePath('src/less/index.less'),
          this.destinationPath('src/less/index.less')
        );
        this.copy(
          this.templatePath('src/js/index.js'),
          this.destinationPath('src/js/index.js')
        );
        this.copy(
          this.templatePath('src/templates/index.html'),
          this.destinationPath('src/templates/index.html')
        );
        this.copy(
          this.templatePath('test/index.spec.js'),
          this.destinationPath('test/index.spec.js')
        );
        break;
    }
    done();
  },

  projectRootFiles: function () {
    // gitignore
    this.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    // editorconfig
    this.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    // jshint
    this.copy(
      this.templatePath('jshintrc'),
      this.destinationPath('.jshintrc')
    );

    // license
    this.template(
      this.templatePath('license'),
      this.destinationPath('license'),
      {
        githubOrganisation: this.githubOrganisation
      }
    );

    // readme
    this.template(
      this.templatePath('_readme.md'),
      this.destinationPath('readme.md'),
      {
        projectName: this.projectName,
        projectDescription: this.projectDescription,
        githubUsername: this.githubUsername,
        githubOrganisation: this.githubOrganisation,
        githubProjectName: this.projectName
      }
    );

    // package.json
    this.template(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        projectName: this.projectName,
        projectDescription: this.projectDescription,
        githubUsername: this.githubUsername,
        githubOrganisation: this.githubOrganisation,
        githubProjectName: this.projectName
      }
    );

    // bower.json
    this.template(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      {
        projectName: this.projectName,
        projectDescription: this.projectDescription,
        githubUsername: this.githubUsername,
        githubOrganisation: this.githubOrganisation,
        githubProjectName: this.projectName
      }
    );

    // gulpfile
    this.copy(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    // karma
    this.copy(
      this.templatePath('_karma.conf.js'),
      this.destinationPath('karma.conf.js')
    );
  },

  install: function () {
    if (this.options['no-install']) return;
    this.installDependencies();
  }
});
