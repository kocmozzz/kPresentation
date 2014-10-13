describe("KShow", function () {
    var kShow = new KShow();

    beforeEach(function () {
        kShow.presentations = [];
    });

    describe('#init', function() {

        it("should return singleton", function () {
            var kShow1 = new KShow({
                presentationClass: 'a',
                frameClass: 'b'
            });

            expect(kShow1).toEqual(kShow);
        });

    });

    describe('#add', function() {

        it("should add presentation to array", function () {
            kShow.add({});

            expect(kShow.presentations.length).toEqual(1);
        });

    });

    describe('#count', function() {

        it("should return 0 count for empty presentations array", function () {
            expect(kShow.count()).toEqual(0);
        });

    });

    describe('#add', function() {

        it("should return count of 1 for array of presentations with single presentation", function () {
            expect(kShow.add({}).count()).toEqual(1);
        });

    });

    describe('#remove', function() {

        it("should return 0 count after removing presentation from array", function () {
            expect(kShow.add({}).remove(0).count()).toEqual(0);
        });

    });

    describe('#get', function() {

        it("should return presentation by index 0 if array is not empty", function () {
            kShow.add({});

            expect(kShow.get(0)).toEqual({});
        });

        it("should return false if index is out of range", function () {
            expect(kShow.get(2)).toBeFalsy();
        });

    });
});