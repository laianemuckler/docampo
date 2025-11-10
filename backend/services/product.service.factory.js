export function createProductService({ productRepo, storageClient }) {
  const listProducts = async () => {
    return productRepo.findAll();
  };

  const createProduct = async ({ name, description, price, image, category }) => {
    let imageUrl = "";
    if (image) {
      const uploadResp = await storageClient.uploadImage(image, "products");
      imageUrl = uploadResp?.secure_url || "";
    }

    const product = await productRepo.create({ name, description, price, image: imageUrl, category });
    return product;
  };

  const deleteProduct = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }

    if (product.image) {
      const parts = product.image.split("/");
      const filename = parts.pop();
      const publicId = `products/${filename.split('.')[0]}`;
      try {
        await storageClient.deleteImage(publicId);
      } catch (e) {
        console.log("error deleting image from cloudinary", e.message || e);
      }
    }

    await productRepo.deleteById(id);
  };

  const getByCategory = async (category) => {
    return productRepo.findByCategory(category);
  };

  const getRecommended = async (size = 4) => {
    return productRepo.sample(size);
  };

  return { listProducts, createProduct, deleteProduct, getByCategory };
}
