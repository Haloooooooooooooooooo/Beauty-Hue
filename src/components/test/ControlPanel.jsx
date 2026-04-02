import { CheckCircle, Circle, XCircle, Camera } from 'lucide-react';

export default function ControlPanel({ 
  currentColor, 
  onScore, 
  onScreenshot, 
  canSubmit, 
  onSubmit, 
  userScore 
}) {
  return (
    <div className="flex flex-col gap-4 items-center h-full justify-center w-full max-w-[200px]">
      
      <div className="mb-6 w-full group relative">
        <button 
          onClick={canSubmit ? onSubmit : null}
          className={`w-full py-4 rounded-button font-medium transition-all duration-300
            ${canSubmit 
              ? 'bg-navy text-white shadow-lg hover:-translate-y-1' 
              : 'bg-white/30 text-text/40 cursor-not-allowed border border-black/5'}`}
        >
          提交分析
        </button>
        {!canSubmit && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            再测试几轮，结果会更准确
          </div>
        )}
      </div>

      <div className="w-[40px] h-[1px] bg-black/10 my-2"></div>

      {/* 色卡显示 */}
      <div className="flex flex-col items-center mb-10">
        <div 
          className="w-14 h-14 rounded-full mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-white"
          style={{ backgroundColor: currentColor?.color || '#000' }}
        />
        <span className="text-2xl font-bold text-navy tracking-wide">{currentColor?.nameCN || '...'}</span>
        <span className="text-sm text-navy/60 font-mono mt-1 font-medium tracking-widest">{currentColor?.color || '#...'}</span>
      </div>

      {/* 评分按钮组 */}
      <div className="flex flex-col gap-3 w-full">
        <button 
          onClick={() => onScore(1)}
          className={`glass-btn flex items-center justify-center gap-2 group transition-all
            ${userScore === 1 
              ? 'bg-[#FDF3E7] border-[#F8C291] shadow-inner scale-95' 
              : 'hover:bg-[#FDF3E7] hover:border-[#F8C291]/50'}`}
        >
          <CheckCircle className={`w-5 h-5 ${userScore === 1 ? 'text-[#CB6D38]' : 'text-text group-hover:text-[#CB6D38]'}`} />
          <span className={userScore === 1 ? 'text-[#CB6D38] font-semibold' : ''}>适合</span>
        </button>
        
        <button 
          onClick={() => onScore(0)}
          className={`glass-btn flex items-center justify-center gap-2 transition-all
            ${userScore === 0 
              ? 'bg-white/60 border-navy/20 shadow-inner scale-95' 
              : ''}`}
        >
          <Circle className={`w-5 h-5 ${userScore === 0 ? 'text-navy' : 'text-text'}`} />
          <span className={userScore === 0 ? 'text-navy font-semibold' : ''}>一般</span>
        </button>
        
        <button 
          onClick={() => onScore(-1)}
          className={`glass-btn flex items-center justify-center gap-2 group transition-all
            ${userScore === -1 
              ? 'bg-[#F0F4F8] border-[#A3B1C6] shadow-inner scale-95' 
              : 'hover:bg-[#F0F4F8] hover:border-[#A3B1C6]/50'}`}
        >
          <XCircle className={`w-5 h-5 ${userScore === -1 ? 'text-[#6B83A6]' : 'text-text group-hover:text-[#6B83A6]'}`} />
          <span className={userScore === -1 ? 'text-[#6B83A6] font-semibold' : ''}>不适合</span>
        </button>
      </div>

      <div className="w-[40px] h-[1px] bg-black/10 my-4"></div>

      <button 
        onClick={onScreenshot}
        className="glass-btn flex items-center justify-center gap-2 w-full"
      >
        <Camera className="w-5 h-5" />
        <span>截图</span>
      </button>

    </div>
  );
}
