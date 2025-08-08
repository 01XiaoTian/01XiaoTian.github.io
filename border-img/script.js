class ImageBorderMaker {
    constructor() {
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileName = document.getElementById('fileName');
        this.imageContainer = document.getElementById('imageContainer');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // 控制元素
        this.blurRange = document.getElementById('blurRange');
        this.borderRange = document.getElementById('borderRange');
        this.radiusRange = document.getElementById('radiusRange');
        this.spacingRange = document.getElementById('spacingRange');
        this.scaleRange = document.getElementById('scaleRange');
        this.borderColor = document.getElementById('borderColor');
        
        // 显示值的元素
        this.blurValue = document.getElementById('blurValue');
        this.borderValue = document.getElementById('borderValue');
        this.radiusValue = document.getElementById('radiusValue');
        this.spacingValue = document.getElementById('spacingValue');
        this.scaleValue = document.getElementById('scaleValue');
        
        this.currentImage = null;
        this.canvas = null;
        this.ctx = null;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 上传按钮点击
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        // 文件选择
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
        
        // 控制滑块变化
        this.blurRange.addEventListener('input', () => {
            this.blurValue.textContent = this.blurRange.value + 'px';
            this.updateImageEffect();
        });
        
        this.borderRange.addEventListener('input', () => {
            this.borderValue.textContent = this.borderRange.value + 'px';
            this.updateImageEffect();
        });
        
        this.radiusRange.addEventListener('input', () => {
            this.radiusValue.textContent = this.radiusRange.value + 'px';
            this.updateImageEffect();
        });
        
        this.spacingRange.addEventListener('input', () => {
            this.spacingValue.textContent = this.spacingRange.value + 'px';
            this.updateImageEffect();
        });
        
        this.scaleRange.addEventListener('input', () => {
            this.scaleValue.textContent = this.scaleRange.value;
            this.updateImageEffect();
        });
        
        this.borderColor.addEventListener('input', () => {
            this.updateImageEffect();
        });
        
        // 下载按钮
        this.downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });
        
        // 重置按钮
        this.resetBtn.addEventListener('click', () => {
            this.resetParameters();
        });
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('请选择有效的图片文件！');
            return;
        }
        
        this.fileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = new Image();
            this.currentImage.onload = () => {
                this.createImageEffect();
                this.downloadBtn.disabled = false;
            };
            this.currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    createImageEffect() {
        if (!this.currentImage) return;
        
        // 清空容器
        this.imageContainer.innerHTML = '';
        
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        
        // 创建背景图片（模糊）
        const bgImg = document.createElement('img');
        bgImg.className = 'background-image';
        bgImg.src = this.currentImage.src;
        
        // 创建前景图片（清晰）
        const fgImg = document.createElement('img');
        fgImg.className = 'foreground-image';
        fgImg.src = this.currentImage.src;
        
        wrapper.appendChild(bgImg);
        wrapper.appendChild(fgImg);
        this.imageContainer.appendChild(wrapper);
        
        // 应用初始效果
        this.updateImageEffect();
    }
    
    updateImageEffect() {
        const wrapper = this.imageContainer.querySelector('.image-wrapper');
        if (!wrapper) return;
        
        const bgImg = wrapper.querySelector('.background-image');
        const fgImg = wrapper.querySelector('.foreground-image');
        
        const blur = this.blurRange.value;
        const border = this.borderRange.value;
        const radius = this.radiusRange.value;
        const spacing = this.spacingRange.value;
        const scale = this.scaleRange.value;
        const color = this.borderColor.value;
        
        // 应用背景模糊效果
        bgImg.style.filter = `blur(${blur}px)`;
        
        // 应用包装器样式
        wrapper.style.padding = `${border}px`;
        wrapper.style.backgroundColor = color;
        wrapper.style.borderRadius = `${radius}px`;
        
        // 应用前景图片样式
        fgImg.style.transform = `scale(${scale})`;
        fgImg.style.borderRadius = `${Math.max(0, radius - border)}px`;
        fgImg.style.margin = `${spacing}px`;
        
        // 调整前景图片的最大宽度以适应缩放和间距
        const maxWidth = `calc(100% - ${2 * spacing}px)`;
        fgImg.style.maxWidth = maxWidth;
    }
    
    downloadImage() {
        if (!this.currentImage) return;
        
        // 创建canvas进行图片合成
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const blur = parseFloat(this.blurRange.value);
        const border = parseInt(this.borderRange.value);
        const radius = parseInt(this.radiusRange.value);
        const spacing = parseInt(this.spacingRange.value);
        const scale = parseFloat(this.scaleRange.value);
        const color = this.borderColor.value;
        
        // 计算画布尺寸
        const imgWidth = this.currentImage.width;
        const imgHeight = this.currentImage.height;
        const canvasWidth = imgWidth + 2 * border;
        const canvasHeight = imgHeight + 2 * border;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // 绘制圆角矩形背景
        this.drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, radius, color);
        
        // 绘制模糊背景图
        ctx.save();
        ctx.filter = `blur(${blur}px)`;
        ctx.drawImage(this.currentImage, border, border, imgWidth, imgHeight);
        ctx.restore();
        
        // 绘制清晰前景图
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        const offsetX = border + spacing + (imgWidth - 2 * spacing - scaledWidth) / 2;
        const offsetY = border + spacing + (imgHeight - 2 * spacing - scaledHeight) / 2;
        
        // 创建前景图的圆角裁剪
        ctx.save();
        const fgRadius = Math.max(0, radius - border);
        this.clipRoundedRect(ctx, offsetX, offsetY, scaledWidth, scaledHeight, fgRadius);
        ctx.drawImage(this.currentImage, offsetX, offsetY, scaledWidth, scaledHeight);
        ctx.restore();
        
        // 下载图片
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `边框水印_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
    
    drawRoundedRect(ctx, x, y, width, height, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    clipRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
    }
    
    resetParameters() {
        this.blurRange.value = 5;
        this.borderRange.value = 30;
        this.radiusRange.value = 15;
        this.spacingRange.value = 10;
        this.scaleRange.value = 0.8;
        this.borderColor.value = '#ffffff';
        
        this.blurValue.textContent = '5px';
        this.borderValue.textContent = '30px';
        this.radiusValue.textContent = '15px';
        this.spacingValue.textContent = '10px';
        this.scaleValue.textContent = '0.8';
        
        this.updateImageEffect();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ImageBorderMaker();
});