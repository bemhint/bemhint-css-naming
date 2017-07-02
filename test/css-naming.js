'use strict';

var CssNaming = require('../lib/css-naming'),
    postcss = require('postcss');

describe('css naming', function() {
    describe('should fail', function() {
        it('if got error while css parse', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('.block__elem__elem{', 'block');

            assert.called(errorCallback);
            assert.calledWith(errorCallback, sinon.match(/Failed to check/));
        });

        it('for invalid class name', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('.block__elem__elem{}', 'block');

            assert.called(errorCallback);
            assert.calledWith(errorCallback, sinon.match(/Invalid class naming/));
        });

        it('if selector does not contain block name', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('.another-block{}', 'block');

            assert.called(errorCallback);
            assert.calledWith(errorCallback, sinon.match(/not contain block name/));
        });

        it('if selector was added to exclude but does not contain block name', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(['e_x_c_l_u_d_e'], errorCallback);

            validator.validateSelectors('.e_x_c_l_u_d_e{}', 'block');

            assert.called(errorCallback);
            assert.calledWith(errorCallback, sinon.match(/not contain block name/));
        });

        it('on tag selector without allowTags option', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('body {}', 'block');

            assert.called(errorCallback);
        });

        it('on combined tag selector with allowTags option', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming({ allowTags: true }, errorCallback);

            validator.validateSelectors('body.neblock {}', 'block');

            assert.called(errorCallback);
        });

        it('on combined tag selector', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('body.block {}', 'block');

            assert.called(errorCallback);
        });
    });

    describe('should pass', function() {
        it('if selector contains block name', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('.another-block .block{}', 'block');

            assert.notCalled(errorCallback);
        });

        it('if selector is related with current block', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('.block__elem_mod{}', 'block');

            assert.notCalled(errorCallback);
        });

        it('if wrong class was added to excludes', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming({ excludes: ['test-*'] }, errorCallback);

            validator.validateSelectors('.block .test-e_x_c_l_u_d_e_d{}', 'block');

            assert.notCalled(errorCallback);
        });

        it('on nested rule', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors('.block &__elem {}', 'block');

            assert.notCalled(errorCallback);
        });

        it('on pseudoclass', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming(null, errorCallback);

            validator.validateSelectors(':root {}', 'block');

            assert.notCalled(errorCallback);
        });

        it('on tag selector with allowTags option', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming({ allowTags: true }, errorCallback);

            validator.validateSelectors('body {}', 'block');

            assert.notCalled(errorCallback);
        });

        it('on combined selector with allowTags option', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming({ allowTags: true }, errorCallback);

            validator.validateSelectors('body.block {}', 'block');

            assert.notCalled(errorCallback);
        });

        it('on tag selector with allowTags option as an array', function() {
            var errorCallback = sinon.spy(),
                validator = new CssNaming({ allowTags: ['body', 'html'] }, errorCallback);

            validator.validateSelectors('body {}', 'block');

            assert.notCalled(errorCallback);
        });
    });
});
