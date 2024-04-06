import { contactUsEmail } from "../mail/templates/contactFormRes.mjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import mailSender from "../utils/mailSender.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const contactUs = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNo, message, countryCode } =
    req.body;
  const response = mailSender(
    email,
    "Your message is sent successfully",
    contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Email sent successfully", response));
});
