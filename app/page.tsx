'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';

// ---------------------------------------------------------
// 1. THE CINEMAAWA VISUAL TEMPLATE
// ---------------------------------------------------------
interface ReviewTemplateProps {
  movieName: string;
  rating: string;
  firstHalf: string;
  secondHalf: string;
  verdict: string;
  bgImage: string | null;
  mode: 'review' | 'general';
  imgZoom: number;
  imgPosition: number;
}

const ReviewTemplate = React.forwardRef<HTMLDivElement, ReviewTemplateProps>(
  ({ movieName, rating, firstHalf, secondHalf, verdict, bgImage, mode, imgZoom, imgPosition }, ref) => {
    return (
      <div
        ref={ref}
        className="relative w-full aspect-[4/5] max-w-[540px] mx-auto bg-black text-white font-sans flex flex-col overflow-hidden border border-neutral-800 shadow-2xl shrink-0"
      >
        {/* MOVIE TITLE HEADER */}
        <div className="bg-[#ffdd00] text-black text-center py-1.5 font-black text-xl md:text-2xl uppercase tracking-tighter shrink-0 border-b-2 border-black leading-none">
          {movieName || 'MOVIE NAME'} {mode === 'review' ? '- REVIEW' : ''}
        </div>

        {/* TOP CONTENT AREA */}
        <div className={`px-4 py-2 bg-black shrink-0 ${mode === 'review' ? 'border-b border-[#ffdd00]/20' : ''}`}>
          {mode === 'review' && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#00e5ff] font-black text-[10px] tracking-widest uppercase italic underline decoration-2">● 1ST HALF HIGHLIGHTS</span>
            </div>
          )}
          <div className={`${mode === 'general' ? 'text-[12px] md:text-[13px] py-2' : 'text-[10px] md:text-[11px]'} font-bold leading-[1.4] uppercase whitespace-pre-wrap flex flex-col gap-0.5`}>
            {firstHalf}
          </div>
        </div>

        {/* MAIN POSTER AREA (CENTER) */}
        <div className="relative flex-1 w-full border-y-2 border-[#ffdd00] bg-neutral-900 overflow-hidden">
          {bgImage ? (
            <img 
              src={bgImage} 
              alt="Poster" 
              className="absolute inset-0 w-full h-full object-cover" 
              style={{
                objectPosition: `center ${imgPosition}%`,
                transform: `scale(${imgZoom})`,
                transformOrigin: 'center center'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-black text-xs uppercase italic tracking-widest text-center px-10">UPLOAD POSTER IMAGE</div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

          {/* THE LOGO SEAL */}
          <div className="absolute top-3 left-3 flex z-20 pointer-events-none">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <img src="/image.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#ffdd00] object-cover bg-black shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center -rotate-12 translate-y-5">
                <span
                  className="text-[#ffdd00] font-black text-[9px] italic tracking-tighter uppercase"
                  style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.9), -1px -1px 0px rgba(0,0,0,0.9)' }}
                >
                  CINEMAAWA
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge - Only show in review mode or if rating is provided */}
          {mode === 'review' && (
            <div className="absolute bottom-3 right-3 w-14 h-14 bg-black/90 rounded-full border-2 border-[#ffdd00] flex flex-col items-center justify-center shadow-2xl z-10">
              <span className="text-[#ffdd00] font-black text-[7px] tracking-widest leading-none">RATING</span>
              <div className="text-white font-black text-base leading-none mt-1">{rating}</div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTENT AREA */}
        <div className={`px-4 py-2 bg-black shrink-0 ${mode === 'review' ? 'border-t border-[#ffdd00]/20' : ''}`}>
          {mode === 'review' && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400 font-black text-[10px] tracking-widest uppercase italic underline decoration-2">● 2ND HALF HIGHLIGHTS</span>
            </div>
          )}
          <div className={`${mode === 'general' ? 'text-[12px] md:text-[13px] py-2' : 'text-[10px] md:text-[11px]'} font-bold leading-[1.4] uppercase whitespace-pre-wrap flex flex-col gap-0.5`}>
            {secondHalf}
          </div>
        </div>

        {/* VERDICT AREA */}
        <div className="mt-auto shrink-0 border-t-2 border-black">
          <div className="bg-[#ffdd00] text-black w-full h-[54px] flex flex-col justify-center items-center text-center font-black text-[11px] md:text-[12px] uppercase italic tracking-tighter leading-snug overflow-hidden px-4">
            <div className="whitespace-pre-wrap w-full text-center">
              {verdict}
            </div>
          </div>
          <div className="bg-black text-[#00e5ff] text-center py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] border-t border-black shrink-0">
            FOR TELUGU FILM REVIEWS FOLLOW @CINEMAAWA
          </div>
        </div>
      </div>
    );
  }
);
ReviewTemplate.displayName = 'ReviewTemplate';

export default function CinemawaStudio() {
  const [isMounted, setIsMounted] = useState(false);
  const [templateMode, setTemplateMode] = useState<'review' | 'general'>('review');
  const [movieName, setMovieName] = useState('USTAAD BHAGAT SINGH');
  const [rating, setRating] = useState('3.5/5');
  const [firstHalf, setFirstHalf] = useState('');
  const [secondHalf, setSecondHalf] = useState('');
  const [verdict, setVerdict] = useState('OVERALL GA DECENT 👍\nHARISH SHANKAR DID HIS JOB 👏');
  const [bgImage, setBgImage] = useState<string>('');
  const [imgZoom, setImgZoom] = useState(1);
  const [imgPosition, setImgPosition] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const loadProxiedImage = async (url: string) => {
    if (!url) { setBgImage(''); return; }
    setIsLoadingImage(true);
    try {
      const res = await fetch('/api/proxy-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      });
      const data = await res.json();
      setBgImage(data.dataUrl);
      setImgZoom(1); // Reset zoom on new image
      setImgPosition(50); // Reset position
    } catch (err) { alert('Image load failed.'); }
    finally { setIsLoadingImage(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
        setImgZoom(1);
        setImgPosition(50);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = useCallback(async () => {
    if (!templateRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const dataUrl = await toPng(templateRef.current, { 
        pixelRatio: 2, 
        cacheBust: true,
        skipAutoScale: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const link = document.createElement('a');
      link.download = `${movieName.replace(/\s+/g, '-')}-post.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { 
      console.error('Download error:', err);
      alert('Failed to generate image. Please try again.'); 
    }
    finally { setIsGenerating(false); }
  }, [templateRef, movieName, isGenerating]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-yellow-400 selection:text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black text-yellow-400 italic uppercase underline decoration-2 tracking-tighter">Cinemaawa Studio</h1>
            <div className="flex bg-black p-1 rounded-lg border border-neutral-800">
              <button onClick={() => setTemplateMode('review')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${templateMode === 'review' ? 'bg-yellow-400 text-black' : 'text-neutral-500 hover:text-white'}`}>Review</button>
              <button onClick={() => setTemplateMode('general')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${templateMode === 'general' ? 'bg-yellow-400 text-black' : 'text-neutral-500 hover:text-white'}`}>General</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black p-4 rounded-xl border border-neutral-800 space-y-3">
              <input type="text" onChange={(e) => loadProxiedImage(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded text-xs outline-none focus:border-yellow-400" placeholder="Paste Poster URL..." />
              <div className="flex items-center justify-between gap-4">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="text-[10px] text-neutral-50" />
                {bgImage && (
                  <button onClick={() => { setImgZoom(1); setImgPosition(50); }} className="text-[9px] font-black text-yellow-400 uppercase hover:underline">Reset Crop</button>
                )}
              </div>
            </div>

            {bgImage && (
              <div className="grid grid-cols-2 gap-4 bg-black/50 p-3 rounded-xl border border-neutral-800">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest flex justify-between">
                    Zoom <span>{imgZoom.toFixed(1)}x</span>
                  </label>
                  <input type="range" min="1" max="3" step="0.1" value={imgZoom} onChange={(e) => setImgZoom(parseFloat(e.target.value))} className="w-full accent-yellow-400 h-1" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest flex justify-between">
                    Position <span>{imgPosition}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="1" value={imgPosition} onChange={(e) => setImgPosition(parseInt(e.target.value))} className="w-full accent-yellow-400 h-1" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={movieName} onChange={(e) => setMovieName(e.target.value)} className={`${templateMode === 'review' ? 'col-span-2' : 'col-span-3'} w-full bg-black border border-neutral-800 p-3 rounded-lg font-bold uppercase tracking-widest outline-none focus:border-yellow-400`} placeholder={templateMode === 'review' ? 'Movie Name' : 'Title'} />
              {templateMode === 'review' && (
                <input value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg text-center font-black outline-none focus:border-yellow-400" placeholder="Rating" />
              )}
            </div>

            <textarea value={firstHalf} onChange={(e) => setFirstHalf(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg h-24 text-[11px] outline-none" placeholder={templateMode === 'review' ? '1st Half Highlights...' : 'Top Content / Info...'} />
            <textarea value={secondHalf} onChange={(e) => setSecondHalf(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg h-24 text-[11px] outline-none" placeholder={templateMode === 'review' ? '2nd Half Highlights...' : 'Bottom Content / Info...'} />
            <textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} className="w-full bg-[#ffdd00]/10 border border-[#ffdd00]/50 p-3 rounded-lg font-black text-yellow-400 uppercase outline-none text-xs h-16" placeholder={templateMode === 'review' ? 'Verdict...' : 'Footer/Final Note...'} />
          </div>

          <button onClick={downloadImage} disabled={isGenerating} className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-300 uppercase tracking-widest shadow-xl">
            {isGenerating ? '⏳ Processing...' : '📸 Generate Post'}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative group ring-2 ring-yellow-400/20 rounded-xl shadow-2xl w-full flex justify-center max-w-[450px]">
            {isLoadingImage && <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center text-yellow-400 font-black">Loading Poster...</div>}
            <ReviewTemplate ref={templateRef} movieName={movieName} rating={rating} firstHalf={firstHalf} secondHalf={secondHalf} verdict={verdict} bgImage={bgImage} mode={templateMode} imgZoom={imgZoom} imgPosition={imgPosition} />
          </div>
        </div>
      </div>
    </div>
  );
}