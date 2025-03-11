import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CloudinaryUploadService {
    private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dilslf0s6/image/upload';
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
}