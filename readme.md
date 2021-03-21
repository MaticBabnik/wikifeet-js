# Wikifeet-js
The ultimate coomer module. Helps you find them feet.

### How to use?
```js
const wikifeet = require('wikifeet-js');

async function main() {
    let pokimane = (await wikifeet.search('pokimane'))[0];
    let pics = await wikifeet.getImages(pokimane);

    let random = 0 | (pics.length * Math.random());

    console.log(`Pokimane feet pic of the day: ${pics[random]}`);    
}

main();
```