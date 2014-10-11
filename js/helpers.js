(function () {
    this.Helper = function () {
    };

    /**
     * Extend default options
     * @param defaultOptions
     * @param customOptions
     * @returns {*}
     */
    Helper.prototype.extendDefaultOptions = function (defaultOptions, customOptions) {
        var property;

        for (property in customOptions) {
            if (customOptions.hasOwnProperty(property)) {
                defaultOptions[property] = customOptions[property];
            }
        }

        return defaultOptions;
    };
})();