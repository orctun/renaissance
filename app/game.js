game.scene.load = function () { game.scene.menu (); }

game.scene.begin = function () {
	game.wipe ();
	game.create.block ({ h: 200, i: game.i.borderblue, repeat: true, w: 10, x: 100, y: 0, z: 1}).load ();
	game.create.block ({ h: 10, i: game.i.borderblue, repeat: true, w: 200, x: 0, y: 300, z: 1}).load ();
	game.create.block ({ h: 10, i: game.i.borderblue, repeat: true, w: 500, x: 0, y: 490, z: 1}).load ();
	game.create.block ({ h: 490, i: game.i.borderblue, repeat: true, w: 10, x: 490, y: 0, z: 1}).load ();
	game.create.gate ({ action: function () { game.play ({ name: 'win' }); game.scene.intro (); }, h: 100, i: game.i.gateborderblue, repeat: true, w: 100, x: 350, y: 50, z: 1}).load ();
	game.create.sprite ({ h: 500, i: game.i.black, w: 500, x: 0, y: 0}).load ();
	game.create.text ({ align: 'center', color: '#fff', font: 'monospace', size: 15,  text: 'Войди в жёлтую зону, чтобы перейти на новый уровень', x: 640, y: 690 }).load ();

	let hero = game.create.unit ({ h: 50, i: game.i.men, speed: 7, w: 35, x: 10, y: 10, z: 1});
		hero.load ();
	game.create.animation ({ a: game.a.men_go, delay: 150, get stop () { return !hero.animation.walk; }, h: 50, i: game.i.men, link: hero, sound: { delay: 400, name: 'step', volume: 0.5 }, x: 10, y: 10, w: 35, z: 1 }).load ();
}

game.scene.intro = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.intro2 (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
		text: 'Люди победили смерть и научислись воскрешать себя благодаря Частице Бога,', x: 640, y: 340 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
			text: 'обнаруженной в ходе экспериментов с адронным коллайдером.', x: 640, y: 380 }).load ();
}

game.scene.intro2 = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.intro3 (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
		text: 'Возрождение коснулось всех живых существ планеты,', x: 640, y: 340 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
			text: 'что поставило её на грань уничтожения.', x: 640, y: 380 }).load ();
}

game.scene.intro3 = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.intro4 (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
		text: 'После череды мировых войн за ресурсы стало ясно, что война бесполезна.', x: 640, y: 320 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
			text: 'Человечество было вынуждено принять жестокие законы,', x: 640, y: 360 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
			text: 'запрещающие размножение и разведение животных и растений.', x: 640, y: 400 }).load ();
}

game.scene.intro4 = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.begin (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
		text: 'Преступившие закон и лишняя биомасса отправлялась в лунные колонии.', x: 640, y: 320 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
			text: 'Восстание луниан 2055 года и отказ принимать корабли землян', x: 640, y: 360 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'monospace', size: 25,
			text: 'стали причиной войны между Землёй и Луной. Космос забирал всех.', x: 640, y: 400 }).load ();
}

game.scene.menu = function () {
	game.wipe ();
	game.play ({ name: 'main', ost: true, volume: 0.5 });
	game.create.button ({ action: function () { game.play ({ name: 'bom' }); game.scene.intro (); }, h: 24, i: game.i.start, in: function () { game.ost.volume = 1; }, out: function () { game.ost.volume = 0.5; }, w: 106, x: 574, y: 343, z: 1 }).load ();

	let x0 = 635;
	let y0 = 355;
	game.create.timer ({ action: function () {
		if (Object.keys (game.object).length < 1000) {
			let x = game.get.r (0, canvas.width, true);
			let y = game.get.r (0, canvas.height, true);
			game.create.box ({ fill: game.get.r ('color'), h: 1, x: x, y: y, w: 1 }).load ();
		}
	} }).load ();
}
