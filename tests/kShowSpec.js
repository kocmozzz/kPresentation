describe("KShow", function () {
    var kShow = new KShow();

    beforeEach(function () {
        kShow.presentations = [];
    });

    it("should return singleton", function () {
        var kShow1 = new KShow({
            presentationClass: 'a',
            frameClass: 'b'
        });

        expect(kShow1).toEqual(kShow);
    });

    it("should add presentation to array", function () {
        kShow.add({});

        expect(kShow.presentations.length).toEqual(1);
    });

    it("should return 0 count for empty presentations array", function() {
        expect(kShow.count()).toEqual(0);
    });

    it("should return count of 1 for array of presentations with single presentation", function() {
        expect(kShow.add({}).count()).toEqual(1);
    });

    it("should return 0 count after removing presentation from array", function() {
        expect(kShow.add({}).remove(0).count()).toEqual(0);
    });

    it("should return presentation by index 0 if array is not empty", function() {
        kShow.add({});

        expect(kShow.get(0)).toEqual({});
    });

    it("should return false if index is out of range", function() {
        expect(kShow.get(2)).toBeFalsy();
    });

    it("should hit get method when notify presentations", function() {
        var p = {
            handle: function() {}
        };

        spyOn(kShow, 'get').andCallThrough();

        kShow.add(p).add(p);

        kShow.notify('smth');
        expect(kShow.get).toHaveBeenCalled();
    });
});