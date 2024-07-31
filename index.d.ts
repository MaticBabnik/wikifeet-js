interface Person {
    slug: string;
    url: string;
    name: strin;
}

interface Image {
    id: number;
    thumb: string;
    image: string;
    resolution: [number, number];
    tags: string[];
}

function search(query: string): Promise<Person[]>;
function page(person: Person): Promise<{ images: Image[]; tags: string[] }>;
