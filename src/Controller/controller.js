import Async from "../Utils/Async.js";
import ApiError from "../Utils/Apierror.js";
import { User } from "../Module/module.js";
const Register = Async(async (req, res, next) => {
  const { fullName, Email, Mobile, Password } = req.body;
  if (!fullName) {
    throw new ApiError(404, "Name is missing!");
  }
  if (!Email) {
    throw new ApiError(404, "Email is missing!");
  }
  if (!Mobile) {
    throw new ApiError(404, "Mobile Number is missing !");
  }

  if (!Password) {
    throw new ApiError(404, "Password is missing !");
  }

  // user allready Exist or not

  const UserExist = await User.findOne({
    $or: [{ Email }, { Mobile }],
  });
  if (UserExist) {
    throw new ApiError(404, "user is allready exist!");
  }
  const user = await User.create({
    FullName: FullName.toLowerCase(),
    Password,
    Email,
    MobileNumber,
    MeterId,
  });

  const CreatedUser = await User.findById(user._id).select(
    "-Password -refreshToken",
  );
  if (!CreatedUser) {
    throw new ApiError(400, "user object is not created");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, CreatedUser, "user register successfully"));

  // return res.status(200).json(req.body)
});

export { Register };
