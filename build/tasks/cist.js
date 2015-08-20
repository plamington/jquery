module.exports = function( grunt ) {

	"use strict";

	var fs = require( "fs" ),
		distpaths = [
			"dist/jquery.js",
			"dist/jquery.min.map",
			"dist/jquery.min.js"
		];

	// Process files for distribution
	grunt.registerTask( "dist", function() {
		var stored, flags, paths, nonascii;

		stored = Object.keys( grunt.config( "dst" ) );

		flags = Object.keys( this.flags );

		paths = [].concat( stored, flags ).filter(function( path ) {
			return path !== "*";
		});

		nonascii = false;

		distpaths.forEach(function( filename ) {
			var i, c,
				text = fs.readFileSync( filename, "utf8" );

			if ( /\x0d\x0a/.test( text ) ) {
				grunt.log.writeln( filename + ": Incorrect line endings (\\r\\n)" );
				nonascii = true;
			}

			if ( text.length !== Buffer.byteLength( text, "utf8" ) ) {
				grunt.log.writeln( filename + ": Non-ASCII characters detected:" );
				for ( i = 0; i < text.length; i++ ) {
					c = text.charCodeAt( i );
					if ( c > 127 ) {
						grunt.log.writeln( "- position " + i + ": " + c );
						grunt.log.writeln( "-- " + text.substring( i - 20, i + 20 ) );
						break;
					}
				}
				nonascii = true;
			}

			paths.forEach(function( path ) {
				var created;

				if ( !/\/$/.test( path ) ) {
					path += "/";
				}

				created = path + filename.replace( "dist/", "" );
				grunt.file.write( created, text );
				grunt.log.writeln( "File '" + created + "' created." );
			});
		});

		return !nonascii;
	});
};
