import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startup: {
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

const Alumni = mongoose.model('Alumni', alumniSchema);
export default Alumni;
