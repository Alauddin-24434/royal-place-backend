import { IUser } from "../../app/modules/User/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // আপনি যেটা MongoDB থেকে ফেরত পান
    }
  }
}
