module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      build: ['dist/']
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
          'docs/author.css': 'author/styles.less',
          'docs/viewer.css': 'viewer/styles.less'
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
          system: {
            main: ['author/app'],
            config: 'package.json!npm',
            bundle: [
              'author/app-template',
              'author/src/src',
              'author/styles.less!',
              'author/ckeditor/ckeditor'
            ]
          },
          buildOptions: {
            minify: true,
            bundleSteal: false
          }
        }
      },
      viewer:{
        options: {
          system: {
            main: ['viewer/app'],
            config: 'package.json!npm'
          },
          buildOptions: {
            minify: true,
            bundleSteal: false
          }
        }
      },
    }
  });

  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('steal-tools');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.renameTask('documentjs', 'documentjs-orig');

  grunt.registerTask('svg-styles', ['less:svg']);
  grunt.registerTask('build', ['clean:build', 'steal-build']);
  grunt.registerTask('documentjs', [
    'documentjs-orig',
    'copy:icon-font',
    'copy:demos',
    'less:docs'
  ]);

};
