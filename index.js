var postcss = require('postcss'),
    parser = require('postcss-selector-parser'),
    transform = function (selectors) {

        //console.log(JSON.stringify(selectors, function( key, value) {
        //  if( key == 'parent') { return 'xxx';}
        //  else {return value;}
        //}));


        selectors.eachClass(function (cssClass) {

            //entity.addError({
            //                   msg: 'test',
            //                   tech: tech.name,
            //                   value: 'XXX'
            //               });

            // do something with the selector
            console.log(cssClass);
        });

        //console.log(Object.keys(selectors));
    };

module.exports = {
    forEntityTech: function(tech, techConfig, entity) {

        var data = postcss.parse(tech.content);

        data.nodes.forEach(function(rule) {
            rule.type === 'rule' && parser(transform).process(rule.selector);
        });
    }
};

