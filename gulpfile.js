var gulp = require('gulp');
var zip = require('gulp-vinyl-zip').zip;

gulp.task('build-zip', () => {
	return gulp.src([
		'src/**',
		'LICENSE',
		'package.json',
		'github-assets/**',
		'README.md'
	], { base: '.' })
		.pipe(zip(`vscode-log-output-colorizer.zip`))
		.pipe(gulp.dest('./out'));
});