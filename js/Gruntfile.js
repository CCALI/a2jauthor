module.exports = function(grunt) {

  grunt.initConfig({
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
      }
    },

    'steal-build': {
      bundle: {
        options: {
          system: {
            config: 'package.json!npm'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('testee');
  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('steal-tools');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.renameTask('documentjs', 'documentjs-orig');

  grunt.registerTask('build', ['steal-build']);
  grunt.registerTask('test', ['testee:firefox']);
  grunt.registerTask('documentjs', ['documentjs-orig', 'copy:icon-font']);

};
