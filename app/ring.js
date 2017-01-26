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
				animation.end = _.end;
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
							if (animation.end && (animation.step >= animation.a.length - 1)) { animation.end (); };
						}
					}
				}

				animation.keydown = function () {
					animation.linking ();
				}

				animation.linking = function () {
					if (animation.link) {
						if (!game.object[animation.link.id]) {
							delete game.object[animation.id];
						}
						animation.x = animation.link.x;
						animation.y = animation.link.y;
						if (animation.stop) {
							if (animation.i.width != 0) {
								animation.i = new Image ();
							}

							if (animation.link_image) {
								game.object[animation.link.id].i = animation.link_image;
								animation.link_image = undefined;
								game.zen (game.object[animation.link.id]);
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
					if (animation.sound.delay != -1) {
						if (!animation.stop) {
							if (window.time - animation.sound.time >= animation.sound.delay) {
								animation.sound.time = window.time;
								game.play (animation.sound);
							}
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

		bullet: function (_) {
			let bullet = game.create.unit (_);
				bullet.damage = _.damage || 1;
				bullet.enemy = _.enemy || 'enemy';
				bullet.type = 'bullet';

				bullet.destroy = function () {
					if (bullet.vr < bullet.speed) {
						delete game.object[bullet.id];
						game.zen (bullet);
					} else {
						for (let id in game.object) {
							if (game.object[id].type == bullet.enemy) {
								if (game.get.binbox (bullet, game.object[id])) {
									game.object[id].hp[0] -= bullet.damage;
									delete game.object[bullet.id];
								}
							}
						}
					}
				}

				bullet.tick = function () {
					bullet.go ();
					bullet.destroy ();
				}

			return bullet;
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

		enemy: function (_) {
			let enemy = game.create.unit (_);
				enemy.ai = _.ai || function () {};
				enemy.ar = _.ar || 0;
				enemy.damage = _.damage || 1;
				enemy.type = 'enemy';

				enemy.agr = function () {
					let hero;
					for (let id in game.object) {
						if (game.object[id].meta == 'hero') {
							hero = game.object[id];
						}
					}
					if (hero) {
						if (game.get.ab (enemy, hero) < enemy.ar) {
							enemy.vx = hero.x;
							enemy.vy = hero.y;
						}
					}
				}

				enemy.death = function () {
					if (enemy.hp[0] <= 0) {
						enemy.ai = function () {};
						enemy.speed = 0;
						game.play ({ name: 'win', volume: 0.2 });
						delete game.object[enemy.id];
					}
				}

				enemy.tick = function () {
					enemy.death ();
					enemy.ai ();
					enemy.bar ();
					enemy.agr ();
					enemy.go ();
				}

				return enemy;
		},

		fly: function (_) {
			let fly = game.create.enemy (_);
				fly.i = _.i || game.i.fly;
				fly.reaction = game.get.r (1, 10, true) * 500;
				fly.time = window.time;

			fly.ai = function () {
				if (window.time - fly.time > fly.reaction) {
					fly.time = window.time;
					fly.reaction = game.get.r (1, 10, true) * 500;
					fly.vx = game.get.r (fly.box.x, fly.box.x + fly.box.w);
					fly.vy = game.get.r (fly.box.y, fly.box.y + fly.box.h);
				}
			}

			game.create.animation ({ a: game.a.fly_fly, delay: 40, get stop () { return !fly.animation.walk; }, h: fly.h, i: game.i.fly, link: fly, sound: { delay: 1000, name: 'bzz', volume: 0.2 }, x: fly.x, y: fly.y, w: fly.w, z: 1 }).load ();

			return fly;
		},

		gate: function (_) {
			let gate = game.create.sprite (_);
					gate.in = _.in || function () {};
					gate.inside = _.inside || 'unit';
					gate.insider = {};
					gate.out = _.out || function () {};
					gate.type = 'gate';

					gate.enter = function () {
						for (let id in game.object) {
							if (game.object[id].type == gate.inside) {
								if (game.get.binbox (gate, game.object[id])) {
									if (!gate.insider[id]) {
										gate.insider[id] = true;
										gate.in ();
										return true;
									}
								} else {
									if (gate.insider[id]) {
										gate.insider[id] = false;
										gate.out ();
									}
								}
							}
						}
					}

					gate.tick = function () {
						gate.enter ();
					}
			return gate;
		},

		hero: function (_) {
			let hero = game.create.unit (_);
				hero.action = _.action || function () {};
				hero.meta = 'hero';
				hero.weapon = _.weapon || 'none';

				game.create.animation ({ a: game.a.men_go, delay: 150, get stop () { return !hero.animation.walk; }, h: 50, i: game.i.men, link: hero, sound: { delay: 400, name: 'step', volume: 0.5 }, x: hero.x, y: hero.y, w: 35, z: 1 }).load ();

				hero.attack = function (event) {
					if (event.button == 0) {
						switch (hero.weapon) {
							case 'shoot':
								game.play ({ name: 'shoot', volume: 0.1 });
								game.create.bullet ({
									h: 10,
									i: game.i.blue,
									speed: 10,
									vx: event.x,
									vy: event.y,
									w: 10,
									x: hero.x + 0.5 * hero.w,
									y: hero.y + 0.3 * hero.h
								}).load ();
								break;
						}
					}
				}

				hero.attacked = function () {
					for (let id in game.object) {
						if (game.object[id].type == 'enemy') {
							if (game.get.binbox (hero, game.object[id])) {
								hero.hp[0] -= game.object[id].damage;
							}
						}
					}
				}

				hero.go = function () {
					hero.vr = game.get.ab ({ x: hero.x, y: hero.y }, { x: hero.vx, y: hero.vy });
					if (hero.vr > hero.speed) {
						let v = game.get.abr ({ x: hero.x, y: hero.y }, { x: hero.vx, y: hero.vy }, hero.speed);
						let x = hero.x;
						let y = hero.y;
						hero.x = v.x;
						hero.y = v.y;

						if (!hero.blocked ()) {
							hero.move (v.x, v.y);
						} else {
							hero.x = x;
							hero.y = y;
							hero.vx = x;
							hero.vy = y;
						}

					} else {
						if (!game.key.A && !game.key.D && !game.key.S && !game.key.W) {
							hero.animation.walk = false;
						}
					}
				}

				hero.mousedown = function (event) {
					hero.attack (event);
				}

				hero.tick = function () {
					hero.attacked ();
					hero.bar ();
					hero.use ();
					hero.vector ();
					hero.go ();
				}

				hero.use = function () {
					if (game.key[' '] && !hero.animation.walk) {
						hero.action ();
						hero.animation.use = true;
					} else {
						hero.animation.use = false;
					}
				}

				hero.vector = function () {
					if (game.key.A) {
						hero.vx = (hero.vx > 0) ? hero.vx - hero.speed : hero.vx;
						hero.animation.walk = true;
					}

					if (game.key.D) {
						hero.vx = (hero.vx + hero.w < canvas.width) ? hero.vx + hero.speed : hero.vx;
						hero.animation.walk = true;
					}

					if (game.key.S) {
						hero.vy = (hero.vy + hero.h < canvas.height) ? hero.vy + hero.speed : hero.vy;
						hero.animation.walk = true;
					}

					if (game.key.W) {
						hero.vy = (hero.vy > 0) ? hero.vy - hero.speed : hero.vy;
						hero.animation.walk = true;
					}
				}

			return hero;
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

		octocat: function (_) {
			let octocat = game.create.enemy (_);

			return octocat;
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
						timer.time = window.time;
						timer.action ();
					}
				}

			return timer;
		},

		unit: function (_) {
			let unit = game.create.sprite (_);
			unit.action = _.action || function () {};
			unit.animation = _.animation || {};
			unit.barcolor = _.barcolor || '#f00';
			unit.box = _.box || { h: canvas.height, w: canvas.width, x: 0, y: 0 };
			unit.g = _.g;
			unit.h = _.h || 50;
			unit.hp = _.hp || [1, 1];
			unit.phys = _.phys;
			unit.speed = _.speed || 1;
			unit.type = 'unit';
			unit.vx = _.vx || unit.x;
			unit.vy = _.vy || unit.y;
			unit.w = _.w || 50;

			unit.bar = function () {
				if (unit.hp[0] <= 0) {
					if (game.object[unit.id + 'bar']) {
						delete game.object[unit.id + 'bar'];
					}
				} else {
					if (unit.hp[0] < unit.hp[1]) {
						if (!game.object[unit.id + 'bar']) {
							game.create.box ({
								fill: unit.barcolor,
								h: 5,
								id: unit.id + 'bar',
								w: unit.hp[0],
								x: unit.x,
								y: unit.y - 10,
								z: unit.z
							}).load ();
						} else {
							game.object[unit.id + 'bar'].w = unit.hp[0] * 2;
							game.object[unit.id + 'bar'].x = unit.x;
							game.object[unit.id + 'bar'].y = unit.y - 10;
						}
					}
				}
			}

			unit.blocked = function () {
				for (let id in game.object) {
					if (game.object[id].type == 'block') {
						let phys = unit.phys || unit;
							phys.x = unit.x + 0.5 * (unit.w - phys.w);
							phys.y = unit.y + 0.5 * (unit.h - unit.h);
						if (game.get.binbox (phys, game.object[id])) { return true; }
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
						unit.animation.walk = true;
						unit.move (v.x, v.y);
					} else {
						unit.x = x;
						unit.y = y;
						unit.vx = x;
						unit.vy = y;
						unit.animation.walk = false;
					}

				} else {
					unit.animation.walk = false;
				}
			}

			unit.tick = function () {
				unit.use ();
				unit.vector ();
				unit.go ();
			}

			unit.use = function () {}

			unit.vector = function () {}

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
		if (game.ost.src) {
			game.ost.pause ();
		}
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
