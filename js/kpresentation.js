(function (window, document, undefined) {

    function Exception(message) {
        console.warn(message);
    }

    /**
     * Presentation
     * @param domObj
     * @param slideTagName
     * @returns {*}
     * @constructor
     */
    this.KPresentation = function (domObj, slideTagName) {
        this.options = {
            activePresentationClass: 'is-shown',
            navigatedPresentationClass: 'is-navigated',
            activeBodyClass: 'show-started',
            activeSlideClass: 'active',
            progressbarClass: 'k-presentation-progress',
            browserPrefixes: [
                'WebkitTransform',
                'MozTransform',
                'msTransform',
                'OTransform',
                'transform'
            ]
        };

        this.isShown = false;
        this.isNavigated = false;
        this.selected = false;
        this.slides = [];
        this.activeSlide = 0;
        this.slidesCount = 0;
        this.progressBar = {};
        this.domObj = domObj;
        this.slideTagName = slideTagName;

        this.slides = this.domObj.getElementsByTagName(this.slideTagName);
        this.slides = Array.prototype.slice.call(this.slides);
        this.slidesCount = this.slides.length;

        /**
         * Prepare presentation to be started by click on it
         */
        function preparePresentationToBeShown() {
            var self = this;

            /* Create progressbar */
            self.progressBar = document.createElement('div');
            self.progressBar.className = self.options.progressbarClass;
            self.domObj.appendChild(self.progressBar);
        }

        function init() {
            if (this.slidesCount) {
                this.slides[0].classList.add(this.options.activeSlideClass);
                preparePresentationToBeShown.call(this);
            } else {
                throw new Exception("No slides available. Check slides class selector.");
            }
        }

        init.call(this);

        /**
         * Compute scale to resize presentation
         * @returns {number}
         */
        function computeScale() {
            return 1 / Math.max(
                this.domObj.clientWidth / window.innerWidth,
                this.domObj.clientHeight / window.innerHeight
            );
        }

        /**
         * Resize presentation to fill window properly
         * @param scale
         */
        this.resize = (function (scale) {
            var self = this;

            scale = (typeof scale == 'undefined' || typeof scale == 'object') ? computeScale.call(this) : scale;

            this.options.browserPrefixes.forEach(function (prop) {
                self.domObj.style[prop] = 'scale(' + scale + ')';
            });
        }).bind(this);

        /**
         * Compute progress percentage
         * @returns {number}
         */
        function computeProgress() {
            if (!this.activeSlide) return 0;

            return 100 / (this.slidesCount - 1) * (this.activeSlide);
        }

        /**
         * Update progressbar width
         */
        this.updateProgress = (function () {
            this.progressBar.style.width = computeProgress.call(this) + '%';
        }).bind(this);

        /**
         * Slide click handler
         * @type {*|function(this:*)}
         */
        this.slideClick = (function (e) {
            var slide = e.target,
                ftn = this.slideTagName.toUpperCase();

            if (slide.tagName !== ftn) {
                while (slide.tagName !== ftn) {
                    slide = slide.parentNode;
                }
            }

            this.goto(this.slides.indexOf(slide));
        }).bind(this);

        /**
         * Keypress handler
         * @type {*|function(this:*)}
         */
        this.keyPress = (function (e) {
            switch (e.keyCode) {
                case 27: //esc
                    if (!this.isShown) {
                        this.stopNavigatePresentation();
                        break;
                    }

                    this.stopPresentation();
                    break;
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                case 32:
                    this.next();
                    break;
                case 13:
                    if (!this.isShown && this.isNavigated) {
                        this.startPresentation();
                    }
                    break;
                default:
                    break;
            }
        }).bind(this);

        return this;
    };

    //old fashioned way to support phantomJS
    var presentationClosed = document.createEvent('Event');
    presentationClosed.initEvent('presentation:closed', true, true);

    /* Public methods */
    /**
     * Start slide navigation
     */
    KPresentation.prototype.startNavigatePresentation = function () {
        this.isNavigated = true;
        this.domObj.classList.add(this.options.navigatedPresentationClass);

        this.domObj.addEventListener('click', this.slideClick, false);
        window.addEventListener('keydown', this.keyPress, false);
    };

    /**
     * Close slide navigation
     */
    KPresentation.prototype.stopNavigatePresentation = function () {
        this.isNavigated = false;
        this.domObj.classList.remove(this.options.navigatedPresentationClass);
        this.domObj.removeEventListener('click', this.slideClick, false);

        window.removeEventListener('keydown', this.keyPress, false);
        document.body.dispatchEvent(presentationClosed);
    };

    /**
     * Start presentation
     */
    KPresentation.prototype.startPresentation = function () {
        if (this.isShown) return;

        this.domObj.classList.add(this.options.activePresentationClass);
        document.body.classList.add(this.options.activeBodyClass);
        this.domObj.classList.remove(this.options.navigatedPresentationClass);
        this.isShown = true;

        this.resize();
        window.addEventListener('resize', this.resize);

        return this;
    };

    /**
     * Cancel presentation
     */
    KPresentation.prototype.stopPresentation = function () {
        this.domObj.classList.remove(this.options.activePresentationClass);
        document.body.classList.remove(this.options.activeBodyClass);
        this.domObj.classList.add(this.options.navigatedPresentationClass);
        this.isShown = false;

        window.removeEventListener('resize', this.resize);
        this.resize(1);

        return this;
    };

    /**
     * Go to next slide
     */
    KPresentation.prototype.next = function () {
        if (this.checkLast()) return;

        this.slides[this.activeSlide].classList.remove(this.options.activeSlideClass);
        this.activeSlide++;
        this.slides[this.activeSlide].classList.add(this.options.activeSlideClass);

        this.updateProgress();

        return this;
    };

    /**
     * Go to prev slide
     */
    KPresentation.prototype.prev = function () {
        if (this.checkFirst()) return;

        this.slides[this.activeSlide].classList.remove(this.options.activeSlideClass);
        this.activeSlide--;
        this.slides[this.activeSlide].classList.add(this.options.activeSlideClass);

        this.updateProgress();

        return this;
    };

    /**
     * Go to $index slide
     */
    KPresentation.prototype.goto = function (i) {
        if (i < 0 || i > this.slidesCount - 1) return false;

        this.slides[this.activeSlide].classList.remove(this.options.activeSlideClass);
        this.activeSlide = i;
        this.slides[this.activeSlide].classList.add(this.options.activeSlideClass);

        this.updateProgress();

        if (!this.isShown) this.startPresentation();

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
})(this, this.document);