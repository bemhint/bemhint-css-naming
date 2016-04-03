# bemhint-css-naming

Plugin for [bemhint](https://github.com/bemhint/bemhint) which validate css classes.
1. Checks css classes for BEM-notation;
1. Checks for existing target block in the selector.

Example for `my-block.css` (exclude: `test-*`)

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

/* will be ignored because of exclude matching */
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

/* there is no target block in selector */
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

## How to install

```bash
$ npm install bemhint-css-naming
```

## How to use

Add plugin to `.bemhint.js`:

```js
module.exports = {
    plugins: {
        'bemhint-css-naming': true
    }
};
```

Exclude some classnames from BEM-naming validation:

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
