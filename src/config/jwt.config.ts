import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
  },
  refresh: {
    secret: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET,
    expiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  encryptPayload: process.env.AUTH_JWT_PAYLOAD_ENCRYPT,
  encryption: {
    key: process.env.AUTH_JWT_ENCRYPTION_KEY,
    iv: process.env.AUTH_JWT_ENCRYPTION_IV,
  },
}));
