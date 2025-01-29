import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const weaponSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String},    
    description: { type: String},
    num_die_damage: { type: Number },
    type: { type: String },
    quality: { type: Number },
  });


  export const Weapons = mongoose.model('Weapons', weaponSchema);