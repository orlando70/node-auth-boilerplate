import express from 'express';
import AuthController from './AuthController';
import { validateInput } from '../../middleware/application/validate';
import { loginSchema, registerSchema } from '../../utils/validation/schemas';


const controller = new AuthController();
const router = express.Router();



router.post('/register', validateInput(registerSchema), controller.register);
router.post('/login', validateInput(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.post('/initiate/password-reset', controller.requestPasswordReset);
router.post('/password-reset', controller.resetPassword);
router.post('/initiate/email-verify', controller.sendEmailVerification);
router.post('/email-verify', controller.verifyEmail);


export default router;
