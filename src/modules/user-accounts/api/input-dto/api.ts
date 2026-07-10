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
