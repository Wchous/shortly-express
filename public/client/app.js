
window.Shortly = Backbone.View.extend({
  template: Templates['layout'],

  events: {
    'click li a.index': 'renderIndexView',
    'click li a.create': 'renderCreateView',
    //'click li a.signout': 'renderSignoutView'
  },

  initialize: function() {
    console.log( 'Shortly is running' );
    $('body').append(this.render().el);
    window.loggedIn = false;
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

  renderSignoutView: function(e){
    //e && e.preventDefault();
    
    //fetch('http://localhost:4568/logout',{type:'POST',credentials: 'include'}).then((res)=>console.log(res)).catch(err=>console.log(err))
  },

  updateNav: function(routeName) {
    this.$el.find('.navigation li a')
      .removeClass('selected')
      .filter('.' + routeName)
      .addClass('selected');
  }
});
