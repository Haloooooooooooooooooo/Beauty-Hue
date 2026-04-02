import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

export default function PhotoUploader({ onStart }) {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current.click()}
          className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-navy/20 rounded-full cursor-pointer hover:border-navy/40 transition-colors bg-white/10 backdrop-blur-md"
        >
          <Upload className="w-10 h-10 text-navy mb-4 opacity-50" />
          <span className="text-text font-medium">点击上传照片</span>
          <span className="text-muted text-sm mt-2 text-center px-4">建议使用自然光<br/>素颜照片</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-72 h-72 rounded-full overflow-hidden mb-8 shadow-photo border-4 border-white/50">
            <img src={image} alt="User upload" className="w-full h-full object-cover" />
          </div>
          <button onClick={() => onStart(image)} className="btn-cta bg-navy hover:bg-navy/90 text-white px-10 py-4 rounded-[20px] shadow-lg shadow-navy/20 transition-all font-medium text-lg">
            开始测试
          </button>
        </div>
      )}
    </div>
  );
}
