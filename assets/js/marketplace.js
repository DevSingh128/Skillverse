// Marketplace functionality
let currentOffers = [];
let currentCategory = 'all';
let currentPriceFilter = 'all';

// Load marketplace offers
async function loadMarketplaceOffers() {
    try {
        const offers = await apiCall(API_ENDPOINTS.marketplace);
        currentOffers = offers;
        renderMarketplaceOffers(offers);
    } catch (error) {
        console.error('Error loading marketplace:', error);
        loadMockMarketplace();
    }
}

function loadMockMarketplace() {
    currentOffers = [
        {
            id: 1,
            title: 'Web Development Mentoring',
            provider: 'Sarah Wilson',
            providerId: 'user_123',
            providerAvatar: 'https://via.placeholder.com/50',
            description: 'I offer 1-on-1 web development mentoring sessions covering modern frameworks and best practices. Perfect for beginners to intermediate developers.',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            price: 50,
            rating: 4.8,
            reviewCount: 24,
            category: 'development',
            availability: 'available',
            responseTime: '2 hours',
            completedProjects: 45,
            languages: ['English', 'Spanish']
        },
        {
            id: 2,
            title: 'Python Data Analysis Help',
            provider: 'David Chen',
            providerId: 'user_456',
            providerAvatar: 'https://via.placeholder.com/50',
            description: 'Need help with data analysis projects using Python, pandas, and machine learning libraries. I specialize in data visualization and statistical analysis.',
            skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'],
            price: 40,
            rating: 4.9,
            reviewCount: 31,
            category: 'data',
            availability: 'busy',
            responseTime: '4 hours',
            completedProjects: 67,
            languages: ['English', 'Mandarin']
        },
        {
            id: 3,
            title: 'UI/UX Design Consultation',
            provider: 'Emma Davis',
            providerId: 'user_789',
            providerAvatar: 'https://via.placeholder.com/50',
            description: 'Professional UI/UX design consultation and feedback for web and mobile applications. I help create user-centered designs that convert.',
            skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'User Testing'],
            price: 60,
            rating: 4.7,
            reviewCount: 18,
            category: 'design',
            availability: 'available',
            responseTime: '1 hour',
            completedProjects: 32,
            languages: ['English', 'French']
        },
        {
            id: 4,
            title: 'Digital Marketing Strategy',
            provider: 'Alex Rodriguez',
            providerId: 'user_012',
            providerAvatar: 'https://via.placeholder.com/50',
            description: 'Help with digital marketing strategies, SEO optimization, and social media campaigns. I focus on data-driven marketing approaches.',
            skills: ['SEO', 'Social Media', 'Google Ads', 'Analytics', 'Content Marketing'],
            price: 45,
            rating: 4.6,
            reviewCount: 22,
            category: 'marketing',
            availability: 'available',
            responseTime: '3 hours',
            completedProjects: 38,
            languages: ['English', 'Spanish']
        },
        {
            id: 5,
            title: 'Mobile App Development',
            provider: 'Lisa Park',
            providerId: 'user_345',
            providerAvatar: 'https://via.placeholder.com/50',
            description: 'Native and cross-platform mobile app development using React Native and Flutter. From MVP to production-ready applications.',
            skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
            price: 75,
            rating: 4.9,
            reviewCount: 15,
            category: 'development',
            availability: 'available',
            responseTime: '2 hours',
            completedProjects: 28,
            languages: ['English', 'Korean']
        }
    ];
    
    renderMarketplaceOffers(currentOffers);
}

function renderMarketplaceOffers(offers) {
    const offersContainer = document.getElementById('marketplaceOffers');
    if (!offersContainer) return;

    if (offers.length === 0) {
        offersContainer.innerHTML = `
            <div class="no-offers">
                <i class="fas fa-handshake fa-3x" style="color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>No offers found</h3>
                <p>Try adjusting your filters or create your own offer!</p>
                <button class="btn btn-primary" onclick="createOffer()">
                    <i class="fas fa-plus"></i> Create Offer
                </button>
            </div>
        `;
        return;
    }

    offersContainer.innerHTML = offers.map(offer => `
        <div class="card marketplace-card" data-category="${offer.category}" data-price="${offer.price}">
            <div class="card-header">
                <h3 class="card-title">${offer.title}</h3>
                <div class="provider-rating">
                    <i class="fas fa-star"></i> ${offer.rating}
                    <span class="review-count">(${offer.reviewCount})</span>
                </div>
            </div>
            <div class="card-body">
                <div class="provider-info">
                    <img src="${offer.providerAvatar}" alt="Provider" class="provider-avatar">
                    <div>
                        <h4>${offer.provider}</h4>
                        <p>${offer.completedProjects} completed projects</p>
                        <div class="provider-badges">
                            <span class="availability-badge ${offer.availability}">
                                <i class="fas fa-circle"></i> ${offer.availability}
                            </span>
                            <span class="response-badge">
                                <i class="fas fa-clock"></i> ${offer.responseTime}
                            </span>
                        </div>
                    </div>
                </div>
                <p class="offer-description">${offer.description}</p>
                <div class="skills-offered">
                    ${offer.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                </div>
                <div class="offer-details">
                    <div class="price">${offer.price}/hour</div>
                    <div class="languages">
                        <i class="fas fa-globe"></i>
                        ${offer.languages.join(', ')}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="contactProvider(${offer.id})" 
                            ${offer.availability === 'busy' ? 'disabled' : ''}>
                        <i class="fas fa-message"></i> 
                        ${offer.availability === 'busy' ? 'Busy' : 'Contact'}
                    </button>
                    <button class="btn btn-secondary" onclick="viewProviderProfile(${offer.providerId})">
                        <i class="fas fa-user"></i> View Profile
                    </button>
                    <button class="btn btn-secondary" onclick="saveOffer(${offer.id})">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter functionality
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    applyFilters();
}

function applyFilters() {
    let filteredOffers = currentOffers;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredOffers = filteredOffers.filter(offer => offer.category === currentCategory);
    }
    
    // Filter by price
    if (currentPriceFilter !== 'all') {
        const [min, max] = getPriceRange(currentPriceFilter);
        filteredOffers = filteredOffers.filter(offer => {
            return offer.price >= min && (max === Infinity || offer.price <= max);
        });
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('skillSearch')?.value.toLowerCase();
    if (searchTerm) {
        filteredOffers = filteredOffers.filter(offer =>
            offer.title.toLowerCase().includes(searchTerm) ||
            offer.description.toLowerCase().includes(searchTerm) ||
            offer.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
            offer.provider.toLowerCase().includes(searchTerm)
        );
    }
    
    renderMarketplaceOffers(filteredOffers);
    updateFilterStats(filteredOffers.length);
}

function getPriceRange(filterValue) {
    switch (filterValue) {
        case '0-25': return [0, 25];
        case '25-50': return [25, 50];
        case '50-100': return [50, 100];
        case '100+': return [100, Infinity];
        default: return [0, Infinity];
    }
}

function updateFilterStats(count) {
    const statsElement = document.getElementById('filterStats');
    if (statsElement) {
        statsElement.textContent = `${count} offer${count !== 1 ? 's' : ''} found`;
    }
}

// Search functionality
function setupMarketplaceSearch() {
    const searchInput = document.getElementById('skillSearch');
    const priceFilter = document.getElementById('priceFilter');
    
    if (searchInput) {
        const debouncedSearch = debounce(() => {
            applyFilters();
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', (e) => {
            currentPriceFilter = e.target.value;
            applyFilters();
        });
    }
}

// Provider interactions
function contactProvider(offerId) {
    const offer = currentOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    // Create contact modal
    const modalHtml = `
        <div id="contactModal" class="modal active">
            <div class="modal-content">
                <button class="close-modal" onclick="closeContactModal()">&times;</button>
                <div class="contact-form">
                    <h2>Contact ${offer.provider}</h2>
                    <div class="provider-summary">
                        <img src="${offer.providerAvatar}" alt="Provider" class="provider-avatar">
                        <div>
                            <h4>${offer.provider}</h4>
                            <p>${offer.title}</p>
                            <p><strong>${offer.price}/hour</strong></p>
                        </div>
                    </div>
                    <form id="contactForm">
                        <div class="form-group">
                            <label class="form-label">Subject</label>
                            <input type="text" class="form-input" id="contactSubject" 
                                   value="Interested in ${offer.title}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Message</label>
                            <textarea class="form-input" id="contactMessage" rows="5" required
                                      placeholder="Hi ${offer.provider}, I'm interested in your ${offer.title} service. Could you tell me more about..."></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Project Timeline</label>
                            <select class="form-input" id="projectTimeline">
                                <option value="asap">ASAP</option>
                                <option value="week">Within a week</option>
                                <option value="month">Within a month</option>
                                <option value="flexible">Flexible</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Budget Range</label>
                            <select class="form-input" id="budgetRange">
                                <option value="hourly">Hourly rate (${offer.price}/hr)</option>
                                <option value="project">Project-based</option>
                                <option value="discuss">Let's discuss</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setupContactForm(offerId);
}

function setupContactForm(offerId) {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            offerId,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            timeline: document.getElementById('projectTimeline').value,
            budget: document.getElementById('budgetRange').value
        };
        
        await sendContactMessage(formData);
    });
}

async function sendContactMessage(formData) {
    try {
        // In a real app, this would send the message via API
        // await apiCall('/marketplace/contact', 'POST', formData);
        
        showSuccess('Message sent successfully! The provider will get back to you soon.');
        closeContactModal();
    } catch (error) {
        showError('contactError', 'Failed to send message. Please try again.');
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.remove();
    }
}

function viewProviderProfile(providerId) {
    showSuccess(`Viewing provider profile - Feature coming soon!`);
}

function saveOffer(offerId) {
    const offer = currentOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    // Toggle saved state
    offer.saved = !offer.saved;
    
    // Save to localStorage
    const savedOffers = JSON.parse(localStorage.getItem('savedOffers') || '[]');
    if (offer.saved) {
        savedOffers.push(offerId);
        showSuccess('Offer saved to your bookmarks!');
    } else {
        const index = savedOffers.indexOf(offerId);
        if (index > -1) {
            savedOffers.splice(index, 1);
        }
        showSuccess('Offer removed from bookmarks');
    }
    localStorage.setItem('savedOffers', JSON.stringify(savedOffers));
    
    // Update button text
    const saveBtn = document.querySelector(`[onclick="saveOffer(${offerId})"]`);
    if (saveBtn) {
        if (offer.saved) {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            saveBtn.classList.add('saved');
        } else {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
            saveBtn.classList.remove('saved');
        }
    }
}

// Create new offer
function createOffer() {
    openModal('createOfferModal');
    setupCreateOfferForm();
}

function setupCreateOfferForm() {
    const form = document.getElementById('createOfferForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('offerTitle').value,
            description: document.getElementById('offerDescription').value,
            skills: document.getElementById('offerSkills').value.split(',').map(s => s.trim()),
            rate: parseFloat(document.getElementById('offerRate').value),
            category: document.getElementById('offerCategory').value
        };
        
        await submitOffer(formData);
    });
}

async function submitOffer(offerData) {
    try {
        // In a real app, this would create the offer via API
        // await apiCall(API_ENDPOINTS.marketplace, 'POST', offerData);
        
        const newOffer = {
            id: Date.now(),
            ...offerData,
            provider: appState.currentUser?.name || 'Current User',
            providerId: 'current_user',
            providerAvatar: 'https://via.placeholder.com/50',
            rating: 0,
            reviewCount: 0,
            availability: 'available',
            responseTime: '1 hour',
            completedProjects: 0,
            languages: ['English']
        };
        
        currentOffers.unshift(newOffer);
        renderMarketplaceOffers(currentOffers);
        
        closeCreateOffer();
        showSuccess('Offer created successfully!');
        
    } catch (error) {
        showError('createOfferError', 'Failed to create offer. Please try again.');
    }
}

// Sort offers
function sortOffers(sortBy) {
    let sortedOffers = [...currentOffers];
    
    switch (sortBy) {
        case 'price-low':
            sortedOffers.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedOffers.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedOffers.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sortedOffers.sort((a, b) => b.id - a.id);
            break;
        case 'popular':
            sortedOffers.sort((a, b) => b.completedProjects - a.completedProjects);
            break;
    }
    
    renderMarketplaceOffers(sortedOffers);
}

// Load saved offers
function loadSavedOffers() {
    const savedOffers = JSON.parse(localStorage.getItem('savedOffers') || '[]');
    
    // Mark offers as saved
    currentOffers.forEach(offer => {
        offer.saved = savedOffers.includes(offer.id);
    });
}

// Initialize marketplace
function initMarketplace() {
    loadMarketplaceOffers();
    setupMarketplaceSearch();
    loadSavedOffers();
    
    // Setup sort functionality
    const sortSelect = document.getElementById('sortOffers');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortOffers(e.target.value);
        });
    }
}

// Export functions for global access
window.filterByCategory = filterByCategory;
window.contactProvider = contactProvider;
window.viewProviderProfile = viewProviderProfile;
window.saveOffer = saveOffer;
window.createOffer = createOffer;
window.closeContactModal = closeContactModal;
window.closeCreateOffer = closeCreateOffer;