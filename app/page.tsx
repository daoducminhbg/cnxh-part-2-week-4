'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Scale,
  Vote,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
  Award,
  BookmarkCheck,
  QrCode,
  SlidersHorizontal,
} from 'lucide-react';
import { BackgroundTextures } from '@/components/BackgroundTextures';
import { SCENARIOS } from '@/lib/scenarios';

export default function HomePage() {
  const views = [
    {
      title: 'Màn Chiếu Sân Khấu',
      path: '/projector',
      tag: 'ARENA VIEW',
      description: 'Màn hình máy chiếu lớn trung tâm: Trình chiếu Hồ sơ nghị trường, Lưới phương án A-B, Quyền trợ giúp và Trưng cầu ý dân toàn trường.',
      icon: Award,
      badge: 'Dành cho Máy chiếu lớp học',
      color: 'border-emblem-gold/50 hover:border-emblem-gold',
      glow: 'hover:shadow-gold-glow',
      btnColor: 'bg-gradient-to-r from-emblem-gold to-emblem-amber text-granite-950',
    },
    {
      title: 'Cử Tri Mobile Vote',
      path: '/vote',
      tag: 'VOTER VIEW',
      description: 'Dành cho 60 sinh viên dưới lớp quét mã QR bằng điện thoại: Nhận tín hiệu thời gian thực, rung phản hồi và biểu quyết tức thì.',
      icon: Vote,
      badge: 'Dành cho 60 Sinh viên',
      color: 'border-socialist-crimson/50 hover:border-socialist-bright',
      glow: 'hover:shadow-crimson-glow',
      btnColor: 'bg-gradient-to-r from-socialist-crimson to-socialist-bright text-white',
    },
    {
      title: 'Bàn Điều Khiển Chủ Tọa',
      path: '/admin',
      tag: 'PRESIDIUM DESK',
      description: 'Dành riêng cho Leader (Đào Đức Minh) điều hành: Chuyển đổi kịch bản, kích hoạt quyền trợ giúp, đếm ngược, chốt đáp án & soundboard.',
      icon: SlidersHorizontal,
      badge: 'Dành cho Chủ tọa / Leader',
      color: 'border-gray-700 hover:border-emblem-gold/60',
      glow: 'hover:shadow-gold-glow',
      btnColor: 'bg-granite-800 hover:bg-granite-700 text-amber-200 border border-emblem-gold/30',
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-granite-950 text-gray-100 overflow-x-hidden p-6 md:p-12">
      <BackgroundTextures />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12 my-auto">
        {/* Top Header Badge */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-socialist-crimson/40 via-granite-900 to-socialist-crimson/40 border border-emblem-gold/40 shadow-gold-glow">
            <Scale className="w-4 h-4 text-emblem-gold" />
            <span className="text-xs font-mono font-bold tracking-widest text-amber-200 uppercase">
              VÒNG 2 • CHỦ NGHĨA XÃ HỘI KHOA HỌC
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-200 to-emblem-amber leading-tight">
            KỲ HỌP NGHỊ TRƯỜNG
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-gray-300">
            Xử Lý Hồ Sơ & Trưng Cầu Ý Dân
          </h2>

          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Hệ thống mô phỏng thực hành bản chất của nền <strong className="text-amber-200 font-semibold">Dân chủ Xã hội Chủ nghĩa</strong>: Quyền lực thuộc về nhân dân, kết hợp hài hòa giữa <strong className="text-gray-200 font-semibold">Dân chủ đại diện</strong> (Đại biểu hội đồng) và <strong className="text-socialist-bright font-semibold">Dân chủ trực tiếp</strong> (60 Cử tri quét QR biểu quyết).
          </p>
        </div>

        {/* 3 Entry View Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {views.map((v, i) => {
            const IconComponent = v.icon;
            return (
              <motion.div
                key={v.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-3xl glass-parliament p-6 flex flex-col justify-between border-2 transition-all duration-300 ${v.color} ${v.glow}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-granite-900 border border-emblem-gold/30 text-emblem-gold">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                      {v.tag}
                    </span>
                  </div>

                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-granite-900/90 text-amber-200 border border-gray-800 inline-block mb-2">
                      {v.badge}
                    </span>
                    <h3 className="text-xl font-bold text-gray-100">
                      {v.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {v.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-800">
                  <Link
                    href={v.path}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:brightness-110 ${v.btnColor}`}
                  >
                    <span>Truy cập giao diện</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Academic Topic Footnote */}
        <div className="rounded-2xl glass-parliament p-5 border border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emblem-gold" />
            <span>Nội dung học phần: <strong className="text-gray-200">Chương 4 - Dân chủ XHCN và Nhà nước XHCN</strong></span>
          </div>
          <div>
            Số lượng hồ sơ nghị trường: <strong className="text-emblem-gold">{SCENARIOS.length} chuyên đề</strong>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs font-mono text-gray-400 py-6 border-t border-gray-900">
        Bộ môn Lý luận Chính trị • Học phần Chủ nghĩa Xã hội Khoa học • Khóa 2026
      </footer>
    </main>
  );
}
