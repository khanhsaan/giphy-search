export interface GifObject {
    id: string,
    images: {
        fixed_width: {
            url: string;
            height: string;
            width: string;
        }
    };
    url: string;
    bitly_url: string;
}