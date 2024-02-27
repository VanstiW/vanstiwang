

// 生成20个随机位置的泡泡
for (let i = 0; i < 20; i++) {
    let bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.top = `${Math.random() * 100}%`;
    document.getElementById('bubbles-container').appendChild(bubble);
}
