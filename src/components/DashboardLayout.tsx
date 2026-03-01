"use client"

import React, { useEffect, useState } from 'react';
import { getUserBooks, updateBookStatus, updateBookProgress } from '@/lib/libraryApi';
import { getUserStats } from '@/lib/statsApi';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';
import BookRecordModal from './BookRecordModal';

export default function DashboardLayout() {
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookForRecord, setSelectedBookForRecord] = useState<UserBookDto | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [booksData, statsData] = await Promise.all([
          getUserBooks(),
          getUserStats()
        ]);
        setBooks(booksData);
        setStats(statsData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = async (id: number, status: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await updateBookStatus(id, status);
      setBooks(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
    } catch (e) {
      console.error("Failed to update status", e);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleProgressChange = async (id: number, current: number, max: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextProgress = Math.min(current + 10, max);
    try {
      await updateBookProgress(id, nextProgress);
      setBooks(prev => prev.map(b => b.id === id ? { ...b, readPage: nextProgress } : b));
    } catch (e) {
      console.error("Failed to update progress", e);
    }
  };

  const wishBooks = books.filter(b => b.status === 'wish');
  const readingBooks = books.filter(b => b.status === 'reading');
  const completedBooks = books.filter(b => b.status === 'completed');

  return (
    <div className="w-full h-full p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* 1. Left Column: Stats & Read Books */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6 shrink-0 lg:overflow-y-auto hide-scrollbar">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-white font-medium mb-4">이번 달 읽기 현황</h3>
          <div className="flex justify-center items-center py-8 relative">
            {/* Simple mock Donut representation */}
            <div className="w-32 h-32 rounded-full border-8 border-white/10 border-t-blue-400 border-r-blue-400 flex flex-col items-center justify-center transform -rotate-45">
               <div className="transform rotate-45 flex flex-col items-center">
                 <span className="text-white text-3xl font-light">{stats ? stats.monthlyCompletedCount : 0}</span>
                 <span className="text-white/50 text-xs">완독</span>
               </div>
            </div>
            <div className="absolute top-4 right-4 text-xs text-blue-200 bg-blue-500/20 px-2 py-1 rounded-full">
              진행 중 {stats ? stats.currentlyReadingCount : 0}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex flex-col">
          <h3 className="text-white font-medium mb-4 shrink-0">총 읽은 책 ({stats ? stats.totalCompletedCount : 0})</h3>
          <div className="space-y-3 flex-1 overflow-y-auto hide-scrollbar">
             {loading ? (
               <div className="text-white/50 text-sm py-4 text-center">로딩 중...</div>
             ) : completedBooks.length === 0 ? (
               <div className="text-white/40 text-sm py-4 text-center border border-dashed border-white/20 rounded-xl">아직 다 읽은 책이 없습니다.</div>
             ) : (
               completedBooks.map(book => (
                 <div key={book.id} onClick={() => setSelectedBookForRecord(book)} className="bg-white/5 rounded-xl flex items-center p-3 gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                   {book.coverUrl ? (
                     <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                   ) : (
                     <div className="w-12 h-16 bg-white/10 rounded-md flex items-center justify-center text-[10px] text-white/30 text-center">No Img</div>
                   )}
                   <div className="flex-1 overflow-hidden">
                     <p className="text-white text-sm font-medium truncate group-hover:text-blue-300 transition-colors">{book.title}</p>
                     <p className="text-white/50 text-xs truncate mt-1">{book.author}</p>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>

      {/* 2. Center Column: Reading Progress & Logs */}
      <div className="w-full lg:w-2/4 flex flex-col gap-6 lg:overflow-y-auto hide-scrollbar flex-1 relative">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md relative z-10">
          <h3 className="text-white font-medium mb-4 text-lg">독서 진행 관리</h3>
          
          {loading ? (
             <div className="h-32 flex items-center justify-center text-white/50">데이터를 불러오는 중입니다...</div>
          ) : readingBooks.length === 0 ? (
             <div className="h-32 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center flex-col gap-2">
               <span className="text-white/40">현재 읽고 있는 책이 없습니다.</span>
               <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors mt-2">새로운 책 시작하기</button>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {readingBooks.map(book => {
                 const progressPercent = book.totalPage > 0 ? Math.round((book.readPage / book.totalPage) * 100) : 0;
                 return (
                   <div key={book.id} onClick={() => setSelectedBookForRecord(book)} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-3 group relative overflow-hidden cursor-pointer">
                     <div className="flex gap-3 relative z-10">
                       {book.coverUrl ? (
                         <img src={book.coverUrl} className="w-14 h-20 object-cover rounded-md shadow-md" alt="cover"/>
                       ) : (
                         <div className="w-14 h-20 bg-white/10 rounded-md flex-shrink-0"></div>
                       )}
                       <div className="flex-1 min-w-0">
                         <h4 className="text-white font-medium text-sm truncate group-hover:text-blue-300 transition-colors">{book.title}</h4>
                         <p className="text-white/50 text-xs truncate mt-1">{book.author}</p>
                         
                         <div className="mt-4 flex justify-between text-xs text-white/70 mb-1">
                           <span>{progressPercent}%</span>
                           <span>{book.readPage} / {book.totalPage || '?'}p</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer" onClick={(e) => handleProgressChange(book.id, book.readPage, book.totalPage || 100, e)}>
                           <div className="h-full bg-blue-400 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                         </div>
                       </div>
                     </div>
                     <div className="flex gap-2 relative z-10 mt-1">
                        <button onClick={(e) => handleStatusChange(book.id, 'completed', e)} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg transition-colors">완독 처리</button>
                        <button onClick={(e) => handleStatusChange(book.id, 'dropped', e)} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg transition-colors">중단</button>
                     </div>
                     {/* Background blur decorative element */}
                     <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full z-0 group-hover:bg-blue-400/30 transition-colors"></div>
                   </div>
                 );
               })}
             </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex-1 relative z-10 flex flex-col group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-white font-medium text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                나의 독서 기록 공간
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
               <div className="p-4 bg-white/5 rounded-full border border-white/10 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
               </div>
               <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                 진행 중이거나 다 읽은 책 카드를 클릭하면<br/>
                 해당 책에 대한 <span className="text-purple-400 font-medium">밑줄, 일기, 리뷰</span>를 남길 수 있는<br/>
                 타임라인이 열립니다.
               </p>
               <div className="flex gap-2 mt-4 text-[10px] text-white/30 uppercase tracking-widest">
                 <span>Snippet</span> • <span>Diary</span> • <span>Review</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Right Column: Recently Added & Wishlist */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6 shrink-0 lg:overflow-y-auto hide-scrollbar">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex-1">
          <h3 className="text-white font-medium mb-4">내 서재 도서 목록</h3>
          
          <div className="space-y-4">
             <div>
               <div className="text-xs text-pink-200 mb-2 font-medium bg-pink-500/20 py-1 px-3 rounded-full inline-block">위시리스트 ({wishBooks.length})</div>
               <div className="space-y-2 mt-2">
                 {wishBooks.map(book => (
                   <div key={book.id} onClick={() => setSelectedBookForRecord(book)} className="bg-white/5 rounded-xl px-3 py-2 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                     <span className="text-sm text-white/90 truncate flex-1 pr-2 group-hover:text-pink-300 transition-colors">{book.title}</span>
                     <button onClick={(e) => handleStatusChange(book.id, 'reading', e)} className="text-[10px] text-blue-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100 bg-blue-500/20 px-2 py-1 rounded-md shrink-0">읽기 시작</button>
                   </div>
                 ))}
                 {wishBooks.length === 0 && <div className="text-xs text-white/30 px-2 py-1">위시리스트가 비어있습니다.</div>}
               </div>
             </div>

             <div className="pt-2 border-t border-white/5">
               <div className="text-xs text-blue-200 mt-2 mb-2 font-medium bg-blue-500/20 py-1 px-3 rounded-full inline-block">대기 중 (0)</div>
               <div className="text-xs text-white/30 px-2 py-1">대기 중인 책이 없습니다.</div>
             </div>
          </div>
        </div>
      </div>

      <BookRecordModal 
        isOpen={!!selectedBookForRecord} 
        onClose={() => setSelectedBookForRecord(null)}
        book={selectedBookForRecord}
      />
      
    </div>
  );
}
