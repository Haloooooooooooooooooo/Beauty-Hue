import { useEffect, useRef, useState } from 'react';
import { Move, Search, Upload } from 'lucide-react';

const PREVIEW_SIZE = 288;
const DEFAULT_SCALE = 1.1;

export default function PhotoUploader({ onStart }) {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    setScale(DEFAULT_SCALE);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setImage(loadEvent.target?.result || null);
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (event) => {
    if (!image) return;
    event.preventDefault();
    setDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    setStartPosition(position);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    setPosition({
      x: startPosition.x + deltaX,
      y: startPosition.y + deltaY,
    });
  };

  const stopDragging = () => {
    setDragging(false);
  };

  const handleChooseAgain = () => {
    setImage(null);
    setScale(DEFAULT_SCALE);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    const baseWidth = PREVIEW_SIZE;
    const baseHeight = (img.naturalHeight / img.naturalWidth) * PREVIEW_SIZE;
    const drawWidth = baseWidth * scale;
    const drawHeight = baseHeight * scale;
    const drawX = (PREVIEW_SIZE - drawWidth) / 2 + position.x;
    const drawY = (PREVIEW_SIZE - drawHeight) / 2 + position.y;

    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    ctx.beginPath();
    ctx.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    onStart(canvas.toDataURL('image/png'));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-navy/20 rounded-full cursor-pointer hover:border-navy/40 transition-colors bg-white/10 backdrop-blur-md"
        >
          <Upload className="w-10 h-10 text-navy mb-4 opacity-50" />
          <span className="text-text font-medium">点击上传照片</span>
          <span className="text-muted text-sm mt-2 text-center px-4">
            建议使用自然光
            <br />
            素颜正脸照片
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-[440px]">
          <div
            className="relative w-72 h-72 rounded-full overflow-hidden mb-6 shadow-photo border-4 border-white/50 bg-white/20 touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
          >
            <img
              ref={imageRef}
              src={image}
              alt="用户上传照片"
              draggable="false"
              className="absolute top-1/2 left-1/2 max-w-none pointer-events-none"
              style={{
                width: `${PREVIEW_SIZE * scale}px`,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              }}
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-white/60 pointer-events-none" />
          </div>

          <div className="w-full rounded-[24px] border border-white/40 bg-white/35 backdrop-blur-md px-5 py-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-navy/80 font-medium mb-3">
              <Move className="w-4 h-4" />
              <span>拖动调整照片位置</span>
            </div>
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-navy/60" />
              <input
                type="range"
                min="1"
                max="2.4"
                step="0.01"
                value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
                className="w-full accent-[#162660]"
              />
            </div>
            <p className="mt-3 text-xs text-muted">调整好大小和位置后，再确认开始测试。</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleChooseAgain}
              className="glass-btn px-5 py-3 rounded-[18px] font-medium"
            >
              重新选择照片
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-cta bg-navy hover:bg-navy/90 text-white px-10 py-4 rounded-[20px] shadow-lg shadow-navy/20 transition-all font-medium text-lg"
            >
              确认并开始测试
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
