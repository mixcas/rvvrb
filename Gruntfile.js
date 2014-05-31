//Gruntfile
  module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-connect');
 
  //Initializing the configuration object
  grunt.initConfig({
  
    //Tasks
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          keepalive: true
        }
      }
    }

  });

}
