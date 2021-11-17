export interface GeoJsonFeatures {
    type: "FeatureCollection",
    features: CapitalsFeature[] | StatesFeature[]
}

export interface CapitalsFeature {
    type: "Feature",
    geometry : Geometry,
    properties: CapitalsProperties
};

export interface StatesFeature {
    type: "Feature",
    geometry : Geometry,
    properties: StatesFeature
};

export interface Geometry {
    type: string,
    coordinates: number[]
}

export interface CapitalsProperties {
    state: string,
    name: string,
    population: number
}

export interface StatesProperties {
    GEO_ID: string,
    STATE: string,
    NAME: string,
    LSAD: string, 
    CENSUREAREA: number
}