<?php

namespace App\Data;

/**
 * Données d'événements historiques japonais (800-1900)
 * Pour enrichir la timeline avec des événements politiques et duels majeurs
 */
class HistoricalEventsData
{
    /**
     * Retourne un tableau d'événements historiques
     * Structure: ['year' => int, 'date' => string, 'title' => string, 'type' => string, 'description' => string]
     * 
     * @return array
     */
    public static function getHistoricalEvents(): array
    {
        return [
            // Période Heian (794-1185)
            [
                'year' => 794,
                'date' => '794-11-18',
                'title' => 'Fondation de Heian-kyō (Kyoto)',
                'type' => 'politique',
                'description' => 'L\'empereur Kanmu établit une nouvelle capitale impériale à Heian-kyō (la "Capitale de la Paix et de la Tranquillité"), aujourd\'hui Kyoto. Ce déménagement depuis Nara marque le début de la brillante période Heian, âge d\'or de la culture aristocratique japonaise qui verra l\'émergence de la littérature classique, de l\'art raffiné et des premières traditions chevaleresques qui donneront naissance aux samouraïs.'
            ],
            [
                'year' => 858,
                'date' => '858-09-10',
                'title' => 'Fujiwara no Yoshifusa devient régent',
                'type' => 'politique',
                'description' => 'Fujiwara no Yoshifusa devient le premier régent (sesshō) du Japon n\'appartenant pas à la famille impériale. En mariant systématiquement ses filles aux empereurs, le clan Fujiwara établit une emprise politique qui durera des siècles. Cette stratégie matrimoniale permettra aux Fujiwara de gouverner le Japon dans l\'ombre pendant près de 300 ans, contrôlant la cour impériale tout en laissant l\'empereur comme figure symbolique.'
            ],
            [
                'year' => 1051,
                'date' => '1051-07-01',
                'title' => 'Début de la guerre de Zenkunen',
                'type' => 'politique',
                'description' => 'La guerre de Zenkunen (九年の役) éclate dans les provinces du nord entre le clan Minamoto et le clan Abe. Ce conflit de neuf ans marque un tournant historique : pour la première fois, des guerriers provinciaux (les futurs samouraïs) s\'affrontent dans une guerre majeure, loin de la cour raffinée de Kyoto. Le clan Minamoto, dirigé par Minamoto no Yoriyoshi, émergera victorieux, établissant sa réputation militaire qui culminera avec la fondation du premier shogunat 130 ans plus tard.'
            ],
            
            // Période Kamakura (1185-1333)
            [
                'year' => 1185,
                'date' => '1185-04-25',
                'title' => 'Bataille de Dan-no-ura',
                'type' => 'politique',
                'description' => 'Dans le détroit de Shimonoseki, la bataille navale de Dan-no-ura met fin à la guerre de Genpei qui a déchiré le Japon pendant cinq ans. Les forces Minamoto de Yoritomo écrasent définitivement le clan Taira. L\'empereur enfant Antoku, âgé de seulement 6 ans, périt noyé avec les trésors impériaux. Cette victoire marque la fin de l\'ère aristocratique et l\'avènement du règne des guerriers. Le Japon entre dans l\'ère des samouraïs qui dominera pendant 700 ans.'
            ],
            [
                'year' => 1192,
                'date' => '1192-07-12',
                'title' => 'Minamoto no Yoritomo devient Shogun',
                'type' => 'politique',
                'description' => 'Minamoto no Yoritomo reçoit officiellement le titre de Seii Taishōgun ("Grand Général Pacificateur des Barbares") de l\'empereur Go-Toba. De sa capitale de Kamakura, loin de la cour impériale de Kyoto, il établit le premier bakufu (gouvernement militaire). Cette dualité du pouvoir - l\'empereur à Kyoto gardant l\'autorité symbolique, le shogun à Kamakura détenant le pouvoir réel - définira la structure politique japonaise jusqu\'en 1868. C\'est la naissance officielle du système féodal japonais et de la suprématie des samouraïs.'
            ],
            [
                'year' => 1221,
                'date' => '1221-06-15',
                'title' => 'Rébellion de Jōkyū',
                'type' => 'politique',
                'description' => 'L\'empereur retraité Go-Toba, frustré par l\'emprise du bakufu de Kamakura, lève une armée pour restaurer le pouvoir impérial. Mais les guerriers samouraïs du régent Hōjō Yoshitoki marchent sur Kyoto et écrasent rapidement les forces impériales. Go-Toba est exilé sur l\'île d\'Oki où il mourra en captivité. Cette défaite humiliante de la noblesse face aux guerriers consacre définitivement la suprématie militaire des samouraïs sur l\'aristocratie de cour. Le shogunat de Kamakura en sort renforcé pour plus d\'un siècle.'
            ],
            [
                'year' => 1274,
                'date' => '1274-11-19',
                'title' => 'Première invasion mongole',
                'type' => 'politique',
                'description' => 'Kubilai Khan, petit-fils de Gengis Khan et empereur de la dynastie Yuan chinoise, lance une flotte de 900 navires et 40 000 guerriers mongols et coréens vers le Japon. Débarquant à Kyushu, les envahisseurs massacrent les défenseurs japonais avec leurs tactiques de combat en formation et leurs armes explosives inconnues. Mais une violente tempête détruit une grande partie de la flotte mongole dans la nuit, forçant les survivants à se retirer. Les Japonais y voient la main divine et appellent ce typhon "kamikaze" (vent des dieux).'
            ],
            [
                'year' => 1281,
                'date' => '1281-08-15',
                'title' => 'Seconde invasion mongole',
                'type' => 'politique',
                'description' => 'Kubilai Khan revient à la charge avec une armada colossale de 4 400 navires et 140 000 hommes - la plus grande force d\'invasion maritime de l\'Histoire avant le débarquement de Normandie. Durant sept semaines, les samouraïs japonais résistent héroïquement derrière les murailles qu\'ils ont construites après la première invasion. Puis, miraculeusement, un second typhon dévastateur s\'abat sur la flotte mongole, coulant des milliers de navires et noyant près de 100 000 hommes. Le Japon est sauvé, mais le coût financier ruinera le shogunat de Kamakura.'
            ],
            
            // Période Muromachi (1336-1573)
            [
                'year' => 1336,
                'date' => '1336-08-11',
                'title' => 'Établissement du shogunat Ashikaga',
                'type' => 'politique',
                'description' => 'Après avoir trahi l\'empereur Go-Daigo qu\'il était censé servir, le général Ashikaga Takauji s\'empare du pouvoir et fonde le shogunat Ashikaga, également appelé shogunat Muromachi d\'après le quartier de Kyoto où il établit son bakufu. Contrairement aux Minamoto qui gouvernaient depuis Kamakura, les Ashikaga choisissent de s\'installer à Kyoto même, au cœur du pouvoir impérial. Cette période verra l\'épanouissement des arts zen, de la cérémonie du thé, de l\'arrangement floral et de l\'architecture des jardins, mais aussi une instabilité politique croissante.'
            ],
            [
                'year' => 1392,
                'date' => '1392-10-05',
                'title' => 'Réunification des cours impériales',
                'type' => 'politique',
                'description' => 'Après 56 ans de division, le shogun Ashikaga Yoshimitsu parvient à réunifier les cours impériales rivales du Nord et du Sud. Depuis 1336, deux empereurs se disputaient la légitimité : l\'un à Kyoto (cour du Nord, soutenue par les Ashikaga), l\'autre à Yoshino (cour du Sud, descendant de Go-Daigo). Cette réconciliation met fin au Nanboku-chō (période des cours du Nord et du Sud) et rétablit théoriquement l\'unité impériale, même si le vrai pouvoir reste fermement entre les mains du shogunat.'
            ],
            [
                'year' => 1467,
                'date' => '1467-05-26',
                'title' => 'Début de la guerre d\'Ōnin',
                'type' => 'politique',
                'description' => 'Une querelle de succession au sein du shogunat Ashikaga dégénère en guerre civile dévastatrice. Pendant 11 ans, Kyoto devient un champ de bataille où s\'affrontent les armées des clans Hosokawa et Yamana, transformant la capitale impériale en ruines fumantes. Les temples millénaires brûlent, les palais sont détruits, la population fuit. Mais surtout, cette guerre marque l\'effondrement total de l\'autorité du shogunat. Le Japon sombre dans le chaos de la période Sengoku (États en Guerre) où les daimyō provinciaux se battront pour la suprématie pendant plus d\'un siècle.'
            ],
            [
                'year' => 1543,
                'date' => '1543-08-25',
                'title' => 'Arrivée des Portugais et des armes à feu',
                'type' => 'politique',
                'description' => 'Un navire marchand portugais fait naufrage sur l\'île de Tanegashima. À bord se trouvent les premiers arquebuses (tanegashima) que les Japonais n\'ont jamais vues. Le seigneur local, fasciné par ces "bâtons de feu", achète les armes à prix d\'or et ordonne à ses forgerons de les reproduire. En quelques années, les arquebuses japonaises deviennent les meilleures d\'Asie. Cette révolution militaire change radicalement l\'art de la guerre des samouraïs : les charges de cavalerie et les duels individuels cèdent la place aux formations d\'arquebusiers. Les daimyō qui adopteront rapidement ces armes domineront les batailles à venir.'
            ],
            
            // Période Sengoku et unification (1467-1603)
            [
                'year' => 1560,
                'date' => '1560-06-12',
                'title' => 'Bataille d\'Okehazama',
                'type' => 'politique',
                'description' => 'Dans une gorge étroite près de Nagoya, le jeune Oda Nobunaga, avec seulement 3 000 hommes, attaque audacieusement l\'immense armée de 25 000 guerriers d\'Imagawa Yoshimoto qui marchait sur Kyoto. Profitant d\'un orage violent pour masquer ses mouvements, Nobunaga lance une attaque surprise dévastatrice sur le campement d\'Imagawa. Dans la confusion, il parvient à tuer Imagawa lui-même. Cette victoire incroyable contre toute attente propulse le "Roi Démon" Nobunaga sur la scène nationale et marque le début de sa campagne d\'unification impitoyable du Japon.'
            ],
            [
                'year' => 1575,
                'date' => '1575-06-29',
                'title' => 'Bataille de Nagashino',
                'type' => 'politique',
                'description' => 'Face à la redoutable cavalerie Takeda, réputée invincible depuis des décennies, Oda Nobunaga révolutionne l\'art de la guerre. Il déploie 3 000 arquebusiers derrière des palissades en bois et les organise en trois rangs qui tirent en rotation continue - une tactique jamais vue au Japon. Lorsque la cavalerie d\'élite Takeda charge, elle est fauchée par des salves incessantes. En quelques heures, la légende Takeda s\'effondre dans le sang et la boue. Cette bataille prouve définitivement la supériorité des armes à feu sur les méthodes traditionnelles et transforme la nature même de la guerre des samouraïs.'
            ],
            [
                'year' => 1582,
                'date' => '1582-06-21',
                'title' => 'Incident de Honnō-ji',
                'type' => 'politique',
                'description' => 'Dans la nuit du 21 juin, alors qu\'Oda Nobunaga séjourne au temple Honnō-ji à Kyoto avec seulement une petite escorte, son général Akechi Mitsuhide l\'encercle avec une armée de 13 000 hommes. Réveillé par les cris et le fracas des armes, Nobunaga comprend immédiatement qu\'il est trahi. Combattant vaillamment avec un arc puis une lance jusqu\'à être grièvement blessé, il se retire dans les flammes du temple et commet seppuku. L\'homme qui avait presque unifié le Japon meurt à 49 ans, assassiné par son propre vassal. Son corps ne sera jamais retrouvé dans les cendres.'
            ],
            [
                'year' => 1590,
                'date' => '1590-08-04',
                'title' => 'Siège d\'Odawara',
                'type' => 'politique',
                'description' => 'Toyotomi Hideyoshi, désormais maître incontesté du Japon central, marche sur le dernier grand obstacle à l\'unification totale : le puissant clan Hōjō retranché dans l\'impre nable forteresse d\'Odawara. Plutôt que d\'assaillir les murailles, Hideyoshi déploie 200 000 hommes dans un siège patient et méthodique. Il construit une ville de campement luxueuse, organise des cérémonies de thé, fait venir des courtisanes et des marchands. Après trois mois de ce siège théâtral, les Hōjō capitulent sans combat majeur. L\'unification du Japon, commencée par Nobunaga, est enfin achevée par Hideyoshi.'
            ],
            [
                'year' => 1600,
                'date' => '1600-10-21',
                'title' => 'Bataille de Sekigahara',
                'type' => 'politique',
                'description' => 'Dans une vallée brumeuse près du village de Sekigahara, 160 000 samouraïs s\'affrontent dans ce qui sera la bataille la plus décisive de l\'histoire japonaise. D\'un côté, Tokugawa Ieyasu et son armée de l\'Est ; de l\'autre, Ishida Mitsunari défendant l\'héritage du fils de Hideyoshi. La bataille fait rage toute la matinée dans l\'incertitude. Puis, au moment crucial, plusieurs daimyō de l\'Ouest trahissent Mitsunari et retournent leurs bannières. En six heures de combat féroce, 30 000 hommes périssent. La victoire d\'Ieyasu est totale et ouvrira la voie à 260 ans de paix Tokugawa.'
            ],
            
            // Période Edo (1603-1868)
            [
                'year' => 1603,
                'date' => '1603-03-24',
                'title' => 'Établissement du shogunat Tokugawa',
                'type' => 'politique',
                'description' => 'L\'empereur Go-Yōzei confère officiellement le titre de Seii Taishōgun à Tokugawa Ieyasu. À 60 ans, le rusé stratège qui a survécu à toutes les guerres de l\'ère Sengoku établit son bakufu à Edo (future Tokyo), loin de l\'influence de la cour de Kyoto. Il met en place un système de contrôle féodal ingénieux : le sankin-kōtai force les daimyō à résider alternativement à Edo et dans leurs provinces, laissant toujours femmes et enfants en otages dans la capitale. Cette période Edo apportera 260 ans de paix - la Pax Tokugawa - durant laquelle les arts, la littérature et la culture urbaine s\'épanouiront, tandis que les samouraïs deviennent bureaucrates.'
            ],
            [
                'year' => 1612,
                'date' => '1612-04-13',
                'title' => 'Duel de Ganryū-jima',
                'type' => 'duel',
                'description' => 'À l\'aube, sur l\'île déserte de Ganryū entre Honshu et Kyushu, se déroule le plus légendaire duel de l\'histoire des samouraïs. Miyamoto Musashi, 28 ans, rônin errant et escrimeur invaincu, affronte Sasaki Kojirō, maître du style Ganryū et gardien du daimyō Hosokawa, réputé pour son coup mortel Tsubame Gaeshi. Musashi arrive en retard - tactique psychologique délibérée - avec une épée de bois taillée dans une rame de barque. Le duel ne dure que quelques secondes. Musashi esquive de justesse le coup légendaire de Kojirō et l\'abat d\'un seul coup de bokken au crâne. Kojirō meurt sur le sable. Musashi repart sans un mot, immortalisant ce duel dans les légendes.'
            ],
            [
                'year' => 1614,
                'date' => '1614-11-19',
                'title' => 'Siège d\'hiver d\'Osaka',
                'type' => 'politique',
                'description' => 'Tokugawa Ieyasu, bien que retiré officiellement, décide d\'éliminer la dernière menace à sa dynastie : Toyotomi Hideyori, fils de Hideyoshi, retranché dans l\'imprenable château d\'Osaka avec sa mère Yodo-dono et 100 000 rōnin loyalistes. Ieyasu déploie 200 000 hommes et des canons européens contre les murailles cyclopéennes. Les assiégés résistent héroïquement. Après deux mois de pilonnage, Ieyasu propose une paix trompeuse : en échange de la fin du siège, il comble les douves extérieures du château. Une fois la trêve conclue, il fait combler toutes les douves, même intérieures, rendant le château vulnérable.'
            ],
            [
                'year' => 1615,
                'date' => '1615-06-04',
                'title' => 'Siège d\'été d\'Osaka',
                'type' => 'politique',
                'description' => 'Le piège d\'Ieyasu se referme. Sans ses douves, le château d\'Osaka n\'est plus invincible. En mai 1615, les armées Tokugawa reviennent pour l\'assaut final. Malgré la bravoure désespérée des défenseurs, les Tokugawa submergent les murailles. Hideyori, âgé de seulement 22 ans, et sa mère Yodo-dono commettent seppuku tandis que les flammes dévorent le château. Les soldats Tokugawa massacrent systématiquement tous les survivants Toyotomi, femmes et enfants inclus. Le clan qui unifia le Japon sous Hideyoshi est effacé de l\'Histoire. La lignée Tokugawa règnera sans partage pendant 250 ans.'
            ],
            [
                'year' => 1637,
                'date' => '1637-12-17',
                'title' => 'Rébellion de Shimabara',
                'type' => 'politique',
                'description' => 'Dans la péninsule de Shimabara, des milliers de paysans chrétiens et de rōnin sans maître, poussés à bout par la famine et la persécution religieuse, se soulèvent sous la bannière d\'un jeune chef charismatique de 16 ans, Amakusa Shirō. Les rebelles s\'emparent du château délabré de Hara et y résistent pendant quatre mois contre 125 000 soldats du shogunat. Le siège est terrible : canons néerlandais, assauts suicidaires, famine. Finalement, les murs tombent. Le shogunat massacre les 37 000 défenseurs jusqu\'au dernier - hommes, femmes, enfants. Cette boucherie marque la fin du christianisme au Japon pour deux siècles.'
            ],
            [
                'year' => 1641,
                'date' => '1641-01-01',
                'title' => 'Politique de Sakoku',
                'type' => 'politique',
                'description' => 'Traumatisé par la rébellion de Shimabara et craignant l\'influence déstabilisatrice des Européens, le shogunat promulgue les édits de Sakoku (pays verrouillé). Le Japon se ferme hermétiquement au monde extérieur : les Portugais sont expulsés, les Espagnols interdits, tout chrétien traqué, tout Japonais qui quitte le pays ne peut plus revenir sous peine de mort. Seuls les Néerlandais, jugés plus intéressés par le commerce que par la religion, obtiennent le privilège de commercer depuis l\'îlot artificiel de Dejima à Nagasaki. Cette fermeture radicale durera 220 ans, faisant du Japon un mystère pour l\'Occident.'
            ],
            [
                'year' => 1701,
                'date' => '1701-03-14',
                'title' => 'Incident qui mène aux 47 Rōnin',
                'type' => 'duel',
                'description' => 'Dans les corridors du château d\'Edo, le daimyō Asano Naganori, seigneur d\'Akō, dégaine son sabre et blesse Kira Yoshinaka, un haut fonctionnaire arrogant du shogunat qui l\'a humilié publiquement pendant des semaines. Dégainer une arme dans le château du shogun est un crime capital. Le shogun Tsunayoshi ordonne à Asano de commettre seppuku le jour même, confisque son domaine et disperse ses 300 samouraïs qui deviennent des rōnin (guerriers sans maître). Mais 47 d\'entre eux, menés par l\'intendant Ōishi Kuranosuke, jurent secrètement de venger leur seigneur, même si cela signifie leur propre mort. Commence alors deux années de préparation clandestine.'
            ],
            [
                'year' => 1703,
                'date' => '1703-01-30',
                'title' => 'Vengeance des 47 Rōnin',
                'type' => 'duel',
                'description' => 'Par une nuit de neige glaciale, les 47 rōnin, déguisés en marchands pendant deux ans pour endormir la vigilance de Kira, lancent leur assaut sur sa résidence fortifiée. Divisés en deux groupes, ils escaladent les murs à l\'aube, neutralisent les gardes et envahissent la demeure. Après une bataille acharnée, ils trouvent Kira terrorisé, caché dans une remise à charbon. Ōishi lui offre l\'honneur du seppuku, mais Kira refuse lâchement. Alors Ōishi le décapite du même sabre qui servit à Asano. Les 47 traversent Edo en procession, la tête de Kira sur une pique, et la déposent sur la tombe d\'Asano. Leur vengeance accomplie, ils se rendent et commet tent tous seppuku ensemble. Le Japon pleure ces héros du code Bushido.'
            ],
            [
                'year' => 1716,
                'date' => '1716-08-13',
                'title' => 'Début des réformes Kyōhō',
                'type' => 'politique',
                'description' => 'Le huitième shogun Tokugawa Yoshimune, surnommé le "Roi-Riz", constate que le bakufu est au bord de la ruine financière après un siècle de paix qui a transformé les samouraïs en bureaucrates endettés et oisifs. Il lance les réformes Kyōhō : austérité drastique, encouragement à la culture du riz, création d\'une boîte à suggestions pour le peuple, réforme du système judiciaire, et même levée partielle de l\'interdit sur les livres occidentaux (sauf ceux sur le christianisme). Ces réformes pragmatiques stabilisent les finances et modernisent modestement l\'administration, mais ne peuvent empêcher le déclin structurel du système féodal.'
            ],
            [
                'year' => 1787,
                'date' => '1787-06-01',
                'title' => 'Réformes Kansei',
                'type' => 'politique',
                'description' => 'Face à la corruption généralisée, aux famines récurrentes et à l\'affaiblissement moral de la classe samouraï qui préfère désormais les plaisirs urbains aux vertus martiales, le régent Matsudaira Sadanobu impose les réformes Kansei. C\'est un retour réactionnaire aux valeurs rigides du bushido : interdiction des romans populaires, fermeture des maisons de plaisir, censure des théâtres kabuki, obligation pour les samouraïs d\'étudier les classiques confucéens, réduction des dépenses somptuaires. Ces réformes ultra-conservatrices, bien qu\'efficaces économiquement, étouffent la vie culturelle d\'Edo et rendent le shogunat de plus en plus impopulaire.'
            ],
            [
                'year' => 1792,
                'date' => '1792-10-05',
                'title' => 'Incident de Laxman',
                'type' => 'politique',
                'description' => 'Le lieutenant russe Adam Laxman débarque à Nemuro, Hokkaido, avec un navire chargé de présents et une lettre de Catherine II demandant l\'ouverture de relations commerciales. C\'est la première tentative officielle d\'une puissance européenne de percer l\'isolement japonais depuis 150 ans. Le shogunat, pris au dépourvu, tergiverse pendant des mois avant de refuser poliment mais fermement, ne remettant à Laxman qu\'un laissez-passer pour un seul navire à Nagasaki. Les Russes reviendront. Le verrou du Sakoku commence à céder sous la pression extérieure croissante.'
            ],
            [
                'year' => 1808,
                'date' => '1808-10-04',
                'title' => 'Incident du HMS Phaeton',
                'type' => 'politique',
                'description' => 'En pleine guerre napoléonienne, la frégate britannique HMS Phaeton force l\'entrée du port de Nagasaki, seul point de contact du Japon avec l\'extérieur. Le commandant prend en otages les marchands néerlandais présents et exige eau, nourriture et combustible sous menace de bombarder la ville. Les autorités japonaises, honteuses et impuissantes face à la supériorité militaire occidentale, s\'exécutent. Le gouverneur de Nagasaki, humilié par cette violation de la souveraineté japonaise, se fait seppuku pour racheter son échec. Cet incident traumatisant révèle brutalement au shogunat l\'obsolescence de ses défenses côtières et de sa marine.'
            ],
            [
                'year' => 1825,
                'date' => '1825-02-18',
                'title' => 'Édit de répulsion des navires étrangers',
                'type' => 'politique',
                'description' => 'Paniqué par la multiplication des intrusions de navires baleiniers et explorateurs occidentaux le long des côtes japonaises, le shogunat promulgue le Ninen Nashi Rei (Édit sans Seconde Pensée) : tout navire étranger approchant les côtes, quelle qu\'en soit la raison (naufrage, tempête, commerce), doit être immédiatement chassé à coups de canon ou coulé, sans sommation ni négociation. Cet ordre, d\'une rigidité et d\'une xénophobie extrêmes, sera appliqué pendant près de 20 ans, multipliant les incidents diplomatiques et creusant l\'isolement du Japon, alors que les puissances occidentales s\'impatientent de plus en plus.'
            ],
            [
                'year' => 1853,
                'date' => '1853-07-08',
                'title' => 'Arrivée des Navires Noirs',
                'type' => 'politique',
                'description' => 'Par un après-midi d\'été, quatre navires de guerre américains à vapeur - les "kurofune" (navires noirs) - apparaissent dans la baie d\'Edo, crachant une fumée inquiétante. Le commodore Matthew Perry, envoyé par le président Fillmore, débarque avec une lettre exigeant l\'ouverture du Japon au commerce. Les batteries côtières japonaises sont impuissantes face aux canons modernes de Perry. Toute la population d\'Edo est dans la panique : depuis 220 ans, aucun étranger n\'a foulé cette terre. Perry annonce qu\'il reviendra l\'année suivante chercher la réponse, laissant le shogunat dans le chaos. Le verrou du Sakoku est brisé. L\'ère des samouraïs touche à sa fin.'
            ],
            [
                'year' => 1854,
                'date' => '1854-03-31',
                'title' => 'Traité de Kanagawa',
                'type' => 'politique',
                'description' => 'Perry revient avec encore plus de navires et de canons. Le shogunat, divisé et impuissant, capitule : le traité de Kanagawa ouvre les ports de Shimoda et Hakodate aux navires américains, accorde assistance aux naufragés, et prévoit l\'installation d\'un consul américain. C\'est la fin officielle du Sakoku après 220 ans d\'isolement. En quelques années, des traités similaires seront signés avec la Russie, la Grande-Bretagne, la France et les Pays-Bas. Le Japon féodal se retrouve brutalement confronté à la modernité occidentale. Cette humiliation nationale va déclencher une crise politique qui aboutira à la chute du shogunat en 1868.'
            ],
            [
                'year' => 1860,
                'date' => '1860-03-24',
                'title' => 'Incident de Sakuradamon',
                'type' => 'duel',
                'description' => 'Par une matinée neigeuse de mars, le cortège du tairō (régent) Ii Naosuke traverse la porte Sakuradamon du château d\'Edo. Ii est l\'homme fort du shogunat, celui qui a imposé par la terreur la signature des traités avec les étrangers et réprimé brutalement toute opposition (Ansei no Taigoku). Soudain, 18 samouraïs rōnin du domaine de Mito surgissent de la neige et attaquent l\'escorte. Dans un combat acharné, ils massacrent les gardes et décapitent Ii dans son palanquin. Les assassins déposent fièrement la tête devant le shogunat avant de se faire seppuku. Cet assassinat en plein jour du dirigeant du Japon révèle la faiblesse terminale du bakufu et ouvre une décennie de chaos qui mènera à la restauration impériale.'
            ],
            [
                'year' => 1863,
                'date' => '1863-08-15',
                'title' => 'Bombardement de Kagoshima',
                'type' => 'politique',
                'description' => 'Un an après l\'incident de Namamugi où des samouraïs de Satsuma ont tué un marchand britannique, une escadre de la Royal Navy mouille devant Kagoshima exigeant réparations. Le daimyō de Satsuma refuse avec arrogance. Les Britanniques ouvrent le feu : pendant deux jours, leurs canons rayés de dernière génération pulvérisent la ville. Les batteries côtières japonaises, courageuses mais obsolètes, sont anéanties. Kagoshima brûle. Paradoxalement, cette humiliation militaire convainc les samouraïs de Satsuma de la nécessité de moderniser d\'urgence. Abandonnant leur xénophobie, ils deviendront les plus fervents partisans de l\'occidentalisation et les artisans de la Restauration Meiji.'
            ],
            [
                'year' => 1864,
                'date' => '1864-07-19',
                'title' => 'Rébellion de Kinmon',
                'type' => 'politique',
                'description' => 'Les samouraïs radicaux du domaine de Chōshū, fervents partisans du sonnō jōi (Révérer l\'empereur, expulser les barbares), tentent un coup de force : s\'emparer du palais impérial de Kyoto pour "libérer" l\'empereur de l\'influence du shogunat. Les forces de Satsuma et d\'Aizu, loyales au bakufu, repoussent l\'assaut dans une bataille de rue sanglante qui embrase Kyoto. Chōshū est déclaré ennemi de la cour, son armée dispersée. Mais cette défaite radicalise encore plus le domaine qui se modernise fébrilement. Dans deux ans, Chōshū s\'alliera ironiquement avec Satsuma pour renverser le shogunat ensemble.'
            ],
            [
                'year' => 1866,
                'date' => '1866-03-07',
                'title' => 'Alliance Satsuma-Chōshū',
                'type' => 'politique',
                'description' => 'Dans une maison discrète de Kyoto, deux ennemis héréditaires accomplissent l\'impossible : Saigō Takamori de Satsuma et Katsura Kogorō de Chōshū scellent une alliance secrète contre le shogunat Tokugawa, négociée par le rōnin visionnaire Sakamoto Ryōma. Pendant 200 ans, Satsuma et Chōshū se sont haïs. Mais face à l\'incompétence du bakufu et à la menace étrangère, ils unissent leurs forces militaires modernisées. Cette alliance change tout : les deux domaines les plus puissants du Japon, équipés d\'armes occidentales et d\'instructeurs britanniques et français, sont désormais ligués contre Edo. Le compte à rebours vers la chute du shogunat vient de commencer.'
            ],
            [
                'year' => 1867,
                'date' => '1867-11-09',
                'title' => 'Taisei Hōkan - Restauration du pouvoir impérial',
                'type' => 'politique',
                'description' => 'Le shogun Tokugawa Yoshinobu, 30 ans, lucide sur l\'effondrement du système féodal et acculé militairement par l\'alliance Satsuma-Chōshū, accomplit un geste sans précédent : il restitue volontairement le pouvoir à l\'empereur Meiji, âgé de seulement 15 ans. Après 675 ans de domination des shoguns successifs (Kamakura, Muromachi, Tokugawa), le pouvoir politique retourne théoriquement à l\'empereur. C\'est le Taisei Hōkan, la "Grande Restitution". Yoshinobu espère conserver une influence en devenant conseiller impérial. Mais les radicaux de Satsuma et Chōshū ont d\'autres plans : éliminer complètement les Tokugawa. La guerre civile est inévitable.'
            ],
            
            // Ère Meiji (1868-1912)
            [
                'year' => 1868,
                'date' => '1868-01-03',
                'title' => 'Restauration Meiji',
                'type' => 'politique',
                'description' => 'Au palais impérial de Kyoto, les leaders de Satsuma et Chōshū proclament le Ōsei Fukko, la "Restauration du Pouvoir Impérial". L\'empereur Meiji, 15 ans, reprend officiellement le pouvoir après 700 ans d\'effacement. Les Tokugawa sont dépouillés de toutes leurs charges et terres. C\'est une révolution déguisée en restauration : sous couvert de retour aux traditions, les réformateurs vont lancer la plus radicale modernisation qu\'un pays ait jamais connue. En quelques décennies, le Japon féodal des samouraïs deviendra une puissance industrielle et militaire capable de défier l\'Occident. L\'ère Meiji ("Règne Éclairé") transformera le Japon plus profondément que mille ans d\'histoire.'
            ],
            [
                'year' => 1868,
                'date' => '1868-01-27',
                'title' => 'Bataille de Toba-Fushimi',
                'type' => 'politique',
                'description' => 'Près de Kyoto, l\'armée du shogun Yoshinobu, forte de 15 000 hommes équipés traditionnellement, se heurte aux 5 000 soldats "impériaux" de Satsuma-Chōshū. Ces derniers, entraînés à l\'occidentale et armés de rifles modernes, écrasent méthodiquement les troupes shogunales pourtant trois fois plus nombreuses. Les samouraïs Tokugawa, dans leurs armures anciennes, tombent par centaines face aux tirs disciplinés. Quand l\'étendard impérial du chrysanthème est levé, désignant les Tokugawa comme "ennemis de l\'empereur", la bataille se transforme en déroute. Yoshinobu s\'enfuit lâchement vers Edo par bateau. La guerre Boshin vient de commencer, opposant modernité et tradition.'
            ],
            [
                'year' => 1869,
                'date' => '1869-05-18',
                'title' => 'Bataille de Hakodate',
                'type' => 'politique',
                'description' => 'Dans le nord glacial d\'Hokkaido, le vice-amiral Enomoto Takeaki et les derniers samouraïs loyalistes Tokugawa font leur ultime résistance au fort de Goryōkaku à Hakodate. Pendant cinq mois, ils ont tenu tête à l\'armée impériale, proclamant même une éphémère "République d\'Ezo". Mais les cuirassés modernes de la nouvelle marine impériale bombardent impitoyablement le fort en étoile, copie d\'un bastion à la Vauban. Les murs s\'effondrent sous les obus explosifs. Après des combats désespérés, les survivants se rendent. Enomoto sera gracié. Cette capitulation met fin à la guerre Boshin et scelle définitivement le sort du shogunat. L\'ère des samouraïs est terminée. Le Japon moderne peut commencer.'
            ],
            [
                'year' => 1871,
                'date' => '1871-08-29',
                'title' => 'Abolition des han (domaines féodaux)',
                'type' => 'politique',
                'description' => 'En un décret révolutionnaire, le gouvernement Meiji abolit les 260 han (domaines féodaux) qui structuraient le Japon depuis des siècles et les remplace par 72 préfectures sous contrôle direct de l\'État central. Les daimyō sont "invités" à céder volontairement leurs terres ancestrales et deviennent gouverneurs appointés avec des pensions généreuses. C\'est la destruction méthodique du système féodal : finis les péages, les barrières entre provinces, les monnaies locales, les armées privées. Le Japon devient un État-nation centralisé moderne. Cette transformation radicale s\'accomplit remarquablement sans violence majeure, les anciens seigneurs acceptant leur déchéance pour "le bien de la nation".'
            ],
            [
                'year' => 1873,
                'date' => '1873-01-10',
                'title' => 'Conscription universelle',
                'type' => 'politique',
                'description' => 'Le gouvernement Meiji promulgue la loi de conscription obligatoire : tout homme de 20 ans, quelle que soit sa classe sociale, doit servir trois ans dans l\'armée impériale. C\'est un coup mortel porté à la caste des samouraïs qui détenaient le monopole héréditaire des armes depuis 700 ans. Désormais, de simples paysans et marchands porteront l\'uniforme et le fusil. Les samouraïs sont outrés : leur raison d\'être - le métier des armes - leur est confisquée. Mais le gouvernement est inflexible : le Japon a besoin d\'une armée de masse moderne, pas de guerriers d\'élite féodaux. Les samouraïs deviennent anachroniques dans leur propre pays.'
            ],
            [
                'year' => 1876,
                'date' => '1876-03-28',
                'title' => 'Édit de l\'interdiction du port du sabre',
                'type' => 'politique',
                'description' => 'Le Haitōrei (Édit d\'abolition des sabres) interdit formellement aux samouraïs de porter le daisho (paire de sabres) en public, symbole absolu de leur statut depuis des siècles. Le sabre était l\'âme du samouraï, la marque visible de son rang, l\'objet de sa fierté. Le leur retirer est une humiliation insupportable, l\'annihilation symbolique de 700 ans de tradition bushido. Beaucoup de samouraïs conservateurs sont brisés psychologiquement. Ils deviennent des hommes ordinaires du jour au lendemain, indiscernables des roturiers qu\'ils méprisaient. Cette mesure, combinée à la réduction drastique de leurs pensions, pousse les samouraïs les plus radicaux vers la révolte.'
            ],
            [
                'year' => 1877,
                'date' => '1877-02-15',
                'title' => 'Rébellion de Satsuma',
                'type' => 'politique',
                'description' => 'Saigō Takamori, le héros légendaire de la Restauration Meiji, ancien commandant suprême et géant charismatique respecté de tous, prend la tête de 40 000 samouraïs mécontents de Satsuma dans une rébellion désespérée contre les réformes qu\'il juge trop radicales. Ces guerriers, dans leurs armures traditionnelles et brandissant leurs sabres ancestraux, marchent sur Tokyo pour "conseiller" l\'empereur. Face à eux : 300 000 conscrits paysans en uniformes modernes, armés de rifles et de canons Krupp. C\'est le choc entre deux Japon - l\'ancien monde féodal des samouraïs contre le nouveau Japon industriel. Ce sera le chant du cygne de la classe guerrière.'
            ],
            [
                'year' => 1877,
                'date' => '1877-09-24',
                'title' => 'Mort de Saigō Takamori',
                'type' => 'duel',
                'description' => 'Après sept mois de retraite sanglante à travers Kyushu, Saigō Takamori et ses 500 derniers samouraïs sont acculés sur la colline de Shiroyama, face à Kagoshima. Face à eux : 30 000 soldats impériaux et leurs mitrailleuses Gatling. À l\'aube du 24 septembre, dans un dernier assaut suicidaire, les samouraïs chargent bravement en hurlant, sabres levés. Les mitrailleuses les fauchent par dizaines. Touché par deux balles, Saigō, trop blessé pour continuer, demande à son fidèle ami de lui trancher la tête selon le rituel du seppuku. Le "dernier samouraï" meurt à 50 ans. Avec lui s\'éteint l\'esprit du vieux Japon. Le pays pleure son héros tragique, incarnation des valeurs perdues.'
            ],
            [
                'year' => 1889,
                'date' => '1889-02-11',
                'title' => 'Promulgation de la Constitution Meiji',
                'type' => 'politique',
                'description' => 'L\'empereur Meiji promulgue solennellement la première constitution du Japon, fruit de dix ans de travaux et de missions d\'étude en Europe. Inspirée principalement du modèle prussien, elle établit une monarchie constitutionnelle où l\'empereur demeure "sacré et inviolable", combinée à un parlement élu (la Diète). Les droits fondamentaux sont garantis (dans certaines limites), la séparation des pouvoirs instituée. En 21 ans, le Japon est passé d\'un État féodal médiéval à une monarchie parlementaire moderne avec constitution écrite, code civil, système judiciaire, bureaucratie méritocratique. Cette transformation stupéfie le monde occidental qui voyait le Japon comme un pays arriéré.'
            ],
            [
                'year' => 1894,
                'date' => '1894-08-01',
                'title' => 'Début de la guerre sino-japonaise',
                'type' => 'politique',
                'description' => 'Le Japon Meiji, moderne depuis seulement 26 ans, déclare la guerre à la Chine impériale de la dynastie Qing, empire millénaire dix fois plus peuplé. La cause officielle : la domination de la Corée. Mais c\'est surtout l\'occasion pour le Japon de prouver au monde qu\'il est désormais une puissance à part entière. Et le résultat stupéfie la planète : l\'armée japonaise, disciplinée et équipée à l\'occidentale, écrase les forces chinoises obsolètes sur terre et sur mer. En quelques mois, le Japon conquiert Taiwan, la Mandchourie, les îles Pescadores. Le traité de Shimonoseki humilie la Chine. Le Japon vient d\'entrer dans le concert des nations impérialistes. L\'Asie ne sera plus jamais la même.'
            ],
        ];
    }
}

