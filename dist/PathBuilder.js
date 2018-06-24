(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("PathBuilder", [], factory);
	else if(typeof exports === 'object')
		exports["PathBuilder"] = factory();
	else
		root["PathBuilder"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 52);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {


var Element = function (ui, x, y) {
    this.ui = ui;
    this.scene = ui.scene;
    this.x = x;
    this.y = y;
    this.ui.elements.push(this);

    this.scene.cameras.main.ignore(this);
    var l = 1 << this.scene.cameras.cameras.length - 1;
    this.cameraFilter = l & ~this.ui.camera._id;

    return this;
}

Element.prototype.update = function () {

}

Element.prototype.toggle = function () {
    this.visible = !this.visible;
}

Element.prototype.click = function () {
    var callbackcontext = this.callbackcontext;
    var args = this.args;

    if (this.callbacks instanceof Array) {
        this.callbacks.forEach(function (callback, index) { callback.apply(callbackcontext[index], args) });
    } else {
        this.callbacks.apply(this.callbackcontext, this.args);
    }
}

Element.prototype.hover = function () {

}

Element.prototype.out = function () {

}

module.exports = Element;


/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {


var Element = __webpack_require__(10);
        
var Point = function (ui, vector, curve,  key, mapping) {
    Element.call(this, ui, vector.x, vector.y);
    Phaser.GameObjects.Image.call(this, ui.scene, vector.x, vector.y, key);

    this.setInteractive();
    this.scene.input.setDraggable(this);

    this.setData('vector', vector);
    this.scene.vectors.push(vector);

    //TODO: abstract from point to A custom curve class.
    if(curve !==null){
        this.curve = curve;
        this.curve.controlpoints.push(this);
    }

    if (mapping) {
        this.mapping = mapping;
    }

    this.on('pointerout', function (pointer, gameObject) {
        this.scene.pointer.switchCursor();                      
        
        this.scene.pointer.lbl.visible = true;
    });

    this.on('drag', function (pointer, gameObject) {
        game.canvas.style.cursor = "pointer";                        
        
        this.x = this.scene.pointer.x + this.scene.drawpanel.camera.scrollX;
        this.y = this.scene.pointer.y + this.scene.drawpanel.camera.scrollY;

        this.scene.pointer.lbl.visible = false;

        this.data.get('vector').set(this.x, this.y);

        if (this.mapping) {
            var m = this.mapping;
            var _this = this;

            for (var t in m.data) {
                m.src[m.data[t].property] = m.data[t].operator(m.src, _this[t]);
            }
        }

        this.scene.graphics.clear();
        this.scene.draw();

    });

    this.lbl = this.ui.add.label(this.x + 10, this.y + 10, "").setFontStyle(PathBuilder.UI.fonts["Point"]);

    return this;
}

Point.prototype = Object.create(Phaser.GameObjects.Image.prototype);
Object.assign(Point.prototype, Element.prototype);

Point.prototype.constructor = Point;

Point.prototype.update = function () {
    this.lbl.x = this.x + 10;
    this.lbl.y = this.y + 10;
    this.lbl.setText("x: " + this.x + " y: " + this.y);
}

Point.prototype.destroy = function(){
    //this.scene.drawpanel.elements.pop();
    this.lbl.destroy();
    Phaser.GameObjects.Image.prototype.destroy.call(this);    
}

module.exports = Point;


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

var Menu = __webpack_require__(53);
var Button = __webpack_require__(54);
var Point = __webpack_require__(23);
var EndPoint = __webpack_require__(55);
var ControlPoint = __webpack_require__(56);
var Label = __webpack_require__(57);
//var Image = require("./Image");

var UI = function (scene) {
    this.scene = scene;
    this.elements = [];

    this.add = {
        menu: function (x, y) {
            var m = new Menu(this.ui, x, y);
            this.ui.scene.add.existing(m);
            return m;
        },
        text: function (x, y, text, key, frame, target, callback, args, context) {
            var tb = new Button(this.ui, x, y, text, key, frame, target, callback, args, context);
            this.ui.scene.add.existing(tb);
            return tb;
        },
        point: function (vector, curve, key, mapping) {
            var p = new Point(this.ui, vector, curve, key, mapping);
            this.ui.scene.add.existing(p);
            return p;
        },
        endpoint: function (vector, curve, key, mapping) {
            var p = new EndPoint(this.ui, vector, curve, key, mapping);
            this.ui.scene.add.existing(p);
            return p;
        },
        controlpoint: function (vector, curve, key, mapping) {
            var p = new ControlPoint(this.ui, vector, curve, key, mapping);
            this.ui.scene.add.existing(p);
            return p;
        },
        label: function (x, y, text, target, callback, args, context) {
            var l = new Label(this.ui, x, y, text, target, callback, args, context);
            this.ui.scene.add.existing(l);
            return l;
        },
        // image: function (x, y, key, frame) {
        //     var i = new Image(this.ui, x, y, key, frame);
        //     this.ui.scene.add.existing(i);
        //     return i;
        // }
    }
    this.add.ui = this;
    this.camera = this.scene.cameras.add();
}

//TODO: link classes
UI.fonts = {
    "Button": { fontFamily: 'Arial', fontSize: 16, color: '#00ff00' },
    "Point": { fontFamily: 'Arial', fontSize: 12, color: '#00ff00' },
    "EndPoint": { fontFamily: 'Arial', fontSize: 12, color: '#00ff00' },
    "ControlPoint": { fontFamily: 'Arial', fontSize: 10, color: '#00ff00' },
    "Label": { fontFamily: 'Arial', fontSize: 16, color: '#ffff00' },
};

UI.prototype = {
    hide: function () {
        this.elements.forEach(function (element) { element.visible = false });
        this.scene.switchmode("normal");
        this.translate(0, this.scene.cameras.main.height, 400, this.scene.unfreeze);
    },
    show: function () {
        this.elements.forEach(function (element) { element.visible = true });
        this.scene.switchmode("normal");
        this.translate(0, 0, 400, this.scene.freeze);
    },
    translate: function (x, y, speed, callback) {
        this.scene.tweens.add({
            targets: this.camera,
            scrollX: x,
            scrollY: y,
            duration: speed,
            ease: "Cubic.easeOut"
        });
        this.scene.time.delayedCall(speed, callback, [], this.scene);
    },
    update: function () {
        this.elements.forEach(function (element) { element.update() });
    },
    destroy: function () {
        this.elements.forEach(function (element) { element.destroy() });

    }
}

UI.prototype.constructor = UI;

module.exports = UI;


/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {


var PathBuilder = function (scene) {

    this.scene = scene;
    this.systems = scene.sys;

};

PathBuilder.UI = __webpack_require__(34);
PathBuilder.Scene = __webpack_require__(58);

PathBuilder.prototype = {

    boot: function () {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
                
        //TODO: rewrite according API
        this.systems.scenePlugin.add('UI', PathBuilder.Scene, true);
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function () {
    },

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function () {
        this.shutdown();

        this.scene = undefined;
    }

};

PathBuilder.prototype.constructor = PathBuilder;

module.exports = PathBuilder;




/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

var Element = __webpack_require__(10);

var Menu = function(ui, x, y){
    Element.call(this, ui, x, y);
    Phaser.GameObjects.Container.call(this, ui.scene, x , y);
}

Menu.prototype = Object.create(Phaser.GameObjects.Container.prototype);
Object.assign(Menu.prototype, Element.prototype);

Menu.prototype.add = function(x,y, item, callback, args, context){
    this[item] =  this.ui.add.text(x, y, item, null, null, null, callback, args, context).setFontStyle(PathBuilder.UI.fonts["Button"]);
    Phaser.GameObjects.Container.prototype.add.call(this, this[item]);
    return this[item];
}

Menu.prototype.update = function(){

}

Menu.prototype.hide = function(){
    this.list.forEach(function(element){ element.setVisible(false)});    
}

Menu.prototype.show = function(){
    this.list.forEach(function(element){ element.setVisible(true)});    
}

Menu.prototype.divide = function(){
    
}

module.exports = Menu;

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {


var Element = __webpack_require__(10);

var Button = function (ui, x, y, text, key, frame, target, callbacks, args, context) {
    Element.call(this, ui, x, y);
    Phaser.GameObjects.Text.call(this, ui.scene, x, y, text, PathBuilder.UI.fonts["Button"]);

    this.target = target;
    this.callbacks = callbacks;
    this.args = args;
    this.callbackcontext = context;
    this.tween = null;

    this.setInteractive();

    this.on('pointerdown', function (pointer, gameObject) {
        this.click();
    });
    this.on('pointerover', function (pointer, gameObject) {
        this.hover();
    });
    this.on('pointerout', function (pointer, gameObject) {
        this.out();
    });

    return this;
}

Button.prototype = Object.create(Phaser.GameObjects.Text.prototype);
Object.assign(Button.prototype, Element.prototype);

Button.prototype.click = function () {
    Element.prototype.click.call(this);
    this.tween = this.scene.tweens.add({ targets: this, scaleX: 1.2, scaleY: 1.2, duration: 100, ease: 'Linear', yoyo: true });
}

Button.prototype.hover = function () {
    game.canvas.style.cursor = "pointer";
    Element.prototype.hover.call(this);
    this.setScale(1.1, 1.1);
}

Button.prototype.out = function () {
    this.scene.pointer.switchCursor();                       
    Element.prototype.out.call(this);
    this.setScale(1, 1);
}

module.exports = Button;


/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {


var Point = __webpack_require__(23);

var EndPoint = function (ui, vector, curve, key, mapping) {
    Point.call(this, ui, vector, curve, key, mapping);
    this.lbl.setFontStyle(PathBuilder.UI.fonts["EndPoint"]);
}

EndPoint.prototype = Object.create(Point.prototype);
EndPoint.prototype.constructor = EndPoint;

module.exports = EndPoint;


/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {


var Point = __webpack_require__(23);

var ControlPoint = function (ui, vector, curve, key, mapping) {
    Point.call(this, ui, vector, curve, key, mapping);
    this.setScale(0.75, 0.75);

    this.lbl.setFontStyle(PathBuilder.UI.fonts["ControlPoint"]);
    this.lbl.visible = false;

    this.on('pointermove', function (pointer, gameObject) {
        this.lbl.visible = true;
    });

    this.on('pointerout', function (pointer, gameObject) {
        this.lbl.visible = false;
    });

    this.on('dragend', function (pointer, gameObject) {
        this.lbl.visible = false;
    });
}

ControlPoint.prototype = Object.create(Point.prototype);
ControlPoint.prototype.constructor = ControlPoint;

module.exports = ControlPoint;


/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {


var Element = __webpack_require__(10);

var Label = function (ui, x, y, text, target, callbacks, args, context) {
    Element.call(this, ui, x, y);
    Phaser.GameObjects.Text.call(this, ui.scene, x, y, text, PathBuilder.UI.fonts["Label"]);

    this.target = target;
    this.callbacks = callbacks;
    this.callbackcontext = context;
    this.args = args;
    this.tween = null;

    this.setInteractive();

    return this;
}

Label.prototype = Object.create(Phaser.GameObjects.Text.prototype);
Object.assign(Label.prototype, Element.prototype);

module.exports = Label;


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {


var UI = __webpack_require__(34);
var Pointer = __webpack_require__(59);

var Scene = function () {

    if (window.addEventListener)
    {
        window.addEventListener('DOMMouseScroll', this.scroll, false);
        window.onmousewheel = this.scroll.bind(this);
    }
}

Scene.prototype = {
    preload: function () {

    },

    create: function () {
        this.tool = { "normal": null, "draw": this.place};
        this.mode = "normal";
        this.cursors = {"normal": "default", "draw": "copy", "select": "default", "hand": "move"};
        this.curves = {"Line": Phaser.Curves.Line, "Ellipse": Phaser.Curves.Ellipse, "QuadraticBezier": Phaser.Curves.QuadraticBezier, "CubicBezier": Phaser.Curves.CubicBezier, "Spline": Phaser.Curves.Spline };

        this.events.emit('switchmode', this.mode);

        this.input.mouse.disableContextMenu();      

        this.W = this.cameras.main.width;
        this.H = this.cameras.main.height;
        this.drawmode = "CubicBezier";

        //TODO: seperate class  
        this.vectors = [];

        //reserved for spline building
        this.spline = null;
        this.path = this.add.path();
        this.path.segments = 32;
        this.graphics = this.add.graphics();

        this.drawpanel = new UI(this);
        this.middle = new UI(this);
        this.top = new UI(this);

        //this.drawpanel.elements.push(this.graphics);
        this.graphics.fillStyle(0xff0000,1);
        this.graphics.fillCircle(10,10,8);
        this.graphics.generateTexture('endpoint', 32, 32);
        this.graphics.fillStyle(0x00ff00,1);
        this.graphics.fillCircle(10,10,8);
        this.graphics.generateTexture('controlpoint', 32, 32);
        this.graphics.clear();

        //TODO: rewrite callback implementation
        //TODO: adjust to game size
        this.hidebutton = this.top.add.text(10, 300, 'hide', null, null, null, [this.drawpanel.hide, this.middle.hide], [], [this.drawpanel, this.middle]);
        this.showbutton = this.top.add.text(10, 350, 'show', null, null, null, [this.drawpanel.show, this.middle.show], [], [this.drawpanel, this.middle]);
        this.viewbutton = this.top.add.text(this.W -100, this.H * 0.1, 'reset view', null, null, null, this.resetView, [], this);
                
        this.drawbutton = this.middle.add.text(10, 200, 'draw', null, null, null, this.switchmode, ["draw"], this);
        this.clearbutton = this.middle.add.text(10,100,'clear',null,null,null, this.clear,[], this);  
        this.undobutton = this.middle.add.text(10,50,'undo',null,null,null, this.undo,[], this);  
        
        this.importbutton = this.middle.add.text(this.W -100, this.H - 200, 'import', null, null, null, this.import, [], this);
        this.exportbutton = this.middle.add.text(this.W -100, this.H - 100, 'export', null, null, null, this.export, [], this);
        
        this.pausebutton = this.middle.add.text(10, this.H - 200,'pause',null,null,null, this.freeze,[], this);  
        this.resumebutton = this.middle.add.text(10, this.H - 150,'resume',null,null,null, this.unfreeze,[], this);  
        
        this.previewbutton = this.middle.add.text(10, this.H - 100, 'preview', null, null, null, this.preview, [], this);

        this.modelabel = this.middle.add.label(100, 20, 'mode: ', null, null, null, null, this);
        this.drawmodelabel = this.middle.add.label(400, 20, 'curve: ' +this.drawmode, null, null, null, null, this);
        
        this.pointer = new Pointer(this.middle, 100, 100, 'controlpoint');

        this.setCameras();

        this.drawpanel.hide();
        this.middle.hide();

        //TODO: debug internal, remove in prod
        // var gui = new dat.GUI({
        //     width: 200
        // });

        // gui.add(this.drawpanel, 'hide');
        // gui.add(this.drawpanel, 'show');
        // gui.add(this.pointer, 'snap', 1, 100, 2);

    },
    update: function () {
        this.drawpanel.update();
        this.pointer.update();     
        //this.drawpanel.camera.setZoom(Math.sin(this.time.now/100000)+1);
        //this.cameras.main.setZoom(Math.sin(this.time.now/100000)+1);
        //this.middle.camera.setZoom(Math.sin(this.time.now/100000)+1);
        //this.top.camera.setZoom(Math.sin(this.time.now/100000)+1);
    },
    setCameras: function () {
        this.drawpanel.camera.ignore(this.middle.elements);
        this.drawpanel.camera.ignore(this.top.elements);

        this.middle.camera.ignore(this.graphics);
        this.middle.camera.ignore(this.drawpanel.elements);
        this.middle.camera.ignore(this.top.elements);

        this.top.camera.ignore(this.graphics);
        this.top.camera.ignore(this.middle.elements);
        this.top.camera.ignore(this.drawpanel.elements);

        this.cameras.main.ignore(this.children.list);

        //TODO: move/ rewrite
        this.supercamera = this.sys.game.scene.scenes[0].cameras.main;
    },
    switchmode: function (mode) {
        this.mode = mode;
        this.modelabel.setText("mode: " + this.mode);
        this.pointer.switchCursor();        
        this.events.emit('switchmode', this.mode);
    },
    clear: function () {
        var _this = this;
        this.path.curves.forEach(function(curve){_this.undo()});
        this.drawpanel.elements.forEach(function (element) { element.destroy() });
        this.vectors = [];
        this.drawpanel.elements = [];
        this.path.curves = [];     
        this.spline  = null;
        
        this.graphics.clear();
    },
    undo: function() { 
        //TODO: extend curve class  
        if(this.vectors.length>1){
            var _this = this;        
            var lastcurve = this.path.curves[this.path.curves.length -1];
            lastcurve.controlpoints.forEach(function(point){point.destroy();_this.vectors.pop()});
            
            this.path.curves.pop();
            this.spline  = null;  
    
            this.graphics.clear();        
            this.draw();
        }    
    },
    place: function (ui, x, y) {
        //TODO: extend A curve class for each case, add A factory entry for curves.
        
        var vector = new Phaser.Math.Vector2(x, y);

        if (this.vectors.length == 0) {
            this.point = ui.add.endpoint(vector, null,'endpoint');
            return;
        }

        if (this.drawmode == "Line") {

            this.spline = null;

            var previous = this.vectors[this.vectors.length - 1];

            if (this.vectors.length > 0) {
                var c = new this.curves[this.drawmode](previous, vector);
                
                this.path.add(c);
                c.controlpoints = [];                
            }

            this.point = ui.add.endpoint(vector, c, 'endpoint');

        }

        if (this.drawmode == "QuadraticBezier") {

            this.spline = null;
            
            var control = new Phaser.Math.Vector2(x, y);

            var previous = this.vectors[this.vectors.length - 1];

            control = control.add(previous);
            control = control.divide(new Phaser.Math.Vector2(2, 2));

            var c = new this.curves[this.drawmode](previous, control, vector);
            
            this.path.add(c);
            c.controlpoints = [];
            
            this.point = ui.add.controlpoint(control, c, 'controlpoint');

            this.point = ui.add.endpoint(vector, c, 'endpoint');

        }

        if (this.drawmode == "CubicBezier") {

            this.spline = null;
            
            var control1 = new Phaser.Math.Vector2(x, y);
            var control2 = new Phaser.Math.Vector2(x, y);

            var previous = this.vectors[this.vectors.length - 1];

            control1.x = previous.x + (x - previous.x) * 0.25;
            control1.y = previous.y + (y - previous.y) * 0.25;

            control2.x = previous.x + (x - previous.x) * 0.75;
            control2.y = previous.y + (y - previous.y) * 0.75;
            
            var c = new this.curves[this.drawmode](previous, control1, control2, vector);
            
            this.path.add(c);
            c.controlpoints = [];
            
            this.point = ui.add.controlpoint(control1, c, 'controlpoint');
            this.point = ui.add.controlpoint(control2, c, 'controlpoint');

            this.point = ui.add.endpoint(vector, c, 'endpoint');

        }

        if (this.drawmode == "Spline") {

            var previous = this.vectors[this.vectors.length - 1];

            if (this.spline == null) {
                var c = new this.curves[this.drawmode]([previous.x, previous.y, vector.x, vector.y]);
                this.spline = c;

                this.path.add(c);
                c.controlpoints = [];
                
            }

            this.path.segments += 8;

            if (this.vectors.length == 1) {

                this.point = ui.add.controlpoint(vector, this.spline, 'controlpoint');
                
            } else {

                this.point = ui.add.controlpoint(vector, this.spline, 'controlpoint');
                
                this.spline.addPoints([vector.x, vector.y]);

            }

            this.spline.points[this.spline.points.length - 1] = vector;
            this.spline.points[this.spline.points.length - 2] = previous;

        }

        if (this.drawmode == "Ellipse") {

            this.spline = null;
            
            var previous = this.vectors[this.vectors.length - 1];

            var c = new this.curves[this.drawmode](vector.x, vector.y, 100,100);
            
            this.path.add(c);
            c.controlpoints = [];

            c.p0 = vector;

            var dist = new Phaser.Math.Vector2(vector.x + 100, vector.y + 100);

            //map control point coordinates to radii
            this.point = ui.add.endpoint(vector, c, 'endpoint');

            this.point = ui.add.controlpoint(dist, c, 'controlpoint',
                {
                    "src": c,
                    "data":
                    {
                        "x": { "property": "xRadius", "operator": function (src, x) { return src.p0.x - x } },
                        "y": { "property": "yRadius", "operator": function (src, y) { return src.p0.y - y } }
                    }
                });

            var anglevec = new Phaser.Math.Vector2(c.p0.x, c.p0.y + c.yRadius);

        }

        this.draw();

        this.setCameras();
    },
    move: function (graphics, vector) {

    },
    draw: function () {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.graphics.fillStyle(0xffffff, 1);
        this.path.draw(this.graphics, this.path.segments);
    },
    look : function (camera) {
        camera.scrollY = (this.pointer.lastY - this.input.activePointer.y);
        camera.scrollX = (this.pointer.lastX - this.input.activePointer.x);
    },
    scroll: function(event)
    {
        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta/120; 
        } else if (event.detail) {
            delta = -event.detail/3;
        }
        // TODO: move to pointer 
        if(delta>0){
            game.canvas.style.cursor = "zoom-in";
        }
        if(delta<0){
            game.canvas.style.cursor = "zoom-out";
        }

        this.time.delayedCall(250, this.pointer.switchCursor, [], this.pointer);

        this.drawpanel.camera.zoom += delta*0.1;
        this.supercamera.zoom += delta*0.1;
        
        return delta;
    },
    resetView(){
        this.drawpanel.camera.zoom = 1;
        this.supercamera.zoom = 1;        
        this.drawpanel.camera.setScroll(0,0);
        this.supercamera.setScroll(0,0);
    },
    freeze: function () {
        this.scene.manager.scenes[0].scene.pause();
    },
    unfreeze: function () {
        this.scene.manager.scenes[0].scene.resume();
    },
    import: function () {
        var data = this.cache.json.get('data');
        this.path = this.path.fromJSON(data);
        this.draw();
    },
    export: function () {
        var data = JSON.stringify(this.path.toJSON());
        console.log(data);
        var file = new Blob([data], ["data.json"]);
        var url = URL.createObjectURL(file);
        var link = document.createElement('a');
        link.href = url;
        link.download = "data.json";
        link.click();

    },
    preview: function () {
        if(this.path.curves.length !== 0){
            var follower = this.add.follower(this.path, 0, 0, 'dude');

            this.cameras.main.ignore(follower);
            this.middle.camera.ignore(follower);
            this.top.camera.ignore(follower);

            follower.startFollow({
                duration: 2000,
                rotateToPath: true,
                yoyo: true,
                onComplete: function (t, s, w) { w.destroy() },
                onCompleteParams: [follower],
                ease: 'Cubic.easeInOut'
            });   
        }
    },
    destroy: function () {
    }
};

// Scene.prototype.constructor = Scene;

module.exports = Scene;



/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {


var Element = __webpack_require__(10);

var Pointer = function (ui, x, y, key, frame) {
    Element.call(this, ui, x, y);
    Phaser.GameObjects.Image.call(this, ui.scene, x, y, key);

    this.alpha = 0.5;

    this.snap = 50;

    //global input listener 

    this.scene.input.on('pointerdown', function (pointer, gameObject) {

        if (this.scene.mode == "draw" && pointer.dragState ==0 && pointer.leftButtonDown()) {
            if (gameObject.length ==0 && (pointer.x > 50 && pointer.x < this.scene.W - 100)) {
                
                var _dx = this.scene.drawpanel.camera.scrollX;
                var _dy = this.scene.drawpanel.camera.scrollY;
                
                this.scene.place(this.scene.drawpanel, this.x + _dx, this.y +_dy);
            }
        } 


        if(pointer.rightButtonDown() && pointer.dragState == 0)
        {
            this.lockX = pointer.x;
            this.lockY = pointer.y;
            
            this.scene.switchmode("select");     
        } 


        if(pointer.middleButtonDown())
        {
            this.lastX = pointer.x + this.scene.drawpanel.camera.scrollX;
            this.lastY = pointer.y + this.scene.drawpanel.camera.scrollY;
            
            this.scene.switchmode("hand");
        }  

    }, this);

    this.scene.input.on('pointerup', function (pointer, gameObject) {
        if(pointer.middleButtonDown())
        {
            this.scene.switchmode("normal");
        }          
    }, this);
    
    this.snapkey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this.lbl = this.ui.add.label(x + 20, y + 20, "").setFontStyle(PathBuilder.UI.fonts["Label"]);
    
    this.menu = this.ui.add.menu(x, y);

    this.menu.add(-50, -50, "Line", this.switchdrawmode,["Line"],this);
    this.menu.add(0, -50, "Quadratic", this.switchdrawmode,["Quadratic"],this);
    this.menu.add(50, -50, "Cubic", this.switchdrawmode,["Cubic"],this);
    this.menu.add(-50, 50, "Spline", this.switchdrawmode,["Spline"],this);
    this.menu.add(0, 50, "Ellipse", this.switchdrawmode,["Ellipse"],this);

    this.scene.events.on('switchmode', this.switchmode, this);

    this.scene.add.existing(this);

}

Pointer.prototype = Object.create(Phaser.GameObjects.Image.prototype);
Object.assign(Pointer.prototype, Element.prototype);

Pointer.prototype.constructor = Pointer;

Pointer.prototype.switchmode = function (mode) {

    if (mode == "draw") {
        // TODO: abstraction
        
        this.setVisible(true);
        this.lbl.setVisible(true);
        this.menu.hide();

    }
    if (mode == "normal") {        
        
        this.setVisible(false);
        this.menu.hide();        

    }
    if (mode == "select"){        
        this.setVisible(false);  

        this.menu.setPosition(this.x , this.y);
        this.menu.show();        

    }
    if(mode == "hand"){
        game.canvas.style.cursor = "grab";
        
        this.setVisible(true);
        this.lbl.setVisible(true);

    }
}
Pointer.prototype.switchCursor = function(){
    game.canvas.style.cursor = this.scene.cursors[this.scene.mode];
}

Pointer.prototype.switchdrawmode = function (mode) {
    this.scene.drawmode = mode;
    this.scene.drawmodelabel.setText("curve: " + mode);
    this.menu.hide();            
    this.scene.switchmode("draw");
}

Pointer.prototype.update = function () {
    
        this.x = this.scene.input.activePointer.x;
        this.y = this.scene.input.activePointer.y;
        
        if(this.scene.mode == "hand"){
            this.scene.look(this.scene.drawpanel.camera);
            this.scene.look(this.scene.supercamera);            
        }  

        if(this.scene.mode == "select"){
            if(Phaser.Math.Distance.Between(this.x, this.y, this.lockX, this.lockY)>150){
                this.scene.switchmode("draw");
            } 
        }    
    
        if(this.scene.mode !== "select"){
        
            if (this.snapkey.isDown) {
                this.x = Math.round(this.x / this.snap) * this.snap;
                this.y = Math.round(this.y / this.snap) * this.snap;
            }
            this.lbl.setPosition(this.x + 20, this.y + 20);
            this.lbl.setText("x: " + this.x + " y: " + this.y);
        }
    
    }

module.exports = Pointer;


/***/ })

/******/ });
});