import React, { useState } from 'react';
import { Download, Maximize2, X, Check, AlertCircle, Sparkles, Shirt, Layers } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/storeData';
import { Category } from '../types';

interface CategoryShowcaseProps {
  onSelectCategoryForChat: (categoryId: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategoryForChat }) => {
  const [selectedImageModal, setSelectedImageModal] = useState<Category | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownload = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10">
      
      {/* Intro Header */}
      <div className="bg-[#FAF6EF] border border-[#E8E1D7] rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D5B4C] mb-2">
            <span>المحور الأول: الهوية البصرية للتصنيفات</span>
            <span aria-hidden="true">·</span>
            <span>متجر حجاب مكة المغربي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B231D] tracking-tight mb-3">
            صور التصنيفات المعتمدة لنظام واتساب
          </h2>
          <p className="text-[#6D635B] text-base leading-relaxed">
            تم تجهيز صور مربعة احترافية بنمط تصوير أزياء واقعي، ملابس محتشمة، خلفية عاجية دافئة موحدة، وإضاءة طبيعية متجانسة. الصور خالية تماماً من النصوص أو الأثمان أو الشعارات وفق التوجيهات.
          </p>
        </div>

        {/* Policy Notice Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#E8E1D7]">
          <div className="flex items-start gap-3 bg-white/70 p-4 rounded-xl border border-[#E8E1D7]">
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-[#524942] leading-relaxed">
              <strong className="block font-semibold text-[#2B231D] mb-0.5">
                صور توضيحية تمثيلية للأقسام
              </strong>
              هذه الصور مخصصة لإبراز طبيعة التصنيف العام (الأنصومبل أو العبايات) في الرسالة الافتتاحية للمحادثة، وليست صوراً لمنتجات محددة متوفرة للبيع.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/70 p-4 rounded-xl border border-[#E8E1D7]">
            <AlertCircle className="w-5 h-5 text-[#8D5B4C] shrink-0 mt-0.5" />
            <div className="text-xs text-[#524942] leading-relaxed">
              <strong className="block font-semibold text-[#2B231D] mb-0.5">
                تنبيه بخصوص ألوان المنتجات
              </strong>
              نلتزم بعدم توليد صور بديلة لألوان المنتجات بالذكاء الاصطناعي؛ صور ألوان كل موديل تأتي مباشرة من صور المورد الحقيقية المعتمدة لضمان تطابق الألوان 100%.
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 2 Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {CATEGORIES_DATA.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#E8E1D7] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* Visual Container (lead with imagery) */}
            <div className="relative aspect-square bg-[#FAF6EF] overflow-hidden group">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Category indicator badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E8E1D7] text-xs font-semibold text-[#2B231D] shadow-sm">
                تصنيف {idx + 1 === 1 ? 'الأطقم' : 'العبايات'} · مربعة 1:1
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedImageModal(cat)}
                  className="bg-white/90 hover:bg-white text-[#2B231D] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>معاينة مكبرة</span>
                </button>
                <button
                  onClick={() => handleDownload(cat.image, `${cat.id}_category_hijab_makkah.jpg`)}
                  className="bg-[#8D5B4C] hover:bg-[#784A3D] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الصورة الأصلية</span>
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-[#2B231D]">{cat.nameAr}</h3>
                  <span className="text-xs text-[#8D5B4C] font-semibold bg-[#FAF6EF] px-2.5 py-1 rounded-md border border-[#E8E1D7]">
                    {cat.productCount} موديل مسجل
                  </span>
                </div>
                <p className="text-sm text-[#6D635B] leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Specs breakdown */}
                <div className="space-y-2 py-3 border-t border-b border-[#F0EAE1] text-xs text-[#524942]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D5B4C] font-medium flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5" />
                      القصة والتفصيل:
                    </span>
                    <span className="font-semibold text-left">{cat.specs.cut}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D5B4C] font-medium flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      مكونات الموديل:
                    </span>
                    <span className="font-semibold text-left">{cat.specs.pieces}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D5B4C] font-medium">الخامات الموصى بها:</span>
                    <span className="font-semibold text-left">{cat.specs.recommendedFabric}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D5B4C] font-medium">طرحة / حجاب متطابق:</span>
                    <span className="font-semibold text-emerald-700">مرفق ومشمول مجاناً</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectCategoryForChat(cat.id)}
                  className="flex-1 bg-[#8D5B4C] hover:bg-[#784A3D] text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تجربة التصنيف في محاكي واتساب</span>
                </button>
                <button
                  onClick={() => handleDownload(cat.image, `${cat.id}_hijab_makkah.jpg`)}
                  className="bg-[#FAF6EF] hover:bg-[#EFE8DD] text-[#2B231D] p-2.5 rounded-lg border border-[#E8E1D7] transition-all"
                  title="تنزيل الصورة"
                >
                  <Download className="w-4 h-4 text-[#8D5B4C]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Specifications & Compliance Table */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8">
        <h3 className="text-lg font-bold text-[#2B231D] mb-4">
          جدول مطابقة المواصفات الفنية المطلوبة
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[#E8E1D7] text-[#8D5B4C]">
                <th className="py-3 px-4 font-semibold">المعيار المطلوب</th>
                <th className="py-3 px-4 font-semibold">المواصفة المعتمدة</th>
                <th className="py-3 px-4 font-semibold">حالة التحقق</th>
                <th className="py-3 px-4 font-semibold">الملاحظات التشغيلية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1] text-[#524942]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#2B231D]">نسبة الأبعاد</td>
                <td className="py-3 px-4">مربعة (1:1 Aspect Ratio)</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">✓ مطابقة تماماً</td>
                <td className="py-3 px-4">ملائمة لعرض واتساب المباشر وبطاقات الكتالوج السريع</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#2B231D]">الخلفية والإضاءة</td>
                <td className="py-3 px-4">عاجية دافئة (Warm Ivory) وإضاءة طبيعية</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">✓ متطابقة وموحدة</td>
                <td className="py-3 px-4">تدرج لوني عاجي يبرز خامات الأقمشة دون بهتان</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#2B231D]">المظهر والحشمة</td>
                <td className="py-3 px-4">أزياء محتشمة وواسعة مع حجاب متطابق</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">✓ كاملة الحشمة</td>
                <td className="py-3 px-4">تونيك وسروال واسع للأطقم، وعباية انسيابية طويلة</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#2B231D]">النصوص والعلامات</td>
                <td className="py-3 px-4">خالية تماماً من الأثمان أو الشعارات أو النصوص</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">✓ خالية 100%</td>
                <td className="py-3 px-4">تتيح سهولة إعادة الاستخدام في رسائل واتساب المتنوعة</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#2B231D]">ألوان الموديلات</td>
                <td className="py-3 px-4">من صور المورد الحقيقية فقط</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">✓ سياسة صارمة</td>
                <td className="py-3 px-4">لا يتم تخليق صور ألوان بالذكاء الاصطناعي احتراماً لمصداقية المتجر</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#FAF6EF] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E1D7]">
            <div className="p-4 bg-white border-b border-[#E8E1D7] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#2B231D]">{selectedImageModal.nameAr}</h4>
                <p className="text-xs text-[#8D5B4C]">صورة تصنيف مربعة 1:1 عالية الدقة</p>
              </div>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#FAF6EF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-[#FAF6EF]">
              <img
                src={selectedImageModal.image}
                alt={selectedImageModal.name}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] rounded-xl object-contain shadow-md"
              />
            </div>
            <div className="p-4 bg-white border-t border-[#E8E1D7] flex items-center justify-between">
              <span className="text-xs text-[#6D635B]">
                خلفية عاجية دافئة · تصوير أزياء واقعي واحترافي · خالية من النصوص والشعارات
              </span>
              <button
                onClick={() => handleDownload(selectedImageModal.image, `${selectedImageModal.id}_full.jpg`)}
                className="bg-[#8D5B4C] hover:bg-[#784A3D] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
