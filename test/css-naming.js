'use strict';

var CssNaming = require('../lib/css-naming'),
    postcss = require('postcss');

describe('css naming', function() {
    it('should add error for invalid class name', function() {
        var errorCallback = sinon.spy(),
            validator = new CssNaming(null, errorCallback);

        validator.validateSelectors('.block__elem__elem{}', 'block');

        assert.called(errorCallback);
    });
});
