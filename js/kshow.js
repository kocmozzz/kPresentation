(function (window, document) {
    this.KShow = function () {
        var defaults = {
                presentationClass: 'k-presentation',
                slideTag: 'section',
                hiddenClass: 'hidden'
            },
            instance = this;

        /**
         * Use KShow as singleton
         * @returns {*}
         * @constructor
         */
        KShow = function () {
            return instance;
        };

        KShow.prototype = this;
        instance = new KShow();
        instance.constructor = KShow();

        this.presentations = [];

        /**
         * Create new options by passing custom arguments
         */
        if (arguments[0] && typeof arguments[0] == 'object') {
            this.options = this.extendDefaultOptions(defaults, arguments[0]);
        } else {
            this.options = defaults;
        }

        /**
         * Event handlers
         * @type {{keydown: Function}}
         */
        this.handlers = {
            start: function (e) {
                var presentation = e.target;

                if (!presentation.classList.contains(this.options.presentationClass)) {
                    while (!presentation.classList.contains(this.options.presentationClass)) {
                        presentation = presentation.parentNode;
                    }
                }

                var index = this.presentationsDomObjects.indexOf(presentation);

                if (index !== -1) {
                    if (this.presentations[index].isNavigated) {
                        return false;
                    } else {
                        this.presentations[index].startNavigatePresentation();
                    }

                    for (var i = 0, length = this.presentationsDomObjects.length; i < length; i++) {
                        if (i === index) continue;

                        this.presentationsDomObjects[i].classList.add(this.options.hiddenClass);
                    }
                }

                e.stopImmediatePropagation();
            },

            stop: function () {
                for (var i = 0, length = this.presentationsDomObjects.length; i < length; i++) {
                    this.presentationsDomObjects[i].classList.remove(this.options.hiddenClass);
                }

            }
        };

        /**
         * Initialize object of kShow
         */
        function init() {
            this.presentationsDomObjects = document.getElementsByClassName(this.options.presentationClass);
            this.presentationsDomObjects = Array.prototype.slice.call(this.presentationsDomObjects);

            var length = this.presentationsDomObjects.length;

            if (!length) {
                console.warn("No presentations available. Check presentations class selector.");
            }

            for (var i = 0; i < length; i++) {
                this.add(new KPresentation(this.presentationsDomObjects[i], this.options.slideTag));
            }
        }

        function bind() {
            var self = this;

            self.presentationsDomObjects.forEach(function (presentation) {
                presentation.addEventListener('click', self.handlers.start.bind(self), false);
            });
            document.addEventListener("presentation:closed", self.handlers.stop.bind(self));
        }

        init.call(this);
        bind.call(this);

        return instance;
    };

    KShow.prototype = new Helper();

    /**
     * Add presentation to list
     * @param obj
     * @returns {KShow}
     */
    KShow.prototype.add = function (obj) {
        this.presentations.push(obj);

        return this;
    };

    /**
     * Get presentations count
     * @returns {Number}
     */
    KShow.prototype.count = function () {
        return this.presentations.length;
    };

    /**
     * Get presentation by index
     * @param index
     * @returns {*}
     */
    KShow.prototype.get = function (index) {
        if (index > -1 && index < this.presentations.length) {
            return this.presentations[index];
        }
        return false;
    };

    /**
     * Remove presentation at index
     * @param index
     * @returns {KShow}
     */
    KShow.prototype.remove = function (index) {
        this.presentations.splice(index, 1);

        return this;
    };

})(this, this.document);