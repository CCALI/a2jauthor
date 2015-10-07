define(['can', 'localforage'],

	function(can, localforage) {

		var LocalModel = can.Model.extend({
			findOne: function(params, success, error) {
				var dfd = new can.Deferred();

				localforage.getItem(params.id, function(e, val) {
					if (e) {
						if (error) {
							error.call(e);
						}

						dfd.reject(e);
					} else {
						if (success) {
							success.call(val, val);
						}

						dfd.resolve(val);
					}
				});

				return dfd;
			}
		}, {
			save: function() {
				var raw = this.serialize(),
					dfd = new can.Deferred();

				localforage.setItem(this.id, raw, function(e, val) {
					if (e) {
						dfd.reject(e);
					} else {
						dfd.resolve(val);
					}
				});

				return dfd;
			},

			destroy: function() {
				var dfd = new can.Deferred();

				localforage.removeItem(this.id, function() {
					dfd.resolve();
				});

				return dfd;
			}
		});

		return LocalModel;

	});
