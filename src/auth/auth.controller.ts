import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { LoginUserDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  loginUser(@Body() body: LoginUserDto) {
    const { id, email, password } = body;
    return this.authService.login(id, email, password);
  }
}
