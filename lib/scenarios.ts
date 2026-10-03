import { Scenario } from './types';

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    code: 'HỒ SƠ NGHỊ TRƯỜNG SỐ 01',
    title: 'Kinh Tế Tư Nhân & Bản Chất Kinh Tế Của Nền Dân Chủ Xã Hội Chủ Nghĩa',
    topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
    caseBackground: 
      'Trước yêu cầu cải cách thể chế kinh tế trong thời kỳ quá độ lên chủ nghĩa xã hội, Hội đồng Nhân dân tỉnh X tiếp nhận kiến nghị về chính sách phát triển kinh tế tư nhân. Một nhóm ý kiến đề xuất siết chặt rào cản hành chính nhằm bảo đảm ưu thế tuyệt đối của kinh tế nhà nước ngay lập tức.',
    question: 
      'Để bảo đảm đúng bản chất kinh tế của nền Dân chủ Xã hội chủ nghĩa và đường lối Đại hội XIII của Đảng, Đại biểu Quốc hội cần quyết nghị phương án nào?',
    options: [
      {
        id: 'A',
        label: 'PHƯƠNG ÁN A',
        text: 'Thiết lập rào cản hành chính, thu hẹp quy mô kinh tế tư nhân để bảo toàn bản chất công hữu tuyệt đối.',
        subtext: 'Quan điểm thiên lệch về chỉ huy hành chính cơ học, bỏ qua quy luật khách quan của thời kỳ quá độ.'
      },
      {
        id: 'B',
        label: 'PHƯƠNG ÁN B',
        text: 'Tiếp tục hoàn thiện hành lang pháp lý, bảo hộ quyền sở hữu và lợi ích hợp pháp của kinh tế tư nhân; khẳng định kinh tế tư nhân là một động lực quan trọng của nền kinh tế thị trường định hướng XHCN.',
        subtext: 'Bảo đảm quyền dân chủ trong kinh tế, giải phóng sức sản xuất dưới sự điều tiết của Nhà nước pháp quyền XHCN.'
      }
    ],
    correctOptionId: 'B',
    doctrineQuote: '“Kinh tế tư nhân là một động lực quan trọng của nền kinh tế. Khuyến khích, tạo điều kiện thuận lợi để kinh tế tư nhân phát triển nhanh, bền vững, đa dạng.”',
    constitutionalCitation: 'Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII & Hiến pháp năm 2013 (Điều 51)',
    academicExplanation: 
      'Bản chất kinh tế của nền dân chủ XHCN trong thời kỳ quá độ không đồng nhất với việc triệt tiêu cơ học các thành phần kinh tế phi công hữu. Ngược lại, dân chủ trong lĩnh vực kinh tế thể hiện ở việc bảo đảm quyền tự do kinh doanh theo pháp luật, giải phóng mọi năng lực sản xuất, đa dạng hóa các hình thức sở hữu gắn với vai trò chủ đạo của kinh tế nhà nước.'
  },
  {
    id: 'scenario-2',
    code: 'HỒ SƠ NGHỊ TRƯỜNG SỐ 02',
    title: 'Thực Thi Quyền Lực & Quy Chế Dân Chủ Ở Cơ Sở',
    topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
    caseBackground: 
      'Nhằm nhanh chóng đạt chỉ tiêu hoàn thành tuyến đường liên xã kiểu mẫu trước lễ kỷ niệm cấp huyện, Chủ tịch UBND xã Y đã tự quyết định phê duyệt phương án chi ngân sách đối ứng và huy động đóng góp tự nguyện của nhân dân mà không qua khâu hội nghị lấy ý kiến cộng đồng dân cư.',
    question: 
      'Đứng trước đơn chất vấn của cử tri tại kỳ họp HĐND, Chủ tọa và Hội đồng cần xác định tính hợp hiến, hợp pháp của hành vi trên như thế nào?',
    options: [
      {
        id: 'A',
        label: 'PHƯƠNG ÁN A',
        text: 'Ủng hộ Chủ tịch xã tự quyết vì mục tiêu công vụ vì tiến độ và lợi ích chung của địa phương, thủ tục lấy ý kiến dân có thể bổ sung sau khi công trình hoàn thành.',
        subtext: 'Biện minh cho sự chuyên quyền hành chính nhân danh tính cấp bách của nhiệm vụ kinh tế - xã hội.'
      },
      {
        id: 'B',
        label: 'PHƯƠNG ÁN B',
        text: 'Khẳng định việc tự quyết bỏ qua quy trình lấy ý kiến nhân dân là vi phạm nghiêm trọng quyền làm chủ ở cơ sở; trái với phương châm hiến định: "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng".',
        subtext: 'Bảo vệ giá trị cốt lõi của nền dân chủ XHCN - Quyền lực nhà nước thuộc về nhân dân từ cấp cơ sở.'
      }
    ],
    correctOptionId: 'B',
    doctrineQuote: '“Trong mọi công việc của Đảng và Nhà nước, phải luôn quán triệt sâu sắc quan điểm "dân là gốc"; thật sự tin tưởng, tôn trọng và phát huy quyền làm chủ của nhân dân.”',
    constitutionalCitation: 'Luật Thực hiện Dân chủ ở cơ sở năm 2022 & Văn kiện Đại hội XIII',
    academicExplanation: 
      'Nền dân chủ XHCN xác lập nguyên tắc quyền lực nhà nước là do nhân dân ủy quyền. Mọi chính sách liên quan trực tiếp đến quyền và nghĩa vụ của người dân ở cơ sở đều bắt buộc phải tuân thủ cơ chế dân chủ trực tiếp. Tự quyết độc đoán nhân danh "lợi ích công" là biểu hiện của tệ quan liêu xa dân, làm suy giảm niềm tin chính trị.'
  },
  {
    id: 'scenario-3',
    code: 'HỒ SƠ NGHỊ TRƯỜNG SỐ 03',
    title: 'Trách Nhiệm Công Dân & Phát Huy Dân Chủ Trực Tiếp',
    topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
    caseBackground: 
      'Trường Đại học mở đợt khảo sát thường niên lấy ý kiến toàn thể sinh viên về chất lượng giảng dạy, cơ sở vật chất và quy chế học vụ. Một nhóm sinh viên cho rằng ý kiến của từng cá nhân là quá nhỏ bé và việc tham gia chỉ mang tính hình thức nên đã chọn cách bỏ phiếu hời hợt hoặc không tham gia.',
    question: 
      'Dưới góc độ lý luận Chủ nghĩa Xã hội Khoa học về sự kết hợp giữa Dân chủ đại diện và Dân chủ trực tiếp, nhận định nào sau đây là chuẩn mực?',
    options: [
      {
        id: 'A',
        label: 'PHƯƠNG ÁN A',
        text: 'Thái độ này là hợp lý vì sinh viên đã có Ban cán sự lớp và Hội sinh viên đại diện, dân chủ cá nhân trực tiếp không thể tác động đến quyết sách vĩ mô của nhà trường.',
        subtext: 'Tuyệt đối hóa dân chủ đại diện, sinh ra tư tưởng thờ ơ, thụ động chính trị của công dân trẻ.'
      },
      {
        id: 'B',
        label: 'PHƯƠNG ÁN B',
        text: 'Sinh viên trực tiếp tham gia khảo sát với tinh thần trách nhiệm và xây dựng chính là thực thi hình thức dân chủ trực tiếp, rèn luyện văn hóa dân chủ và trực tiếp kiến tạo môi trường học tập.',
        subtext: 'Phát huy năng lực làm chủ, kết hợp hài hòa giữa dân chủ trực tiếp và đại diện trong nhà trường XHCN.'
      }
    ],
    correctOptionId: 'B',
    doctrineQuote: '“Dân chủ không phải là một khẩu hiệu suông, mà là một hiện thực sinh động, gắn bó hữu cơ với trách nhiệm, nghĩa vụ công dân và kỷ cương pháp luật.”',
    constitutionalCitation: 'Chương trình Giáo dục Lý luận Chính trị CNXHKH - Bộ Giáo dục và Đào tạo',
    academicExplanation: 
      'Dân chủ XHCN không dừng lại ở việc bầu ra cơ quan đại diện mà đòi hỏi mỗi công dân phải trực tiếp tham gia vào đời sống chính trị - xã hội thông qua các thiết chế dân chủ trực tiếp. Sự tham gia tự giác của sinh viên phản ánh phẩm chất làm chủ tập thể, rèn luyện năng lực chính trị trước khi bước vào đời sống nhà nước rộng lớn hơn.'
  }
];

export const SCENARIOS = DEFAULT_SCENARIOS;
