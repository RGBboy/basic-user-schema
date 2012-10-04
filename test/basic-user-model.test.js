// User Unit Test
//

// MODULE DEPENDENCIES
// -------------------

var User = require('../index'),
    mongoose = require('mongoose'),
    should = require('should'),
    fakeUser;

// TESTS
// -----

describe.only('Basic User Model', function () {

  before(function (done) {
    if (!mongoose.connection.db) {
      mongoose.connect('mongodb://basic-user-model-test:basic-user-model-test@localhost/basic-user-model-test');
    };
    done();
  });

  beforeEach(function (done) {
    fakeUser = {
      email: 'TestUser@test.com',
      password: 'TestPassword',
      passwordConfirm: 'TestPassword'
    };
    User.remove(done);
  });

  describe('.version', function () {

    it('should match the format x.x.x', function (done) {
      User.version.should.match(/^\d+\.\d+\.\d+$/);
      done();
    });

  });

  describe('Static Methods', function () {

    describe('.register', function () {

      describe('when correct credentials are used', function () {

        it('should create a new user with user object', function (done) {
          User.register(fakeUser, function (err, user) {
            should.not.exist(err);
            should.exist(user);
            User.find({}, function(err, users) {
              users.length.should.equal(1);
              done();
            });
          })
        });

        it('should callback with an error if user already exists', function (done) {
          User.register(fakeUser, function (err, user) {
            should.not.exist(err);
            should.exist(user);
            User.register(fakeUser, function (err, user) {
              should.exist(err);
              done();
            });
          });
        });

        it('should create a cryptedPassword if password and passwordConfirm are correct', function (done) {
          User.register(fakeUser, function(err, user) {
            should.exist(user.cryptedPassword);
            done();
          });
        });

      });

      describe('when incorrect credentials are used', function () {

        it('should callback with an error if email is missing', function (done) {
          delete fakeUser.email;
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if if email is empty', function (done) {
          fakeUser.email = '';
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if if email is not a valid email', function (done) {
          fakeUser.email = 'testtest.com';
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if the password and passwordConfirm do not match', function (done) {
          fakeUser.passwordConfirm = 'NotTestPassword';
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if the password is missing', function (done) {
          delete fakeUser.password;
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if the password is empty', function (done) {
          fakeUser.password = '';
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if the passwordConfirm is missing', function (done) {
          fakeUser.passwordConfirm = '';
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

        it('should callback with an error if the passwordConfirm is empty', function (done) {
          delete fakeUser.passwordConfirm;
          User.register(fakeUser, function(err, user) {
            should.exist(err);
            done();
          });
        });

      });

    });

    describe('.findByEmailToken', function () {

      beforeEach(function (done) {
        User.register(fakeUser, function (err, user) {
          fakeUser = user;
          done();
        });
      });

      describe('when token is valid', function () {

        it('should callback with a user', function (done) {
          User.findByEmailToken(fakeUser.emailToken, function (err, user) {
            should.not.exist(err);
            should.exist(user);
            done();
          });
        });

      });

      describe('when token is invalid', function () {

        it('should callback with nothing if token does not exist', function (done) {
          User.remove(function () {
            User.findByEmailToken(fakeUser.emailToken, function (err, user) {
              should.not.exist(err);
              should.not.exist(user);
              done();
            });
          });
        });

        it('should callback with an error if token is older than 2 hours', function (done) {
          // change tokenCreated to 2 hours ago
          var time = Date.now() - (2 * 60 * 60 * 1000);
          User.findOne({ email: fakeUser.email }, function (err, user) {
            user.emailTokenCreated = time;
            user.save(function (err, user) {
              User.findByEmailToken(user.emailToken, function (err, user) {
                should.exist(err);
                should.not.exist(user);
                done();
              })
            });
          });
        });

      });

    });

    describe('.findByEmail', function () {

      describe('when user exists', function () {

        beforeEach(function (done) {
          User.register(fakeUser, function (err, user) {
            fakeUser = user;
            done();
          });
        });

        it('should callback with a user', function (done) {
          User.findByEmail(fakeUser.email, function (err, user) {
            should.not.exist(err);
            should.exist(user);
            done();
          });
        });

      });

      describe('when user does not exist', function () {

        it('should callback with nothing if user does not exist', function (done) {
          User.findByEmail(fakeUser.email, function (err, user) {
            should.not.exist(err);
            should.not.exist(user);
            done();
          });
        });

      });

    });

  });

});