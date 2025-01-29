import { Time } from "../db/models/Time.js";

export const getTime = async () => {
    try {
      const time = await Time.find();
          
      return time;
    } catch (error) {
      console.error('Error fetching Time:', error);
      throw error;
    }
  };
