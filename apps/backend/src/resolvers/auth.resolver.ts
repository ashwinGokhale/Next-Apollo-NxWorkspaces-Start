import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, AuthOutput, SignupInput, LoginInput } from '../models/User';
import { signToken } from '../utils';
import { BadRequestError } from '../utils/errors';
import { AuthenticationError } from 'apollo-server-express';
import { IContext } from '../middleware/authentication';

@Resolver()
export class AuthResolver {
    constructor(
        @InjectRepository(User)
        private readonly userService: Repository<User>
    ) {}

    @Mutation(() => AuthOutput)
    async signup(@Arg('input') input: SignupInput) {
        if (input.password !== input.confirmPassword)
            throw BadRequestError('Passwords did not match');

        const exists = await this.userService.findOne({
            email: input.email
        });
        if (exists)
            throw BadRequestError('An account already exists with that email');

        const user = this.userService.create(input);
        user.password = input.password;
        await user.save();
        delete user.password;
        delete user.resetPasswordToken;
        const token = signToken(user);

        const output: AuthOutput = {
            user,
            token
        };

        return output;
    }

    @Mutation(() => AuthOutput)
    async login(@Arg('input') input: LoginInput, @Ctx() ctx: IContext) {
        const user = await this.userService
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: input.email })
            .getOne();

        if (!user || !(await user.comparePassword(input.password)))
            throw new AuthenticationError('Incorrect email and/or password');

        const token = signToken(user);

        const output: AuthOutput = {
            user,
            token
        };

        return output;
    }

    @Query(() => AuthOutput)
    @Authorized()
    async refresh(@Ctx() { user, req }: IContext) {
        const token = signToken(user);

        const output: AuthOutput = {
            user,
            token
        };

        return output;
    }
}
