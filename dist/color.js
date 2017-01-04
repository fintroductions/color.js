!function(t){"use strict";var Color=function(t,o){this._data=null,this._callbacks=[],this._colors=null,this._img=null,this._size=null,this._url=null;var o=o||{};if(this.amount=o.amount||3,this.blocks=o.blocks||20,this.format=o.format||"rgb",this.sample=o.sample||10,"function"==typeof t&&(t=t()),"object"==typeof t&&t.src)this._url=t.src;else{if("string"!=typeof t)throw new TypeError("Invalid image type.");this._url=t}this._running=!0,this._createImage()};Color.prototype._rgbToHex=function(t,o,s){return"#"+[t,o,s].map(function(t){var o=parseInt(t).toString(16);return 1===t.length?"0"+o:o}).join("")},Color.prototype._format=function(t){switch(this.format){case"array":t.forEach(function(o,s){t[s]=o.split(", ")});break;case"hex":t.forEach(function(o,s){var i=o.split(", ");t[s]=this._rgbToHex(i[0],i[1],i[2])},this);break;case"rgb":t.forEach(function(o,s){t[s]="rgb("+o.split(",")+")"})}return 1===t.length?t[0]:t},Color.prototype._roundToBlocks=function(t){var o=Math.round(t/this.blocks)*this.blocks;return o>=255?255:o},Color.prototype._createImage=function(){this._img=document.createElement("img"),this._img.crossOrigin="Anonymous",this._img.src=this._url,this._img.addEventListener("load",function(){this._createCanvas()}.bind(this))},Color.prototype._createCanvas=function(){var t=document.createElement("canvas");if("undefined"==typeof t.getContext)throw new Error("HTML5 canvas is not supported.");var o=t.getContext("2d");t.height=this._img.height,t.style.display="none",t.width=this._img.width,o.drawImage(this._img,0,0),document.body.appendChild(t);var s=o.getImageData(0,0,this._img.width,this._img.height);this._data=s.data,this._size=this._data.length,document.body.removeChild(t),this._running=!1,this._runCallbacks()},Color.prototype._runCallbacks=function(){this._callbacks.forEach(function(t,o){this._callbacks[o].method.call(this,this._callbacks[o].call)},this),this._callbacks=[]},Color.prototype._extractChannels=function(){for(var t={r:{amount:0,total:0},g:{amount:0,total:0},b:{amount:0,total:0}},o=0;o<this._size;o+=4*this.sample)if(!(this._data[o+3]<127.5)){var s=o;for(var i in t)t[i].amount++,t[i].total+=this._data[s],s++}return t},Color.prototype._extractColorBlocks=function(){if(!this._colors){for(var t={},o=[],s=0;s<this._size;s+=4*this.sample)if(!(this._data[s+3]<127.5)){var i=[this._roundToBlocks(this._data[s]),this._roundToBlocks(this._data[s+1]),this._roundToBlocks(this._data[s+2])].join(", ");i in t?t[i]++:t[i]=1}for(var n in t)o.push({color:n,count:t[n]});this._colors=o.sort(function(t,o){return t.count<o.count?1:t.count>o.count?-1:0})}},Color.prototype._average=function(t){var o=[],s=this._extractChannels();for(var i in s)o.push(Math.round(s[i].total/s[i].amount));o=[o.join(", ")],t(this._format(o))},Color.prototype._process=function(t,o){this._extractColorBlocks();var s=[];o(s),t(this._format(s))},Color.prototype._leastUsed=function(t){this._process(t,function(t){for(var o=1;o<=this.amount;o++)this._colors[this._colors.length-o]&&t.push(this._colors[this._colors.length-o].color)}.bind(this))},Color.prototype._mostUsed=function(t){this._process(t,function(t){for(var o=0;o<this.amount;o++)this._colors[o]&&t.push(this._colors[o].color)}.bind(this))},Color.prototype._call=function(t,o){if("function"!=typeof t)throw new ReferenceError("Callback is not provided.");this._running?this._callbacks.push({call:t,method:o}):o.call(this,t)},Color.prototype.average=function(t){this._call(t,this._average)},Color.prototype.leastUsed=function(t){this._call(t,this._leastUsed)},Color.prototype.mostUsed=function(t){this._call(t,this._mostUsed)},"object"==typeof module?module.exports=Color:t.Color=Color}(this);