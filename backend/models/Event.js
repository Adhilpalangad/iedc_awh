import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
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
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  isUpcoming: {
    type: Boolean,
    default: true
  },
  registrationUrl: {
    type: String,
    default: ""
  },
  eventReport: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
