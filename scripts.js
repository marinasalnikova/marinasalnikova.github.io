const markdownIt = require("markdown-it");

module.export = function (eleventyConfig) {
    eleventyConfig.addLiquidTag("markdownIt", function (liquidEngine) {
        return {
            parse: function (tagToken, remainingTokens) {
                this.str = tagToken.args; // {{ markdownIt variable }} or {{ markdownIt "some text" }}
            },
            render: function (scope, hash) {
                // Resolve variables
                var str = liquidEngine.evalValue(this.str, scope);

                // Do the uppercasing
                return Promise.resolve(str.toUpperCase());
            },
        };
    });
};
