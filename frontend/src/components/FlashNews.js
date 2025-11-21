import React from 'react';
import { mockFlashNews } from '../mock';

const FlashNews = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E293B] dark:to-[#0F172A] border-y border-[#BFDBFE] dark:border-[#1E3A8A] py-2.5">
      <div className="animate-marquee whitespace-nowrap">
        {[...mockFlashNews, ...mockFlashNews].map((news, idx) => (
          <span key={idx} className="inline-block text-sm text-[#1E40AF] dark:text-[#93C5FD] font-medium mx-8">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] mr-2 align-middle" />
            {news}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FlashNews;
