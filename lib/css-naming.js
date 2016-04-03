'use strict';

var bemNaming = require('bem-naming'),
    minimatch = require('minimatch'),
    postcss = require('postcss'),
    cssParser = require('postcss-selector-parser');

/**
 * Функция для обработки найденных ошибок
 *
 * @callback CssNaming~errorCallback
 * @param {string} msg - Сообщение об ошибке
 * @param {string} target - Причина ошибки
 * @param {string} line - Место ошибки: строка
 * @param {string} column - Место ошибки: позиция в строке
 */

/**
 * Создает экземпляр CssNaming
 *
 * @constructor
 * @this {CssNaming}
 * @param {string[]} excludes - Исключения для проверки соответствия названий классов БЭМ-нотации
 * @param {CssNaming~errorCallback} errCallback - Обработчик ошибок
 */
function CssNaming(excludes, errCallback) {
    this._excludeRegexp = excludes && this._buildExcludeRegexp(excludes);
    this._errCallback = errCallback;
};

CssNaming.prototype = {

    /**
     * Проверяет селекторы в заданном css коде
     * @param {string} content - Проверяемый css
     * @param {string} blockName - Название целевого блока
     */
    validateSelectors: function(content, blockName) {
        var data;

        try {
            data = postcss.parse(content);
        } catch(e) {
            this._errCallback('Failed to check css naming', e.reason, e.line, e.column);
        }

        data && data.nodes.forEach(function(rule) {
            if (rule.type === 'rule') {
                cssParser(this._validateSelectors.bind(this, rule, blockName)).process(rule.selector);
            }
        }, this);
    },

    /**
     * Преобразуем паттерны в regex через mimimatch и склеиваем в один
     *
     * @private
     */
    _buildExcludeRegexp: function(excludes) {
        var expr = excludes.map(function(val) {
            return minimatch.makeRe(val).source;
        }).join('|');

        return new RegExp(expr);
    },

    /**
     * Проверяет набор css селекторов
     *
     * @private
     */
    _validateSelectors: function(rule, blockName, selectors) {
        var _this = this;

        selectors.each(function(selector) {
            var hasTargetBlock = false,
                ruleStart = rule.source.start;

            selector.eachClass(function(cssClass) {
                hasTargetBlock |= _this._validateClass(cssClass, blockName, rule);
            });

            hasTargetBlock || _this._errCallback(
                'Selector does not contain block name specified in the file name',
                rule.selector,
                ruleStart.line,
                ruleStart.column
            );
        });
    },

    /**
     * Проверяет набор css селекторов
     *
     * @private
     */
    _validateClass: function (cssClass, blockName, rule) {
        var cssVal = cssClass.value,
            cssEntity = bemNaming.parse(cssVal),
            cssClassStart = cssClass.source.start,
            errorLine = rule.source.start.line + cssClassStart.line - 1;

        if (this._excludeRegexp && this._excludeRegexp.test(cssVal)) {
            return;
        }

        if (cssEntity) {
            return cssEntity.block === blockName;
        } else {
            this._errCallback('Invalid class naming', rule.selector, errorLine, cssClassStart.column);
        }

        return false;
    }
};

module.exports = CssNaming;
