import * as bookingService from './bookings.services.js';

export async function createBooking(req,res,next){
   const clientId = req.user.id;
   const {serviceId,slotId} = req.body;
    try{
         const booking = await bookingService.createBookingService(clientId,serviceId,slotId);
         return res.status(201).json({booking});
    } catch(err){
      next(err);
    }
}

export async function checkBooking(req,res,next){
   const providerId = req.user.id;
    try{
      const booking = await bookingService.checkBookingService(providerId);
      return res.status(200).json({booking});
    }catch(err){
      next(err);
    }
}

export async function deleteBooking(req,res,next){
  try{
    const result = await bookingService.deleteBookingService(
      req.params.id,
      req.user.id
    )
    return res.status(200).json(result);

  } catch(err){
    next(err);
  }
}