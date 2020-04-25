module.exports =
    process.env.NODE_ENV === 'development'
        ? require('./data.dev')
        : require('./data.prod');
