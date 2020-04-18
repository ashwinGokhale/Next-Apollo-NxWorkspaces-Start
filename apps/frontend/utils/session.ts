import Router from 'next/router';
import { parseCookies } from 'nookies';
import { Role, IUser, IContext } from '@myapp/data';
import { GetAuthDocument, GetAuthQuery } from '@myapp/data-access';

export const getToken = (ctx?: IContext) => {
    const { token } = parseCookies(ctx);
    return token;
};

export const extractUser = (ctx: IContext) => {
    // Try to get from redux, and if not, req.user
    const {
        authData: { user }
    } = ctx.apolloClient.readQuery<GetAuthQuery>({
        query: GetAuthDocument
    });

    return (user as unknown) as IUser;
};

export const roleMatches = (role: Role, name: Role) => {
    if (!role) return false;
    return role === Role.Admin || role === name;
};

export const hasPermission = (user: IUser, name: Role) => {
    if (!user) return false;
    return roleMatches(user.role, name);
};

export const userMatches = (user: IUser, id: string) => {
    if (!user || !id) return false;
    if (hasPermission(user, Role.Admin)) return true;
    return user.id === id;
};

export const isAuthenticated = (ctx: IContext, roles?: Role[]) => {
    if (!roles || !roles.length) return !!getToken(ctx);
    const user = extractUser(ctx);
    if (!user) return false;
    if (!roles.length) return true;
    if (!roles.some((role) => hasPermission(user, role))) return false;
    return true;
};

export const redirect = (target: string, ctx?: IContext, replace?: boolean) => {
    if (ctx && ctx.res) {
        // Server redirect
        ctx.res.writeHead(replace ? 303 : 301, { Location: target });
    } else {
        // Browser redirect
        replace ? Router.replace(target) : Router.push(target);
    }
    return true;
};

export const redirectIfNotAuthenticated = (
    path: string,
    ctx: IContext,
    { roles, msg = 'Permission Denied' }: { roles?: Role[]; msg?: string } = {}
): boolean => {
    if (!isAuthenticated(ctx, roles)) {
        redirect(path, ctx, true);
        return true;
    }

    return false;
};
