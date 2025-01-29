import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stonesSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String},    
    description: { type: String},
    value: { type: Number},
  });


  export const Precious_stone = mongoose.model('Precious_stone', stonesSchema);