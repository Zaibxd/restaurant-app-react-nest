import { Body, Controller, Get, Post, UnauthorizedException} from '@nestjs/common';
import { UsersService } from './users.service';
import { Headers as NestHeaders } from '@nestjs/common';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('signup')
  async signUp(@Body() Body: {email: string, password: string, fullName?: string}){
    return this.usersService.signUp(Body.email, Body.password, Body.fullName)
  }

  @Post('signin')
  async signIn(@Body() body: {email: string, password: string}){
    return this.usersService.signIn(body.email, body.password)
  }

  @Get('profile')
  async getProfile(@NestHeaders('authorization') authHeader: string) {
    
    if (!authHeader) throw new UnauthorizedException('Authorization header missing');
    const token = authHeader.replace('Bearer ', '').trim();

    return this.usersService.getProfileByToken(token);
  }

}
