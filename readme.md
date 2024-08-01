# `wikifeet-js`

![NPM Version](https://img.shields.io/npm/v/wikifeet-js?style=for-the-badge)
![NPM Size](https://img.shields.io/bundlephobia/min/wikifeet-js?style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dy/wikifeet-js?style=for-the-badge)

Wikifeet scraper

## Usage

```js
import * as wikifeet from "./index.js";

const pokimane = (await wikifeet.search("pokimane"))[0];
console.log({ pokimane }); 

const page = await wikifeet.page(pokimane, /*allowNsfw=*/false);
console.log(page);
```
