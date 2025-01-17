const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: 'Too many requests, please try again later.',
})

// Specific rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 login attempts
    message: 'Too many login attempts, please try again later.',
});

const signupLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 Signup attempts
    message: 'Too many login attempts, please try again later.',
});

module.exports = { generalLimiter, loginLimiter, signupLimit };