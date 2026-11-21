import mongoose from 'mongoose';

const shortendLinkSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true, maxlength: 500 },
    shortCode: { type: String, required: true, unique: true, maxlength: 50, index: true },
    accessCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    totalTimeSpentSeconds: { type: Number, default: 0 },
    targetType: { type: String, enum: ['resume', 'blog', 'custom'], default: 'custom' },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null },
    lastAccessedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

const ShortendLink = mongoose.model('shortend_links', shortendLinkSchema);

export default ShortendLink;
