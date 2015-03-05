import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(){
    return Ember.RSVP.hash({
	  drafts: this.store.find("draft"),
	  publications: this.store.find("publication")
	});
  },
  actions: {
    refreshLists: function() {
      var that = this;
        var rsvp =  Ember.RSVP.hash({drafts: this.store.find("draft"), publications: this.store.find("publication")});
        rsvp.then(function(model) {
          that.controller.set('drafts',model.drafts);
          that.controller.set('publications',model.publications);
        });
    }
  }
});
