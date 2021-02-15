const Todo = require('./todo.model');

const findTodosByCreateBy = async (createdBy) => Todo.find({ createdBy });

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

const findTodoById = async (id) => Todo.findById(id);

const updateTodoById = async (id, title, labelText, labelColour) => Todo.findByIdAndUpdate(
  id,
  {
    $set: { title, label: { text: labelText, colour: labelColour } },
  },
  { new: true },
);

const deleteTodoById = async (id) => Todo.deleteOne({ _id: id });

module.exports = {
  findTodosByCreateBy,
  createTodo,
  findTodoById,
  updateTodoById,
  deleteTodoById,
};
