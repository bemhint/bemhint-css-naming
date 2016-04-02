var bemNaming = require('bem-naming'),
    postcss = require('postcss'),
    parser = require('postcss-selector-parser'),
    minimatch = require('minimatch'),
    util = require('util'),
    _ = require('lodash');

module.exports = {

    configure: function() {
        return {
            techs: {
                css: true
            }
        };
    },

    forEachTech: function(tech, entity, config) {
        try {
            var data = postcss.parse(tech.content);
        } catch(e) {
            addError('Failed to check css naming', e.reason, e.line, e.column);
        }

        function addError(msg, target, line, column) {
            entity.addError({
                msg: msg,
                tech: tech.name,
                value: util.format('%s at line %s, column %s', target, line, column)
            });
        }

        function isExcluded(matchers, css) {
            return _.some(matchers, function(matcher) {
                return minimatch(css, matcher);
            });
        }

        data && data.nodes.forEach(function(rule) {
            rule.type === 'rule' && parser(function(selectors) {

                selectors.each(function(selector) {
                    var hasTargetBlock = false,
                        ruleStart = rule.source.start;

                    selector.eachClass(function (cssClass) {
                        var cssVal = cssClass.value,
                            cssEntity = bemNaming.parse(cssVal),
                            cssClassStart = cssClass.source.start,
                            errorLine = ruleStart.line + cssClassStart.line - 1,
                            matchers = config._config.excludeClasses || [];

                        // var m = matchers.map(function(val) {
                        //         return '(' + minimatch.makeRe(val) + ')'
                        //     }).join('|');
                        //     console.log('-=-=-=', m);
                        // var isMatched = new RegExp(m).test(cssVal);
                        // console.log('----', cssVal, isMatched);
                        if (isExcluded(matchers, cssVal)) {
                            return;
                        }

                        if (cssEntity) {
                            hasTargetBlock = hasTargetBlock || (cssEntity.block === tech.entity.block);
                        } else {
                            addError('Invalid class naming', rule.selector, errorLine, cssClassStart.column);
                        }
                    });

                    hasTargetBlock || addError(
                        'Selector does not contain block name specified in the file name',
                        rule.selector,
                        ruleStart.line,
                        ruleStart.column
                    );

                });
            }).process(rule.selector);
        });
    }
};
