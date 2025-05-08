import express from "express"
import { signUp ,getuser,logIn, editdata} from "../controllers/user_controller.js"
import { write ,loadblogs} from "../controllers/blog_controller.js"
import auth from "../middlewares/auth.js"
import upload from "../multer/multer.config.js"


const blog_routes = express.Router()


blog_routes.post("/signup",upload.single('file'),signUp)
blog_routes.post("/login",logIn)

blog_routes.get("/getuser/:id",getuser)


blog_routes.post("/write/:id",upload.single('file'),write)
blog_routes.get("/loadblogs",loadblogs)
blog_routes.post("/edit/:id", upload.single("file"),editdata)


export default blog_routes