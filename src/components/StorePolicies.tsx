import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Camera, 
  Headphones, 
  CheckCircle2, 
  Workflow, 
  Clock, 
  CheckSquare
} from 'lucide-react';

export const StorePolicies: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* Intro */}
      <div className="bg-[#FAF6EF] border border-[#E8E1D7] rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D5B4C] mb-2">
            <span>دليل التشغيل وإدارة الطلبيات</span>
            <span aria-hidden="true">·</span>
            <span>متجر حجاب مكة بالمملكة المغربية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B231D] tracking-tight mb-3">
            المعايير التشغيلية والسياسات المعتمدة لنظام واتساب
          </h2>
          <p className="text-[#6D635B] text-sm sm:text-base leading-relaxed">
            توثيق تفصيلي لكل قاعدة من القواعد العشر المحددة لنظام الشراء، مع توضيح مهام الإدارة والموردين وطرق الدفع والتوصيل.
          </p>
        </div>
      </div>

      {/* 10 Steps Grid */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Workflow className="w-5 h-5 text-[#8D5B4C]" />
          <h3 className="text-lg font-bold text-[#2B231D]">
            مسار الشراء المعتمد عبر واتساب (الخطوات الـ 10 بالتفصيل)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#524942]">
          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">1. ظهور تصنيفات المنتجات أولاً</span>
            <p>تبدأ المحادثة فوراً برسالة ترحيبية مهذبة تعرض تصنيف «الأطقم والأنصومبل» وتصنيف «العبايات» بالصور التمثيلية المربعة المعتمدة دون زحام نصوص.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">2. عرض منتجات التصنيف في كاروسيل</span>
            <p>عند اختيار تصنيف، يُرسل البوت كاروسيل تفاعلي يعرض الموديلات المتوفرة، صورتها، اسمها وسعرها بالدرهم المغربي مع إمكانية التمرير بسلاسة.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">3. زر «اختاري هذا الموديل» لعرض الألوان</span>
            <p>كل موديل في الكاروسيل مزود بزر واضح: «اختاري هذا الموديل». الضغط عليه يفتح فوراً خيارات الألوان المعتمدة لنفس القطعة.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">4. اختيار اللون ثم المقاس والكمية</span>
            <p>تحدد العميلة اللون، ثم يظهر المقاس (M, L, XL, XXL أو القياسات بالأرقام للعبايات كالطول 54 أو 56)، ثم تحديد عدد القطع المطلوبة.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">5. إمكانية الرجوع واختيار موديل آخر</span>
            <p>يمكن للعميلة في أي لحظة العودة للكاروسيل السابق واختيار موديل مختلف، ليعاد ضبط واختيار اللون والمقاس تلقائياً دون تداخل بيانات.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">6. كتابة «التصنيفات» للعودة للأقسام</span>
            <p>كتابة كلمة «التصنيفات» أو النقر على الزر المخصص يعيد ضبط مسار المحادثة ويعود بالعميلة إلى نقطة البداية لعرض الأقسام مجدداً.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">7. إدخال معلومات التوصيل</span>
            <p>تطلب المحادثة إدخال الاسم، المدينة، العنوان الدقيق، ورقم الهاتف المغربي للتواصل مع مندوب التوصيل ومطابقة مسار الشحنة.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">8. مراجعة ملخص الطلب والتأكيد أو التعديل</span>
            <p>يظهر ملخص واضح وشامل بكل التفاصيل والمجموع، مع ثلاثة أزرار محددة وحاسمة: «تأكيد الطلب»، «تعديل الطلب»، و«إلغاء الطلب».</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">9. مراجعة الإدارة للطلب قبل إرساله للمورد</span>
            <p className="font-semibold text-[#8D5B4C]">تأكيد العميلة لا يعني الإرسال الآلي المباشر للمورد! الإدارة تراجع الطلب يدوياً، تتأكد من الجودة والمخزون، وتوافق عليه قبل التفويض.</p>
          </div>

          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E8E1D7] space-y-1">
            <span className="font-bold text-[#8D5B4C] block text-sm">10. التوصيل المجاني وشروط الدفع والتحقق</span>
            <p>التوصيل مجاني لجميع مدن المغرب، والدفع الافتراضي نقداً عند الاستلام (COD). في حال اختيار التحويل البنكي، يخضع إثبات الدفع للتدقيق المالي.</p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Photography */}
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] text-[#8D5B4C] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#2B231D] text-base">
            ضوابط صور التصنيفات والألوان
          </h4>
          <ul className="text-xs text-[#524942] space-y-2 list-disc pr-4 marker:text-[#8D5B4C]">
            <li>الصور مربعة 1:1 بخلفية عاجية دافئة موحدة وإضاءة طبيعية.</li>
            <li>ملابس محتشمة وأنيقة مع حجاب متطابق.</li>
            <li>خالية تماماً من الأثمان والشعارات والنصوص.</li>
            <li>صور الألوان لا تُولّد افتراضياً؛ بل تُؤخذ حصراً من تصوير المورد الواقعي المعتمد.</li>
          </ul>
        </div>

        {/* Pillar 2: Audio */}
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] text-[#8D5B4C] flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#2B231D] text-base">
            ضوابط الصوت الإرشادي بالدارجة
          </h4>
          <ul className="text-xs text-[#524942] space-y-2 list-disc pr-4 marker:text-[#8D5B4C]">
            <li>صوت امرأة مغربية واحدة، واضح وطبيعي ودافئ.</li>
            <li>سرعة معتدلة دون مبالغة أو ضغط على العميلة.</li>
            <li>دون موسيقى أو مؤثرات صوتية خلفية.</li>
            <li>لا تُقرأ أسماء الملفات أو التعليمات.</li>
            <li>لا وعود قاطعة بخصوص مدد التوصيل أو الاسترجاع.</li>
          </ul>
        </div>

        {/* Pillar 3: Logistics */}
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] text-[#8D5B4C] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#2B231D] text-base">
            الضمان والموافقة الإدارية
          </h4>
          <ul className="text-xs text-[#524942] space-y-2 list-disc pr-4 marker:text-[#8D5B4C]">
            <li>فلترة الطلبيات من الإدارة قبل إحالتها للمصنع أو المورد.</li>
            <li>توصيل مجاني في كافة أنحاء المغرب (0 درهم).</li>
            <li>الدفع عند الاستلام مع فحص الطرد.</li>
            <li>التحقق الصارم من وصولات التحويل البنكي قبل الشحن.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
