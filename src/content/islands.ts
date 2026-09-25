import type { Character, Island } from "./types";

// ---------------------------------------------------------------------------
// Overarching plot: every sky island floats because of its own Sky Song, a
// tune hummed by the wind itself. Captain Squallbeard has been sneaking from
// island to island, bottling the Sky Songs in jars, and the islands are
// slowly sinking. His fortress hides inside a storm, and only the Wind Map
// shows the way. Each island's main character guards one piece of it.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------- Island 1 --

const WREN: Character = {
  name: "Granny Wren",
  what: "a kindly old owl who has looked after Mossy Meadow for longer than anyone can remember",
  look: "a small round elderly owl with brown speckled feathers, tiny round spectacles, a knitted lavender shawl, holding knitting needles",
  personality:
    "Warm, fussy and a little forgetful. She calls everyone 'dumpling', knits when she is worried (so she is always knitting), and hides a very sharp mind behind her tea cosy. Deep down she is scared to send a brand-new hatchling out into a sky full of pirates.",
  softSpot:
    "Good manners, helpfulness, and anyone who notices her knitting. Showing that you and your creature look out for each other melts her completely.",
  dislikes:
    "Rudeness, showing off, and reckless plans like 'I'll just jump off the edge and see what happens'. Being rushed makes her drop stitches.",
  portrait: "/art/npc_wren.jpg",
};

const PUFFCAP: Character = {
  name: "Puffcap",
  what: "a very shy little mushroom creature",
  look: "a knee-high mushroom with a spotty red cap it pulls down over its face, stubby root feet and two blushing pink cheeks",
  personality:
    "Painfully shy and extremely polite. Speaks in whispers, puffs out a little cloud of spores whenever it gets startled, and secretly longs for a friend.",
  softSpot:
    "Gentle, quiet voices, compliments about its cap, and being invited to play. Anyone who gets down low to its height seems much less scary.",
  dislikes:
    "Loud noises, sudden movements and being stared at. Grabbing makes it puff spores and burrow straight into the ground.",
};

const PILFER: Character = {
  name: "Sir Pilfer",
  what: "a vain magpie who collects anything shiny",
  look: "a glossy black-and-white magpie wearing a bottle-cap crown, perched on a nest crammed with buttons, spoons and marbles",
  personality:
    "A pompous collector who thinks of himself as a museum curator, not a thief. Talks like a posh butler. Cannot resist a shiny thing, a good trade or a juicy bit of gossip.",
  softSpot:
    "Being treated as a respected collector, admiring his collection, and fair trades for something even shinier. He also loves a riddle.",
  dislikes:
    "Being called a thief, having his nest touched, and anyone who says his collection is just junk.",
};

// ---------------------------------------------------------------- Island 2 --

const GRUMBOLD: Character = {
  name: "Grumbold",
  what: "a grumpy old bridge troll",
  look: "a big mossy green-grey troll with a tiny knitted hat, one snaggle tooth and a bluebird nesting on his shoulder",
  personality:
    "Grumpy, proud and loud, with a heart as soft as porridge. Always hungry. He adores Blue, the little bluebird who nests on his shoulder, and is very sensitive about his looks, especially his snaggle tooth.",
  softSpot:
    "Food (anything, but pies most of all), kindness towards Blue, and anyone who compliments his hat or treats him like a proper, important bridge guardian.",
  dislikes:
    "Being called ugly or smelly, people sneaking across without asking, and anyone who is mean to Blue. Mocking his tooth makes him roar.",
  portrait: "/art/npc_grumbold.jpg",
};

const BLUE: Character = {
  name: "Blue",
  what: "a tiny, dramatic bluebird",
  look: "a fluffy sky-blue bird no bigger than a teacup, wearing one of Grumbold's lost knitted socks as a sleeping bag",
  personality:
    "Jittery and very dramatic, like a tiny opera singer. Faints at loud bangs. Loves songs, berries and being told she is brave, even though she absolutely is not.",
  softSpot:
    "Songs, berries, and being made to feel brave and safe. She also can't resist a funny face.",
  dislikes:
    "Loud noises, big grabby hands and anyone who laughs at her for being scared.",
};

// ---------------------------------------------------------------- Island 3 --

const VESPER: Character = {
  name: "Madame Vesper",
  what: "a sly fox merchant who runs the finest stall in the Bazaar of Tricks",
  look: "a sly fox merchant in a purple velvet coat with many rings and a monocle",
  personality:
    "Silky, clever and theatrical. She never gives a fair price, but she respects anyone who can play the game with style. Talks like every sentence is a little performance.",
  softSpot:
    "Flattery about her exquisite taste, a clever trade that makes her look good, a rare curiosity, or a deal with a delicious twist. She secretly enjoys being out-foxed if it is done elegantly.",
  dislikes:
    "Clumsy haggling, whining, obvious lies and people who touch the merchandise without asking. Offering her pocket lint as payment gets you shown the door.",
  portrait: "/art/npc_vesper.jpg",
};

const PEMBERTON: Character = {
  name: "Pemberton",
  what: "a juggling lemur who runs the Swap Stall",
  look: "a ring-tailed lemur in a striped waistcoat, juggling three teacups while balancing on a stack of crates",
  personality:
    "Chatty, bouncy and endlessly curious. He never sells anything for coins, only swaps, and he values a good story more than gold.",
  softSpot:
    "Things with a story behind them, a good joke, and anyone who can juggle (or tries to, hilariously).",
  dislikes:
    "Boring offers, people who say 'just name your price', and anyone who bumps his crates while he is juggling.",
};

const NIB: Character = {
  name: "Nib",
  what: "a young raccoon pickpocket",
  look: "a small raccoon in an oversized flat cap and a patched coat with far too many pockets, clutching a stolen music box",
  personality:
    "Quick, cocky and secretly lonely. Steals mostly to feel clever. Talks fast, fibs faster, and grins when caught.",
  softSpot:
    "Anyone who is impressed by his quick paws, a fair challenge or game, and the idea of being part of a crew. A kind word catches him totally off guard.",
  dislikes:
    "Being bossed around, threats to call the bazaar guards, and being called a baby.",
};

// ---------------------------------------------------------------- Island 4 --

const ECHO: Character = {
  name: "Echo",
  what: "an ancient crystal spirit who remembers every sound ever made in the caves",
  look: "a shimmering spirit made of floating violet and aqua crystal shards with a gentle glowing face",
  personality:
    "Dreamy, gentle and a bit melancholy. Echo only truly listens to words that rhyme. Plain talk just bounces off it like noise. It remembers every song the caves have heard, including the Sky Song that was stolen.",
  softSpot:
    "Rhymes above all else. Any rhyme at all, even a clumsy one, makes Echo glow. Also music, humming and gentle voices.",
  dislikes:
    "Shouting (it rattles its shards), plain boring speech, and anyone who tries to grab its crystals.",
  portrait: "/art/npc_echo.jpg",
};

const LUMEN: Character = {
  name: "Lumen",
  what: "a glowworm who is afraid of the dark",
  look: "a chubby little glowworm with a soft green glowing tail, wrapped in a tiny blanket at the cave entrance",
  personality:
    "Nervous and apologetic. Her glow flickers when she is scared and blazes when she is happy. The irony of being a light who is afraid of the dark is not lost on her.",
  softSpot:
    "Company, reassurance, stories and silly songs. Holding her hand (or her tail) helps a lot.",
  dislikes:
    "Spooky noises, being teased about being scared, and being told to just stop being afraid.",
};

const CLATTERSBY: Character = {
  name: "Clattersby",
  what: "a vain crystal crab",
  look: "a large crab with a shell of sparkling pink quartz, holding a tiny polishing cloth in one claw",
  personality:
    "Fussy, vain and very slow to decide anything. Spends all day polishing his shell. Sits on the only path across the glowing underground pool.",
  softSpot:
    "Compliments about his sparkle, help polishing hard-to-reach spots, and gossip about other, less sparkly crabs.",
  dislikes:
    "Being rushed, fingerprints on his shell, and being compared to a regular beach crab.",
};

// ---------------------------------------------------------------- Island 5 --

const NIMBUS: Character = {
  name: "Old Nimbus",
  what: "an enormous, ancient sky whale",
  look: "an enormous gentle sky whale with soft blue-white cloud-like skin, little flowers growing on it like barnacles, sleepy half-closed eyes",
  personality:
    "Slow, sleepy and wise, with a voice like distant thunder humming a lullaby. Once carried whole villages between islands. Since the Sky Songs started vanishing, the wind feels wrong and he is scared to fly.",
  softSpot:
    "Gentleness, patience, lullabies, stories about the old days, and being scratched behind the fin. He trusts anyone who is kind to the little creatures living on his back.",
  dislikes:
    "Being poked, yelled at or rushed. Anyone who stomps on his flowers. Talk of the pirates makes him shiver.",
  portrait: "/art/npc_nimbus.jpg",
};

const PETUNIA: Character = {
  name: "Petunia Puff",
  what: "a tiny cloud-sprite gardener who tends the flowers on Old Nimbus's back",
  look: "a fluffy white cloud-sprite the size of a cabbage, wearing a straw sun hat and carrying a watering can bigger than herself",
  personality:
    "Bossy, busy and fiercely protective of Nimbus and her flowers. Speaks in rapid-fire instructions. Gets rained on by her own mood when she is upset.",
  softSpot:
    "Anyone who respects the garden, offers to help with chores, or knows something about flowers. Wiping your feet goes a very long way.",
  dislikes:
    "Muddy feet, trampled petals, and people who treat Nimbus like a bus.",
};

// ---------------------------------------------------------------- Island 6 --

const COGSWORTH: Character = {
  name: "Mayor Cogsworth",
  what: "the fussy clockwork mayor of the Clockwork Windmills",
  look: "a fussy little brass clockwork robot with a top hat, a monocle, ticking gears visible in his chest, clutching an enormous rulebook",
  personality:
    "Pompous, precise and utterly devoted to his rulebook, which has 1,204 rules. He ticks faster when nervous. He is not unkind, he just believes rules keep everyone safe, and he honestly cannot imagine breaking one.",
  softSpot:
    "Respect for the rules, proper forms, clever readings of the fine print, and being addressed as Your Worship. A loophole that follows the letter of the law delights him even while it horrifies him.",
  dislikes:
    "Rule-breaking, shortcuts, disorder, and being told his rules are silly. Talking over him makes his gears grind.",
  portrait: "/art/npc_cogsworth.jpg",
};

const TOCK: Character = {
  name: "Clerk Tock",
  what: "a tiny stamping robot who guards the town gate",
  look: "a teapot-sized tin robot with a rubber stamp for one hand, a pen for the other and a paper tray on its head overflowing with forms",
  personality:
    "Frazzled and overworked. Answers everything with a form number. Has never once been thanked for its work and does not know what to do with a compliment.",
  softSpot:
    "Patience with paperwork, being thanked, and anyone who helps sort its enormous pile of forms.",
  dislikes:
    "Missing paperwork, people jumping the queue and being called a toy.",
};

const SPROCKET: Character = {
  name: "Sprocket",
  what: "a mischievous gear-gremlin",
  look: "a small copper gremlin with goggles, huge ears and oil smudges everywhere, sitting inside a jammed windmill gear and grinning",
  personality:
    "Giggly, bored and very clever with machines. Jammed the big windmill because nobody ever plays with gremlins. Loves pranks, puzzles and making a mess.",
  softSpot:
    "Games, puzzles, pranks and being included. Asking for his help with something tricky makes him feel important.",
  dislikes:
    "Being scolded, being called a pest, and boring grown-up lectures about responsibility.",
};

// ---------------------------------------------------------------- Island 7 --

const HOLLOW: Character = {
  name: "Hollow",
  what: "a lonely ice golem who lives at the top of Frostpeak",
  look: "a tall lonely ice golem made of pale blue glacier chunks with frosty moss, sad glowing eyes, holding a tiny snowflower",
  personality:
    "Gentle, slow-speaking and heartbreakingly lonely. Hasn't had a visitor in 100 years, so he has forgotten how to talk to people and keeps apologising. He tends one tiny snowflower as his only friend.",
  softSpot:
    "Company, patience, being listened to, and kindness to his snowflower. The promise of friendship, or proof that he is not a monster, means everything to him.",
  dislikes:
    "Being called a monster, being left behind, and people who only visit because they want something from him.",
  portrait: "/art/npc_hollow.jpg",
};

const BRRNADETTE: Character = {
  name: "Brrnadette",
  what: "an arctic fox mountain guide",
  look: "a fluffy white arctic fox in a bright red scarf and snow goggles, with a coil of rope over one shoulder",
  personality:
    "Tough, sarcastic and a bit of a scaredy-cat about one thing only: the legendary Monster of Frostpeak. Knows every path on the mountain but refuses to climb to the top.",
  softSpot:
    "Bravery she can borrow, a good reason to be brave, and anyone who makes her laugh. Hot cocoa is also extremely persuasive.",
  dislikes:
    "Being called a coward, people who ignore safety, and being hurried on icy paths.",
};

const SLUSH: Character = {
  name: "Slush",
  what: "the ringleader of the Snowball Sprites",
  look: "a small round snow sprite with a carrot-stub nose and twig arms, leading a giggling gang of snow sprites behind a wall of snowballs",
  personality:
    "Cheeky, bossy and bored out of her frosty mind. She and her gang have been pelting every visitor with snowballs for years, partly for fun and partly because they think the golem at the top is scary.",
  softSpot:
    "Games, snowball fights, being challenged, and anyone who can make them laugh. Deep down they are just lonely kids too.",
  dislikes:
    "Being told off like babies, grown-ups who are no fun, and losing (though they can be good sports).",
};

// ---------------------------------------------------------------- Island 8 --

const SQUAWK: Character = {
  name: "Boss Squawk",
  what: "the swaggering leader of the Thunderhead sky-gull bandits",
  look: "a swaggering seagull bandit leader with an eyepatch, a red bandana, a tiny golden earring and a feather-duster held like a sword",
  personality:
    "Loud, boastful and dramatic. Only respects bold talk and big nerve. Currently working for Captain Squallbeard, who pays the gulls in stale crackers, and he is starting to feel a bit cheated.",
  softSpot:
    "Bold talk, daring deeds, a great boast, and chips. Anyone who stands up to him without flinching earns his respect. He also has a hidden soft spot for being thought of as a hero rather than a hired thug.",
  dislikes:
    "Whimpering, grovelling, long polite speeches, and anyone who mentions that his feather-duster is not a real sword.",
  portrait: "/art/npc_squawk.jpg",
};

const LENNY: Character = {
  name: "Lookout Lenny",
  what: "a nervous junior sky-gull on lookout duty",
  look: "a scrawny young seagull in a bandana three sizes too big, peering through a telescope made from a rolled-up newspaper",
  personality:
    "Jumpy, eager and desperate to be taken seriously by the other gulls. Has never once spotted anything on lookout duty and badly wants a win.",
  softSpot:
    "Being treated as important, being given a job or a secret, and snacks. He falls for a good distraction every time.",
  dislikes:
    "Being laughed at, being called a chick, and the idea of getting in trouble with Boss Squawk.",
};

const BERTHA: Character = {
  name: "Big Bertha Brinewing",
  what: "the biggest, loudest gull in the bandit gang and undefeated Thunder Dare champion",
  look: "an enormous barrel-chested seagull with a scar across her beak, a spiked leather collar and a trophy made from a golden spoon",
  personality:
    "Loud, competitive and honest. Loves a contest, hates a cheat. Every newcomer must beat her at the Thunder Dare, or amuse her enough that she forgets to care.",
  softSpot:
    "Guts, fair play and showmanship. A rival who makes her laugh, or who is brave enough to call her bluff, wins her over.",
  dislikes:
    "Cowards, whiners, and anyone who tries to skip the Dare. Cheating is fine only if it is so clever she can't prove it.",
};

// ---------------------------------------------------------------- Island 9 --

const MARLOWE: Character = {
  name: "Keeper Marlowe",
  what: "the guilty keeper of the great lighthouse",
  look: "a weathered middle-aged lighthouse keeper with a braided grey beard, a yellow raincoat, holding a lantern, guilty worried eyes",
  personality:
    "Tired, gruff and ashamed. For thirty years he kept the light burning and nobody ever said thank you. When Captain Squallbeard offered him a chest of gold to keep the lighthouse dark, he said yes, and he has regretted it every night since.",
  softSpot:
    "Being thanked and appreciated, being reminded of the ships he has saved, and a way to fix his mistake without being shamed for it. He still keeps every thank-you letter he ever got. There are three.",
  dislikes:
    "Being called a traitor, lectures, threats, and bribes. He has had enough of those.",
  portrait: "/art/npc_marlowe.jpg",
};

const SCUTTLE: Character = {
  name: "Polly Scuttle",
  what: "a pirate parrot spy",
  look: "a bright green parrot in a tiny pirate hat with a spyglass, perched on the lighthouse railing next to a signal flare",
  personality:
    "Nosy, chatty and a bit of a show-off. Posted here by Squallbeard to fire a flare if the light ever comes on. Repeats things she hears, often at the worst time.",
  softSpot:
    "Crackers (real ones, not stale), gossip, and anyone who teaches her a new word or a catchy song. Easily distracted by shiny things.",
  dislikes:
    "Being ignored, being called a bird-brain, and anyone who tries to grab her flare.",
};

const WICK: Character = {
  name: "Wick",
  what: "the flame spirit who lives in the lighthouse lamp",
  look: "a small sulky flame spirit with big eyes, curled up as a sad blue ember inside a giant crystal lamp",
  personality:
    "Proud and sulky. Wick has burned in this lamp for a century and was deeply insulted when Marlowe blew it out. Now it refuses to flare up for anyone.",
  softSpot:
    "Being told how important it is, stories of ships it has saved, warm-hearted words, and dry kindling or a good joke to 'warm it up'.",
  dislikes:
    "Cold drafts, being blown on, water anywhere near it, and being called just a candle.",
};

// --------------------------------------------------------------- Island 10 --

const SQUALLBEARD: Character = {
  name: "Captain Squallbeard",
  what: "the flamboyant sky pirate captain who has been stealing the Sky Songs",
  look: "a flamboyant sky pirate captain with a feathered tricorn hat, a crackling storm-cloud beard and a brass mechanical arm",
  personality:
    "Grand, theatrical and vain, with a laugh like a thunderclap. He has bottled every Sky Song he could find. The secret: as a boy he was laughed out of the island choir for being tone-deaf, and he decided that if he couldn't sing, nobody would have songs at all.",
  softSpot:
    "An audience, applause and being taken seriously. Deep down he wants to be part of the music, not the villain of it. Being invited to sing (and not laughed at) could crack him wide open.",
  dislikes:
    "Being ignored, being laughed at, anyone mentioning his singing voice, and threats he can tell are bluffs. Rudeness only makes his beard crackle harder.",
  portrait: "/art/npc_squallbeard.jpg",
};

const BESS: Character = {
  name: "First Mate Barnacle Bess",
  what: "the walrus first mate who guards the fortress gangplank",
  look: "a huge walrus in a patched navy coat with polished brass buttons, a wooden peg flipper and a lantern hanging from one tusk",
  personality:
    "Stern, suspicious and loyal to the ship, but she misses the days when pirates had a code of honour. She disapproves of stealing songs and hasn't said so out loud. Yet.",
  softSpot:
    "Honour, good manners, fish, and the old pirate code. Anyone who reminds her what a real pirate stands for gets her thinking.",
  dislikes:
    "Obvious lies, landlubbers pretending to be pirates badly, and anyone who insults the ship.",
};

const CLAMPS: Character = {
  name: "Clamps",
  what: "a giant clockwork vault-crab guarding the jars of stolen Sky Songs",
  look: "a massive brass crab with a round vault door for a belly, dozens of combination dials and two enormous padlock claws, steam hissing from its joints",
  personality:
    "Loyal, literal and lonely. Squallbeard built it and never once polished it. It follows orders exactly as spoken, and it can hear the stolen songs humming inside its belly, which makes it feel oddly sad.",
  softSpot:
    "Logic puzzles, word loopholes in its orders, a proper polish, and being treated like a person instead of a machine. The songs inside it are slowly making it want to be free, too.",
  dislikes:
    "Being called junk, brute force (its shell is very, very strong), and illogical nonsense it cannot process.",
};

// ---------------------------------------------------------------------------

export const ISLANDS: Island[] = [
  // ============================================================ 1 ============
  {
    n: 1,
    name: "Mossy Meadow",
    tagline: "Where every adventure starts with a cup of tea and a lost ball of yarn.",
    scene: "/art/scene_1.jpg",
    setting:
      "A small round island of soft green moss and wildflowers drifting in a pink morning sky, with a crooked cottage, a ring of spotted mushrooms and a single old oak dangling roots over the edge. Fluffy clouds float below, and the tiny waterfalls on its rim spill off into nothing.",
    main: WREN,
    challenges: [
      {
        id: "1-1",
        title: "Puffcap Won't Budge",
        npc: PUFFCAP,
        setup:
          "You and {creature} are barely an hour out of the egg when Granny Wren sends you on your very first errand: fetch her ball of lavender yarn, which rolled into the mushroom ring. You find it, all right. A tiny mushroom is sitting on it like a cushion, cap pulled down over its eyes, trembling.",
        openingLine:
          "Oh! Oh no. Please don't look at me. I'm not here. I'm a... regular mushroom. Very normal. Not sitting on anything.",
        goal: "Get Puffcap to give you back Granny Wren's yarn.",
        whatWorks:
          "Almost anything gentle works: speaking softly, crouching down to its height, complimenting its cap, inviting it to play or to come meet Granny Wren. Sneaky swaps (offering a softer cushion like a moss pillow) or silly moves ({creature} pretending to be a mushroom too) also work. Loud, grabby or scary moves make it puff spores and burrow, which fails.",
        hint: "Puffcap looks so scared... maybe if we were really quiet and small, like a friend, it would feel brave enough?",
        difficulty: "easy",
      },
      {
        id: "1-2",
        title: "The Magpie's Museum",
        npc: PILFER,
        setup:
          "Granny Wren is delighted with her yarn, until she reaches for her spectacles to read an old map and finds they're gone. A trail of glinting clues leads you to the old oak, where a magpie sits on a nest stuffed with spoons, buttons and one very familiar pair of tiny round glasses. {creature} points at them and squeaks indignantly.",
        openingLine:
          "Welcome, welcome, to the Pilfer Collection of Fine Shiny Objects. Please do not touch the exhibits. The spectacles are our newest acquisition and are absolutely not for sale.",
        goal: "Get Granny Wren's spectacles back from Sir Pilfer.",
        whatWorks:
          "Flattering him as a great collector, offering a fair trade for something shinier (a dewdrop, a shiny pebble, a polished acorn), or telling him Granny can't see without them all work. Sneaky ideas like distracting him with something sparkly while {creature} grabs the glasses, or silly ones like making them 'on loan to the owl museum', can succeed too. Calling him a thief or grabbing at the nest makes him puff up and refuse.",
        hint: "Sir Pilfer thinks he's a very important museum keeper... I bet he'd listen to someone who treats him like one. Or who has something even shinier!",
        difficulty: "easy",
      },
      {
        id: "1-3",
        title: "Ready for the Big Sky",
        npc: WREN,
        setup:
          "With her spectacles back on, Granny Wren peers at the old map and goes quiet. The meadow is sinking a whisker lower every day because Captain Squallbeard stole its Sky Song, and the only way to his hidden fortress is the Wind Map, torn into ten pieces and scattered across the islands. She holds the first piece to her chest and eyes you and {creature}, who is still a bit wobbly on its feet.",
        openingLine:
          "Oh, dumpling. The sky out there is full of trolls and tricksters and pirates, and you've only just hatched. Tell me why I should hand this to you instead of tucking you both into a nice warm blanket.",
        goal: "Convince Granny Wren you're ready to leave the meadow, and earn the first piece of the Wind Map.",
        whatWorks:
          "She wants proof that you and {creature} look after each other. Kind moves (promising to be careful, thanking her, offering to write) work well; so do showing what you've already done (the yarn, the spectacles), showing {creature} being brave, or making her laugh with a silly promise to wear a knitted scarf the whole trip. Complimenting her knitting helps a lot. Bragging, rushing her or reckless plans make her clutch the map tighter.",
        hint: "Granny's worried because she cares about us. What if we showed her how well we look after each other? She did knit an awful lot of scarves...",
        difficulty: "easy",
      },
    ],
  },

  // ============================================================ 2 ============
  {
    n: 2,
    name: "The Grumpy Bridge",
    tagline: "One bridge. One troll. One very small bluebird with very big feelings.",
    scene: "/art/scene_2.jpg",
    setting:
      "Two craggy sky islands joined by a long, sagging rope-and-plank bridge over a dizzying drop into the clouds, with a mossy stone toll hut at one end. Wind chimes made of old pots and spoons clatter in the breeze, and a very large troll sits in the middle of it all.",
    main: GRUMBOLD,
    challenges: [
      {
        id: "2-1",
        title: "Toll Troll",
        npc: GRUMBOLD,
        setup:
          "The next piece of the Wind Map points across a long rope bridge, and a very large troll is sitting on the first plank eating a turnip. A hand-painted sign beside him reads: TOLL. NO EXCEPSHUNS. A little bluebird peeks out from his hat and {creature} waves at it.",
        openingLine:
          "Oi. Nobody crosses Grumbold's bridge without paying the toll. And no, I don't know what the toll is today. Impress me.",
        goal: "Get Grumbold to let you onto the bridge.",
        whatWorks:
          "Food is the easiest toll (a snack, a pie, a promise to cook). Complimenting his hat, being sweet to Blue, or treating him like an important guardian all work. Silly moves like paying in jokes or a song, or a sneaky trick like 'the toll-inspector sent me', can work if they're fun. Insulting his looks or his tooth, or trying to squeeze past without asking, makes him roar and refuse.",
        hint: "Did you hear his tummy rumble? And he keeps stroking that little bird... I think there are two ways to Grumbold's heart.",
        difficulty: "easy",
      },
      {
        id: "2-2",
        title: "Blue Has Flown",
        npc: BLUE,
        setup:
          "Halfway across, a pirate airship roars past overhead. Blue shrieks, bolts from Grumbold's hat and wedges herself into a crack under the bridge planks, where the troll's huge fingers can't reach. Grumbold is not crying. It is bridge-dew. {creature} is small enough to peek into the crack.",
        openingLine:
          "Tweep! I'm not coming out! Not ever! There are monsters in the sky and I am a very small bird and I shall live in this crack forever!",
        goal: "Coax Blue out of her hiding spot and back to Grumbold.",
        whatWorks:
          "Gentle reassurance, a song, berries, or telling Blue how brave she is all work well. {creature} snuggling in beside her, a funny face or a silly dance can make her giggle out. Sneaky ideas like leaving a trail of berries also work. Grabbing, shouting or rattling the planks scares her deeper in, and laughing at her fear makes her sulk.",
        hint: "Blue is SO scared. Maybe she doesn't need to be pulled out. Maybe she just needs to feel brave, or hear something nice?",
        difficulty: "medium",
      },
      {
        id: "2-3",
        title: "The Wobbly Crossing",
        npc: GRUMBOLD,
        setup:
          "Blue is home, and Grumbold is pretending very hard that he did not sniffle. But the island's Sky Song is gone, the bridge is sagging lower by the minute, and the far side is swinging like a hammock. Grumbold keeps a scrap of the Wind Map under his tiny knitted hat, and the only way across is if he holds the ropes steady.",
        openingLine:
          "Hmph. Hold the ropes? Me? Grumbold doesn't do favours. Grumbold does grumping. And I'm definitely not taking my hat off for a couple of strangers.",
        goal: "Get Grumbold to hold the bridge steady and give you the map piece from under his hat.",
        whatWorks:
          "He's secretly grateful for Blue, so reminding him gently (without gloating) works. Asking him to be the hero of the bridge, promising to bring back the Sky Song so his bridge stops sagging, sharing food, or getting Blue to ask for you all help. A brave move like starting across on your own can shame him into helping; a silly one (offering to hold his hat safe, or knitting him a new one) can charm him. Mocking his looks, demanding it as a reward, or yanking his hat backfires.",
        hint: "Grumbold wants to be a hero, he just can't say it. And whose opinion matters more to him than anyone's? The one sitting on his head...",
        difficulty: "medium",
      },
    ],
  },

  // ============================================================ 3 ============
  {
    n: 3,
    name: "Bazaar of Tricks",
    tagline: "Everything is for sale. Nothing is a bargain. Keep one paw on your pockets.",
    scene: "/art/scene_3.jpg",
    setting:
      "A crowded floating market built on stacked islands linked by ladders, crammed with striped tents, dangling paper lanterns and stalls selling bottled clouds and singing teapots. Merchants of every species shout over each other while hot-air balloons bob overhead in a warm sunset glow.",
    main: VESPER,
    challenges: [
      {
        id: "3-1",
        title: "The Swap Stall",
        npc: PEMBERTON,
        setup:
          "The next map piece is in the glass case of Madame Vesper, the slyest fox in the bazaar, and you have exactly zero coins. A juggling lemur at the Swap Stall is waving a gorgeous old music box that plays a tune when you open it, and {creature} can't stop staring at it. It looks like just the sort of treasure a fancy fox would want.",
        openingLine:
          "Swap, swap, swappity swap! No coins here, friend, coins are boring. You want the music box? Show me something with a STORY.",
        goal: "Trade Pemberton for his music box.",
        whatWorks:
          "He values stories over value. Offering a small item from your journey with a great tale (Granny Wren's yarn scrap, a feather of Blue's, a troll-sized sock), telling a funny story, attempting to juggle, or offering to help run his stall all work. A clever trade like swapping a 'secret' also works. Boring 'how much?' offers, trying to pay coins, or knocking his crates make him snooty.",
        hint: "Pemberton doesn't care how much something is worth. He wants a good story! We've had a few adventures already, haven't we?",
        difficulty: "easy",
      },
      {
        id: "3-2",
        title: "Nib the Nimble",
        npc: NIB,
        setup:
          "You've barely taken three steps when a small furry blur bumps into you, says sorry, and vanishes. So does the music box. {creature} spots a flat cap poking out from behind a spice stall and sniffs: it smells of raccoon.",
        openingLine:
          "Music box? What music box? I've never seen a music box in my whole life. (A tinkly tune starts playing from his coat.) ...That's my stomach.",
        goal: "Get the music box back from Nib.",
        whatWorks:
          "Challenging him to a fair game (the box as the prize), being impressed by how quick he is, or offering him a place on your crew all work. Kindness surprises him and can do it too. A sneaky counter-pickpocket by {creature} or a silly trick (pretend the box is cursed with endless tunes) can succeed. Threatening to call the guards or bossing him around makes him bolt across the rooftops.",
        hint: "Nib seems more lonely than bad. Maybe if we made him feel clever... or like he had a friend?",
        difficulty: "medium",
      },
      {
        id: "3-3",
        title: "Never a Fair Price",
        npc: VESPER,
        setup:
          "Madame Vesper's tent smells of incense and money. The third piece of the Wind Map rests in a glass case behind her, next to a sign that says PRICELESS (PRICE ON REQUEST). She swirls her monocle and inspects you and {creature} like a pair of slightly muddy vases.",
        openingLine:
          "Ah, customers. How quaint. That little scrap of map? Oh, it's worth a king's ransom, darling. And you have... a music box and mud on your shoes.",
        goal: "Get the map piece from Madame Vesper.",
        whatWorks:
          "She never gives a fair price, but she loves style. Flattering her exquisite taste, presenting the music box as a rare antique that suits her collection, or offering a deal that makes her look good (a sign saying 'Vesper sponsored the heroes') all work. A clever con (pointing out Squallbeard will sink the bazaar and her profits with it), a bold bluff to walk away, or a delightfully silly sales pitch can succeed. Clumsy haggling, whining, obvious lies or touching the case gets you shown out.",
        hint: "Madame Vesper loves fancy things and loves hearing how fancy she is. What if we made our deal sound like the most elegant thing she's ever seen?",
        difficulty: "medium",
      },
    ],
  },

  // ============================================================ 4 ============
  {
    n: 4,
    name: "Crystal Caves",
    tagline: "Speak in rhyme, and you'll do fine. Speak plain, and you'll try again.",
    scene: "/art/scene_4.jpg",
    setting:
      "A hollow island whose insides are a glittering cavern of giant violet and aqua crystals, lit by glowing pools and floating motes of light. Every drip and footstep echoes and chimes, and paths wind between towering geodes toward a shining crystal heart.",
    main: ECHO,
    challenges: [
      {
        id: "4-1",
        title: "A Light Who Fears the Dark",
        npc: LUMEN,
        setup:
          "The Wind Map leads into the Crystal Caves, but just past the entrance the glow fades and the tunnels go pitch black. The only light is a chubby glowworm wrapped in a blanket, and she is shaking so hard her tail flickers like a broken lamp. {creature} tries to hold your hand and grabs your nose instead.",
        openingLine:
          "Oh, hello, sorry, sorry. You want me to light the way? In THERE? It's dark in there. I'm a glowworm who's scared of the dark. I know. I KNOW.",
        goal: "Convince Lumen to light your way through the dark tunnels.",
        whatWorks:
          "Reassurance and company work best: promising to stay close, holding her tail, or telling her that the dark is scared of her. Silly songs, stories to pass the time, or {creature} volunteering to be extra-brave for both of them also work. A sneaky idea like saying 'let's just go a few steps' can work. Teasing her or telling her to stop being silly makes her glow go out.",
        hint: "Lumen doesn't need to stop being scared. She just needs someone brave next to her... and maybe something to make her giggle.",
        difficulty: "easy",
      },
      {
        id: "4-2",
        title: "The Sparkliest Crab",
        npc: CLATTERSBY,
        setup:
          "Deeper in, the tunnel ends at a glowing underground pool. The only way across is a narrow ledge, and on the ledge sits a big crab with a quartz shell, polishing himself very, very slowly. {creature} tries to squeeze past and gets a stern look and a clack of a claw.",
        openingLine:
          "Do you MIND? I am in the middle of my afternoon polish. And my morning polish. And quite possibly my evening polish. Come back next week.",
        goal: "Get Clattersby to let you pass across the ledge.",
        whatWorks:
          "Compliments on his sparkle, offering to polish the spots he can't reach, or gossiping about duller crabs all work. A little rhyme charms him too, since he has lived near Echo for years. Silly moves like {creature} holding a 'most sparkly crab' contest, or a sneaky one like pointing out a better polishing rock on the far side, can succeed. Rushing him or calling him an ordinary crab makes him dig in.",
        hint: "Clattersby loves his shell more than anything. I wonder if there's a spot on his back he can't quite reach...",
        difficulty: "medium",
      },
      {
        id: "4-3",
        title: "Speak in Rhyme",
        npc: ECHO,
        setup:
          "At the heart of the caves floats Echo, a spirit of drifting crystal shards, humming a sad half-melody. It remembers every sound these caves have ever heard, including the island's Sky Song, and where the pirates flew off with it. The fourth map piece is locked inside its glowing core. When {creature} squeaks hello, Echo doesn't even flicker.",
        openingLine:
          "Plain words fall like stones and sink. Speak in rhyme, if you would like me to think.",
        goal: "Get Echo to share its memory of the stolen Sky Song and the map piece.",
        whatWorks:
          "Echo only truly listens to rhymes. Any move phrased in rhyme, even a clumsy or silly one, should be much more likely to work than plain speech; a kind, brave, sneaky or silly request in rhyme can all succeed. Humming or singing also helps. Plain speech mostly fails unless it's exceptionally gentle, and shouting or grabbing at its crystals always backfires.",
        hint: "Echo didn't hear a word I said! It spoke in rhyme... I bet it only listens if we rhyme too. Try it!",
        difficulty: "medium",
      },
    ],
  },

  // ============================================================ 5 ============
  {
    n: 5,
    name: "The Cloud Whale",
    tagline: "The island is asleep. The island is also a whale. Please wipe your feet.",
    scene: "/art/scene_5.jpg",
    setting:
      "An enormous sleeping sky whale drifts through golden evening clouds, its back covered in a little garden of flowers, tiny trees and a watering-can shed. Wisps of cloud trail from its fins, and far ahead a dark wall of storm clouds crackles on the horizon.",
    main: NIMBUS,
    challenges: [
      {
        id: "5-1",
        title: "Wipe Your Feet!",
        npc: PETUNIA,
        setup:
          "Echo's memory showed the next map piece hidden in the flowers on the back of Old Nimbus, the great sky whale, who is also the only ride onward from here. The whale drifts past the cave mouth, snoring softly, and you and {creature} manage to jump aboard. You are immediately confronted by a very small cloud with a very large watering can.",
        openingLine:
          "STOP. Feet! Look at those feet! Do you know how long it took to grow these bluebells? Nobody tramples my garden and nobody bothers Nimbus. Off you get.",
        goal: "Convince Petunia Puff to let you into the garden on Nimbus's back.",
        whatWorks:
          "Respect for the garden works best: wiping your feet, offering to help water or weed, or knowing something about flowers. A silly move like {creature} tiptoeing on its very tiniest toes, or a sneaky one like 'we're the new garden inspectors', can succeed. Explaining you're trying to save the Sky Songs helps if said kindly. Trampling flowers or treating Nimbus like a bus makes her rain on you.",
        hint: "Petunia's rather bossy, but she clearly loves her garden. Maybe if we showed her we'd help look after it?",
        difficulty: "medium",
      },
      {
        id: "5-2",
        title: "Waking the Whale",
        npc: NIMBUS,
        setup:
          "Petunia leads you to a patch of pale moonflowers near Nimbus's great sleepy eye and points at the map piece, which is tangled in the roots where only Nimbus himself can shake it free. The whale is deeply, snoringly asleep, and each snore blows {creature} three steps backwards. Petunia hisses that if you wake him badly, he'll dive into the clouds and not come up for a week.",
        openingLine:
          "Mmmmrrrrhhh... five more centuries... zzzzz...",
        goal: "Wake Old Nimbus gently enough that he stays calm and friendly.",
        whatWorks:
          "Anything gentle: humming a lullaby in reverse, whispering good morning, scratching behind his fin, tickling him with a feather, or telling him a soft story about the old days. Silly moves like {creature} doing a tiny sunrise dance can work; a sneaky one like letting sunlight through the clouds by moving a flower can too. Poking, yelling, or jumping on him makes him grumble and roll, which fails.",
        hint: "If I were a giant sleepy whale, I'd want to wake up very, very slowly. Something soft... like a song, or a nice scratch?",
        difficulty: "medium",
      },
      {
        id: "5-3",
        title: "Through the Storm Wall",
        npc: NIMBUS,
        setup:
          "Nimbus shakes the map piece loose with a yawn that bends the trees, and the fifth piece clicks together with the others. It points straight into a black wall of crackling storm clouds that Squallbeard's pirates left behind. Nimbus sees it, trembles from nose to tail, and starts slowly turning away.",
        openingLine:
          "Little ones... I have flown these skies for nine hundred years. But that storm smells of pirates, and I am old, and I am afraid. Please don't ask me to go in there.",
        goal: "Earn Old Nimbus's trust so he'll carry you through the storm wall.",
        whatWorks:
          "Gentle courage works best: promising to stay by his eye and guide him, reminding him of the villages he once carried, or singing to keep him calm. A brave move like {creature} standing at the front to face the storm first can inspire him; a silly one like a 'storm-proof' hat made of petals can make him laugh. Petunia can help if asked. Bossing him around, calling him a coward or poking him makes him dive away.",
        hint: "Nimbus isn't being difficult, he's scared. What would make you feel brave if you were scared and very old? Maybe knowing you're not alone...",
        difficulty: "medium",
      },
    ],
  },

  // ============================================================ 6 ============
  {
    n: 6,
    name: "Clockwork Windmills",
    tagline: "Rule 1: No fun. Rule 2: See rule 1. Rule 47: Complicated.",
    scene: "/art/scene_6.jpg",
    setting:
      "A tidy brass-and-copper town built on a floating cog, with dozens of wooden windmills whose sails have stopped turning and gears clanking lazily in every wall. Neat little streets, polished clock towers and signs listing rules cover everything, with steam puffing from chimney pipes into a pale blue sky.",
    main: COGSWORTH,
    challenges: [
      {
        id: "6-1",
        title: "Form 12-B, Obviously",
        npc: TOCK,
        setup:
          "Old Nimbus drops you at the gates of the Clockwork Windmills and floats off for a nap. The windmills have all stopped turning since the Sky Song vanished, and the town is sinking with a sad metallic groan. A tiny robot at the gate has a stamp for a hand and a mountain of paperwork on its head, and it holds up a hand when {creature} tries to wander through.",
        openingLine:
          "Halt. Entry requires Form 12-B, Visitor Declaration, in triplicate, stamped by the Mayor, who is not available without Form 12-B. Next!",
        goal: "Get Clerk Tock to let you into town.",
        whatWorks:
          "Patience and kindness work well: thanking Tock for its hard work, offering to help sort its forms, or filling in a form politely. Clever rule-play also works, like asking for Form 12-B's 'exception form' or pointing out {creature} is too small to count as a visitor. Silly moves like {creature} filing itself as a parcel can succeed. Barging past, calling it a toy, or jumping the queue gets you a big red DENIED stamp.",
        hint: "Poor Tock looks SO overworked. I bet nobody has ever helped with those forms. Or said thank you...",
        difficulty: "medium",
      },
      {
        id: "6-2",
        title: "The Gremlin in the Gears",
        npc: SPROCKET,
        setup:
          "Inside the biggest windmill, the gears aren't just slow, they're totally jammed, and a grinning copper gremlin is sitting right in the middle of them. The Mayor has promised to see anyone who gets this windmill turning again. {creature} tries to peek in, and Sprocket jams a spoon between two cogs just to watch you jump.",
        openingLine:
          "Heehee! Nobody ever plays with gremlins, so I'm playing with the windmill. It's MY windmill now. Want it back? Make me.",
        goal: "Get Sprocket to unjam the windmill.",
        whatWorks:
          "Playing with him works best: challenging him to a game or puzzle, asking for his help with a clever job, or inviting him on the adventure. A kind move (asking why he's lonely) or a silly prank-off can win him over. A sneaky trick like 'bet you can't unjam it in ten seconds' also works. Scolding him, calling him a pest, or lecturing him about responsibility makes him jam it harder.",
        hint: "Sprocket's not really bad, he's bored! What if we gave him something more fun to do than jamming gears?",
        difficulty: "medium",
      },
      {
        id: "6-3",
        title: "The Loophole in Rule 47",
        npc: COGSWORTH,
        setup:
          "The great windmill creaks back to life and Mayor Cogsworth ticks out to meet you, rulebook first. He's grateful, truly, and the sixth map piece is framed on his office wall. But he opens his enormous rulebook to Rule 47, and his gears droop: 'No map, chart or scrap thereof shall leave the Windmills in the hands of a visitor.' {creature} peers at the page and sniffs thoughtfully.",
        openingLine:
          "Most unfortunate. Most irregular. I should like to help, truly I should. But Rule 47 is Rule 47. I have never broken a rule in my life, and I shan't start before teatime.",
        goal: "Find a loophole in Rule 47 so Mayor Cogsworth will give you the map piece.",
        whatWorks:
          "He needs the letter of the law, not a broken rule. Loopholes that work: becoming honorary residents (you did fix the windmill), having {creature} carry it in paws, wings or beak since those aren't 'hands', folding it into a paper airplane so it's an aircraft not a map, or formally proposing Rule 47b. Showing respect for his rules, calling him Your Worship, or pointing out that sinking isn't allowed either (surely there's a rule) all help. Telling him rules are silly or just grabbing it makes his gears grind to a halt.",
        hint: "Mayor Cogsworth won't break a rule... but read Rule 47 really carefully. Every single word. Who is a 'visitor'? What counts as 'hands'?",
        difficulty: "medium",
      },
    ],
  },

  // ============================================================ 7 ============
  {
    n: 7,
    name: "Frostpeak",
    tagline: "The monster at the top hasn't had a visitor in a hundred years. Bring mittens.",
    scene: "/art/scene_7.jpg",
    setting:
      "A towering snow-covered island mountain with glittering ice cliffs, frozen waterfalls and blue shadows, its summit wrapped in swirling snow. A tiny glowing cave sits near the peak, and pale aurora ribbons ripple in the twilight sky above.",
    main: HOLLOW,
    challenges: [
      {
        id: "7-1",
        title: "Nobody Climbs to the Top",
        npc: BRRNADETTE,
        setup:
          "The map points to the very top of Frostpeak, and the only guide at the bottom is an arctic fox in a red scarf warming her paws by a fire. The moment you mention the summit, her ears go flat. {creature}'s teeth chatter so hard it sounds like a tiny drum.",
        openingLine:
          "The top? Ha! No. Nope. Not a chance. There's a MONSTER up there. Everybody knows it. I'll take you anywhere on this mountain except there.",
        goal: "Convince Brrnadette to guide you up the mountain.",
        whatWorks:
          "Giving her a reason to be brave works (the sinking islands, the stolen Sky Songs), as does sharing cocoa, making her laugh, or promising you'll go first. A clever question like 'has anyone actually SEEN the monster?' can make her doubt the legend. A sneaky dare or a silly offer ({creature} volunteering as monster-bait) can succeed. Calling her a coward or setting off without safety gear makes her refuse.",
        hint: "Brrnadette is tough about everything except the monster. What if we gave her a really good reason to be brave? Or something warm to drink?",
        difficulty: "medium",
      },
      {
        id: "7-2",
        title: "Snowball Ambush",
        npc: SLUSH,
        setup:
          "Halfway up, a snowball smacks {creature} right on the head, followed by a dozen more and a chorus of giggles. A gang of snow sprites peeks over a wall of snowballs, led by a round little sprite with a carrot-stub nose. Brrnadette ducks behind a rock and mutters that this is exactly why nobody visits the top.",
        openingLine:
          "HALT, intruders! This is Snowball Territory! Nobody gets past the Snowball Sprites. Also nobody should go up there anyway. The golem at the top is SCARY.",
        goal: "Get past the Snowball Sprites.",
        whatWorks:
          "Joining the fun works best: a snowball fight challenge, a funny game, or making them laugh. Kind moves like asking if they're lonely up here, or inviting them to come meet the 'scary' golem with you, can work too. A brave charge through the snowballs or a sneaky move like building a decoy snowman can succeed. Scolding them like babies or being a grumpy grown-up makes them throw harder.",
        hint: "They're just bored kids with a lot of snow! Maybe the best way past a snowball fight is to join it.",
        difficulty: "medium",
      },
      {
        id: "7-3",
        title: "A Visitor for Hollow",
        npc: HOLLOW,
        setup:
          "At the summit, in a cave full of blue light, stands a tall golem of glacier ice cradling one tiny snowflower. His eyes glow brighter when he sees you, then dim again. Frozen into the ice of his chest is the seventh map piece, and he puts a hand over it the moment {creature} looks at it.",
        openingLine:
          "Visitors... You are the first in a hundred years. If I give you the map, you will go away. Everyone always goes away. Could you... could you not ask for it yet?",
        goal: "Help Hollow feel less lonely so he'll give you the map piece.",
        whatWorks:
          "He needs to know he won't be forgotten. Spending time with him, admiring his snowflower, promising to visit, or bringing the Snowball Sprites and Brrnadette up to meet him (proving he isn't a monster) all work beautifully. A silly move like teaching him a game or a brave one like staying the night in the cold can also win him over. Asking only for the map, calling him a monster, or trying to chip the piece out breaks his heart and fails.",
        hint: "Hollow doesn't want to be left alone again. What if we didn't just visit... what if we found him some friends who'd stay?",
        difficulty: "medium",
      },
    ],
  },

  // ============================================================ 8 ============
  {
    n: 8,
    name: "Thunderhead",
    tagline: "Bandit gulls, lightning dares and a boss who respects only big talk.",
    scene: "/art/scene_8.jpg",
    setting:
      "A jagged rocky island wreathed in dark thunderclouds, with lightning flickering between rusty crow's-nest towers built from shipwreck planks. Seagull bandits roost on flags and ropes around a crackling bonfire, and rain lashes the cliffs in bursts.",
    main: SQUAWK,
    challenges: [
      {
        id: "8-1",
        title: "Lookout Lenny",
        npc: LENNY,
        setup:
          "Thunderhead is the hideout of the sky-gull bandits, who work for Squallbeard. As you climb onto the rocks, a scrawny young gull swings his newspaper telescope around and nearly falls off his post. {creature} freezes like a statue, which doesn't help, because it's the only thing in the area painted bright colours.",
        openingLine:
          "INTRUD- oh. Oh wow. An actual intruder? I've never spotted one before! Hold on, I have to... I have to report you. Probably. Stay there. Please.",
        goal: "Get past Lookout Lenny without him raising the alarm.",
        whatWorks:
          "Making him feel important works (telling him he's the best lookout ever, giving him a 'secret mission'), as do snacks. Sneaky distractions like 'look, a pirate ship!' work almost every time. A brave, confident walk-in ('Boss Squawk is expecting us') or a silly disguise can succeed. Laughing at him or calling him a chick makes him squawk the alarm.",
        hint: "Lenny wants SO badly to be taken seriously. I bet he'd love to feel important... or to be distracted by something shiny.",
        difficulty: "medium",
      },
      {
        id: "8-2",
        title: "The Thunder Dare",
        npc: BERTHA,
        setup:
          "Past the lookout, the bandits gather around a bonfire, and the biggest gull you've ever seen stomps forward, golden-spoon trophy held high. Every newcomer must take the Thunder Dare before they're allowed to speak to the Boss. Lightning cracks over the cliff top and {creature} hides behind your leg, then bravely peeks out.",
        openingLine:
          "Nobody talks to the Boss without beating Big Bertha at the Thunder Dare! Grab a chip from the top of the lightning rock before the next bolt. Or run home to your mama. HAR!",
        goal: "Win Big Bertha's respect, by beating the Thunder Dare or finding another way.",
        whatWorks:
          "Guts and showmanship work best: taking the dare boldly, challenging her to a different contest instead, or calling her bluff. Clever sneaky moves (timing it between bolts, using a stick, sending {creature} who is small and fast) succeed if they're too clever to prove as cheating. Making her laugh with a silly victory dance also works. Whining, begging or trying to skip the dare without a bold reason fails.",
        hint: "Bertha respects guts and a good show. Whatever we do, we should do it BIG! Or so cleverly she can't complain.",
        difficulty: "medium",
      },
      {
        id: "8-3",
        title: "Talk Like a Bandit",
        npc: SQUAWK,
        setup:
          "The gulls part, and Boss Squawk swaggers down from a throne made of lobster traps, feather-duster raised like a sword. Behind him is a map-shaped scrap of parchment nailed to the wall: the eighth piece, a present from Squallbeard, along with a sack of very stale crackers. {creature} puffs up its chest to look as big as possible.",
        openingLine:
          "Well, well, WELL. So YOU'RE the little heroes messing up the Captain's plans. Give me one good reason, just one, why I shouldn't have you tossed into the next thundercloud!",
        goal: "Convince Boss Squawk to give you the map piece and stop working for Squallbeard.",
        whatWorks:
          "Bold talk works best: a big confident boast, standing up to him without flinching, or daring him to be a real hero instead of a hired thug. Pointing out that Squallbeard pays in stale crackers (and a hero would get chips for life) is a strong sneaky-bold route. Kind or silly moves can work if they're said with swagger, like offering a toast or a boasting contest. Grovelling, long polite speeches, or mocking his feather-duster fail.",
        hint: "Boss Squawk only respects big talk. Stand tall! And have you seen what Squallbeard's been paying him with? Those crackers look awful...",
        difficulty: "hard",
      },
    ],
  },

  // ============================================================ 9 ============
  {
    n: 9,
    name: "Lighthouse Isle",
    tagline: "The light has gone out, and the keeper knows exactly why.",
    scene: "/art/scene_9.jpg",
    setting:
      "A rocky little island crowned with a tall red-and-white lighthouse whose great lamp sits dark, surrounded by drifting fog and the faint silhouettes of lost sky ships. Waves of cloud crash against the rocks, and a single warm window glows in the keeper's cottage below.",
    main: MARLOWE,
    challenges: [
      {
        id: "9-1",
        title: "The Parrot on the Railing",
        npc: SCUTTLE,
        setup:
          "Boss Squawk's gulls fly you to Lighthouse Isle, where the last map piece should show the way through the storm to Squallbeard's fortress. The great lamp is dark, and a green parrot in a pirate hat is perched on the railing beside a signal flare, ready to warn the fortress if anyone lights it. {creature} ducks behind a crate, but the parrot has already seen you.",
        openingLine:
          "SQUAWK! Who goes there! Who goes there! Polly sees you! Polly fires the flare if anybody touches the lamp. Polly wants a cracker!",
        goal: "Get Polly Scuttle away from the signal flare.",
        whatWorks:
          "Treats and chatter work well: real crackers, juicy gossip, or teaching her a catchy new song or word. Sneaky distractions (something shiny, 'Squallbeard wants you back at the fortress') succeed often. Kindly asking if she really enjoys working for a captain who never gives her crackers can turn her. A silly move like a parrot-talking contest also works. Ignoring her, calling her a bird-brain or grabbing the flare makes her fire it.",
        hint: "Polly LOVES to chat and she's obviously starving. Maybe she's not so loyal to the pirates if someone was nicer to her?",
        difficulty: "medium",
      },
      {
        id: "9-2",
        title: "Wick Won't Burn",
        npc: WICK,
        setup:
          "You climb the winding steps to the lamp room, where the great crystal lamp holds nothing but a sulking blue ember. It's a flame spirit, and it has been cold and dark for weeks. When {creature} leans in to look, the ember turns its back with a tiny, offended fizzle.",
        openingLine:
          "Hmph. A hundred years I burned in this lamp. A HUNDRED. And then he blew me out like a birthday candle. I'm not lighting up for anyone. Not ever.",
        goal: "Get Wick to burn bright again.",
        whatWorks:
          "Wick needs to feel important again: telling it how many ships it saved, how the whole sky needs it, or offering warm and genuine kindness. A funny joke or dry kindling can literally warm it up. A sneaky move like saying 'I bet you couldn't even flicker anymore' can provoke it into blazing. A brave promise to make Marlowe apologise also helps. Blowing on it, bringing water near it, or calling it just a candle makes it shrink.",
        hint: "Wick feels forgotten and insulted. What if we reminded it how important it is? Something warm might help too...",
        difficulty: "medium",
      },
      {
        id: "9-3",
        title: "The Keeper's Choice",
        npc: MARLOWE,
        setup:
          "Wick is blazing, but the lamp's shutters are locked, and Keeper Marlowe holds the key and the ninth map piece. He stands in the doorway, lantern trembling, a chest of pirate gold at his feet. Out in the fog, the lights of a lost sky ship drift closer to the rocks, and {creature} tugs at your sleeve, worried.",
        openingLine:
          "I know what you're here for. And I know what I did. Thirty years I kept that light, and not one soul said thank you. Then the Captain came with gold. Just go. Please.",
        goal: "Convince Keeper Marlowe to open the shutters, light the lighthouse and give you the last map piece.",
        whatWorks:
          "He needs to feel appreciated and forgiven, not shamed. Thanking him for thirty years of work, reminding him of the ships he saved, pointing to the lost ship out in the fog, or offering him a way to fix things all work. A brave move (standing with him against the pirates) or a sneaky one (reading the three thank-you letters he keeps) can reach him; so can a silly one that makes him laugh despite himself. Calling him a traitor, lecturing, threatening or offering a bigger bribe fails badly.",
        hint: "Marlowe's already sorry. I don't think he needs to be told off. I think he needs someone to finally say thank you...",
        difficulty: "hard",
      },
    ],
  },

  // =========================================================== 10 ============
  {
    n: 10,
    name: "Sky Pirate Fortress",
    tagline: "Every stolen Sky Song is in there. So is the loudest beard in the sky.",
    scene: "/art/scene_10.jpg",
    setting:
      "A towering black-and-brass pirate fortress built from lashed-together airships, perched inside a swirling storm cloud with lightning crackling around its flag towers. Hundreds of glowing jars line its windows, each holding a stolen, shimmering Sky Song.",
    main: SQUALLBEARD,
    challenges: [
      {
        id: "10-1",
        title: "The Gangplank",
        npc: BESS,
        setup:
          "The lighthouse beam cuts a path through the storm, the Wind Map is finally whole, and there it is: Squallbeard's fortress, bristling with cannons and glowing with a hundred jars of stolen Sky Songs. The only way in is a creaky gangplank guarded by a walrus in a brass-buttoned coat. {creature} tries very hard to look like a pirate and mostly looks like a hatchling in an eyepatch.",
        openingLine:
          "Halt, landlubbers. Nobody boards this fortress without the Captain's say-so. And the Captain has said no to everything since he started collecting songs. State your business, and don't you dare fib to old Bess.",
        goal: "Get past First Mate Barnacle Bess and into the fortress.",
        whatWorks:
          "Bess respects honour: appealing to the old pirate code (real pirates don't steal songs from children), being honest and polite, or offering fish all work. A convincing pirate bluff is possible but hard, since she hates bad fakes. A brave, honest challenge to her conscience, or a silly move so charming she lets you through out of sheer fondness, can succeed. Obvious lies, insulting the ship or trying to rush past fail.",
        hint: "Bess doesn't seem to like what the Captain's doing either. Maybe we remind her what a REAL pirate stands for?",
        difficulty: "hard",
      },
      {
        id: "10-2",
        title: "The Song Vault",
        npc: CLAMPS,
        setup:
          "Deep in the fortress you find the vault: a colossal clockwork crab with a round steel door in its belly, dozens of dials and claws the size of carriages. From inside comes a faint humming of every island's Sky Song at once. {creature} tilts its head, and you realise the crab is humming along very quietly.",
        openingLine:
          "ORDERS: LET NO ONE TAKE THE SONGS. ORDERS: LET NO ONE OPEN THE DOOR. ...Query. Why do the songs sound so sad? Query. Why do I?",
        goal: "Get Clamps to open the vault.",
        whatWorks:
          "Clamps follows orders literally, so loopholes work: nobody is 'taking' the songs if they're set free to fly home, or Clamps could open itself since it isn't 'no one'. Treating it like a person, asking how it feels, or giving it a proper polish (Squallbeard never did) wins it over. A silly move like humming along with the songs or a brave one of asking it to choose for itself can succeed. Brute force, calling it junk, or illogical nonsense it can't process fails.",
        hint: "Clamps listens to its orders VERY exactly. What do the words actually say? And did you hear it... it sounds sad, like it wants to be free too.",
        difficulty: "hard",
      },
      {
        id: "10-3",
        title: "Showdown with Captain Squallbeard",
        npc: SQUALLBEARD,
        setup:
          "The vault opens and the jars glow, and then thunder booms. Captain Squallbeard sweeps in on a gust of storm, beard crackling, brass arm clanking, and plants himself between you and the jars of Sky Songs. {creature} stands its ground beside you, braver than it has ever been.",
        openingLine:
          "HAR! So YOU'RE the pests who've been pinching my map and meddling with my gulls! Every song in the sky belongs to Squallbeard now, and you'll not take a single note of it!",
        goal: "Defeat Captain Squallbeard and free the Sky Songs.",
        whatWorks:
          "He stole the songs because he was laughed out of the island choir as a boy for being tone-deaf. Kind moves that invite him to sing along (without laughing) or tell him everyone deserves a song can crack him open. Bold moves like challenging him to a duel of wits in front of his crew, sneaky ones like tricking him into uncorking the jars, or silly ones like out-flamboyant-ing him with a ridiculous performance can all succeed, though he is a tough, clever opponent. Laughing at him, mocking his singing, or empty threats make his storm beard crackle and fail.",
        hint: "Squallbeard stole every song in the sky... why would someone want ALL the songs? Maybe because nobody ever let him have one of his own?",
        difficulty: "hard",
      },
    ],
  },
];

// Side characters' portraits follow a naming convention: /art/npc_<name>.jpg
for (const island of ISLANDS) {
  for (const c of island.challenges) {
    c.npc.portrait ??= `/art/npc_${c.npc.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}.jpg`;
  }
}
