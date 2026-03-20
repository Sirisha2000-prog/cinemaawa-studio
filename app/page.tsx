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
}

const ReviewTemplate = React.forwardRef<HTMLDivElement, ReviewTemplateProps>(
  ({ movieName, rating, firstHalf, secondHalf, verdict, bgImage }, ref) => {
    return (
      <div
        ref={ref}
        className="relative w-full aspect-[4/5] max-w-[540px] mx-auto bg-black text-white font-sans flex flex-col overflow-hidden border border-neutral-800 shadow-2xl shrink-0"
      >
        {/* MOVIE TITLE HEADER */}
        <div className="bg-[#ffdd00] text-black text-center py-1.5 font-black text-xl md:text-2xl uppercase tracking-tighter shrink-0 border-b-2 border-black leading-none">
          {movieName || 'MOVIE NAME'} - REVIEW
        </div>

        {/* 1ST HALF HIGHLIGHTS */}
        <div className="px-3 py-1.5 bg-black shrink-0 border-b border-[#ffdd00]/20">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#00e5ff] font-black text-[10px] tracking-widest uppercase italic underline decoration-2">● 1ST HALF HIGHLIGHTS</span>
          </div>
          <div className="text-[9px] md:text-[10px] font-bold leading-[1.2] uppercase whitespace-pre-wrap columns-3 gap-3">
            {firstHalf}
          </div>
        </div>

        {/* MAIN POSTER AREA */}
        <div className="relative flex-1 w-full border-y-2 border-[#ffdd00] bg-neutral-900 overflow-hidden">
          {bgImage ? (
            <img src={bgImage} alt="Poster" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover object-center" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-black text-xs uppercase italic tracking-widest">UPLOAD POSTER IMAGE</div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

          {/* THE LOGO SEAL */}
          <div className="absolute top-3 left-3 flex z-20 pointer-events-none">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <img src="/image.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#ffdd00] object-cover bg-black shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center -rotate-12">
                <span
                  className="text-[#ffdd00] font-black text-[9px] italic tracking-tighter uppercase"
                  style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.9), -1px -1px 0px rgba(0,0,0,0.9)' }}
                >
                  CINEMAAWA
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 w-14 h-14 bg-black/90 rounded-full border-2 border-[#ffdd00] flex flex-col items-center justify-center shadow-2xl z-10">
            <span className="text-[#ffdd00] font-black text-[7px] tracking-widest leading-none">RATING</span>
            <div className="text-white font-black text-base leading-none mt-1">{rating}</div>
          </div>
        </div>

        {/* 2ND HALF */}
        <div className="px-3 py-1.5 bg-black shrink-0 border-t border-[#ffdd00]/20">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-yellow-400 font-black text-[10px] tracking-widest uppercase italic underline decoration-2">● 2ND HALF HIGHLIGHTS</span>
          </div>
          <div className="text-[9px] md:text-[10px] font-bold leading-[1.2] uppercase whitespace-pre-wrap columns-2 gap-4">
            {secondHalf}
          </div>
        </div>

        {/* VERDICT AREA */}
        <div className="mt-auto shrink-0 border-t-2 border-black">
          <div className="bg-[#ffdd00] text-black w-full h-[38px] flex flex-col justify-center items-center text-center font-black text-[11px] md:text-[13px] uppercase italic tracking-tighter leading-none overflow-hidden">
            <span className="whitespace-nowrap w-full px-2 overflow-hidden text-ellipsis">
              {verdict}
            </span>
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
  const [movieName, setMovieName] = useState('USTAAD BHAGAT SINGH');
  const [rating, setRating] = useState('3.5/5');
  const [firstHalf, setFirstHalf] = useState('');
  const [secondHalf, setSecondHalf] = useState('');
  const [verdict, setVerdict] = useState('OVERALL GA DECENT 👍');
  const [bgImage, setBgImage] = useState<string>('');
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
    } catch (err) { alert('Image load failed.'); }
    finally { setIsLoadingImage(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBgImage(URL.createObjectURL(file));
  };

  // MOBILE COMPATIBLE DOWNLOAD HANDLER
  const downloadImage = useCallback(async () => {
    if (!templateRef.current || isGenerating) return;

    setIsGenerating(true);
    try {
      // Small delay ensures mobile browser has rendered the latest state
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(templateRef.current, {
        pixelRatio: 2, // 2 is plenty for mobile and avoids memory crashes
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${movieName.replace(/\s+/g, '-')}-review.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to generate image. Please try again or use a smaller image.');
    } finally {
      setIsGenerating(false);
    }
  }, [templateRef, movieName, isGenerating]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-yellow-400 selection:text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* FORM PANEL */}
        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <h1 className="text-2xl font-black text-yellow-400 italic uppercase underline decoration-2 tracking-tighter">Cinemaawa Studio</h1>
          </div>

          <div className="space-y-4">
            <div className="bg-black p-4 rounded-xl border border-neutral-800 space-y-3">
              <input type="text" onChange={(e) => loadProxiedImage(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded text-xs outline-none focus:border-yellow-400" placeholder="Paste Poster URL..." />
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-[10px] text-neutral-50" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={movieName} onChange={(e) => setMovieName(e.target.value)} className="col-span-2 w-full bg-black border border-neutral-800 p-3 rounded-lg font-bold uppercase tracking-widest outline-none focus:border-yellow-400" />
              <input value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg text-center font-black outline-none focus:border-yellow-400" />
            </div>

            <textarea value={firstHalf} onChange={(e) => setFirstHalf(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg h-24 text-[11px] outline-none" placeholder="1st Half Highlights..." />
            <textarea value={secondHalf} onChange={(e) => setSecondHalf(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg h-24 text-[11px] outline-none" placeholder="2nd Half Highlights..." />
            <input type="text" value={verdict} onChange={(e) => setVerdict(e.target.value)} className="w-full bg-[#ffdd00]/10 border border-[#ffdd00]/50 p-3 rounded-lg font-black text-yellow-400 uppercase outline-none text-xs" />
          </div>

          <button
            onClick={downloadImage}
            disabled={isGenerating}
            className={`w-full ${isGenerating ? 'bg-neutral-700' : 'bg-yellow-400 hover:bg-yellow-300'} text-black font-black py-4 rounded-2xl transition-all uppercase tracking-widest shadow-xl`}
          >
            {isGenerating ? '⏳ Processing...' : '📸 Generate Post'}
          </button>
        </div>

        {/* PREVIEW PANEL */}
        <div className="flex flex-col items-center">
          <div className="relative group ring-2 ring-yellow-400/20 rounded-xl shadow-2xl w-full flex justify-center max-w-[450px]">
            {isLoadingImage && <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center text-yellow-400 font-black">Loading Poster...</div>}
            <ReviewTemplate ref={templateRef} movieName={movieName} rating={rating} firstHalf={firstHalf} secondHalf={secondHalf} verdict={verdict} bgImage={bgImage} />
          </div>
        </div>

      </div>
    </div>
  );
}