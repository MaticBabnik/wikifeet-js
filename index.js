const needle = require('needle');

const searchRegex = /\.value='(.*?)';parent.location='\/' \+ encodeURI\('(.*?)'\)/g
const dataRegex = /messanger\['gdata'\] \= (\[.*?\]);/

/**
 * Searches for people
 * @param {string} query The search query
 * @returns {[{name:string,safeName:string,url:string}]} Array of results
 */
async function search(query) {
    const response = await needle('get',`https://www.wikifeet.com/perl/ajax.fpl?req=suggest&gender=undefined&value=${encodeURIComponent(query)}`);
    const results = response.body.replace(/\\/g,'').matchAll(searchRegex);
    
    return Array.from(results).map(x=>({name:x[1],safeName:x[2].replace(/\W/g,'').replace(/_| /g,'-'),url:`https://www.wikifeet.com/${encodeURIComponent(x[2])}`}));
}
/**
 * Gets links to all the thumbnails of a person's pictures.
 * @param {{name:string,safeName:string,url:string}} person 
 * @returns {[string]} Array of URLs
 */
async function getThumbnails(person) {
    const response = await needle('get',person.url);

    return JSON.parse(response.body.match(dataRegex)[1]).map(x=>`https://thumbs.wikifeet.com/${x.pid}.jpg`);
}

function getImageURL(person,id) {
    return `https://pics.wikifeet.com/${person.safeName}-feet-${id}.jpg`    
}

/**
 * Gets links to all of the person's pictures
 * @param {{name:string,safeName:string,url:string}} person 
 * @returns {[string]} Array of URLs
 */
async function getImages(person) {
    const response = await needle('get',person.url);

    return JSON.parse(response.body.match(dataRegex)[1]).map(x=>getImageURL(person,x.pid));
}

module.exports = {
    search,
    getImages,
    getThumbnails
}