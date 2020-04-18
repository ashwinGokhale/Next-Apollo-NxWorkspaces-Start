import * as express from 'express';
import { Server as HTTPServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import {
    Connection,
    useContainer,
    createConnection,
    ConnectionOptions
} from 'typeorm';
import { Container } from 'typedi';
import { config } from './config';
import * as ORMCONFIG from './config/ormconfig';
import { Logger } from 'pino';
import { createLogger } from './utils/logger';
import { multer } from './utils';
import { buildSchema, registerEnumType } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { UserResolver } from './resolvers/user.resolver';
import {
    authorizationChecker,
    createContext
} from './middleware/authentication';
import { formatError } from './middleware/format';
import { Application } from 'express';
import { AddressInfo } from 'net';
import { PostResolver } from './resolvers/post.resolver';
import { Tag, Role } from '@myapp/data';
import { AuthResolver } from './resolvers/auth.resolver';
import { CommentResolver } from './resolvers/comment.resolver';

export class Server {
    public static async createInstance() {
        const server = new Server();
        await server.setupDatabase();
        await server.setupSchema();
        server.setupApolloServer();
        return server;
    }

    public app: Application;
    private httpServer?: HTTPServer;
    public server!: ApolloServer;
    public schema!: GraphQLSchema;
    public connection!: Connection;
    public logger: Logger;

    private constructor() {
        this.app = express();
        this.logger = createLogger('Server');
        this.setup();
    }

    private setup(): void {
        this.setupMiddleware();
        useContainer(Container);
    }

    private setupMiddleware() {
        this.app.use(helmet());
        if (config.NODE_ENV !== 'test') {
            const logFormat = config.NODE_ENV !== 'production' ? 'dev' : 'tiny';
            this.app.use(
                logger(logFormat, { skip: (r) => r.url.startsWith('/_next') })
            );
        }
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser(config.SECRET));
        this.app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
        this.app.use(multer.any());
        this.app.on('error', this.logger.error);
        this.app.use('/api', (req, res) => {
            res.json({ message: 'hi' });
        });
    }

    private async setupDatabase() {
        try {
            this.connection = await createConnection(
                ORMCONFIG as ConnectionOptions
            );
        } catch (error) {
            this.logger.error('Error connecting to database:', { err: error });
            throw error;
        }
    }

    private async setupSchema() {
        registerEnumType(Role, {
            name: 'Role'
        });
        registerEnumType(Tag, {
            name: 'Tag'
        });
        this.schema = await buildSchema({
            validate: true,
            resolvers: [
                UserResolver,
                PostResolver,
                CommentResolver,
                AuthResolver
            ],
            container: Container,
            authChecker: authorizationChecker
        });
    }

    private setupApolloServer() {
        this.server = new ApolloServer({
            schema: this.schema,
            context: createContext,
            uploads: true,
            formatError
        });

        this.server.applyMiddleware({
            app: this.app,
            path: '/graphql',
            cors: false
        });
    }

    public async start() {
        this.httpServer = this.app.listen(config.PORT);
        const { port } = this.httpServer.address() as AddressInfo;
        this.logger.info('config: %o', config);
        this.logger.info(`Listening on port: ${port}`);

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            await this.stop();
            process.exit(0);
        });

        return this;
    }

    public async stop() {
        if (this.connection) {
            await this.connection.close();
        }
        if (this.httpServer.listening) {
            const httpServer = this.httpServer;
            await new Promise((resolve) => httpServer.close(resolve));
            this.httpServer = undefined;
        }
        if (this.server) {
            await this.server.stop();
        }

        return this;
    }
}
