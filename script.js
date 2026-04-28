// --- 既存のコード ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function copyPrompt(event, id) {
    const promptText = document.getElementById(`prompt-${id}`).innerText;
    navigator.clipboard.writeText(promptText).then(() => {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = 'コピー完了！';
        btn.style.backgroundColor = '#10b981';
        btn.style.color = 'white';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 2000);
    });
}

// --- 新機能：記事の投稿と表示 ---

const postForm = document.getElementById('post-form');
const blogPostsContainer = document.getElementById('blog-posts');

// 読み込み時に保存された記事を表示
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
});

// フォーム送信時の処理
postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPost = {
        id: Date.now(),
        title: document.getElementById('post-title').value,
        category: document.getElementById('post-category').value,
        image: document.getElementById('post-image').value || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
        content: document.getElementById('post-content').value,
        date: new Date().toLocaleDateString('ja-JP')
    };

    // ローカルストレージに保存
    const posts = JSON.parse(localStorage.getItem('kaden_posts') || '[]');
    posts.unshift(newPost); // 新しい順に保存
    localStorage.setItem('kaden_posts', JSON.stringify(posts));

    // フォームをリセット
    postForm.reset();
    
    // 再描画
    renderPosts();
    
    alert('記事をアップロードしました！');
});

// 記事を描画する関数
function renderPosts() {
    const posts = JSON.parse(localStorage.getItem('kaden_posts') || '[]');
    
    // 初期データがない場合のサンプル
    if (posts.length === 0) {
        const initialPosts = [
            {
                title: "「異音がする」洗濯機の修理レポート",
                category: "ランドリー・掃除",
                image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
                content: "脱水時に大きな音がする場合、ベアリングや吊り棒の故障が考えられます...",
                date: "2024.04.28"
            }
        ];
        localStorage.setItem('kaden_posts', JSON.stringify(initialPosts));
        renderPosts();
        return;
    }

    blogPostsContainer.innerHTML = posts.map(post => `
        <article class="blog-card" style="animation: fadeInUp 0.5s ease-out forwards;">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-content">
                <span class="tag">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <div class="blog-footer">
                    <span>${post.date}</span>
                    <a href="#" class="read-more">記事を読む <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </article>
    `).join('');
}
