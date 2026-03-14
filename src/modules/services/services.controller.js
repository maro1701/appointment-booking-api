import * as serviceService from './services.services.js';

export async function createService(req,res,next){
   try{ 
      console.log('req.user:',req.user);
      const {name,duration,price} = req.body;
      const providerId = req.user.id;
      console.log('providerId:',providerId);
         const service = await serviceService.createService(req.user.id,name,duration,price);
         return res.status(201).json({service});
   } catch(err){
      next(err);
   }
}

export async function getService(req,res,next){
   try{
   const service = await serviceService.getService();
   return res.status(200).json({service});
   } catch(err){
      next(err);
   }
}

export async function findService(req,res,next){
   try{
   const service = await serviceService.findService(id);
      return res.status(200).json({service});
   } catch(err){
      next(err);

   }
}