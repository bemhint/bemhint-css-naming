var bemNaming = require('bem-naming'),
    postcss = require('postcss'),
    parser = require('postcss-selector-parser'),
    util = require('util');

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

        data && data.nodes.forEach(function(rule) {
            rule.type === 'rule' && parser(function(selectors) {

                selectors.each(function(selector) {
                    var hasTargetBlock = false,
                        ruleStart = rule.source.start;

                    selector.eachClass(function (cssClass) {
                        var cssEntity = bemNaming.parse(cssClass.value),
                            cssClassStart = cssClass.source.start,
                            line = ruleStart.line + cssClassStart.line - 1;

                        if (cssEntity) {
                            hasTargetBlock = hasTargetBlock || (cssEntity.block === tech.entity.block);
                        } else {
                            addError('invalid class naming', rule.selector, line, cssClassStart.column);
                        }
                    });

                    hasTargetBlock || addError(
                        'selector does not contain block name specified in the file name',
                        rule.selector,
                        ruleStart.line,
                        ruleStart.column
                    );

                });
            }).process(rule.selector);
        });
    }
};
