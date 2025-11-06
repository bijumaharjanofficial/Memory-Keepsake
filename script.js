document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const favoritesContainer = document.getElementById('favorites-container');
    const contactContainer = document.getElementById('contact-container');
    const revealButton = document.getElementById('reveal-btn');
    const nicknamesContainer = document.getElementById('nicknames-container');
    const completionMessage = document.getElementById('completion-message');
    const themeToggle = document.createElement('button');
    
    // Theme toggle setup
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    // Data storage
    let riyaData = {};
    let revealInterval;
    let currentTheme = 'dark';
    
    // Initialize the application
    init();
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', toggleTheme);
    
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update toggle icon
        const icon = themeToggle.querySelector('i');
        icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Update theme meta tag
        const themeMeta = document.getElementById('theme-meta');
        if (themeMeta) {
            themeMeta.setAttribute('content', currentTheme === 'dark' ? '#8A2BE2' : '#FF6B6B');
        }
        
        // Save theme preference
        localStorage.setItem('riya-theme', currentTheme);
    }
    
    async function init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('riya-theme');
        if (savedTheme) {
            currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', currentTheme);
            const icon = themeToggle.querySelector('i');
            icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            
            // Update theme meta tag
            const themeMeta = document.getElementById('theme-meta');
            if (themeMeta) {
                themeMeta.setAttribute('content', currentTheme === 'dark' ? '#8A2BE2' : '#FF6B6B');
            }
        }
        
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
                
                // Try to use image, fallback to icon
                if (nickname.image) {
                    const img = document.createElement('img');
                    img.src = nickname.image;
                    img.alt = nickname.name;
                    img.onerror = function() {
                        // If image fails to load, use icon
                        this.style.display = 'none';
                        const icon = document.createElement('i');
                        icon.className = nickname.icon;
                        nicknameElement.appendChild(icon);
                    };
                    nicknameElement.appendChild(img);
                } else {
                    const icon = document.createElement('i');
                    icon.className = nickname.icon;
                    nicknameElement.appendChild(icon);
                }
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = nickname.name;
                nicknameElement.appendChild(nameSpan);
                
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
                    `${email.type} - ${email.description}`,
                    email.image
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
                    `${phone.carrier} - ${phone.description}`,
                    phone.image
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
                riyaData.contact.location.description,
                riyaData.contact.location.image
            );
            contactContainer.appendChild(contactItem);
        }
    }
    
    function createContactItem(iconClass, title, value, description, imagePath) {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        
        const icon = document.createElement('div');
        icon.className = 'contact-icon';
        
        // Try to use image, fallback to icon
        if (imagePath) {
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = title;
            img.onerror = function() {
                // If image fails to load, use icon
                this.style.display = 'none';
                const iconElement = document.createElement('i');
                iconElement.className = iconClass;
                icon.appendChild(iconElement);
            };
            icon.appendChild(img);
        } else {
            const iconElement = document.createElement('i');
            iconElement.className = iconClass;
            icon.appendChild(iconElement);
        }
        
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
        
        // Try to use image, fallback to icon
        if (data.image) {
            const img = document.createElement('img');
            img.src = data.image;
            img.alt = data.name;
            img.onerror = function() {
                // If image fails to load, use icon
                this.style.display = 'none';
                const iconElement = document.createElement('i');
                iconElement.className = data.icon;
                icon.appendChild(iconElement);
            };
            icon.appendChild(img);
        } else {
            const iconElement = document.createElement('i');
            iconElement.className = data.icon;
            icon.appendChild(iconElement);
        }
        
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
            "theme": {
                "dark": {
                    "primary": "#8A2BE2",
                    "secondary": "#6A0DAD",
                    "accent": "#E91E63",
                    "mauve": "#915F6D",
                    "paleLavender": "#DCD0FF",
                    "ultraViolet": "#645394",
                    "lilac": "#C8A2C8",
                    "plum": "#8E4585",
                    "amethyst": "#9966CC",
                    "burgundy": "#800020",
                    "obsidian": "#0B0B0B",
                    "onyx": "#0F0F0F",
                    "matteBlack": "#1C1C1C",
                    "raven": "#2F2F2F",
                    "text": "#FFFFFF",
                    "background": "#121212"
                },
                "light": {
                    "primary": "#FF6B6B",
                    "secondary": "#FF8E53",
                    "accent": "#FFD166",
                    "sunsetOrange": "#FF9A76",
                    "peach": "#FFB396",
                    "gold": "#FFD166",
                    "warmYellow": "#FFE66D",
                    "softCoral": "#FF8A8A",
                    "apricot": "#FFC8A2",
                    "cream": "#FFF8F0",
                    "text": "#2D2D2D",
                    "background": "#FFF8F0",
                    "card": "#FFFFFF"
                }
            },
            "nicknames": [
                {
                    "name": "Mamacita Riya",
                    "description": "A sweet and affectionate nickname",
                    "icon": "fas fa-heart",
                    "image": "images/nicknames/mamacita.png"
                },
                {
                    "name": "Ceyy",
                    "description": "Short and cute nickname",
                    "icon": "fas fa-star",
                    "image": "images/nicknames/ceyy.png"
                },
                {
                    "name": "Céyaa :<",
                    "description": "Expressive and playful nickname",
                    "icon": "fas fa-smile",
                    "image": "images/nicknames/ceyaa.png"
                },
                {
                    "name": "Panipuri Slayer",
                    "description": "Food-loving nickname showing her love for panipuri",
                    "icon": "fas fa-utensils",
                    "image": "images/nicknames/panipuri.png"
                }
            ],
            "favorites": {
                "colors": [
                    {
                        "name": "Black",
                        "description": "Elegant, powerful and timeless color",
                        "icon": "fas fa-circle",
                        "image": "images/colors/black.png",
                        "pickup": "You make everything else fade to black and white when you're around."
                    },
                    {
                        "name": "Purple",
                        "description": "Royal, creative and mysterious color",
                        "icon": "fas fa-circle",
                        "image": "images/colors/purple.png",
                        "pickup": "My world turns purple with passion whenever I think of you."
                    }
                ],
                "drinks": [
                    {
                        "name": "Ice Coffee Mojito",
                        "description": "Refreshing coffee-based mocktail",
                        "icon": "fas fa-coffee",
                        "image": "images/drinks/coffee-mojito.png",
                        "pickup": "You're more refreshing than my favorite ice coffee mojito on a hot day."
                    },
                    {
                        "name": "Coke",
                        "description": "Classic carbonated soft drink",
                        "icon": "fas fa-wine-bottle",
                        "image": "images/drinks/coke.png",
                        "pickup": "You give me that bubbly feeling, just like the first sip of Coke."
                    },
                    {
                        "name": "Sprite",
                        "description": "Crisp lemon-lime soda",
                        "icon": "fas fa-glass-whiskey",
                        "image": "images/drinks/sprite.png",
                        "pickup": "Like Sprite, you're crisp, refreshing, and always lift my spirits."
                    }
                ],
                "mlbbSpells": [
                    {
                        "name": "Flameshot",
                        "description": "Powerful offensive spell that deals magic damage",
                        "icon": "fas fa-fire",
                        "image": "images/mlbb/flameshot.png",
                        "pickup": "You hit me with a Flameshot straight to the heart, and I don't want to recover."
                    },
                    {
                        "name": "Flicker",
                        "description": "Teleportation spell for quick repositioning",
                        "icon": "fas fa-bolt",
                        "image": "images/mlbb/flicker.png",
                        "pickup": "No matter where I Flicker, my heart always finds its way back to you."
                    }
                ],
                "iceCreamFlavors": [
                    {
                        "name": "Chocolate",
                        "description": "Rich, creamy and indulgent flavor",
                        "icon": "fas fa-ice-cream",
                        "image": "images/icecream/chocolate.png",
                        "pickup": "You're as irresistible as chocolate ice cream melting on a warm day."
                    },
                    {
                        "name": "Vanilla",
                        "description": "Classic, smooth and versatile flavor",
                        "icon": "fas fa-ice-cream",
                        "image": "images/icecream/vanilla.png",
                        "pickup": "Like vanilla ice cream, you're a classic beauty that never goes out of style."
                    }
                ],
                "musicGenres": [
                    {
                        "name": "Pop",
                        "description": "Catchy and popular music style",
                        "icon": "fas fa-music",
                        "image": "images/music/pop.png",
                        "pickup": "Our love story would be a perfect pop song - catchy and unforgettable."
                    },
                    {
                        "name": "Folk",
                        "description": "Traditional and cultural music",
                        "icon": "fas fa-guitar",
                        "image": "images/music/folk.png",
                        "pickup": "Like folk music, our connection feels timeless and deeply rooted."
                    },
                    {
                        "name": "Traditional",
                        "description": "Heritage and classical music forms",
                        "icon": "fas fa-drum",
                        "image": "images/music/traditional.png",
                        "pickup": "You make me appreciate the traditional values of love and commitment."
                    },
                    {
                        "name": "Hip-hop",
                        "description": "Rhythmic and expressive urban music",
                        "icon": "fas fa-microphone",
                        "image": "images/music/hiphop.png",
                        "pickup": "You've got more rhythm than my favorite hip-hop track."
                    },
                    {
                        "name": "Rap",
                        "description": "Fast-paced lyrical music style",
                        "icon": "fas fa-headphones",
                        "image": "images/music/rap.png",
                        "pickup": "I could rap for hours about how amazing you are."
                    },
                    {
                        "name": "Old Songs",
                        "description": "Classic and nostalgic music",
                        "icon": "fas fa-compact-disc",
                        "image": "images/music/oldsongs.png",
                        "pickup": "Like old songs, my love for you only gets better with time."
                    }
                ],
                "foods": [
                    {
                        "name": "Momo",
                        "description": "Delicious Nepalese dumplings",
                        "icon": "fas fa-dumpling",
                        "image": "images/foods/momo.png",
                        "pickup": "You're more irresistible than a steaming plate of momos on a cold day."
                    },
                    {
                        "name": "Panipuri",
                        "description": "Crispy hollow puri with spicy water",
                        "icon": "fas fa-apple-alt",
                        "image": "images/foods/panipuri.png",
                        "pickup": "Like panipuri, you're the perfect combination of crisp, spicy, and sweet."
                    }
                ],
                "mlbbMaleHeroes": [
                    {
                        "name": "Ling",
                        "description": "Agile assassin who can scale walls",
                        "icon": "fas fa-user-ninja",
                        "image": "images/mlbb/ling.png",
                        "pickup": "Like Ling, I'd scale any obstacle just to be by your side."
                    },
                    {
                        "name": "Hayabusa",
                        "description": "Deadly ninja with shadow techniques",
                        "icon": "fas fa-mask",
                        "image": "images/mlbb/hayabusa.png",
                        "pickup": "You've captured me more completely than Hayabusa's ultimate."
                    }
                ],
                "mlbbFemaleHeroes": [
                    {
                        "name": "Kagura",
                        "description": "Elegant mage with umbrella techniques",
                        "icon": "fas fa-umbrella",
                        "image": "images/mlbb/kagura.png",
                        "pickup": "You've cast a spell on me more powerful than any of Kagura's abilities."
                    },
                    {
                        "name": "Lylia",
                        "description": "Powerful mage with time manipulation",
                        "icon": "fas fa-clock",
                        "image": "images/mlbb/lylia.png",
                        "pickup": "Like Lylia, you have the power to stop time whenever you enter the room."
                    }
                ],
                "anime": [
                    {
                        "name": "One Piece",
                        "description": "Epic pirate adventure series",
                        "icon": "fas fa-anchor",
                        "image": "images/anime/onepiece.png",
                        "pickup": "If I were in One Piece, I'd search the entire Grand Line just to find a treasure as precious as you."
                    }
                ],
                "games": [
                    {
                        "name": "Mobile Legends: Bang Bang (MLBB)",
                        "description": "Popular mobile MOBA game",
                        "icon": "fas fa-mobile-alt",
                        "image": "images/games/mlbb.png",
                        "pickup": "You must be a MLBB pro, because you've captured my heart without even trying."
                    }
                ],
                "flowers": [
                    {
                        "name": "Rose",
                        "description": "Symbol of love and passion",
                        "icon": "fas fa-rose",
                        "image": "images/flowers/rose.png",
                        "pickup": "Even the most beautiful rose can't compare to your natural beauty."
                    },
                    {
                        "name": "Tulips",
                        "description": "Elegant spring flowers",
                        "icon": "fas fa-spa",
                        "image": "images/flowers/tulips.png",
                        "pickup": "Like tulips in spring, you bring new life and color to my world."
                    },
                    {
                        "name": "Daisy",
                        "description": "Simple and cheerful flower",
                        "icon": "fas fa-seedling",
                        "image": "images/flowers/daisy.png",
                        "pickup": "Your smile is as bright and cheerful as a field of daisies."
                    }
                ],
                "emotes": [
                    {
                        "name": "Thumb Emote",
                        "description": "Gesture of approval and support",
                        "icon": "fas fa-thumbs-up",
                        "image": "images/emotes/thumb.png",
                        "pickup": "I'd give you a thumbs up every time I see you, which would be all the time."
                    }
                ],
                "onePieceCharacters": [
                    {
                        "name": "Sanji",
                        "description": "Chivalrous cook of the Straw Hat Pirates",
                        "icon": "fas fa-utensils",
                        "image": "images/onepiece/sanji.png",
                        "pickup": "Like Sanji, I'd fight anyone who disrespects you and cook you the best meals."
                    }
                ],
                "songs": [
                    {
                        "name": "No One Noticed by Marias",
                        "description": "Beautiful emotional track",
                        "icon": "fas fa-music",
                        "image": "images/songs/no-one-noticed.png",
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
                        "icon": "fas fa-envelope",
                        "image": "images/contact/email.png"
                    },
                    {
                        "address": "riyakc665@gmail.com",
                        "type": "Secondary",
                        "description": "Backup email address",
                        "icon": "fas fa-envelope",
                        "image": "images/contact/email.png"
                    }
                ],
                "phones": [
                    {
                        "number": "+977 9814375601",
                        "carrier": "Ncell",
                        "description": "Primary mobile number",
                        "icon": "fas fa-phone-alt",
                        "image": "images/contact/phone.png"
                    },
                    {
                        "number": "+977 9767377365",
                        "carrier": "NTC",
                        "description": "Secondary mobile number",
                        "icon": "fas fa-phone-alt",
                        "image": "images/contact/phone.png"
                    }
                ],
                "location": {
                    "address": "Itahari, Nepal",
                    "description": "The beautiful city where she resides",
                    "icon": "fas fa-map-marker-alt",
                    "image": "images/contact/location.png"
                }
            }
        };
    }
});