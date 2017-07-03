# bemhint-css-naming

Плагин для [bemhint](https://github.com/bemhint/bemhint), проверяющий css селекторы.
  1. Проверяет, что названия классов соответствуют [БЭМ-нотации](https://ru.bem.info/methodology/naming-convention/);
  1. Проверяет, что в селекторе присутствует класс блока, для которого он написан.

Например, если проверяем файл `my-block.css` (игнорируем селекторы: `test-*`)

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

/* некорректное название класса будет проигнорировано, т.к. соответствует маске 'test-*' */
.my-block .test-e_x_c_l_u_d_e_d
{
    color: red;
}

/* ошибки */

/* название класса не соответствует БЭМ-нотации (разрешено указывать только один элемент) */
.my-block__elem__elem2
{
    color: black;
}

/* селектор не относится к проверяемому блоку my-block */
.another-block
{
    color: green;
}

/* селектор не относится к проверяемому блоку my-block */
.test-e_x_c_l_u_d_e_d
{
    color: red;
}

```

## Установка

```bash
$ npm install bemhint-css-naming
```

## Быстрый старт

Добавте bemhint-css-naming в конфигурационный файл `.bemhint.js`:

```js
module.exports = {
    plugins: {
        'bemhint-css-naming': true
    }
};
```

Исключение некоторых классов из проверки соответствия БЭМ-нотации:

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

Разрешить использование тегов или определенного набор тегов специальной опцией `allowTags`, в которой допускается массив тегов или логическое значение.

```js
module.exports = {
    plugins: {
        'bemhint-css-naming': {
            allowTags: true // or ['body', 'html']
        }
    }
};
```
