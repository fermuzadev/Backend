import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const users = [
  {
    id: uuidv4(),
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  },
  {
    id: uuidv4(),
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
  },
  {
    id: uuidv4(),
    name: "Summer Smith",
    status: "Alive",
    species: "Human",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  },
  {
    id: uuidv4(),
    name: "Beth Smith",
    status: "Alive",
    species: "Human",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
  },
  {
    id: uuidv4(),
    name: "Jerry Smith",
    status: "Alive",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/5.jpeg",
  },
  {
    id: uuidv4(),
    name: "Abadango Cluster Princess",
    status: "Alive",
    species: "Alien",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/6.jpeg",
  },
  {
    id: uuidv4(),
    name: "Abradolf Lincler",
    status: "unknown",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/7.jpeg",
  },
  {
    id: uuidv4(),
    name: "Adjudicator Rick",
    status: "Dead",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/8.jpeg",
  },
  {
    id: uuidv4(),
    name: "Agency Director",
    status: "Dead",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/9.jpeg",
  },
  {
    id: uuidv4(),
    name: "Alan Rails",
    status: "Dead",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/10.jpeg",
  },
];
router.get("/users", (req, res) => {
  res.status(200).json(users);
});

router.post("/users", (req, res) => {
  const { body } = req;
  const newUser = {
    id: uuidv4(),
    ...body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

export default router;
