import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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

const categoryPageDetails = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid category ID", {}));
  }

  const selectedCategory = await Category.findById({ _id: categoryId })
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: "ratingAndReviews",
    })
    .exec();
  if (!selectedCategory) {
    return res.status(404).json(new ApiResponse(404, "No Category found", {}));
  }

  // Handle the case when there are no courses
  if (selectedCategory.courses.length === 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, "No courses found for the selected category.", {})
      );
  }

  // Get courses for other categories
  const categoriesExceptSelected = await Category.find({
    _id: { $ne: categoryId },
  });

  const differentCategory = await Category.findOne(
    categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
  )
    .populate({
      path: "courses",
      match: { status: "Published" },
    })
    .exec();

  // Get top-selling courses across all categories
  const allCategories = await Category.find()
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: {
        path: "instructor",
      },
    })
    .exec();

  const allCourses = allCategories.flatMap((category) => category.courses);
  const mostSellingCourses = allCourses
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);
  // console.log("mostSellingCourses COURSE", mostSellingCourses)

  return res.status(200).json(
    new ApiResponse(200, "Catalog page data fetched successfully", {
      selectedCategory,
      differentCategory,
      mostSellingCourses,
    })
  );
});

export { createCategory, showAllCategories, categoryPageDetails };
