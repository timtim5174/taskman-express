import express, { Response } from 'express';
import { User } from '../models/user';
import { MongoGenericDAO } from '../models/mongo-generic.dao';
import *  as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/sign-in', (req, res) => {
  res.render('sign-in');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.get('/logout', (req,res) => {
  res.clearCookie('jwt-token');
  res.redirect('/users/sign-in');
});

router.post('/', async (req, res) =>{
  const userDAO: MongoGenericDAO<User> = req.app.locals.userDAO; 
  let user: Partial<User> =  {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  }
  const cost = 10; 

  const salt = await bcrypt.genSalt(cost);
  const hash = await bcrypt.hash(user.password!, salt);
  user.password = hash;

  const result = await userDAO.create(user);
  const claim = { id: result.id, name: result.name, email: result.email };
  const token = jwt.sign(claim, 'secret', { algorithm:'HS256'});
  res.cookie('jwt-token', token);
  res.redirect('/tasks');
});

router.post('/sign-in', async (req, res) => {
  const userDAO: MongoGenericDAO<User> = req.app.locals.userDAO;
  const user: Partial<User> = { 
    email: req.body.email,
    password: req.body.password
  }

  const result:User = await userDAO.findOne({email: user.email});
  try{
    if(await bcrypt.compare(user.password!,result.password)){
      const claim = { id: result.id, name: result.name, email: result.email };
      const token = jwt.sign(claim, 'secret', { algorithm:'HS256'});
      res.cookie('jwt-token', token);
      res.redirect('/tasks');
    }else{
      signInFailed(res);
  }
  }
  catch(ex){
     signInFailed(res);
  }
});

function signInFailed(res: Response){
  res.clearCookie('jwt-token');
  res.redirect('/users/sign-in');
}

export default router;
