import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // the token will be valid even after it expires (only for testing)
      ignoreExpiration: true,
      secretOrKey:'defaultsecret',
    });
  }

  async validate(payload: any) {
     return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
