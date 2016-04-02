var bemNaming = require('bem-naming'),
    postcss = require('postcss'),
    parser = require('postcss-selector-parser');

module.exports = {
    forEachTech: function(tech, entity, config) {
        var data = postcss.parse(tech.content);

        data.nodes.forEach(function(rule) {
            rule.type === 'rule' && parser(function(selectors) {

                selectors.each(function(selector) {
                    var hasTargetBlock = false;

                    selector.eachClass(function (cssClass) {
                        var cssEntity = bemNaming.parse(cssClass.value);

                        if (cssEntity) {
                            hasTargetBlock = hasTargetBlock || (cssEntity.block === tech.entity.block);
                        } else {
                            entity.addError({
                                msg: 'invalid class name in ' + rule.selector,
                                tech: tech.name,
                                value: cssClass.value
                            });
                        }
                    });

                    !hasTargetBlock && entity.addError({
                        msg: 'invalid block in ' + rule.selector,
                        tech: tech.name,
                        value: selector.toString()
                    });
                });
            }).process(rule.selector);
        });
    }
};
