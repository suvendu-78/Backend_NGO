import Async from "../Utils/Async.js";
import ApiError from "../Utils/Apierror.js";
import { User } from "../Module/module.js";
import Apiresponse from "../Utils/Apiresponce.js";

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
    fullName: fullName.toLowerCase(),
    Password,
    Email,
    Mobile,
  });
  console.log(user);
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

const Login = Async(async (req, res) => {
  const { Email, Password } = req.body;

  console.log(Email, Password);

  if (!Email) {
    throw new ApiError(404, "Email is required!");
  }

  if (!Password) {
    throw new ApiError(404, "password is required!");
  }

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passwordValid = await user.isPasswordCorrect(Password);

  if (!passwordValid) {
    throw new ApiError(404, "Password is incorrect");
  }

  const accessToken = user.ACCESS_TOKEN();

  const logedin = await User.findById(user._id).select(
    "-Password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new Apiresponse(
        200,
        { logedin, accessToken },
        "User logged in successfully",
      ),
    );
});

export { Register, Login };
