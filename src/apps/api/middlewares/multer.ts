import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/business/documents';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const safeRandom = crypto.randomBytes(4).toString('hex');
    const uniqueSuffix = Date.now() + '-' + safeRandom;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Solo se permiten archivos PDF.'));
};

export const uploadBusinessDocs = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});
