const fs = require("fs");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");

// const scripts = require("./scripts");

module.exports = function (eleventyConfig) {
    eleventyConfig.addWatchTarget("src/_assets");

    // Configure markdown templates
    const markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
    });
    eleventyConfig.setLibrary("md", markdownLibrary);

    // Configure Liquid templates
    eleventyConfig.setLiquidOptions({
        dynamicPartials: true,
        strict_filters: true,
    });

    // custom filters
    eleventyConfig.addFilter("markdownIt", function (value) {
        return markdownLibrary.render(value);
    });

    // Make 404 page work with `eleventy --serve`
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync("_site/404.html");

                browserSync.addMiddleware("*", (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            },
        },
    });

    // compress html
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        // Eleventy 1.0+: use this.inputPath and this.outputPath instead
        if (outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
            });
            return minified;
        }

        return content;
    });

    /*
     * Favicon
     * Images
     * CNAME
     * Jquery & Form
     */
    eleventyConfig.addPassthroughCopy({
        "src/_assets/favicon": "favicon",
        "src/_assets/img": "img",
        "src/_assets/fonts": "fonts",
        CNAME: "CNAME",
        "node_modules/jquery/dist/jquery.min.js": "js/jquery.min.js",
        "node_modules/jquery-validation/dist/jquery.validate.min.js":
            "js/jquery.validate.min.js",
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            data: "_data",
        },
    };
};
