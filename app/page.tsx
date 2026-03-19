'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';

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
        className="relative w-full aspect-[4/5] max-w-[540px] mx-auto bg-black text-white font-sans flex flex-col overflow-hidden border border-neutral-800 shadow-2xl"
      >
        <div className="bg-[#ffdd00] text-black text-center py-2 font-black text-xl md:text-2xl uppercase tracking-tighter shrink-0 border-b-2 border-black">
          {movieName || 'MOVIE NAME'} - REVIEW
        </div>

        <div className="px-3 py-2 bg-black shrink-0 border-b border-[#ffdd00]/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#00e5ff] font-black text-[10px] tracking-widest uppercase italic underline decoration-2">● 1ST HALF HIGHLIGHTS</span>
          </div>
          <div className="text-[10px] md:text-[11px] font-bold leading-[1.2] uppercase whitespace-pre-wrap columns-3 gap-3">
            {firstHalf}
          </div>
        </div>

        <div className="relative flex-1 w-full border-y-2 border-[#ffdd00] bg-neutral-900 overflow-hidden">
          {bgImage ? (
            <img src={bgImage} alt="Poster" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover object-center" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-black text-xs uppercase italic tracking-widest">UPLOAD POSTER IMAGE</div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

          {/* THE LOGO SEAL */}
          <div className="absolute top-4 left-3 flex z-20 pointer-events-none">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <img src="/image.png" alt="Logo" className="w-14 h-14 rounded-full border-2 border-[#ffdd00] object-cover bg-black shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center -rotate-12">
                <span
                  className="text-[#ffdd00] font-black text-[11px] italic tracking-tighter uppercase"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), -1px -1px 0px rgba(0,0,0,0.9)' }}
                >
                  CINEMAAWA
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 w-16 h-16 bg-black/90 rounded-full border-2 border-[#ffdd00] flex flex-col items-center justify-center shadow-2xl z-10">
            <span className="text-[#ffdd00] font-black text-[8px] tracking-widest leading-none">RATING</span>
            <div className="text-white font-black text-lg leading-none mt-1">{rating}</div>
          </div>
        </div>

        <div className="px-3 py-2 bg-black shrink-0 border-t border-[#ffdd00]/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400 font-black text-[10px] tracking-widest uppercase italic underline decoration-2">● 2ND HALF & PERFORMANCE</span>
          </div>
          <div className="text-[10px] md:text-[11px] font-bold leading-[1.2] uppercase whitespace-pre-wrap columns-2 gap-4">
            {secondHalf}
          </div>
        </div>

        <div className="mt-auto shrink-0 border-t-2 border-black">
          <div className="bg-[#ffdd00] text-black px-4 py-2 text-center font-black text-xs md:text-sm uppercase italic tracking-tight leading-tight whitespace-pre-wrap">
            {verdict}
          </div>
          <div className="bg-black text-[#00e5ff] text-center py-1.5 text-[9px] font-black uppercase tracking-[0.3em]">
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
  const [verdict, setVerdict] = useState('');
  const [bgImage, setBgImage] = useState<string>('');
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

  const downloadImage = useCallback(() => {
    if (templateRef.current === null) return;
    toPng(templateRef.current, { pixelRatio: 3 }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${movieName}-review.png`;
      link.href = dataUrl;
      link.click();
    });
  }, [templateRef, movieName]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 space-y-6 shadow-2xl">
          <h1 className="text-2xl font-black text-yellow-400 italic uppercase">Cinemaawa Studio</h1>
          <div className="space-y-4">
            <div className="bg-black p-4 rounded-xl border border-neutral-800 space-y-3">
              <input type="text" onChange={(e) => loadProxiedImage(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded text-xs outline-none" placeholder="Paste Poster URL..." />
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-[10px] text-neutral-500" />
            </div>
            <input type="text" value={movieName} onChange={(e) => setMovieName(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg font-bold uppercase tracking-widest outline-none" />
            <textarea value={firstHalf} onChange={(e) => setFirstHalf(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg h-32 text-[11px] outline-none" placeholder="1st Half Highlights..." />
            <textarea value={secondHalf} onChange={(e) => setSecondHalf(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 rounded-lg h-32 text-[11px] outline-none" placeholder="2nd Half Highlights..." />
            <div className="grid grid-cols-2 gap-4">
              <input value={rating} onChange={(e) => setRating(e.target.value)} className="bg-black border border-neutral-800 p-3 rounded-lg text-center font-black outline-none" />
              <textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} className="bg-black border border-neutral-800 p-3 rounded-lg font-black text-yellow-400 uppercase outline-none text-xs" placeholder="Verdict" />
            </div>
          </div>
          <button onClick={downloadImage} className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-300 uppercase tracking-widest">📸 Generate Post</button>
        </div>
        <div className="sticky top-10 flex flex-col items-center">
          <div className="relative ring-2 ring-yellow-400/20 rounded-xl overflow-hidden shadow-2xl">
            {isLoadingImage && <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center text-yellow-400 font-black">Processing...</div>}
            <ReviewTemplate ref={templateRef} movieName={movieName} rating={rating} firstHalf={firstHalf} secondHalf={secondHalf} verdict={verdict} bgImage={bgImage} />
          </div>
        </div>
      </div>
    </div>
  );
}