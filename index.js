import express from 'express';
import {connectDB} from './DB/connection.js';
import AuthRouter from './src/modules/Auth/Auth.Route.js';
import UserRouter from './src/modules/User/User.Router.js';
import GrammarCheckRouter from './src/modules/Services/Services.Router.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();  
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectDB();

app.use('/auth', AuthRouter);  
app.use('/user', UserRouter);
app.use('/grammer-check',GrammarCheckRouter);


//global error handler
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({message: err.message, stack: err.stack});
})

app.listen(PORT , console.log(`Server is running on port ${PORT}`));
