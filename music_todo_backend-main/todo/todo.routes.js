import express from "express";
import { validateAccessToken } from "../middlewares/authentication.middleware.js";
import { checkMongoIdValidity } from "../utils/mongo.id.validity.js";
import { Todo } from "./todo.model.js";
import {
  getTodoListValidationSchema,
  todoValidationSchema,
} from "./todo.validation.js";
import { validateReqBody } from "../middlewares/validation.middleware.js";
import mongoose from "mongoose";
const router = express.Router();

router.post(
  "/todo/add",
  validateReqBody(todoValidationSchema),
  validateAccessToken,
  async (req, res) => {
    const newTodo = req.body;
    const user = req.userDetails;

    newTodo.userId = user._id;

    await Todo.create(newTodo);

    return res.status(201).send({ message: "Todo is added successfully." });
  }
);

router.delete("/todo/delete/:id", validateAccessToken, async (req, res) => {
  // extract id from req.params
  const todoId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = checkMongoIdValidity(todoId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // check if todo with that id exists
  const todo = await Todo.findOne({ _id: todoId });

  // if not todo, throw error
  if (!todo) {
    return res.status(404).send({ message: "Todo does not exist." });
  }

  // check if loggedIn user is owner of that todo
  const tokenUserId = req.userDetails._id;
  const todoOwnerId = todo.userId;

  const isOwnerOfTodo = todoOwnerId.equals(tokenUserId);

  // if not owner ,throw error
  if (!isOwnerOfTodo) {
    return res.status(403).send({ message: "You are not owner of this todo." });
  }

  // delete todo
  await Todo.deleteOne({ _id: todoId });
  // send appropriate response

  return res.status(200).send({ message: "Todo is deleted successfully." });
});

router.get("/todo/details/:id", validateAccessToken, async (req, res) => {
  // extract id from req.params
  const todoId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = checkMongoIdValidity(todoId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // check if todo exists with provided todoId
  const todo = await Todo.findOne({ _id: todoId });

  // if todo not found, throw error
  if (!todo) {
    return res.status(404).send({ message: "Todo does not exist." });
  }

  // check for todo ownership
  const todoOwnerId = todo.userId;
  const loggedInUserId = req.userDetails._id;

  const isOwnerOfTodo = todoOwnerId.equals(loggedInUserId);

  if (!isOwnerOfTodo) {
    return res.status(403).send({ message: "You are not owner of this todo." });
  }

  todo.userId = undefined;

  return res.status(200).send(todo);
});

router.post(
  "/todo/list",
  validateReqBody(getTodoListValidationSchema),
  validateAccessToken,
  async (req, res) => {
    // extract page,limit data from req.body
    const { page, limit } = req.body;

    // skip ,limit
    const skip = (page - 1) * limit;

    let userId = req.userDetails._id;

    const todos = await Todo.aggregate([
      {
        $match: { userId: userId },
      },
      { $sort: { createdAt: -1 } },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          userId: 0,
        },
      },
    ]);

    return res.status(200).send(todos);
  }
);

// update todo
router.put("/todo/update/:id", validateAccessToken, async (req, res) => {
  // extract todoId from params
  const todoId = req.params.id;

  // extract new values from req.body
  const newValues = req.body;

  // check todoId for mongo id validity
  // check for mongo id validity
  const isValidMongoId = checkMongoIdValidity(todoId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // check if todo with provided id exist

  const requiredTodo = await Todo.findOne({ _id: todoId });

  // if not todo, throw error
  if (!requiredTodo) {
    return res.status(404).send({ message: "Todo does not exist." });
  }

  // check todo ownership

  const todoOwnerId = requiredTodo.userId;
  const loggedInUserId = req.userDetails._id;

  const isOwnerOfTodo = String(todoOwnerId) === String(loggedInUserId);

  // throw error if ownership fails
  if (!isOwnerOfTodo) {
    return res.status(403).send({ message: "You are not owner of this todo." });
  }

  // update the todo
  await Todo.updateOne(
    { _id: todoId },
    {
      $set: {
        ...newValues,
      },
    }
  );

  // send appropriate response

  return res.status(200).send({ message: "Todo is updated successfully." });
});

export default router;
