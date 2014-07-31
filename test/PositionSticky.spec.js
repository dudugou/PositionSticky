describe("PositionSticky", function() {

  describe("#_init", function() {

    it("sets the element as the element property", function() {
      var instance = PositionStickyFactory.create();
      var element = document.getElementById('element');
      expect(instance._element).toBe(element);
    });

    it("sets the sticky element's parent as the container property", function() {
      var instance = PositionStickyFactory.create();
      var container = document.getElementById('container');
      expect(instance._container).toBe(container);
    });

    it("validates container's positioning scheme", function() {
      spyOn(PositionSticky, '_validateContainerPosScheme');
      var instance = PositionStickyFactory.create();
      expect(instance._validateContainerPosScheme).toHaveBeenCalled();
    });

    it("calls #_setOffsetTop", function() {
      spyOn(PositionSticky, '_setOffsetTop');
      var instance = PositionStickyFactory.create();
      expect(instance._setOffsetTop).toHaveBeenCalled();
    });

    it("calls #_setOffsetBottom", function() {
      spyOn(PositionSticky, '_setOffsetBottom');
      var instance = PositionStickyFactory.create();
      expect(instance._setOffsetBottom).toHaveBeenCalled();
    });

    it("calls #_calcThreshold", function() {
      spyOn(PositionSticky, '_calcThreshold');
      var instance = PositionStickyFactory.create();
      expect(instance._calcThreshold).toHaveBeenCalled();
    });

    it("calls #_setElementWidth", function() {
      spyOn(PositionSticky, '_setElementWidth');
      var instance = PositionStickyFactory.create();
      expect(instance._setElementWidth).toHaveBeenCalled();
    });

    it("calls #_setLeftPositionWhenAbsolute", function() {
      spyOn(PositionSticky, '_setLeftPositionWhenAbsolute');
      var instance = PositionStickyFactory.create();
      expect(instance._setLeftPositionWhenAbsolute).toHaveBeenCalled();
    });

    it("calls #_setLeftPositionWhenFixed", function() {
      spyOn(PositionSticky, '_setLeftPositionWhenFixed');
      var instance = PositionStickyFactory.create();
      expect(instance._setLeftPositionWhenFixed).toHaveBeenCalled();
    });

    it("calls #_setBoundingBoxHeight", function() {
      spyOn(PositionSticky, '_setBoundingBoxHeight');
      var instance = PositionStickyFactory.create();
      expect(instance._setBoundingBoxHeight).toHaveBeenCalled();
    });

    it("calls #_createPlaceholder", function() {
      spyOn(PositionSticky, '_createPlaceholder');
      var instance = PositionStickyFactory.create();
      expect(instance._createPlaceholder).toHaveBeenCalled();
    });

    it("calls #_subscribeToWindowScroll", function() {
      spyOn(PositionSticky, '_subscribeToWindowScroll');
      var instance = PositionStickyFactory.create();
      expect(instance._subscribeToWindowScroll).toHaveBeenCalled();
    });

  });

  describe("#_validateContainerPosScheme", function() {

    describe("when container's positioning scheme is not either relative or absolute", function() {

      it("sets container's position to relative", function() {
        var container = document.getElementById('container');
        var mock = { _container: container };
        var _validateContainerPosScheme = PositionSticky._validateContainerPosScheme.bind(mock);

        _validateContainerPosScheme();

        expect(container.style.position).toEqual('relative');
      });

    });

    describe("otherwise", function() {

      it("doesn't change container's positioning scheme", function() {
        var container = document.getElementById('container');
        container.style.position = 'absolute';
        var mock = { _container: container };
        var _validateContainerPosScheme = PositionSticky._validateContainerPosScheme.bind(mock);

        _validateContainerPosScheme();

        expect(container.style.position).toEqual('absolute');
      });

    });

  });

  describe("#_setOffsetTop", function() {

    describe("when offsetTop is given in options and it is zero or a positive integer", function() {
      it("assigns that to 'offsetTop'", function() {
        var instance;

        instance = PositionStickyFactory.create(null, {offsetTop: 0});
        expect(instance.offsetTop).toEqual(0);

        instance = PositionStickyFactory.create(null, {offsetTop: 1});
        expect(instance.offsetTop).toEqual(1);
      });
    });

    describe("otherwise", function() {
      it("calculates container's padding-top and border-top-width and sets that as 'offsetTop'", function() {
        var _setOffsetTopSpy = spyOn(PositionSticky, '_setOffsetTop');
        var instance = PositionStickyFactory.create();

        instance._container.style.padding = '20px';
        instance._container.style.border = '10px solid black';

        _setOffsetTopSpy.and.callThrough();
        instance._setOffsetTop();

        expect(instance.offsetTop).toEqual(30);
      });
    });

  });

  describe("#_setOffsetBottom", function() {
    it("sets container's padding-bottom and border-bottom-width as 'offsetBottom'", function() {
      var instance = PositionStickyFactory.create();

      instance._container.style.padding = '20px';
      instance._container.style.border = '10px solid black';

      instance._setOffsetBottom();
      expect(instance.offsetBottom).toEqual(30);
    });

    it("stores container's padding-bottom in a property for #_makeAbsolute to use", function() {
      var instance = PositionStickyFactory.create();

      instance._container.style.padding = '20px';
      instance._container.style.border = '10px solid black';

      instance._setOffsetBottom();
      expect(instance._containerPaddingBottom).toEqual(20);
    });
  });

  describe("#_calcThreshold", function() {

    it("returns #_getElementDistanceFromDocumentTop - 'offsetTop'", function() {
      var instance = PositionStickyFactory.create();

      spyOn(instance, '_getElementDistanceFromDocumentTop').and.returnValue(100);
      instance.offsetTop = 10;
      instance._calcThreshold();

      expect(instance._threshold).toEqual(90);
    });

  });

  describe("#_setElementWidth", function() {
    it("calculates element's computed width and applies it as inline style", function() {
      var spy = spyOn(PositionSticky, '_setElementWidth');
      var instance = PositionStickyFactory.create();

      instance._container.style.width = '1000px';
      instance._element.style.padding = '25px';
      instance._element.style.border = '25px solid black';

      spy.and.callThrough();
      instance._setElementWidth();

      expect(instance._element.style.width).toEqual('900px');
    });
  });

  describe("#_setLeftPositionWhenAbsolute", function() {
    it("calculates left position to be used in absolute positioning", function() {
      var instance = PositionStickyFactory.create();

      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(0);

      instance._container.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(0);

      instance._container.style.paddingLeft = '100px';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(100);

      instance._element.style.marginLeft = '100px';
      instance._setLeftPositionWhenAbsolute();
      expect(instance._leftPositionWhenAbsolute).toEqual(100);
    });
  });

  describe("#_setLeftPositionWhenFixed", function() {
    it("gets element's total offsetLeft and saves it", function() {
      var instance = PositionStickyFactory.create();

      instance._container.ownerDocument.body.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(100);

      instance._container.ownerDocument.body.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(110);

      instance._container.ownerDocument.body.style.paddingLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(210);

      instance._container.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(310);

      instance._container.style.borderLeft = '10px solid black';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(320);

      instance._container.style.paddingLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(420);

      instance._element.style.marginLeft = '100px';
      instance._setLeftPositionWhenFixed();
      expect(instance._leftPositionWhenFixed).toEqual(420);

      instance._container.ownerDocument.body.style.marginLeft = null;
      instance._container.ownerDocument.body.style.borderLeft = null;
      instance._container.ownerDocument.body.style.paddingLeft = null;
    });
  });

  describe("#_setBoundingBoxHeight", function() {
    it("calculates element's bounding box height and sets it to 'boundingBoxHeight'", function() {
      var instance = PositionStickyFactory.create();

      var child = document.createElement('DIV');
      child.style.height = '500px';
      instance._element.appendChild(child);

      instance._element.style.overflow = 'scroll';
      instance._element.style.height = '100px';
      instance._element.style.padding = '10px';
      instance._element.style.border = '10px solid black';

      instance._setBoundingBoxHeight();
      expect(instance._boundingBoxHeight).toEqual(140);
    });

    it("updates placeholder height when 'updatePlaceholder' parameter is set to true", function() {
      var instance = PositionStickyFactory.create();
      instance._element.style.height = '100px';
      instance._setBoundingBoxHeight(true);
      expect(instance.placeholder.style.height).toEqual('100px');
    });
  });

  describe("#_createPlaceholder", function() {

    var instance, _createPlaceholderSpy;

    beforeEach(function() {
      _createPlaceholderSpy = spyOn(PositionSticky, '_createPlaceholder');
    });

    it("creates a hidden div with the same box model properties as the sticky element and inserts it just before the sticky element", function() {
      spyOn(PositionSticky, '_setElementWidth');

      instance = PositionStickyFactory.create();
      instance._container.style.width = '100px';
      instance._boundingBoxHeight = 200;
      instance._element.style.margin = '10px';

      _createPlaceholderSpy.and.callThrough();
      instance._createPlaceholder();

      expect(instance._element.previousElementSibling).toBe(instance.placeholder);
      expect(instance.placeholder.style.display).toEqual('none');
      expect(instance.placeholder.style.width).toEqual('80px');
      expect(instance.placeholder.style.height).toEqual('200px');
      expect(instance.placeholder.style.margin).toEqual('10px');
    });

    it("applies sticky element's floating to the placeholder", function() {
      instance = PositionStickyFactory.create();
      instance._element.style.float = 'left';

      _createPlaceholderSpy.and.callThrough();
      instance._createPlaceholder();

      expect(instance.placeholder.style.float).toEqual('left');
    });
  });

  describe("#_subscribeToWindowScroll", function() {
    it("attaches #_onScroll to Window.onscroll event", function() {
      var mockWindow = { addEventListener: function(event, callback) { callback(); }};
      var mock = { _window: mockWindow, _onScroll: function() {} };
      var _subscribeToWindowScroll = PositionSticky._subscribeToWindowScroll.bind(mock);
      spyOn(mock, '_onScroll');

      _subscribeToWindowScroll();

      expect(mock._onScroll).toHaveBeenCalled();
    });
  });

  describe("#_onScroll", function() {

    var mockWindow, mock, _onScroll;

    beforeEach(function() {
      mockWindow = { requestAnimationFrame: function(callback) { callback(); }};
      mock = { _window: mockWindow, isTicking: false, _update: function() {} };
      _onScroll = PositionSticky._onScroll.bind(mock);
      spyOn(mock, '_update');
    });

    it("runs #_update on every animation frame", function() {
      _onScroll();
      expect(mock._update).toHaveBeenCalled();
    });

    it("doesn't run #_update more than once in the same animation frame", function() {
      _onScroll();
      _onScroll();
      _onScroll();

      expect(mock._update.calls.count()).toBe(1);
    });
  });

  describe("#_isStatic", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("returns true if posScheme is PositionSticky.POS_SCHEME_STATIC", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_STATIC;
      expect(instance._isStatic()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_FIXED;
      expect(instance._isStatic()).toBe(false);

      instance._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
      expect(instance._isStatic()).toBe(false);
    });
  });

  describe("#_makeStatic", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("sets sticky element's position to 'static'", function() {
      instance._makeStatic();
      expect(instance._element.style.position).toEqual('static');
    });

    it("hides placeholder", function() {
      instance.placeholder.style.display = 'block';
      instance._makeStatic();
      expect(instance.placeholder.style.display).toEqual('none');
    });

    it("updates posScheme to PositionSticky.POS_SCHEME_STATIC", function() {
      instance._makeStatic();
      expect(instance._posScheme).toBe(PositionSticky.POS_SCHEME_STATIC);
    });

  });

  describe("#_isFixed", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("returns true if posScheme is PositionSticky.POS_SCHEME_FIXED", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_FIXED;
      expect(instance._isFixed()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_STATIC;
      expect(instance._isFixed()).toBe(false);

      instance._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
      expect(instance._isFixed()).toBe(false);
    });
  });

  describe("#_makeFixed", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("removes bottom property in case sticky element had absolute positioning before", function() {
      instance._element.style.bottom = '0px';
      instance._makeFixed();
      expect(instance._element.style.bottom).toEqual('');
    });

    it("sets sticky element's position to 'fixed'", function() {
      instance._makeFixed();
      expect(instance._element.style.position).toEqual('fixed');
    });

    it("assigns 'offsetTop' to element's top style property", function() {
      instance.offsetTop = 50;
      instance._makeFixed();
      expect(instance._element.style.top).toEqual('50px');
    });

    it("assigns 'leftPositionWhenFixed' to element's left style property", function() {
      instance._leftPositionWhenFixed = 5417;
      instance._makeFixed();
      expect(instance._element.style.left).toEqual('5417px');
    });

    it("shows placeholder", function() {
      instance.placeholder.style.display = 'none';
      instance._makeFixed();
      expect(instance.placeholder.style.display).toEqual('block');
    });

    it("updates posScheme to PositionSticky.POS_SCHEME_FIXED", function() {
      instance._makeFixed();
      expect(instance._posScheme).toBe(PositionSticky.POS_SCHEME_FIXED);
    });

  });

  describe("#_isAbsolute", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("returns true if posScheme is PositionSticky.POS_SCHEME_ABSOLUTE", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
      expect(instance._isAbsolute()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._posScheme = PositionSticky.POS_SCHEME_STATIC;
      expect(instance._isAbsolute()).toBe(false);

      instance._posScheme = PositionSticky.POS_SCHEME_FIXED;
      expect(instance._isAbsolute()).toBe(false);
    });
  });

  describe("#_makeAbsolute", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    it("removes top property in case sticky element had fixed positioning before", function() {
      instance._element.style.top = '0px';
      instance._makeAbsolute();
      expect(instance._element.style.top).toEqual('');
    });

    it("sets sticky element's position to 'absolute'", function() {
      instance._makeAbsolute();
      expect(instance._element.style.position).toEqual('absolute');
    });

    it("assigns 'containerPaddingBottom' to sticky element's bottom css property", function() {
      instance._containerPaddingBottom = 50;
      instance._makeAbsolute();
      expect(instance._element.style.bottom).toEqual('50px');
    });

    it("assigns 'leftPositionWhenAbsolute' to element's left style property", function() {
      instance._leftPositionWhenAbsolute = 7145;
      instance._makeAbsolute();
      expect(instance._element.style.left).toEqual('7145px');
    });

    it("shows placeholder", function() {
      instance.placeholder.style.display = 'none';
      instance._makeAbsolute();
      expect(instance.placeholder.style.display).toEqual('block');
    });

    it("updates posScheme to PositionSticky.POS_SCHEME_ABSOLUTE", function() {
      instance._makeAbsolute();
      expect(instance._posScheme).toBe(PositionSticky.POS_SCHEME_ABSOLUTE);
    });

  });

  describe("#_update", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
    });

    describe("when element is below the threshold", function() {

      beforeEach(function() {
        spyOn(instance, '_isBelowThreshold').and.returnValue(true);
      });

      it("sets the position to static if it is not already", function() {
        spyOn(instance, '_isStatic').and.returnValue(false);
        spyOn(instance, '_makeStatic');

        instance._update();

        expect(instance._makeStatic).toHaveBeenCalled();
      });

    });

    describe("when container is above the viewport and sticky can fit inside the visible portion of the container", function() {

      beforeEach(function() {
        spyOn(instance, '_isBelowThreshold').and.returnValue(false);
        spyOn(instance, '_canStickyFitInContainer').and.returnValue(true);
      });

      it("sets the position to fixed if it is not already", function() {
        spyOn(instance, '_isFixed').and.returnValue(false);
        spyOn(instance, '_makeFixed');

        instance._update();

        expect(instance._makeFixed).toHaveBeenCalled();
      });

    });

    describe("otherwise", function() {

      beforeEach(function() {
        spyOn(instance, '_isBelowThreshold').and.returnValue(false);
        spyOn(instance, '_canStickyFitInContainer').and.returnValue(false);
      });

      it("sets the position to absolute if it is not already", function() {
        spyOn(instance, '_isAbsolute').and.returnValue(false);
        spyOn(instance, '_makeAbsolute');

        instance._update();

        expect(instance._makeAbsolute).toHaveBeenCalled();
      });

    });

  });

  describe("#_isBelowThreshold", function() {

    var instance;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
      instance._threshold = 100;
    });

    it("returns true when latestKnownScrollY is smaller than the threshold", function() {
      instance._latestKnownScrollY = 99;
      expect(instance._isBelowThreshold()).toBe(true);
    });

    it("returns false otherwise", function() {
      instance._latestKnownScrollY = 100;
      expect(instance._isBelowThreshold()).toBe(false);

      instance._latestKnownScrollY = 101;
      expect(instance._isBelowThreshold()).toBe(false);
    });
  });

  describe("#_canStickyFitInContainer", function() {
    var instance, _getAvailableSpaceInContainerSpy;

    beforeEach(function() {
      instance = PositionStickyFactory.create();
      instance._boundingBoxHeight = 100;
      _getAvailableSpaceInContainerSpy = spyOn(instance, '_getAvailableSpaceInContainer');
    });

    it("returns true when visible portion of container's content height is equal or bigger than element's height", function() {
      _getAvailableSpaceInContainerSpy.and.returnValue(100);
      expect(instance._canStickyFitInContainer()).toBe(true);

      _getAvailableSpaceInContainerSpy.and.returnValue(101);
      expect(instance._canStickyFitInContainer()).toBe(true);
    });

    it("returns false otherwise", function() {
      _getAvailableSpaceInContainerSpy.and.returnValue(99);
      expect(instance._canStickyFitInContainer()).toBe(false);
    })
  });

  describe("#_getAvailableSpaceInContainer", function() {
    it("calculates and returns available visible portion of the container's height", function() {
      var instance = PositionStickyFactory.create();

      instance.offsetTop = 15;
      instance.offsetBottom = 15;
      spyOn(instance._container, 'getBoundingClientRect').and.returnValue({bottom: 100});

      expect(instance._getAvailableSpaceInContainer()).toEqual(70);
    });
  });

  describe("#_getElementDistanceFromDocumentTop", function() {

    it("returns total offsetTop", function() {
      var instance = PositionStickyFactory.create();

      instance._window.scrollTo(0, 100);

      instance._container.ownerDocument.body.style.marginTop = '100px';
      instance._container.ownerDocument.body.style.borderTop = '10px solid black';
      instance._container.ownerDocument.body.style.paddingTop = '100px';
      instance._container.style.marginTop = '100px';
      instance._container.style.borderTop = '10px solid black';
      instance._container.style.paddingTop = '100px';
      instance._element.style.marginTop = '100px';

      expect(instance._getElementDistanceFromDocumentTop()).toEqual(520);

      instance._container.ownerDocument.body.style.marginTop = null;
      instance._container.ownerDocument.body.style.borderTop = null;
      instance._container.ownerDocument.body.style.paddingTop = null;
    });

    it("uses placeholder in calculations when the element is not static", function() {
      var instance = PositionStickyFactory.create();

      instance._latestKnownScrollY = 0;
      instance.placeholder.style.marginTop = '123px';
      instance._makeFixed();

      expect(instance._getElementDistanceFromDocumentTop()).toEqual(123);
    });

  });

  describe("#refresh", function() {
    it("re-measures necessary positions/dimensions", function() {
      var instance = PositionStickyFactory.create();

      spyOn(instance, '_calcThreshold');
      spyOn(instance, '_setBoundingBoxHeight');

      instance.refresh();

      expect(instance._calcThreshold).toHaveBeenCalled();
      expect(instance._setBoundingBoxHeight).toHaveBeenCalledWith(true);
    });
  });

});