# SHENDY LIFE CALENDAR

تقويم أسبوعي شخصي **ثابت** يتكرر كل أسبوع. تطبيق ويب بسيط بملفات ثابتة (HTML + CSS + JavaScript)،
بدون Backend وبدون قاعدة بيانات وبدون تسجيل دخول وبدون تتبّع، وبألوان محايدة فقط: أبيض وأسود ورمادي.

التطبيق **لا يعتمد على تاريخ حيّ**: الأسبوع قالب ثابت (الأحد ← السبت)، وليس تقويمًا بتواريخ متغيّرة.

---

## 1) المتطلبات

- **للتشغيل المحلي:** Node.js 16 أو أحدث (فقط لتشغيل setup.js)، ومتصفح حديث.
- **للنشر:** حساب GitHub (اختياري).
- لا يحتاج المشروع إلى npm install ولا إلى أي مكتبة خارجية.

---

## 2) التشغيل محليًا

بعد تشغيل `node setup.js` والانتقال إلى مجلد المشروع:

```bash
cd SHENDY-LIFE-CALENDAR
```

شغّل خادمًا محليًا بسيطًا (أي واحد من هذه):

```bash
# باستخدام Node
npx serve .

# أو باستخدام Python
python -m http.server 8080
```

ثم افتح المتصفح على العنوان الذي يظهر لك (مثال: http://localhost:8080).

> **مهم:** لا تفتح index.html مباشرة عبر file:// إن أردت تجربة Service Worker والعمل دون إنترنت،
> لأن المتصفحات تمنع تسجيل Service Worker على بروتوكول file://.

---

## 3) التثبيت كتطبيق (PWA)

1. افتح الموقع من خادم محلي أو من GitHub Pages (يجب أن يكون https أو localhost).
2. في Chrome / Edge على الحاسوب: أيقونة التثبيت في شريط العنوان، أو زر **تثبيت التطبيق** في رأس الصفحة.
3. على أندرويد: قائمة المتصفح ← **إضافة إلى الشاشة الرئيسية**.
4. على iOS / Safari: زر المشاركة ← **إضافة إلى الشاشة الرئيسية**.

بعد أول زيارة ناجحة يُخزَّن الموقع في الكاش، ويعمل لاحقًا دون إنترنت للصفحة والأنماط والسكربتات.
خط Tajawal يُطلب من Google Fonts؛ عند انقطاع الإنترنت يسقط المتصفح تلقائيًا إلى خط النظام الاحتياطي.

---

## 4) الرفع إلى GitHub Pages

**تلقائيًا:** إذا كانت أدوات git و gh مثبّتة ومسجّل الدخول إليها، يقوم setup.js بمحاولة
إنشاء المستودع ورفع الملفات وتمكين Pages. راجع مخرجات السكربت لمعرفة ما تم فعليًا.

**يدويًا:**

```bash
git init
git add -A
git commit -m "SHENDY LIFE CALENDAR"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

ثم في GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

ملف .github/workflows/deploy.yml جاهز وينشر الموقع تلقائيًا عند كل push إلى main.

> ملاحظة: نشر GitHub Pages من مستودع **خاص** يتطلب خطة مدفوعة (Pro / Team / Enterprise).
> على الخطة المجانية، اجعل المستودع عامًا أو استخدم استضافة ثابتة أخرى.
> تذكّر أن المحتوى المنشور عبر Pages قد يكون متاحًا للعامة حتى لو كان المستودع خاصًا.

---

## 5) بنية الملفات

```
SHENDY-LIFE-CALENDAR/
  index.html                 هيكل الصفحة (RTL)
  styles.css                 التصميم — أبيض/أسود/رمادي فقط
  app.js                     منطق العرض (Vanilla JS)
  schedule-data.js           ★ بيانات الجدول الثابتة — هنا تُعدّل يدويًا
  manifest.webmanifest       بيانات تطبيق الويب التقدمي
  sw.js                      Service Worker للعمل دون إنترنت
  assets/
    icon.svg                 أيقونة متجهة
    icon-192.png             أيقونة PNG 192
    icon-512.png             أيقونة PNG 512
    icon-maskable-512.png    أيقونة maskable
  .nojekyll                  تعطيل معالجة Jekyll على GitHub Pages
  README.md                  هذا الملف
  DOCUMENTATION.md           التوثيق التفصيلي وقرارات التصميم
  .github/workflows/deploy.yml   نشر تلقائي إلى GitHub Pages
```

---

## 6) كيف أعدّل الجدول؟

افتح schedule-data.js وعدّل القيم، ثم أعد رفع الموقع. لا يوجد واجهة CRUD عن قصد —
التطبيق قالب ثابت، والتعديل يدوي في الكود. راجع DOCUMENTATION.md لمعرفة مواضع التعديل بالضبط.
