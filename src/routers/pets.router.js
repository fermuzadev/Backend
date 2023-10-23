import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { uploader } from "../utils.js";

const router = Router();

const pets = [
  {
    id: uuidv4(),
    name: "Snowball",
    race: "Maltez",
    age: "3",
    gender: "M",
    thumbnail:
      "https://static.wikia.nocookie.net/lossimpson/images/a/a6/Snowball_II.png/revision/latest?cb=20090724162018&path-prefix=es",
  },
];

//Endpoint middleware
const middleware = (req, res, next) => {
  const today = new Date();
  const message = `📅${today.toLocaleDateString()} - ⌚${today.toLocaleTimeString()}`;
  console.log("Desde el middleware router", message);
  next();
};

router.use(middleware);

router.get("/pets", (req, res) => {
  res.status(200).json(pets);
});

router.post("/pets", uploader.single("thumbnail"), (req, res) => {
  const { body } = req;
  const newPet = {
    id: uuidv4(),
    ...body,
    thumbnail: req.file.path,
  };
  pets.push(newPet);
  res.status(201).json(newPet);
});

export default router;
