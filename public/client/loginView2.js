Shortly.LoginView = Backbone.View.extend({
  className: 'login',

  template: Templates['login'],

  events: {
    'submit': 'signIn'
  },

  render: function() {
    console.log('logging in renderer')
    this.$el.html( this.template() );
    return this;
  },

  signIn: function(e) {
    e.preventDefault();

    console.log(e)

    var $username = this.$el.find('form #username');
    var $password = this.$el.find('form #password');
    var body = {
      'username' : $username.val(),
      'password' : $password.val(),
      'type':'login'
    }
    var user = new Shortly.User(body);
    user.on('request', this.startSpinner, this);
    user.on('sync', this.success, this);
    user.on('error', this.failure, this);
    user.save({});
    console.log(this.$el)
    
  },

  success: function(response) {
    this.stopSpinner();
    //var view = new Shortly.LinkView({ model: response });
    //this.$el.find('.message').append(view.render().$el.hide().fadeIn());
    // window.Shortly.renderIndexView()
    window.loggedIn = true
  },

  failure: function(model, res) {
    console.log("failed to login")
    this.stopSpinner();
    this.$el.find('.message')
      .html('Invalid credentials')
      .addClass('error');
    return this;
  },

  startSpinner: function() {
    this.$el.find('img').show();
    this.$el.find('form input[type=submit]').attr('disabled', 'true');
    this.$el.find('.message')
      .html('')
      .removeClass('error');
  },

  stopSpinner: function() {
    this.$el.find('img').fadeOut('fast');
    this.$el.find('form input[type=submit]').attr('disabled', null);
    this.$el.find('.message')
      .html('')
      .removeClass('error');
  }
});
