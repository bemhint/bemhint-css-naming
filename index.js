var postcss = require('postcss');

module.exports = {
    forEntityTech: function(tech, techConfig, entity) {

        var data = postcss.parse(tech.content);

        data.nodes.forEach(function(rule) {
            if (rule.type !== 'rule') {
                return;
            }

            console.log(rule.selector);
        });

        entity.addError({
                    msg: 'test',
                    tech: tech.name,
                    value: 'XXX'
                });
    }
};

