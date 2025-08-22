// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

export const Formats: import('../sim/dex-formats').FormatList = [

	{
		section: "Formats",
	},
	{
		name: "[Gen 3] ADV+",
		mod: 'gen3advplus',
		ruleset: ['Standard', 'Baton Pass Mod', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken'],
	},
    {
		name: "[Gen 3] ADV+ - BP",
		mod: 'gen3advplus',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken'],
	},
    {
		name: "[Gen 3] ADV+ - No BP",
		mod: 'gen3advplus',
		ruleset: ['Standard', 'Baton Pass Mod', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken'],
	},
	{
		name: "[Gen 3] Hoennification OU",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod', 'Baton Pass Mod'],
		banlist: ['Uber', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Starf Berry', 'Speed Boost + Blaziken', 'Drizzle', 'Drought'],
	},
	{
		name: "[Gen 3] Hoennification OU - BP",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Starf Berry', 'Speed Boost + Blaziken', 'Drizzle', 'Drought'],
	},
	{
		name: "[Gen 3] Hoennification OU - No BP",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Soundproof', 'Assist', 'Baton Pass', 'Smeargle + Ingrain', 'Starf Berry', 'Speed Boost + Blaziken', 'Drizzle', 'Drought'],
	},
	{
		name: "[Gen 3] Hoennification Ubers",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'Deoxys Camouflage Clause', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod', 'Baton Pass Mod'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] Hoennification Ubers - BP",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'Deoxys Camouflage Clause', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] Hoennification Ubers - No BP",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'Deoxys Camouflage Clause', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Baton Pass', 'Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] OU Frantic Fusions (Old Version)",
		mod: 'gen3',
		ruleset: ['Standard', '!Nickname Clause', '!Obtainable Abilities', 'Ability Clause = 2', 'Sleep Moves Clause', 'Frantic Fusions Mod', 'Terastal Clause', 'Baton Pass Mod', 'One Boost Passer Clause', 'Data Mod', 'Freeze Clause Mod'],
		banlist: [
			'Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Arena Trap',
		],
		onValidateTeam(team) {
			const nameTable: {[k: string]: boolean} = {};
			for (const {name} of team) {
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		checkCanLearn(move, template, lsetData, set) {
			if (move.id === 'snore') return null;
			if (set?.fuseTemplate && !this.checkCanLearn(move, set.fuseTemplate)) return null;
			return this.checkCanLearn(move, template, lsetData, set);
		},
		validateSet(set, teamHas) {
			const fuseTemplate = this.dex.species.get(set.name);
			if (!fuseTemplate.exists) return this.validateSet(set, teamHas);
			const fuseSet = {...set};
			fuseSet.species = fuseTemplate.name;
			fuseSet.item = '';
			fuseSet.ability = fuseTemplate.abilities['0'];
			fuseSet.moves = ['snore'];
			let problems = this.validateSet(fuseSet);
			if (problems) {
				fuseSet.shiny = !fuseSet.shiny;
				problems = this.validateSet(fuseSet);
			}
			if (problems) return problems;
			set.name = '';
			set.fuseTemplate = fuseTemplate;
			set.shiny = !set.shiny;
			problems = this.validateSet(set);
			if (!problems) this.validateSet(set, teamHas);
			set.shiny = !set.shiny;
			if (problems) problems = this.validateSet(set, teamHas);
			set.name = fuseTemplate.name;
			return problems;
		},
		onModifySpecies(template, target, format, effect) {
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			if (target.set.name === (template.battleOnly ? template.baseSpecies : template.name)) return;
			const fuseTemplate = this.dex.species.get(target.set.name);
			if (!fuseTemplate.exists) return;
			const mixedTemplate = this.dex.deepClone(template);
			mixedTemplate.heightm = Math.round((template.heightm + fuseTemplate.heightm) * 5) / 10;
			mixedTemplate.weighthg = Math.round((template.weighthg + fuseTemplate.weighthg) / 2);
			let statid: StatID;
			for (statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = template.baseStats[statid] + fuseTemplate.baseStats[statid] >> 1;
			}
			mixedTemplate.bst = mixedTemplate.baseStats.hp + mixedTemplate.baseStats.atk + mixedTemplate.baseStats.def + mixedTemplate.baseStats.spa + mixedTemplate.baseStats.spd + mixedTemplate.baseStats.spe;

			mixedTemplate.types = [template.types[0]];
			const fuseType = target.set.shiny && fuseTemplate.types[1] || fuseTemplate.types[0];
			if (fuseType !== template.types[0]) mixedTemplate.types.push(fuseType);
			const ability = target.set.ability || Object.keys(template.abilities).length > 1 ? target.set.ability : template.abilities[0];
			if (fuseTemplate.abilities[0] !== ability) mixedTemplate.innate = this.toID(fuseTemplate.abilities[0]);
			return mixedTemplate;
		},
		onBegin() {
			const allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (const pokemon of allPokemon) {
				pokemon.m.innate = pokemon.species.innate;
			}
		},
		onBeforeSwitchIn(pokemon) {
			if (pokemon.m.innate) {
				const effect = 'ability:' + pokemon.m.innate;
				pokemon.volatiles[effect] = {id: effect, target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.m.innate) {
				const effect = 'ability:' + pokemon.m.innate;
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) pokemon.removeVolatile('ability:' + pokemon.m.innate);
		},
	},
	{
		name: "[Gen 3] OU Random Sample Teams",
		team: 'random',
		mod: 'gen3sampleteamrandbats',
		ruleset: ['Standard', 'Freeze Clause Mod'],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				var side = pokemon.side;
				this.hint(side.team[0].sampleTeamName, true, pokemon.side);
			}
		},
	},
	{
		name: "[Gen 3] Tradebacks",
		mod: 'gen3tradebacks',
		ruleset: ['Standard', /*'Baton Pass Mod',*/ 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain'],
	},
	{
		name: "[Gen 3] Tradebacks - BP Mod",
		mod: 'gen3tradebacks',
		ruleset: ['Standard', 'Baton Pass Mod', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain'],
	},
	{
		name: "[Gen 3] Tradebacks - No BP",
		mod: 'gen3tradebacks',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass', 'Smeargle + Ingrain'],
	},
];
