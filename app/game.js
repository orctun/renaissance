game.scene.load = function () { game.scene.begin1 (); }

game.scene.begin = function () {
	game.wipe ();

	game.create.sprite ({ h: 500, i: game.i.black, w: 640, x: 0, y: 0}).load ();
	game.create.sprite ({ h: 500, i: game.i.black, w: 640, x: 640, y: 0}).load ();

	game.create.sprite ({ h: 30, i: game.i.black, w: 1000, x: 140, y: 670}).load ();

	//left
	game.create.block ({ h: 10, i: game.i.blue, w: 520, x: 110, y: 360, z: 1}).load ();
	game.create.block ({ h: 290, i: game.i.blue, w: 10, x: 240, y: 70, z: 1}).load ();
	game.create.block ({ h: 10, i: game.i.blue, w: 250, x: 250, y: 100, z: 1}).load ();

	game.create.block ({ h: 200, i: game.i.blue, w: 10, x: 110, y: 70, z: 1}).load ();

	game.create.block ({ h: 10, i: game.i.blue, w: 640, x: 0, y: 490, z: 1}).load ();
	game.create.block ({ h: 390, i: game.i.blue, w: 10, x: 630, y: 0, z: 1}).load ();

	//right
	game.create.block ({ h: 200, i: game.i.blue, w: 10, x: 740, y: 0, z: 1}).load ();
	game.create.block ({ h: 200, i: game.i.blue, w: 10, x: 840, y: 100, z: 1}).load ();
	game.create.block ({ h: 200, i: game.i.blue, w: 10, x: 940, y: 0, z: 1}).load ();
	game.create.block ({ h: 200, i: game.i.blue, w: 10, x: 1040, y: 100, z: 1}).load ();
	game.create.block ({ h: 10, i: game.i.blue, w: 410, x: 640, y: 300, z: 1}).load ();
	game.create.block ({ h: 10, i: game.i.blue, w: 640, x: 640, y: 490, z: 1}).load ();

	//mid gate
	game.create.block ({ h: 100, i: game.i.borderblue, id: 'wall', repeat: true, w: 10, x: 630, y: 390, z: 1}).load ();

	//exit gate
	game.create.block ({ h: 10, i: game.i.borderblue, id: 'wallexit', repeat: true, w: 100, x: 640, y: 50, z: 1}).load ();

	game.create.text ({ align: 'center', color: '#fff', font: 'Arial', id: 'tip_move', size: 25,  text: '[Обучение] Используя W, A, S, D вы без труда найдёте выход из любой передряги', x: 640, y: 670, z: 1 }).load ();

	//yellow trigger
	let tip_move_action = game.create.text ({ align: 'center', color: '#ff0', font: 'Arial', id: 'tip_move_action', size: 25,  text: '[Обучение] Часто нужно просто подойти, чтобы что-то активировать', x: 640, y: 670, z: 1 });

	game.create.gate ({ action: function () { game.play ({ name: 'open' }); delete game.object.wall, delete game.object.tip_move; tip_move_action.load (); delete game.object.gate; game.draw (true); }, h: 100, i: game.i.gateborderblue, id: 'gate', repeat: true, w: 50, x: 580, y: 390, z: 1}).load ();

	//exit
	game.create.gate ({ action: function () { game.play ({ name: 'open' }); game.scene.begin1 (); }, h: 25, i: game.i.up, w: 25, x: 680, y: 10, z: 1}).load ();

	//hero
	let hero = game.create.unit ({ h: 50, i: game.i.men, phys: { h: 50, w: 20 }, speed: 7, w: 35, x: 414, y: 300, z: 1});
		hero.load ();
	game.create.animation ({ a: game.a.men_go, delay: 150, get stop () { return !hero.animation.walk; }, h: 50, i: game.i.men, link: hero, sound: { delay: 400, name: 'step', volume: 0.5 }, x: hero.x, y: hero.y, w: 35, z: 1 }).load ();

	//red trigger
	let tip_action = game.create.text ({ align: 'center', color: '#f00', font: 'Arial', id: 'tip_move_action', size: 25,  text: '[Обучение] Иногда потребуется нажать SPACE', x: 640, y: 670, z: 1 });

	game.create.gate ({
		action: function () {
			game.play ({ name: 'bom' });
			delete game.object.tip_move_action;
			tip_action.load ();
			game.draw (true);
			delete game.object.gatered;
			hero.action = function () {
				game.play ({ name: 'open' });
				delete game.object.wallexit;
				game.draw (true);
			}
		},
		h: 50,
		i: game.i.redzone,
		id: 'gatered',
		repeat: true,
		w: 80,
		x: 650,
		y: 200,
		z: 1
	}).load ();
}

game.scene.begin1 = function () {
	game.wipe ();

	game.create.sprite ({ h: 377, i: game.i.arena, w: 597, x: 340, y: 150}).load ();

	game.create.block ({ h: 84, i: game.i.roof, w: 731, x: 270, y: 65, z: 1}).load ();
	game.create.block ({ h: 391, i: game.i.pillar, w: 54, x: 295, y: 150, z: 2}).load ();
	game.create.block ({ h: 391, i: game.i.pillar, w: 54, x: 928, y: 150, z: 2}).load ();
	game.create.block ({ h: 98, i: game.i.tribune, w: 596, x: 340, y: 520, z: 1}).load ();

	game.create.text ({ align: 'center', color: '#fff', font: 'Arial', id: 'tip_move', size: 25,  text: '[Обучение] Прежде, чем завершить обучение, вы должны научиться постоять за себя', x: 640, y: 670, z: 1 }).load ();

	let hero = game.create.hero ({ h: 50, i: game.i.men, phys: { h: 50, w: 20 }, speed: 7, w: 35, x: 615, y: 335, z: 1});
		hero.load ();
	game.create.animation ({ a: game.a.men_go, delay: 150, get stop () { return !hero.animation.walk; }, h: 50, i: game.i.men, link: hero, sound: { delay: 400, name: 'step', volume: 0.5 }, x: hero.x, y: hero.y, w: 35, z: 1 }).load ();
}

game.scene.hospital = function () {
	game.wipe ();
	game.create.sprite ({ h: 185, i: game.i.lvl_hospital_exit, w: 102, x: 188, y: 0}).load ();

	game.create.block ({ h: 140, i: game.i.wall, repeat: true, w: 188, x: 0, y: 0, z: 1}).load ();
	game.create.sprite ({ h: 45, i: game.i.wall_green, repeat: true, w: 188, x: 0, y: 140}).load ();

	game.create.block ({ h: 140, i: game.i.wall, repeat: true, w: 990, x: 290, y: 0, z: 1}).load ();
	game.create.sprite ({ h: 45, i: game.i.wall_green, repeat: true, w: 990, x: 290, y: 140}).load ();

	game.create.gate ({ action: function () { game.play ({ name: 'open' }); game.scene.menu (); }, h: 90, i: game.i.black, w: 98, x: 190, y: 42, z: 1}).load ();

	let hero = game.create.unit ({ h: 50, i: game.i.men, speed: 7, w: 35, x: 500, y: 300, z: 1});
		hero.load ();
	game.create.animation ({ a: game.a.men_go, delay: 150, get stop () { return !hero.animation.walk; }, h: 50, i: game.i.men, link: hero, sound: { delay: 400, name: 'step', volume: 0.5 }, x: 500, y: 300, w: 35, z: 1 }).load ();
}

game.scene.intro = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.intro2 (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
		text: 'Люди победили смерть и научислись воскрешать себя благодаря Частице Бога,', x: 640, y: 340 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
			text: 'обнаруженной в ходе экспериментов с адронным коллайдером.', x: 640, y: 380 }).load ();
}

game.scene.intro2 = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.intro3 (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
		text: 'Возрождение коснулось всех живых существ планеты,', x: 640, y: 340 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
			text: 'что поставило её на грань уничтожения.', x: 640, y: 380 }).load ();
}

game.scene.intro3 = function () {
	game.wipe ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.intro4 (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
		text: 'После череды мировых войн за ресурсы стало ясно, что война бесполезна.', x: 640, y: 320 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
			text: 'Человечество было вынуждено принять жестокие законы,', x: 640, y: 360 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
			text: 'запрещающие размножение и разведение животных и растений.', x: 640, y: 400 }).load ();
}

game.scene.intro4 = function () {
	game.wipe ();
	game.create.sprite ({ h: 720, i: game.i.intro4, w: 1280, x: 0, y: 0}).load ();
	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.select (); }, h: 15, i: game.i.next, w: 25, x: 1080, y: 420 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
		text: 'Преступившие закон и лишняя биомасса отправлялась в лунные колонии.', x: 640, y: 320 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
			text: 'Восстание луниан 2055 года и отказ принимать корабли землян', x: 640, y: 360 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
			text: 'стали причиной войны между Землёй и Луной. Космос забирал всех.', x: 640, y: 400 }).load ();
}

game.scene.menu = function () {
	game.wipe ();
	game.play ({ name: 'main', ost: true, volume: 0.5 });

	game.create.sprite ({ h: 75, i: game.i.logo, w: 366, x: 445, y: 250}).load ();

	game.create.sprite ({ h: 24, i: game.i.black, w: 106, x: 574, y: 343}).load ();
	game.create.button ({ action: function () { game.play ({ name: 'bom' }); game.scene.intro (); }, h: 24, in: function () { game.ost.volume = 1; }, out: function () { game.ost.volume = 0.5; }, w: 106, x: 574, y: 343, z: 1 }).load ();
	game.create.animation ({ a: game.a.start, delay: 100, get stop () { }, h: 24, x: 574, y: 343, w: 106, z: 1 }).load ();

	let x0 = 635;
	let y0 = 355;
	game.create.timer ({ action: function () {
		if (Object.keys (game.object).length < 2000) {
			let x = game.get.r (0, canvas.width, true);
			let y = game.get.r (0, canvas.height, true);
			game.create.box ({ fill: game.get.r ('color'), h: 1, x: x, y: y, w: 1 }).load ();
		}
	} }).load ();
}

game.scene.select = function () {
	game.wipe ();

	game.create.button ({ action: function () { game.play ({ name: 'win' }); game.scene.begin (); }, h: 50, i: game.i.men, w: 35, x: 414, y: 300 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#0CC2FF', font: 'Arial', size: 20,
		text: 'Навибо - авантюрист с Земли', x: 414, y: 370 }).load ();

	game.create.button ({ action: function () { game.play ({ name: 'click' }); game.scene.select (); }, h: 50, i: game.i.girl, w: 35, x: 841, y: 300 }).load ();
	game.create.text ({ align: 'center', baseline: 'middle', color: '#FF93E6', font: 'Arial', size: 20,
		text: 'Гера - лунианский учёный [недоступно]', x: 841, y: 370 }).load ();

	game.create.text ({ align: 'center', baseline: 'middle', color: '#fff', font: 'Arial', size: 25,
		text: 'Выберите за кого хотите играть..', x: 640, y: 520 }).load ();
}
