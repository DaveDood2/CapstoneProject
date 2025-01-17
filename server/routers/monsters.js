import { Router } from "express";
import Monster from "../models/Monster.js";

const router = Router();

// Get all monsters route
router.get("/", async (request, response) => {
  try {
    // Store the query params into a JavaScript Object
    const query = request.query; // Defaults to an empty object {}

    const data = await Monster.find(query);

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Get a single monster by ID
router.get("/:id", async (request, response) => {
  try {
    const data = await Monster.findById(request.params.id);

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Create monster route
router.post("/", async (request, response) => {
  try {
    const newMonster = new Monster(request.body);

    const data = await newMonster.save();

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    if ("name" in error && error.name === "ValidationError")
      return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Delete a monster by ID
router.delete("/:id", async (request, response) => {
  try {
    const data = await Monster.findByIdAndDelete(request.params.id);

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Update a single monster by ID
router.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const data = await Monster.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          name1: body.name1,
          word1: body.word1,
          canvas: body.canvas,
          progress: body.progress
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    response.json(data);
  } catch (error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    if ("name" in error && error.name === "ValidationError")
      return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

export default router;
