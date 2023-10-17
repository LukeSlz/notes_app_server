import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";


//Express init
const app = express();  
  //Port
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


//Prisma init
const prisma = new PrismaClient();

//Endpoints
  //GET
app.get("/notes", async (req, res) => {
  res.json({message: "success!"});
});

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
})
  //POST
app.post("/api/notes", async (req, res) => {
  const {title, content} = req.body;

  if(!title || !content){
    return res.status(400).send("title and content fields required");
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
    
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

  //PUT
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content){
    return res.status(400).send("title and content fields required");
  }
  if (!id || isNaN(id)){
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {id},
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  };
});

  //DELETE
app.delete("/api/notes/:id",async (req, res) => {
  const id = parseInt(req.params.id);
  
  if(!id || isNaN(id)){
    return res.status(400).send("ID field is required");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});










//Listen to port
app.listen(PORT, () => {
  console.log(`____________________\n
Server running on localhost:${PORT}\n
____________________`);
  
})