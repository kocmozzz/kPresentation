describe("Helper", function () {
    var obj = {},
        defaults = {},
        customOpts = {},
        halfCustomOpts = {},
        helper = new Helper();

    beforeEach(function () {
        obj.className = 'first second';

        defaults = {
            size: 1,
            length: 2
        };
        customOpts = {
            size: 2,
            length: 3
        };
        halfCustomOpts = {
            size: 1,
            length: 3
        };
    });

    it("should remove second class", function () {
        helper.removeClass(obj, 'second');
        expect(obj.className).toEqual('first');
    });

    it("should not remove anything", function () {
        helper.removeClass(obj, 'third');
        expect(obj.className).toEqual('first second');
    });

    it("should add third class", function () {
        helper.addClass(obj, 'third');
        expect(obj.className).toEqual('first second third');
    });

    it("should find first class", function () {
        expect(helper.hasClass(obj, 'first')).toBeTruthy();
    });

    it("should not find third class", function () {
        expect(helper.hasClass(obj, 'third')).toBeFalsy();
    });

    it("should extend all default options", function () {
        var custom = helper.extendDefaultOptions(defaults, customOpts);

        expect(custom).toEqual(customOpts);
    });

    it("should extend only half of default options", function () {
        var custom = helper.extendDefaultOptions(defaults, halfCustomOpts);

        expect(custom).toEqual(halfCustomOpts);
    });

    it("should return default options", function () {
        var custom = helper.extendDefaultOptions(defaults, null);

        expect(custom).toEqual(defaults);
    });

});