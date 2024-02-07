const passport = require('passport');
const Customer = require('../models/customer');
const LocalStrategy = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');

passport.use(new LocalStrategy(
    function(email, password, done) {
      Customer.findOne({ email: email }, function (err, customer) {
        if (err) { return done(err); }
        if (!customer) { return done(null, false); }
        if (!customer.validPassword(password)) { return done(null, false); }
        return done(null, customer);
      });
    }
  ));

passport.serializeUser(function(customer, done) {
    done(null, customer.id);
});

passport.deserializeUser(function(id, done) {
    Customer.findById(id, function(err, customer){
        done(err, customer);
    });
});

passport.use('customer-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function(req, email, password, done) {
    try {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 6 });
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password); 
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('address', 'Address is required').notEmpty();
        req.checkBody('phone', 'Phone number is required').notEmpty();
        
        const errors = req.validationResult();
        if (!errors.isEmpty()) {
            const messages = errors.array().map(error => error.msg);
            return done(null, false, req.flash('error', messages));
        }

        let existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return done(null, false, { message: 'Email is already in use.' });
        }

        const newCustomer = new Customer({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: email,
            password: newCustomer.encryptPassword(password)
        });

        await newCustomer.save();
        return done(null, newCustomer);
    } catch (error) {
        return done(error);
    }
}));

passport.use('customer-login', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback: true
}, async function (req, email, password, done) {
    try{
        await body('email').notEmpty().isEmail().run(req);
        await body('password').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map(error => error.msg);
            return done(null, false, req.flash('error', messages));
        }

        let customer = await Customer.findOne({ email });
        if (!customer) {
            return done(null, false, { message: 'No customer found!' });
        }

        if (!customer.validPassword(password)) {
            return done(null, false, { message: 'Wrong password!' });
        }

        return done(null, customer);
    } catch (error) {
        return done(error);
    }
}));