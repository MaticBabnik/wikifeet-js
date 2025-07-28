import * as wikifeet from "./index.js";

const pokimane = (await wikifeet.search("hasan piker"))[0];
console.log({ pokimane });

const page = await wikifeet.page(pokimane);
console.dir(page, { depth: null });
