(function (window, document) {
    this.KShow = function () {
        var defaults = {
                presentationClass: 'k-presentation',
                frameClass: 'k-presentation-frame'
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
            keydown: function (e) {
                if (!e) e = event;

                switch (e.keyCode) {
                    case 27:
                        this.notify('button:esc');
                        break;
                    case 37:
                        this.notify('button:prev');
                        break;
                    case 39:
                        this.notify('button:next');
                        break;
                    case 32:
                        this.notify('button:space');
                        break;
                    default:
                        break;
                }
            }
        };

        /**
         * Initialize object of kShow
         */
        function init() {
            var presentationsDomObjects = document.getElementsByClassName(this.options.presentationClass),
                length = presentationsDomObjects.length;

            if (!length) {
                console.warn("No presentations available. Check presentations class selector.");
            }

            for (var i = 0; i < length; i++) {
                this.add(new KPresentation(presentationsDomObjects[i], this.options.frameClass));
            }
        }

        function bind() {
            document.onkeydown = this.handlers.keydown.bind(this);
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

    /**
     * Notify presentations about key events
     * @param context
     */
    KShow.prototype.notify = function (context) {
        var count = this.count();

        for (var i = 0; i < count; i++) {
            this.get(i).handle(context);
        }
    };

})(this, this.document);