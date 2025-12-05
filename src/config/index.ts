/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,



  stats_id: process.env.STATS_ID,
  server_url: process.env.SERVER_URL,

  database_url: process.env.DATABASE_URL,
  email_sender_host_user: process.env.EMAIL_SENDER_HOST_USER,
  resetPassword_token_expiresIn:
    process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,
  
  resetPassword_token_secret: process.env.JWT_RESET_PASSWORD_TOKEN_SECRET_KEY,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  stripe_secret_key: process.env.STRIPE_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
