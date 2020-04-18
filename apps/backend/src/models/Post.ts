import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { ObjectType, Field, ID, InputType } from 'type-graphql';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { User } from './User';
import { Comment } from './Comment';
import { IPost, Tag, ICreatePost, Lazy, IUser, IComment } from '@app/data';

@ObjectType()
@Entity()
export class Post implements IPost {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ nullable: false })
    title: string;

    @Field()
    @Column({ nullable: false })
    recipe: string;

    @Field(() => [String], { nullable: true })
    @Column('simple-array', { nullable: true })
    photos?: string[];

    @Field(() => Tag)
    @Column({
        nullable: false,
        enum: Tag,
        default: Tag.Breakfast,
        type: 'varchar'
    })
    tag: Tag;

    @Field(() => [Comment])
    @OneToMany(() => Comment, (comment) => comment.post, {
        cascade: true,
        lazy: true
    })
    comments: Lazy<IComment[]>;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts, { lazy: true })
    user: Lazy<IUser>;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes, { lazy: true })
    likes: Lazy<IUser[]>;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.dislikes, { lazy: true })
    dislikes: Lazy<IUser[]>;
}

@InputType()
export class CreatePostInput implements ICreatePost {
    @Field()
    @IsNotEmpty({ message: 'Please provide a title' })
    title: string;

    @Field()
    @IsNotEmpty({ message: 'Please provide a recipe' })
    recipe: string;

    @Field(() => [GraphQLUpload], { nullable: true })
    photos?: FileUpload[];

    @Field(() => Tag)
    @IsEnum(Tag, { message: 'Please provide a valid tag' })
    tag: Tag;
}
