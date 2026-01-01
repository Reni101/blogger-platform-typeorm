export const loginApiSchema = {
    type: 'object',
    properties: {
        loginOrEmail: { type: 'string', example: 'maxim12' },
        password: { type: 'string', example: 'maxim12' },
    },
};

export const loginResSchema = {
    type: 'object',
    properties: { accessToken: { type: 'string' } },
};
