module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      build: ['dist/']
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
      },
      'svg': {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "viewer/styles/viewer-avatars.css": "viewer/styles/viewer-avatars.less"
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
            minify: true,
            bundleSteal: true
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('steal-tools');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.renameTask('documentjs', 'documentjs-orig');

  grunt.registerTask('svg-styles', ['less:svg']);
	grunt.registerTask('beautify', ['jsbeautifier']);
  grunt.registerTask('build', ['clean:build', 'steal-build']);
  grunt.registerTask('documentjs', [
    'documentjs-orig',
    'copy:icon-font',
    'copy:demos',
    'less:docs'
  ]);

};
