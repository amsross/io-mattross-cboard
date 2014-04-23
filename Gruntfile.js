'use strict';

module.exports = function(grunt) {
	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			jade: {
				files: [
					'views/**/*.jade'
				],
				options: {
					livereload: true,
				},
			},
			js: {
				files: [
					'Gruntfile.js',
					'*.js',
					'routes/*.js',
					'private/js/**'
				],
				tasks: ['jshint', 'uglify'],
				options: {
					livereload: true,
				},
			},
			img: {
				files: [
					'private/img/**'
				],
				tasks: ['imagemin'],
				options: {
					livereload: true,
				},
			},
			jst: {
				options: {
					templateSettings: {
						variable: 'data'
					}
				},
				files: [
					'private/templates/**/*.ejs'
				],
				tasks: ['jst']
			},
			less: {
				files: [
					'private/less/*.less'
				],
				tasks: ['less'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: [
				'Gruntfile.js',
				'*.js',
				'routes/*.js',
				'private/js/**'
			]
		},
		jst: {
			compile: {
				options: {
					templateSettings: {
						variable: 'data'
					}
				},
				files: {
					'public/js/templates.js': ['private/templates/**/*.ejs']
				}
			}
		},
		less: {
			dist: {
				files: {
					'public/css/main.min.css': [
						'private/bower_components/pure/pure.css',
						'private/bower_components/font-awesome/css/font-awesome.css',
						'private/less/app.less'
					]
				},
				options: {
					compress: true,
					outputSourceFiles: true,
					sourceMap: true,
					sourceMapBasepath: '../../',
					sourceMapFilename: 'public/css/main.min.css.map',
					sourceMapURL: '/css/main.min.css.map'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'public/js/scripts.min.js': [
						'private/bower_components/jquery/dist/jquery.js',
						'private/bower_components/underscore/underscore.js',
						'private/bower_components/backbone/backbone.js',
						'private/bower_components/backbone.localStorage/backbone.localStorage.js',
						'private/bower_components/backbone.marionette/lib/backbone.marionette.js',
						'private/bower_components/jquery.slimscroll/jquery.slimscroll.js',
						'private/bower_components/Faker/Faker.js',
						'private/js/cBoard.js',
						'private/js/cBoard.Players.js',
						'private/js/cBoard.Layout.js',
						'private/js/cBoard.PlayerList.Views.js',
						'private/js/cBoard.PlayerList.js',
						'private/js/app.js'
					]
				},
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					sourceMapName: 'public/js/scripts.min.js.map'
				}
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'private/img/',
					src: '**/*',
					dest: 'public/img/'
				}]
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					file: 'server.js',
					args: [],
					ignoredFiles: ['public/**'],
					watchedExtensions: ['js'],
					nodeArgs: ['--debug'],
					delayTime: 0,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		mochaTest: {
			options: {
				reporter: 'spec',
				require: 'server.js'
			},
			src: ['test/mocha/**/*.js']
		},
		env: {
			prod : {
				src : '.env',
				options : {
					add : {
						NODE_ENV : 'production',
						MONGOHQ_URL : 'mongodb://localhost:27017'
					},
					replace : {
						NODE_ENV : 'production'
					}
				}
			},
			dev : {
				src : '.env',
				options : {
					add : {
						NODE_ENV : 'development',
						MONGOHQ_URL : 'mongodb://localhost:27017'
					},
					replace : {
						NODE_ENV : 'development'
					}
				}
			},
			n2o : {
				src : '.env',
				options : {
					add : {
						NODE_ENV : 'n2o',
						MONGOHQ_URL : 'mongodb://localhost:27017'
					},
					replace : {
						NODE_ENV : 'n2o',
					}
				}
			},
			test : {
				src : '.env',
				options : {
					add : {
						NODE_ENV : 'test',
						MONGOHQ_URL : 'mongodb://test_user:test_pass@localhost:27017/test_db'
					},
					replace : {
						NODE_ENV : 'test',
					}
				}
			}
		},
		copy: {
			fonts: {
				expand: true,
				flatten: true,
				src: [
					'private/bower_components/font-awesome/fonts/*',
				],
				dest: 'public/fonts/'
			}
		}
	});

	//Load NPM tasks
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-nodemon');

	//Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	grunt.registerTask('createDefaultTemplate', function () {
		grunt.file.write('public/js/templates.js', 'this.JST = this.JST || {};');
	});

	//Default task(s).
	grunt.registerTask('default', [
		'env:prod',
		'less',
		'createDefaultTemplate',
		'jst',
		'uglify',
		'imagemin',
		'copy:fonts'
	]);

	grunt.registerTask('n2o', [
		'env:n2o',
		'less',
		'createDefaultTemplate',
		'jst',
		'uglify',
		'imagemin',
		'copy:fonts',
		'concurrent'
	]);

	grunt.registerTask('dev', [
		'env:dev',
		'less',
		'createDefaultTemplate',
		'jst',
		'uglify',
		'imagemin',
		'copy:fonts',
		'concurrent'
	]);

	//Test task.
	grunt.registerTask('test', [
		'env:test',
		'mochaTest'
	]);
};
