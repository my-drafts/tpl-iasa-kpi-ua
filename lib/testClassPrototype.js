var class1 = function (){
	this.a = 1;
};

var class2 = function (){
	this.b = 2;
};
class2.prototype = new class1();

var class3 = function (){
	this.c = 3;
};
class3.prototype = new class2();

var class4 = function (){
	this.a = 4;
};
class4.prototype = new class3();

var x = new class4();

for (p in x)
	console.log("%s %s %s", p, typeof x[p], x[p]);
console.log("%s %s %s", 'a', typeof x.__proto__.a, x.__proto__.a);
console.log("%s ; %s", __dirname, __filename);
