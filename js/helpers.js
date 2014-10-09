(function () {
    this.Helper = function () {
    };

    /**
     * Remove class from class attr of dom object
     * @param obj
     * @param className
     */
    Helper.prototype.removeClass = function (obj, className) {
        var classes = obj.className.split(' ');

        for (var i = 0; i < classes.length; i++) {
            if (classes[i] == className) {
                classes.splice(i, 1);
                i--;
            }
        }
        obj.className = classes.join(' ');
    };

    /**
     * Add class to class attr of dom object
     * @param obj
     * @param className
     */
    Helper.prototype.addClass = function (obj, className) {
        obj.className += ' ' + className;
    };

    /**
     * Check if obj has class
     * @param obj
     * @param className
     */
    Helper.prototype.hasClass = function (obj, className) {
        var classes = obj.className.split(' ');

        return !!~classes.indexOf(className);
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