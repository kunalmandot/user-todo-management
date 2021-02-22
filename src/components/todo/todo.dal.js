const Todo = require('./todo.model');

const saveTodo = async (createdBy, title, labelText, labelColour) => {
  const todo = new Todo({
    createdBy,
    title,
    label: {
      text: labelText,
      colour: labelColour,
    },
  });
  const createdTodo = todo.save();
  return createdTodo;
};

const findTodosByCreateBy = async (userId, userEmail) => Todo.find(
  {
    $and: [
      { $or: [{ createdBy: userId }, { 'sharedWith.email': userEmail }] },
      { isActive: true },
    ],
  },
  {
    createdBy: 0, sharedWith: 0, tasks: 0, isActive: 0, statusChanged: 0,
  },
);

const findTrashedTodosByCreateBy = async (userId, userEmail) => Todo.find(
  {
    $and: [
      { $or: [{ createdBy: userId }, { 'sharedWith.email': userEmail }] },
      { isActive: false },
    ],
  },
  {
    createdBy: 0, sharedWith: 0, tasks: 0, isActive: 0,
  },
);

const findTodoById = async (todoId) => Todo.findOne({ $and: [{ _id: todoId }, { isActive: true }] });

const findTrashedTodoById = async (todoId) => Todo.findOne({ $and: [{ _id: todoId }, { isActive: false }] });

const updateTodoById = async (userId, todoId, title, labelText, labelColour) => Todo.updateOne(
  { _id: todoId },
  { $set: { title, label: { text: labelText, colour: labelColour }, updated: { at: new Date(), by: userId } } },
);

const updateTodoStatusById = async (todoId, userId, todoStatus) => Todo.updateOne(
  { _id: todoId },
  { $set: { isActive: todoStatus }, statusChanged: { at: new Date(), by: userId } },
);

const deleteTodoById = async (todoId) => Todo.deleteOne({ _id: todoId });

const addSharedWithToTodoByTodoId = async (todoId, sharedWithEmail) => Todo.updateOne(
  { _id: todoId },
  { $push: { sharedWith: { email: sharedWithEmail } } },
);

const deleteSharedWithByTodoIdAndSharedWithId = async (todoId, sharedWithId) => Todo.updateOne(
  { _id: todoId },
  { $pull: { sharedWith: { _id: sharedWithId } } },
);

const addTaskToTodoByTodoId = async (todoId, taskText) => Todo.updateOne(
  { _id: todoId },
  { $push: { tasks: { text: taskText } } },
);

const updateTaskTextByTodoIdAndTaskId = async (userId, todoId, taskId, taskText) => Todo.updateOne(
  { $and: [{ _id: todoId }, { 'tasks._id': taskId }] },
  { $set: { 'tasks.$.text': taskText, 'tasks.$.updated': { at: new Date(), by: userId } } },
);

const updateTaskStatusByTodoIdAndTaskId = async (userId, todoId, taskId, taskStatus) => Todo.updateOne(
  { $and: [{ _id: todoId }, { 'tasks._id': taskId }] },
  { $set: { 'tasks.$.checked': taskStatus, 'tasks.$.updated': { at: new Date(), by: userId } } },
);

const deleteTaskByTodoIdAndTaskId = async (todoId, taskId) => Todo.updateOne(
  { _id: todoId },
  { $pull: { tasks: { _id: taskId } } },
);

module.exports = {
  findTodosByCreateBy,
  findTrashedTodosByCreateBy,
  saveTodo,
  findTodoById,
  findTrashedTodoById,
  updateTodoById,
  updateTodoStatusById,
  deleteTodoById,
  addSharedWithToTodoByTodoId,
  deleteSharedWithByTodoIdAndSharedWithId,
  addTaskToTodoByTodoId,
  updateTaskTextByTodoIdAndTaskId,
  updateTaskStatusByTodoIdAndTaskId,
  deleteTaskByTodoIdAndTaskId,
};
