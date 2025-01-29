import { Character } from "../db/models/Character.js";
import { addAttributes, catatonia, getCharacters, recolecta, sanacion, songs, staminaRecovery, staminaReduce, travesia, update, weaponsQuality } from "../services/characters.js";
import { getTime } from "../services/time.js";

export const characters = async (req, res) => {
    try {
        const characters = await getCharacters()
        
        res.json({characters: characters });
    } catch (error) {
        console.error('Error geting characters:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  export const time = async (req, res) => {
    try {
        const time = await getTime()
        
        res.json({time: time });
    } catch (error) {
        console.error('Error geting time:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  export const postDay = async (req, res) => {
    try {
        const characters = await getCharacters()
        const time = await getTime()

        //MAÑANA 5:00
        console.log('----------------------TIME PASSES BY----------------------');
        console.log('Time of the day: 5:00');

        //cada jugador gana 2 puntos en strength o dex
        console.log('Priest begin to work...');
        console.log('----------------------------');
        
        await addAttributes(characters);

        console.log('The item gathering begins...');
        console.log('----------------------------');
        //recolecta: 1D100 recoger materiales
        await recolecta(characters);

        //MEDIODIA 12:00
        console.log('----------------------TIME PASSES BY----------------------');
        console.log('Time of the day: 12:00');

        console.log('The party sets foot towards their destiny...');
        console.log('----------------------------');
        await travesia(characters);

        //TARDE 17:00
        console.log('----------------------TIME PASSES BY----------------------');
        console.log('Time of the day: 17:00');

        console.log('Catatonia begins...');
        console.log('----------------------------');
        await catatonia(characters);

        console.log('The party is exhausted...');
        console.log('----------------------------');
        await staminaReduce(characters);

        //Noche 22:00
        console.log('----------------------TIME PASSES BY----------------------');
        console.log('Time of the day: 22:00');

        console.log('The Joker thinks about playing a song...');
        await songs();

        console.log('The party recovers stamina...');
        await staminaRecovery(characters)


        console.log('The Weapons quality is changing...');
        await weaponsQuality(characters)

        console.log('The Priest begins to heal the party...');
        await sanacion(characters)

        console.log('The Party is going to sleep...');

        await update(characters);
        
        res.json({time: time, characters: characters });
    } catch (error) {
        console.error('Error with the day:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
