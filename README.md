# bemhint-css-naming

Плагин проверки именования css классов для [bemhint](https://github.com/bemhint/bemhint).
  1. названия css классов соответствуют БЭМ-нотации;
  1. в каждом селекторе присутствует класс текущего блока.

Пример для блока `my-block` (исключения: `test-*`):

```css
/* ok */
.my-block
{
    color: red;
}

.b-page .my-block .another-block
{
    color: red;
}

.my-block .another-block > a:hover,
.my-block__elem,
.my-block__elem_mod_val
{
    color: red;
}

.my-block .test-e_x_c_l_u_d_e_d
{
    color: red;
}

/* not ok */

/* invalid block name */
.my-block__elem__elem2
{
    color: black;
}

/* there is no target block */
.another-block
{
    color: green;
}

/* there is no target block */
.test-e_x_c_l_u_d_e_d
{
    color: red;
}

```

## Установка

```bash
$ npm install https://github.com/bemhint/bemhint-css-naming.git
```

## Использование

В конфигурационном файле `.bemhint.js` подключить плагин:
```js
module.exports = {
    plugins: {
        'bemhint-css-naming': true
    }
};
```

Не проверять соответствие БЭМ-нотации заданные названия классов:

```js
module.exports = {
    plugins: {
        'bemhint-css-naming': {
            excludeClasses: [
                'my-another-block',
                'test-*'
            ]
        }
    }
};
```
