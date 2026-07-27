export const loginApiSchema = {
    type: 'object',
    properties: {
        loginOrEmail: { type: 'string', example: 'maxim101' },
        password: { type: 'string', example: 'renixx12' },
    },
};

export const loginResSchema = {
    type: 'object',
    properties: { accessToken: { type: 'string' } },
};

export const uploadAvatarApiSchema = {
    type: 'object',
    properties: {
        file: {
            type: 'string',
            format: 'binary',
        },
    },
    required: ['file'],
};
