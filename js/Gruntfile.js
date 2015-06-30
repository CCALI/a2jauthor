module.exports = function(grunt) {

  grunt.initConfig({
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

  grunt.loadNpmTasks('documentjs');
  grunt.loadNpmTasks('steal-tools');
  grunt.registerTask('build', [ 'steal-build' ]);

};
