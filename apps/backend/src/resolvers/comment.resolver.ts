import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Root
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Post, CreatePostInput } from '../models/Post';
import { IContext } from '../middleware/authentication';
import { User } from '../models/User';
import { Comment, CreateCommentInput } from '../models/Comment';
import { BadRequestError } from '../utils/errors';

@Resolver(Comment)
export class CommentResolver {
    constructor(
        @InjectRepository(User)
        private readonly userService: Repository<User>,
        @InjectRepository(Post)
        private readonly postService: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentService: Repository<Comment>
    ) {}

    @Query(() => [Comment])
    @Authorized()
    async comments() {
        const comments = await this.commentService.find();
        return comments || [];
    }

    @Mutation(() => Comment)
    @Authorized()
    async createComment(
        @Arg('postId') postId: number,
        @Arg('input') input: CreateCommentInput,
        @Ctx() ctx: IContext
    ) {
        const post = await this.postService.findOne(postId);
        if (!post) throw BadRequestError(`Can't find post with id: ${postId}`);

        const comment = this.commentService.create({
            ...input,
            post,
            user: ctx.user
        });

        return await this.commentService.save(comment);
    }

    /**
     *
     * Field resolvers
     */

    @FieldResolver(() => User)
    async user(@Root() comment: Comment) {
        const user = await comment.user;
        return user;
    }

    @FieldResolver(() => Post)
    async post(@Root() comment: Comment) {
        const post = await comment.post;
        return post;
    }
}
