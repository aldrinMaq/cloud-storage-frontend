export type Image = {
    id?: number;
    name: string;
    userId?: number;
    type: string;
    data?: File;
    url?: string; // URL for displaying the image
};

export const defaultImage: Image = {
    id: undefined,
    name: '',
    userId: undefined,
    type: '',
    data: undefined,
    url: ''
}

