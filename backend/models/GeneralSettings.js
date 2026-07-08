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
  },
  aboutText: {
    type: String,
    default: "IEDC AWH is a flagship initiative of Kerala Startup Mission (KSUM) — one of 550+ IEDCs across Kerala — providing students with access to cutting-edge technology, mentorship and early risk capital."
  }
} , { timestamps: true });

const GeneralSettings = mongoose.model('GeneralSettings', generalSettingsSchema);
export default GeneralSettings;
