import express from 'express';
import { MongoGenericDAO } from '../models/mongo-generic.dao';
import { Task } from '../models/task';

const router = express.Router();

router.get('/', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const tasks: Task[] = await taskDAO.findAll({userId: res.locals.user.id});
  res.render('tasks',{tasks});
});

router.post('/', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const task: Partial<Task> = { title: req.body.title, status: 'open', userId: res.locals.user.id};
  await taskDAO.create(task);
  res.redirect('/tasks');
});

router.delete('/:id', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const id = req.params.id;
  await taskDAO.delete(id);
  res.status(200).end();
});

router.patch('/:id', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const task: Partial<Task> = { id: req.params.id, status: req.body.status };
  await taskDAO.update(task);
  res.status(200).end();
});

export default router;
