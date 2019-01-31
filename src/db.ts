import { MongoClient } from 'mongodb';
import { Express } from 'express';
import { MongoGenericDAO } from './models/mongo-generic.dao';
import { Task } from './models/task';
import { User } from './models/user';

export default async function startDB(app: Express) {
  const url = 'mongodb://localhost:27017';
  const options = {
    useNewUrlParser: true,
    auth: { user: 'taskman', password: 'wifhm' },
    authSource: 'taskman'
  };
  const client = await connectToMongoDB(url, options);
  app.locals.taskDAO = new MongoGenericDAO<Task>(client!.db('taskman'), 'tasks');
  app.locals.userDAO = new MongoGenericDAO<User>(client!.db('taskman'), 'users');
}

async function connectToMongoDB(url:string, options:object){
  try{
    return await MongoClient.connect(url,options);
  }
  catch(err){
    console.log('Could not connect to MongoDB: ', err.stack);
    process.exit(1);
  }
}
