'use strict';

var util = require('util'),
    CssNaming = require('./css-naming');

module.exports = {

    configure: function() {
        return {
            techs: {
                css: true
            }
        };
    },

    forEachTech: function(tech, entity, config) {
        function addError(msg, target, line, column) {
            entity.addError({
                msg: msg,
                tech: tech.name,
                value: util.format('%s at line %s, column %s', target, line, column)
            });
        }

        var validator = new CssNaming(config._config.excludeClasses, addError);

        validator.validateSelectors(tech.content, tech.entity.block);
    }
};
