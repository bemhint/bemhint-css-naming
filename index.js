var bemNaming = require('bem-naming'),
    postcss = require('postcss'),
    parser = require('postcss-selector-parser');

module.exports = {
    forEntityTech: function(tech, techConfig, entity) {

        //console.log(tech, entity);

        var data = postcss.parse(tech.content);

        data.nodes.forEach(function(rule) {
            rule.type === 'rule' && parser(function(selectors) {

                selectors.eachClass(function (cssClass) {

                    !bemNaming.validate(cssClass.value) && entity.addError({
                        msg: 'invalid class name',
                        tech: tech.name,
                        value: cssClass.value
                    });
                });

            }).process(rule.selector);
        });
    }
};

