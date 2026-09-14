import type { Movie } from '@/types/pelicula';

const rawPeliculas = [
  {
    id: 1,
    title: 'Inception',
    genre: 'Ciencia ficción',
    duration: 148,
    status: 'Disponible',
    description:
      'Dom Cobb es un ladrón especializado en la extracción de secretos del subconsciente mientras sus víctimas duermen. Cuando se le ofrece la oportunidad de tener su vida de vuelta si logra lo aparentemente imposible: implantar una idea en lugar de robarla (una acción conocida como "incepción"), Cobb reúne un equipo de especialistas para intentar esta peligrosa misión. Para ello, deben entrar en los sueños de un objetivo dentro de sueños dentro de sueños, donde las reglas de la realidad se retuercen y el tiempo es relativo.',
    author: 'Christopher Nolan',
    image:
      'https://i.pinimg.com/1200x/e2/dd/2d/e2dd2d4cacab4081ac8a16fd4bcaa69d.jpg',
  },
  {
    id: 2,
    title: 'The Matrix',
    genre: 'Acción',
    duration: 136,
    status: 'Disponible',
    description:
      'Thomas Anderson, un hacker conocido como Neo, descubre la verdad desgarradora: la realidad que cree que conoce es en realidad una simulación elaborada llamada The Matrix, creada por inteligencias artificiales para mantener a los humanos dóciles mientras sus cuerpos se utilizan como fuente de energía. Siendo una leyenda de la red, Neo es contactado por un grupo de rebeldes que creen que él es El Elegido, el único que puede manipular The Matrix y terminar la guerra entre máquinas y humanos. Con la ayuda de Morfeo y Trinity, Neo debe aceptar su destino y aprender que no hay límites excepto los que uno mismo cree.',
    author: 'Lana y Lilly Wachowski',
    image:
      'https://i.pinimg.com/1200x/a2/0b/e4/a20be4fbd8f1a710d8addfad59b78f30.jpg',
  },
  {
    id: 3,
    title: 'Interstellar',
    genre: 'Ciencia ficción',
    duration: 169,
    status: 'Próximamente',
    description:
      'En un futuro cercano, la Tierra se está convirtiendo en un planeta inhabitable debido a enfermedades de las cosechas y cambios climáticos. Cooper, un antiguo piloto de pruebas convertido en granjero, es reclutado por un grupo secreto de científicos de la NASA para liderar una misión a través de un agujero de gusano descubierto recientemente. Su objetivo es encontrar un nuevo planeta habitable para que la humanidad colonice. Dejando atrás a su familia, Cooper debe emprender un viaje épico a través del espacio que lo enfrentará a agujeros negros, relatividad del tiempo y los límites del amor humano.',
    author: 'Christopher Nolan',
    image:
      'https://i.pinimg.com/1200x/2a/7b/98/2a7b98b635a692903ffff839011c2acc.jpg',
  },
  {
    id: 4,
    title: 'Gladiator',
    genre: 'Acción',
    duration: 155,
    status: 'Disponible',
    description:
      'Maximus Decimus Meridius es un general romano poderoso y respetado que es admirado por el emperador Marco Aurelio. Sin embargo, cuando el emperador muere, su hijo corrupto Commodus toma el poder y, por celos de la lealtad de Maximus, lo traiciona. Maximus es despojado de su rango, su familia es asesinada y él es vendido como esclavo a un mercader de gladiadores. Ahora convertido en gladiador, Maximus debe luchar por su supervivencia en las arenas de Roma mientras planea su venganza contra el hombre que lo traicionó.',
    author: 'Ridley Scott',
    image:
      'https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png',
  },
  {
    id: 5,
    title: 'La La Land',
    genre: 'Musical',
    duration: 128,
    status: 'Disponible',
    description:
      'En Los Ángeles, Mia es una actriz aspirante que trabaja en un café mientras va a audiciones. Sebastian es un músico de jazz apasionado que sueña con abrir su propio club de jazz. Cuando se conocen, se produce una conexión instantánea. Mientras trabajan juntos para perseguir sus sueños, su relación se ve puesta a prueba por las realidades de la industria del entretenimiento, ambiciones conflictivas y las complejidades de la vida adulta. Una historia romántica ambientada en la ciudad de los sueños, con números musicales deslumbrantes que exploran temas de amor, sacrificio y perseverancia.',
    author: 'Damien Chazelle',
    image:
      'https://i.pinimg.com/736x/f1/9e/97/f19e971475ce211e44773f86c1e967a8.jpg',
  },
  {
    id: 6,
    title: 'Parasite',
    genre: 'Drama',
    duration: 132,
    status: 'Disponible',
    description:
      'La familia Kim vive en el semisótano de un pequeño edificio en Seúl, trabajando empleos precarios para sobrevivir. Cuando su hijo consigue trabajo como tutor particular en la adinerada familia Park, ve una oportunidad. Con astucia y coordinación cuidadosa, todos los miembros de la familia Kim se infiltran en la vida de los Park bajo falsas identidades, ganando acceso a su lujosa mansión y salarios que cambian sus vidas. Sin embargo, la mascarada no puede durar para siempre. Una película audaz que examina las tensiones de clase, la desesperación económica y las moralejas grises de la supervivencia.',
    author: 'Bong Joon-ho',
    image:
      'https://i.pinimg.com/736x/cf/69/59/cf6959e5d08ea2271c64271b64b92efc.jpg',
  },
  {
    id: 7,
    title: 'Dune',
    genre: 'Ciencia ficción',
    duration: 155,
    status: 'Disponible',
    description:
      'En el lejano futuro, Paul Atreides es el hijo del Duque Leto Atreides, quien es encargado de gobernar el planeta desértico Arrakis, el único lugar donde se produce la melange, una sustancia valiosa que es fundamental para el viaje interestelar. Sin embargo, la familia Atreides es traicionada y Paul debe huir hacia el desierto donde se esconde entre los Fremen, los nativos del planeta. Gracias a sus habilidades y su ascendencia, Paul se ve arrastrado hacia una revolución que podría cambiar el curso de la galaxia. Una epopeya de ciencia ficción sobre política, religión, ecología y el precio del poder.',
    author: 'Denis Villeneuve',
    image:
      'https://i.pinimg.com/736x/ec/53/e6/ec53e6a1733537aba98ef4198c1c1af0.jpg',
  },
  {
    id: 8,
    title: 'Whiplash',
    genre: 'Drama',
    duration: 106,
    status: 'Disponible',
    description:
      'Andrew Neiman es un joven baterista de jazz de diecinueve años que asiste a una prestigiosa escuela de música. Cuando es invitado a unirse a la banda de jazz más selecta de la escuela por su legendario y despiadado director Terence Fletcher, Andrew se siente abrumado pero decidido a impresionar. Fletcher es un perfeccionista abusivo que emplea tácticas brutales para motivar a sus estudiantes, sometiéndolos a un escrutinio viciosas e insultos constantes. Andrew se ve atrapado en una relación tóxica de competencia obsesiva y autodestrucción mientras lucha por alcanzar la perfección musical.',
    author: 'Damien Chazelle',
    image:
      'https://i.pinimg.com/736x/b5/f4/fd/b5f4fd18565a0a75dd3cdda447d69b95.jpg',
  },
  {
    id: 9,
    title: 'Arrival',
    genre: 'Ciencia ficción',
    duration: 116,
    status: 'Próximamente',
    description:
      'Doce naves espaciales alienígenas aparecen simultáneamente en diferentes ubicaciones alrededor del mundo. La Dra. Louise Banks, una renombrada lingüista, es reclutada por el ejército estadounidense junto con el físico Ian Donnelly para intentar comunicarse con los seres extraterrestres y descubrir sus intenciones. Mientras Louise dedica su tiempo a descodificar el idioma alienígena, descubre que aprender su lenguaje altera su percepción del tiempo y la realidad. La película explora temas de comunicación, sacrificio y si el conocimiento del futuro cambiaría nuestras acciones presentes.',
    author: 'Denis Villeneuve',
    image:
      'https://i.pinimg.com/1200x/98/15/32/98153206ed6bfa3a5f7acbd98aa451ea.jpg',
  },
  {
    id: 10,
    title: 'The Dark Knight',
    genre: 'Acción',
    duration: 152,
    status: 'Disponible',
    description:
      'Batman ha estado haciendo un progreso en la lucha contra el crimen en Gotham City, pero un nuevo criminal enigmático conocido como El Joker aparece y desata el caos en la ciudad. El Joker es un psicópata impredecible que no tiene maniobras predecibles, cometiendo actos de violencia aleatorios y desafiando constantemente a Batman. Con la ayuda del Fiscal del Distrito Harvey Dent y el oficial de policía James Gordon, Batman debe descubrir una manera de detener al Joker antes de que destruya la ciudad. Una película oscura y emocionante que examina la naturaleza del bien y el mal, así como los sacrificios necesarios para proteger a quienes amamos.',
    author: 'Christopher Nolan',
    image:
      'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008%29_film.jpg',
  },
  {
    id: 11,
    title: 'The Shawshank Redemption',
    genre: 'Drama',
    duration: 142,
    status: 'Disponible',
    description:
      'Andy Dufresne es sentenciado a cadena perpetua en la prisión de Shawshank por el asesinato de su esposa y el amante de ésta, aunque asegura su inocencia. En la prisión, forma una amistad improbable con Red, un preso experimentado y bien conectado. A lo largo de los años, Andy desarrolla un sistema de lavado de dinero para el corrupto director de la prisión mientras mantiene viva la esperanza. Mientras lucha contra la brutalidad y la desesperación de la vida en prisión, Andy elabora un plan de fuga meticulosamente calculado. Una historia profunda sobre esperanza, amistad y redención.',
    author: 'Frank Darabont',
    image:
      'https://i.pinimg.com/1200x/08/6f/fe/086ffeccab22baa2b4d49ab8787f9b90.jpg',
  },
  {
    id: 12,
    title: 'Pulp Fiction',
    genre: 'Crimen',
    duration: 154,
    status: 'Disponible',
    description:
      'Una colección de historias aparentemente inconexas sobre criminales, prostitutas, gánsters y boxeadores en Los Ángeles, presentadas de una manera no lineal. Vinny Vega y Jules Winnfield son dos asesinos a sueldo con una particular relación con su jefe Marsellus Wallace. Después de ejecutar su trabajo, se ven envueltos en situaciones cada vez más absurdas. El boxeador Butch Coolidge intenta escapar después de doble cruzar a Wallace, mientras que Wallace y su esposa Mia comparten una noche en la ciudad. A través de diálogos ingeniosos y escenas memorables, Tarantino teje estas historias en una narrativa caótica que examina la violencia, la lealtad y la vida en el crimen.',
    author: 'Quentin Tarantino',
    image:
      'https://i.pinimg.com/1200x/f0/01/3c/f0013ca4a05245afde43e0eaa7d1a2ce.jpg',
  },
  {
    id: 13,
    title: 'Forrest Gump',
    genre: 'Drama',
    duration: 142,
    status: 'Disponible',
    description:
      'Forrest Gump es un hombre del sur con un coeficiente intelectual bajo pero un gran corazón. A pesar de sus limitaciones cognitivas, Forrest logra cosas extraordinarias en la vida: se convierte en una estrella de fútbol americano, un héroe de guerra en Vietnam, un millonario empresario y juega tenis de mesa profesionalmente. A través de varias décadas del siglo XX, desde los años cincuenta hasta los ochenta, Forrest es testigo e inadvertidamente influye en varios eventos históricos importantes mientras persigue constantemente a su amor de la infancia, Jenny. Una película que celebra la persistencia, la bondad y el destino.',
    author: 'Robert Zemeckis',
    image:
      'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
  },
  {
    id: 14,
    title: 'Jurassic Park',
    genre: 'Aventura',
    duration: 127,
    status: 'Disponible',
    description:
      'El multimillonario John Hammond ha desarrollado la tecnología para clonar dinosaurios extintos usando ADN preservado en mosquitos fosilizados. Con esta biotecnología, crea un parque temático de clase mundial llamado Jurassic Park en una isla remota. Para asegurar que el parque es seguro, invita a un grupo de expertos, incluyendo un paleontólogo, una paleobotánica y un matemático, así como a sus nietos, para un recorrido preliminar. Sin embargo, un sabotaje desencadena un fallo en la seguridad, permitiendo que los dinosaurios escapen de sus recintos. Ahora, el grupo debe luchar por sobrevivir mientras son perseguidos por dinosaurios hambrientos en una batalla épica por la supervivencia.',
    author: 'Steven Spielberg',
    image:
      'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg',
  },
  {
    id: 15,
    title: 'The Godfather',
    genre: 'Crimen',
    duration: 175,
    status: 'Disponible',
    description:
      'Vito Corleone es el padrino de una familia criminal italiana, respetado por su poder y su capacidad de resolver disputas. Cuando su hijo menor Michael renuentemente se ve obligado a entrar en el negocio familiar después de un tiroteo que lo compromete, comienza un drama de sucesión. Michael debe aprender los mecanismos del negocio criminal mientras lidia con rivales de otras familias mafiosas. A través de traiciones, asesinatos y engaños políticos, Michael se transforma de un joven ingeniero en un capo de crimen despiadado. La película narra la evolución de la familia Corleone a través de tres generaciones, explorando temas de lealtad, honor, corrupción y el costo moral del poder.',
    author: 'Francis Ford Coppola',
    image: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
  },
  {
    id: 16,
    title: 'Avatar',
    genre: 'Ciencia ficción',
    duration: 162,
    status: 'Próximamente',
    description:
      "En el futuro lejano, los humanos han colonizado el exoplaneta Pandora, buscando una sustancia valiosa llamada unobtanium. Para interactuar con los nativos de Pandora, los Na'vi, los humanos controlan avatares, cuerpos biológicamente crecidos que son genéticamente similares a los Na'vi. Jake Sully es un antiguo soldado de Marines paralítico que se le da la oportunidad de conducir un avatar. Cuando es enviado a infiltrarse con el pueblo Na'vi para aprender más sobre ellos, Jake forma una conexión genuina con una princesa Na'vi llamada Neytiri. Dividido entre dos mundos, Jake debe elegir dónde está su verdadera lealtad cuando los humanos comienzan una operación militar destructiva contra Pandora.",
    author: 'James Cameron',
    image:
      'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg',
  },
  {
    id: 17,
    title: 'The Avengers',
    genre: 'Acción',
    duration: 143,
    status: 'Disponible',
    description:
      'Cuando el dios alienígena Loki intenta conquistar la Tierra robando el Teseracto, una fuente inagotable de poder, Nick Fury, director de la agencia SHIELD, reúne un equipo de extraordinarios individuos para defenderse. Iron Man, Captain America, Thor, Hulk, Black Widow y Hawkeye, aunque tienen personalidades conflictivas y pasados problemáticos, deben trabajar juntos como un equipo unificado. Mientras Loki desencadena su invasión alienígena con el ejército Chitauri, los Avengers deben superar sus diferencias, rivalidades personales y egos inflados para luchar por la supervivencia de la humanidad. Una épica de acción que marca el comienzo del universo cinematográfico Marvel.',
    author: 'Joss Whedon',
    image:
      'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg',
  },
  {
    id: 18,
    title: 'Titanic',
    genre: 'Romance',
    duration: 194,
    status: 'Disponible',
    description:
      'En 1912, la pasajera de primera clase Rose DeWitt Bukater está prometida con el rico pero controlador Cal Hockley. Sintiéndose atrapada por su futuro preestablecido, Rose conoce a Jack Dawson, un artista pobre que ganó su boleto de tercera clase en una partida de póquer. A pesar de sus diferencias de clase, Jack y Rose se enamorran profundamente durante el viaje inaugural del Titanic. Sin embargo, su romance se ve interrumpido cuando el barco golpea un iceberg durante la noche y comienza a hundirse. Con poco espacio en los botes salvavidas, Jack y Rose luchan por mantenerse juntos mientras se enfrentan a la catástrofe inminente. Una epopeya romántica épica que combina drama histórico con una historia de amor perdurable.',
    author: 'James Cameron',
    image:
      'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png',
  },
  {
    id: 19,
    title: 'The Lion King',
    genre: 'Animación',
    duration: 88,
    status: 'Disponible',
    description:
      'Simba es el joven príncipe del Reino Animal, hijo del majestuoso Rey Mufasa. Simba ama su vida en la Roca del Rey y está emocionado por su futura responsabilidad como rey. Sin embargo, su tío celoso Scar orquesta la muerte de Mufasa en una estampida de ñus, culpando a Simba. Devastado y culpable, Simba huye del reino. Años más tarde, cuando es adulto, Simba se encuentra con su vieja amiga Nala, quien le informa que Scar ha convertido el reino en un páramo desolado bajo su tiránico gobierno. Simba debe encontrar el coraje para enfrentarse a su tío, reclamar su destino y restaurar la circulación de la vida al Reino Animal. Una película animada clásica con música memorables que explora temas de responsabilidad, pérdida y redencion.',
    author: 'Roger Allers y Rob Minkoff',
    image:
      'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_%281994%29_poster.jpg',
  },
  {
    id: 20,
    title: 'Oppenheimer',
    genre: 'Biografía',
    duration: 180,
    status: 'Disponible',
    description:
      'J. Robert Oppenheimer es un físico estadounidense brillante y conflictivo que es seleccionado para dirigir el Proyecto Manhattan, una iniciativa ultrasecreta del gobierno para desarrollar la primera bomba atómica durante la Segunda Guerra Mundial. Oppenheimer reúne a los mejores científicos del mundo en Los Alamos, Nuevo México, bajo una presión inmensa para ganar la carrera armamentística nuclear contra los nazis. A medida que el proyecto progresa hacia la detonación de la primera bomba atómica, Oppenheimer se ve atormentado por las implicaciones morales y éticas de su creación. La película examina la vida personal y profesional de Oppenheimer antes, durante y después del proyecto, incluyendo su conflicto con la política de la Guerra Fría posterior y los interrogatorios sobre su lealtad política.',
    author: 'Christopher Nolan',
    image:
      'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
  },
];

const clasificaciones = [
  'PG-13',
  'PG-13',
  'PG-13',
  'R',
  'PG-13',
  'R',
  'PG-13',
  'R',
  'PG',
  'PG-13',
  'R',
  'R',
  'PG',
  'PG',
  'R',
];
const salas = [
  'Sala 1',
  'Sala 2',
  'Sala 1',
  'Sala 3',
  'Sala 2',
  'Sala 1',
  'Sala 4',
  'Sala 3',
  'Sala 2',
  'Sala 1',
  'Sala 3',
  'Sala 2',
  'Sala 1',
  'Sala 4',
  'Sala 3',
  'Sala 2',
  'Sala 1',
  'Sala 3',
  'Sala 2',
  'Sala 1',
];
const precios = [
  5.0, 6.0, 5.5, 7.0, 5.0, 8.0, 6.0, 9.0, 5.5, 7.0, 6.0, 5.0, 7.5, 8.0, 6.0,
  5.5, 9.0, 6.0, 5.0, 7.0,
];

export const peliculas: Movie[] = rawPeliculas.map((p, i) => ({
  ...p,
  clasificacion: clasificaciones[i],
  sala: salas[i],
  precio: precios[i],
}));
