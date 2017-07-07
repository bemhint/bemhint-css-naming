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
                validator = new CssNaming({ excludes: ['e_x_c_l_u_d_e'] }, errorCallback);

            validator.validateSelectors('.e_x_c_l_u_d_e{}', 'block');

            assert.called(errorCallback);
            assert.calledWith(errorCallback, sinon.match(/not contain block name/));
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
    });

    describe('validation rules switching', function() {

        describe('requireBlockClass option', function() {

            it('validation is performed by default', function() {
                var errorCallback = sinon.spy(),
                    validator = new CssNaming(null, errorCallback);

                validator.validateSelectors('.another-block{}', 'block');

                assert.called(errorCallback);
                assert.calledWith(errorCallback, sinon.match(/not contain block name/));
            });

            it('validation is performed when option is true', function() {
                var errorCallback = sinon.spy(),
                    validator = new CssNaming({ requireBlockClass: true }, errorCallback);

                validator.validateSelectors('.another-block{}', 'block');

                assert.called(errorCallback);
                assert.calledWith(errorCallback, sinon.match(/not contain block name/));
            });

            it('validation isn\'t performed when option is false', function() {
                var errorCallback = sinon.spy(),
                    validator = new CssNaming({ requireBlockClass: false }, errorCallback);

                validator.validateSelectors('.another-block{}', 'block');

                assert.notCalled(errorCallback);
            });
        });

        describe('requireBemNaming option', function() {

            it('validation is performed by default', function() {
                var errorCallback = sinon.spy(),
                    validator = new CssNaming(null, errorCallback);

                validator.validateSelectors('.block .block__el1__el2{}', 'block');

                assert.called(errorCallback);
                assert.calledWith(errorCallback, sinon.match(/Invalid class naming/));
            });

            it('validation is performed when option is true', function() {
                var errorCallback = sinon.spy(),
                    validator = new CssNaming({ requireBemNaming: true}, errorCallback);

                validator.validateSelectors('.block .block__el1__el2{}', 'block');

                assert.called(errorCallback);
                assert.calledWith(errorCallback, sinon.match(/Invalid class naming/));
            });

            it('validation isn\'t performed when option is false', function() {
                var errorCallback = sinon.spy(),
                    validator = new CssNaming({ requireBemNaming: false }, errorCallback);

                validator.validateSelectors('.block .block__el1__el2{}', 'block');

                assert.notCalled(errorCallback);
            })
        });
    });
});
