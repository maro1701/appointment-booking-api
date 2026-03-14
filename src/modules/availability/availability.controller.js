import * as availabilityService from './availability.service.js';

export async function createAvailability(req,res,next){
   try{
      const {startTime,endTime} = req.body;
      const providerId = req.user.id;
      const availability = await availabilityService.createAvailability(providerId,startTime,endTime);
       return res.status(201).json({availability});
   } catch(err){
      next(err);
   }
}

export async function checkAvailability(req,res,next){
   try{
   const availability = await availabilityService.checkAvailability();
   return res.status(200).json({availability});
   } catch(err){
      next(err);
   }
}

export async function findAvailability(req,res,next){
   try{
      const availability = await availabilityService.findAvailability(req.params.id);
      return res.status(200).json({availability});
   } catch(err){
      next(err);
   }
}