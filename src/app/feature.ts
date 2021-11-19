export interface Geometry {
    type: string,
    coordinates: number[]
}

export interface GeoJsonFeatures {
    type: "FeatureCollection",
    features: USACapitalsFeature[] | USAStatesFeature[] | EuropeanCapitalsFeature[] | EuropeanStatesFeature[]
}

export interface USACapitalsFeature {
    type: "Feature",
    geometry : Geometry,
    properties: USACapitalsProperties
};

export interface USAStatesFeature {
    type: "Feature",
    geometry : Geometry,
    properties: USAStatesProperties
};

export interface EuropeanCapitalsFeature {
    type: "Feature",
    geometry : Geometry,
    properties: EuropeanCapitalsProperties
};

export interface EuropeanStatesFeature {
    type: "Feature",
    geometry : Geometry,
    properties: EuropeanStatesProperties
};

export interface USACapitalsProperties {
    state: string,
    name: string,
    population: number
}

export interface USAStatesProperties {
    GEO_ID: string,
    STATE: string,
    NAME: string,
    LSAD: string, 
    CENSUREAREA: number,
    center?: number[] | null
}

export interface EuropeanCapitalsProperties {
    name: string
}

export interface EuropeanStatesProperties {
    FID: number,
    FIPS: string,
    ISO2: string,
    ISO3: string,
    UN: number, 
    NAME: string, 
    AREA: number,
    POP2005: number,
    REGION: number,
    SUBREGION: number, 
    LON: number,
    LAT: number,
    center?: number[] | null
}
