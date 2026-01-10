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
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken', 'Soul Dew'],
	},
    {
		name: "[Gen 3] ADV+ - BP",
		mod: 'gen3advplus',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken', 'Jolteon + Calm Mind + Baton Pass', 'Soul Dew'],
	},
    {
		name: "[Gen 3] ADV+ - No BP",
		mod: 'gen3advplus',
		ruleset: ['Standard', 'Baton Pass Mod', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Data Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken', 'Soul Dew'],
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
		banlist: ['Uber', 'Jolteon + Calm Mind + Baton Pass', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Smeargle + Ingrain', 'Starf Berry', 'Speed Boost + Blaziken', 'Drizzle', 'Drought'],
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
		name: "[Gen 1] Kantoification OU",
		mod: 'gen1kantoification',
		ruleset: ['Standard'],
		banlist: ['Uber', 'Agility + Wrap', 'Agility + Fire Spin', 'Agility + Bind', 'Agility + Clamp'],
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
