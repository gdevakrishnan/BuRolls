const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/companies", require("./routes/companies"));
app.use("/api/v1/business-units", require("./routes/businessUnits"));
app.use("/api/v1/admin", require("./routes/admin"));
app.use("/api/v1/manager", require("./routes/manager"));
app.use('/api/v1/notifications', require('./routes/notifications'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
