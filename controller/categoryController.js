
const mongoose = require('mongoose');
const Category = require('../models/categoryModel');


//catagory page

const category = async (req, res) => {
  try {
    const categories = await Category.find();
    // console.log("categories : ", categories);
    res.render('admin/category', { categories });
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

    // Convert category name to lowercase for case-insensitive comparison
    const lowerCaseName = name.toLowerCase();

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${lowerCaseName}$`, 'i') } });
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



//category edit 
const editCAtegory = async (req, res) => {
  try {
    const { categoryId, editedDescription, editedName } = req.body;
    console.log(categoryId, editedDescription, editedName);

    // Convert edited name to lowercase for case-insensitive comparison
    const lowerCaseEditedName = editedName.toLowerCase();

    // Check if any other category with the same name already exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      _id: { $ne: categoryId }, // Exclude the current category from the search
      name: { $regex: new RegExp(`^${lowerCaseEditedName}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Another category with this name already exists' });
    }

    // Update the category
    await Category.updateOne({ _id: categoryId }, { $set: { name: editedName, description: editedDescription } });
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
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


// category list and unlist
const listUnlistCategory = async (req, res) => {
  try {
    const { id, listed } = req.body;
    console.log(listed)
    if (listed==='true') {
      const idd = await Category.updateOne({ _id: id }, { $set: { listed: false } })
      console.log(idd)
      res.json({status:false})
    } else {
      await Category.updateOne({ _id: id }, { $set: { listed: true } })
      res.json({status:true})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};





module.exports = {
  category,
  addCategory,
  categoryAdd,
  editCAtegory,
  postDeleteCategory,
  listUnlistCategory
}