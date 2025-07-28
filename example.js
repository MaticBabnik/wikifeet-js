import * as wikifeet from "./index.js";

const pokimane = (await wikifeet.search("pokimane"))[0];
console.log({ pokimane });
console.dir(await wikifeet.page(pokimane), { depth: null });

// const miaMalkova = (await wikifeet.search("mia malkova"))[0];
// console.log({ miaMalkova });
// console.dir(await wikifeet.page(miaMalkova), { depth: null });

// const hasan = (await wikifeet.search("hasan piker"))[0];
// console.log({ hasan });
// console.dir(await wikifeet.page(hasan), { depth: null });
