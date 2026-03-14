import {verifyToken} from '../modules/utils/jwt.js'
export default function protect(req,res,next){
   try{
   const authHeader = req.headers.authorization;
   if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).json({message:'Authorization header required'});
   }
   const token = authHeader.split(' ')[1];
   const decoded = verifyToken(token);
   req.user = decoded;
   next();
}
catch(err){
        return res.status(401).json('Invalid or missing token');
}
}