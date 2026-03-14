import * as availabilityRepo from './availability.repo.js';

export async function createAvailability(providerId,startTime,endTime){
   const result = await availabilityRepo.createAvailability(providerId,startTime,endTime);
   return result;
}

export async function checkAvailability(){
   const result = await availabilityRepo.checkAvailability();
   return result;
}

export async function findAvailability(id){
   const result = await availabilityRepo.findAvailability(id);
   if(!result){
      throw new Error(`The id ${id} cannot be found`);
   }
   return result;
}