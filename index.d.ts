declare module "wikifeet-js" {

    export interface Person {
        slug: string;
        url: string;
        name: string;
    }
    
    export interface Image {
        id: number;
        thumb: string;
        image: string;
        resolution: [number, number];
        tags: string[];
    }
    
    export function search(query: string): Promise<Person[]>;
    export function page(person: Person): Promise<{ images: Image[]; tags: string[] }>;
}