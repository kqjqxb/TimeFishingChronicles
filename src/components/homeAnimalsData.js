export default [
    {
        id: 1,
        title: 'African Lion',
        habitat: 'Savannas of Africa south of the Sahara (Kenya, Tanzania, South Africa)',
        behaviors: [
            {
                id: 1,
                behavior: 'Hunt in groups, targeting wildebeest and zebras.',
            },
            {
                id: 2,
                behavior: 'Active at night, sleeping up to 20 hours during the day.',
            },
            {
                id: 3,
                behavior: 'Males mark territory with roars (audible up to 8 km away!).',
            },
        ],
        prideStracture: [
            {
                id: 1,
                pride: '5–30 members: 1–2 males, related lionesses, cubs.',
            },
            {
                id: 2,
                pride: 'Young males are exiled at 2–3 years old.',
            },
        ],
        status: 'Vulnerable (~20,000 remain)',
        image: require('../assets/images/homeAnimals/lion1.png'),
        messageImage: require('../assets/images/homeAnimals/messages/message1.png'),
    },
    {
        id: 2,
        title: 'Indian Lion',
        habitat: 'Gir Wildlife Sanctuary, India (once ranged from Greece to Bangladesh)',
        behaviors: [
            {
                id: 1,
                behavior: 'Hunt solo or in small groups (prey: deer and wild boar).',
            },
            {
                id: 2,
                behavior: 'Less aggressive than African lions.',
            },
            {
                id: 3,
                behavior: 'Often rest in trees.',
            },
        ],
        prideStracture: [
            {
                id: 1,
                pride: 'Small groups (2–3 females), males live separately.',
            },
            {
                id: 2,
                pride: 'A male’s territory spans up to 150 km².',
            },
        ],
        status: 'Endangered (~674 individuals)',
        image: require('../assets/images/homeAnimals/lion2.png'),
        messageImage: require('../assets/images/homeAnimals/messages/message2.png'),
    },
    {
        id: 3,
        title: 'Atlas Lion',
        habitat: 'Extinct. Formerly the Atlas Mountains (Morocco, Algeria, Tunisia)',
        behaviors: [
            {
                id: 1,
                behavior: 'Hunted boars and deer in mountain forests.',
            },
            {
                id: 2,
                behavior: 'Survived temperatures as low as -10°C.',
            },
            {
                id: 3,
                behavior: 'Legends say its roar terrified Roman legions.',
            },
        ],
        prideStracture: [
            {
                id: 1,
                pride: 'Small families due to scarce resources.',
            },
            {
                id: 2,
                pride: 'Males were highly aggressive to outsiders.',
            },
        ],
        status: 'Extinct in 1942 (last one killed by a poacher in Morocco)',
        image: require('../assets/images/homeAnimals/lion3.png'),
        messageImage: require('../assets/images/homeAnimals/messages/message3.png'),
    },
    {
        id: 4,
        title: 'Cape Lion',
        habitat: 'Extinct. Once roamed southern Africa (Cape of Good Hope)',
        behaviors: [
            {
                id: 1,
                behavior: 'Hunted antelope and ostriches in arid regions.',
            },
            {
                id: 2,
                behavior: 'Notoriously aggressive—attacked humans more than other subspecies.',
            },
        ],
        prideStracture: [
            {
                id: 1,
                pride: 'Nomadic groups of 2–5 individuals.',
            },
            {
                id: 2,
                pride: 'Males rarely controlled prides longer than 2 years.',
            },
        ],
        status: 'Extinct by the 1860s (killed by colonists)',
        image: require('../assets/images/homeAnimals/lion4.png'),
        messageImage: require('../assets/images/homeAnimals/messages/message4.png'),
    },
    {
        id: 5,
        title: 'Cave Lion',
        habitat: 'Extinct. Ice Age Europe and Siberia, 10,000 years ago',
        behaviors: [
            {
                id: 1,
                behavior: 'Hunted woolly rhinos and muskoxen.',
            },
            {
                id: 2,
                behavior: 'Weighed up to 400 kg (30% larger than modern lions!).',
            },
            {
                id: 3,
                behavior: 'Depicted in France’s Chauvet Cave paintings.',
            },
        ],
        prideStracture: [
            {
                id: 1,
                pride: 'Debated: lived in groups or solo.',
            },
        ],
        status: 'Extinct due to climate change and human competition',
        image: require('../assets/images/homeAnimals/lion5.png'),
        messageImage: require('../assets/images/homeAnimals/messages/message5.png'),
    },
]