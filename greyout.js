var greyout = function(opts){
	if(this === window) return false;
	if(opts !== undefined && typeof opts !== 'object') return false;
	var _grey = {};
	_grey.find = ((typeof opts === 'undefined') ? true : ((typeof opts.hierarchy === 'undefined') ? true : false ));
	_grey.act = ((typeof opts !== 'undefined') ? ((typeof opts.act === 'undefined') ? 'disable' : opts.act ) : 'disable');
	_grey.logging = ((typeof opts !== 'undefined') ? ((typeof opts.logging === 'undefined') ? 0 : ((typeof opts.logging === 'number' && opts.logging >= 0) ? opts.logging : 0) ) : 0);

	_grey.logger = function(){
		if(typeof console === 'undefined' || typeof console.log === 'undefined') return false;
		if(arguments.length < 1) return false;
		arguments = Array.prototype.slice.call(arguments);
		if(arguments.length < 2) arguments.push(1);

		if(arguments.pop() <= _grey.logging){
			console.log.apply(console, arguments);
			if(typeof console.trace !== 'undefined'){
				console.trace();
			}
		}
	};
	_grey.parseAttribs = function(elem){
		_grey.groups = _grey.groups || {};
		elem = ((typeof elem === 'object') ? jQuery(elem) : jQuery('#'+elem));
		if(typeof elem.data('greyout-group') === 'undefined'){
			elem.data('greyout-group', 'greyout');
		}
		_group = elem.data('greyout-group');
		if(typeof elem.data('greyout-type') !== 'undefined'){
			switch(elem.data('greyout-type')){
				case 'controller':
				default:
					_elid = ((typeof elem.id === 'undefined') ? elem[0].id : elem.id);
					_grey.groups[_group] = ((typeof _grey.groups[_group] === 'undefined') ? {name: _group, elems: {}} : _grey.groups[_group]);
					_grey.groups[_group].elems[_elid] = ((typeof _grey.groups[_group].elems[_elid] === 'undefined') ? {name: _elid, minions: []} : _grey.groups[_group].elems[_elid]);
					break;
			}
		}
		if(typeof elem.data('greyout-controller') !== 'undefined'){
			_contr = elem.data('greyout-controller');
			_elid = ((typeof elem.id === 'undefined') ? elem[0].id : elem.id);
			_grey.groups[_group] = ((typeof _grey.groups[_group] === 'undefined') ? {name: _group, elems: {}} : _grey.groups[_group]);
			if(typeof _grey.groups[_group].elems[_contr] == 'undefined'){
				_grey.groups[_group].elems[_contr] = {name: _contr, minions: [_elid]};
			} else {
				_grey.groups[_group].elems[_contr].minions.push(_elid);
			}
		}
	};
	_grey.keyup = function(e){
		_elem = jQuery("#"+this.id);
		for(gr in _grey.groups){
			if(gr === _elem.data('greyout-group')){
				for(el in _grey.groups[gr].elems){
					if(el !== e.target.id){
						el = _grey.groups[gr].elems[el];
						if(e.target.value.length > 0){
							_grey.hider(el.name);
						} else {
							_grey.shower(el.name);
						}
						for(i = 0, l = el.minions.length; i < l; i++){
							if(e.target.value.length > 0){
								_grey.hider(el.minions[i]);
							} else {
								_grey.shower(el.minions[i]);
							}
						}
					}
				}
			}
		}
	};
	_grey.hider = function(elem){
		elem = '#'+elem;
		if(jQuery(elem).val().length > 0){
			jQuery(elem).attr('data-greyout-oldval', jQuery(elem).val());
			jQuery(elem).val(null);
		}
		switch(_grey.act){
			case 'hide':
				if(jQuery.hide){
					jQuery(elem).hide();
				}
			case 'disable':
			default:
				jQuery(elem).attr('disabled', 'disabled');
				break;
		}
	};
	_grey.shower = function(elem){
		elem = '#'+elem;
		if(typeof jQuery(elem).attr('data-greyout-oldval') !== 'undefined'){
			jQuery(elem).val(jQuery(elem).attr('data-greyout-oldval'));
			jQuery(elem).removeAttr('data-greyout-oldval');
		}
		switch(_grey.act){
			case 'hide':
				if(jQuery.show){
					jQuery(elem).show();
				}
			case 'disable':
			default:
				jQuery(elem).removeAttr('disabled');
				break;
		}
	};

	if(_grey.find){
		jQuery.each(jQuery('input[type="text"]'), function(i, v){
			_grey.parseAttribs(v);
		});
	} else {
		_grey.groups = opts.hierarchy;
		// _grey.assignAttribs();
	}

	for(gr in _grey.groups){
		gr = _grey.groups[gr];
		for(elem in gr.elems){
			elem = gr.elems[elem]
			if(typeof elem.name !== 'undefined'){
				jQuery('#'+elem.name).on('keyup', _grey.keyup);
			}
		}
	}

	this._grey = _grey;
	return this;
}

if(typeof jQuery !== 'undefined'){
	(function($){
		$.greyout = greyout;
		greyout = null;
	})(jQuery);
}