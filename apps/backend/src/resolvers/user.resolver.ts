import {
    Resolver,
    Root,
    FieldResolver,
    Query,
    Authorized,
    Arg
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';

@Resolver(User)
export class UserResolver {
    constructor(
        @InjectRepository(User)
        private readonly userService: Repository<User>,
        @InjectRepository(Post)
        private readonly postService: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentService: Repository<Comment>
    ) {}

    @Query(() => [User])
    @Authorized()
    async users() {
        const users = await this.userService.find();
        return users || [];
    }

    @Query(() => User, { nullable: true })
    async user(@Arg('id') id: number) {
        const user = await this.userService.findOne(id);
        return user;
    }

    /**
     *
     * Field resolvers
     */

    @FieldResolver(() => [Post])
    async posts(@Root() user: User) {
        return await user.posts;
    }

    @FieldResolver(() => [Post])
    async likes(@Root() user: User) {
        return await user.likes;
    }

    @FieldResolver(() => [Post])
    async dislikes(@Root() user: User) {
        return await user.dislikes;
    }

    @FieldResolver(() => [User])
    async followers(@Root() user: User) {
        return await user.followers;
    }

    @FieldResolver(() => [User])
    async following(@Root() user: User) {
        return await user.following;
    }

    @FieldResolver(() => [Comment])
    async comments(@Root() user: User) {
        return await user.comments;
    }
}
