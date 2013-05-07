# greyout.js #

A jQuery plugin to easily implement mutually exclusive form fields.

Currently only works on text fields.

## the theory ##

* some elements are defined as `controller` elements
* other elements can be `minions` by specifying their `controller`
* when a `controller` element is given a value, all other `controller` elements (and the `minions` belonging to them) are disabled
* removing the given value will re-enable the other elements
* use groups to limit the effect of `controllers` like with Radio Buttons

## to do ##

* modify to allow grouping of `controller` elements
   * format implemented, need to test on multiple groups
* expand to support all `input` types
* add support for `select` boxes

## usage ##

You can use this plugin in two ways:

* data attributes on the `input` elements
* pass the constructor an object outlining the `controller` - `minion` relationships

### method one ###

*data attributes*

Either use data attributes on your `input` elements like so:

```html
<div id="container">
	<input type="text" name="input0" id="input0" data-greyout-type="controller" />
	<input type="text" name="input1" id="input1" data-greyout-type="controller" />
	<input type="text" name="input2" id="input2" data-greyout-controller="input0" />
</div>
```

Then simply call `$.greyout();` to initialise the plugin.

### method two ###

*`options` object*

Do not use data attributes on your `input` elements, but instead pass a `hierarchy` object inside the `options` object when you call `$.greyout();` like so:

```js
$.greyout({
	hierarchy: {
		group1: {
			name: 'group1',
			elems: {
				input0: {
					name: 'input0',
					minions: [
						'input2'
					]
				},
				input1: {
					name: 'input1',
					minions: []
				}
			}
		}
	}
});
```
