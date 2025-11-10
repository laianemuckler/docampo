import Product from "../models/product.model.js";

export const create = async (productData) => {
  return Product.create(productData);
};

export const findAll = async () => {
  return Product.find({});
};

export const findById = async (id) => {
  return Product.findById(id);
};

export const deleteById = async (id) => {
  return Product.findByIdAndDelete(id);
};

export const findByCategory = async (category) => {
  return Product.find({ category });
};

export const sample = async (size = 4) => {
  return Product.aggregate([
    { $sample: { size } },
    { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
  ]);
};
