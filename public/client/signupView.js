Shortly.SignupView = Backbone.View.extend({
  className: 'signup',

  template: Templates['signup'],

  events: {
    'submit': 'addUser'
  },

  render: function() {
    console.log('logging in signuppage')
    this.$el.html( this.template() );
    return this;
  },

  addUser: function(e) {
    e.preventDefault();

    console.log(e)

    var $username = this.$el.find('form #username');
    var $password = this.$el.find('form #password');
    var body = {
      'username' : $username.val(),
      'password' : $password.val(),
      'type':'create'
    }
    var user = new Shortly.User(body);
    user.on('request', this.startSpinner, this);
    user.on('sync', this.success, this);
    user.on('error', this.failure, this);
    user.save({});
    console.log(this.$el)
    
  },

  success: function(user) {
    this.stopSpinner();
    console.log('susccess',user)
    this.$el.find('.message').append(view.render().$el.hide().fadeIn());
  },

  failure: function(model, res) {
    this.stopSpinner();
   console.log(res)
    this.$el.find('.message')
      .html('Please enter a valid URL')
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
