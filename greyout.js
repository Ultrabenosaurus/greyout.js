var greyout = function(opts){
	if(this === window) return false;
	if(opts !== undefined && typeof opts !== 'object') return false;
	var _grey = {};
	_grey.find = ((typeof opts === 'undefined') ? true : ((typeof opts.hierarchy === 'undefined') ? true : false ));
	_grey.action = ((typeof opts !== 'undefined') ? ((typeof opts.action === 'undefined') ? 'disable' : opts.action ) : 'disable');
	_grey.placeholder = ((typeof opts !== 'undefined') ? ((typeof opts.placeholder === 'undefined') ? null : opts.placeholder ) : null);
	_grey.contro_class = ((typeof opts !== 'undefined') ? ((typeof opts.contro_class === 'undefined') ? null : opts.contro_class ) : null);
	_grey.condi_class = ((typeof opts !== 'undefined') ? ((typeof opts.condi_class === 'undefined') ? null : opts.condi_class ) : null);
	_grey.dis_class = ((typeof opts !== 'undefined') ? ((typeof opts.dis_class === 'undefined') ? null : opts.dis_class ) : null);
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
		_grey.elems = _grey.elems || {};
		elem = ((typeof elem === 'object') ? jQuery(elem) : jQuery('#'+elem));
		_contr = ((typeof elem.data('greyout-controllers') === 'undefined') ? false : elem.data('greyout-controllers').split(','));
		if(!_contr) return false;

		for(i = 0, l = _contr.length; i < l; i++){
			_el = ((typeof jQuery("#"+_contr[i])[0] === 'undefined') ? false : jQuery("#"+_contr[i]));
			if(_el){
				if(typeof _grey.elems[elem[0].id] === 'undefined'){
					_grey.elems[elem[0].id] = {name: elem[0].id, controllers: [_contr[i]]};
				} else {
					_grey.elems[elem[0].id].controllers.push(_contr[i]);
				}
			}
		}
	};
	_grey.keyup = function(e){
		_elem = ((typeof e.target === 'undefined') ? e : "#"+e.target.id);
		_elem = jQuery(_elem);
		// _grey.logger(_elem, _elem.val(), 9);
		for(el in _grey.elems){
			_contr = _grey.elems[el].controllers;
			if(_contr.indexOf(_elem[0].id) >= 0){
				if(_elem.val().length > 0){
					_grey.hider(_grey.elems[el].name);
				} else {
					_grey.shower(_grey.elems[el].name);
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
		switch(_grey.action){
			case 'hide':
				if(jQuery.hide){
					jQuery(elem).hide();
				}
			case 'disable':
			default:
				jQuery(elem).attr('placeholder', _grey.placeholder);
				jQuery(elem).attr('disabled', 'disabled');
				break;
		}
	};
	_grey.shower = function(elem){
		_contr = _grey.elems[elem].controllers;
		for(i = 0, l = _contr.length; i < l; i++){
			if(jQuery('#'+_contr[i]).val().length > 0) return false;
		}

		elem = '#'+elem;
		jQuery(elem).attr('placeholder', null);
		if(typeof jQuery(elem).attr('data-greyout-oldval') !== 'undefined'){
			jQuery(elem).val(jQuery(elem).attr('data-greyout-oldval'));
			jQuery(elem).removeAttr('data-greyout-oldval');
			_grey.keyup(elem);
		}
		switch(_grey.action){
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
	
	// _grey.logger(_grey, 10);

	if(_grey.find){
		jQuery.each(jQuery('input'), function(i, v){
			_grey.parseAttribs(v);
		});
	} else {
		_grey.elems = opts.hierarchy;
	}
	
	for(el in _grey.elems){
		_contr = _grey.elems[el].controllers;
		for(_elem in _contr){
			jQuery('#'+_contr[_elem]).on('keyup', _grey.keyup);
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