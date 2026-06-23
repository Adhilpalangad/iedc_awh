import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
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
  organizer: {
    type: String,
    trim: true
  },
  team: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
