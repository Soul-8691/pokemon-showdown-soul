/**
 * Gen 3 moves
 */

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	absorb: {
		inherit: true,
		pp: 20,
	},
	acid: {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
	},
	ancientpower: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	assist: {
		inherit: true,
		flags: { metronome: 1, noassist: 1, nosleeptalk: 1 },
	},
	astonish: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (target.volatiles['minimize']) return 60;
			return 30;
		},
	},
	beatup: {
		inherit: true,
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('beatup');
			move.type = '???';
			move.category = 'Special';
			move.allies = pokemon.side.pokemon.filter(ally => !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
		condition: {
			duration: 1,
			onModifySpAPriority: -101,
			onModifySpA(atk, pokemon, defender, move) {
				// https://www.smogon.com/forums/posts/8992145/
				// this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
				this.event.modifier = 1;
				return this.dex.species.get(move.allies!.shift()!.set.species).baseStats.atk;
			},
			onFoeModifySpDPriority: -101,
			onFoeModifySpD(def, pokemon) {
				this.event.modifier = 1;
				return this.dex.species.get(pokemon.set.species).baseStats.def;
			},
		},
	},
	bide: {
		inherit: true,
		accuracy: 100,
		priority: 0,
		condition: {
			duration: 3,
			onLockMove: 'bide',
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: Bide');
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectState.totalDamage += damage;
				this.effectState.lastDamageSource = source;
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectState.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					target = this.effectState.lastDamageSource;
					if (!target) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						target = possibleTarget;
					}
					const moveData = {
						id: 'bide' as ID,
						name: "Bide",
						accuracy: 100,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 0,
						flags: { contact: 1, protect: 1 },
						effectType: 'Move',
						type: 'Normal',
					} as unknown as ActiveMove;
					this.actions.tryMoveHit(target, pokemon, moveData);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove() { },
	},
	brickbreak: {
		inherit: true,
		onTryHit(target, source) {
			// will shatter screens through sub, before you hit
			const foe = source.side.foe;
			foe.removeSideCondition('reflect');
			foe.removeSideCondition('lightscreen');
		},
	},
	charge: {
		inherit: true,
		boosts: null,
	},
	conversion: {
		inherit: true,
		onHit(target) {
			const possibleTypes = target.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'curse' && !target.hasType(move.type)) {
					return move.type;
				}
				return '';
			}).filter(type => type);
			if (!possibleTypes.length) {
				return false;
			}
			const type = this.sample(possibleTypes);

			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
	},
	counter: {
		inherit: true,
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, effect) {
				if (
					effect.effectType === 'Move' && !source.isAlly(target) &&
					(effect.category === 'Physical' || effect.id === 'hiddenpower')
				) {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
	},
	covet: {
		inherit: true,
		flags: { protect: 1, mirror: 1, noassist: 1 },
	},
	crunch: {
		inherit: true,
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
	},
	dig: {
		inherit: true,
		basePower: 60,
	},
	disable: {
		inherit: true,
		accuracy: 55,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'disable',
		condition: {
			durationCallback() {
				return this.random(2, 6);
			},
			noCopy: true,
			onStart(pokemon) {
				if (!this.queue.willMove(pokemon)) {
					this.effectState.duration!++;
				}
				if (!pokemon.lastMove) {
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === pokemon.lastMove.id) {
						if (!moveSlot.pp) {
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moveSlot.move);
							this.effectState.move = pokemon.lastMove.id;
							return;
						}
					}
				}
				return false;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Disable');
			},
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectState.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	dive: {
		inherit: true,
		basePower: 60,
	},
	doomdesire: {
		inherit: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			const moveData = {
				name: "Doom Desire",
				basePower: 120,
				category: "Physical",
				flags: { metronome: 1, futuremove: 1 },
				willCrit: false,
				type: '???',
			} as unknown as ActiveMove;
			const damage = this.actions.getDamage(source, target, moveData, true);
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 3,
				move: 'doomdesire',
				source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 85,
					basePower: 0,
					damage,
					category: "Physical",
					flags: { metronome: 1, futuremove: 1 },
					effectType: 'Move',
					type: '???',
				},
			});
			this.add('-start', source, 'Doom Desire');
			return null;
		},
	},
	encore: {
		inherit: true,
		volatileStatus: 'encore',
		condition: {
			durationCallback() {
				return this.random(3, 7);
			},
			onStart(target, source) {
				const moveSlot = target.lastMove ? target.getMoveData(target.lastMove.id) : null;
				if (!target.lastMove || target.lastMove.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = target.lastMove.id;
				this.add('-start', target, 'Encore');
			},
			onOverrideAction(pokemon) {
				return this.effectState.move;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 14,
			onResidual(target) {
				const moveSlot = target.getMoveData(this.effectState.move);
				if (moveSlot && moveSlot.pp <= 0) {
					// early termination if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	extrasensory: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (target.volatiles['minimize']) return 160;
			return 80;
		},
	},
	fakeout: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	feintattack: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	flail: {
		inherit: true,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 5) {
				bp = 150;
			} else if (ratio < 10) {
				bp = 100;
			} else if (ratio < 17) {
				bp = 80;
			} else if (ratio < 33) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	flash: {
		inherit: true,
		accuracy: 70,
	},
	fly: {
		inherit: true,
		basePower: 70,
	},
	followme: {
		inherit: true,
		volatileStatus: undefined,
		slotCondition: 'followme',
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-singleturn', target, 'move: Follow Me');
				this.effectState.slot = target.getSlot();
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				const userSlot = this.getAtSlot(this.effectState.slot);
				if (this.validTarget(userSlot, source, move.target)) {
					return userSlot;
				}
			},
		},
	},
	foresight: {
		inherit: true,
		accuracy: 100,
	},
	furycutter: {
		inherit: true,
		onHit(target, source) {
			source.addVolatile('furycutter');
		},
	},
	gigadrain: {
		inherit: true,
		pp: 5,
	},
	glare: {
		inherit: true,
		ignoreImmunity: false,
	},
	haze: {
		inherit: true,
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
	},
	hiddenpower: {
		inherit: true,
		category: "Physical",
		onModifyMove(move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
			const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
			move.category = specialTypes.includes(move.type) ? 'Special' : 'Physical';
		},
	},
	highjumpkick: {
		inherit: true,
		basePower: 85,
		onMoveFail(target, source, move) {
			if (target.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(source, target, move, true);
				if (typeof damage !== 'number') throw new Error("HJK recoil failed");
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, move);
			}
		},
	},
	hypnosis: {
		inherit: true,
		accuracy: 60,
	},
	jumpkick: {
		inherit: true,
		basePower: 70,
		onMoveFail(target, source, move) {
			if (target.runImmunity('Fighting')) {
				const damage = this.actions.getDamage(source, target, move, true);
				if (typeof damage !== 'number') throw new Error("Jump Kick didn't recoil");
				this.damage(this.clampIntRange(damage / 2, 1, Math.floor(target.maxhp / 2)), source, source, move);
			}
		},
	},
	leafblade: {
		inherit: true,
		basePower: 70,
	},
	lockon: {
		inherit: true,
		accuracy: 100,
	},
	megadrain: {
		inherit: true,
		pp: 10,
	},
	memento: {
		inherit: true,
		accuracy: true,
	},
	mindreader: {
		inherit: true,
		accuracy: 100,
	},
	mimic: {
		inherit: true,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1, failmimic: 1 },
	},
	mirrorcoat: {
		inherit: true,
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, effect) {
				if (
					effect.effectType === 'Move' && !source.isAlly(target) &&
					effect.category === 'Special' && effect.id !== 'hiddenpower'
				) {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
	},
	mirrormove: {
		inherit: true,
		flags: { metronome: 1, failencore: 1, nosleeptalk: 1, noassist: 1 },
		onTryHit() { },
		onHit(pokemon) {
			const noMirror = [
				'assist', 'curse', 'doomdesire', 'focuspunch', 'futuresight', 'magiccoat', 'metronome', 'mimic', 'mirrormove', 'naturepower', 'psychup', 'roleplay', 'sketch', 'sleeptalk', 'spikes', 'spitup', 'taunt', 'teeterdance', 'transform',
			];
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.source.lastMove || !lastAttackedBy.move) {
				return false;
			}
			if (noMirror.includes(lastAttackedBy.move) || !lastAttackedBy.source.hasMove(lastAttackedBy.move)) {
				return false;
			}
			this.actions.useMove(lastAttackedBy.move, pokemon);
		},
		target: "self",
	},
	naturepower: {
		inherit: true,
		accuracy: 95,
		onHit(target) {
			this.actions.useMove('swift', target);
		},
	},
	needlearm: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (target.volatiles['minimize']) return 120;
			return 60;
		},
	},
	nightmare: {
		inherit: true,
		accuracy: true,
	},
	odorsleuth: {
		inherit: true,
		accuracy: 100,
	},
	outrage: {
		inherit: true,
		basePower: 90,
	},
	overheat: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	petaldance: {
		inherit: true,
		basePower: 70,
	},
	recover: {
		inherit: true,
		pp: 20,
	},
	reversal: {
		inherit: true,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 5) {
				bp = 150;
			} else if (ratio < 10) {
				bp = 100;
			} else if (ratio < 17) {
				bp = 80;
			} else if (ratio < 33) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	rocksmash: {
		inherit: true,
		basePower: 20,
	},
	sketch: {
		inherit: true,
		flags: { bypasssub: 1, failencore: 1, noassist: 1, failmimic: 1, nosketch: 1 },
	},
	sleeptalk: {
		inherit: true,
		onHit(pokemon) {
			const moves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				const pp = moveSlot.pp;
				const move = this.dex.moves.get(moveid);
				if (moveid && !move.flags['nosleeptalk'] && !move.flags['charge']) {
					moves.push({ move: moveid, pp });
				}
			}
			if (!moves.length) {
				return false;
			}
			const randomMove = this.sample(moves);
			if (!randomMove.pp) {
				this.add('cant', pokemon, 'nopp', randomMove.move);
				return;
			}
			this.actions.useMove(randomMove.move, pokemon);
		},
	},
	spite: {
		inherit: true,
		onHit(target) {
			const roll = this.random(2, 6);
			if (target.lastMove && target.deductPP(target.lastMove.id, roll)) {
				this.add("-activate", target, 'move: Spite', target.lastMove.id, roll);
				return;
			}
			return false;
		},
	},
	stockpile: {
		inherit: true,
		pp: 10,
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
			},
			onEnd(target) {
				this.effectState.layers = 0;
				this.add('-end', target, 'Stockpile');
			},
		},
	},
	struggle: {
		inherit: true,
		flags: { contact: 1, protect: 1, noassist: 1, failencore: 1, failmimic: 1, nosketch: 1 },
		accuracy: 100,
		recoil: [1, 4],
		struggleRecoil: false,
	},
	surf: {
		inherit: true,
		target: "allAdjacentFoes",
	},
	taunt: {
		inherit: true,
		flags: { protect: 1, bypasssub: 1, metronome: 1 },
		condition: {
			duration: 2,
			onStart(target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt', '[silent]');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.move).category === 'Status') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMove(attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
	},
	teeterdance: {
		inherit: true,
		flags: { protect: 1, metronome: 1 },
	},
	tickle: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	uproar: {
		inherit: true,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Uproar');
				// 2-5 turns
				this.effectState.duration = this.random(2, 6);
			},
			onResidual(target) {
				if (target.volatiles['throatchop']) {
					target.removeVolatile('uproar');
					return;
				}
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['uproar'];
				}
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 11,
			onEnd(target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectState.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
		},
	},
	vinewhip: {
		inherit: true,
		pp: 10,
	},
	volttackle: {
		inherit: true,
		secondary: null,
	},
	waterfall: {
		inherit: true,
		secondary: null,
	},
	weatherball: {
		inherit: true,
		onModifyMove(move) {
			switch (this.field.effectiveWeather()) {
			case 'sunnyday':
				move.type = 'Fire';
				move.category = 'Special';
				break;
			case 'raindance':
				move.type = 'Water';
				move.category = 'Special';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
				move.type = 'Ice';
				move.category = 'Special';
				break;
			}
			if (this.field.effectiveWeather()) move.basePower *= 2;
		},
	},
	zapcannon: {
		inherit: true,
		basePower: 100,
	},
	roost: {
		num: -1,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Roost",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		self: {
			volatileStatus: 'roost',
		},
		condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(target) {
				if (target.terastallized) {
					if (target.hasType('Flying')) {
						this.add('-hint', "If a Terastallized Pokemon uses Roost, it remains Flying-type.");
					}
					return false;
				}
				this.add('-singleturn', target, 'move: Roost');
			},
			onTypePriority: -1,
			onType(types, pokemon) {
				this.effectState.typeWas = types;
				return types.filter(type => type !== 'Flying');
			},
		},
		secondary: null,
		target: "self",
		type: "Flying",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
		gen: 3,
	},
	earthpower: {
		num: -2,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Earth Power",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Beautiful",
		gen: 3,
	},
	suckerpunch: {
		num: -3,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Sucker Punch",
		pp: 5,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
		gen: 3,
	},
	focusblast: {
		num: -4,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		name: "Focus Blast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
		gen: 3,
	},
	shadowsneak: {
		num: -5,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Shadow Sneak",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
		gen: 3,
	},
	bravebird: {
		num: -6,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
		gen: 3,
	},
	stickyweb: {
		num: -7,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sticky Web",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1 },
		sideCondition: 'stickyweb',
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Bug",
		zMove: { boost: { spe: 1 } },
		contestType: "Tough",
		gen: 3,
	},
	drainpunch: {
		num: -8,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Drain Punch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
		gen: 3,
	},
	mysticalfire: {
		num: -9,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Mystical Fire",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
		gen: 3,
	},
	dragonpulse: {
		num: -10,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: null,
		target: "any",
		type: "Dragon",
		contestType: "Beautiful",
		gen: 3,
	},
	bulletpunch: {
		num: -11,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Bullet Punch",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Tough",
		gen: 3,
	},
	freezedry: {
		num: -12,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Freeze-Dry",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
		gen: 3,
	},
	aquajet: {
		num: -13,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Aqua Jet",
		pp: 20,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
		gen: 3,
	},
	shadowclaw: {
		num: -14,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Shadow Claw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
		gen: 3,
	},
	partingshot: {
		num: -15,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Parting Shot",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			const success = this.boost({ atk: -1, spa: -1 }, target, source);
			if (!success && !target.hasAbility('mirrorarmor')) {
				delete move.selfSwitch;
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { effect: 'healreplacement' },
		contestType: "Cool",
		gen: 3,
	},
	iceshard: {
		num: -16,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Ice Shard",
		pp: 30,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
		gen: 3,
	},
	airslash: {
		num: -17,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		name: "Air Slash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
		gen: 3,
	},
	bugbuzz: {
		num: -18,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Bug Buzz",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
		gen: 3,
	},
	aurasphere: {
		num: -19,
		accuracy: true,
		basePower: 80,
		category: "Special",
		name: "Aura Sphere",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, bullet: 1, pulse: 1 },
		secondary: null,
		target: "any",
		type: "Fighting",
		contestType: "Beautiful",
		gen: 3,
	},
	quiverdance: {
		num: -20,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Quiver Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
		gen: 3,
	},
	heavyslam: {
		num: -21,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if (pokemonWeight >= targetWeight * 5) {
				bp = 120;
			} else if (pokemonWeight >= targetWeight * 4) {
				bp = 100;
			} else if (pokemonWeight >= targetWeight * 3) {
				bp = 80;
			} else if (pokemonWeight >= targetWeight * 2) {
				bp = 60;
			} else {
				bp = 40;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Heavy Slam",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
		gen: 3,
	},
	highhorsepower: {
		num: -22,
		accuracy: 95,
		basePower: 95,
		category: "Physical",
		name: "High Horsepower",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
		gen: 3,
	},
	tailwind: {
		num: -23,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Tailwind",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1, wind: 1 },
		sideCondition: 'tailwind',
		condition: {
			duration: 4,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
					return 6;
				}
				return 4;
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
				} else {
					this.add('-sidestart', side, 'move: Tailwind');
				}
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(2);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 5,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Flying",
		zMove: { effect: 'crit2' },
		contestType: "Cool",
		gen: 3,
	},
	gunkshot: {
		num: -24,
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		name: "Gunk Shot",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
		gen: 3,
	},
};
