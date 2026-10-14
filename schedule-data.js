/* ==========================================================================
   SHENDY LIFE CALENDAR — schedule-data.js
   --------------------------------------------------------------------------
   هذا هو ملف البيانات الوحيد الذي تحتاج تعديله يدويًا.
   المصدر: README_SCHEDULE.txt و WEEKLY_SCHEDULE.txt
   ملاحظة: كل الأوقات أدناه هي "توزيع مقترح داخل التطبيق" لترتيب الواجهة،
   وليست بيانات مؤكدة من المصدر. المصدر يحدد المدد والمحاور فقط.
   ========================================================================== */
(function (global) {
  "use strict";

  var PILLARS = {
    faith:   { id: "faith",   label: "الله",     icon: "moon",   desc: "صلاة، دعاء، ذكر، وحي" },
    health:  { id: "health",  label: "الصحة",    icon: "pulse",  desc: "نوم، تغذية، ماء، نظافة، حركة" },
    admin:   { id: "admin",   label: "الإدارة",  icon: "list",   desc: "تخطيط، متابعة، مراجعة أسبوعية" },
    science: { id: "science", label: "العلم",    icon: "book",   desc: "BUSINESS / TECHNOLOGY / SCIENCE" },
    work:    { id: "work",    label: "العمل",    icon: "case",   desc: "Shendy+ و Explore يوميًا" },
    college: { id: "college", label: "الكلية",   icon: "cap",    desc: "المواد الست" },
    project: { id: "project", label: "المشاريع", icon: "layers", desc: "مشروع نشط واحد فقط" },
    margin:  { id: "margin",  label: "مساحة",    icon: "dots",   desc: "فاصل انتقالي أو مساحة غير مجدولة" }
  };

  var DAYS = [
    { id: "sun", name: "الأحد",    focused: true,  college: "جبر مجرد" },
    { id: "mon", name: "الاثنين",  focused: true,  college: "تفاضل عالي" },
    { id: "tue", name: "الثلاثاء", focused: true,  college: "مقدمة إحصاء" },
    { id: "wed", name: "الأربعاء", focused: true,  college: "تنظيم حاسب + English",
      collegeParts: [
        { title: "تنظيم حاسب", minutes: 75 },
        { title: "English",    minutes: 45 }
      ] },
    { id: "thu", name: "الخميس",   focused: true,  college: "معادلات تفاضلية" },
    { id: "fri", name: "الجمعة",   focused: false },
    { id: "sat", name: "السبت",    focused: false }
  ];

  var CYCLES = {
    A: {
      key: "A",
      label: "الدورة أ",
      summary: "الأحد BUSINESS · الاثنين TECHNOLOGY · الثلاثاء SCIENCE · الأربعاء BUSINESS · الخميس TECHNOLOGY",
      tracks: { sun: "BUSINESS", mon: "TECHNOLOGY", tue: "SCIENCE", wed: "BUSINESS", thu: "TECHNOLOGY" },
      business: { sun: "Sooq (سوق)", wed: "V2 Labs" }
    },
    B: {
      key: "B",
      label: "الدورة ب",
      summary: "الأحد SCIENCE · الاثنين BUSINESS · الثلاثاء TECHNOLOGY · الأربعاء SCIENCE · الخميس BUSINESS",
      tracks: { sun: "SCIENCE", mon: "BUSINESS", tue: "TECHNOLOGY", wed: "SCIENCE", thu: "BUSINESS" },
      business: { mon: "Money", thu: "Legal" }
    },
    C: {
      key: "C",
      label: "الدورة ج",
      summary: "الأحد TECHNOLOGY · الاثنين SCIENCE · الثلاثاء BUSINESS · الأربعاء TECHNOLOGY · الخميس SCIENCE",
      tracks: { sun: "TECHNOLOGY", mon: "SCIENCE", tue: "BUSINESS", wed: "TECHNOLOGY", thu: "SCIENCE" },
      business: { tue: "People" }
    }
  };

  var BUSINESS_FUNCTIONS = [
    { name: "Sooq (سوق)", desc: "تسويق، تصميم جرافيك، مونتاج، أنيميشن وموشن جرافيك، مبيعات، سوشيال ميديا، هوية بصرية." },
    { name: "V2 Labs", desc: "ريادة أعمال، تطوير أعمال، بحث وتطوير، قيادة وتطوير، علوم ومنتجات، ابتكار، علاقات عامة." },
    { name: "Money", desc: "تمويل، محاسبة، استثمار، تحليل مالي وتخطيط مالي." },
    { name: "Legal", desc: "تأسيس الشركات وهيكلتها، العقود، الضرائب، والمسائل التجارية والقانونية ذات الصلة." },
    { name: "People", desc: "موارد بشرية، خدمة العملاء، تجربة العملاء." },
    { name: "Operations & Production", desc: "العمليات، الإنتاج، سلاسل التوريد، تنسيق التسليم، الجودة." },
    { name: "Data", desc: "BA و BI واستشارات و DI و DS و DE. يبقى DI كما ورد دون تخمين معناه." }
  ];

  var FOCUSED_TEMPLATE = [
    { pillar: "faith",   start: "05:00", end: "05:45", min: 45,  title: "الفجر + أذكار الصباح" },
    { pillar: "faith",   start: "05:45", end: "06:30", min: 45,  title: "الوحي + دعاء + ذكر" },
    { pillar: "health",  start: "06:30", end: "07:00", min: 30,  title: "نظافة + فطور" },
    { pillar: "admin",   start: "07:00", end: "07:15", min: 15,  title: "تخطيط اليوم وترتيب المهام" },
    { pillar: "margin",  start: "07:15", end: "07:30", min: 15,  title: "فاصل انتقالي" },
    { pillar: "college", start: "07:30", end: "09:30", min: 120, title: "الكلية", meta: "حسب الجدول الرسمي — الحضور الرسمي يتقدّم على هذا القالب" },
    { pillar: "margin",  start: "09:30", end: "09:45", min: 15,  title: "فاصل انتقالي" },
    { pillar: "science", start: "09:45", end: "12:45", min: 180, title: "العلم", meta: "جلسة واحدة، مسار واحد فقط" },
    { pillar: "faith",   start: "12:45", end: "13:15", min: 30,  title: "الظهر + دعاء" },
    { pillar: "health",  start: "13:15", end: "13:55", min: 40,  title: "غداء + راحة" },
    { pillar: "health",  start: "13:55", end: "15:10", min: 75,  title: "قيلولة (ضمن ساعات النوم)" },
    { pillar: "project", start: "15:10", end: "17:10", min: 120, title: "المشروع النشط", meta: "عمل عميق — 2 ساعات هي الافتراضي العملي" },
    { pillar: "faith",   start: "17:10", end: "17:40", min: 30,  title: "العصر + ذكر" },
    { pillar: "work",    start: "17:40", end: "19:10", min: 90,  title: "Shendy+", meta: "العمل اليومي" },
    { pillar: "faith",   start: "19:10", end: "19:25", min: 15,  title: "المغرب + دعاء" },
    { pillar: "work",    start: "19:25", end: "20:55", min: 90,  title: "Explore", meta: "العمل اليومي" },
    { pillar: "health",  start: "20:55", end: "21:15", min: 20,  title: "عشاء + راحة" },
    { pillar: "faith",   start: "21:15", end: "21:30", min: 15,  title: "العشاء + ورد" },
    { pillar: "admin",   start: "21:30", end: "21:45", min: 15,  title: "مراجعة اليوم وتسجيل السجل" },
    { pillar: "margin",  start: "21:45", end: "22:15", min: 30,  title: "مساحة مرنة" },
    { pillar: "health",  start: "22:15", end: "05:00", min: 405, title: "النوم الليلي", meta: "6 س 45 د" }
  ];

  var LIGHT_TEMPLATE = [
    { pillar: "faith",   start: "05:00", end: "05:45", min: 45,  title: "الفجر + أذكار الصباح" },
    { pillar: "faith",   start: "05:45", end: "06:30", min: 45,  title: "الوحي + دعاء + ذكر" },
    { pillar: "health",  start: "06:30", end: "07:00", min: 30,  title: "نظافة + فطور" },
    { pillar: "admin",   start: "07:00", end: "07:15", min: 15,  title: "تخطيط اليوم وترتيب المهام" },
    { pillar: "margin",  start: "07:15", end: "07:30", min: 15,  title: "فاصل انتقالي" },
    { pillar: "work",    start: "07:30", end: "09:00", min: 90,  title: "Shendy+", meta: "العمل اليومي" },
    { pillar: "margin",  start: "09:00", end: "09:15", min: 15,  title: "فاصل انتقالي" },
    { pillar: "work",    start: "09:15", end: "10:45", min: 90,  title: "Explore", meta: "العمل اليومي" },
    { pillar: "margin",  start: "10:45", end: "12:15", min: 90,  title: "مساحة غير مجدولة", meta: "لا تُملأ بأنشطة غير منصوص عليها في المصدر" },
    { pillar: "faith",   start: "12:15", end: "12:45", min: 30,  title: "الظهر + دعاء" },
    { pillar: "health",  start: "12:45", end: "13:25", min: 40,  title: "غداء + راحة" },
    { pillar: "health",  start: "13:25", end: "14:40", min: 75,  title: "قيلولة (ضمن ساعات النوم)" },
    { pillar: "margin",  start: "14:40", end: "17:10", min: 150, title: "مساحة غير مجدولة" },
    { pillar: "faith",   start: "17:10", end: "17:40", min: 30,  title: "العصر + ذكر" },
    { pillar: "margin",  start: "17:40", end: "19:10", min: 90,  title: "مساحة غير مجدولة" },
    { pillar: "faith",   start: "19:10", end: "19:25", min: 15,  title: "المغرب + دعاء" },
    { pillar: "margin",  start: "19:25", end: "20:55", min: 90,  title: "مساحة غير مجدولة" },
    { pillar: "health",  start: "20:55", end: "21:15", min: 20,  title: "عشاء + راحة" },
    { pillar: "faith",   start: "21:15", end: "21:30", min: 15,  title: "العشاء + ورد" },
    { pillar: "admin",   start: "21:30", end: "21:45", min: 15,  title: "مراجعة اليوم" },
    { pillar: "margin",  start: "21:45", end: "22:15", min: 30,  title: "مساحة غير مجدولة" },
    { pillar: "health",  start: "22:15", end: "05:00", min: 405, title: "النوم الليلي", meta: "6 س 45 د" }
  ];

  global.SHENDY_DATA = {
    app: {
      name: "SHENDY LIFE CALENDAR",
      tagline: "تقويم أسبوعي ثابت يتكرر كل أسبوع",
      version: "1.0.0",
      timeNotice: "الأوقات المعروضة هي توزيع مقترح داخل التطبيق لترتيب الواجهة فقط، وليست بيانات مؤكدة من ملفي المصدر. المصدر يحدد المدد والمحاور، وأوقات الصلاة والكلية والحضور الرسمي تتقدّم على أي قالب زمني جامد."
    },

    activeProject: {
      name: "المشروع النشط",
      note: "الاسم غير محدد في ملفات المصدر. عدّله يدويًا في schedule-data.js."
    },

    pillars: PILLARS,
    days: DAYS,
    cycles: CYCLES,
    businessFunctions: BUSINESS_FUNCTIONS,
    businessNote: "وظائف البزنس السبع تُستخدم واحدة لكل جلسة بزنس، بترتيب متسلسل مستمر: Sooq ثم V2 Labs ثم Money ثم Legal ثم People ثم Operations & Production ثم Data ثم تعود إلى Sooq. الترتيب لا يُعاد من البداية عند تغيّر دورة العلم الثلاثية.",

    dailyBase: [
      { pillar: "faith",  text: "3 ساعات يوميًا موزّعة حول أوقات الصلاة الفعلية: صلاة، دعاء، ذكر، وحي. ليست كتلة واحدة متصلة." },
      { pillar: "health", text: "الصحة + الإدارة: 10 ساعات يوميًا مجمّعة، تشمل النوم (افتراض عملي: 8 ساعات نوم + نحو ساعتين للروتين اليومي والإدارة)." },
      { pillar: "work",   text: "3 ساعات يوميًا: Shendy+ 90 دقيقة + Explore 90 دقيقة. يبقيان في جميع الأيام بما فيها الجمعة والسبت." }
    ],

    templates: { focused: FOCUSED_TEMPLATE, light: LIGHT_TEMPLATE },

    assumptions: [
      "الأوقات وترتيب الجلسات داخل اليوم: توزيع مقترح داخل التطبيق، وليست أوقاتًا مؤكدة في المصدر.",
      "مدة الكلية: ساعتان يوميًا في خمسة أيام — افتراض تشغيلي مؤقت ورد في الملف المرجعي صراحةً، وليس مدة مؤكدة من المستخدم.",
      "مشروع اليوم المركّز: ساعتان عمل عميق افتراضيًا (لا ثلاث)، مع ترك نحو ساعة هامش يومي، كما ورد في قاعدة الواقعية.",
      "دمج English مع تنظيم حاسب يوم الأربعاء (75 دقيقة + 45 دقيقة): خيار مؤقت من الملف المرجعي لأنه لم يُحدَّد خيار دمج آخر.",
      "تقسيم النوم: 6 س 45 د ليلًا + 1 س 15 د قيلولة = 8 ساعات، ليكون النوم داخل تخصيص 10 ساعات للصحة والإدارة.",
      "المشروع النشط غير مسمّى في المصدر، لذا يُعرض باسم عام حتى تحدده يدويًا."
    ],

    conflicts: [
      "الجدول الصارم (الله 3 + الصحة/الإدارة 10 + العلم 3 + العمل 3 + الكلية 2 + المشاريع 3 = 24 ساعة) لا يترك أي هامش انتقالي. القالب المعروض يستخدم ساعتين للمشروع بدل ثلاث ليحتفظ بنحو ساعة هامش، وهذه هي التوصية الواردة في ملف المصدر نفسه.",
      "الجمعة والسبت خاليتان من العلم والكلية والمشاريع المجدولة، لكنهما ليستا خاليتين تمامًا: أسس الله والصحة/الإدارة والعمل اليومية تبقى فيهما لأن العمل منصوص عليه يوميًا."
    ]
  };
})(typeof window !== "undefined" ? window : this);
