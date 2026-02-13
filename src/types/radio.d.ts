export interface RadioSearchResponse {
    took: number;
    query: string;
    hits: Hits;
    version: string;
    apiVersion: number;
}

export interface Hits {
    hits: Hit[];
}

export interface Hit {
    _source: Source;
    _score: number;
}

export interface Source {
    code: string;
    page: Page;
    type: string;
}

export interface Page {
    map?: string;
    url: string;
    type: string;
    count?: number;
    title: string;
    subtitle: string;
    place?: Country;
    secure?: boolean;
    country?: Country;
    preroll?: boolean;
    website?: string;
    stream?: string;
}

export interface Country {
    id: string;
    title: string;
}

export interface RadioSearchResponse {
    results: Result[];
}

export interface Result {
    title: string;
    url: string;
    subtitle: string;
}