import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String},    
    occupation: { type: String },
    description: { type: String},
    stats: {
      strength: {type: Number},
      dexterity: {type: Number},
      stamina: {type: Number},
    },
    equipment: {
        saddlebag: {type: Array, ref: 'Saddlebag'},
        quiver: {type: Number},
        weapons: {type: Array, ref: 'Weapons'},
        pouch: {
            coins: {type: Number},
            gold: {type: Number},
            precious_stones: {type: Array, ref: 'Precious_stone'},
        },
        miscellaneous: {type: Array},
      },
  },{
    strictPopulate: false
});


  export const Character = mongoose.model('Character', characterSchema);