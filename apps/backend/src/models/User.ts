import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    BaseEntity
} from 'typeorm';
import { ObjectType, ID, Field, InputType } from 'type-graphql';
import { Matches, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { hash, compare } from 'bcrypt';
import {
    Role,
    IUser,
    ISignupInput,
    IAuthOutput,
    ILoginInput,
    Lazy,
    IPost
} from '@app/data';
import { Post } from './Post';
import { Comment } from './Comment';

@ObjectType()
@Entity()
export class User extends BaseEntity implements IUser {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ nullable: false })
    name: string;

    @Field()
    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ select: false, default: '', type: 'varchar' })
    password: string;

    @Column({ select: false, nullable: false, default: '' })
    resetPasswordToken?: string;

    @Field(() => Role)
    @Column({
        nullable: false,
        enum: Role,
        default: Role.User,
        type: 'varchar'
    })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.user, { cascade: true, lazy: true })
    posts: Lazy<Post[]>;

    @Field(() => [Comment])
    @OneToMany(() => Comment, (comment) => comment.user, {
        cascade: true,
        lazy: true
    })
    comments: Lazy<Comment[]>;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.likes, {
        cascade: true,
        lazy: true
    })
    likes: Lazy<IPost[]>;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.dislikes, {
        cascade: true,
        lazy: true
    })
    dislikes: Lazy<IPost[]>;

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.following, { lazy: true })
    following: Lazy<IUser[]>;

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.followers, { lazy: true })
    followers: Lazy<IUser[]>;

    private tempPassword: string;

    @AfterLoad()
    private loadTempPassword() {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private async encryptPassword() {
        if (this.tempPassword !== this.password) {
            const hashed = await hash(this.password, 10);
            this.password = hashed;
        }
    }

    async comparePassword(password: string) {
        return password && (await compare(password, this.password));
    }
}

@InputType()
export class SignupInput implements ISignupInput {
    @Field()
    @IsNotEmpty({ message: 'Please provide your first and last name' })
    @Matches(/([a-zA-Z']+ )+[a-zA-Z']+$/, {
        message: 'Please provide your first and last name'
    })
    name: string;
    @Field()
    @IsNotEmpty({ message: 'Please provide a valid email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;
    @Field()
    @IsNotEmpty({
        message: 'Your password must be a minimum of 6 characters long'
    })
    @MinLength(6, {
        message: 'Your password must be a minimum of 6 characters long'
    })
    password: string;
    @Field()
    @IsNotEmpty({
        message:
            'Your confirmed password must be a minimum of 6 characters long'
    })
    @MinLength(6, {
        message:
            'Your confirmed password must be a minimum of 6 characters long'
    })
    confirmPassword: string;
}

@ObjectType()
export class AuthOutput implements IAuthOutput {
    @Field(() => User)
    user: IUser;
    @Field()
    token: string;
}

@InputType()
export class LoginInput implements ILoginInput {
    @Field()
    @IsNotEmpty({ message: 'Email must not be empty' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;
    @Field()
    @IsNotEmpty({ message: 'Password must not be empty' })
    password: string;
}
