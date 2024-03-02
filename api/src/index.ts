import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(cors());

//Create Prisma Client
const prisma = new PrismaClient();

//Get Notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany(); //note reference to the model that i was created
    res.json(notes);
  } catch (err) {
    console.log(err);
  }
});

//Post Note
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json("title and content fields are required");
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json("Something went wrong!");
    console.log(error);
  }
});

//Update Note
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).json("ID must be valid number");
  }

  if (!title || !content) {
    return res.status(400).json("title and content fields are required");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json("Something went wrong");
    console.log(error);
  }
});

//Delete Note
app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).json("ID must be valid number");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).json("Note have been delete successfully");
  } catch (error) {
    res.status(400).json("Something went wrong");
  }
});

app.listen(7000, () => {
  console.log("Server is running on port localhost:7000");
});
