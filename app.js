import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Endpoint

const users = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
  },
  {
    id: 3,
    name: "Summer Smith",
    status: "Alive",
    species: "Human",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  },
  {
    id: 4,
    name: "Beth Smith",
    status: "Alive",
    species: "Human",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
  },
  {
    id: 5,
    name: "Jerry Smith",
    status: "Alive",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/5.jpeg",
  },
  {
    id: 6,
    name: "Abadango Cluster Princess",
    status: "Alive",
    species: "Alien",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/6.jpeg",
  },
  {
    id: 7,
    name: "Abradolf Lincler",
    status: "unknown",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/7.jpeg",
  },
  {
    id: 8,
    name: "Adjudicator Rick",
    status: "Dead",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/8.jpeg",
  },
  {
    id: 9,
    name: "Agency Director",
    status: "Dead",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/9.jpeg",
  },
  {
    id: 10,
    name: "Alan Rails",
    status: "Dead",
    species: "Human",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/10.jpeg",
  },
];

app.get("/", (req, res) => {
  res.status(200).json(users);
});

app.get("/api/users", (req, res) => {
  res.status(200).json(users);
});

app.post("/api/users", (req, res) => {
  const body = req.body;

  const { id, name, status, species, gender, image } = body;

  if (!id || !name || !status || !species || !gender || !image) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  const newUser = {
    idSystem: users.length + 1,
    id,
    name,
    status,
    species,
    gender,
    image,
  };
  users.push(newUser);

  res.status(201).json(newUser);
});

app.put("/api/users/:userId", (req, res) => {
  const body = req.body;
  const { userId } = req.params;
  const { id, name, status, species, gender, image } = body;

  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (id) {
    user.id = id;
  }
  if (name) {
    user.name = name;
  }
  if (status) {
    user.status = status;
  }
  if (species) {
    user.species = species;
  }
  if (gender) {
    user.gender = gender;
  }
  if (image) {
    user.image = image;
  }

  res.status(200).json({ message: "User updated succesfull" });
});

app.delete("/api/users/:userId", (req, res) => {
  const { userId } = req.params;

  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  users = users.filter((u) => u.id !== parseInt(userId));
  res.status(200).json({ message: "user Deleted" });
});

app.get("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json(user);
  }
});

app.listen(8080, () => {
  console.log("El servidor esta corriendo en el puerto 8080 ");
});
