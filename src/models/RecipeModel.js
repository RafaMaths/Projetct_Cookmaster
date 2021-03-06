const { ObjectId } = require('mongodb');
const { connection } = require('./connection');

const createRecipe = async ({ name, ingredients, preparation }) => {
  const recipeCollection = await connection()
  .then((db) => db.collection('recipes'));
  const { insertedId: id } = await recipeCollection.insertOne(
    { name, ingredients, preparation },
  );
    
  return { name, ingredients, preparation, id };
};

const getAllRecipes = async () => {
  const recipeCollection = await connection()
  .then((db) => db.collection('recipes'));
  const recipe = await recipeCollection.find().toArray();
  return recipe;
};

const getRecipeById = async (id) => {
  const recipeCollection = await connection()
  .then((db) => db.collection('recipes'));
  const recipe = await recipeCollection.findOne({ _id: ObjectId(id) });
  return recipe;
};

const updateRecipe = async ({ name, ingredients, preparation }, id) => {
  if (!ObjectId.isValid(id)) return null;
  const recipeCollection = await connection()
  .then((db) => db.collection('recipes'));

  await recipeCollection.updateOne({ _id: ObjectId(id) },
  {
    $set: { name, ingredients, preparation },
  });

  return {
    name,
    ingredients,
    preparation,
    id,    
  };
};

const deleteRecipe = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const recipeCollection = await connection()
  .then((db) => db.collection('recipes'));

  await recipeCollection.deleteOne({ _id: ObjectId(id) });
  return id;
};

const uploadImage = async ({ id, imageURL }) => {
  if (!ObjectId.isValid(id)) return null;
  
  const recipeCollection = await connection()
  .then((db) => db.collection('recipes'));

  await recipeCollection.updateOne({ _id: ObjectId(id) },
  {
    $set: { imageURL },
  });

  return id;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};
