import mongoose from 'mongoose';

const generalSettingsSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  nextEventTitle: {
    type: String,
    default: ""
  },
  nextEventDate: {
    type: String,
    default: ""
  },
  mission: {
    type: String,
    default: ""
  },
  vision: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const GeneralSettings = mongoose.model('GeneralSettings', generalSettingsSchema);
export default GeneralSettings;
