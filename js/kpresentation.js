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

        return this;
    };

    KPresentation.prototype = new Helper();

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
    function resize(scale) {
        var self = this;

        scale = (typeof scale == 'undefined') ? computeScale.call(this) : scale;

        this.options.browserPrefixes.forEach(function (prop) {
            self.domObj.style[prop] = 'scale(' + scale + ')';
        });
    }

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
    function updateProgress() {
        this.progressBar.style.width = computeProgress.call(this) + '%';
    }

    function slideClick(e) {
        var slide = e.target,
            ftn = this.slideTagName.toUpperCase();

        if(slide.tagName !== ftn) {
            while(slide.tagName !== ftn) {
                slide = slide.parentNode;
            }
        }

        this.goto(this.slides.indexOf(slide));
    }

    /* Public methods */
    /**
     * Start slide navigation
     */
    KPresentation.prototype.startNavigatePresentation = function () {
        this.isNavigated = true;
        this.domObj.classList.add(this.options.navigatedPresentationClass);
        this.domObj.addEventListener('click', slideClick.bind(this), false);
    };

    /**
     * Close slide navigation
     */
    KPresentation.prototype.stopNavigatePresentation = function () {
        this.isNavigated = false;
        this.domObj.classList.remove(this.options.navigatedPresentationClass);
        this.domObj.removeEventListener('click', slideClick.bind(this), false);
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
        resize.call(this);

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
        resize.apply(this, [1]);

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

        updateProgress.call(this);

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

        updateProgress.call(this);

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

        updateProgress.call(this);

        if(!this.isShown) this.startPresentation();

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
     * Key press events
     * @param event
     */
    KPresentation.prototype.handle = function (event) {
        if (!this.isShown && !this.isNavigated) return false;

        switch (event) {
            case 'button:esc':
                if (!this.isShown && this.isNavigated) {
                    this.stopNavigatePresentation();
                    break;
                }

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
            case 'button:enter':
                if (!this.isShown && this.isNavigated) {
                    this.startPresentation();
                }
                break;
            case 'window:resize':
                if(!this.isShown) break;

                resize.call(this);
                break;
            default:
                break;
        }
    };
})(this, this.document);