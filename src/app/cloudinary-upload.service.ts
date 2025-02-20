import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CloudinaryUploadService {
    private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dilslf0s6/image/upload';
    private cloudinaryDeleteUrl = 'https://api.cloudinary.com/v1_1/dilslf0s6/image/destroy';
    private cloudinaryUpdateUrl = 'https://api.cloudinary.com/v1_1/dilslf0s6/image/upload';
    private uploadPreset = 'sports_buddy';

    constructor() { }

    uploadImage(file: File): Promise<object> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);

        return new Promise((resolve, reject) => {
            fetch(this.cloudinaryUrl, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.secure_url) {
                        const image_data = { url: data.secure_url, id: data.public_id };
                        resolve(image_data);
                    } else {
                        reject(new Error('Failed to upload image.'));
                    }
                })
                .catch((error) => reject(error));
        });
    }

    deleteImage(publicId: string): Promise<any> {
        const data = {
            public_id: publicId,
            api_key: 'YOUR_API_KEY',
            api_secret: 'YOUR_API_SECRET',
        };

        return new Promise((resolve, reject) => {
            fetch(this.cloudinaryDeleteUrl, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.result === 'ok') {
                        resolve({ message: 'Image deleted successfully!' });
                    } else {
                        reject(new Error('Failed to delete image.'));
                    }
                })
                .catch((error) => reject(error));
        });
    }

    updateImage(file: File, publicId: string): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        formData.append('public_id', publicId);

        return new Promise((resolve, reject) => {
            fetch(this.cloudinaryUpdateUrl, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.secure_url) {
                        resolve({ url: data.secure_url, id: data.public_id });
                    } else {
                        reject(new Error('Failed to update image.'));
                    }
                })
                .catch((error) => reject(error));
        });
    }
}