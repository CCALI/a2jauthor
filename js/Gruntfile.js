module.exports = function(grunt) {

  grunt.initConfig({
		jsbeautifier: {
			files: ['client/components/**/*.js',
				'client/fixtures/**/*.js',
				'client/models/**/*.js',
				'client/util/**/*.js'],
			options: {
				js: {
					indentWithTabs: true,
					indentSize: 2
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: 'client',
					mainConfigFile: 'client/config.js',
					include: 'components/app/app',
					name: 'almond',
					out: 'client/app.min.js'
				}
			}
		},

    clean: {
      build: ['dist/']
    },

    testee: {
      options: {
        verbose: false,
        reporter: 'Spec',
        browsers: ['firefox']
      },
      firefox: ['author/test/index.html']
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
      bundle: {
        options: {
          system: {
            config: 'package.json!npm'
          },
          buildOptions: {
            bundleSteal: true
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('testee');
  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('steal-tools');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.renameTask('documentjs', 'documentjs-orig');

  grunt.registerTask('test', ['testee:firefox']);
  grunt.registerTask('build', ['clean:build', 'steal-build']);
  grunt.registerTask('documentjs', ['documentjs-orig', 'copy:icon-font', 'copy:demos', 'less:docs']);
	grunt.registerTask('beautify', ['jsbeautifier']);
	grunt.registerTask('default', ['requirejs']);

};
