import { Scenario } from './types';

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    code: 'HỒ SƠ NGHỊ TRƯỜNG SỐ 01',
    title: 'Vấn Đề Kinh Tế Tư Nhân Và Dân Chủ Trong Kinh Tế',
    topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
    caseBackground: 
      'Tại một địa phương, một tập đoàn kinh tế tư nhân đang phát triển rất mạnh mẽ, đóng góp lớn vào ngân sách và giải quyết việc làm. Tuy nhiên, trong công tác quản lý, có hai luồng quan điểm trái chiều tham mưu cho chính quyền:',
    question: 
      'Đại biểu hãy xem xét hai luồng quan điểm tham mưu và quyết nghị phương án phù hợp với việc phát huy dân chủ trong kinh tế:',
    options: [
      {
        id: 'A',
        label: 'PHƯƠNG ÁN A',
        text: 'Cần thiết lập các rào cản hành chính để thu hẹp quy mô của doanh nghiệp tư nhân này, vì nếu để kinh tế tư nhân phát triển quá mạnh sẽ làm phai nhạt bản chất kinh tế của nền dân chủ xã hội chủ nghĩa.',
        subtext: 'Thu hẹp quy mô tư nhân vì lo ngại phai nhạt bản chất kinh tế XHCN'
      },
      {
        id: 'B',
        label: 'PHƯƠNG ÁN B',
        text: 'Cần tiếp tục tạo hành lang pháp lý thuận lợi, bảo hộ quyền lợi hợp pháp của doanh nghiệp tư nhân này để họ phát triển, bởi đó chính là sự biểu hiện của việc phát huy dân chủ trong lĩnh vực kinh tế.',
        subtext: 'Bảo hộ quyền lợi hợp pháp, tiếp tục phát huy dân chủ trong kinh tế'
      }
    ],
    correctOptionId: 'B',
    doctrineQuote: '“Thể chế hóa quan điểm của Đảng về phát triển đa dạng các hình thức sở hữu, thành phần kinh tế, loại hình doanh nghiệp, bảo hộ các quyền và lợi ích hợp pháp của chủ sở hữu tài sản thuộc các hình thức sở hữu.”',
    constitutionalCitation: 'Văn kiện Đại hội XIII của Đảng & Giáo trình CNXHKH',
    academicExplanation: 
      'Cảm ơn phần trả lời của đại biểu. Phương án B là hoàn toàn chính xác.\n\nDưới góc độ lý luận, bản chất kinh tế của nền dân chủ xã hội chủ nghĩa không hình thành từ "hư vô" theo mong muốn chủ quan, mà nó là sự kế thừa và phát triển mọi thành tựu nhân loại đã tạo ra trong lịch sử, đồng thời lọc bỏ những nhân tố lạc hậu.\n\nĐể phát huy dân chủ xã hội chủ nghĩa ở Việt Nam hiện nay, Đảng ta chủ trương xây dựng, hoàn thiện thể chế kinh tế thị trường định hướng xã hội chủ nghĩa tạo ra cơ sở kinh tế vững chắc.\n\nViệc tạo điều kiện cho kinh tế tư nhân phát triển chính là việc thực thi chủ trương: "thể chế hóa quan điểm của Đảng về phát triển đa dạng các hình thức sở hữu, thành phần kinh tế, loại hình doanh nghiệp, bảo hộ các quyền và lợi ích hợp pháp của chủ sở hữu tài sản thuộc các hình thức sở hữu". Do đó, cản trở sự phát triển hợp pháp của tư nhân (Phương án A) là đi ngược lại với việc phát huy dân chủ trong kinh tế.'
  },
  {
    id: 'scenario-2',
    code: 'HỒ SƠ NGHỊ TRƯỜNG SỐ 02',
    title: 'Vấn Đề Thực Thi Quyền Lực Và Dân Chủ Cơ Sở',
    topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
    caseBackground: 
      'Chủ tịch Ủy ban nhân dân cấp xã quyết định sử dụng một khoản ngân sách xã hội hóa của địa phương để thi công một công trình công cộng mà không thông qua việc lấy ý kiến nhân dân. Khi người dân có ý kiến phản ánh, vị Chủ tịch xã giải thích:',
    question: 
      'Đứng trước ý kiến giải thích của Chủ tịch xã và phản ánh của người dân, Đại biểu hãy quyết định phương án đúng đắn theo quy chế dân chủ cơ sở:',
    options: [
      {
        id: 'A',
        label: 'PHƯƠNG ÁN A',
        text: '"Nhân dân đã bầu tôi làm người đứng đầu, tức là nhân dân đã ủy quyền quản lý. Để đảm bảo tính hiệu quả và nhanh chóng, tôi có quyền quyết định trực tiếp mà không cần thiết phải tổ chức lấy ý kiến tốn thời gian."',
        subtext: 'Quan điểm Chủ tịch xã: Đã được bầu làm người đứng đầu thì tự quyết trực tiếp'
      },
      {
        id: 'B',
        label: 'PHƯƠNG ÁN B',
        text: '"Việc cán bộ tự quyết định mà bỏ qua khâu lấy ý kiến cộng đồng dân cư đối với các công trình có nguồn vốn đóng góp của dân là vi phạm quyền làm chủ của nhân dân và trái với quy chế dân chủ cơ sở."',
        subtext: 'Ý kiến của người dân: Tự quyết bỏ qua ý kiến dân là vi phạm quy chế dân chủ cơ sở'
      }
    ],
    correctOptionId: 'B',
    doctrineQuote: '“Dân là gốc, là chủ, dân làm chủ. Cơ quan, tổ chức phải thực hiện phương châm "dân biết, dân bàn, dân làm, dân kiểm tra".”',
    constitutionalCitation: 'Luật Thực hiện Dân chủ ở cơ sở & Văn kiện Đại hội XIII của Đảng',
    academicExplanation: 
      'Rất cảm ơn đại biểu. Ý kiến của nhân dân (Phương án B) là hoàn toàn đúng đắn.\n\nTrong nền dân chủ xã hội chủ nghĩa, quyền làm chủ của nhân dân là tất cả quyền lực đều thuộc về nhân dân, dân là gốc, là chủ, dân làm chủ.\n\nViệc Chủ tịch xã tự ý quyết định là vi phạm nghiêm trọng nguyên tắc hoạt động của các cơ quan, tổ chức là phải thực hiện phương châm "dân biết, dân bàn, dân làm, dân kiểm tra".\n\nĐảng ta đã khẳng định: "Mọi đường lối, chính sách của Đảng và pháp luật của Nhà nước đều vì lợi ích của nhân dân, có sự tham gia ý kiến của nhân dân". Hành vi của cán bộ trong tình huống trên là biểu hiện của sự lạm quyền, làm suy giảm động lực phát triển và đi ngược lại bản chất của nền dân chủ xã hội chủ nghĩa.'
  },
  {
    id: 'scenario-3',
    code: 'HỒ SƠ NGHỊ TRƯỜNG SỐ 03',
    title: 'Vấn Đề Trách Nhiệm Cá Nhân Và Dân Chủ Trực Tiếp',
    topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
    caseBackground: 
      'Nhà trường triển khai một đợt khảo sát trực tuyến toàn diện nhằm lấy ý kiến sinh viên về chất lượng giảng dạy môn Lý luận chính trị và công tác quản lý của nhà trường. Trong sinh viên xuất hiện hai luồng ý kiến:',
    question: 
      'Đứng trước hai luồng ý kiến trong sinh viên, Đại biểu hãy khẳng định nhận thức và hành động đúng đắn về dân chủ trực tiếp:',
    options: [
      {
        id: 'A',
        label: 'PHƯƠNG ÁN A',
        text: 'Sinh viên không cần thiết phải đánh giá một cách nghiêm túc, chỉ cần làm cho có để đủ thủ tục điểm rèn luyện. Việc quản lý và nâng cao chất lượng là trách nhiệm của lãnh đạo nhà trường, ý kiến của sinh viên cá nhân không mang lại tác động gì đáng kể.',
        subtext: 'Làm chiếu lệ cho đủ thủ tục, cho rằng ý kiến cá nhân không có tác động gì'
      },
      {
        id: 'B',
        label: 'PHƯƠNG ÁN B',
        text: 'Mỗi sinh viên cần phải tham gia khảo sát một cách trung thực, trách nhiệm và thẳng thắn. Đây chính là quyền lợi và cũng là phương thức để sinh viên trực tiếp tham gia vào công tác quản lý, xây dựng môi trường giáo dục dân chủ.',
        subtext: 'Tham gia trung thực, trách nhiệm để trực tiếp tham gia quản lý, xây dựng môi trường dân chủ'
      }
    ],
    correctOptionId: 'B',
    doctrineQuote: '“Thông qua dân chủ trực tiếp, nhân dân bằng hành động trực tiếp của mình thực hiện quyền làm chủ nhà nước và xã hội. Mọi công dân đều có quyền tham gia quản lý xã hội bằng nhiều cách khác nhau, tùy theo trách nhiệm và nghĩa vụ của mình.”',
    constitutionalCitation: 'Giáo trình Chủ nghĩa Xã hội Khoa học - Bộ Giáo dục và Đào tạo',
    academicExplanation: 
      'Xin cảm ơn đại biểu. Sự lựa chọn Phương án B thể hiện nhận thức chính trị rất đúng đắn.\n\nDưới góc độ lý luận, bản chất dân chủ xã hội chủ nghĩa ở Việt Nam được thực hiện thông qua các hình thức dân chủ gián tiếp và dân chủ trực tiếp.\n\nViệc sinh viên điền phiếu khảo sát chính là biểu hiện sinh động của hình thức dân chủ trực tiếp. Đây là hình thức thông qua đó, nhân dân (sinh viên) "bằng hành động trực tiếp của mình thực hiện quyền làm chủ nhà nước và xã hội", được thông tin về hoạt động của tổ chức, được bàn bạc về công việc của cộng đồng.\n\n"Mọi công dân đều có quyền tham gia quản lý xã hội bằng nhiều cách khác nhau, tùy theo trách nhiệm và nghĩa vụ của mình". Nếu sinh viên chọn Phương án A, tức là tự từ bỏ quyền làm chủ của mình, đồng thời làm mất đi sức mạnh trí tuệ của cá nhân đối với sự phát triển chung của tập thể.'
  }
];

export const SCENARIOS = DEFAULT_SCENARIOS;
