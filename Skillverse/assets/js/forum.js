// Forum functionality
let currentForumPosts = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// Load and display forum posts
async function loadForumPosts() {
    try {
        const posts = await apiCall(API_ENDPOINTS.forum);
        currentForumPosts = posts;
        renderForumPosts(posts);
    } catch (error) {
        console.error('Error loading forum posts:', error);
        loadMockForumPosts();
    }
}

function loadMockForumPosts() {
    currentForumPosts = [
        {
            id: 1,
            title: 'How to implement user authentication in React?',
            author: 'John Doe',
            authorAvatar: 'https://via.placeholder.com/40',
            content: 'I\'m working on a React app and need to implement user authentication. What\'s the best approach for handling login/logout functionality and protecting routes?',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            replies: 5,
            likes: 12,
            tags: ['React', 'Authentication', 'JavaScript'],
            type: 'question',
            solved: false
        },
        {
            id: 2,
            title: 'Best practices for API design',
            author: 'Jane Smith',
            authorAvatar: 'https://via.placeholder.com/40',
            content: 'What are some best practices when designing RESTful APIs? Looking for advice on naming conventions, error handling, and security.',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            replies: 3,
            likes: 8,
            tags: ['API', 'Best Practices', 'Backend'],
            type: 'discussion',
            solved: false
        },
        {
            id: 3,
            title: 'Database optimization tips',
            author: 'Mike Johnson',
            authorAvatar: 'https://via.placeholder.com/40',
            content: 'Looking for tips to optimize database queries and improve performance. Any recommendations for indexing strategies?',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            replies: 7,
            likes: 15,
            tags: ['Database', 'Performance', 'SQL'],
            type: 'question',
            solved: true
        },
        {
            id: 4,
            title: 'My first React project - feedback welcome!',
            author: 'Sarah Wilson',
            authorAvatar: 'https://via.placeholder.com/40',
            content: 'Just finished my first React project - a todo app with local storage. Would love to get some feedback on my code structure and any improvements I could make.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            replies: 12,
            likes: 23,
            tags: ['React', 'Beginner', 'Feedback'],
            type: 'showcase',
            solved: false
        }
    ];
    renderForumPosts(currentForumPosts);
}

function renderForumPosts(posts) {
    const postsContainer = document.getElementById('forumPosts');
    if (!postsContainer) return;

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-comments fa-3x" style="color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>No posts found</h3>
                <p>Be the first to start a discussion!</p>
                <button class="btn btn-primary" onclick="createNewPost()">
                    <i class="fas fa-plus"></i> Create Post
                </button>
            </div>
        `;
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <div class="forum-post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-author-info">
                    <img src="${post.authorAvatar}" alt="Avatar" class="author-avatar">
                    <div>
                        <span class="post-author">${post.author}</span>
                        <span class="post-date">${formatTimeAgo(post.createdAt)}</span>
                    </div>
                </div>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${post.solved ? '<span class="tag solved"><i class="fas fa-check"></i> Solved</span>' : ''}
                </div>
            </div>
            <h3 class="post-title" onclick="openPostDetail(${post.id})">${post.title}</h3>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})" data-likes="${post.likes}">
                    <i class="fas fa-thumbs-up"></i> <span class="like-count">${post.likes}</span>
                </button>
                <button class="action-btn" onclick="openPostDetail(${post.id})">
                    <i class="fas fa-reply"></i> ${post.replies} Replies
                </button>
                <button class="action-btn" onclick="sharePost(${post.id})">
                    <i class="fas fa-share"></i> Share
                </button>
                <div class="post-type-badge ${post.type}">
                    <i class="fas fa-${getPostTypeIcon(post.type)}"></i>
                    ${post.type}
                </div>
            </div>
        </div>
    `).join('');
}

function getPostTypeIcon(type) {
    const icons = {
        question: 'question-circle',
        discussion: 'comments',
        tutorial: 'graduation-cap',
        showcase: 'star'
    };
    return icons[type] || 'circle';
}

// Post filtering
function filterPosts(filterType) {
    currentFilter = filterType;
    
    // Update active filter tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter posts
    let filteredPosts = currentForumPosts;
    
    if (filterType !== 'all') {
        filteredPosts = currentForumPosts.filter(post => post.type === filterType);
    }
    
    // Apply search filter if exists
    if (currentSearchTerm) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm.toLowerCase()))
        );
    }
    
    renderForumPosts(filteredPosts);
}

// Search functionality
function setupForumSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const debouncedSearch = debounce((searchTerm) => {
        currentSearchTerm = searchTerm;
        filterPosts(currentFilter);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Post interactions
function toggleLike(postId) {
    const post = currentForumPosts.find(p => p.id === postId);
    if (!post) return;
    
    const likeBtn = document.querySelector(`[data-post-id="${postId}"] .action-btn[data-likes]`);
    const likeCountSpan = likeBtn.querySelector('.like-count');
    
    if (post.liked) {
        post.likes--;
        post.liked = false;
        likeBtn.classList.remove('liked');
        showSuccess('Like removed');
    } else {
        post.likes++;
        post.liked = true;
        likeBtn.classList.add('liked');
        showSuccess('Post liked!');
    }
    
    likeCountSpan.textContent = post.likes;
    likeBtn.setAttribute('data-likes', post.likes);
}

function sharePost(postId) {
    const post = currentForumPosts.find(p => p.id === postId);
    if (!post) return;
    
    const shareUrl = `${window.location.origin}/forum.html?post=${postId}`;
    
    if (navigator.share) {
        navigator.share({
            title: post.title,
            text: post.content.substring(0, 100) + '...',
            url: shareUrl
        }).then(() => {
            showSuccess('Post shared successfully!');
        }).catch(() => {
            copyToClipboard(shareUrl);
        });
    } else {
        copyToClipboard(shareUrl);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess('Link copied to clipboard!');
    });
}

function openPostDetail(postId) {
    // In a real app, this would navigate to a detailed post view
    showSuccess(`Opening post details - Feature coming soon!`);
}

// Create new post
function createNewPost() {
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.classList.add('active');
        return;
    }
    
    // Create modal if it doesn't exist
    const modalHtml = `
        <div id="newPostModal" class="modal active">
            <div class="modal-content">
                <button class="close-modal" onclick="closeNewPost()">&times;</button>
                <div class="new-post-form">
                    <h2>Create New Post</h2>
                    <form id="newPostForm">
                        <div class="form-group">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-input" id="postTitle" required 
                                   placeholder="What's your question or topic?">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Content</label>
                            <textarea class="form-input" id="postContent" rows="6" required 
                                      placeholder="Provide details about your question or share your thoughts..."></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tags (comma-separated)</label>
                            <input type="text" class="form-input" id="postTags" 
                                   placeholder="javascript, react, web-development">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Post Type</label>
                            <select class="form-input" id="postType">
                                <option value="question">Question</option>
                                <option value="discussion">Discussion</option>
                                <option value="tutorial">Tutorial</option>
                                <option value="showcase">Showcase</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setupNewPostForm();
}

function setupNewPostForm() {
    const form = document.getElementById('newPostForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            type: document.getElementById('postType').value
        };
        
        await submitNewPost(formData);
    });
}

async function submitNewPost(postData) {
    try {
        setLoadingState('newPostSubmit', true);
        
        // In a real app, this would make an API call
        // const response = await apiCall(API_ENDPOINTS.forum, 'POST', postData);
        
        // Mock implementation
        const newPost = {
            id: Date.now(),
            title: postData.title,
            content: postData.content,
            author: appState.currentUser?.name || 'Current User',
            authorAvatar: 'https://via.placeholder.com/40',
            createdAt: new Date(),
            replies: 0,
            likes: 0,
            tags: postData.tags,
            type: postData.type,
            solved: false,
            liked: false
        };
        
        currentForumPosts.unshift(newPost);
        renderForumPosts(currentForumPosts);
        
        closeNewPost();
        showSuccess('Post created successfully!');
        
        // Scroll to top to show new post
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        showError('postError', error.message || 'Failed to create post');
    } finally {
        setLoadingState('newPostSubmit', false);
    }
}

function closeNewPost() {
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Clear form
        const form = document.getElementById('newPostForm');
        if (form) {
            form.reset();
        }
    }
}

// Post sorting
function sortPosts(sortBy) {
    let sortedPosts = [...currentForumPosts];
    
    switch (sortBy) {
        case 'newest':
            sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'most-liked':
            sortedPosts.sort((a, b) => b.likes - a.likes);
            break;
        case 'most-replies':
            sortedPosts.sort((a, b) => b.replies - a.replies);
            break;
        default:
            break;
    }
    
    renderForumPosts(sortedPosts);
}

// Forum statistics
function updateForumStats() {
    const totalPosts = currentForumPosts.length;
    const totalReplies = currentForumPosts.reduce((sum, post) => sum + post.replies, 0);
    const solvedQuestions = currentForumPosts.filter(post => post.type === 'question' && post.solved).length;
    const totalQuestions = currentForumPosts.filter(post => post.type === 'question').length;
    
    const statsElements = {
        totalPosts: document.getElementById('totalPosts'),
        totalReplies: document.getElementById('totalReplies'),
        solvedRate: document.getElementById('solvedRate')
    };
    
    if (statsElements.totalPosts) {
        statsElements.totalPosts.textContent = totalPosts;
    }
    if (statsElements.totalReplies) {
        statsElements.totalReplies.textContent = totalReplies;
    }
    if (statsElements.solvedRate) {
        const rate = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;
        statsElements.solvedRate.textContent = `${rate}%`;
    }
}

// Initialize forum
function initForum() {
    loadForumPosts();
    setupForumSearch();
    updateForumStats();
    
    // Setup sort functionality
    const sortSelect = document.getElementById('sortPosts');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortPosts(e.target.value);
        });
    }
}

// Export functions for global access
window.filterPosts = filterPosts;
window.toggleLike = toggleLike;
window.sharePost = sharePost;
window.openPostDetail = openPostDetail;
window.createNewPost = createNewPost;
window.closeNewPost = closeNewPost;