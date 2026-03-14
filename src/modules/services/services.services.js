import * as serviceRepo from './services.repo.js';

export async function createService(providerId,name,duration,price){
   const result = await serviceRepo.createServiceRepo(providerId,name,duration,price);
   return result;
}
export async function getService(){
   const result = await serviceRepo.getServiceRepo();
   return result;
}

export async function findService(id){
   const result = await serviceRepo.findServiceRepo(id);
   if(!result){
      throw new Error(`The id ${id} cannot be found`);
   }
   return result;
}