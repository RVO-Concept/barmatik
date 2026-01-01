const RECETTES = [
    { 
        code: 'a', nom: 'Shark Bite', 
        image: 'images/sharkbite.jpg',
        ingredients: [
            '🥃 Rhum: 3cl', '🍊 Orange: 3cl', '🥭 Passion: 3cl', 
            '🍍 Ananas: 3cl', '🔵 Curaçao: 1.5cl', '🍈 Citron vert: 1.5cl', 
            '🍯 Sucre: 1.5cl', '🍒 Grenadine: 1cl'
        ]
    },
    { 
        code: 'b', nom: 'Mai Tai', 
        image: 'images/maitai.jpg',
        ingredients: ['🥃 Rhum: 4cl', '🍊 Orange: 2cl', '🥭 Passion: 2cl', 
                     '🍍 Ananas: 2cl', '🍈 Citron vert: 1cl', '🍯 Sucre: 1cl']
    },
    { 
        code: 'c', nom: 'Daïquiri', 
        image: 'images/daiquiri.jpg',
        ingredients: ['🥃 Rhum: 6cl', '🍈 Citron vert: 2cl', '🍯 Sucre: 1cl']
    },
    { 
        code: 'd', nom: 'Margarita', 
        image: 'images/margarita.jpg',
        ingredients: ['🥃 Rhum: 4cl', '🍊 Orange: 1cl', '🥭 Passion: 1cl', 
                     '🍈 Citron vert: 2cl', '🍯 Sucre: 1cl']
    },
    { 
        code: 'e', nom: 'Ti\' Punch', 
        image: 'images/tipunch.jpg',
        ingredients: ['🥃 Rhum: 6cl', '🍈 Citron vert: 2cl', '🍯 Sucre: 1cl']
    },
    { 
        code: 'f', nom: 'Sex on the Beach', 
        image: 'images/sexbeach.jpg',
        ingredients: ['🥃 Rhum: 4cl', '🍊 Orange: 4cl', '🥭 Passion: 2cl', 
                     '🍍 Ananas: 4cl', '🍒 Grenadine: 2cl']
    },
    { 
        code: 'g', nom: 'Electric Lemonade', 
        image: 'images/electriclemonade.jpg',
        ingredients: ['🥃 Rhum: 4.5cl', '🍊 Orange: 1.5cl', '🥭 Passion: 1.5cl', 
                     '🍍 Ananas: 3cl', '🔵 Curaçao: 1.5cl', '🍈 Citron vert: 3cl', 
                     '🍯 Sucre: 1.5cl']
    },
    { 
        code: 'h', nom: 'Hurricane', 
        image: 'images/hurricane.jpg',
        ingredients: ['🥃 Rhum: 6cl', '🍍 Ananas: 6cl', '🍈 Citron vert: 2cl', 
                     '🍯 Sucre: 2cl', '🍒 Grenadine: 1cl']
    },
    { 
        code: 'i', nom: 'Zombie', 
        image: 'images/zombie.jpg',
        ingredients: ['🥃 Rhum: 6cl', '🍊 Orange: 1.5cl', '🥭 Passion: 1.5cl', 
                     '🔵 Curaçao: 1.5cl', '🍈 Citron vert: 1.5cl', '🍯 Sucre: 1.5cl', 
                     '🍒 Grenadine: 1.5cl']
    },
    { 
        code: 'j', nom: 'Blue Hawaiian', 
        image: 'images/bluehawaiian.jpg',
        ingredients: ['🥃 Rhum: 4cl', '🥭 Passion: 3cl', '🍍 Ananas: 4cl', 
                     '🔵 Curaçao: 2cl', '🍈 Citron vert: 2cl', '🍯 Sucre: 1cl', 
                     '🍒 Grenadine: 1cl']
    },
    // ... Ajoutez les autres cocktails de la même façon (jusqu'à 'y')
    { 
        code: 's', nom: 'AfterGlow SA', 
        image: 'images/afterglow.jpg',
        ingredients: ['🍊 Orange: 8cl', '🍍 Ananas: 8cl', '🍒 Grenadine: 2cl']
    },
    { 
        code: 'w', nom: 'Jus d\'Ananas SA', 
        image: 'images/ananas.jpg',
        ingredients: ['🍍 Ananas: 18cl']
    }
    // Complétez avec tous les cocktails de votre liste
];

let port = null;
let writer = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    document.getElementById('connectBtn').addEventListener('click', connectSerial);
    genererCocktails();
    
    if ('serial' in navigator) {
        document.getElementById('status').textContent = 'Web Serial prêt';
    } else {
        document.getElementById('status').textContent = 'Chrome requis';
        document.getElementById('connectBtn').disabled = true;
    }
}

function genererCocktails() {
    const grid = document.getElementById('cocktailsGrid');
    RECETTES.forEach(cocktail => {
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        card.innerHTML = `
            <img src="${cocktail.image}" alt="${cocktail.nom}" class="cocktail-image" 
                 onerror="this.src='https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=${cocktail.nom.replace(/'/g,'')}';">
            <div class="cocktail-name">${cocktail.nom}</div>
            <div class="cocktail-code">Code: ${cocktail.code}</div>
            <div class="ingredients">
                ${cocktail.ingredients.map(ing => `<div class="ingredient-item">${ing}</div>`).join('')}
            </div>
            <button class="btn-preparer" onclick="envoyerCommande('${cocktail.code}', this)">Préparer 🍹</button>
        `;
        grid.appendChild(card);
    });
}
async function connectBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['00001101-0000-1000-8000-00805f9b34fb'] }], // Serial Port Service
            optionalServices: ['00001101-0000-1000-8000-00805f9b34fb']
        });

        device.addEventListener('gattserverdisconnected', () => {
            document.getElementById('status').textContent = 'Déconnecté';
            document.getElementById('status').className = 'status disconnected';
            document.getElementById('connectBtn').disabled = false;
        });

        server = await device.gatt.connect();
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
        const txCharacteristic = await service.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');

        document.getElementById('status').textContent = `Connecté à ${device.name}`;
        document.getElementById('status').className = 'status connected';
        document.getElementById('connectBtn').textContent = '✅ Connecté';
        document.getElementById('connectBtn').disabled = true;

        console.log('Connecté au module Bluetooth HC-05');
    } catch (error) {
        console.error('Erreur Bluetooth:', error);
        alert('Impossible de se connecter. Vérifiez que votre HC-05 est appairé et visible.');
    }
}

async function envoyerCommande(code) {
    if (!server) {
        alert('Connectez-vous d\'abord via Bluetooth !');
        return;
    }

    try {
        // Marquer le cocktail comme en préparation
        const cards = document.querySelectorAll('.cocktail-card');
        cards.forEach(card => card.classList.remove('preparing'));
        event.currentTarget.classList.add('preparing');

        // Envoyer la commande
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
        const txCharacteristic = await service.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');
        
        await txCharacteristic.writeValue(new TextEncoder().encode(code));
        
        console.log(`Commande "${code}" envoyée`);
        
        // Retirer l'animation après 2s
        setTimeout(() => {
            event.currentTarget.classList.remove('preparing');
        }, 2000);
        
    } catch (error) {
        console.error('Erreur envoi:', error);
        alert('Erreur envoi commande');
    }
}