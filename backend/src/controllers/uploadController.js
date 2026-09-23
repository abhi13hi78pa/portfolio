import { isCloudinaryConfigured } from '../config/cloudinary.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (isCloudinaryConfigured) {
      // Determine resource type based on mimetype
      const isPdfOrDoc = req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document') || req.file.mimetype.includes('msword');
      const resourceType = isPdfOrDoc ? 'raw' : 'image';

      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: resourceType,
        public_id: `${pathParse(req.file.originalname).name}-${Date.now()}`,
      });

      return res.json({
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        format: result.format,
        size: result.bytes,
      });
    } else {
      // Local disk storage fallback
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

      return res.json({
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    }
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
};

const pathParse = (filename) => {
  const parts = filename.split('.');
  const ext = parts.length > 1 ? `.${parts.pop()}` : '';
  const name = parts.join('.').replace(/[^a-zA-Z0-9_-]/g, '_');
  return { name, ext };
};
