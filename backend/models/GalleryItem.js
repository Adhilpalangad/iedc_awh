import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    trim: true
  },
  image: {
    type: String
  }
}, { timestamps: true });

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export default GalleryItem;
