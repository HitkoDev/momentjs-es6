const gulp = require('gulp')
const rollup = require('gulp-better-rollup')
const flatmap = require('gulp-flatmap')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const sourcemaps = require('gulp-sourcemaps')

const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')

const path = require('path')

gulp.task('default', () => {
    return gulp.src('./rollups/**/*.js')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(rollup({
            plugins: [

                nodeResolve({
                    jsnext: true
                }),

                commonjs({}),
                replace({
                    'process.env.NODE_ENV': JSON.stringify('production')
                })
            ]
        }, {
                format: 'es'
            }))
        .pipe(flatmap((stream, file) =>
            stream
                .pipe(minify({
                    noSource: true,
                    compress: {
                        pure_getters: true,
                        unsafe: true,
                        unsafe_comps: true,
                        warnings: false
                    },
                    output: {
                        source_map: true
                    },
                    sourceMap: true
                }))
                .pipe(concat(path.basename(file.path)))
                .pipe(sourcemaps.write('.'))
        ))
        .pipe(gulp.dest('.'))
})
