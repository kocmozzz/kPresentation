describe("KPresentation", function () {
    var slideTag = 'section',
        presentation = {},
        obj = document.createElement("article");

    for (var i = 0; i < 3; i++) {
        var slide = document.createElement("section");

        obj.appendChild(slide);
    }

    beforeEach(function () {
        presentation = new KPresentation(obj, slideTag);
    });

    describe('#init', function () {

        it("should check if first slide has class active after init", function () {
            expect(presentation.slides[0].classList.contains(presentation.options.activeSlideClass)).toBeTruthy();

        });
    });


    describe('#checkFirst', function () {

        it("should check if active slide is first and return true", function () {
            expect(presentation.checkFirst()).toBeTruthy();
        });

        it("should check if active slide is first and return false", function () {
            presentation.activeSlide = 1;

            expect(presentation.checkFirst()).toBeFalsy();
        });

    });

    describe('#checkLast', function () {

        it("should check if active slide is last and return false", function () {
            presentation.activeSlide = 2;
            expect(presentation.checkLast()).toBeTruthy();
        });

        it("should check if active slide is last and return true", function () {
            presentation.activeSlide = presentation.slides.length - 1;

            expect(presentation.checkLast()).toBeTruthy();
        });

    });

    describe('#next', function () {

        it("should go to next and have active slide equal to 1", function () {
            spyOn(presentation, 'checkLast').andCallThrough();

            presentation.next();

            expect(presentation.checkLast).toHaveBeenCalled();
            expect(presentation.activeSlide).toEqual(1);
            expect(
                presentation.slides[presentation.activeSlide].classList.contains(presentation.options.activeSlideClass)
            ).toBeTruthy();
        });

    });

    describe('#goto', function () {

        it("should go to slide 1 and have active slide equal to 1", function () {
            presentation.goto(1);

            expect(presentation.activeSlide).toEqual(1);
            expect(
                presentation.slides[presentation.activeSlide].classList.contains(presentation.options.activeSlideClass)
            ).toBeTruthy();
        });

        it("should return false if index is out of range", function () {
            expect(presentation.goto(5)).toBeFalsy();
        });

    });

    describe('#prev', function () {

        it("should go to prev and have active slide equal to 0", function () {
            spyOn(presentation, 'checkFirst').andCallThrough();

            presentation.goto(1).prev();

            expect(presentation.checkFirst).toHaveBeenCalled();
            expect(presentation.activeSlide).toEqual(0);
            expect(
                presentation.slides[presentation.activeSlide].classList.contains(presentation.options.activeSlideClass)
            ).toBeTruthy();
        });

    });

    describe('#startPresentation', function () {

        it("should set isShown to true and add active class to presentation and call resize", function () {
            spyOn(presentation, 'resize').andCallThrough();

            presentation.startPresentation();

            expect(presentation.isShown).toBeTruthy();
            expect(presentation.domObj.classList.contains(presentation.options.activePresentationClass)).toBeTruthy();
            expect(document.body.classList.contains(presentation.options.activeBodyClass)).toBeTruthy();
            expect(presentation.resize).toHaveBeenCalled();
        });
    });

    describe('#stopPresentation', function () {
        it("should set isShown to false and remove active class to presentation and call resize", function () {
            spyOn(presentation, 'resize').andCallThrough();

            presentation.stopPresentation();

            expect(presentation.isShown).toBeFalsy();
            expect(presentation.domObj.classList.contains(presentation.options.activePresentationClass)).toBeFalsy();
            expect(document.body.classList.contains(presentation.options.activeBodyClass)).toBeFalsy();
            expect(presentation.resize).toHaveBeenCalled();
        });

    });

    describe('#startNavigatePresentation', function () {

        it("should set isNavigated to true and add class to presentation", function () {
            presentation.startNavigatePresentation();

            expect(presentation.isNavigated).toBeTruthy();
            expect(presentation.domObj.classList.contains(presentation.options.navigatedPresentationClass)).toBeTruthy();
        });

    });

    describe('#stopNavigatePresentation', function () {

        it("should set isNavigated to false and remove class from presentation", function () {
            presentation.stopNavigatePresentation();

            expect(presentation.isNavigated).toBeFalsy();
            expect(presentation.domObj.classList.contains(presentation.options.navigatedPresentationClass)).toBeFalsy();
        });

    });
});