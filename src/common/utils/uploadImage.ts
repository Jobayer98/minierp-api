import { cloudinary } from '../../config/cloudinary.js';
import { ApiError } from './ApiError.js';
import { HTTP } from '../constants/httpStatus.js';

const FOLDER = 'mini-erp/products';

export const uploadImage = (buffer: Buffer, mimetype: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: 'image', format: mimetype.split('/')[1] },
      (error, result) => {
        if (error || !result) {
          return reject(new ApiError(HTTP.INTERNAL, 'Image upload failed'));
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

// public_id is the path without extension: e.g. "mini-erp/products/abc123"
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const url = new URL(imageUrl);
    // Cloudinary URL path: /demo/image/upload/v123456/mini-erp/products/abc123.jpg
    const parts = url.pathname.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;
    // skip version segment (v123456) if present
    const afterUpload = parts.slice(uploadIndex + 1);
    if (afterUpload[0]?.startsWith('v') && /^\d+$/.test(afterUpload[0].slice(1))) {
      afterUpload.shift();
    }
    const publicId = afterUpload.join('/').replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // non-critical — log but don't throw
    console.warn(`Failed to delete image from Cloudinary: ${imageUrl}`);
  }
};
