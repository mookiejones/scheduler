var source = require( 'vinyl-source-stream' );
var gulp = require( 'gulp' );
var del = require( 'del' );
var fs = require( 'fs' );
var browserify = require( 'browserify' );
var watchify = require( 'watchify' );
var path = require( 'path' );

//var tfsDir = "C:/Users/jkrogman/Documents/TFS/Web/reporting/assembly/"
var tfsDir = "C:/Users/mhartman/Source/Workspaces/Web/reporting/assembly/"

var scriptsDir = './src/js';
var buildDir = 'dist/js';
var mainFile = 'main.jsx';
var distFile = 'assembly-offload-bundle-test.js';
var prepare_type = "test";
gulp.task( 'scripts', [ 'transform' ], function () {
    gulp.src( './src/js/**.js' )
        .pipe( gulp.dest( tfsDir + 'js/' ) );
} );

gulp.task( 'styles', function () {
    gulp.src( './src/css/**' )
        .pipe( gulp.dest( tfsDir + 'css/' ) );

    gulp.src( './node_modules/react-data-grid/themes/react-data-grid.css' )
        .pipe( gulp.dest( tfsDir + 'css/' ) );

    gulp.src( './node_modules/react-date-picker/theme/hackerone.css' )
        .pipe( gulp.dest( tfsDir + 'css/' ) );
} );

gulp.task( 'html', function () {
    gulp.src( './src/assembly-offload-app.html' )
        .pipe( gulp.dest( tfsDir ) );
} );

gulp.task( 'transform', function () {
    browserify( scriptsDir + "/" + mainFile )
        .transform( "babelify", {
            sourceMapsAbsolute: true,
            presets: [ "latest", "react" ]
        } )
        .bundle()
        .pipe( fs.createWriteStream( tfsDir + "/js/" + distFile ) );
} );

gulp.task( 'watch', function () {
    gulp.watch( './src/js/**', [ 'transform' ] );
    gulp.watch( './src/css/**', [ 'styles' ] );
} );

const getDestination = () => {
    let result = prepare_type === "test" ?
        `\\\\norweb/NorwebPortalTest/reporting/paint/` :
        `\\\\norweb/wwwroot/reporting/paint`;
    return result;
}

const createDirectory = ( dir ) => {
    if ( !fs.existsSync( dir ) ) {
        console.warn( `Creating directory for ${dir}` );
        fs.mkdirSync( dir );
    }
    return dir;
}


const getFiles = ( dir ) => {
    // Does Directory exist?
    let exists = fs.existsSync( dir );
    console.log( exists );
    let result = fs.readdirSync( dir );
    return result;

}

const copyFile = ( s, c ) => {
    let target = getDestination();
    // Does source file exist
    if ( !fs.existsSync( s ) )
        throw new Error( `File doesnt exist at ${s}` );

    fs.copyFileSync( s, path.join( target, c ) );

}
gulp.task( 'prepare', () => {
    var name = require( './build/manifest.json' )[ "name" ];
    let target = getDestination();
    console.log( target );


    const built_dir = path.join( process.cwd(), "build" );


    const image_dir = path.join( built_dir, "img" );

    // Does image directory exist on target?
    const target_image_dir = createDirectory( path.join( target, "img" ) );
    // Lets copy the images first to get that out of the way.
    gulp.src( `${image_dir}/**` )
        .pipe( gulp.dest( target_image_dir + "/" ) );



    const getBuild = ( source ) => path.join( built_dir, source );

    console.log( `build directory is ${built_dir}` )

    // Does Build directory even exist?
    if ( !fs.existsSync( built_dir ) )
        throw new Error( `the directory doesnt exist at ${built_dir}` );



    const index = getBuild( `index.html` );
    // Does the index file exist?
    if ( !fs.existsSync( index ) )
        throw new Error( "Theres no index file" );
    gulp.src( path.join( built_dir, "static/**" ) )
        .pipe( gulp.dest( "\\\\norweb/NorwebPortalTest/static" ) );


    copyFile( getBuild( "asset-manifest.json" ), `${name}-asset-manifest.json` );
    copyFile( index, `${name}.html` );

} )

gulp.task( "test", [ "prepare" ], () => {
    console.log( "done" );
} )

gulp.task( "prod", () => {
    prepareFiles( "prod" )

} )
gulp.task( 'default', [ 'scripts', 'styles', 'html', 'watch' ] );