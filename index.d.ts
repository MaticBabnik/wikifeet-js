declare module "wikifeet-js" {
    export interface SearchResult {
        slug: string;
        name: string;
    }

    /**
     * @deprecated
     */
    export type Person = SearchResult;

    export interface SeeAlso extends SearchResult {
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
        rating: RatingData;
        shoeSize: string;
        birthplace: string;
        birthDate: string;
        images: Image[];
        tags: string[];
        seeAlso: SeeAlso[];

        /**
         * True when a page is 100% NSFW
         */
        isNsfw: boolean;

        /**
         * True when a page __can__ be NSFW (aka. page is from men.wikifeet.com)
         */
        isPotentiallyNsfw: boolean;
    }

    /**
     * Search all instances of wikifeet for a profile.
     */
    export function search(query: string): Promise<SearchResult[]>;

    /**
     * Fetch a profile page 
     * @param person A search result record
     * @param allowNsfw Allow NSFW results (all men are considered NSFW)
     */
    export function page(person: SearchResult, allowNsfw?: boolean): Promise<Page>;
    
    /**
     * Fetch a profile page 
     * @param slug Unique identifier of the person
     * @param allowNsfw Allow NSFW results (all men are considered NSFW)
     */
    export function page(slug: string, allowNsfw?: boolean): Promise<Page>;
}
