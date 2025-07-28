const BASE = "https://wikifeet.com";
const BASE_NSFW = "https://wikifeetx.com";
const CONTENT_WARNING = `WARNING: wikiFeet X contains adult content!`;
const DATA_REGEX = /tdata = (\{.*\});\n/;
const HEADERS = {
    accept: "*/*",
    cookie: "wikifeetab=0; cookieconsent_status=dismiss",
    Referer: BASE,
};
const TAG_MAP = {
    T: 'Toes',
    S: 'Soles',
    A: 'Arches',
    C: 'Close-up',
    B: 'Barefoot',
    N: 'Nylons'
}

const THUMB_URL = (pid) => `https://thumbs.wikifeet.com/${pid}.jpg`;
const IMG_URL = (slug, pid) =>
    `https://pics.wikifeet.com/${slug}-feet-${pid}.jpg`;

export async function search(query) {
    // suggest also returns nsfw results - /search/ requires parsing thre results from script tags
    const form = new FormData()
    form.append('query', query)
    const res = await fetch(`${BASE}/api/suggest`, {
        body: form,
        method: "POST",
    });

    const results = (await res.json())[0][1].searchresults
    return results.map((r) => {
        return {
            slug: r.fetchname,
            name: r.name,
        };
    });
}

function parseRatings(votes) {
    const count = Object.values(votes).reduce((p, c) => p + c, 0);
    const sum = Object.entries(votes).reduce(
        (p, [stars, cnt]) => p + stars * cnt,
        0
    );

    return {
        votes,
        count,
        average: sum / count,
    };
}

function parsePageHtml(html, slug) {
    const data = JSON.parse(html.match(DATA_REGEX)[1])
    const images = data.gallery.map((x) => ({
        id: x.pid,
        thumb: THUMB_URL(x.pid),
        image: IMG_URL(slug, x.pid),
        resolution: [x.pw, x.ph],
        tags: x.tags.split``.map(t => TAG_MAP[t])
    }));

    const name = data.cname
    const shoeSize = data.ssize
    const birthplace = data.bplace
    const birthDate = new Date(data.bdate).toLocaleDateString()
    const rating = parseRatings(data.edata.stats)
    const seeAlso = JSON.parse(html.match(/(?:\["Similars",)(\[.*?\])(:?\]\])/)[1]) // Related results are stored in a seperate line..
        .map(({ name, fetchname, pics }) => ({
            name,
            slug: fetchname,
            thumbs: pics
        }))

    return {
        name,
        rating,
        shoeSize,
        birthDate,
        birthplace,
        images,
        tags: Object.values(TAG_MAP),
        seeAlso,
    };
}

export async function page(personOrSlug, allowNsfw = true) {
    const slug = personOrSlug.slug ?? personOrSlug;

    let url = `${BASE}/${slug}`;
    const res = await fetch(url, { headers: HEADERS });
    let html = await res.text();
    let isNsfw = false;

    if (html.includes(CONTENT_WARNING)) {
        if (!allowNsfw) throw new Error("NSFW content is disabled");
        url = `${BASE_NSFW}/${slug}`;
        const res = await fetch(url, { headers: HEADERS });
        html = await res.text();
        isNsfw = true;
    }
    const personPage = parsePageHtml(html, slug);
    personPage.isNsfw = isNsfw;
    personPage.url = url;
    return personPage;
}
