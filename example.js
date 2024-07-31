import * as wikifeet from "./index.js";

const pokimane = (await wikifeet.search("pokimane"))[0];
console.log({ pokimane });

const page = await wikifeet.page(pokimane);
console.log(page);
