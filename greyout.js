var greyout = function(opts){
	if(this === window) return false;
	if(opts !== undefined && typeof opts !== 'object') return false;
	var _grey = {};
	_grey.find = ((typeof opts === 'undefined') ? true : ((typeof opts.ids === 'undefined') ? true : false ));
	_grey.act = ((typeof opts !== 'undefined') ? ((typeof opts.act === 'undefined') ? 'disable' : opts.act ) : 'disable');

	_grey.parseAttribs = function(elem){
		_grey.elems = _grey.elems || {};
		elem = ((typeof elem === 'object') ? jQuery(elem) : jQuery('#'+elem));
		if(typeof elem.data('greyout-group') === 'undefined'){
			elem.data('greyout-group', 'greyout');
		}
		if(typeof elem.data('greyout-type') !== 'undefined'){
			switch(elem.data('greyout-type')){
				case 'controller':
				default:
					_group = elem.data('greyout-group');
					_grey.elems[_group] = ((typeof _grey.elems[_group] === 'undefined') ? {name: _group, elems: {}} : _grey.elems[_group]);
					console.log(_grey.elems[_group]);
					_grey.elems[_group].elems[elem.id] = ((typeof _grey.elems[_group].elems[elem.id] === 'undefined') ? {name: elem.id, minions: []} : _grey.elems[_group].elems[elem.id]);
					break;
			}
		}
		if(typeof elem.data('greyout-controller') !== 'undefined'){
			_group = elem.data('greyout-group');
			_contr = elem.data('greyout-controller');
			if(typeof _grey.elems[_group] == 'undefined'){
				_grey.elems[_group] = ((typeof _grey.elems[_group] === 'undefined') ? {name: _group, elems: {}} : _grey.elems[_group]);
			}
			if(typeof _grey.elems[_group].elems[_contr] == 'undefined'){
				_grey.elems[_group].elems[_contr] = ((typeof _grey.elems[_group].elems[_contr] === 'undefined') ? {name: _contr, minions: [elem.id]} : _grey.elems[_group].elems[_contr]);
			}
			_grey.elems[_group].elems[_contr].minions.push(elem.id);
		}
		/*for(i = 0, a = elem.attributes, l = a.length; i < l; i++){
			attrib = a[i];
			if(typeof attrib.nodeName !== 'undefined' && attrib.nodeName.indexOf('data-greyout-') >= 0){
				_name = attrib.nodeName.substr(13);
				switch(_name){
					case 'type':
						if(attrib.nodeValue === 'controller'){
							_grey.elems[elem.id] = ((typeof _grey.elems[elem.id] === 'undefined') ? {name: elem.id, minions: []} : _grey.elems[elem.id]);
						}
						break;
					case 'controller':
						if(typeof _grey.elems[attrib.nodeValue] === 'object'){
							_grey.elems[attrib.nodeValue].minions.push(elem.id);
						} else {
							_grey.elems[attrib.nodeValue] = {name: attrib.nodeValue, minions: [elem.id]};
						}
						break;
				}
			}
		}*/
	};
	_grey.keyup = function(e){
		if(e.target.value.length > 0){
			for(el in _grey.elems){
				if(el !== e.target.id){
					el = _grey.elems[el];
					_grey.hider(el.name);
					for(i = 0, l = el.minions.length; i < l; i++){
						_grey.hider(el.minions[i]);
					}
				}
			}
		} else {
			for(el in _grey.elems){
				if(el !== e.target.id){
					el = _grey.elems[el];
					_grey.shower(el.name);
					for(i = 0, l = el.minions.length; i < l; i++){
						_grey.shower(el.minions[i]);
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
		_grey.elems = opts.ids;
	}

	for(elem in _grey.elems){
		elem = _grey.elems[elem];
		if(typeof elem.name !== 'undefined'){
			jQuery('#'+elem.name).on('keyup', _grey.keyup);
		}
	}
	console.log(_grey);

	this._grey = _grey;
}

if(typeof jQuery !== 'undefined'){
	(function($){
		$.greyout = greyout;
		greyout = null;
	})(jQuery);
}