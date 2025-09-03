// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    initializeGallery();
});

// 更新统计信息
function updateStats() {
    const imageCards = document.querySelectorAll('.image-card');
    const totalImages = imageCards.length;
    const totalPrompts = imageCards.length; // 每张图片对应一个提示词
    
    // 动画效果更新数字
    animateNumber('totalImages', totalImages);
    animateNumber('totalPrompts', totalPrompts);
}

// 数字动画效果
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    const duration = 1000; // 动画持续时间
    const steps = 30; // 动画步数
    const increment = targetNumber / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, duration / steps);
}

// 初始化画廊
function initializeGallery() {
    const imageCards = document.querySelectorAll('.image-card');
    
    // 为每个图片卡片添加加载动画
    imageCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 打开模态框
function openModal(button) {
    const card = button.closest('.image-card');
    const image = card.querySelector('.gallery-image');
    const title = card.querySelector('.image-title').textContent;
    const fullPrompt = card.querySelector('.full-prompt').textContent;
    
    // 设置模态框内容
    document.getElementById('modalImage').src = image.src;
    document.getElementById('modalImage').alt = image.alt;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrompt').textContent = fullPrompt;
    
    // 显示模态框
    const modal = document.getElementById('imageModal');
    modal.style.display = 'block';
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleModalKeydown);
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // 移除键盘事件监听
    document.removeEventListener('keydown', handleModalKeydown);
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 处理模态框键盘事件
function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

// 复制提示词
function copyPrompt() {
    const promptText = document.getElementById('modalPrompt').textContent;
    
    // 使用现代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(promptText).then(() => {
            showSuccessMessage('提示词已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyTextToClipboard(promptText);
        });
    } else {
        // 降级方案
        fallbackCopyTextToClipboard(promptText);
    }
}

// 降级复制方案
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccessMessage('提示词已复制到剪贴板！');
    } catch (err) {
        console.error('复制失败:', err);
        showSuccessMessage('复制失败，请手动选择文本复制');
    }
    
    document.body.removeChild(textArea);
}

// 显示成功消息
function showSuccessMessage(message) {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// 点击模态框背景关闭
document.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});

// 图片懒加载（可选功能）
function lazyLoadImages() {
    const images = document.querySelectorAll('.gallery-image[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 搜索功能（可选）
function searchImages(query) {
    const cards = document.querySelectorAll('.image-card');
    const searchTerm = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('.image-title').textContent.toLowerCase();
        const prompt = card.querySelector('.full-prompt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const isMatch = title.includes(searchTerm) || 
                       prompt.includes(searchTerm) || 
                       tags.some(tag => tag.includes(searchTerm));
        
        card.style.display = isMatch ? 'block' : 'none';
    });
}

// 添加图片的辅助函数（供开发者使用）
function addImageCard(imageData) {
    const gallery = document.querySelector('.gallery');
    const cardHTML = `
        <div class="image-card">
            <div class="image-container">
                <img src="${imageData.src}" alt="${imageData.alt}" class="gallery-image">
                <div class="image-overlay">
                    <button class="view-btn" onclick="openModal(this)">查看详情</button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="image-title">${imageData.title}</h3>
                <p class="prompt-preview">${imageData.promptPreview}</p>
                <div class="card-meta">
                    ${imageData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="full-prompt" style="display: none;">
                ${imageData.fullPrompt}
            </div>
        </div>
    `;
    
    gallery.insertAdjacentHTML('beforeend', cardHTML);
    updateStats();
}

// 示例：如何使用 addImageCard 函数
/*
addImageCard({
    src: "图片URL",
    alt: "图片描述",
    title: "图片标题",
    promptPreview: "提示词预览（前50字）...",
    tags: ["标签1", "标签2"],
    fullPrompt: "完整的提示词内容"
});
*/
