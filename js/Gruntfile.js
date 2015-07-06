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

  grunt.registerTask('build', ['steal-build']);
  grunt.registerTask('test', ['testee:firefox']);

};
