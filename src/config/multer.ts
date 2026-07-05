import multer from 'multer';
import { env } from './env.js';
import { ApiError } from '../common/utils/ApiError.js';
import { HTTP } from '../common/constants/httpStatus.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new ApiError(HTTP.BAD_REQUEST, 'Only JPEG, PNG, and WEBP images are allowed'));
    }
    cb(null, true);
  },
});
