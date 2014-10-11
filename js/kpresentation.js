(function (window, document, undefined) {

    function Exception(message) {
        console.warn(message);
    }

    /**
     * Presentation
     * @param domObj
     * @param frameTagName
     * @constructor
     */
    this.KPresentation = function (domObj, frameTagName) {
        this.options = {
            activePresentationClass: 'is-shown',
            activeBodyClass: 'show-started',
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

        this.slides = this.domObj.getElementsByTagName(frameTagName);
        this.slides = Array.prototype.slice.call(this.slides);
        this.slidesCount = this.slides.length;

        /**
         * Prepare presentation to be started by click on it
         */
        function preparePresentationToBeShown() {
            this.domObj.addEventListener('click', this.startPresentation.bind(this));
        }

        function init() {
            if (this.slidesCount) {
                this.slides[0].classList.add(this.options.activeFrameClass);
                preparePresentationToBeShown.call(this);
            } else {
                throw new Exception("No slides available. Check slides class selector.");
            }
        }

        init.call(this);

        return this;
    };

    KPresentation.prototype = new Helper();

    /* Public methods */

    /**
     * Start presentation
     */
    KPresentation.prototype.startPresentation = function () {
        if (this.isShown) return;

        this.domObj.classList.add(this.options.activePresentationClass);
        document.body.classList.add(this.options.activeBodyClass);
        this.isShown = true;
        this.resize(this.computeScale());

        return this;
    };

    /**
     * Cancel presentation
     */
    KPresentation.prototype.stopPresentation = function () {
        this.domObj.classList.remove(this.options.activePresentationClass);
        document.body.classList.remove(this.options.activeBodyClass);
        this.isShown = false;
        this.resize(1);

        return this;
    };

    /**
     * Go to next slide
     */
    KPresentation.prototype.next = function () {
        if (this.checkLast()) return;

        this.slides[this.activeSlide].classList.remove(this.options.activeFrameClass);
        this.activeSlide++;
        this.slides[this.activeSlide].classList.add(this.options.activeFrameClass);

        return this;
    };

    /**
     * Go to prev slide
     */
    KPresentation.prototype.prev = function () {
        if (this.checkFirst()) return;

        this.slides[this.activeSlide].classList.remove(this.options.activeFrameClass);
        this.activeSlide--;
        this.slides[this.activeSlide].classList.add(this.options.activeFrameClass);

        return this;
    };

    /**
     * Go to $index slide
     */
    KPresentation.prototype.goto = function (i) {
        if (i < 0 || i > this.slidesCount - 1) return false;

        this.slides[this.activeSlide].classList.remove(this.options.activeFrameClass);
        this.activeSlide = i;
        this.slides[this.activeSlide].classList.add(this.options.activeFrameClass);

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
        return this.slides.indexOf(slide);
    };

    /**
     * Resize presentation to fill window properly
     * @param scale
     */
    KPresentation.prototype.resize = function (scale) {
        var self = this;

        this.options.browserPrefixes.forEach(function (prop) {
            self.domObj.style[prop] = 'scale(' + scale + ')';
        });
    };

    /**
     * Compute scale to resize presentation
     * @returns {number}
     */
    KPresentation.prototype.computeScale = function () {
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