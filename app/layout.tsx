import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kỳ Họp Nghị Trường - Xử Lý Hồ Sơ & Trưng Cầu Ý Dân | CNXHKH',
  description: 'Hệ thống mô phỏng Dân chủ Xã hội Chủ nghĩa: Kết hợp Dân chủ Đại diện và Dân chủ Trực tiếp môn Chủ nghĩa Xã hội Khoa học',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-granite-950 text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
