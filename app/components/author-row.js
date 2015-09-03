import Ember from 'ember';

export default Ember.Component.extend({
	errors: null,
	didInsertElement: function() {
	},
	resetForm: function() {
		if (this.get("item.newAuthorForm")) {
			if(!this.get('item.importedAuthorName')) {
				this.set("item.newAuthorForm.firstName", ''); 
				this.set("item.newAuthorForm.lastName", '');
			}
			this.set("item.newAuthorForm.year_of_birth", ''); 
			this.set("item.newAuthorForm.xaccount", ''); 
			this.set("item.newAuthorForm.orcid", '');
		}
	},

	newAuhtorFormVisible: function() {
		var self = this;
		if (this.get("item.transformedToNewAuthor") === true) {
			this.resetForm();
			Ember.run.later(function() {
				self.$().find('#first-name').focus();
			});
		}
 	}.observes('item.transformedToNewAuthor'),

	actions: {
		setMsgHeader: function(type, msg) {
			this.sendAction('setMsgHeader', type, msg);
		},
	    queryAuthors: function(query, deferred) {
	      deferred.reject = function(reason) {
	        console.log(reason);
	      };
	      var fromStore = this.store.find("person", {search_term: query.term});
	      fromStore.then(deferred.resolve, deferred.reject);
	  
	    },

	    moveUpOne: function(id) {
	    	this.sendAction('moveUp', id);
	    },

	    moveDownOne: function(id) {
	    	this.sendAction('moveDown', id);
	    },

	    remove: function(id) {
	    	this.sendAction('removeAuthor', id);
	    },

	    toggleAddNewAuthor: function(item) {
			if (item.get("transformedToNewAuthor") === true) {
				item.set("transformedToNewAuthor", false);
			}
			else {
				item.set("transformedToNewAuthor", true);
			}
	      
	    },
	    createAuthor: function(item) {
	    	var that = this;
	        var successHandler = function(model) {
	            item.set('selectedAuthor', model);
	            item.set('transformedToNewAuthor', false);
	        };
	        var errorHandler = function(reason) {
	        	that.send('setMsgHeader', 'error', reason.error.msg);
				that.set('errors', reason.error.errors);
	            Ember.run.later(function() {
	                Ember.$('[data-toggle="popover"]').popover({
	                    placement: 'top',
	                    html: true
	                });
	            });
	        };
	        //console.log(newAuthor.get('firstName'));
	        this.store.save('person',{'first_name': item.newAuthorForm.get('firstName'), 'last_name': item.newAuthorForm.get('lastName'), 'year_of_birth': item.newAuthorForm.get('year_of_birth'), 
	                            'xaccount': item.newAuthorForm.get('xaccount'), 'orcid': item.newAuthorForm.get('orcid') }).then(successHandler, errorHandler);
	    },
	}
});
