import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  linkedin: {
    type: String,
    default: "#"
  },
  year: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;
