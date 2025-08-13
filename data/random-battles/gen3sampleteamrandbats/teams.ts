/* eslint max-len: ["error", 240] */

import RandomGen4Teams from '../gen4/teams';
import { Teams } from '@pkmn/sets';

const sampleTeamsData = Teams.importTeams(
	`
=== [gen3ou] (2016-2018) Starmie TSS (Beerlover) by UD ===

Skarmory (F) @ Leftovers  
Ability: Keen Eye  
EVs: 252 HP / 8 Def / 248 SpD  
Careful Nature  
IVs: 0 Atk  
- Spikes  
- Protect  
- Roar  
- Toxic  

Blissey @ Leftovers  
Ability: Natural Cure  
Shiny: Yes  
EVs: 252 Def / 252 SpA / 4 Spe  
Modest Nature  
IVs: 0 Atk  
- Soft-Boiled  
- Ice Beam  
- Toxic  
- Fire Blast  

Tyranitar (F) @ Leftovers  
Ability: Sand Stream  
EVs: 248 HP / 196 Atk / 12 Def / 52 SpD  
Adamant Nature  
- Focus Punch  
- Rock Slide  
- Hidden Power [Bug]  
- Earthquake  

Swampert (F) @ Leftovers  
Ability: Torrent  
EVs: 240 HP / 136 Def / 40 SpA / 48 SpD / 44 Spe  
Relaxed Nature  
- Earthquake  
- Ice Beam  
- Hydro Pump  
- Protect  

Gengar (F) @ Leftovers  
Ability: Levitate  
EVs: 168 HP / 164 SpD / 176 Spe  
Timid Nature  
- Will-O-Wisp  
- Thunderbolt  
- Ice Punch  
- Explosion  

Starmie @ Leftovers  
Ability: Natural Cure  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Hydro Pump  
- Ice Beam  
- Thunderbolt  
- Rapid Spin  


=== [gen3ou] (2023-2024) Special Wall-less TSS (El clasico) by Hclat ===

Tyranitar @ Leftovers  
Ability: Sand Stream  
EVs: 252 HP / 80 Atk / 176 Spe  
Adamant Nature  
IVs: 30 SpD / 30 Spe  
- Dragon Dance  
- Hidden Power [Bug]  
- Earthquake  
- Rock Slide  

Skarmory @ Leftovers  
Ability: Keen Eye  
EVs: 248 HP / 244 SpD / 16 Spe  
Careful Nature  
- Spikes  
- Drill Peck  
- Protect  
- Roar  

Swampert @ Leftovers  
Ability: Torrent  
EVs: 252 HP / 168 Def / 88 SpD  
Bold Nature  
IVs: 0 Atk  
- Protect  
- Surf  
- Toxic  
- Refresh  

Gengar @ Leftovers  
Ability: Levitate  
EVs: 80 HP / 16 SpA / 236 SpD / 176 Spe  
Modest Nature  
IVs: 0 Atk  
- Taunt  
- Will-O-Wisp  
- Giga Drain  
- Thunderbolt  

Zapdos @ Leftovers  
Ability: Pressure  
EVs: 252 HP / 60 SpA / 196 Spe  
Modest Nature  
IVs: 2 Atk / 30 Def  
- Thunderbolt  
- Protect  
- Hidden Power [Ice]  
- Toxic  

Aerodactyl @ Choice Band  
Ability: Rock Head  
EVs: 224 Atk / 32 SpD / 252 Spe  
Jolly Nature  
- Earthquake  
- Rock Slide  
- Double-Edge  
- Hidden Power [Bug]  



	`
, undefined, false);

function randomIntFromInterval(max) {
	return Math.floor(Math.random() * (max));
}

export class RandomGen3Teams extends RandomGen4Teams {
	randomTeam() {
		const selectedTeam = sampleTeamsData[randomIntFromInterval(sampleTeamsData.length)];
		const members = [];
		for (const member of selectedTeam.team) {
			members.push({
				...member,
				name: member['species'],
				level: 100,
				shiny: this.randomChance(1, 8192),
				sampleTeamName: selectedTeam.name,
			});
		}
		return members;
	}
}

export default RandomGen3Teams;
