export interface Media {
    _id: string;
    url: string;
    fullUrl: string;
    profile?: boolean;
    user_id?: string;
    car_id?: string
}

export interface Car_Specification {
    manufacturer: string;
    model: string;
    year: number;
    engineInfo: string;
    version: string;
    mileage: number
}

export interface CarData {
    _id: string,
    likes_count: number,
    views: number,
    user_id: string,
    Car_Specification: Car_Specification,
    media: Media[]
    profileUrl?: string
    //jeszcze więcej ale na razie nie chce mi się wprowadzać
}
