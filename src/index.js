import Data from "./DB/database.js";
import App from "./App.js";

Data()
  .then(() => {
    App.listen(process.env.PORT, () => {
      console.log(
        `database connected successfully at port ${process.env.PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error("ERROR", error.message);
  });
