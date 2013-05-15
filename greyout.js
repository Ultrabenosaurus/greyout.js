var greyout = function(opts){
	if(this === window) return false;
	if(opts !== undefined && typeof opts !== 'object') return false;
	var _grey = {};
	_grey.find = ((typeof opts === 'undefined') ? true : ((typeof opts.hierarchy === 'undefined') ? true : false ));
	_grey.action = ((typeof opts !== 'undefined') ? ((typeof opts.action === 'undefined') ? 'disable' : opts.action ) : 'disable');
	_grey.placeholder = ((typeof opts !== 'undefined') ? ((typeof opts.placeholder === 'undefined') ? null : opts.placeholder ) : null);
	_grey.contro_class = ((typeof opts !== 'undefined') ? ((typeof opts.controller_class === 'undefined') ? null : opts.controller_class ) : null);
	_grey.condi_class = ((typeof opts !== 'undefined') ? ((typeof opts.conditional_class === 'undefined') ? null : opts.conditional_class ) : null);
	_grey.rem_condi = ((typeof opts !== 'undefined') ? ((typeof opts.remove_conditional_class === 'undefined') ? true : false ) : true);
	_grey.dis_class = ((typeof opts !== 'undefined') ? ((typeof opts.disabled_class === 'undefined') ? null : opts.disabled_class ) : null);
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
			_grey.keyup(elem);
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
				if(_grey.dis_class !== false){
					jQuery(elem).addClass(((_grey.dis_class !== null) ? _grey.dis_class : "greyout-disabled"));
				}
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
				jQuery(elem).removeClass("greyout-disabled "+_grey.dis_class);
				break;
		}
	};

	/* populate _grey.elems with an element relationship map */
	if(_grey.find){
		jQuery.each(jQuery('input'), function(i, v){
			_grey.parseAttribs(v);
		});
	} else {
		_grey.elems = opts.hierarchy;
	}

	/* attempt to apply conditional and controller classes */
	if(_grey.condi_class !== false){
		jQuery.each(_grey.elems, function(i, v){
			jQuery('#'+v.name).addClass(function(i, c){
				if(c.indexOf(_grey.condi_class) < 0){
					return ((_grey.condi_class !== null) ? _grey.condi_class : "greyout-conditional");
				}
			});
		});
	}
	if(_grey.contro_class !== false){
		jQuery.each(_grey.elems, function(i, v){
			jQuery.each(v.controllers, function(i, c){
				if(_grey.rem_condi){
					jQuery('#'+c).removeClass("greyout-conditional "+_grey.condi_class);
				}
				jQuery('#'+c).addClass(function(i, _c){
					if(_c.indexOf(_grey.contro_class) < 0){
						return ((_grey.contro_class !== null) ? _grey.contro_class : "greyout-controller");
					}
				});
			});
		});
	}

	/* apply keyup event listeners to controllers */
	for(el in _grey.elems){
		if(typeof _grey.elems[el] !== 'undefined'){
			_contr = _grey.elems[el].controllers;
			for(_elem in _contr){
				jQuery('#'+_contr[_elem]).on('keyup', _grey.keyup);
			}
		}
	}

	/* return object */
	this._grey = _grey;
	return this;
}

if(typeof jQuery !== 'undefined'){
	(function($){
		$.greyout = greyout;
		greyout = null;
	})(jQuery);
}