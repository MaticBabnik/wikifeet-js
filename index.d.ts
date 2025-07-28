declare module "wikifeet-js" {
    export interface Person {
        slug: string;
        name: string;
    }

    export interface SeeAlso extends Person {
        thumbs: string[]
    }

    export interface Image {
        id: number;
        thumb: string;
        image: string;
        resolution: [number, number];
        tags: string[];
    }

    export interface RatingData {
        average: number;
        votes: Record<1 | 2 | 3 | 4 | 5, number>;
        count: number;
    }

    export interface Page {
        url: string;
        name: string;
        isNsfw: boolean;
        rating: RatingData;
        shoeSize: string;
        birthplace: string;
        birthDate: string;
        images: Image[];
        tags: string[];
        seeAlso: SeeAlso[];
    }

    export function search(query: string): Promise<Person[]>;
    export function page(person: Person, allowNsfw?: boolean): Promise<Page>;
    export function page(slug: string, allowNsfw?: boolean): Promise<Page>;
}
