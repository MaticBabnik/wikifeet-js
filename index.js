import { parseHTML } from "linkedom";

const BASE = "https://www.wikifeet.com";
const BASE_NSFW = "https://www.wikifeetx.com";
const CONTENT_WARNING = `<br><span style='color:#800; font-size:14pt'>WARNING: CONTAINS ADULT CONTENT</span><br>`;
const TAGS_REGEX = /messanger\['tagname'\] = (\{.*\});\n/;
const PICTURES_REGEX = /messanger\['gdata'\] = (\[.*\]);\n/;
const HEADERS = {
    accept: "*/*",
    cookie: "wikifeetab=0; cookieconsent_status=dismiss",
    Referer: BASE,
};
const TOTAL_RATINGS_REGEX = /\((\d+) total votes\)/;

const THUMB_URL = (pid) => `https://thumbs.wikifeet.com/${pid}.jpg`;
const IMG_URL = (slug, pid) =>
    `https://pics.wikifeet.com/${slug}-feet-${pid}.jpg`;

export async function search(query) {
    const res = await fetch(`${BASE}/perl/ajax.fpl`, {
        headers: {
            ...HEADERS,
            "content-type": "application/x-www-form-urlencoded",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `req=suggest&value=${encodeURIComponent(query)}`,
        method: "POST",
    });

    const { document } = parseHTML(await res.text());

    const results = [...document.getElementsByTagName("a")];

    return results.map((anchor) => {
        const name = anchor.innerText.trim();
        const url = new URL(anchor.href, BASE);

        return {
            slug: url.pathname.substring(1),
            name,
        };
    });
}

function parseSeeAlso(div) {
    const name = div.querySelector("div").innerText;
    const slug = div.querySelector("a").href.substring(1);
    const thumbs = [...div.querySelectorAll(".triplepics div")].map((x) =>
        x.style.backgroundImage.slice(5, -2)
    );

    return {
        name,
        slug,
        thumbs,
    };
}

function parseRatings(ratingsDiv) {
    const votes = Object.fromEntries(
        Object.entries(
            [...ratingsDiv.children[1].children] // second element's children
                .map((x) =>
                    parseInt(
                        x.children[0].childNodes[0].textContent, // each child's first child contains a textNode (number)
                        10
                    )
                )
        ).map(([k, v]) => [5 - k, v]) // turn zero-based indexes into ammount of stars
    );

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
    const tagMap = JSON.parse(html.match(TAGS_REGEX)?.[1] ?? {});

    const images = JSON.parse(html.match(PICTURES_REGEX)[1]).map((x) => ({
        id: x.pid,
        thumb: THUMB_URL(x.pid),
        image: IMG_URL(slug, x.pid),
        resolution: [x.pw, x.ph],
        tags: x.tags
            .split("")
            .map((tag) => tagMap[tag])
            .filter((x) => x),
    }));

    const { document } = parseHTML(html);

    const name = document.querySelector("h1").innerText;
    const shoeSize = document
        .getElementById("ssize_label")
        .childNodes[0].textContent.trim();
    const birthplace = document
        .getElementById("nation_label")
        .childNodes[0].textContent.trim();
    const birthDate = document
        .getElementById("bdate_label")
        .childNodes[0].textContent.trim();

    const rating = parseRatings(
        document.querySelector(
            "#content > div.round10 > div:nth-child(2) > div:nth-child(2)"
        )
    );

    const seeAlso = [...document.querySelectorAll(".widget")].map((x) =>
        parseSeeAlso(x)
    );

    return {
        name,
        rating,
        shoeSize,
        birthDate,
        birthplace,
        images,
        tags: Object.values(tagMap),
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
