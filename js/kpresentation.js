(function (window, document, undefined) {

    function Exception(message) {
        console.warn(message);
    }

    /**
     * Presentation
     * @param domObj
     * @param frameClassName
     * @constructor
     */
    this.KPresentation = function (domObj, frameClassName) {
        this.options = {
            activePresentationClass: 'isShown',
            activeFrameClass: 'active',
            browserPrefixes: [
                'WebkitTransform',
                'MozTransform',
                'msTransform',
                'OTransform',
                'transform'
            ]
        };

        this.isShown = false;
        this.slides = [];
        this.activeSlide = 0;
        this.slidesCount = 0;

        this.domObj = domObj;
        this.frameClassName = frameClassName;

        this.slides = this.domObj.getElementsByClassName(this.frameClassName);
        this.slidesCount = this.slides.length;

        function preparePresentationToBeShown() {
            this.domObj.addEventListener('click', this.startPresentation.bind(this));
        }

        function init() {
            if (this.slidesCount) {
                this.addClass(this.slides[0], this.options.activeFrameClass);
                preparePresentationToBeShown.call(this);
            } else {
                throw new Exception("No slides available. Check slides class selector.");
            }
        }

        init.call(this);
    };

    KPresentation.prototype = new Helper();

    /* Public methods */

    /**
     * Start presentation
     */
    KPresentation.prototype.startPresentation = function () {
        if (this.isShown) return;

        this.addClass(this.domObj, this.options.activePresentationClass);
        this.isShown = true;
        this.resize(this.computeScale());

        return this;
    };

    /**
     * Cancel presentation
     */
    KPresentation.prototype.stopPresentation = function () {
        this.removeClass(this.domObj, this.options.activePresentationClass);
        this.isShown = false;
        this.resize(1);

        return this;
    };

    /**
     * Go to next slide
     */
    KPresentation.prototype.next = function () {
        if (this.checkLast()) return;

        this.removeClass(this.slides[this.activeSlide], this.options.activeFrameClass);
        this.activeSlide++;
        this.addClass(this.slides[this.activeSlide], this.options.activeFrameClass);

        return this;
    };

    /**
     * Go to prev slide
     */
    KPresentation.prototype.prev = function () {
        if (this.checkFirst()) return;

        this.removeClass(this.slides[this.activeSlide], this.options.activeFrameClass);
        this.activeSlide--;
        this.addClass(this.slides[this.activeSlide], this.options.activeFrameClass);

        return this;
    };

    /**
     * Go to $index slide
     */
    KPresentation.prototype.goto = function (i) {
        if (i < 0 || i > this.slides.length - 1) return false;

        this.removeClass(this.slides[this.activeSlide], this.options.activeFrameClass);
        this.activeSlide = i;
        this.addClass(this.slides[this.activeSlide], this.options.activeFrameClass);

        return this;
    };

    /**
     * Check if active slide is last
     */
    KPresentation.prototype.checkLast = function () {
        return this.activeSlide === this.slidesCount - 1;
    };

    /**
     * Check if active slide is first
     */
    KPresentation.prototype.checkFirst = function () {
        return this.activeSlide === 0;
    };

    /**
     * Find index of slide
     * @param slide
     * @returns {boolean}
     */
    KPresentation.prototype.indexOf = function (slide) {
        var i = 0;

        while (i < this.slides.length) {
            if (this.slides[i] === slide) {
                return i;
            }
            i++;
        }
        return -1;
    };

    KPresentation.prototype.resize = function (divider) {
        var self = this;

        this.options.browserPrefixes.forEach(function (prop) {
            self.domObj.style[prop] = 'scale(' + divider + ')';
        });

        return true;
    };


    KPresentation.prototype.computeScale = function() {
        return 1 / Math.max(
            this.domObj.clientWidth / window.innerWidth,
            this.domObj.clientHeight / window.innerHeight
        );
    };

    /**
     * Key press events
     * @param event
     */
    KPresentation.prototype.handle = function (event) {
        if (!this.isShown) return false;

        switch (event) {
            case 'button:esc':
                this.stopPresentation();
                break;
            case 'button:prev':
                this.prev();
                break;
            case 'button:next':
                this.next();
                break;
            case 'button:space':
                this.next();
                break;
            case 'window:resize':
                this.resize(this.computeScale());
                break;
            default:
                break;
        }
    };
})(this, this.document);