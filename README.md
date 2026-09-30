# منظومة مواقف جامعة فهد بن سلطان الذكية (FBSU Smart Parking)
### UI/UX Master Design System, Live Interactive Application & Executive Presentation Deck

مشروع متكامل لإدارة وحجز ومشاركة مواقف الحرم الجامعي بالذكاء الاصطناعي وكاميرات التعرف التلقائي على اللوحات (ALPR) بجامعة فهد بن سلطان (تبوك - المملكة العربية السعودية).

---

## 📁 هيكلية واستراكشر المشروع (Project Directory Architecture)

تم تنظيم المشروع بهيكلية هندسية نظيفة واحترافية تفصل كود التطبيق، الأصول والميديا، السكربتات البرمجية، وصفحات الويب المستقلة:

```text
d:\Rakan\
├── index.html                   # 🎨 لوحة تصميم فيجما المتكاملة وتوثيق الـ Design System (15 قسماً و 30 إطاراً)
├── app.html                     # 🚗 التطبيق الحي التفاعلي لمنظومة المواقف مع المحاكي المباشر والحجز
├── presentation.html            # 📊 العرض التقديمي التنفيذي (16:9 Presentation Pitch Deck)
├── vite.config.js               # إعدادات Vite للبناء المتعدد (Multi-Page App) وإعادة التوجيه التلقائي
├── package.json                 # حزم المشروع وأوامر التشغيل والبناء (npm run dev / build)
├── package-lock.json            # قفل إصدارات الحزم
├── README.md                    # دليل هيكلية واستخدام المشروع
├── .gitignore                   # ملف استثناءات Git
│
├── src/                         # 💻 كود التطبيق المصدري (Source Code)
│   ├── css/                     # التنسيقات وتصميم واجهات المستخدم
│   │   └── style.css            # متغيرات الثيمات (ليلي/نهاري)، التجاوب الكامل، وتأثيرات Glassmorphism
│   └── js/                      # وحدات ووظائف الجافاسكريبت
│       ├── main.js              # المنطق التشغيلي، محاكي التبادل الذكي، بوابة ALPR، ونظام الحجز والمحفظة
│       └── icons.js             # مصفوفة أيقونات SVG التفاعلية ودوال الإنشاء
│
├── public/                      # 🌐 الأصول والملفات الثابتة (Static Assets)
│   ├── favicon.svg              # أيقونة المتصفح
│   └── assets/                  # مجلد الأصول المنظمة والمصنفة
│       ├── branding/            # الهوية البصرية وشعارات الجامعة
│       │   ├── fbsu-logo.png    # الشعار الرسمي لجامعة فهد بن سلطان
│       │   └── fbsu-campus.jpg  # صورة الحرم الجامعي للخلفيات
│       ├── slides/              # لقطات شاشات العرض التقديمي عالي الدقة (01 إلى 10)
│       │   ├── 01_hero_header.png
│       │   ├── 02_parking_grid.png
│       │   ├── 03_simulator.png
│       │   ├── 04_alpr_gate.png
│       │   ├── 05_booking_receipt.png
│       │   ├── 06_wallet_modal.png
│       │   ├── 07_analytics.png
│       │   ├── 08_figma_hero.png
│       │   ├── 09_figma_tokens.png
│       │   └── 10_figma_devices.png
│       └── docs/                # المستندات والعروض الرسمية القابلة للتحميل
│           └── FBSU_Smart_Parking_UIUX_Presentation.pptx # ملف الباوربوينت الرسمي
│
└── scripts/                     # ⚙️ سكربتات البناء وتوليد الأكواد (Python Automation)
    ├── build/                   # سكربتات التجميع النشطة (Modular Architecture)
    │   ├── master_assembler.py  # المجمّع الرئيسي لبناء صفحة index.html
    │   ├── parts_01_to_04.py    # أقسام الهوية ورموز التصميم والترويسة
    │   ├── parts_05_to_08.py    # أقسام شبكة المواقف والمحاكي والبوابة
    │   ├── parts_09_to_12.py    # أقسام لوحة التحليلات والتذاكر والتذييل
    │   └── parts_13_to_15.py    # أقسام التجاوب ومواصفات الأجهزة
    └── legacy/                  # أرشيف السكربتات التجريبية السابقة (للتوثيق والمرجعية)
        ├── build_full_showcase.py
        ├── generate_all.py
        ├── generate_complete_masterpiece.py
        ├── generate_full_system.py
        ├── generate_master_showcase.py
        └── generate_sections.py
```

---

## 🚀 تشغيل وتطوير المشروع (Getting Started)

### 1. تشغيل خادم التطوير المحلي
```bash
npm run dev
```
- صفحة توثيق فيجما والتصميم: `http://localhost:5173/`
- صفحة التطبيق التفاعلي المباشر: `http://localhost:5173/app.html`
- صفحة العرض التقديمي التنفيذي: `http://localhost:5173/presentation.html`

### 2. إعادة توليد صفحة فيجما عبر المجمّع
```bash
npm run build:showcase
# أو
python scripts/build/master_assembler.py
```

### 3. بناء النسخة الإنتاجية (Production Build)
```bash
npm run build
```
سيتم إنشاء الحزم النهائية النظيفة داخل مجلد `dist/` جاهزة للرفع إلى أي خادم أو استضافة (Vercel, Netlify, Cloudflare).
