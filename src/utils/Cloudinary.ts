// src/utils/cloudinary.ts
import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'saas_app/avatars' }, // Optional: organize uploads
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(file.buffer);
  });
};