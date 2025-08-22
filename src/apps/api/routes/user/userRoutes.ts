import { Router } from 'express';
import { CreateUserController } from '../../controllers/user/createUser/createUser.controller';
import { LoginUserController } from '../../controllers/user/loginUser/loginUser.controller';
import { createUserValidationRules } from '../../controllers/user/createUser/createUser.validator';
import { RequestValidator } from '../../middlewares/validateRequest';
import { Request, Response, NextFunction } from 'express';
import { loginUserValidationRules } from '../../controllers/user/loginUser/loginUser.validator';
import { UpdateUserController } from '../../controllers/user/updateUser/updateUser.controller';
import { updateUserValidationRules } from '../../controllers/user/updateUser/updateUser.validator';

const router = Router();
const userController = new CreateUserController();
const loginController = new LoginUserController();

router.post(
  '/register',
  createUserValidationRules,
  (req: Request, res: Response, next: NextFunction) =>
    RequestValidator.handle(req, res, next),
  userController.registerUser.bind(userController)
);
router.post(
  '/login',
  loginUserValidationRules,
  loginController.login.bind(userController)
);
router.put(
  '/:id',
  updateUserValidationRules,
  new UpdateUserController().updateUser.bind(new UpdateUserController())
);

export const userRoutes = router;
