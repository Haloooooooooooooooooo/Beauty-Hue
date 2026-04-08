"use strict";Object.defineProperty(exports, "__esModule", {value: true});function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

 async function createFrameSnapshot({
  imageSrc,
  colorHex,
}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1200;
  canvas.height = 920;

  const frameX = 0;
  const frameY = 0;
  const frameWidth = canvas.width;
  const frameHeight = canvas.height;
  const headerHeight = 134;
  const bodyPadding = 40;
  const innerX = bodyPadding;
  const innerY = headerHeight;
  const innerWidth = frameWidth - bodyPadding * 2;
  const innerHeight = frameHeight - headerHeight - bodyPadding;

  ctx.shadowColor = 'rgba(22, 38, 96, 0.14)';
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#FCF8F1';
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 24);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 24);
  ctx.stroke();

  ctx.fillStyle = '#FAF6F0';
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameWidth, headerHeight, [24, 24, 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#162660';
  ctx.font = '900 56px Arial';
  ctx.fillText('Color For You', frameX + 72, frameY + 76);

  ctx.fillStyle = 'rgba(22, 38, 96, 0.36)';
  ctx.font = '700 22px Arial';
  ctx.fillText('ORIGINAL', frameX + frameWidth - 200, frameY + 76);

  ctx.fillStyle = '#FAF6F0';
  ctx.fillRect(0, headerHeight, frameWidth, frameHeight - headerHeight);

  ctx.fillStyle = colorHex || '#FAF6F0';
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, innerWidth, innerHeight, 28);
  ctx.fill();

  const colorGlow = ctx.createRadialGradient(
    innerX + innerWidth / 2,
    innerY + innerHeight / 2,
    140,
    innerX + innerWidth / 2,
    innerY + innerHeight / 2,
    innerWidth / 2
  );
  colorGlow.addColorStop(0, 'rgba(255,255,255,0.12)');
  colorGlow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = colorGlow;
  ctx.fillRect(innerX, innerY, innerWidth, innerHeight);

  if (imageSrc) {
    const portrait = await loadImage(imageSrc);
    const avatarSize = 430;
    const avatarX = frameX + frameWidth / 2 - avatarSize / 2;
    const avatarY = innerY + innerHeight / 2 - avatarSize / 2 + 22;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 90;
    ctx.shadowOffsetY = 36;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 - 16, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(portrait, avatarX - 12, avatarY - 12, avatarSize + 24, avatarSize + 24);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.78)';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(frameX + frameWidth - 58, frameY + frameHeight - 68);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.34)';
  ctx.font = '700 18px Arial';
  ctx.fillText('PHOTOGRAPHY BY BEAUTY HUE', 0, 0);
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.86);
} exports.createFrameSnapshot = createFrameSnapshot;
