module.exports = function (grunt) {

  grunt.initConfig({
    clean: {
      build: ['dist/'],
      cachedTemplate: ['node_modules/documentjs/site/static', 'node_modules/documentjs/site/templates']
    },

    jshint: {
      options: {
        jshintrc: '../.jshintrc'
      },
      all: ['author/**/*.js', 'viewer/**/*.js']
    },

    copy: {
      'icon-font': {
        expand: true,
        cwd: 'styles/',
        src: 'icon-font/**/*',
        dest: 'docs/demos/'
      },
      demos: {
        expand: true,
        cwd: 'styles/style-guide/',
        src: 'demos/**/*',
        dest: 'docs/'
      }
    },

    less: {
      docs: {
        files: {
          'docs/author.css': 'caja/author/styles.less',
          'docs/viewer.css': 'caja/viewer/styles.less'
        }
      },
      svg: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'styles/viewer-avatars.css': 'styles/viewer/avatars.less'
        }
      }
    },

    'steal-build': {
      author: {
        options: {
          steal: {
            main: ['caja/author/app'],
            config: __dirname + '/package.json!npm',
            bundle: [
              'caja/author/app-template',
              'caja/author/src/src',
              'caja/author/styles.less!',
              'caja/ckeditor/ckeditor'
            ]
          },
          buildOptions: {
            minify: true,
            sourceMaps: true,
            bundleSteal: false
          }
        }
      },
      viewer: {
        options: {
          steal: {
            main: ['caja/viewer/app'],
            config: __dirname + '/package.json!npm'
          },
          buildOptions: {
            minify: true,
            sourceMaps: true,
            bundleSteal: false
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('grunt-steal');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.renameTask('documentjs', 'documentjs-orig');

  grunt.registerTask('svg-styles', ['less:svg']);
  grunt.registerTask('build', ['clean:build', 'steal-build']);
  grunt.registerTask('documentjs', [
    'clean:cachedTemplate',
    'documentjs-orig',
    'copy:icon-font',
    'copy:demos',
    'less:docs'
  ]);

  grunt.registerTask('documentjs-lite', [
    'documentjs-orig',
    'copy:icon-font',
    'copy:demos',
    'less:docs'
  ]);
};
