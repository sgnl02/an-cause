module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		, clean: {
			options: {
				force: true
			},
			dist: ['dist/']
		}

		, mkdir: {
			create: {
				options: {
					create: ['dist/js', 'dist/stylesheets', 'dist/images', 'dist/icons', 'dist/fonts', 'dist/locales'],
					
				},
			},
		},

		copy: {
		 stylesheets: {
		  expand: true,
		  cwd: 'style/', 
		  src: ['**/images/**/*.{png,jpg,svg}'], 
		  dest:'dist/stylesheets/' 
		 },
		 style: {
		  expand: true,
		  cwd: 'style/', 
		  src: ['action_menu/**/*.{png,jpg,svg}', 'progress_activity/**/*.{png,jpg,svg}'], 
		  dest:'dist/style/' 
		 }
		 , styles: {
		  expand: true,
		  cwd: 'icons/', 
		  src: ['**/styles/**/*.{png,jpg,svg}'], 
		  dest:'dist/icons/' 
		 }
		 , fonts: {
			expand: true,
		  cwd: 'fonts/', 
		  src: ['**/FiraSans/**/*.{eot,otf,ttf,woff}'], 
		  dest:'dist/fonts/' 
		 }	 	
		 , images: {
			expand: true,
		  cwd: 'images/', 
		  src: ['**/*.{png,jpg,svg}'], 
		  dest:'dist/images/' 
		 }
		 , locales: {
			expand: true,
		  cwd: 'locales/', 
		  src: ['**/*'], 
		  dest:'dist/locales/' 	 
		 }
		 , manifest: {
			expand: true,
		  src: 'manifest.webapp', 
		  dest:'dist/' 	 
		 }
		 , data: {
			expand: true,
		  src: 'data.json', 
		  dest:'dist/' 	 
		 }		
		}

		, uglify: {
			options: {
				preserveComments: false
			},
			target: {
				files: {
					'dist/js/main.js': ['js/status.js', 'js/seekbars.js', 'js/l20n.js', 'js/an.js']
				},
			},
		}

		, cssmin: {
			ui: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'dist/stylesheets/ui.css': ['style/**/*.css', 'style_custom/main.css', 'fixes.css']
				},
			},
			root: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'dist/root.css': ['cross_browser.css', 'util.css', 'transitions.css', 'fonts.css']
				},
			},
			icons: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'dist/icons/styles/icons.css': ['icons/styles/**/*.css']
				},
			},
		}

		, htmlmin: {
			default: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'dist/index.html': 'index.html'
				},
			},
		}

		, watch: {
			ui: {
				files: ['style/**/*.css', 'style_custom/main.css'],
				tasks: ['cssmin:ui'],
				options: {
					livereload: true,
				}
			},
			root: {
				files: ['cross_browser.css', 'util.css', 'transitions.css', 'fonts.css'],
				tasks: ['cssmin:root'],
				options: {
					livereload: true,
				}
			},
			icons: {
				files: ['icons/styles/**/*.css'],
				tasks: ['cssmin:icons'],
				options: {
					livereload: true,
				}
			},
			html: {
				files: ['index.html'],
				tasks: ['htmlmin'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: ['js/status.js', 'js/seekbars.js', 'js/l20n.js', 'js/an.js'],
				tasks: ['uglify'],
				options: {
					livereload: true,
				}
			},
		}
	});

	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'mkdir', 'uglify', 'cssmin', 'copy', 'htmlmin']);
	grunt.registerTask('dev', ['default', 'watch']);

};
