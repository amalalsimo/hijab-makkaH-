import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  CheckCheck, 
  Play, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import { CATEGORIES_DATA, PRODUCTS_DATA, AUDIO_GUIDES_DATA, MOROCCAN_CITIES } from '../data/storeData';
import { Category, Product, ProductColor, CustomerOrder } from '../types';
import { speakScript } from '../utils/audioExporter';

interface WhatsAppSimulatorProps {
  initialCategoryId?: string | null;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ initialCategoryId }) => {
  // Current step in purchasing flow (1 to 10)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Customer info inputs
  const [customerName, setCustomerName] = useState<string>('مريم الإدريسي');
  const [customerCity, setCustomerCity] = useState<string>('الدار البيضاء (Casablanca)');
  const [customerAddress, setCustomerAddress] = useState<string>('حي المعاريف، زنقة غاندي، عمارة 12، شقة 4');
  const [customerPhone, setCustomerPhone] = useState<string>('0661234567');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [bankProofUploaded, setBankProofUploaded] = useState<boolean>(false);

  // Chat message input for manual typing (e.g. typing "التصنيفات")
  const [inputMessage, setInputMessage] = useState<string>('');

  // Audio playback state
  const [playingVoiceGuideId, setPlayingVoiceGuideId] = useState<string | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  // Order state
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Filtered products based on selected category
  const availableProducts = selectedCategory
    ? PRODUCTS_DATA.filter(p => p.categoryId === selectedCategory.id)
    : PRODUCTS_DATA;

  useEffect(() => {
    if (initialCategoryId) {
      const cat = CATEGORIES_DATA.find(c => c.id === initialCategoryId);
      if (cat) {
        handleSelectCategory(cat);
      }
    }
  }, [initialCategoryId]);

  useEffect(() => {
    // Auto scroll chat to bottom when step advances
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentStep, selectedProduct, selectedColor]);

  const playVoiceNote = (guideId: string) => {
    if (playingVoiceGuideId === guideId) {
      if (stopAudioRef.current) stopAudioRef.current();
      setPlayingVoiceGuideId(null);
      return;
    }

    if (stopAudioRef.current) stopAudioRef.current();

    const guide = AUDIO_GUIDES_DATA.find(g => g.id === guideId);
    if (!guide) return;

    setPlayingVoiceGuideId(guideId);
    const stopFn = speakScript(
      guide.script,
      () => setPlayingVoiceGuideId(guideId),
      () => setPlayingVoiceGuideId(null)
    );
    stopAudioRef.current = stopFn;
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentProductIndex(0);
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedSize('');
    setCurrentStep(2); // Step 2: Show carousel
  };

  const handleSelectModel = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    setSelectedSize('');
    setCurrentStep(3); // Step 3: Show color swatches from supplier
  };

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (!selectedSize && selectedProduct?.sizes[0]) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
    setCurrentStep(4); // Step 4: Size and quantity
  };

  const handleProceedToDeliveryInfo = () => {
    if (!selectedSize) {
      alert('من فضلك اختاري المقاس أولاً');
      return;
    }
    setCurrentStep(7); // Step 7: Customer info collection
  };

  const handleProceedToSummary = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert('يرجى ملء جميع معلومات التوصيل المطلوبة');
      return;
    }
    setCurrentStep(8); // Step 8: Order Summary
  };

  const handleConfirmOrder = () => {
    const newOrder: CustomerOrder = {
      id: `HM-${Math.floor(100000 + Math.random() * 900000)}`,
      product: selectedProduct,
      selectedColor,
      selectedSize,
      quantity,
      customerName,
      city: customerCity,
      address: customerAddress,
      phone: customerPhone,
      paymentMethod,
      status: 'pending_admin_approval',
      createdAt: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedOrder(newOrder);
    setCurrentStep(9); // Step 9: Administrative review notice & Step 10: Payment policy
  };

  const handleResetToCategories = () => {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedSize('');
    setQuantity(1);
    setCurrentStep(1);
  };

  const handleBackToCarousel = () => {
    setSelectedColor(null);
    setSelectedSize('');
    setCurrentStep(2);
  };

  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    if (text.includes('التصنيفات') || text.toLowerCase().includes('categories') || text.includes('تصنيفات')) {
      handleResetToCategories();
      setInputMessage('');
      return;
    }

    setInputMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Banner */}
      <div className="bg-[#FAF6EF] border border-[#E8E1D7] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D5B4C] mb-1">
            <span>محاكي تجربة الشراء التفاعلي</span>
            <span aria-hidden="true">·</span>
            <span>نظام الشات بوت المعتمد عبر واتساب</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2B231D]">
            محاكاة الخطوات العشر لمسار الشراء الكامل
          </h2>
          <p className="text-xs sm:text-sm text-[#6D635B] mt-1">
            اختبري تنقل العميلة، وسماع المقاطع الصوتية المرافقة لكل مرحلة بالدارجة المغربية، ومراجعة الإدارة للطلبات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToCategories}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-[#FAF6EF] border border-[#E8E1D7] rounded-lg text-xs font-semibold text-[#2B231D] transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8D5B4C]" />
            <span>إعادة ضبط المحادثة</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Frame */}
      <div className="max-w-3xl mx-auto bg-[#ECE5DD] rounded-3xl border border-[#D1C7BD] overflow-hidden shadow-xl flex flex-col min-h-[750px]">
        
        {/* WhatsApp Top Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#8D5B4C] text-[#FAF6EF] flex items-center justify-center font-bold text-base border-2 border-white">
                ح
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide">حجاب مكة — Hijab Makkah</span>
                <span className="bg-emerald-500/20 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded font-medium">حساب تجاري موثق</span>
              </div>
              <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                متصل الآن · الرد التلقائي الفوري
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-100 text-xs">
            <span className="bg-white/10 px-2.5 py-1 rounded-full text-[11px]">
              الخطوة {currentStep} من 10
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-sm"
          style={{ backgroundImage: 'radial-gradient(#075e54 0.5px, transparent 0.5px)', backgroundSize: '16px 16px', backgroundPosition: '0 0', opacity: 0.98 }}
        >
          
          {/* System Date Badge */}
          <div className="flex justify-center">
            <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-[11px] font-medium text-stone-600 shadow-xs">
              اليوم · خدمة الطلب عبر واتساب
            </span>
          </div>

          {/* STEP 1: Categories View */}
          <div className="flex flex-col items-start space-y-2 max-w-[92%] sm:max-w-[85%]">
            <div className="bg-white rounded-2xl rounded-tr-xs p-4 shadow-sm border border-stone-200 text-[#2B231D] space-y-3">
              <p className="leading-relaxed">
                السلام عليكم ورحمة الله تعالى وبركاته، مرحباً بكِ في <strong>«حجاب مكة»</strong> 🌸<br />
                أزياء محتشمة وراقية بأفضل الخامات. تفضلي باختيار التصنيف اللي بغيتي تكتشفيه:
              </p>

              {/* In-chat Audio Voice Note */}
              <div className="bg-[#F7F4EB] p-2.5 rounded-xl border border-[#E8E1D7] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playVoiceNote('step_1_tasnifat')}
                    className="w-8 h-8 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center hover:bg-[#784A3D] transition-transform active:scale-95 shrink-0"
                  >
                    {playingVoiceGuideId === 'step_1_tasnifat' ? (
                      <Square className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    )}
                  </button>
                  <div className="text-xs">
                    <span className="font-semibold text-[#2B231D] block">مقطع إرشادي بالدارجة المغربية</span>
                    <span className="text-[10px] text-stone-500">صوت أنثوي هادئ · 01_ikhtiyar_tasnif.ogg</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-stone-500">0:05</span>
              </div>

              {/* Category Options Cards with our generated high-fashion photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CATEGORIES_DATA.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className="group cursor-pointer bg-[#FAF6EF] hover:bg-[#F3EDE3] border border-[#E8E1D7] hover:border-[#8D5B4C] rounded-xl overflow-hidden transition-all shadow-xs flex flex-col"
                  >
                    <div className="aspect-square relative overflow-hidden bg-white">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-[#8D5B4C]">
                        صورة القسم المعتمدة
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-[#2B231D] text-sm group-hover:text-[#8D5B4C] transition-colors">
                        {cat.nameAr}
                      </div>
                      <div className="text-[11px] text-[#6D635B] mt-0.5">
                        {cat.productCount} موديلات متناسقة مع الحجاب
                      </div>
                      <button className="mt-2 w-full py-1.5 bg-[#8D5B4C] text-white text-xs font-semibold rounded-lg group-hover:bg-[#784A3D] transition-colors">
                        عرض موديلات {cat.nameAr}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 pt-1">
                <span>10:30 ص</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* User message if category selected */}
          {selectedCategory && (
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-xs p-3 shadow-sm max-w-[80%] text-[#2B231D]">
                <p>اخترت قسم: <strong>{selectedCategory.nameAr}</strong></p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 mt-1">
                  <span>10:31 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Product Carousel for selected category */}
          {selectedCategory && currentStep >= 2 && (
            <div className="flex flex-col items-start space-y-2 max-w-[95%] sm:max-w-[88%]">
              <div className="bg-white rounded-2xl rounded-tr-xs p-4 shadow-sm border border-stone-200 text-[#2B231D] space-y-3 w-full">
                <p className="leading-relaxed">
                  تفضلي، هاهي الموديلات المتوفرة في قسم <strong>«{selectedCategory.nameAr}»</strong>. تقدري تمرري وتشوفي التفاصيل:
                </p>

                {/* Audio Voice Note for Step 2 */}
                <div className="bg-[#F7F4EB] p-2.5 rounded-xl border border-[#E8E1D7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playVoiceNote('step_2_carousel')}
                      className="w-8 h-8 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center hover:bg-[#784A3D] transition-transform active:scale-95 shrink-0"
                    >
                      {playingVoiceGuideId === 'step_2_carousel' ? (
                        <Square className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="text-xs">
                      <span className="font-semibold text-[#2B231D] block">إرشاد تصفح الكاروسيل</span>
                      <span className="text-[10px] text-stone-500">02_tashaffuh_carousel.ogg</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">0:07</span>
                </div>

                {/* Carousel Card */}
                {availableProducts[currentProductIndex] && (
                  <div className="bg-[#FAF6EF] rounded-xl border border-[#E8E1D7] overflow-hidden">
                    <div className="relative aspect-4/3 bg-white">
                      <img
                        src={availableProducts[currentProductIndex].featuredImage}
                        alt={availableProducts[currentProductIndex].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md">
                        {currentProductIndex + 1} من {availableProducts.length}
                      </div>

                      {/* Navigation Arrows for Carousel */}
                      <button
                        onClick={() => setCurrentProductIndex(prev => prev > 0 ? prev - 1 : availableProducts.length - 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md"
                        title="الموديل السابق"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentProductIndex(prev => prev < availableProducts.length - 1 ? prev + 1 : 0)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md"
                        title="الموديل التالي"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#2B231D] text-base">
                          {availableProducts[currentProductIndex].title}
                        </h4>
                        <span className="font-bold text-base text-[#8D5B4C] font-mono">
                          {availableProducts[currentProductIndex].price} درهم
                        </span>
                      </div>
                      <p className="text-xs text-[#6D635B] leading-relaxed">
                        {availableProducts[currentProductIndex].description}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        {/* The exact required button: «اختاري هذا الموديل» */}
                        <button
                          onClick={() => handleSelectModel(availableProducts[currentProductIndex])}
                          className="flex-1 bg-[#8D5B4C] hover:bg-[#784A3D] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>اختاري هذا الموديل</span>
                        </button>
                        <button
                          onClick={handleResetToCategories}
                          className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-600 font-medium"
                        >
                          كتابة «التصنيفات» للرجوع
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400">
                  <span>10:31 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* User message choosing model */}
          {selectedProduct && (
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-xs p-3 shadow-sm max-w-[80%] text-[#2B231D]">
                <p>اختاري هذا الموديل: <strong>{selectedProduct.title}</strong></p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 mt-1">
                  <span>10:32 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 & 4: Model Colors from supplier, then size & quantity */}
          {selectedProduct && currentStep >= 3 && (
            <div className="flex flex-col items-start space-y-2 max-w-[95%] sm:max-w-[88%]">
              <div className="bg-white rounded-2xl rounded-tr-xs p-4 shadow-sm border border-stone-200 text-[#2B231D] space-y-4 w-full">
                <div>
                  <h4 className="font-bold text-[#2B231D] text-sm">
                    الألوان المعتمدة لموديل: {selectedProduct.title}
                  </h4>
                  <p className="text-xs text-[#6D635B] mt-0.5">
                    (تنبيه: ألوان الموديل صور حقيقية ومطابقة 100% لخامات المورد وليست مولدة بالذكاء الاصطناعي)
                  </p>
                </div>

                {/* Voice Note for Step 3 & 4 */}
                <div className="bg-[#F7F4EB] p-2.5 rounded-xl border border-[#E8E1D7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playVoiceNote('step_3_alwan')}
                      className="w-8 h-8 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center hover:bg-[#784A3D] transition-transform active:scale-95 shrink-0"
                    >
                      {playingVoiceGuideId === 'step_3_alwan' ? (
                        <Square className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="text-xs">
                      <span className="font-semibold text-[#2B231D] block">إرشاد اختيار اللون والمقاس</span>
                      <span className="text-[10px] text-stone-500">03_alwan_wa_maqas.ogg</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">0:07</span>
                </div>

                {/* Color Swatches Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2B231D] block">1. اختاري اللون المفضل:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedProduct.colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => handleSelectColor(color)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                          selectedColor?.id === color.id
                            ? 'border-[#8D5B4C] bg-[#FAF6EF] ring-2 ring-[#8D5B4C]/20 font-bold text-[#8D5B4C]'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs truncate">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size and Quantity if color chosen */}
                {selectedColor && (
                  <div className="space-y-4 pt-3 border-t border-stone-100">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#2B231D] block">2. اختاري المقاس المناسب:</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedSize === size
                                ? 'bg-[#8D5B4C] text-white shadow-xs font-bold'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-[#2B231D]">3. الكمية المطلوبة:</span>
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3 py-1 hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold font-mono text-[#2B231D]">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="px-3 py-1 hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Step 5 note: Can go back to previous carousel to pick another model */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <button
                        onClick={handleProceedToDeliveryInfo}
                        className="w-full sm:flex-1 py-2.5 bg-[#8D5B4C] hover:bg-[#784A3D] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        متابعة الطلب وإدخال معلومات التوصيل
                      </button>
                      <button
                        onClick={handleBackToCarousel}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[#FAF6EF] hover:bg-[#EFE8DD] text-[#8D5B4C] border border-[#E8E1D7] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>اختيار موديل آخر من الكاروسيل</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400">
                  <span>10:33 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Customer Delivery Form */}
          {currentStep >= 7 && (
            <div className="flex flex-col items-start space-y-2 max-w-[95%] sm:max-w-[88%]">
              <div className="bg-white rounded-2xl rounded-tr-xs p-4 sm:p-5 shadow-sm border border-stone-200 text-[#2B231D] space-y-4 w-full">
                <div>
                  <h4 className="font-bold text-[#2B231D] text-sm">
                    معلومات التوصيل والاستلام (المغرب 🇲🇦)
                  </h4>
                  <p className="text-xs text-[#6D635B] mt-0.5">
                    المرجو إدخال الاسم الكامل، المدينة، العنوان ورقم الهاتف للتواصل مع شركة التوصيل:
                  </p>
                </div>

                {/* Voice Note for Step 5/7 */}
                <div className="bg-[#F7F4EB] p-2.5 rounded-xl border border-[#E8E1D7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playVoiceNote('step_5_ma3loumat')}
                      className="w-8 h-8 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center hover:bg-[#784A3D] transition-transform active:scale-95 shrink-0"
                    >
                      {playingVoiceGuideId === 'step_5_ma3loumat' ? (
                        <Square className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="text-xs">
                      <span className="font-semibold text-[#2B231D] block">إرشاد إدخال المعلومات</span>
                      <span className="text-[10px] text-stone-500">05_ma3loumat_al_istilam.ogg</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">0:06</span>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#8D5B4C]" />
                      الاسم الكامل:
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: مريم الإدريسي"
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#8D5B4C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8D5B4C]" />
                      المدينة المغربية:
                    </label>
                    <select
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#8D5B4C] bg-white"
                    >
                      {MOROCCAN_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">العنوان الدقيق:</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="الحي، الزنقة، رقم العمارة أو المنزل"
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#8D5B4C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8D5B4C]" />
                      رقم الاتصال (واتساب / هاتف):
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="06XXXXXXXX أو 07XXXXXXXX"
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#8D5B4C] dir-ltr text-right"
                    />
                  </div>
                </div>

                <button
                  onClick={handleProceedToSummary}
                  className="w-full py-2.5 bg-[#8D5B4C] hover:bg-[#784A3D] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  عرض ومراجعة ملخص الطلب النهائي
                </button>

                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400">
                  <span>10:34 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Order Summary Card (Review, Confirm, Edit, Cancel) */}
          {currentStep >= 8 && selectedProduct && selectedColor && (
            <div className="flex flex-col items-start space-y-2 max-w-[95%] sm:max-w-[88%]">
              <div className="bg-white rounded-2xl rounded-tr-xs p-4 sm:p-5 shadow-md border-2 border-[#8D5B4C]/20 text-[#2B231D] space-y-4 w-full">
                
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#8D5B4C]" />
                    <h4 className="font-bold text-[#2B231D] text-sm">
                      ملخص الطلب للمراجعة والتأكيد
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8D5B4C] bg-[#FAF6EF] px-2 py-0.5 rounded">
                    متجر حجاب مكة
                  </span>
                </div>

                {/* Voice Note for Step 6/8 */}
                <div className="bg-[#F7F4EB] p-2.5 rounded-xl border border-[#E8E1D7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playVoiceNote('step_6_muraja3a')}
                      className="w-8 h-8 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center hover:bg-[#784A3D] transition-transform active:scale-95 shrink-0"
                    >
                      {playingVoiceGuideId === 'step_6_muraja3a' ? (
                        <Square className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="text-xs">
                      <span className="font-semibold text-[#2B231D] block">إرشاد مراجعة وتأكيد الطلب</span>
                      <span className="text-[10px] text-stone-500">06_muraja3at_al_talab.ogg</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">0:06</span>
                </div>

                {/* Itemized summary details */}
                <div className="bg-[#FAF6EF] p-3.5 rounded-xl border border-[#E8E1D7] text-xs space-y-2 text-[#524942]">
                  <div className="flex justify-between">
                    <span className="text-stone-500">المنتج:</span>
                    <span className="font-bold text-[#2B231D]">{selectedProduct.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">اللون المختار:</span>
                    <span className="font-bold text-[#2B231D] flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: selectedColor.hex }} />
                      {selectedColor.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">المقاس:</span>
                    <span className="font-bold text-[#2B231D]">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">الكمية:</span>
                    <span className="font-bold font-mono">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">سعر القطعة:</span>
                    <span className="font-mono">{selectedProduct.price} درهم</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-[#E8E1D7]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      مصاريف التوصيل:
                    </span>
                    <span>مجاني (0 درهم)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#8D5B4C] pt-1 border-t border-[#E8E1D7]">
                    <span>المجموع الإجمالي للدفع:</span>
                    <span className="font-mono">{selectedProduct.price * quantity} درهم مغربي</span>
                  </div>
                </div>

                {/* Customer Address Preview */}
                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <div><strong>المستلمة:</strong> {customerName} ({customerPhone})</div>
                  <div><strong>الوجهة:</strong> {customerCity} — {customerAddress}</div>
                </div>

                {/* Step 10: Payment selection (COD default vs Bank Transfer with verification check) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2B231D] block">طريقة الأداء:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                        paymentMethod === 'cod'
                          ? 'border-[#8D5B4C] bg-[#FAF6EF] font-bold text-[#8D5B4C]'
                          : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      <span>الدفع نقداً عند الاستلام (الافتراضي)</span>
                      <CheckCircle className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-[#8D5B4C]' : 'opacity-0'}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-[#8D5B4C] bg-[#FAF6EF] font-bold text-[#8D5B4C]'
                          : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      <span>تحويل بنكي (CIH / التجاري)</span>
                      <CreditCard className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>شرط التحقق من التحويل البنكي:</strong>
                          <p className="mt-0.5 text-[11px] text-amber-800">
                            يجب إرسال صورة وصل التحويل في المحادثة، ويخضع إثبات الدفع للتحقق والمطابقة البنكية قبل الموافقة على الطلب.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBankProofUploaded(!bankProofUploaded)}
                        className="text-xs px-3 py-1.5 bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-semibold rounded-lg"
                      >
                        {bankProofUploaded ? '✓ تم إرفاق صورة الوصل' : 'محاكاة إرفاق صورة وصل التحويل'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 3 Explicit Actions: Confirm, Edit, Cancel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={handleConfirmOrder}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تأكيد الطلب</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(7)}
                    className="py-2.5 px-3 bg-[#FAF6EF] hover:bg-[#EFE8DD] text-[#8D5B4C] border border-[#E8E1D7] rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <span>تعديل الطلب</span>
                  </button>

                  <button
                    onClick={handleResetToCategories}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <span>إلغاء الطلب</span>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400">
                  <span>10:35 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9 & 10: Administrative Review & Confirmation Notice */}
          {currentStep >= 9 && confirmedOrder && (
            <div className="flex flex-col items-start space-y-2 max-w-[95%] sm:max-w-[88%] animate-fade-in">
              <div className="bg-white rounded-2xl rounded-tr-xs p-5 shadow-md border-2 border-emerald-500/30 text-[#2B231D] space-y-4 w-full">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-800">
                      تم تسجيل طلبك بنجاح! (رقم: {confirmedOrder.id})
                    </h4>
                    <span className="text-xs text-stone-500">حجاب مكة · قسم معالجة الطلبيات</span>
                  </div>
                </div>

                {/* Crucial Rule 9: Admin Review Notice */}
                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-amber-950 mb-1">
                        تنبيه إداري تشغيلي هام (الخطوة 9 المعتمدة):
                      </strong>
                      <p className="leading-relaxed text-amber-900">
                        تأكيدك للطلب لا يعني إرساله مباشرة للمورد؛ إدارة متجر حجاب مكة تراجع الطلب وتوافق عليه أولاً، وتتأكد من مطابقة خامات الموديل وتجهيزه قبل تسليمه لشركة التوزيع.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Voice Note for Step 9 & 10 */}
                <div className="bg-[#F7F4EB] p-2.5 rounded-xl border border-[#E8E1D7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playVoiceNote('step_7_idara')}
                      className="w-8 h-8 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center hover:bg-[#784A3D] transition-transform active:scale-95 shrink-0"
                    >
                      {playingVoiceGuideId === 'step_7_idara' ? (
                        <Square className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="text-xs">
                      <span className="font-semibold text-[#2B231D] block">مقطع توضيح مراجعة الإدارة والتوصيل</span>
                      <span className="text-[10px] text-stone-500">07_ish3ar_al_idara.ogg</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">0:11</span>
                </div>

                {/* Step 10 Delivery & Payment Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2 font-bold text-[#2B231D] mb-1">
                      <Truck className="w-4 h-4 text-[#8D5B4C]" />
                      <span>التوصيل مجاني 100%</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      التوصيل مجاني لجميع ربوع المملكة المغربية بدون أي مصاريف إضافية مخفية.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2 font-bold text-[#2B231D] mb-1">
                      <CreditCard className="w-4 h-4 text-[#8D5B4C]" />
                      <span>طريقة الأداء المعتمدة</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      {confirmedOrder.paymentMethod === 'cod'
                        ? 'الدفع نقداً عند الاستلام ومعاينة الطرد مع موزع الأمانة/التوصيل.'
                        : 'تحويل بنكي (جاري التحقق والمطابقة البنكية مع الإدارة).'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={handleResetToCategories}
                    className="text-xs text-[#8D5B4C] hover:text-[#5E3A30] font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>طلب جديد أو الرجوع إلى «التصنيفات»</span>
                  </button>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <span>10:36 ص</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* WhatsApp Bottom Input Bar */}
        <div className="bg-[#F0F2F5] px-4 py-3 border-t border-stone-200 flex items-center gap-3">
          
          <button
            onClick={handleResetToCategories}
            className="px-3 py-1.5 bg-[#FAF6EF] hover:bg-[#EFE8DD] text-[#8D5B4C] border border-[#E8E1D7] rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
            title="العودة للتصنيفات"
          >
            التصنيفات ↩
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتبي رسالتك (أو اكتبي «التصنيفات» للرجوع للأقسام)..."
              className="w-full text-xs sm:text-sm py-2 px-4 rounded-full bg-white border border-stone-300 focus:outline-none focus:border-[#075E54] shadow-xs"
            />
          </div>

          <button
            onClick={handleSendMessage}
            className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center shadow-sm shrink-0 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>

        </div>

      </div>

    </div>
  );
};
