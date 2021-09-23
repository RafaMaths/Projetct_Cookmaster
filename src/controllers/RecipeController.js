const code = require('http-status-codes');
const multer = require('multer');
const RecipeService = require('../services/RecipeService');
const RecipeModel = require('../models/RecipeModel');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, '../uploads');
  },
  fileName: (req, _file, cb) => {
    const { id } = req.params;
    cb(null, `${id}.jpeg`);
  },
});

const upload = multer({ storage });

// cria a receita
const createRecipe = async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const { _id: userId } = req.user;
  
  const { message, id } = await RecipeService.createRecipe({ 
    name, ingredients, preparation,
  });
  
  if (message) {
    return res.status(code.BAD_REQUEST).json({ message });
  }

  return res.status(code.CREATED).json(
    { recipe: { name, ingredients, preparation, userId, _id: id } },
    );
};

// visualiza receitas
const getAllRecipes = async (req, res) => {
  const allRecipes = await RecipeModel.getAllRecipes();
  if (!allRecipes) {
    return res.status(code.NOT_FOUND).json({ message: 'Nenhuma receita encontrada' });
  }
  return res.status(code.OK).json(allRecipes);
};

// visualiza receita pelo ID
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const recipe = await RecipeService.getRecipeById(id);
  
  if (recipe.message) {
    return res.status(code.NOT_FOUND).json({ message: 'recipe not found' });
  }
  return res.status(code.OK).json(recipe);
};

// atualiza receita
const updateRecipe = async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const { _id: userId } = req.user;
  const { id } = req.params;
    
  const { message } = await RecipeService.updateRecipe({ 
    name, ingredients, preparation,
  }, id);
  
  if (message) {
    return res.status(code.BAD_REQUEST).json({ message });
  }

  return res.status(code.OK).json(
    { _id: id, name, ingredients, preparation, userId },
    );
};

// deleta receita
const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  const { message } = await RecipeService.deleteRecipe(id);
  if (message) {
    return res.status(code.BAD_REQUEST).json({ message });
  }

  return res.status(code.NO_CONTENT).json(id);
};

// uploadImage
const uploadImage = () => {};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};