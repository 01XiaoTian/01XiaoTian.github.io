// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 移动端导航菜单切换
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // 点击导航链接时关闭移动端菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // 返回顶部按钮
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 头像点击更换功能
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.addEventListener('click', function() {
            const avatars = [
                'https://via.placeholder.com/120/4f46e5/ffffff?text=头像1',
                'https://via.placeholder.com/120/06b6d4/ffffff?text=头像2',
                'https://via.placeholder.com/120/f59e0b/ffffff?text=头像3',
                'https://via.placeholder.com/120/ef4444/ffffff?text=头像4'
            ];
            
            const currentSrc = this.src;
            let nextIndex = 0;
            
            for (let i = 0; i < avatars.length; i++) {
                if (currentSrc.includes('头像' + (i + 1))) {
                    nextIndex = (i + 1) % avatars.length;
                    break;
                }
            }
            
            this.style.transform = 'scale(0.8)';
            setTimeout(() => {
                this.src = avatars[nextIndex];
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // 折叠式导航功能
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const subAccordionHeaders = document.querySelectorAll('.sub-accordion-header');
    
    // 主分类折叠功能（不自动关闭其他分类）
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const content = document.getElementById(target);
            const isActive = this.classList.contains('active');
            
            // 切换当前分类
            if (isActive) {
                this.classList.remove('active');
                content.classList.remove('active');
            } else {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
    
    // 子分类折叠功能
    subAccordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const content = document.getElementById(target);
            const isActive = this.classList.contains('active');
            
            // 切换当前子分类
            if (isActive) {
                this.classList.remove('active');
                content.classList.remove('active');
            } else {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    if (searchInput && clearBtn) {
        // 搜索输入处理
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                clearBtn.style.display = 'none';
                resetSearch();
                return;
            }
            
            clearBtn.style.display = 'block';
            performSearch(searchTerm);
        }, 300));
        
        // 清除搜索
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            resetSearch();
            searchInput.focus();
        });
        
        // 回车键搜索
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.toLowerCase().trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
    }
    
    // 执行搜索
    function performSearch(searchTerm) {
        const navLinkItems = document.querySelectorAll('.nav-link-item');
        const accordionItems = document.querySelectorAll('.accordion-item');
        const subAccordionItems = document.querySelectorAll('.sub-accordion-item');
        
        let hasVisibleItems = false;
        let matchCount = 0;
        
        // 重置所有项目的显示状态
        navLinkItems.forEach(item => {
            item.style.display = 'flex';
            item.classList.remove('search-highlight');
        });
        accordionItems.forEach(item => item.style.display = 'block');
        subAccordionItems.forEach(item => item.style.display = 'block');
        
        // 搜索并显示匹配项
        accordionItems.forEach(accordionItem => {
            let accordionHasMatch = false;
            const subItems = accordionItem.querySelectorAll('.sub-accordion-item');
            
            subItems.forEach(subItem => {
                let subHasMatch = false;
                const linkItems = subItem.querySelectorAll('.nav-link-item');
                
                linkItems.forEach(linkItem => {
                    const name = linkItem.querySelector('.link-name').textContent.toLowerCase();
                    const desc = linkItem.querySelector('.link-desc').textContent.toLowerCase();
                    
                    if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                        linkItem.style.display = 'flex';
                        linkItem.classList.add('search-highlight');
                        subHasMatch = true;
                        accordionHasMatch = true;
                        hasVisibleItems = true;
                        matchCount++;
                    } else {
                        linkItem.style.display = 'none';
                    }
                });
                
                subItem.style.display = subHasMatch ? 'block' : 'none';
                
                // 如果子分类有匹配项，展开它
                if (subHasMatch) {
                    const subHeader = subItem.querySelector('.sub-accordion-header');
                    const subContent = subItem.querySelector('.sub-accordion-content');
                    if (subHeader && subContent) {
                        subHeader.classList.add('active');
                        subContent.classList.add('active');
                    }
                }
            });
            
            accordionItem.style.display = accordionHasMatch ? 'block' : 'none';
            
            // 如果主分类有匹配项，展开它
            if (accordionHasMatch) {
                const mainHeader = accordionItem.querySelector('.accordion-header');
                const mainContent = accordionItem.querySelector('.accordion-content');
                if (mainHeader && mainContent) {
                    mainHeader.classList.add('active');
                    mainContent.classList.add('active');
                }
            }
        });
        
        // 显示搜索结果提示
        if (!hasVisibleItems && searchTerm !== '') {
            showNotification('未找到匹配的网站', 'info');
        } else if (matchCount > 0) {
            showNotification(`找到 ${matchCount} 个匹配结果`, 'success');
        }
    }
    
    // 重置搜索状态
    function resetSearch() {
        const navLinkItems = document.querySelectorAll('.nav-link-item');
        const accordionItems = document.querySelectorAll('.accordion-item');
        const subAccordionItems = document.querySelectorAll('.sub-accordion-item');
        
        // 重置所有显示状态
        navLinkItems.forEach(item => {
            item.style.display = 'flex';
            item.classList.remove('search-highlight');
        });
        accordionItems.forEach(item => item.style.display = 'block');
        subAccordionItems.forEach(item => item.style.display = 'block');
        
        // 关闭所有折叠项
        accordionHeaders.forEach(header => {
            header.classList.remove('active');
            const target = header.getAttribute('data-target');
            const content = document.getElementById(target);
            if (content) content.classList.remove('active');
        });
        
        subAccordionHeaders.forEach(header => {
            header.classList.remove('active');
            const target = header.getAttribute('data-target');
            const content = document.getElementById(target);
            if (content) content.classList.remove('active');
        });
    }
    
    // 页面加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.platform-card, .tool-card, .accordion-item').forEach(el => {
        observer.observe(el);
    });
    
    // 卡片悬停效果增强
    document.querySelectorAll('.platform-card, .tool-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 快速搜索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // ESC 键清除搜索
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            const clearBtn = document.getElementById('clearSearch');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                if (clearBtn) clearBtn.style.display = 'none';
                resetSearch();
            }
        }
    });
    
    // 统计访问数据（模拟）
    function updateVisitStats() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            const statsSpans = card.querySelectorAll('.tool-stats span');
            if (statsSpans.length >= 2) {
                // 模拟访问量增长
                const visitSpan = statsSpans[0];
                const currentVisits = parseInt(visitSpan.textContent.match(/\d+\.?\d*/)[0]);
                const increment = Math.random() > 0.7 ? 1 : 0;
                if (increment) {
                    const newVisits = (currentVisits + increment).toFixed(1);
                    visitSpan.innerHTML = `<i class="fas fa-eye"></i> ${newVisits}K 访问`;
                }
            }
        });
    }
    
    // 每30秒更新一次访问统计（仅为演示效果）
    setInterval(updateVisitStats, 30000);
    
    // 添加页面加载完成提示
    window.addEventListener('load', function() {
        setTimeout(() => {
            showNotification('页面加载完成！', 'success');
        }, 500);
    });
    
    // 检测用户设备类型
    function detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
        } else if (isTablet) {
            document.body.classList.add('tablet-device');
        } else {
            document.body.classList.add('desktop-device');
        }
    }
    
    detectDevice();
    
    // 添加右键菜单禁用（可选）
    document.addEventListener('contextmenu', function(e) {
        // 在生产环境中可以取消注释以下行来禁用右键菜单
        // e.preventDefault();
    });
    
    // 添加复制保护（可选）
    document.addEventListener('selectstart', function(e) {
        // 在生产环境中可以取消注释以下行来禁用文本选择
        // e.preventDefault();
    });
    
    // 性能监控
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`页面加载时间: ${loadTime}ms`);
                
                if (loadTime > 3000) {
                    console.warn('页面加载时间较长，建议优化');
                }
            }, 0);
        });
    }
});

// 工具函数：格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// 工具函数：获取随机颜色
function getRandomColor() {
    const colors = [
        'var(--primary-color)',
        'var(--secondary-color)',
        'var(--accent-color)',
        '#10b981',
        '#f59e0b',
        '#ef4444'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 导出函数供全局使用
window.showNotification = showNotification;
window.formatNumber = formatNumber;
window.getRandomColor = getRandomColor;
