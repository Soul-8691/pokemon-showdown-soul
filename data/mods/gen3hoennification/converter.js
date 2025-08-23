const Dex = require('@pkmn/dex').Dex;
const Generations = require('@pkmn/data').Generations;
const gens = new Generations(Dex);
const PokedexGen3 = require('./pokedex_gen3.js');
const Pokedex = require('./pokedex.js');
var MonList = [
	"altariamega",
	"ampharosmega",
	"annihilape",
	"cresselia",
	"decidueye",
	"dhelmise",
	"electivire",
	"emboar",
	"empoleon",
	"froslass",
	"glaliemega",
	"gliscor",
	"guzzlord",
	"gyaradosmega",
	"heracrossmega",
	"houndoommega",
	"hydreigon",
	"ironthorns",
	"irontreads",
	"kangaskhanmega",
	"luxray",
	"magmortar",
	"magnezone",
	"mamoswine",
	"ninetalesalola",
	"pidgeotmega",
	"ragingbolt",
	"regidrago",
	"rotomfrost",
	"rotomheat",
	"rotommow",
	"rotomwash",
	"sandyshocks",
	"sharpedomega",
	"steelixmega",
	"tangrowth",
	"tapufini",
	"tinglu",
	"togekiss",
	"tyrantrum",
	"ursalunabloodmoon",
	"victini",
	"weezinggalar",
	"wochien",
	"zapdosgalar",	
]
function print(message) {
	return console.log(message);
}
for (const mon in PokedexGen3) {
	MonList.push(mon);
}
MonList.sort();
var PokedexPrint = 'export const Pokedex: {[speciesid: string]: ModdedSpeciesData} = {\n'
for (const mon of MonList) {
	PokedexPrint += mon + ': ' + JSON.stringify(Pokedex[mon], null, '\t') + ',\n';
}
print(PokedexPrint);