import "dotenv/config";
import app from "./app.js";
import connectDB from "./common/config/db.js";


connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});