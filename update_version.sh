#!/bin/bash

# --- CONFIGURATION ---
REMOTE_DEST="o2:/home/mode8956/public_html/multiplication"

# 1. BUILD ET VERSIONING
echo "🚀 Minification du CSS..."
npm run build:css

NEW_VERSION=$(date +%Y%m%d%H%M)
echo "📦 Version générée : $NEW_VERSION"

echo "📝 Mise à jour des fichiers HTML et du Service Worker..."
sed -i "s/\?v=[^\"]*/?v=$NEW_VERSION/g" *.html
if [ -f "sw.js" ]; then
    sed -i "s/const CACHE_NAME = 'multiplication-app-[0-9]*'/const CACHE_NAME = 'multiplication-app-$NEW_VERSION'/g" sw.js
fi

echo "✅ Build terminé localement."

# --- INTERACTION ---
echo ""
read -p "❓ Souhaitez-vous déployer via SSH (rsync) ? (o/N) : " answer

if [[ "$answer" =~ ^[oO]$ ]]; then
    echo "☁️  Synchronisation avec o2switch via rsync..."
    
    # -a : archive (conserve les droits)
    # -v : verbeux
    # -z : compression pendant le transfert
    # --delete : supprime sur le serveur ce qui n'existe plus localement
    rsync -avz --delete \
        --exclude '.git/' \
        --exclude 'node_modules/' \
        --exclude 'src/' \
        --exclude 'css/tailwind-input.css' \
        --exclude 'package.json' \
        --exclude 'package-lock.json' \
        --exclude 'deploy.sh' \
        --exclude 'update_version.sh' \
        --exclude '.vscode/' \
        --exclude '.editorconfig' \
        ./ "$REMOTE_DEST/"

    echo "✅ Site mis à jour avec succès sur o2switch !"
else
    echo "🚫 Déploiement annulé."
fi