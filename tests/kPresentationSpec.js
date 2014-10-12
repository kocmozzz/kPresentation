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

    it("should check if first slide has class active after init", function () {
        expect(presentation.slides[0].classList.contains(presentation.options.activeSlideClass)).toBeTruthy();
    });

    it("should check if active slide is first and return true", function () {
        expect(presentation.checkFirst()).toBeTruthy();
    });

    it("should check if active slide is first and return false", function () {
        presentation.activeSlide = 1;

        expect(presentation.checkFirst()).toBeFalsy();
    });

    it("should check if active slide is last and return false", function () {
        presentation.activeSlide = 2;
        expect(presentation.checkLast()).toBeTruthy();
    });

    it("should check if active slide is last and return true", function () {
        presentation.activeSlide = presentation.slides.length - 1;

        expect(presentation.checkLast()).toBeTruthy();
    });

    it("should call checkFirst method when go to prev called", function () {
        spyOn(presentation, 'checkFirst').andCallThrough();

        presentation.prev();
        expect(presentation.checkFirst).toHaveBeenCalled();
    });

    it("should call checkLast method when go to next called", function () {
        spyOn(presentation, 'checkLast').andCallThrough();

        presentation.next();
        expect(presentation.checkLast).toHaveBeenCalled();
    });

    it("should go to next and have active slide equal to 1", function () {
        presentation.next();

        expect(presentation.activeSlide).toEqual(1);
        expect(
            presentation.slides[presentation.activeSlide].classList.contains(presentation.options.activeSlideClass)
        ).toBeTruthy();
    });

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

    it("should go to prev and have active slide equal to 0", function () {
        presentation.goto(1).prev();

        expect(presentation.activeSlide).toEqual(0);
        expect(
            presentation.slides[presentation.activeSlide].classList.contains(presentation.options.activeSlideClass)
        ).toBeTruthy();
    });

    it("should set isShown to true and add active class to presentation", function () {
        presentation.startPresentation();

        expect(presentation.isShown).toBeTruthy();
        expect(presentation.domObj.classList.contains(presentation.options.activePresentationClass)).toBeTruthy();
        expect(document.body.classList.contains(presentation.options.activeBodyClass)).toBeTruthy();
    });

    it("should set isShown to false and remove active class to presentation", function () {
        presentation.stopPresentation();

        expect(presentation.isShown).toBeFalsy();
        expect(presentation.domObj.classList.contains(presentation.options.activePresentationClass)).toBeFalsy();
        expect(document.body.classList.contains(presentation.options.activeBodyClass)).toBeFalsy();
    });

    it("should return false on handle if is not shown", function () {
        presentation.isShown = false;

        expect(presentation.handle('smth')).toBeFalsy();
    });

    it("should call next method on button:next event", function () {
        spyOn(presentation, 'next').andCallThrough();

        presentation.startPresentation();
        presentation.handle('button:next');

        expect(presentation.next).toHaveBeenCalled();
    });

    it("should call prev method on button:space event", function () {
        spyOn(presentation, 'next').andCallThrough();

        presentation.startPresentation();
        presentation.handle('button:space');

        expect(presentation.next).toHaveBeenCalled();
    });

    it("should call prev method on button:prev event", function () {
        spyOn(presentation, 'prev').andCallThrough();

        presentation.startPresentation();
        presentation.handle('button:prev');

        expect(presentation.prev).toHaveBeenCalled();
    });

    it("should call prev method on button:esc event", function () {
        spyOn(presentation, 'stopPresentation').andCallThrough();

        presentation.startPresentation();
        presentation.handle('button:esc');

        expect(presentation.stopPresentation).toHaveBeenCalled();
    });

});