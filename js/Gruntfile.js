module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      build: ['dist/']
    },

    testee: {
      options: {
        verbose: false,
        reporter: 'Spec',
        browsers: ['firefox']
      },
      firefox: [
        'author/test/index.html',
        'viewer/test/index.html'
      ]
    },

    copy: {
      'icon-font': {
        expand: true,
        cwd: 'author/styles/',
        src: 'icon-font/**/*',
        dest: 'author/docs/demos/'
      },
      'demos': {
        expand: true,
        cwd: 'author/styles/style-guide/',
        src: 'demos/**/*',
        dest: 'author/docs/'
      }
    },

    less: {
      'docs': {
        files: {
          "author/docs/styles.css": "author/main.less"
        }
      }
    },

    'steal-build': {
      default: {
        options: {
          system: {
            config: 'package.json!npm',
            main: [
              'author/main',
              'viewer/app'
            ]
          },
          buildOptions: {
          }
        }
      }
    },

    jsbeautifier: {
      files: ['client/**/*.js'],
      options: {
        js: {
          indentSize: 2,
          indentChar: " ",
          indentWithTabs: false
        }
      }
    }
  });

  grunt.loadNpmTasks('testee');
  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('steal-tools');
	grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.renameTask('documentjs', 'documentjs-orig');

  grunt.registerTask('test', ['testee:firefox']);
	grunt.registerTask('beautify', ['jsbeautifier']);
  grunt.registerTask('build', ['clean:build', 'steal-build']);
  grunt.registerTask('documentjs', [
    'documentjs-orig',
    'copy:icon-font',
    'copy:demos',
    'less:docs'
  ]);

};
