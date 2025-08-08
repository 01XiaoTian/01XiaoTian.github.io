class ImageBorderWatermarkMaker {
    constructor() {
        this.initElements();
        this.currentImage = null;
        this.initEventListeners();
    }
    
    initElements() {
        // 上传相关
        this.imageInput = document.getElementById('imageInput');
        this.previewPlaceholder = document.getElementById('previewPlaceholder');
        this.canvas = document.getElementById('canvas');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // 边框控制
        this.borderWidth = document.getElementById('borderWidth');
        this.borderType = document.getElementById('borderType');
        this.borderColor = document.getElementById('borderColor');
        this.borderRadius = document.getElementById('borderRadius');
        this.blurIntensity = document.getElementById('blurIntensity');
        this.foregroundScale = document.getElementById('foregroundScale');
        
        // 控制组元素
        this.borderColorGroup = document.getElementById('borderColorGroup');
        this.blurGroup = document.getElementById('blurGroup');
        this.scaleGroup = document.getElementById('scaleGroup');
        
        // 水印控制
        this.watermarkText = document.getElementById('watermarkText');
        this.fontSize = document.getElementById('fontSize');
        this.textColor = document.getElementById('textColor');
        this.opacity = document.getElementById('opacity');
        this.position = document.getElementById('position');
        
        this.ctx = this.canvas.getContext('2d');
    }
    
    initEventListeners() {
        // 文件上传
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // 边框控制
        this.borderWidth.addEventListener('input', () => {
            this.updateSliderValue('borderWidth', 'px');
            this.updatePreview();
        });
        
        this.borderType.addEventListener('change', () => {
            this.toggleBorderTypeControls();
            this.updatePreview();
        });
        
        this.borderColor.addEventListener('input', () => this.updatePreview());
        
        this.borderRadius.addEventListener('input', () => {
            this.updateSliderValue('borderRadius', 'px');
            this.updatePreview();
        });
        
        this.blurIntensity.addEventListener('input', () => {
            this.updateSliderValue('blurIntensity', 'px');
            this.updatePreview();
        });
        
        this.foregroundScale.addEventListener('input', () => {
            this.updateSliderValue('foregroundScale', '');
            this.updatePreview();
        });
        
        // 水印控制
        this.watermarkText.addEventListener('input', () => this.updatePreview());
        this.fontSize.addEventListener('input', () => {
            this.updateSliderValue('fontSize', 'px');
            this.updatePreview();
        });
        this.textColor.addEventListener('input', () => this.updatePreview());
        this.opacity.addEventListener('input', () => {
            this.updateSliderValue('opacity', '');
            this.updatePreview();
        });
        this.position.addEventListener('change', () => this.updatePreview());
        
        // 下载按钮
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        
        // 初始化滑块值显示和控制组显示
        this.updateAllSliderValues();
        this.toggleBorderTypeControls();
    }
    
    toggleBorderTypeControls() {
        const isBlurMode = this.borderType.value === 'blur';
        
        this.borderColorGroup.style.display = isBlurMode ? 'none' : 'block';
        this.blurGroup.style.display = isBlurMode ? 'block' : 'none';
        this.scaleGroup.style.display = isBlurMode ? 'block' : 'none';
    }
    
    updateSliderValue(elementId, unit) {
        const element = document.getElementById(elementId);
        const valueElement = element.parentNode.querySelector('.slider-value');
        if (valueElement) {
            valueElement.textContent = element.value + unit;
        }
    }
    
    updateAllSliderValues() {
        this.updateSliderValue('borderWidth', 'px');
        this.updateSliderValue('borderRadius', 'px');
        this.updateSliderValue('blurIntensity', 'px');
        this.updateSliderValue('foregroundScale', '');
        this.updateSliderValue('fontSize', 'px');
        this.updateSliderValue('opacity', '');
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('请选择有效的图片文件！');
            return;
        }
        
        console.log('开始加载图片:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('文件读取完成');
            this.currentImage = new Image();
            this.currentImage.onload = () => {
                console.log('图片加载完成:', this.currentImage.width, 'x', this.currentImage.height);
                this.setupCanvas();
                this.updatePreview();
                this.downloadBtn.disabled = false;
                this.previewPlaceholder.style.display = 'none';
                this.canvas.style.display = 'block';
            };
            this.currentImage.onerror = () => {
                console.error('图片加载失败');
                alert('图片加载失败，请选择其他图片');
            };
            this.currentImage.src = e.target.result;
        };
        reader.onerror = () => {
            console.error('文件读取失败');
            alert('文件读取失败，请重试');
        };
        reader.readAsDataURL(file);
    }
    
    setupCanvas() {
        if (!this.currentImage) {
            console.log('没有图片，无法设置画布');
            return;
        }
        
        const maxWidth = 600;
        const maxHeight = 400;
        
        let { width, height } = this.currentImage;
        console.log('原始图片尺寸:', width, 'x', height);
        
        // 计算适合的尺寸
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
            console.log('缩放后尺寸:', width, 'x', height);
        }
        
        const borderWidth = parseInt(this.borderWidth.value);
        
        this.canvas.width = width + borderWidth * 2;
        this.canvas.height = height + borderWidth * 2;
        
        console.log('画布尺寸:', this.canvas.width, 'x', this.canvas.height);
        
        // 设置显示尺寸
        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.maxHeight = '100%';
        this.canvas.style.objectFit = 'contain';
    }
    
    updatePreview() {
        if (!this.currentImage) {
            console.log('没有图片，无法更新预览');
            return;
        }
        
        console.log('更新预览');
        this.setupCanvas();
        this.drawImage();
    }
    
    drawImage() {
        const borderWidth = parseInt(this.borderWidth.value);
        const borderType = this.borderType.value;
        const borderColor = this.borderColor.value;
        const borderRadius = parseInt(this.borderRadius.value);
        const blurIntensity = parseInt(this.blurIntensity.value);
        const foregroundScale = parseFloat(this.foregroundScale.value);
        
        console.log('绘制参数:', { borderWidth, borderType, borderColor, borderRadius, blurIntensity, foregroundScale });
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (borderType === 'blur') {
            // 模糊背景模式
            this.drawBlurBackground(borderWidth, borderRadius, blurIntensity, foregroundScale);
        } else {
            // 纯色边框模式
            this.drawSolidBorder(borderWidth, borderColor, borderRadius);
        }
        
        // 绘制水印
        this.drawWatermark();
        
        console.log('绘制完成');
    }
    
    drawSolidBorder(borderWidth, borderColor, borderRadius) {
        // 绘制圆角边框背景
        this.drawRoundedRect(0, 0, this.canvas.width, this.canvas.height, borderRadius, borderColor);
        
        // 计算图片绘制区域
        const imgWidth = this.canvas.width - borderWidth * 2;
        const imgHeight = this.canvas.height - borderWidth * 2;
        
        // 绘制图片
        this.ctx.save();
        this.clipRoundedRect(borderWidth, borderWidth, imgWidth, imgHeight, Math.max(0, borderRadius - borderWidth));
        this.ctx.drawImage(this.currentImage, borderWidth, borderWidth, imgWidth, imgHeight);
        this.ctx.restore();
    }
    
    drawBlurBackground(borderWidth, borderRadius, blurIntensity, foregroundScale) {
        // 绘制模糊背景
        this.ctx.save();
        this.ctx.filter = `blur(${blurIntensity}px)`;
        this.clipRoundedRect(0, 0, this.canvas.width, this.canvas.height, borderRadius);
        this.ctx.drawImage(this.currentImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // 计算前景图片的尺寸和位置
        const availableWidth = this.canvas.width - borderWidth * 2;
        const availableHeight = this.canvas.height - borderWidth * 2;
        
        const scaledWidth = availableWidth * foregroundScale;
        const scaledHeight = availableHeight * foregroundScale;
        
        const offsetX = borderWidth + (availableWidth - scaledWidth) / 2;
        const offsetY = borderWidth + (availableHeight - scaledHeight) / 2;
        
        // 绘制清晰的前景图片
        this.ctx.save();
        this.clipRoundedRect(offsetX, offsetY, scaledWidth, scaledHeight, Math.max(0, borderRadius - borderWidth));
        this.ctx.drawImage(this.currentImage, offsetX, offsetY, scaledWidth, scaledHeight);
        this.ctx.restore();
    }
    
    drawWatermark() {
        const text = this.watermarkText.value.trim();
        if (!text) return;
        
        const fontSize = parseInt(this.fontSize.value);
        const textColor = this.textColor.value;
        const opacity = parseFloat(this.opacity.value);
        const position = this.position.value;
        const borderWidth = parseInt(this.borderWidth.value);
        const borderType = this.borderType.value;
        
        this.ctx.save();
        
        // 设置字体和样式
        this.ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        this.ctx.fillStyle = textColor;
        this.ctx.globalAlpha = opacity;
        
        // 测量文字尺寸
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        
        // 计算位置（根据边框类型调整）
        let imgWidth, imgHeight, baseX, baseY;
        
        if (borderType === 'blur') {
            const foregroundScale = parseFloat(this.foregroundScale.value);
            const availableWidth = this.canvas.width - borderWidth * 2;
            const availableHeight = this.canvas.height - borderWidth * 2;
            
            imgWidth = availableWidth * foregroundScale;
            imgHeight = availableHeight * foregroundScale;
            baseX = borderWidth + (availableWidth - imgWidth) / 2;
            baseY = borderWidth + (availableHeight - imgHeight) / 2;
        } else {
            imgWidth = this.canvas.width - borderWidth * 2;
            imgHeight = this.canvas.height - borderWidth * 2;
            baseX = borderWidth;
            baseY = borderWidth;
        }
        
        const padding = 20;
        let x, y;
        
        switch (position) {
            case 'top-left':
                x = baseX + padding;
                y = baseY + padding + textHeight;
                break;
            case 'top-right':
                x = baseX + imgWidth - textWidth - padding;
                y = baseY + padding + textHeight;
                break;
            case 'bottom-left':
                x = baseX + padding;
                y = baseY + imgHeight - padding;
                break;
            case 'bottom-right':
                x = baseX + imgWidth - textWidth - padding;
                y = baseY + imgHeight - padding;
                break;
            case 'center':
                x = baseX + (imgWidth - textWidth) / 2;
                y = baseY + (imgHeight + textHeight) / 2;
                break;
            default:
                x = baseX + imgWidth - textWidth - padding;
                y = baseY + imgHeight - padding;
        }
        
        // 绘制文字阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillText(text, x + 1, y + 1);
        
        // 绘制文字
        this.ctx.fillStyle = textColor;
        this.ctx.fillText(text, x, y);
        
        this.ctx.restore();
    }
    
    drawRoundedRect(x, y, width, height, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    clipRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.clip();
    }
    
    downloadImage() {
        if (!this.currentImage) return;
        
        // 创建高质量的下载画布
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');
        
        const borderWidth = parseInt(this.borderWidth.value);
        const borderType = this.borderType.value;
        const borderColor = this.borderColor.value;
        const borderRadius = parseInt(this.borderRadius.value);
        const blurIntensity = parseInt(this.blurIntensity.value);
        const foregroundScale = parseFloat(this.foregroundScale.value);
        
        // 使用原始图片尺寸
        const originalWidth = this.currentImage.width;
        const originalHeight = this.currentImage.height;
        
        downloadCanvas.width = originalWidth + borderWidth * 2;
        downloadCanvas.height = originalHeight + borderWidth * 2;
        
        if (borderType === 'blur') {
            // 模糊背景模式
            downloadCtx.save();
            downloadCtx.filter = `blur(${blurIntensity}px)`;
            this.clipRoundedRectForDownload(downloadCtx, 0, 0, downloadCanvas.width, downloadCanvas.height, borderRadius);
            downloadCtx.drawImage(this.currentImage, 0, 0, downloadCanvas.width, downloadCanvas.height);
            downloadCtx.restore();
            
            // 绘制前景图片
            const availableWidth = originalWidth;
            const availableHeight = originalHeight;
            const scaledWidth = availableWidth * foregroundScale;
            const scaledHeight = availableHeight * foregroundScale;
            const offsetX = borderWidth + (availableWidth - scaledWidth) / 2;
            const offsetY = borderWidth + (availableHeight - scaledHeight) / 2;
            
            downloadCtx.save();
            this.clipRoundedRectForDownload(downloadCtx, offsetX, offsetY, scaledWidth, scaledHeight, Math.max(0, borderRadius - borderWidth));
            downloadCtx.drawImage(this.currentImage, offsetX, offsetY, scaledWidth, scaledHeight);
            downloadCtx.restore();
        } else {
            // 纯色边框模式
            downloadCtx.fillStyle = borderColor;
            downloadCtx.beginPath();
            downloadCtx.moveTo(borderRadius, 0);
            downloadCtx.lineTo(downloadCanvas.width - borderRadius, 0);
            downloadCtx.quadraticCurveTo(downloadCanvas.width, 0, downloadCanvas.width, borderRadius);
            downloadCtx.lineTo(downloadCanvas.width, downloadCanvas.height - borderRadius);
            downloadCtx.quadraticCurveTo(downloadCanvas.width, downloadCanvas.height, downloadCanvas.width - borderRadius, downloadCanvas.height);
            downloadCtx.lineTo(borderRadius, downloadCanvas.height);
            downloadCtx.quadraticCurveTo(0, downloadCanvas.height, 0, downloadCanvas.height - borderRadius);
            downloadCtx.lineTo(0, borderRadius);
            downloadCtx.quadraticCurveTo(0, 0, borderRadius, 0);
            downloadCtx.closePath();
            downloadCtx.fill();
            
            // 绘制图片
            downloadCtx.save();
            const imgRadius = Math.max(0, borderRadius - borderWidth);
            this.clipRoundedRectForDownload(downloadCtx, borderWidth, borderWidth, originalWidth, originalHeight, imgRadius);
            downloadCtx.drawImage(this.currentImage, borderWidth, borderWidth, originalWidth, originalHeight);
            downloadCtx.restore();
        }
        
        // 绘制水印
        const text = this.watermarkText.value.trim();
        if (text) {
            const fontSize = parseInt(this.fontSize.value);
            const textColor = this.textColor.value;
            const opacity = parseFloat(this.opacity.value);
            const position = this.position.value;
            
            downloadCtx.save();
            downloadCtx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            downloadCtx.globalAlpha = opacity;
            
            const textMetrics = downloadCtx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = fontSize;
            const padding = 20;
            
            let imgWidth, imgHeight, baseX, baseY;
            
            if (borderType === 'blur') {
                const availableWidth = originalWidth;
                const availableHeight = originalHeight;
                imgWidth = availableWidth * foregroundScale;
                imgHeight = availableHeight * foregroundScale;
                baseX = borderWidth + (availableWidth - imgWidth) / 2;
                baseY = borderWidth + (availableHeight - imgHeight) / 2;
            } else {
                imgWidth = originalWidth;
                imgHeight = originalHeight;
                baseX = borderWidth;
                baseY = borderWidth;
            }
            
            let x, y;
            
            switch (position) {
                case 'top-left':
                    x = baseX + padding;
                    y = baseY + padding + textHeight;
                    break;
                case 'top-right':
                    x = baseX + imgWidth - textWidth - padding;
                    y = baseY + padding + textHeight;
                    break;
                case 'bottom-left':
                    x = baseX + padding;
                    y = baseY + imgHeight - padding;
                    break;
                case 'bottom-right':
                    x = baseX + imgWidth - textWidth - padding;
                    y = baseY + imgHeight - padding;
                    break;
                case 'center':
                    x = baseX + (imgWidth - textWidth) / 2;
                    y = baseY + (imgHeight + textHeight) / 2;
                    break;
                default:
                    x = baseX + imgWidth - textWidth - padding;
                    y = baseY + imgHeight - padding;
            }
            
            // 绘制文字阴影
            downloadCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            downloadCtx.fillText(text, x + 1, y + 1);
            
            // 绘制文字
            downloadCtx.fillStyle = textColor;
            downloadCtx.fillText(text, x, y);
            
            downloadCtx.restore();
        }
        
        // 下载图片
        downloadCanvas.toBlob((blob) => {
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
    
    clipRoundedRectForDownload(ctx, x, y, width, height, radius) {
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
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化应用');
    new ImageBorderWatermarkMaker();
});