# Realtime Chat Forum

Ceci est une application de converstation en temps réel, créée avec **Nodejs (expressjs)**, le template engine **EJS** ainsi que le protocole **MQTT**.
Un utilisateur peut créer un compte, se connecter, rejoindre le chat général (même s'il n'est pas connecté puisque un ID aléatoire lui sera affecté), discuter avec quelqu'un en privé, et finalement rejoinde un canal de discussion.

## Utilisateurs fournis pour test
Vous pouvez utiliser ces utilisateurs déjà présents dans la base de données ou en créer vous mêmes.
<b>Utilisateur 1</b> :
username : mustapha
password : 1234
<b>Utilisateur 2</b>
username : bob
password : 1234
## Fonctionnalités
- Chat général à l'ouverture du site
- Possibilité de rejoindre un canal privé et./ou de le créer à partir du bouton "Canal privé" dans la page d'accueil
- S'inscrire
- Se connecter
- Possibilité de discuter avec quelqu'un en privé.

## Commandes

- **publish**: Utilisé pour publier des messages sur des sujets spécifiques. Cette commande permet aux utilisateurs d'envoyer des messages à d'autres clients connectés au même sujet.
- **subscribe** : Utilisé pour écouter les messages publiés sur un sujet spécifique. Cette commande permet aux utilisateurs de se connecter à une salle de discussion et de recevoir des mises à jour en temps réel à mesure que de nouveaux messages arrivent.
- **unsubscribe**: Utilisé pour se déconnecter d'un sujet spécifique. Cette commande permet aux utilisateurs de quitter une salle de discussion et de cesser de recevoir des mises à jour en temps réel.
- **message** : Cet événement est déclenché lorsqu'un message est publié sur un sujet spécifique. L'application écoute cet événement et traite les messages entrants, les affichant dans l'interface utilisateur en temps réel.
- **connect**: Cet événement est utilisé pour se connecter à MqttBroker."


## Comment fonctionne l'application?
Au lancement de l'application, l'utilisateur sera redigé vers la page d'accueil où il sera automatiquement connecté au topic général, donc une **discussion globale** pour tout utilisateur qui rejoint le site. Si on veut se connecter dans un **canal privé** il suffit de cliquer sur le bouton **Canal privé** ce qui va nous ouvrir un input ou l'on peut mettre un canal privé pour **rejoindre ou pour le créer s'il n'xiste pas**, et dans ce cas là les messages seront privés que pour ce canal. Si l'on veut se déconnecter on remarquera qu'à gauche il y a un bouton **Se déconnecter**, ainsi on **reviendra sur le topic général public**

## Chat privé & MongoDB

Si on veut discuter avec quelqu'un il faut qu'on **se connecte/créer son compte** (sur la navbar il y aura les liens pour faire cela). Une fois connecté, on remarquera qu'il y a un nouveau menu qui est apparu **Chat privé**, ce qui va nous ouvrir une page ou l'on peut selectionner des utilisateurs qui sont inscrits au forum pour leur envoyer des messages directes.
**NB: il n'y a pas de système de sauvegarde de messages, donc il faut que les deux utilisateurs soient connectés et ouvert le chat entre eux. Voir l'image ci-dessous.**
[Image montrant discussion entre deux personnes](https://ibb.co/ZMs6skx)

Comme je l'ai mentionné avant, j'ai utilisé une base de données NoSQL (MongoDB) pour y stocker les utilisateurs. Les librairies pour nodejs utilisées sont : **mongodb et mongoose**. Ci-dessous deux captures de la connexion à la base de données avec **MongoDB Compass**.
[Connexion à la BD](https://ibb.co/b57yJyB) 
[Structure BD](https://ibb.co/Rph9m2d)
**String de connexion avec MongoDB Compass: mongodb+srv://mkhalouk:mkhalouk@mqttchat.lwwzuei.mongodb.net/mqttforum?retryWrites=true&w=majority**

## Installer et lancer l'application

J'ai laissé tous les fichiers d'environnement exprès pour tester.
Suivre les commandes suivantes pour installer et lancer le projet.
**NB: il faut avoir sur son pc Nodejs (v14.15.0 ou plus récent)**

- **npm install**
- Pour lancer en mode dev : **npm run dev**
- Pour lancer en mode prod : **npm run prod**
Vous devriez avoir dans votre terminal un résultat comme ci-dessous :
[Start project](https://ibb.co/k2nSNXR)
Une fois réalisées toutes ces étapes, on peut ouvrir http://localhost:3000 

## Git repo de Mustapha Khalouk
Voici mon [git](https://github.com/mkhalouk/forum_chat_mqtt) pour voir tous les commits ainsi que pour cloner le projet si vous le souhaitez.
