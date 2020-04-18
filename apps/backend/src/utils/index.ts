import { Request } from 'express';
import * as Multer from 'multer';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { Role, IToken } from '@myapp/data';

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

export const hasPermission = (user: User, role: Role): boolean => {
    if (!user || !user.role) return false;
    return user.role === Role.Admin || user.role === role;
};

export const isAdmin = (user: User) => hasPermission(user, Role.Admin);

export const userMatches = (user: User, id: string) => {
    if (!user) return false;
    if (isAdmin(user)) return true;
    return user.id === id;
};

export const escapeRegEx = (str: string) =>
    str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

const dateToString = (date: string | number | Date) =>
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
    });

export const formatDate = (date: string | number | Date) => {
    if (!date) return 'Current';
    const str = dateToString(date);
    return str !== 'Invalid Date' ? str : 'Current';
};

export const extractToken = (req: Request) =>
    ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField('token'),
        ExtractJwt.fromHeader('token'),
        ExtractJwt.fromUrlQueryParameter('token'),
        (r: Request) => {
            let token = '';
            if (r && r.cookies) token = r.cookies.token;
            return token;
        }
    ])(req);

export const signToken = (user: User, expiresIn = config.EXPIRES_IN) =>
    jwt.sign({ id: user.id, role: user.role } as IToken, config.SECRET, {
        expiresIn
    });

export const shuffleArray = <T>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export const camelCase = (str: string) => {
    return str
        .replace(/\s(.)/g, function (a) {
            return a.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, function (b) {
            return b.toLowerCase();
        });
};
