export interface Media {
    _id: string;
    url: string;
    fullUrl: string;
    profile: boolean;
}

export interface CarData {
    _id: string,
    likes_count: number,
    views: number,
    user_id: string,
    Car_Specification: {
        Manufacturer: string;
        Model: string;
        year: number;
        engineInfo: string;
        version: string;
        milage: number
    },
    media: [Media]
    profileUrl: string
    //jeszcze więcej ale na razie nie chce mi się wprowadzać
}
