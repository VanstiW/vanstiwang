const canvas = document.getElementById('donorCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const donors = [];
const radiusBase = 30; // 基础半径大小，可以根据JSON文件大小动态调整
const centerLine = canvas.height / 2;
let expandedDonor = null;

// 创建10个圆形代表各个Donor
for (let i = 0; i < 10; i++) {
    const radius = radiusBase; // 假设每个文件的数据量都一样，实际中你需要根据文件大小调整
    const x = (canvas.width / 11) * (i + 1);
    const y = centerLine + (i % 2 === 0 ? -50 : 50); // 交错排列
    const donor = {id: `Donor_${i + 1}`, x, y, radius, json: `Donor_${i + 1}.json`};
    donors.push(donor);
}

function drawDonor(donor) {
    const img = new Image();
    img.onload = function() {
        // 创建图片填充的圆形
        ctx.save();
        ctx.beginPath();
        ctx.arc(donor.x, donor.y, donor.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, donor.x - donor.radius, donor.y - donor.radius, donor.radius * 2, donor.radius * 2);

        ctx.beginPath();
        ctx.arc(donor.x, donor.y, donor.radius, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();
    };
    img.src = 'path/to/your/image.jpg'; // 替换为实际图片路径
}

function drawDonors() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    donors.forEach(drawDonor);
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedDonor = donors.find(donor => {
        const distance = Math.sqrt((x - donor.x) ** 2 + (y - donor.y) ** 2);
        return distance < donor.radius;
    });

    if (clickedDonor) {
        // 逻辑处理点击放大并加载Zoomable sunburst
    } else {
        // 逻辑处理缩小并返回初始画面
    }
});

drawDonors();
