import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim() || !description?.trim()) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const category = await Category.create({
    name,
    description,
  });
  if (!category) {
    return res
      .status(500)
      .json(
        new ApiResponse(400, "Error occured while creating the category", {})
      );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Category created successfully", category));
});

const showAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}, { name: true, description: true });
  if (!categories) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Unable to fetch the Categories", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Categories fetched successfully", categories));
});

export { createCategory, showAllCategories };
