# Application de Multiplication Interactive

## 📋 Description

Application web complète et moderne pour apprendre les tables de multiplication, développée avec **Alpine.js** et **Tailwind CSS**.

### Fonctionnalités principales :
- 🌟 **Mode Débutants** - Tables 1-5 pour enfants de primaire
- 📊 **Table de Pythagore Interactive** - Complète et découverte
- 🎲 **Tables des Opérations** - Opérations aléatoires (×, ÷, +, −)
- 🎯 **Quiz Chronométré** - Modes par question ou global
- 📈 **Historique** - Suivi de progression automatique
- 💾 **LocalStorage** - Sauvegarde des préférences et résultats
- 🌙 **Mode Sombre** - Interface adaptée jour/nuit
- 📱 **Responsive** - Optimisé pour mobile, tablette et PC

## 📁 Structure des fichiers

```
multiplication-migration/
├── index-alpine.html              # Page d'accueil
├── debutant.html                  # Mode pour débutants
├── operations-aleatoires.html     # Tables aléatoires
├── pythagore.html                 # Table de Pythagore
├── quiz.html                      # Quiz chronométré
├── historique.html                # Historique de progression
├── css/
│   ├── calcul.css                # Styles calcul
│   └── table.css                 # Styles tableaux
├── js/
│   ├── alpine-store.js           # Alpine.js Store
│   └── components/               # Composants réutilisables
│       ├── countdownTimer.js
│       ├── localStorage.js
│       ├── operatorSymbols.js
│       ├── progressBar.js
│       ├── randomPairs.js
│       └── todoList.js
├── img/
│   └── favicons/                 # Favicons et manifest
└── README.md                      # Ce fichier
```

## 🚀 Installation sur O2Switch

### 1. Préparation
- Accédez à votre gestionnaire de fichiers cPanel
- Créez un dossier `public_html/multiplication` (ou selon votre besoin)

### 2. Upload des fichiers
- Téléchargez tous les fichiers du dossier `multiplication-migration/`
- Respectez la structure des dossiers
- Vérifiez que les permissions sont correctes (644 pour fichiers, 755 pour dossiers)

### 3. Configuration (optionnel)
- Le fichier `.htaccess` (s'il existe) gère les redirections
- LocalStorage fonctionne nativement en HTTPS (recommandé sur O2Switch)

### 4. Accès
L'application sera accessible à :
```
https://votredomaine.com/multiplication/
```

## 📋 Fichiers HTML principaux

| Fichier | Description |
|---------|-------------|
| `index-alpine.html` | Accueil avec menu général |
| `debutant.html` | Interface simplifiée pour enfants (tables 1-5) |
| `operations-aleatoires.html` | Entraînement avec opérations aléatoires |
| `pythagore.html` | Table de Pythagore interactive |
| `quiz.html` | Quiz chronométré avec minuteur |
| `historique.html` | Visualisation de la progression |

## 🛠 Technologies utilisées

- **Alpine.js 3.x** - Framework JavaScript réactif (CDN)
- **Tailwind CSS** - Framework CSS utilitaire (CDN)
- **LocalStorage API** - Persistance des données côté client
- **Web Audio API** - Sons d'alerte (quiz)

## 📊 Données sauvegardées

L'application sauvegarde automatiquement :
- `quizResults` - Résultats des quiz
- `theme` - Préférence de mode (clair/sombre)
- `pythagoreDiscovered` - Cellules découvertes
- `quizPreferences` - Options de quiz (opération, durée, mode, etc.)
- `randomTablesPreferences` - Tables sélectionnées
- `pythagoreTablePreferences` - Tables pour découverte

## 🔒 Sécurité

- ✅ Pas de données sensibles stockées
- ✅ Pas de connexion serveur requise (app statique)
- ✅ Compatible avec HTTPS
- ✅ Aucun cookie tiers

## 📱 Compatibilité

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile (iOS, Android)
- ✅ Tablettes

## 🎨 Personnalisation

### Logo
Remplacez les SVG dans les fichiers HTML par votre propre logo

### Couleurs
Les couleurs utilisent les classes Tailwind :
- Primaire : `blue-600` / `blue-700`
- Succès : `green-600`
- Alerte : `orange-600`
- Erreur : `red-600`

### Textes
Modifiez directement dans les fichiers HTML

## 🔗 Dépendances externes (CDN)

```html
<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Note** : Assurez-vous d'avoir une connexion internet stable pour ces CDN. Pour une utilisation hors ligne ou production critique, considérez un téléchargement local de ces ressources.

## 📞 Support

Pour les problèmes avec O2Switch :
- Vérifiez les permissions des fichiers (644/755)
- Assurez-vous que HTTPS est activé
- Vérifiez la console du navigateur pour les erreurs
- Testez avec un navigateur différent

## 📝 Licence

Application gratuite pour usage éducatif.

---

**Dernière mise à jour** : 26 janvier 2026
**Version** : Alpine.js & Tailwind CSS
