import { Router } from 'express';
import { CreateUserController } from '../controllers/user/createUser/createUser.controller';
import { LoginUserController } from '../controllers/user/loginUser/loginUser.controller';
import { createUserValidationRules } from '../controllers/user/createUser/createUser.validator';
import { loginUserValidationRules } from '../controllers/user/loginUser/loginUser.validator';
import { UpdateUserController } from '../controllers/user/updateUser/updateUser.controller';
import { updateUserValidationRules } from '../controllers/user/updateUser/updateUser.validator';
import { GetUserController } from '../controllers/user/findUser/findUser.controller';
import { DeleteUserController } from '../controllers/user/deleteUser/deleteUser.controller';

const router = Router();
const userController = new CreateUserController();
const loginController = new LoginUserController();

router.post(
  '/register',
  createUserValidationRules,
  userController.registerUser.bind(userController)
);
router.post('/login', 
loginUserValidationRules,
loginController.login.bind(userController));
router.put(
  '/:id',
  updateUserValidationRules,
  new UpdateUserController().updateUser.bind(new UpdateUserController())
);
router.get(
  '/:id', GetUserController
);
router.delete('/:id', DeleteUserController);

export const userRoutes = router;
