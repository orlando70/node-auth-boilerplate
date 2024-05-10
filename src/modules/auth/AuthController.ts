import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import _ from "lodash";
import UserRepo from "../user/UserRepo";
import {
  bcryptCompare,
  bcryptHash,
  successResponse,
} from "../../utils/helpers";
import {
  AuthenticationError,
  NotFoundError,
  ServiceError,
} from "../../utils/errors";
import { UserType } from "../user/User";
import config from "../../config";
import logger from "../../utils/logger";
import { redisClient } from "../../db/connect";
import {
  passwordResetSuccessTemplate,
  passwordResetTemplate,
  sendEmailVerificationTemplate,
} from "../../utils/emailTemplates";
import { sendZeptoMail } from "../../utils/emailsms/zeptomail";

declare module "express-session" {
  interface Session {
    user: Omit<UserType, "password"> | null;
  }
}

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;

    try {
      const hashedPassword = await bcryptHash(password);

      const newUser = await UserRepo.createUser({
        ...req.body,
        password: hashedPassword,
      });

      res.send(successResponse(newUser));
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const validUser = await UserRepo.getByEmail(email);
      if (!validUser)
        throw new AuthenticationError("email or password incorrect");

      const validPassword = await bcryptCompare(password, validUser.password);
      if (!validPassword)
        throw new AuthenticationError("email or password incorrect");

      req.session.regenerate(function (err) {
        if (err) next(err);

        const userWithoutPassword = _.omit(validUser, ["password"]);

        req.session.user = userWithoutPassword;

        req.session.save(function (err) {
          if (err) return next(err);
          res.send(successResponse(userWithoutPassword));
        });
      });
    } catch (error) {
      next(error);
    }
  }

  public requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const EXPIRY = 60 * 30; //expires in 30 minutes
    const { email } = req.body;

    try {
      const user = await UserRepo.getByEmail(email);

      if (!user) return;

      const token = await redisClient.get(
        `passwordResetToken: userId: ${user._id}`
      );
      if (token) {
        await redisClient.del(`passwordResetToken: userId: ${user._id}`);
      }

      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcryptHash(resetToken);

      await redisClient.set(
        `passwordResetToken: userId: ${user._id}`,
        hash,
        'EX',
        EXPIRY,
      );

      const link = `${config.app.baseUrl}/passwordReset?token=${resetToken}&id=${user._id}`;
      sendZeptoMail({
        to: user.email,
        subject: "Password Reset Request",
        message: passwordResetTemplate(user.firstName, link),
      });

      res.send(successResponse());
    } catch (error) {
      next(error);
    }
  };

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { token, userId, password } = req.body;
    try {
      const passwordResetToken = await redisClient.get(
        `passwordResetToken: userId: ${userId}`
      );
      if (!passwordResetToken)
        throw new ServiceError("Invalid or expired password reset token");

      const isValid = await bcryptCompare(token, passwordResetToken);
      if (!isValid) {
        throw new ServiceError("Invalid or expired password reset token");
      }

      const hash = await bcryptHash(password);
      await UserRepo.updateUser(userId, {
        password: hash,
      });
      const user = await UserRepo.getUserById(userId);
      sendZeptoMail({
        to: user.email,
        subject: "Password Reset Successfully",
        message: passwordResetSuccessTemplate(user.firstName),
      });


      res.send(successResponse());
    } catch (error) {
      next(error);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { token, userId } = req.body;
    try {
      const user = await UserRepo.getUserById(userId);
      if (user.isVerified) {
        return res.send(successResponse({message: "This account has already been verified. Please log in."}))
      }

      const emailVerificationToken = await redisClient.get(
        `emailVerificationToken: userId: ${userId}`
      );
      if (!emailVerificationToken)
        throw new ServiceError("Invalid token");

      const isValid = await bcryptCompare(token, emailVerificationToken);
      if (!isValid) {
        throw new ServiceError("Invalid token");
      }

      await UserRepo.updateUser(userId, {
        isVerified: true,
      });


      res.send(successResponse());
    } catch (error) {
      next(error);
    }
  }

  public async sendEmailVerification(req: Request, res: Response, next: NextFunction) {
    const {email} = req.body;
    try {
      const user = await UserRepo.getByEmail(email);
      if (!user) return;

      const token = await redisClient.get(
        `emailVerificationToken: userId: ${user._id}`
      );
      if (token) {
        await redisClient.del(`emailVerificationToken: userId: ${user._id}`);
      }

      let verifyEmailToken = crypto.randomBytes(32).toString("hex");
      const link = `${config.app.baseUrl}/email/verify?token=${verifyEmailToken}&id=${user._id}`;
      const hash = await bcryptHash(verifyEmailToken);

      await redisClient.set(
        `emailVerificationToken: userId: ${user._id}`,
        hash
      );

      sendZeptoMail({
        to: email,
        subject: "Email Verification",
        message: sendEmailVerificationTemplate(user.firstName, link),
      });
      
      res.send(successResponse())
    } catch (error) {
      next(error)
    }
  }


  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.user = null;
      req.session.save(function (err) {
        if (err) next(err);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
          if (err) next(err);
          res.send(successResponse());
        });
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
