import {locales,type Locale} from './locale';

export const commonKeys=['language','home','about','launch','advertise','promoter','learn','docs','save','cancel','retry','loading','saved','saveError'] as const;
type CommonKey=typeof commonKeys[number];
export type CommonMessages=Record<CommonKey,string>;
/** Draft translations: independent linguistic/domain review is required before launch. */
const drafts:Record<Locale,readonly string[]>={
  en:['Language','Home','About','Launch Console','Start advertising','Open Promoter Hub','Learn more','Read the docs','Save','Cancel','Try again','Loading…','Language saved','Could not save your language. Try again.'],
  fr:['Langue','Accueil','À propos','Ouvrir la console','Commencer à faire de la publicité','Ouvrir Promoter Hub','En savoir plus','Lire la documentation','Enregistrer','Annuler','Réessayer','Chargement…','Langue enregistrée','Impossible d’enregistrer votre langue. Réessayez.'],
  es:['Idioma','Inicio','Acerca de','Abrir consola','Empezar a anunciar','Abrir Promoter Hub','Más información','Leer la documentación','Guardar','Cancelar','Reintentar','Cargando…','Idioma guardado','No se pudo guardar el idioma. Inténtalo de nuevo.'],
  'pt-BR':['Idioma','Início','Sobre','Abrir console','Começar a anunciar','Abrir Promoter Hub','Saiba mais','Ler a documentação','Salvar','Cancelar','Tentar novamente','Carregando…','Idioma salvo','Não foi possível salvar o idioma. Tente novamente.'],
  ar:['اللغة','الرئيسية','من نحن','فتح لوحة التحكم','ابدأ الإعلان','افتح Promoter Hub','معرفة المزيد','قراءة الوثائق','حفظ','إلغاء','إعادة المحاولة','جارٍ التحميل…','تم حفظ اللغة','تعذّر حفظ اللغة. حاول مجددًا.'],
  sw:['Lugha','Mwanzo','Kuhusu','Fungua dashibodi','Anza kutangaza','Fungua Promoter Hub','Jifunze zaidi','Soma nyaraka','Hifadhi','Ghairi','Jaribu tena','Inapakia…','Lugha imehifadhiwa','Imeshindikana kuhifadhi lugha. Jaribu tena.'],
  'zh-Hans':['语言','首页','关于我们','打开控制台','开始投放广告','打开 Promoter Hub','了解更多','阅读文档','保存','取消','重试','加载中…','语言已保存','无法保存语言，请重试。'],
  'zh-Hant':['語言','首頁','關於我們','開啟控制台','開始刊登廣告','開啟 Promoter Hub','了解更多','閱讀文件','儲存','取消','重試','載入中…','語言已儲存','無法儲存語言，請重試。'],
  hi:['भाषा','होम','हमारे बारे में','कंसोल खोलें','विज्ञापन शुरू करें','Promoter Hub खोलें','और जानें','दस्तावेज़ पढ़ें','सहेजें','रद्द करें','फिर कोशिश करें','लोड हो रहा है…','भाषा सहेजी गई','भाषा सहेजी नहीं जा सकी। फिर कोशिश करें।'],
  bn:['ভাষা','হোম','আমাদের সম্পর্কে','কনসোল খুলুন','বিজ্ঞাপন শুরু করুন','Promoter Hub খুলুন','আরও জানুন','ডকুমেন্টেশন পড়ুন','সংরক্ষণ করুন','বাতিল','আবার চেষ্টা করুন','লোড হচ্ছে…','ভাষা সংরক্ষিত হয়েছে','ভাষা সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।'],
  ur:['زبان','ہوم','ہمارے بارے میں','کنسول کھولیں','اشتہار دینا شروع کریں','Promoter Hub کھولیں','مزید جانیں','دستاویزات پڑھیں','محفوظ کریں','منسوخ کریں','دوبارہ کوشش کریں','لوڈ ہو رہا ہے…','زبان محفوظ ہو گئی','زبان محفوظ نہیں ہو سکی۔ دوبارہ کوشش کریں۔'],
  id:['Bahasa','Beranda','Tentang','Buka konsol','Mulai beriklan','Buka Promoter Hub','Pelajari lebih lanjut','Baca dokumentasi','Simpan','Batal','Coba lagi','Memuat…','Bahasa tersimpan','Bahasa tidak dapat disimpan. Coba lagi.'],
  de:['Sprache','Startseite','Über uns','Konsole öffnen','Werbung starten','Promoter Hub öffnen','Mehr erfahren','Dokumentation lesen','Speichern','Abbrechen','Erneut versuchen','Wird geladen…','Sprache gespeichert','Die Sprache konnte nicht gespeichert werden. Bitte erneut versuchen.'],
  ru:['Язык','Главная','О нас','Открыть консоль','Начать рекламу','Открыть Promoter Hub','Подробнее','Читать документацию','Сохранить','Отмена','Повторить','Загрузка…','Язык сохранён','Не удалось сохранить язык. Попробуйте ещё раз.'],
  tr:['Dil','Ana sayfa','Hakkımızda','Konsolu aç','Reklam vermeye başla','Promoter Hub’ı aç','Daha fazla bilgi','Belgeleri oku','Kaydet','İptal','Tekrar dene','Yükleniyor…','Dil kaydedildi','Dil kaydedilemedi. Tekrar deneyin.'],
  ja:['言語','ホーム','概要','コンソールを開く','広告を始める','Promoter Hubを開く','詳しく見る','ドキュメントを読む','保存','キャンセル','再試行','読み込み中…','言語を保存しました','言語を保存できませんでした。もう一度お試しください。'],
  ko:['언어','홈','소개','콘솔 열기','광고 시작하기','Promoter Hub 열기','자세히 알아보기','문서 읽기','저장','취소','다시 시도','불러오는 중…','언어가 저장되었습니다','언어를 저장하지 못했습니다. 다시 시도해 주세요.'],
  ha:['Harshe','Gida','Game da mu','Buɗe kundin sarrafawa','Fara talla','Buɗe Promoter Hub','Ƙarin bayani','Karanta takardu','Ajiye','Soke','Sake gwadawa','Ana ɗorawa…','An ajiye harshe','Ba a iya ajiye harshen ba. Sake gwadawa.'],
  yo:['Èdè','Ilé','Nípa wa','Ṣí pátákó ìṣàkóso','Bẹ̀rẹ̀ ìpolówó','Ṣí Promoter Hub','Kọ́ sí i','Ka àwọn ìwé ìtọ́sọ́nà','Fi pamọ́','Fagilé','Gbìyànjú lẹ́ẹ̀kan sí i','A ń gbé wọlé…','A ti fi èdè pamọ́','A kò lè fi èdè pamọ́. Gbìyànjú lẹ́ẹ̀kan sí i.'],
  ig:['Asụsụ','Ụlọ','Banyere anyị','Mepee njikwa','Malite mgbasa ozi','Mepee Promoter Hub','Mụtakwuo','Gụọ akwụkwọ nduzi','Chekwaa','Kagbuo','Nwaa ọzọ','Ọ na-ebu…','E chekwara asụsụ','Enweghị ike ichekwa asụsụ. Nwaa ọzọ.'],
  pcm:['Language','Home','About us','Open Console','Start advertising','Open Promoter Hub','Learn more','Read di docs','Save','Cancel','Try again','E dey load…','We don save your language','We no fit save your language. Try again.'],
};
export function commonMessages(locale:Locale):CommonMessages {
  const values=drafts[locale];
  if(values.length!==commonKeys.length)throw new Error(`Incomplete common catalog: ${locale}`);
  return Object.fromEntries(commonKeys.map((key,index)=>[key,values[index]])) as CommonMessages;
}
export function validateCommonCatalogs():void {
  for(const [locale] of locales){const messages=commonMessages(locale);for(const value of Object.values(messages))if(!value.trim())throw new Error(`Empty translation: ${locale}`);}
}
