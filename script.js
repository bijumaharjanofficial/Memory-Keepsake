document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const favoritesContainer = document.getElementById('favorites-container');
    const contactContainer = document.getElementById('contact-container');
    const revealButton = document.getElementById('reveal-btn');
    const nicknamesContainer = document.getElementById('nicknames-container');
    const completionMessage = document.getElementById('completion-message');
    
    // Data storage
    let riyaData = {};
    let revealInterval;
    
    // Initialize the application
    init();
    
    async function init() {
        // Show loading screen
        loadingScreen.classList.remove('hidden');
        mainContent.classList.add('hidden');
        
        try {
            // Fetch data from JSON file
            const response = await fetch('data.json');
            riyaData = await response.json();
            
            // Simulate loading time for better UX
            setTimeout(() => {
                // Hide loading screen and show main content
                loadingScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // Populate static content
                populateStaticContent();
            }, 2000);
            
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback data in case JSON fails to load
            riyaData = getFallbackData();
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                populateStaticContent();
            }, 2000);
        }
    }
    
    function populateStaticContent() {
        // Populate nicknames
        populateNicknames();
        
        // Populate contact information
        populateContactInfo();
    }
    
    function populateNicknames() {
        nicknamesContainer.innerHTML = '';
        
        if (riyaData.nicknames && Array.isArray(riyaData.nicknames)) {
            riyaData.nicknames.forEach(nickname => {
                const nicknameElement = document.createElement('span');
                nicknameElement.className = 'nickname';
                nicknameElement.innerHTML = `<i class="${nickname.icon}"></i> ${nickname.name}`;
                nicknameElement.title = nickname.description;
                nicknamesContainer.appendChild(nicknameElement);
            });
        }
    }
    
    function populateContactInfo() {
        contactContainer.innerHTML = '';
        
        // Add emails
        if (riyaData.contact.emails && Array.isArray(riyaData.contact.emails)) {
            riyaData.contact.emails.forEach(email => {
                const contactItem = createContactItem(
                    email.icon,
                    'Email',
                    email.address,
                    `${email.type} - ${email.description}`
                );
                contactContainer.appendChild(contactItem);
            });
        }
        
        // Add phones
        if (riyaData.contact.phones && Array.isArray(riyaData.contact.phones)) {
            riyaData.contact.phones.forEach(phone => {
                const contactItem = createContactItem(
                    phone.icon,
                    'Phone',
                    phone.number,
                    `${phone.carrier} - ${phone.description}`
                );
                contactContainer.appendChild(contactItem);
            });
        }
        
        // Add location
        if (riyaData.contact.location) {
            const contactItem = createContactItem(
                riyaData.contact.location.icon,
                'Location',
                riyaData.contact.location.address,
                riyaData.contact.location.description
            );
            contactContainer.appendChild(contactItem);
        }
    }
    
    function createContactItem(iconClass, title, value, description) {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        
        const icon = document.createElement('div');
        icon.className = 'contact-icon';
        icon.innerHTML = `<i class="${iconClass}"></i>`;
        
        const details = document.createElement('div');
        details.className = 'contact-details';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        
        const info = document.createElement('p');
        info.textContent = value;
        
        const desc = document.createElement('p');
        desc.textContent = description;
        desc.className = 'contact-description';
        
        details.appendChild(titleElement);
        details.appendChild(info);
        details.appendChild(desc);
        
        contactItem.appendChild(icon);
        contactItem.appendChild(details);
        
        return contactItem;
    }
    
    // Event listener for reveal button
    revealButton.addEventListener('click', startRevealProcess);
    
    function startRevealProcess() {
        // Disable button during reveal process
        revealButton.disabled = true;
        revealButton.textContent = 'Revealing Favorites...';
        
        // Clear any existing favorites
        favoritesContainer.innerHTML = '';
        completionMessage.classList.add('hidden');
        
        // Get all favorite items
        const allFavoriteItems = getAllFavoriteItems();
        
        // Start revealing items one by one
        let currentIndex = 0;
        
        revealInterval = setInterval(() => {
            if (currentIndex < allFavoriteItems.length) {
                const item = allFavoriteItems[currentIndex];
                displayFavoriteItem(item.category, item.data, currentIndex);
                currentIndex++;
            } else {
                // All items revealed
                clearInterval(revealInterval);
                revealButton.textContent = 'Show Again';
                revealButton.disabled = false;
                
                // Show completion message
                setTimeout(() => {
                    completionMessage.classList.remove('hidden');
                    completionMessage.scrollIntoView({ behavior: 'smooth' });
                }, 1000);
            }
        }, 2500); // 2.5 second delay between items
    }
    
    function getAllFavoriteItems() {
        const allItems = [];
        
        if (riyaData.favorites) {
            Object.entries(riyaData.favorites).forEach(([category, items]) => {
                if (Array.isArray(items)) {
                    items.forEach(item => {
                        allItems.push({
                            category: category,
                            data: item
                        });
                    });
                }
            });
        }
        
        return allItems;
    }
    
    function displayFavoriteItem(category, data, index) {
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'item-card fade-in-up';
        favoriteCard.style.animationDelay = `${index * 0.1}s`;
        
        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        
        const icon = document.createElement('div');
        icon.className = 'item-icon';
        icon.innerHTML = `<i class="${data.icon}"></i>`;
        
        const title = document.createElement('h3');
        title.textContent = data.name;
        
        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'category-badge';
        categoryBadge.textContent = formatCategoryName(category);
        
        itemHeader.appendChild(icon);
        itemHeader.appendChild(title);
        itemHeader.appendChild(categoryBadge);
        
        const description = document.createElement('p');
        description.textContent = data.description;
        
        const pickupLine = document.createElement('div');
        pickupLine.className = 'pickup-line';
        pickupLine.textContent = data.pickup;
        
        favoriteCard.appendChild(itemHeader);
        favoriteCard.appendChild(description);
        favoriteCard.appendChild(pickupLine);
        
        favoritesContainer.appendChild(favoriteCard);
        
        // Scroll to the new item
        favoriteCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function formatCategoryName(category) {
        // Convert camelCase or plural names to readable format
        const nameMap = {
            'colors': 'Color',
            'drinks': 'Drink',
            'mlbbSpells': 'MLBB Spell',
            'iceCreamFlavors': 'Ice Cream',
            'musicGenres': 'Music Genre',
            'foods': 'Food',
            'mlbbMaleHeroes': 'MLBB Male Hero',
            'mlbbFemaleHeroes': 'MLBB Female Hero',
            'flowers': 'Flower',
            'emotes': 'Emote',
            'onePieceCharacters': 'One Piece Character',
            'songs': 'Song',
            'anime': 'Anime',
            'games': 'Game'
        };
        
        return nameMap[category] || category;
    }
    
    // Fallback data in case JSON file is not available
    function getFallbackData() {
        return {
            "name": "Riya Khadka",
            "alias": "Renuka Magar",
            "caste": "Chettri",
            "birthday": "Jestha 28",
            "age": "22",
            "location": "Itahari, Nepal",
            "nicknames": [
                {
                    "name": "Mamacita Riya",
                    "description": "A sweet and affectionate nickname",
                    "icon": "fas fa-heart"
                },
                {
                    "name": "Ceyy",
                    "description": "Short and cute nickname",
                    "icon": "fas fa-star"
                },
                {
                    "name": "Céyaa :<",
                    "description": "Expressive and playful nickname",
                    "icon": "fas fa-smile"
                },
                {
                    "name": "Panipuri Slayer",
                    "description": "Food-loving nickname showing her love for panipuri",
                    "icon": "fas fa-utensils"
                }
            ],
            "favorites": {
                "colors": [
                    {
                        "name": "Black",
                        "description": "Elegant, powerful and timeless color",
                        "icon": "fas fa-circle",
                        "pickup": "You make everything else fade to black and white when you're around."
                    },
                    {
                        "name": "Purple",
                        "description": "Royal, creative and mysterious color",
                        "icon": "fas fa-circle",
                        "pickup": "My world turns purple with passion whenever I think of you."
                    }
                ],
                "drinks": [
                    {
                        "name": "Ice Coffee Mojito",
                        "description": "Refreshing coffee-based mocktail",
                        "icon": "fas fa-coffee",
                        "pickup": "You're more refreshing than my favorite ice coffee mojito on a hot day."
                    },
                    {
                        "name": "Coke",
                        "description": "Classic carbonated soft drink",
                        "icon": "fas fa-wine-bottle",
                        "pickup": "You give me that bubbly feeling, just like the first sip of Coke."
                    },
                    {
                        "name": "Sprite",
                        "description": "Crisp lemon-lime soda",
                        "icon": "fas fa-glass-whiskey",
                        "pickup": "Like Sprite, you're crisp, refreshing, and always lift my spirits."
                    }
                ],
                "mlbbSpells": [
                    {
                        "name": "Flameshot",
                        "description": "Powerful offensive spell that deals magic damage",
                        "icon": "fas fa-fire",
                        "pickup": "You hit me with a Flameshot straight to the heart, and I don't want to recover."
                    },
                    {
                        "name": "Flicker",
                        "description": "Teleportation spell for quick repositioning",
                        "icon": "fas fa-bolt",
                        "pickup": "No matter where I Flicker, my heart always finds its way back to you."
                    }
                ],
                "iceCreamFlavors": [
                    {
                        "name": "Chocolate",
                        "description": "Rich, creamy and indulgent flavor",
                        "icon": "fas fa-ice-cream",
                        "pickup": "You're as irresistible as chocolate ice cream melting on a warm day."
                    },
                    {
                        "name": "Vanilla",
                        "description": "Classic, smooth and versatile flavor",
                        "icon": "fas fa-ice-cream",
                        "pickup": "Like vanilla ice cream, you're a classic beauty that never goes out of style."
                    }
                ],
                "musicGenres": [
                    {
                        "name": "Pop",
                        "description": "Catchy and popular music style",
                        "icon": "fas fa-music",
                        "pickup": "Our love story would be a perfect pop song - catchy and unforgettable."
                    },
                    {
                        "name": "Folk",
                        "description": "Traditional and cultural music",
                        "icon": "fas fa-guitar",
                        "pickup": "Like folk music, our connection feels timeless and deeply rooted."
                    },
                    {
                        "name": "Traditional",
                        "description": "Heritage and classical music forms",
                        "icon": "fas fa-drum",
                        "pickup": "You make me appreciate the traditional values of love and commitment."
                    },
                    {
                        "name": "Hip-hop",
                        "description": "Rhythmic and expressive urban music",
                        "icon": "fas fa-microphone",
                        "pickup": "You've got more rhythm than my favorite hip-hop track."
                    },
                    {
                        "name": "Rap",
                        "description": "Fast-paced lyrical music style",
                        "icon": "fas fa-headphones",
                        "pickup": "I could rap for hours about how amazing you are."
                    },
                    {
                        "name": "Old Songs",
                        "description": "Classic and nostalgic music",
                        "icon": "fas fa-compact-disc",
                        "pickup": "Like old songs, my love for you only gets better with time."
                    }
                ],
                "foods": [
                    {
                        "name": "Momo",
                        "description": "Delicious Nepalese dumplings",
                        "icon": "fas fa-dumpling",
                        "pickup": "You're more irresistible than a steaming plate of momos on a cold day."
                    },
                    {
                        "name": "Panipuri",
                        "description": "Crispy hollow puri with spicy water",
                        "icon": "fas fa-apple-alt",
                        "pickup": "Like panipuri, you're the perfect combination of crisp, spicy, and sweet."
                    }
                ],
                "mlbbMaleHeroes": [
                    {
                        "name": "Ling",
                        "description": "Agile assassin who can scale walls",
                        "icon": "fas fa-user-ninja",
                        "pickup": "Like Ling, I'd scale any obstacle just to be by your side."
                    },
                    {
                        "name": "Hayabusa",
                        "description": "Deadly ninja with shadow techniques",
                        "icon": "fas fa-mask",
                        "pickup": "You've captured me more completely than Hayabusa's ultimate."
                    }
                ],
                "mlbbFemaleHeroes": [
                    {
                        "name": "Kagura",
                        "description": "Elegant mage with umbrella techniques",
                        "icon": "fas fa-umbrella",
                        "pickup": "You've cast a spell on me more powerful than any of Kagura's abilities."
                    },
                    {
                        "name": "Lylia",
                        "description": "Powerful mage with time manipulation",
                        "icon": "fas fa-clock",
                        "pickup": "Like Lylia, you have the power to stop time whenever you enter the room."
                    }
                ],
                "anime": [
                    {
                        "name": "One Piece",
                        "description": "Epic pirate adventure series",
                        "icon": "fas fa-anchor",
                        "pickup": "If I were in One Piece, I'd search the entire Grand Line just to find a treasure as precious as you."
                    }
                ],
                "games": [
                    {
                        "name": "Mobile Legends: Bang Bang (MLBB)",
                        "description": "Popular mobile MOBA game",
                        "icon": "fas fa-mobile-alt",
                        "pickup": "You must be a MLBB pro, because you've captured my heart without even trying."
                    }
                ],
                "flowers": [
                    {
                        "name": "Rose",
                        "description": "Symbol of love and passion",
                        "icon": "fas fa-rose",
                        "pickup": "Even the most beautiful rose can't compare to your natural beauty."
                    },
                    {
                        "name": "Tulips",
                        "description": "Elegant spring flowers",
                        "icon": "fas fa-spa",
                        "pickup": "Like tulips in spring, you bring new life and color to my world."
                    },
                    {
                        "name": "Daisy",
                        "description": "Simple and cheerful flower",
                        "icon": "fas fa-seedling",
                        "pickup": "Your smile is as bright and cheerful as a field of daisies."
                    }
                ],
                "emotes": [
                    {
                        "name": "Thumb Emote",
                        "description": "Gesture of approval and support",
                        "icon": "fas fa-thumbs-up",
                        "pickup": "I'd give you a thumbs up every time I see you, which would be all the time."
                    }
                ],
                "onePieceCharacters": [
                    {
                        "name": "Sanji",
                        "description": "Chivalrous cook of the Straw Hat Pirates",
                        "icon": "fas fa-utensils",
                        "pickup": "Like Sanji, I'd fight anyone who disrespects you and cook you the best meals."
                    }
                ],
                "songs": [
                    {
                        "name": "No One Noticed by Marias",
                        "description": "Beautiful emotional track",
                        "icon": "fas fa-music",
                        "pickup": "Like your favorite song, I notice every little thing about you."
                    }
                ]
            },
            "contact": {
                "emails": [
                    {
                        "address": "reeyakc.10@gmail.com",
                        "type": "Primary",
                        "description": "Main email for communication",
                        "icon": "fas fa-envelope"
                    },
                    {
                        "address": "riyakc665@gmail.com",
                        "type": "Secondary", 
                        "description": "Backup email address",
                        "icon": "fas fa-envelope"
                    }
                ],
                "phones": [
                    {
                        "number": "+977 9814375601",
                        "carrier": "Ncell",
                        "description": "Primary mobile number",
                        "icon": "fas fa-phone-alt"
                    },
                    {
                        "number": "+977 9767377365", 
                        "carrier": "NTC",
                        "description": "Secondary mobile number",
                        "icon": "fas fa-phone-alt"
                    }
                ],
                "location": {
                    "address": "Itahari, Nepal",
                    "description": "The beautiful city where she resides",
                    "icon": "fas fa-map-marker-alt"
                }
            }
        };
    }
});