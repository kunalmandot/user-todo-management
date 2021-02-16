const Todo = require('./todo.model');

const createTodo = async (createdBy, title, labelText, labelColour) => {
  const todo = new Todo({
    createdBy,
    title,
    label: {
      text: labelText,
      colour: labelColour,
    },
  });
  return todo.save();
};

const findTodosByCreateBy = async (createdBy) => Todo.find({ $and: [{ createdBy }, { isActive: true }] });

const findTodoById = async (id) => Todo.findById(id);

const updateTodoById = async (userId, todoId, title, labelText, labelColour) => Todo.findOneAndUpdate(
  { _id: todoId },
  { $set: { title, label: { text: labelText, colour: labelColour }, updated: { at: new Date(), by: userId } } },
  { new: true },
);

const deleteTodoById = async (id) => Todo.deleteOne({ _id: id });

const addTaskToTodoByTodoId = async (todoId, taskText) => Todo.findByIdAndUpdate(
  todoId,
  { $push: { tasks: { text: taskText } } },
  { new: true },
);

const findTaskByTodoIdAndTaskId = async (todoId, taskId) => Todo.findOne({ $and: [{ _id: todoId }, { 'tasks._id': taskId }] });

const updateTaskTextByTodoIdAndTaskId = async (userId, todoId, taskId, taskText) => Todo.findOneAndUpdate(
  { $and: [{ _id: todoId }, { 'tasks._id': taskId }] },
  { $set: { 'tasks.$.text': taskText, 'tasks.$.updated': { at: new Date(), by: userId } } },
  { new: true },
);

const deleteTaskByTodoIdAndTaskId = async (todoId, taskId) => Todo.findByIdAndUpdate(
  todoId,
  { $pull: { tasks: { _id: taskId } } },
  { new: true },
);

module.exports = {
  findTodosByCreateBy,
  createTodo,
  findTodoById,
  updateTodoById,
  deleteTodoById,
  addTaskToTodoByTodoId,
  findTaskByTodoIdAndTaskId,
  updateTaskTextByTodoIdAndTaskId,
  deleteTaskByTodoIdAndTaskId,
};
