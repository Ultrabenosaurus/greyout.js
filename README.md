# greyout.js #

A JavaScript library to easily implement mutually exclusive form fields.

Currently only works on text fields as a jQuery plugin via `$.greyout();` using data attributes.

**Next step:** get it working using vanilla JS

## to do ##

* modify to allow grouping of controller elements
* expand to support all input types
* add support for select boxes

## structure ##

Some elements are defined as `controller` elements. Other elements can be `minions` by specifying their `controller`. When a `controller` element is given a value, all other `controller` elements (and the `minions` belonging to them) are disabled. Removing the given value will re-enable the other elements.
