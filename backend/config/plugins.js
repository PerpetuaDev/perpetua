module.exports = ({ env }) => {
    return {
        upload: {
            config: {
                provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
                providerOptions: {
                    bucketName: env('GCS_BUCKET_NAME', 'perpetua-strapi-bucket'),
                    baseUrl: env('GCS_BASE_URL', 'https://storage.googleapis.com/perpetua-strapi-bucket'),
                    basePath: env('GCS_BASE_PATH', 'uploads'),
                    publicFiles: true,
                    uniform: false,
                },
            },
        },
    };
};
