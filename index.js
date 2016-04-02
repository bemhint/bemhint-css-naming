var bemNaming = require('bem-naming'),
    postcss = require('postcss'),
    parser = require('postcss-selector-parser'),
    minimatch = require('minimatch'),
    util = require('util'),
    _ = require('lodash');

function buildExcludeRegexp(excludes) {
    // преобразуем паттерны в regex через mimimatch и склеиваем в один
    var expr = excludes.map(function(val) {
        return '(' + minimatch.makeRe(val).source + ')'
    }).join('|');

    return new RegExp(expr);
}

function isExcluded(excludes, css) {
    return _.some(excludes, function(matcher) {
        return minimatch(css, matcher);
    });
}

function matchTest() {

    var a = [],
        date = Date.now(),
        i,
        regexp;

    for (i = 0; i < 200; i++) {
        a.push((date + i) + '');
    }

    console.log('генерация данных: ', Date.now() - date);
    date = Date.now();

    regexp = buildExcludeRegexp(a);

    console.log('генерация regexp: ', Date.now() - date);
    date = Date.now();

    for(i = 0; i < 10000; i++) {
        regexp.test('хрюката');
    }

    console.log('поиск regexp: ', Date.now() - date);
    date = Date.now();

    for(i = 0; i < 10000; i++) {
        isExcluded(a, 'хрюката');
    }

    console.log('поиск minimatch: ', Date.now() - date)
}


module.exports = {

    configure: function() {
        return {
            techs: {
                css: true
            }
        };
    },

    forEachTech: function(tech, entity, config) {
        matchTest();

        var data,
            excludes = config._config.excludeClasses || [],
            excludeRegexp = buildExcludeRegexp(excludes);

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
                        var cssVal = cssClass.value,
                            cssEntity = bemNaming.parse(cssVal),
                            cssClassStart = cssClass.source.start,
                            errorLine = ruleStart.line + cssClassStart.line - 1;

                        //if (excludeRegexp.test(cssVal)) {
                        console.log(cssVal, isExcluded(excludes, cssVal), excludeRegexp.test(cssVal));
                        if (isExcluded(excludes, cssVal)) {
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
