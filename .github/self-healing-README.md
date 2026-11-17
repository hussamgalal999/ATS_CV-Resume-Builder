# طيّار الشفاء الذاتي — CVPen demo
**الريبو المستهدف:** `hussamgalal999/ATS_CV-Resume-Builder` (بشرطات سفلية — ريبو الديمو الحي)
**الموقع المراقَب:** https://cv0-builder.netlify.app/
**الحالة:** ملفات جاهزة للمراجعة — **لم تُرفع ولم تُدمج في أي ريبو**، ولا يوجد أي نشر تلقائي

## الملفات

| الملف | مكانه في الريبو بعد التثبيت | وظيفته |
|---|---|---|
| `self-healing.yml` | `.github/workflows/self-healing.yml` | workflow الفحص والإصلاح المحدود |
| `check-live.js` | `.github/scripts/check-live.js` | سكربت فحص الموقع الحي (Node بلا اعتماديات) |
| `README.md` (هذا الملف) | `.github/self-healing-README.md` | التوثيق |

## ماذا يفعل الطيار

1. **كل 30 دقيقة + عند كل push على main:** يفحص الموقع الحي (هل يرد؟ هل فيه نص `ATS` المتوقع؟ هل بطيء؟) ويشغّل `yarn install --frozen-lockfile` ثم `yarn build`.
2. **عند أي فشل:** يفتح Issue بعنوان `[self-healing] <الفئة>` فيه التشخيص كاملاً (كود HTTP، زمن الاستجابة، سجل البناء) — وإذا كان فيه Issue مفتوح لنفس الفئة، يضيف تعليقاً بدلاً من فتح واحد جديد.
3. **الإصلاح التلقائي — فئة واحدة فقط:** عدم تطابق `yarn.lock` مع `package.json` (`LOCKFILE_DRIFT`) → يعيد توليد `yarn.lock` على فرع `self-healing/fix-lockfile-<تاريخ>` ويفتح Pull Request. **الـ PR لا يُدمج تلقائياً أبداً.**
4. **البلاغ (اختياري):** رسالة تيليجرام للمالك عند الفشل — تعمل فقط إذا وُضعت الأسرار (انظر أدناه).

## ماذا لا يفعل أبداً

- لا يدمج أي PR. لا ينشر أي شيء (لا Netlify ولا غيره). لا يلمس أسراراً أو مدفوعات أو بيانات مستخدمين. لا يعدّل أي ريبو آخر.
- الفئات `DOWN` و `ERROR_5XX` و `CONTENT` و `BUILD_FAIL` و `SLOW` و `DEPENDENCY` → Issue فقط، بدون أي محاولة إصلاح آلي.

## مفتاح الإيقاف (Kill-switch)

- أنشئ ملفاً فارغاً باسم `.self-healing-paused` في جذر الريبو → تتوقف كل خطوات الإصلاح التلقائي فوراً (الفحص والبلاغ يستمرّان).
- لاستئناف الإصلاح: احذف الملف (يدوياً أو بموافقة المالك).

## خطوات التثبيت (بعد مراجعة المالك)

```bash
# 1. من جذر الريبو (بعد سحب آخر main)
mkdir -p .github/workflows .github/scripts
cp self-healing.yml .github/workflows/self-healing.yml
cp check-live.js .github/scripts/check-live.js
cp README.md .github/self-healing-README.md

# 2. جرّب السكربت محلياً أولاً
node .github/scripts/check-live.js --url https://cv0-builder.netlify.app/ --marker ATS --out /tmp/diag.json
echo "exit code: $? (0 = سليم)"

# 3. ادفع على فرع ثم PR — لا تدفع مباشرة على main بدون مراجعة
git checkout -b add/self-healing-pilot
git add .github/workflows/self-healing.yml .github/scripts/check-live.js .github/self-healing-README.md
git commit -m "ci: add self-healing pilot (probe + build + issue, no auto-deploy)"
git push origin add/self-healing-pilot
# ثم افتح PR وراجعه، وبعد الدمج راقب أول تشغيل مجدول في تبويب Actions
```

## اختبار آمن قبل التفعيل

- شغّل الـ workflow يدوياً من تبويب Actions → `workflow_dispatch` — يجب أن ينجح الفحص وأن يظهر `class=OK` في السجل.
- جرّب مفتاح الإيقاف: أنشئ `.self-healing-paused` في فرع تجريبي وتأكد أن خطوة الإصلاح تُتخطى.

## قرارات المالك المطلوبة

1. **تثبيت الطيار؟** موافقة على وضع الملفات في الريبو (فرع + PR، ثم دمج).
2. **علامة المحتوى `LIVE_MARKER`:** حالياً `ATS` — هل يثبّتها المالك أم يغيّرها لنص أثبت في الصفحة؟
3. **بلاغات تيليجرام:** هل يضع المالك سرّي `TELEGRAM_BOT_TOKEN` و `TELEGRAM_OWNER_CHAT_ID` في أسرار الريبو (Settings → Secrets and variables → Actions)؟ بدونها يعمل الطيار كاملاً ما عدا البلاغ.
4. **النشر التلقائي:** في الطيار معطّل نهائياً. هل يبقى معطلاً حتى بعد نجاح الطيار، أم يُسمح لاحقاً بقائمة سماح؟
5. **UptimeRobot:** هل يفعّل المالك حساباً مجانياً (فحص كل 5 دقائق) كمراقبة خارجية احتياطية؟
6. **أي تطبيقات تالية؟** بعد نجاح طيار CVPen، أي تطبيق يُضاف للمراقبة (موقع QudSystem أولاً؟).
