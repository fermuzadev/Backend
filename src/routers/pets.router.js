import { Router } from "express";

const router = Router();
let pets = [
  { name: "Rex", spice: "dog" },
  { name: "Garfield", spice: "cat" },
  { name: "Nemo", spice: "fish" },
];

router.get('/', (req,res) => {
  return res.status(200).json(pets)
})

//Las regexp van seguidas entre parentesis y corchetes
//a-z => a a la z en min A-Z idem para mayus 
//%20 => espacio
// + indica uno o mas caracteres

/* router.get("/:name([a-zA-Z%20]+)", (req, res) => {
  const {
    params: { name },
  } = req;
   const pet = pets.find((p) => p.name === name);
  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }
  res.status(200).json(pet);
}); */

router.post("/", (req, res) => {
  const { body } = req;
  const newPet = {
    ...body,
  };
  pets.push(newPet);
  res.status(201).json(newPet);
});

/*  router.put("/:name([a-zA-Z%20]+)", (req, res) => {
   const {
     params: { name },
   } = req;
   let pet = pets.find((p) => p.name === name);
   if (!pet) {
     return res.status(404).json({ message: "Pet not found" });
   }
   pet.adopted = true;
   res.status(200).json(pet);
 }); */



router.param("name", (req, res, next, name) => {
  console.log("Hello from name param middleware");
  const pet = pets.find((p) => p.name === name);
  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }
  req.pet = pet;
  next();
});
//Con el router param 👆🏿
router.put('/:name([a-zA-Z%20]+)', (req,res) => {
  req.pet.adopted = true;
  res.status(200).json(req.pet)
})

router.get('/:name([a-zA-Z%20]+)', (req, res) => {
  res.status(200).json(req.pet);
})


export default router;
