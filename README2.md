# bemhint-css-naming

Плагин проверки именования css классов для [bemhint](https://github.com/bem/bemhint).
  1. названия css классов соответствуют БЭМ-нотации.
  1. в каждом селекторе присутствует класс текущего блока

Пример для блока `my-block`:

```
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
.my-block .another-block__elem
{
    color: red;
}

/* not ok */
.another-block
{
    color: green;
}

.my-block__elem__elem2
{
    color: black;
}
```

## Установка

```bash
$ npm install https://github.com/dima117/bemhint-css-naming.git
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
