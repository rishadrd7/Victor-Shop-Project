
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');


//catagory page

const category = async (req, res) => {
  try {
    const categories = await Category.find();
    // console.log("categories : ", categories);
    res.render('admin/category',{categories});
  } catch (error) {
    console.log(error);

  }
}

//add catagory form
const categoryAdd = async (req, res) => {
  const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
  try {
    res.render('admin/addCategory');
  } catch (error) {
    console.log(error);

  }
}


const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

  
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const newCategory = new Category({
      name: name,
      description: description
    });

  
    await newCategory.save();

   
    res.json({ success: true, message: 'Category added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Category with this name already exists' });
  }
};


//category edit option
const getEditCategory = async (req, res) => {
  try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);
      if (!category) {
          return res.status(404).send('Category not found');
      }
      res.render('admin/editCategory', { category: category });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};


const postEditCategory = async (req, res) => {
  try {
      const categoryId = req.params.id;
      const { categoryName, categoryDescription } = req.body;

      const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name: categoryName, description: categoryDescription }, { new: true });
      if (!updatedCategory) {
          return res.status(404).send('Category not found');
      }

      res.redirect('/admin/categories');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};



//category delete option
  const postDeleteCategory = async (req, res) => {
    try {
      console.log("fddf");
      const categoryId = req.params.id;
      // Delete the category from the database
      await Category.findByIdAndDelete(categoryId);
      // Redirect to the category listing page
      res.redirect('/admin/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };


  
const toggleCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { listed } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { listed }, { new: true });
    if (!updatedCategory) {
      return res.status(404).send('Category not found');
    }
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  category,
  addCategory,
  categoryAdd,
  getEditCategory,
  postDeleteCategory,
  postEditCategory,
  toggleCategory
}