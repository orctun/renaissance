var window = window;
		window.tick = 40;
		window.time = 0;

		window.load = function (update) {
			window.onkeydown = update;
			window.onkeyup = update;
			window.onmousedown = update;
			window.onmousemove = update;
			window.onmouseup = update;
			window.on.tick = update;
		}

		window.on = {
			set tick (update) {
				window.setInterval (function () {
					window.time += window.tick;
					update ({type: 'tick'});
				}, window.tick);
			}
		}

var canvas = window.document.createElement ('canvas');

		canvas.css = function () {
			canvas.style.left = 0;
			canvas.style.position = 'absolute';
			canvas.style.top = 0;
		}

		canvas.load = function () {
			canvas.css ();
			canvas.resize ();
			window.document.body.appendChild (canvas);
		}

		canvas.resize = function () {
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;
		}

var context = canvas.getContext ('2d');

var game = {
	a: {},

	create: {
		animation: function (_) {
			let animation = game.create.sprite (_);
				animation.a = _.a || [new Image()];
				animation.delay = _.delay || window.delay;
				animation.link = _.link;
				animation.sound = _.sound || { delay: -1 };
				animation.sound.time = window.time;
				animation.step = _.step || 0;
				animation.stop = _.stop || false;
				animation.time = _.time || window.time;

				animation.animate = function () {
					if (!animation.stop) {
						if (window.time - animation.time >= animation.delay) {
							animation.time = window.time;
							animation.step = (animation.step >= animation.a.length - 1) ? 0 : animation.step + 1;
							animation.i = animation.a[animation.step];
							game.zen (animation);
						}
					}
				}

				animation.keydown = function () {
					animation.linking ();
				}

				animation.linking = function () {
					if (animation.link) {
						animation.x = animation.link.x;
						animation.y = animation.link.y;
						if (animation.stop) {
							if (animation.i.width != 0) {
								animation.i = new Image ();
							}

							if (animation.link_image) {
								animation.link.i = animation.link_image;
								animation.link_image = undefined;
								game.zen (animation.link);
							}
						} else {
							if (animation.link_image == undefined) {
								animation.link_image = animation.link.i.cloneNode (true);
								animation.link.i = new Image ();
							}
						}
					}
				}

				animation.play = function () {
					if (!animation.stop) {
						if (window.time - animation.sound.time >= animation.sound.delay) {
							animation.sound.time = window.time;
							game.play (animation.sound);
						}
					}
				}

				animation.tick = function () {
					animation.linking ();
					animation.animate ();
					animation.play ();
				}

			return animation;
		},

		block: function (_) {
			let block = game.create.sprite (_);
					block.type = 'block';
			return block;
		},

		box: function (_) {
			let box = game.create.object (_);
				box.fill = _.fill || 'transparent';
				box.tracks = {};
				box.z = _.z || 0;

				box.draw = function () {
					context.fillStyle = box.fill;
					context.fillRect (box.x, box.y, box.w, box.h);
				}

				box.move = function (x, y) {
					box.x = x;
					box.y = y;
					game.zen (box);
					box.track ();
				}

				box.track = function () {
					for (let id in game.object) {
						if (game.object[id].draw) {
							if (box.tracks[id]) {
								if (!game.get.binbox (box, game.object[id])) {
									game.object[id].redraw = 1;
									game.zen (game.object[id]);
								}
							}

							if (game.get.binbox (box, game.object[id])) {
								box.tracks[id] = true;
							} else {
								box.tracks[id] = false;
							}
						}
					}
				}

			return box;
		},

		button: function (_) {
			let button = game.create.sprite (_);
				button.action = _.action || function () {};
				button.active = false;
				button.in = _.in || function () {};
				button.out = _.out || function () {};

				button.activate = function (event) {
					if (game.get.pinbox ({ x: event.x, y: event.y }, button)) {
						if (!button.active) {
							button.active = true;
							canvas.style.cursor = 'url(data/cursorlime.png), pointer';
							button.in ();
						}
					} else {
						if (button.active) {
							button.active = false;
							canvas.style.cursor = 'url(data/cursorose.png), default';
							button.out ();
						}
					}
				}

				button.click = function (event) {
					if (game.get.pinbox ({ x: event.x, y: event.y }, button)) {
						button.action ();
					}
				}

				button.mousedown = function (event) {
					button.click (event);
				}

				button.mousemove = function (event) {
					button.activate (event);
				}

			return button;
		},

		gate: function (_) {
			let gate = game.create.sprite (_);
					gate.action = _.action || function () {};
					gate.type = 'gate';

					gate.enter = function () {
						for (let id in game.object) {
							if (game.object[id].type == 'unit') {
								if (game.get.binbox (gate, game.object[id])) { gate.action (); return true; }
							}
						}
					}

					gate.tick = function () {
						gate.enter ();
					}
			return gate;
		},

		link: function (_) {
			let link = game.create.text (game.create.button (_));
			return link;
		},

		object: function (_) {
			let object = _ || {};
				object.id = _.id || game.id++;

				object.load = function () {
					game.object[object.id] = object;
				}

			return object;
		},

		sprite: function (_) {
			let sprite = game.create.box (_);
					sprite.i = _.i || new Image ();
					sprite.repeat = _.repeat || false;

					sprite.draw = function () {
						context.imageSmoothingEnabled = false;
						if (sprite.repeat) {
							let pattern = context.createPattern (sprite.i, 'repeat');
							context.fillStyle = pattern;
							context.fillRect (sprite.x, sprite.y, sprite.w, sprite.h);
						} else {
							context.drawImage (sprite.i, sprite.x, sprite.y, sprite.w, sprite.h);
						}
					}

			return sprite;
		},

		text: function (_) {
			let text = game.create.box (_);
				text.align = _.align || 'left';
				text.baseline = _.baseline || 'top';
				text.color = _.color || '#000';
				text.font = _.font || 'Arial';
				text.h = _.h || _.size || '12';
				text.size = text.h;
				text.text = _.text;
				text.w = game.get.font.width (text);

				text.draw = function () {
					if (text.fill != 'transparent') {
						context.fillStyle = text.fill;
						context.fillRect (text.x, text.y, game.get.font.width (text), text.size);
					}

					context.fillStyle = text.color;
					context.font = text.size + 'px ' + text.font;
					context.textAlign = text.align;
					context.textBaseline = text.baseline;
					context.fillText (text.text, text.x, text.y);
				}

			return text;
		},

		timer: function (_) {
			let timer = game.create.object (_);
				timer.action = _.action || function () {};
				timer.interval = _.interval || window.tick;
				timer.time = window.time;

				timer.tick = function () {
					if (window.time - timer.time >= timer.interval) {
						timer.action ();
						timer.time = window.time;
					}
				}

			return timer;
		},

		unit: function (_) {
			let unit = game.create.sprite (_);
			unit.animation = _.animation || {};
			unit.g = _.g;
			unit.hp = _.hp || [1, 1];
			unit.speed = _.speed || 1;
			unit.type = 'unit';
			unit.vx = _.vx || unit.x;
			unit.vy = _.vy || unit.y;

			unit.blocked = function () {
				for (let id in game.object) {
					if (game.object[id].type == 'block') {
						if (game.get.binbox (unit, game.object[id])) { return true; }
					}
				}
				return false;
			}

			unit.go = function () {
				unit.vr = game.get.ab ({ x: unit.x, y: unit.y }, { x: unit.vx, y: unit.vy });
				if (unit.vr > unit.speed) {
					let v = game.get.abr ({ x: unit.x, y: unit.y }, { x: unit.vx, y: unit.vy }, unit.speed);
					let x = unit.x;
					let y = unit.y;
					unit.x = v.x;
					unit.y = v.y;

					if (!unit.blocked ()) {
						unit.move (v.x, v.y);
					} else {
						unit.x = x;
						unit.y = y;
						unit.vx = x;
						unit.vy = y;
					}

				} else {
					if (!game.key.A && !game.key.D && !game.key.S && !game.key.W) {
						unit.animation.walk = false;
					}
				}
			}

			unit.gravity = function () {
				if (unit.g) {
					if (!unit.blocked ()) {
						unit.vy += (unit.vy + unit.h + unit.g < canvas.height) ? unit.g : 0;
					}
				}
			}

			unit.tick = function () {
				unit.use ();
				unit.vector ();
				unit.gravity ();
				unit.go ();
			}

			unit.use = function () {
				if (game.key[' '] && !unit.animation.walk) {
					unit.animation.say = true;
				} else {
					unit.animation.say = false;
				}
			}

			unit.vector = function () {
				if (game.key.A) {
					unit.vx = (unit.vx > 0) ? unit.vx - unit.speed : unit.vx;
					unit.animation.walk = true;
				}

				if (game.key.D) {
					unit.vx = (unit.vx + unit.w < canvas.width) ? unit.vx + unit.speed : unit.vx;
					unit.animation.walk = true;
				}

				if (game.key.S) {
					unit.vy = (unit.vy + unit.h < canvas.height) ? unit.vy + unit.speed : unit.vy;
					unit.animation.walk = true;
				}

				if (game.key.W) {
					unit.vy = (unit.vy > 0) ? unit.vy - unit.speed : unit.vy;
					unit.animation.walk = true;
				}
			}

			return unit;
		}
	},

	draw: function (anyway) {
		let render = {};

		if (anyway) { delete game.render; }

		for (let id in game.object) {
			if (game.object[id].z != undefined) {
				if (render[game.object[id].z] == undefined) { render[game.object[id].z] = {}; }
				render[game.object[id].z][id] = game.object[id];
			}
		}

		for (let z in render) {
			for (let id in render[z]) {
				if (game.render == undefined) { game.render = {}; }
				if (game.render[z] == undefined) { game.render[z] = {}; }
				if (game.render[z][id] == undefined) { game.render[z][id] = {}; }

				if (game.get.hash (render[z][id]) != game.render[z][id]) {
					render[z][id].redraw = 0;
					render[z][id].draw ();
					game.render[z][id] = game.get.hash (render[z][id]);
				}
			}
		}
	},

	get: {
		a: function (list) {
			for (let name in list) {
				game.a[name] = [];
				for (let i = 0; i < list[name]; i++) {
					let image = new Image ();
						image.src = 'data/' + name + ' ' + i + '.png';
						game.a[name].push (image);
				}
			}
		},

		ab: function (a, b) {
			return Math.sqrt (Math.pow (a.x - b.x, 2) + Math.pow (a.y - b.y, 2));
		},

		abr: function (a, b, r) {
			let ab = game.get.ab (a, b);
			let k = r / (ab - r);
			let x = (a.x + k * b.x) / (1 + k);
			let y = (a.y + k * b.y) / (1 + k);
			return { x: x, y: y };
		},

		binbox: function (a, b) {
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) < 0.5 * Math.abs (a.w + b.w)) &&
								(Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) < 0.5 * Math.abs (a.h + b.h)));
		},

		clone: function (obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    let copy = new obj.constructor();
		    for (let attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		},

		font: {
			width: function (text) {
				context.font = text.size + 'px ' + text.font;
				return context.measureText (text.text).width;
			}
		},

		hash: function (object) {
			return '' + object.fill + object.h + object.redraw + object.text + object.w + object.x + object.y + object.z;
		},

		i: function (list) {
			for (let name of list) {
				let image = new Image ();
					image.src = 'data/' + name + '.png';
				game.i[name] = image;
			}
		},

		pinbox: function (p, b) {
			return ((p.x > b.x) && (p.x < b.x + b.w) && (p.y > b.y) && (p.y < b.y + b.h));
		},

		r: function (a, b, c) {
			if (Array.isArray (a)) {
				let i = Math.floor (Math.random () * (a.length));
				return a[i];
			}

			if (a == 'color') {
				return '#' + ((1<<24)*Math.random()|0).toString(16);
			}

			if (c) {
				return Math.floor (Math.random () * (b - a + 1)) + a;
			}

			if (b) {
				return Math.random () * (b - a) + a;
			}

			return Math.random ();
		}
	},

	i: {},

	id: 0,

	key: {
		control: function (event) {
			if (event.type == 'keydown') {
				game.key[String.fromCharCode(event.keyCode)] = true;
			}
			if (event.type == 'keyup') {
				game.key[String.fromCharCode(event.keyCode)] = false;
			}
		}
	},

	load: function () {
		window.load (game.update);
		window.onresize = function () {
			canvas.resize ();
			game.draw (true);
		}
		canvas.load ();
		game.scene.load ();
	},

	object: {},

	ost: {},

	play: function (sound) {
		let audio = new Audio ();
			audio.src = 'data/' + sound.name + '.ogg';
			audio.volume = sound.volume || 1;

			if (sound.ost) {
				audio.loop = true;
				game.ost = audio;
				game.ost.play ()
			} else {
				audio.play ();
			}
	},

	scene: { load: function () {} },

	update: function (event) {
		game.key.control (event);
		for (let id in game.object) {
			for (let method in game.object[id]) {
				if (method == event.type) { game.object[id][method] (event);  }
			}
		}
		game.draw ();
	},

	wipe: function () {
		game.object = {};
		if (game.ost.src) game.ost.pause ();
		context.clearRect (0, 0, canvas.width, canvas.height);
		canvas.style.cursor = 'url(data/cursorose.png), default';
	},

	zen: function (object) {
		for (let id in game.object) {
			if (id != object.id) {
				if (game.get.binbox (object, game.object[id])) {
					if (!game.object[id].redraw) {
						game.object[id].redraw = 1;
						game.zen (game.object[id]);
					}
				}
			}
		}
	}
}

window.onload = game.load;
