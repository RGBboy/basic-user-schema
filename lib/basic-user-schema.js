/*!
 * basic-user-schema
 * Copyright(c) 2012 RGBboy <me@rgbboy.com>
 * MIT Licensed
 */


/**
 * Module Dependencies
 */

var Schema = require('mongoose').Schema,
    crypto = require('crypto'),
    bcrypt = require('bcrypt'),
    check = require('validator').check,
    URLSafeBase64 = require('urlsafe-base64');

/**
 * Module Exports
 */

module.exports = exports = function (options) {

  options = options || {};
  var encryptionRounds = options.encryptionRounds || 12;

  /**
   * Schema
   */

  var UserSchema = new Schema({
    email: { type: String, required: true, validate: [validateEmail, 'invalid'], index: { unique: true } },
    cryptedPassword: { type: String, required: true, validate: [validatePassword, null] },
    role: { type: String, required: true, default: 'user', enum: ['user', 'admin'] },
    resetToken: { type: String },
    resetTokenCreated: { type: Date }
  }, { strict: true });

  /**
   * Virtuals
   */

  /**
   * .id
   *
   * The documents _id property in hex string format
   *
   * @todo write tests for this property
   *
   * @api public
   */
  UserSchema.virtual('id')
  .get(function () {
    return this._id.toHexString();
  });

  /**
   * .password
   *
   * Virtual property used to create and update cryptedPassword
   *
   * @api public
   */
  UserSchema.virtual('password')
  .get(function () {
    return this._password;
  })
  .set(function (value) {
    this._password = value;
  });

  /**
   * .passwordConfirm
   *
   * Virtual property used to confirm the password
   *
   * @api public
   */
  UserSchema.virtual('passwordConfirm')
  .get(function () {
    return this._passwordConfirm;
  })
  .set(function (value) {
    this._passwordConfirm = value;
  });

  /**
   * Instance Methods
   */

  /**
   * .authenticate
   *
   * Authenticate the 
   *
   * @note This method may be passed nothing. Write a test for this!
   * @note Should this return the user or just true?
   *
   * @todo write tests for this method
   *
   * @param {String} password
   * @param {Function} callback
   *
   * @api public
   */
  UserSchema.methods.authenticate = function authenticate (password, callback) {
    if (!password) {
      process.nextTick(function () {
        callback(new Error('must send password')); // Change this to a better error message, inline with the rest
      });
      return;
    }
    bcrypt.compare(password, this.cryptedPassword, function(err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  };

  /**
   * .generateResetToken
   *
   * Generates an password reset token.
   *
   * @todo write tests for this method
   *
   * @param {Function} callback
   *
   * @api public
   */
  UserSchema.methods.generateResetToken = function generateResetToken (callback) {
    var self = this;
    crypto.randomBytes(32, function(err, buf) {
      if (err) {
        callback(err);
        return;
      }
      self.resetToken = URLSafeBase64.encode(buf);
      self.resetTokenCreated = Date.now();
      callback(null, self);
    });
  };

  /**
   * Static Methods
   */

  /**
   * .register
   *
   * creates a new user based upon spec object
   *
   * spec object should contain:
   *   email - valid email address
   *   password - The users password
   *   passwordConfirm - The password repeated for confirmation
   *
   * @param {Object} spec
   * @param {Function} callback
   *
   * @api public
   */
  UserSchema.statics.register = function register (spec, callback) {
    var User = this;
    // create a new user ready to save.
    var newUser = new User();
    // add properties from the spec
    newUser.email = spec.email;
  
    newUser.password = spec.password;
    newUser.passwordConfirm = spec.passwordConfirm;
    // Save the new user and pass the callback.
    newUser.save(callback);
  };

  /**
   * .findByEmail
   *
   * Proxies the findOne method.
   *
   * @param {String} userEmail
   * @param {Function} callback
   *
   * @api public
   */
  UserSchema.statics.findByEmail = function findByEmail (userEmail, callback) {
    var User = this;
    User.findOne({email: userEmail}, callback);
  };

  /**
   * .findByResetToken
   *
   * Proxies the findOne method.
   *
   * @param {String} resetToken
   * @param {Function} callback
   *
   * @api public
   */
  UserSchema.statics.findByResetToken = function findByResetToken (resetToken, callback) {
    var User = this;
    User.findOne({resetToken: resetToken}, function (err, user) {
      if (err || !user) {
        callback(err, user);
        return;
      }
      if (user.resetTokenCreated < Date.now() - (2 * 60 * 60 * 1000)) {
        callback(new Error('token expired')); // change this error to be inline with the rest
      } else {
        callback(err, user);
      }
    });
  };

  /**
   * Middleware
   */

  /**
   * Pre Validate
   */
  UserSchema.pre('validate', function (next) {
    var user = this;

    // only hash the password if it has been set
    if (!user._password || !user._passwordConfirm) {
      next();
      return;
    };
    // Encrypt the password with bcrypt
    bcrypt.hash(user._password, encryptionRounds, function(err, hash) {
      if (err) return next(err);
      user.cryptedPassword = hash;
      next();
    });

  });

  /**
   * Private Methods
   */

  /**
   * .validatePassword
   *
   * used as validation on the cryptedPassword property
   * Validates password and passwordConfirm
   *
   * @param {String} value
   *
   * @api private
   */
  function validatePassword (value) {
    if (this._password || this._passwordConfirm) {
      try {
        check(this._password).len(6, 32);
      } catch(err) {
        this.invalidate('password', 'must be at least 6 characters.');
      }
      if (this._password !== this._passwordConfirm) {
        this.invalidate('passwordConfirm', 'must match password.');
      }
    }
    if (this.isNew && !this._password) {
      this.invalidate('password', 'required');
    }
  };

  /**
   * .validateEmail
   *
   * @param {String} value
   *
   * @api private
   */
  function validateEmail (value) {
    try {
      check(value).isEmail();
    } catch(err) {
      return false;
    }
    return true;
  };

  /**
   * Return
   */
  return UserSchema;

};

/**
* Library version.
*/

exports.version = '0.0.5';