export interface APIResponseModel {
    message: string,
    result: boolean,
    data: any | null,
    error: string,
}

export interface IMessage {
    full_name: string,
    company: string,
    email: string,
    country_code: string,
    phone: string,
    message: string
}

export interface IFlag {
    id: number,
    documentId: string,
    country: string,
    country_code: string,
    flag_image: IImage
}

export interface ICareer {
    id: number,
    documentId: string,
    job_title: string,
    job_type: string,
    job_description: string,
    job_location: string,
    location_type: string,
    branch_name: string,
    office_address: IOffice[],
}

export interface IOffice {
    id: number,
    documentId: string,
    office_location: string,
    address_1: string,
    address_2: string,
    ward: string,
    city: string,
    prefecture: string,
    city_or_state: string,
    country: string,
    post_code: string,
    email: string,
    phone: string,
    office_image: IImage[],
    currentTime?: string,
}

export interface IMember {
    id: number,
    documentId: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    role: string,
    location: string,
    email: string,
    phone: string,
    portrait_image: IImage,
    bio: any,
}

export interface IClient {
    id: number,
    documentId: string,
    company_name: string,
    representative: string,
    address: string,
    phone: string,
    website_URL: string,
    testimonial: any,
    company_logo: IImage,
}

export interface IService {
    id: number,
    image: string,
    title: string,
    description: string,
    width?: number,
    height?: number,
}

export interface ISlide {
    id: number,
    documentId: string,
    company_name: string,
    project_image: IProject,
}

export interface IProject {
    id: number,
    documentId: string,
    project_title: string,
    thumbnail_image: IImage,
    project_images: IImage[],
    project_comment1: string,
    project_comment2: string,
    project_comment3: string,
    project_comment4: string,
    project_type: string,
    project_description: string,
    project_link: string,
    project_date: Date,
    project_client: IClient,
    industry: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IImage {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width?: number | null;
    height?: number | null;
    formats?: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface IArticle {
    id: number;
    documentId: string;
    title: string;
    sub_heading: string;
    content: any;
    publishedAt: string;
    type: string;
    author: string;
    thumbnail_image: IImage;
    createdAt: string;
    updatedAt: string;
}