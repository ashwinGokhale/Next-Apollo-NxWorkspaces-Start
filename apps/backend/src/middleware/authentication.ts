import { decode, verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { User } from '../models/User';
import { Role, IToken } from '@app/data';
import { config } from '../config';
import { hasPermission, extractToken } from '../utils';
import { AuthenticationError } from 'apollo-server-express';
import { Request, Response } from 'express';

export interface IContext {
    req: Request;
    res: Response;
    user?: User;
}

export const createContext = async ({ req, res }: IContext) => {
    const context: IContext = { req, res };
    const token = extractToken(req);
    if (!token || token === 'null' || token === 'undefined') return context;

    try {
        verify(token, config.SECRET);
    } catch (error) {
        return context;
    }

    const payload = decode(token) as IToken;
    if (!payload || !payload.id) return context;

    context.user = await User.findOne(payload.id);

    return context;
};

export const authorizationChecker: AuthChecker<IContext, Role> = (
    { context: { user } },
    roles
) => {
    if (!user) throw new AuthenticationError('You must be logged in!');
    if (!roles.length) return true;
    if (!roles.some((role) => hasPermission(user, role)))
        throw new AuthenticationError('Insufficient permissions');
    return true;
};
