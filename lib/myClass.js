#!/usr/bin/env node

var events = require('events');
var emitter = events.EventEmitter;

var myClass = function (_init) {
	var values = {};
	this.get = function (_name, _default){
		return (_name in values) ? values[_name] : _default;
	};
	this.set = function (_name, _value){
		values[_name] = _value;
	};
	this.sets = function (_values){
		if (_values instanceof Array){
			for (i=0; i<_values.length; i++){
				this.sets(_values[i]);
			}
		}
		else if (_values instanceof Object){
			for (p in _values){
				this.set(p, _values[p]);
			}
		}
	};
	this.sets(_init);
}

myClass.prototype = new emitter();

/**/
// test
var m = new myClass();

for (p in m){
	console.log("%s: %s: %j", p, typeof m[p], m[p]);
}
/**/