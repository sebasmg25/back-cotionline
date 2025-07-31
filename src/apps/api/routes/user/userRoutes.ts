import { Router } from 'express';
import { CreateUserController } from '../../controllers/user/createUser/createUser.controller';
import { LoginUserController } from '../../controllers/user/loginUser/loginUser.controller';

const router = Router();
const userController = new CreateUserController();
const loginController = new LoginUserController();

router.post('/register', userController.registerUser.bind(userController));
router.post('/login', loginController.login.bind(userController));

export const userRoutes = router;
