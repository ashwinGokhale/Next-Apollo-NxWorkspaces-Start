import { FileUpload } from 'graphql-upload';

export type Lazy<T extends object> = Promise<T> | T;

export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface ISignupInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IAuthOutput {
    user: IUser;
    token: string;
}

export interface IToken {
    id: string;
    role: Role;
    iat: number;
    exp: number;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt?: Date;
    posts: Lazy<IPost[]>;
    likes: Lazy<IPost[]>;
    dislikes: Lazy<IPost[]>;
    following: Lazy<IUser[]>;
    followers: Lazy<IUser[]>;
    comments: Lazy<IComment[]>;
}

export enum Tag {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Snack = 'Snack',
    Dessert = 'Dessert'
}

export interface ICreatePost {
    title: string;
    recipe: string;
    photos?: FileUpload[];
    tag: Tag;
}

export interface IPost {
    id: string;
    title: string;
    recipe: string;
    photos?: string[];
    tag: Tag;
    comments: Lazy<IComment[]>;
    user: Lazy<IUser>;
    likes: Lazy<IUser[]>;
    dislikes: Lazy<IUser[]>;
}

export interface ICreateCommentInput {
    content: string;
}

export interface IComment {
    id: string;
    content: string;
    post: Lazy<IPost>;
    user: Lazy<IUser>;
}
