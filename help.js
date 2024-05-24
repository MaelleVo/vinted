// Le but de l’exo est de faire une seule requête à la BDD, du style : await Offer.find({}).sort({}).skip().limit().
// Vous allez devoir mettre, dans les parenthèses du find, un objet dont les clefs et les valeurs dépendent des queries reçues.
// Par exemple :
// si vous avez reçu un query title=pantalon , cet objet ressemblera à ça : { product_name: new RegExp("pantalon", "i") }
// si vous avez reçu les queries suivants : title=pantalon&priceMin=200 , cet objet ressemblera à ça : { product_name: new RegExp("pantalon", "i"), product_price: { $gte: 200 } }
// Je vous conseille, au début de votre route, de créer un objet vide :  const filters = {}; puis de faire des conditions comme suit :
// si j’ai reçu un query “title”, je rajoute une clef product_name à mon objet contenant ce query
// si j’ai reçu un query “priceMin”, je rajoute une clef product_price à mon objet contenant { $gte: 200 } etc..
