import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const timeSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    day_number: { type: Number},    
    day_week: { type: String},
    km_traveled: { type: Number},
    km_total: { type: Number},
  });


  export const Time = mongoose.model('Time', timeSchema);