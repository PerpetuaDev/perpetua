const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? '/cloudsql/perpetua-449900:australia-southeast1:strapi' : '127.0.0.1';

module.exports = ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            // host,
            host: env('DATABASE_HOST', '127.0.0.1'),
            port: env('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'postgres'),
            user: env('DATABASE_USERNAME', 'postgres'),
            password: env('DATABASE_PASSWORD', 'b?9XJ&1"<-{THz%2'),
            ssl: false,
        },
        pool: {
            min: 0,
            max: 10,
            acquireTimeoutMillis: 600000,
        },
    },
});
