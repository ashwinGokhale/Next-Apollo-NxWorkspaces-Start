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
import { Comment } from '../models/Comment';

@Resolver(Post)
export class PostResolver {
    constructor(
        @InjectRepository(User)
        private readonly userService: Repository<User>,
        @InjectRepository(Post)
        private readonly postService: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentService: Repository<Comment>
    ) {}

    @Query(() => [Post])
    @Authorized()
    async posts() {
        const posts = await this.postService.find();
        return posts || [];
    }

    @Query(() => Post, { nullable: true })
    async post(@Arg('id') id: number) {
        const post = await this.postService.findOne(id);
        return post;
    }

    @Authorized()
    @Mutation(() => Post)
    async createPost(
        @Arg('input') input: CreatePostInput,
        @Ctx() ctx: IContext
    ) {
        const photos = input.photos
            ? input.photos.map((photo) => {
                  console.log('Got photo:', photo);
                  return photo.filename;
              })
            : [];

        const post = this.postService.create({ ...input, photos });
        post.user = ctx.user;

        return await this.postService.save(post);
    }

    /**
     *
     * Field resolvers
     */

    @FieldResolver(() => User)
    async user(@Root() post: Post) {
        const user = await post.user;
        return user;
    }

    @FieldResolver(() => [User])
    async likes(@Root() post: Post) {
        const likes = await post.likes;
        return likes;
    }

    @FieldResolver(() => [User])
    async dislikes(@Root() post: Post) {
        const dislikes = await post.dislikes;
        return dislikes;
    }

    @FieldResolver(() => [Comment])
    async comments(@Root() post: Post) {
        const comments = await post.comments;
        return comments;
    }
}
