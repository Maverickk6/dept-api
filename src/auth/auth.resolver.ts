import { Resolver, Mutation, Args, Query, ObjectType } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => User)
  async register(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Mutation(() => User)
  async login(
    @Args('loginUserDto') loginUserDto: LoginUserDto,
  ): Promise<{ user: User; token: string }> {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = await this.authService.login(user);
    return { user: user, token: token.access_token };
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.authService.getAllUsers();
  }
}
