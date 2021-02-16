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
  {
    $set: { title, label: { text: labelText, colour: labelColour }, updated: { at: new Date(), by: userId } },
  },
  { new: true },
);

const deleteTodoById = async (id) => Todo.deleteOne({ _id: id });

const addTaskToTodoByTodoId = async (id, taskText) => Todo.findByIdAndUpdate(
  id,
  {
    $push: {
      tasks: {
        text: taskText,
      },
    },
  },
  { new: true },
);

module.exports = {
  findTodosByCreateBy,
  createTodo,
  findTodoById,
  updateTodoById,
  deleteTodoById,
  addTaskToTodoByTodoId,
};
