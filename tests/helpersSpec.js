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