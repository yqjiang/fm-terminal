// Generated by CoffeeScript 1.6.3
(function() {
  var LoginCommand, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LoginCommand = (function(_super) {
    var msg_wrong_pass, msg_wrong_user, wait_for_pass, wait_for_remember, wait_for_user;

    __extends(LoginCommand, _super);

    function LoginCommand() {
      _ref = LoginCommand.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    wait_for_user = 0;

    wait_for_pass = 1;

    wait_for_remember = 2;

    LoginCommand.prototype.showInfo = function() {
      window.T.echo("Login to douban.fm...");
      return this.echoNeedUser();
    };

    LoginCommand.prototype.echoNeedUser = function() {
      window.T.echo("Username (email address)");
      return window.T.set_mask(false);
    };

    LoginCommand.prototype.echoNeedPass = function() {
      window.T.echo("Password");
      return window.T.set_mask(true);
    };

    LoginCommand.prototype.echoNeedRemember = function() {
      window.T.echo("Remember me? (y/n)");
      window.T.set_mask(false);
      if (this.remember != null) {
        return window.T.insert(this.remember ? "y" : "n");
      }
    };

    LoginCommand.prototype.isValidUser = function(user) {
      return true;
    };

    LoginCommand.prototype.isValidPass = function(pass) {
      return true;
    };

    LoginCommand.prototype.exit = function() {
      var term;
      this.pass = "";
      term = window.T;
      term.set_mask(false);
      return window.TERM.setUser(this.user);
    };

    LoginCommand.prototype.succ = function(user) {
      this.user = user;
      delete this["remember"];
      window.T.pop();
      window.T.resume();
      return window.T.echo("Welcome...");
    };

    msg_wrong_user = "invalidate_email";

    msg_wrong_pass = "wrong_password";

    LoginCommand.prototype.fail = function(user) {
      var err;
      this.user = user;
      err = user.err;
      window.T.error("Login failed: " + err);
      window.T.resume();
      switch (err) {
        case msg_wrong_user:
          this.stage = wait_for_user;
          return this.echoNeedUser();
        case msg_wrong_pass:
          this.stage = wait_for_pass;
          return this.echoNeedPass();
        default:
          return window.T.pop();
      }
    };

    LoginCommand.prototype.input = function(text, term) {
      var _ref1,
        _this = this;
      switch (this.stage) {
        case wait_for_user:
          if (this.isValidUser(text)) {
            this.username = text;
            this.echoNeedPass();
            this.stage = wait_for_pass;
          } else {
            term.error("Invalid username, try again");
          }
          break;
        case wait_for_pass:
          if (this.isValidPass(text)) {
            this.pass = text;
            this.echoNeedRemember();
            this.stage = wait_for_remember;
          }
          break;
        case wait_for_remember:
          switch (text) {
            case "y":
            case "Y":
              this.remember = true;
              break;
            case "n":
            case "N":
              this.remember = false;
              break;
            default:
              this.echoNeedRemember();
              return;
          }
          term.echo("Login...");
          term.pause();
          if ((_ref1 = window.DoubanFM) != null) {
            _ref1.login(this.username, this.pass, this.remember, function(user) {
              return _this.succ(user);
            }, function(user) {
              return _this.fail(user);
            });
          }
      }
    };

    LoginCommand.prototype.execute = function() {
      var _this = this;
      this.stage = wait_for_user;
      return window.T.push(function(input, term) {
        return _this.input(input, term);
      }, {
        name: "login",
        prompt: ":",
        onStart: function() {
          return _this.showInfo();
        },
        onExit: function() {
          return _this.exit();
        },
        completion: function() {},
        keydown: function(e) {}
      });
    };

    return LoginCommand;

  })(window.CommandBase);

  (new LoginCommand("login", "Login to douban.fm")).register();

}).call(this);

/*
//@ sourceMappingURL=command.login.map
*/
