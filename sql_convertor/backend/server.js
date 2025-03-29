const express=require("express");
const app=express();
const query_routes=require("./routes/query_routes");
const login_routes=require("./routes/login_routes");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use("/api",query_routes);
app.use("/api",login_routes);
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
