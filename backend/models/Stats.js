import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  totalMembers: {
    type: String,
    default: "0"
  },
  eventsConducted: {
    type: String,
    default: "0"
  },
  yearsOfInnovation: {
    type: String,
    default: "0"
  }
}, { timestamps: true });

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;
