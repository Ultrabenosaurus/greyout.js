# greyout.js #

A jQuery plugin to easily implement mutually exclusive form fields.

Currently only works on text fields.

## the theory ##

* some form elements are only needed if certain other elements aren't used
* for each conditional element, specify the IDs of the element(s) that 'control' them
* when any element that has been identified as a `controller` gets a value, the elements that have it as a `controller` will be disabled
* try to re-enable elements when a controller is disabled

## to do ##

* implement adding/managing classes
* expand to support all `input` types
* add support for `select` boxes

## usage ##

You can use this plugin in two ways:

* data attribute on the `input` elements
* pass the constructor an object outlining the `controllers`

### method one ###

*data attribute*

Use a data attribute on your `input` elements like so:

```html
<div id="container">
	<input type="text" name="input1" id="input1" data-greyout-controllers="input2,input3,input6" />
	<input type="text" name="input2" id="input2" data-greyout-controllers="input6" />
	<input type="text" name="input3" id="input3" data-greyout-controllers="input6" />
	<input type="text" name="input4" id="input4" data-greyout-controllers="input2,input5,input6" />
	<input type="text" name="input5" id="input5" data-greyout-controllers="input6" />
	<input type="text" name="input6" id="input6" />
</div>
```

Then simply call `$.greyout();` to initialise the plugin.

### method two ###

*`hierarchy` object*

Do not use data attributes on your `input` elements, but instead pass a `hierarchy` object inside the `options` object when you call `$.greyout();` like so:

```js
$.greyout({
	hierarchy: {
		input1: {
			name: 'input1',
			controllers: [
				'input2',
				'input3'
			]
		},
		input4: {
			name: 'input4',
			controllers: [
				'input2',
				'input5'
			]
		}
	}
});
```
