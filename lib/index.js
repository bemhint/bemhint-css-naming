'use strict';

var util = require('util'),
    CssNaming = require('./css-naming');

module.exports = {

    /**
     * Формирует конфиг плагина по умолчанию
     *
     * @returns {Object}
     */
    configure: function() {
        return {
            techs: {
                css: true
            }
        };
    },

    /**
     * Проверяет названия css селекторов заданной сущности
     *
     * @param {Object} tech
     * @param {Entity} entity
     * @param {Config} config
     */
    forEachTech: function(tech, entity, config) {
        function addError(msg, target, line, column) {
            entity.addError({
                msg: msg,
                tech: tech.name,
                value: util.format('%s at line %s, column %s', target, line, column)
            });
        }
        var configData = config.getConfig(); 
        var validator = new CssNaming({ 
            excludes: configData.excludeClasses, allowTags: configData.allowTags
        }, addError);

        validator.validateSelectors(tech.content, tech.entity.block);
    }
};
