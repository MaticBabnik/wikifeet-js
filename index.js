import { parseHTML } from "linkedom";

const WIKIFEET = "https://www.wikifeet.com";
const TAGS_REGEX = /messanger\['tagname'\] = (\{.*\});\n/;
const PICTURES_REGEX = /messanger\['gdata'\] = (\[.*\]);\n/;

const THUMB_URL = (pid) => `https://thumbs.wikifeet.com/${pid}.jpg`;
const IMG_URL = (slug, pid) =>
    `https://pics.wikifeet.com/${slug}-feet-${pid}.jpg`;

export async function search(query) {
    const res = await fetch(`${WIKIFEET}/perl/ajax.fpl`, {
        headers: {
            accept: "*/*",
            cookie: "wikifeetab=0; cookieconsent_status=dismiss",
            Referer: WIKIFEET,
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
        const url = new URL(anchor.href, WIKIFEET);

        return {
            slug: url.pathname.substring(1),
            url: url.toString(),
            name,
        };
    });
}

export async function page(person) {
    const res = await fetch(person.url, {
        headers: {
            accept: "*/*",
            cookie: "wikifeetab=0; cookieconsent_status=dismiss",
            Referer: WIKIFEET,
        },
    });

    const text = await res.text();

    const tagMap = JSON.parse(text.match(TAGS_REGEX)?.[1] ?? {});

    const images = JSON.parse(text.match(PICTURES_REGEX)[1]).map((x) => ({
        id: x.pid,
        thumb: THUMB_URL(x.pid),
        image: IMG_URL(person.slug, x.pid),
        resolution: [x.pw, x.ph],
        tags: x.tags
            .split("")
            .map((tag) => tagMap[tag])
            .filter((x) => x),
    }));

    return { images, tags: Object.values(tagMap) };
}
