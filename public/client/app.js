window.Shortly = Backbone.View.extend({
  template: Templates['layout'],

  events: {
    'click li a.index': 'renderIndexView',
    'click li a.create': 'renderCreateView',
    'click li a.login': 'renderLoginView',
    'click li a.signup': 'renderSignupView',
    'click li a.signout': 'renderSignoutView'
  },

  initialize: function() {
    console.log( 'Shortly is running' );
    $('body').append(this.render().el);
    window.loggedIn = false
    this.router = new Shortly.Router({ el: this.$el.find('#container') });
    this.router.on('route', this.updateNav, this);

    Backbone.history.start({ pushState: true });
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  renderIndexView: function(e) {
    e && e.preventDefault();
    this.router.navigate('/', { trigger: true });
  },

  renderCreateView: function(e) {
    e && e.preventDefault();
    this.router.navigate('/create', { trigger: true });
  },

  renderLoginView: function(e){
    e && e.preventDefault();
    this.router.navigate('/login', { trigger: true });
  },
  renderSignoutView: function(e){
    e && e.preventDefault();
    console.log('logout click')
    request('localhost:4568/logout').then(()=>{
      window.loggedIn = false
      this.router.navigate('/login', { trigger: true });
  
    })
    .catch((err)=>{console.log(err + ' there has been an error')})
  }, 
  renderSignupView: function(e){
    e && e.preventDefault();
    this.router.navigate('/signup', { trigger: true });
  },

  updateNav: function(routeName) {
    this.$el.find('.navigation li a')
      .removeClass('selected')
      .filter('.' + routeName)
      .addClass('selected');
  }
});
