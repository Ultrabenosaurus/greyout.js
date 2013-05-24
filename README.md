# greyout.js #

A jQuery plugin to easily implement mutually exclusive form fields.

Currently only works on text fields.

## the theory ##

* some form elements are only needed if certain other elements aren't used
* for each conditional element, specify the IDs of the element(s) that 'control' them
* when any element that has been identified as a `controller` gets a value, the elements it controls will be disabled
* try to re-enable elements when a `controller` is disabled

## to do ##

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

## initialisation object ##

Information about the accepted members for the object passed when initialising `$.greyout();`

`hierarchy` *object*

Default: undefined

An object describing the relationships of elements ([more info](#method-two)). If omitted, greyout.js will find all `input` elements and build a relationship map from any `data-greyout-controllers` attributes found ([more info](#method-one)).

`action` *string*

Default: 'disable'

* 'hide'
* 'disable'

Whether to hide elements or just disable them. Using 'hide' will also disable elements so that they are not included when the form is submitted.

`controller_class` *string*

Default: 'greyout-controller'

A space-separated list of classes to apply to controllers. Set to *boolean* `false` to use no class at all.

`conditional_class` *string*

Default: 'greyout-conditional'

A space-separated list of classes to apply to conditional elements. Set to *boolean* `false` to use no class at all.

`remove_conditional_class` *boolean*

Default: true

Whether or not to remove the conditional class from an element when applying the controller class, if the element qualifies for both.

`disabled_class` *string*

Default: 'greyout-disabled'

A space-separated list of classes to apply to disabled elements. Set to *boolean* `false` to use no class at all.

`placeholder` *string*

Default: null

The placeholder text for disabled elements.

`logging` *int*

Default: 0 (no logging)

The logging level to run at for the custom logger function. Calls to the logger function should have an integer level value as the final parameter, but are given a level of *int* 1 if none is provided. There is no maximum logging level. Only function calls at or below the given level will be sent to the console.

## License ##

As usual with my work, this project is available under the BSD 3-Clause license. In short, you can do whatever you want with this code as long as:

* I am always recognised as the original author.
* I am not used to advertise any derivative works without prior permission.
* You include a copy of said license and attribution with any and all redistributions of this code, including derivative works.

For more details, read the included [LICENSE.md](LICENSE.md) file or read about it on [opensource.org](http://opensource.org/licenses/BSD-3-Clause).
