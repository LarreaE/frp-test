import { Character } from "../db/models/Character.js";
import { Saddlebag } from "../db/models/Saddlebag.js";
import { Weapons } from "../db/models/Weapons.js";
import { Precious_stone } from "../db/models/PreciousStone.js";
import { Time } from "../db/models/Time.js";
import mongoose from "mongoose";

export const getCharacters = async () => {
  try {
    const char = await Character.find();
    const populated = [];
    for (let i = 0; i < char.length; i++) {
      populated.push(await populatePlayer(char[i]._id));
    }

    return populated;
  } catch (error) {
    console.error("Error fetching Characters:", error);
    throw error;
  }
};

export const populatePlayer = async (playerId) => {
  const playerPopulated = await Character.findById(playerId)
    .populate("profile")
    .exec();

  // Poblamos el equipo
  await playerPopulated.equipment.populate("saddlebag", { profiles: 0 });
  await playerPopulated.equipment.populate("weapons", { profiles: 0 });
  await playerPopulated.equipment.pouch.populate("precious_stones", {
    profiles: 0,
  });

  return playerPopulated;
};

export const addAttributes = async (characters) => {
  for (let i = 0; i < characters.length; i++) {
    for (let j = 0; j < 2; j++) {
      let rand = Math.ceil(Math.random() * 2);
      if (rand === 1) {
        characters[i].stats.strength++;
        console.log(characters[i].name + " gains 1 point to strength");
      } else {
        characters[0].stats.dexterity++;
        console.log(characters[i].name + " gains 1 point to dexterity");
      }
    }
  }
};

export const recolecta = async (characters) => {
  for (let i = 0; i < characters.length; i++) {
    let rand = Math.ceil(Math.random() * 100);
    console.log(characters[i].name + " rolls a " + rand + "!");
    if (rand < 31 && rand >= 1) {
      //encuentra 1 de oro
      characters[i].equipment.pouch.gold++;
      console.log(characters[i].name + " finds one piece of gold!");
    } else if (rand < 81 && rand >= 31) {
      let rand20 = Math.ceil(Math.random() * 20); //1D20
      characters[i].equipment.pouch.coins += rand20;
      console.log(characters[i].name + " finds " + rand20 + " coins!");
    } else if (rand < 101 && rand >= 81) {
      //pieza a escoger y 1 piedra preciosa
      const consumable = await Saddlebag.find();
      const stones = await Precious_stone.find();
      const randConsumable = Math.floor(Math.random() * 9); //10 is the total consumables
      const randStone = Math.floor(Math.random() * 9);

      console.log(
        characters[i].name + " finds " + consumable[randConsumable].name + "!"
      );
      characters[i].equipment.pouch.precious_stones.push(
        consumable[randConsumable]._id
      );

      console.log(
        characters[i].name + " finds a stone!: " + stones[randStone].name
      );
      characters[i].equipment.saddlebag.push(stones[randStone._id]);
    }
  }
};

export const travesia = async (characters) => {
  const time = await Time.find();

  let rand = Math.ceil(Math.random() * 10); //1D10

  const day_number = time[time.length - 1].day_number + 1;
  const day_week = calculateDay(time[time.length - 1].day_week);
  const km_traveled = rand;
  const km_total = time[time.length - 1].km_total + rand;

  const today = new Time({
    _id: new mongoose.Types.ObjectId(),
    day_number: day_number,
    day_week: day_week,
    km_traveled: km_traveled,
    km_total: km_total,
  });
  today.save();
  console.log("The Team walks for " + rand + "Km!");
};

const calculateDay = (day) => {
  switch (day) {
    case "Monday":
      return "Tuesday";
    case "Tuesday":
      return "Wednesday";
    case "Wednesday":
      return "Thursday";
    case "Thursday":
      return "Friday";
    case "Friday":
      return "Saturday";
    case "Saturday":
      return "Sunday";
    case "Sunday":
      return "Monday";

    default:
      break;
  }
};

export const catatonia = async (characters) => {
  //empezamos por el joker
  const rand = Math.floor(Math.random() * (characters.length - 1));

  //sort characters by dexterity
  characters.sort((c1, c2) =>
    c1.stats.dexterity < c2.stats.dexterity
      ? 1
      : c1.stats.dexterity > c2.stats.dexterity
      ? -1
      : 0
  );

  //first to execute is that character
  console.log(
    characters[rand].name +
      "(" +
      characters[rand].occupation +
      ") executes the first action!"
  );
  execute(characters[rand], characters);
  console.log('-------------------------------------------');

  for (let i = 0; i < characters.length; i++) {
    if (characters[i] != characters[rand]) {
      execute(characters[i], characters);
    } else {
      console.log(characters[rand].occupation + " has already performed an action");
    }
    console.log('-------------------------------------------');
  }
};

const execute = (character, characters) => {
  switch (character.occupation) {
    case "warrior":
      console.log("warrior performing action");
      const rand = Math.ceil(Math.random() * 100);
      console.log("Warrior rolls a " + rand + " and his dex value is: " + character.stats.dexterity);
      
      if (rand > character.stats.dexterity) {
        console.log("Warrior does not make damage");
      } else {
        const randDmg = Math.ceil(Math.random() * 4);
        let weaponDmg = character.equipment.weapons[0].num_die_damage * randDmg + Math.ceil(character.equipment.weapons[0].quality/5);

        if (character.equipment.weapons[0].quality === 0) {
          weaponDmg = 0; //si quality 0 no hay daño
        }
        let totalDmg = weaponDmg + Math.ceil(character.stats.strength/4);

        const randVictim = Math.floor(Math.random() * (characters.length - 1));

        characters[randVictim].stats.strength - totalDmg;
        console.log(characters[randVictim].name + ' was attacked and received ' + totalDmg + ' damage!');
      }

      break;
    case "mage":
      console.log("mage performing action");
      const randMage = Math.ceil(Math.random() * 100);
      console.log("Mage rolls a " + randMage + " and his dex value is: " + character.stats.dexterity);
      
      if (randMage > character.stats.dexterity) {
        console.log("Mage does not make damage");
      } else {
        const randDmg = Math.ceil(Math.random() * 4);
        let weaponDmg = character.equipment.weapons[0].num_die_damage * randDmg + Math.ceil(character.equipment.weapons[0].quality/5);

        if (character.equipment.weapons[0].quality === 0) {
          weaponDmg = 0; //si quality 0 no hay daño
        }
        let totalDmg = weaponDmg + Math.ceil(character.stats.strength/4);

        const randVictim = Math.floor(Math.random() * (characters.length - 1));

        characters[randVictim].stats.strength - totalDmg;
        console.log(characters[randVictim].name + ' was attacked and received ' + totalDmg + ' damage!');
      }


      break;
    case "thug":
      console.log("Thug performing action");
      const randThugSteal = Math.ceil(Math.random() * 3);
      const randVictim = Math.floor(Math.random() * (characters.length - 1));
      const randThug = Math.ceil(Math.random() * 100);
      switch (randThugSteal) {
        case 1: //steal one gold
          characters[randVictim].equipment.pouch.gold--;
          character.equipment.pouch.gold++;
          console.log('Thug steals one gold to ' + characters[randVictim].name);
          break;
        case 2:
          characters[randVictim].equipment.pouch.coins = characters[randVictim].equipment.pouch.coins - (Math.ceil(character.stats.dexterity/2)) ;
          character.equipment.pouch.coins = character.equipment.pouch.coins + (Math.ceil(character.stats.dexterity/2)) ;
          console.log('Thug steals' + (Math.ceil(character.stats.dexterity/2)) + ' coins to ' + characters[randVictim].name);
          break;
        case 3:
          characters[randVictim].equipment.quiver--;
          character.equipment.quiver++;
          console.log('Thug steals one arrow to ' + characters[randVictim].name);
          break;
        default:
          break;
      }
      console.log("Thug rolls a " + randThug + " and his dex value is: " + character.stats.dexterity);
      
      if (randThug > character.stats.dexterity) {
        console.log("Thug does not make damage");
      } else {
        const randDmg = Math.ceil(Math.random() * 4);
        let weaponDmg = character.equipment.weapons[0].num_die_damage * randDmg + Math.ceil(character.equipment.weapons[0].quality/5);

        if (character.equipment.weapons[0].quality === 0) {
          weaponDmg = 0; //si quality 0 no hay daño
        }
        let totalDmg = weaponDmg + Math.ceil(character.stats.strength/4);

        const randVictim = Math.floor(Math.random() * (characters.length - 1));

        characters[randVictim].stats.strength - totalDmg;
        console.log(characters[randVictim].name + ' was attacked and received ' + totalDmg + ' damage!');
      }


      break;
    case "priest":
      console.log("Priest only work when camping");

      break;
    case "gambler":
      console.log("gambler performing an action");
      const randGamblerVictim = Math.floor(Math.random() * (characters.length - 1));
      if (characters[randGamblerVictim].equipment.pouch.precious_stones.length > 0 && character.equipment.pouch.precious_stones.length > 0) {
        const coinFlip =  Math.floor(Math.random() * 1);
        if (coinFlip === 0) { //gambler wins
          
          const item = characters[randGamblerVictim].equipment.pouch.precious_stones[0];

          character.equipment.pouch.precious_stones.push(item);          
          characters[randGamblerVictim].equipment.pouch.precious_stones.splice(0,1); //delete item
          console.log('Gambler Wins! and receives one ' + item.name);

        
        } else {  //victim wins

          const item = character.equipment.pouch.precious_stones[0];
          characters[randGamblerVictim].equipment.pouch.precious_stones.push(item);          
          character.equipment.pouch.precious_stones.splice(0,1); //delete item
          console.log(characters[randGamblerVictim].name + ' Wins! and receives one ' + item.name);

        }

      } else {
        console.log('There is no precious stone to gamble');
      }
      break;
    case "peasant":
      console.log("peasant performing action");
      for (let i = 0; i < 2; i++) {
        
        if (character.equipment.saddlebag.length > 0) {
          const randVictim = Math.floor(Math.random() * (characters.length - 1));
          const item = character.equipment.saddlebag[0];
          characters[randVictim].equipment.saddlebag.push(item);          
          character.equipment.saddlebag.splice(0,1); //delete item
          console.log(characters[randVictim].name + ' receives one ' + item.name);
        } else {
          console.log("Peasant has No consumables in the saddlebag");
        }
      }
      break;

    default:
      break;
  }
};

export const staminaReduce = async (characters) => {
  const time = await Time.find()
  const today = time[time.length-1]
  let staminaToReduce = 2;
  if (today.day_week === "Saturday" || today.day_week === "Sunday") {
    staminaToReduce = 4;
  }
    for (let i = 0; i < characters.length; i++) {
      characters[i].stats.stamina -= staminaToReduce;
      console.log(characters[i].name + " reduces " + staminaToReduce +' stamina');
    }
};

export const songs = async () => {
  const songs = ["When fire burns within", "A side effect of recovery", "Freddy Merkury, the real wayward", "Pazus, the impassible: from boast to fail"]
  let rand = Math.floor(Math.random() * 3); //1D10
  console.log("The joker decides to play the song: " + songs[rand]);
};

export const staminaRecovery = async (characters) => {
  
  for (let i = 0; i < characters.length; i++) {
    if (characters[i].stats.stamina > 50) {
      console.log(characters[i].name + ' decides not to eat');
    } else if (characters[i].stats.stamina > 20) {
      if (characters[i].equipment.saddlebag.length > 0) {

        const item = characters[i].equipment.saddlebag[0];
        characters[i].stats.stamina += item.recover_stamina;
        characters[i].equipment.saddlebag.splice(0,1);

        console.log(characters[i].name + 'recovers ' + item.recover_stamina + ' stamina');
        
      } else {
        console.log(characters[i].name + 'does not have any consumables in the saddlebag. Stamina: ' + characters[i].stats.stamina);
      }
    }  else if (characters[i].stats.stamina > 0) {
      for (let j = 0; j < 2; j++) {
        if (characters[i].equipment.saddlebag.length > 0) {

          const item = characters[i].equipment.saddlebag[0];
          characters[i].stats.stamina += item.recover_stamina;
          characters[i].equipment.saddlebag.splice(0,1);
  
          console.log(characters[i].name + 'recovers ' + item.recover_stamina + ' stamina');
          
        } else {
          console.log(characters[i].name + 'does not have any consumables in the saddlebag. Stamina: ' + characters[i].stats.stamina);
        }
      }
    } 
  }
};

export const weaponsQuality = async (characters) => {
  
  for (let i = 0; i < characters.length; i++) {
    if (characters[i].equipment.weapons.type === "common") {
      characters[i].equipment.weapons.quality--;
      console.log(characters[i].name + ' weapons quality is common, reduced by 1');
    } else {
      characters[i].equipment.weapons.quality++;
      if (characters[i].equipment.weapons.quality > 50) {
        characters[i].equipment.weapons.quality = 50;
      }
      console.log(characters[i].name + ' weapons quality is arcane, aumented quality by 1');
    }
  }
};

export const sanacion = async (characters) => {
  
  for (let i = 0; i < characters.length; i++) {
    let rand = Math.ceil(Math.random() * 3); //1D10
    characters[i].stats.strength += rand;
    console.log("The Priest Heals " + rand + " points of strength to " + characters[i].name);
    
  }
};


export const update = async (characters) => {
  try {
    // Actualizar todos los documentos
    const result = await Character.updateMany({characters});
  } catch (error) {
    console.error('Error al actualizar los jugadores:', error);
  } 
};