import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Field, ObjectType, ID, InputType } from 'type-graphql';
import { Post } from './Post';
import { User } from './User';
import { IComment, Lazy, IUser, IPost, ICreateCommentInput } from '@app/data';

@InputType()
export class CreateCommentInput implements ICreateCommentInput {
    @Field()
    @IsNotEmpty({ message: 'Your comment cannot be empty' })
    content: string;
}

@ObjectType()
@Entity()
export class Comment implements IComment {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ nullable: false })
    content: string;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.comments, {
        cascade: ['insert'],
        lazy: true
    })
    post: Lazy<IPost>;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.comments, {
        cascade: ['insert'],
        lazy: true
    })
    user: Lazy<IUser>;
}
