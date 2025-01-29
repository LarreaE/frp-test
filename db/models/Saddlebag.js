import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const saddlebagSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String},    
    description: { type: String},
    recover_stamina: { type: Number},
  });


  export const Saddlebag = mongoose.model('Saddlebag', saddlebagSchema);