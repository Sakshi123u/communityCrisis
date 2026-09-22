import { Incident, Language } from '../types';

interface IncidentTranslationMap {
  title: Record<Language, string>;
  description: Record<Language, string>;
  address?: Record<Language, string>;
  summary?: Record<Language, string>;
  potentialImpact?: Record<Language, string>;
  reasoning?: Record<Language, string>;
}

export const departmentTranslations: Record<string, Record<Language, string>> = {
  'Disaster Management & Drainage': {
    en: 'Disaster Management & Drainage',
    hi: 'आपदा प्रबंधन और जल निकासी',
    mr: 'आपत्ती व्यवस्थापन आणि जलनिस्सारण'
  },
  'Municipal Water Board': {
    en: 'Municipal Water Board',
    hi: 'नगर निगम जल बोर्ड',
    mr: 'महानगरपालिका पाणी पुरवठा मंडळ'
  },
  'Electricity & Public Lighting Grid': {
    en: 'Electricity & Public Lighting Grid',
    hi: 'विद्युत एवं सार्वजनिक प्रकाश ग्रिड',
    mr: 'विद्युत व सार्वजनिक पथदिवे विभाग'
  },
  'Roads & Transport Authority': {
    en: 'Roads & Transport Authority',
    hi: 'सड़क एवं परिवहन प्राधिकरण',
    mr: 'रस्ते व वाहतूक प्राधिकरण'
  },
  'Waste Management & Sanitation': {
    en: 'Waste Management & Sanitation',
    hi: 'कचरा प्रबंधन एवं स्वच्छता',
    mr: 'घनकचरा व्यवस्थापन व स्वच्छता विभाग'
  },
  'Public Safety & Enforcement': {
    en: 'Public Safety & Enforcement',
    hi: 'सार्वजनिक सुरक्षा एवं प्रवर्तन',
    mr: 'सार्वजनिक सुरक्षा व अंमलबजावणी'
  },
  'Public Works & Engineering': {
    en: 'Public Works & Engineering',
    hi: 'लोक निर्माण एवं इंजीनियरिंग',
    mr: 'सार्वजनिक बांधकाम व अभियांत्रिकी'
  },
  'Public Works & Infrastructure Dept': {
    en: 'Public Works & Infrastructure Dept',
    hi: 'लोक निर्माण एवं अवसंरचना विभाग',
    mr: 'सार्वजनिक बांधकाम व पायाभूत सुविधा विभाग'
  },
  'Pollution Control Board': {
    en: 'Pollution Control Board',
    hi: 'प्रदूषण नियंत्रण बोर्ड',
    mr: 'प्रदूषण नियंत्रण मंडळ'
  }
};

export const knownIncidentTranslations: Record<string, IncidentTranslationMap> = {
  'inc-101': {
    title: {
      en: 'Severe Waterlogging & Storm Drain Blockage on Main Arterial Highway',
      hi: 'मुख्य राजमार्ग पर भारी जलभराव और स्टॉर्म ड्रेन में रुकावट',
      mr: 'मुख्य महामार्गावर तीव्र पाणी साचणे आणि पावसाळी गटार तुंबणे'
    },
    description: {
      en: 'Heavy rain from storm last night resulted in 2 feet of standing water near the central subway underpass. Traffic is halted and water is entering nearby ground-floor commercial shops.',
      hi: 'बीती रात के तूफान की भारी बारिश के कारण सेंट्रल सबवे अंडरपास के पास 2 फीट पानी भर गया है। यातायात पूरी तरह बाधित है और आसपास की भूतल की दुकानों में पानी घुस रहा है।',
      mr: 'काल रात्रीच्या वादळी पावसामुळे मध्यवर्ती सबवे अंडरपासजवळ २ फूट पाणी साचले आहे. वाहतूक ठप्प झाली असून लगतच्या तळमजल्यावरील दुकानांमध्ये पाणी शिरत आहे.'
    },
    address: {
      en: 'Central Subway Underpass, 45 Main Arterial Rd, District 4',
      hi: 'सेंट्रल सबवे अंडरपास, 45 मेन आर्टेरियल रोड, जिला 4',
      mr: 'सेंट्रल सबवे अंडरपास, ४५ मेन आर्टेरियल रोड, जिल्हा ४'
    },
    summary: {
      en: 'High water accumulation (approx 24 inches) blocking key commuter transit artery. Substantial flood risk to surrounding infrastructure and ground-floor businesses.',
      hi: 'लगभग 24 इंच पानी जमा होने से मुख्य यातायात मार्ग अवरुद्ध है। आसपास के बुनियादी ढांचे और भूतल की दुकानों में बाढ़ का गंभीर खतरा।',
      mr: 'सुमारे २४ इंच पाणी साचल्यामुळे मुख्य वाहतूक रस्ता बंद झाला आहे. आसपासच्या पायाभूत सुविधांना व दुकानांना पूर येण्याचा मोठा धोका.'
    }
  },
  'inc-102': {
    title: {
      en: 'High-Pressure Water Pipeline Burst Damaging Road Foundation',
      hi: 'सड़क की नींव को नुकसान पहुँचाने वाला उच्च दबाव वाली पानी की पाइपलाइन फटना',
      mr: 'रस्त्याचा पाया कमकुवत करणारी उच्च दाबाची पाण्याची पाईपलाईन फुटली'
    },
    description: {
      en: 'Clean drinking water is gushing from underground pipe near Park Avenue. The road surface is collapsing into a sinkhole.',
      hi: 'पार्क एवेन्यू के पास भूमिगत पाइप से पीने का साफ पानी तेजी से बह रहा है। सड़क की सतह गड्ढे (सिंकहोल) में धंस रही है।',
      mr: 'पार्क अव्हेन्यू जवळ भूमिगत पाईपमधून पिण्याचे स्वच्छ पाणी वाहत आहे. रस्त्याचा पृष्ठभाग खड्ड्यात खचत आहे.'
    },
    address: {
      en: '72 Park Avenue, North Ward, Zone 2',
      hi: '72 पार्क एवेन्यू, नॉर्थ वार्ड, जोन 2',
      mr: '७२ पार्क अव्हेन्यू, नॉर्थ वॉर्ड, झोन २'
    },
    summary: {
      en: 'High pressure feeder pipe rupture causing erosion beneath asphalt foundation. Potential sinkhole expansion adjacent to residential apartments.',
      hi: 'उच्च दबाव वाली मुख्य पाइप फटने से डामर की नींव के नीचे मिट्टी का कटाव हो रहा है। रिहायशी इमारतों के पास सिंकहोल का विस्तार होने की संभावना।',
      mr: 'उच्च दाबाची पाईप फुटल्यामुळे डांबरी पायाखाली मातीची धूप होत आहे. निवासी इमारतींजवळ खड्डा मोठा होण्याचा धोका.'
    }
  },
  'inc-103': {
    title: {
      en: 'Exposed High-Voltage Electrical Wire Hanging Near School Gate',
      hi: 'स्कूल गेट के पास लटक रहा खुला हाई-वोल्टेज बिजली का तार',
      mr: 'शाळेच्या गेटजवळ लटकत असलेली उघडी हाय-व्होल्टेज विजेची तार'
    },
    description: {
      en: 'Transformer pole wire snapped following strong wind gusts. Wires are dangling 4 feet above sidewalk directly outside St. Jude Elementary School.',
      hi: 'तेज हवाओं के बाद ट्रांसफार्मर पोल का तार टूट गया। सेंट ज्यूड एलीमेंट्री स्कूल के ठीक बाहर फुटपाथ से 4 फीट ऊपर तार लटक रहे हैं।',
      mr: 'वादळी वाऱ्यामुळे ट्रान्सफॉर्मर खांबाची तार तुटली. सेंट ज्यूड प्राथमिक शाळेच्या बाहेर पदपथापासून ४ फूट उंचीवर तारा लटकत आहेत.'
    },
    address: {
      en: '12 School Lane, St. Jude Sector, Ward 8',
      hi: '12 स्कूल लेन, सेंट ज्यूड सेक्टर, वार्ड 8',
      mr: '१२ स्कूल लेन, सेंट ज्यूड सेक्टर, वॉर्ड ८'
    },
    summary: {
      en: 'Dangling 11kV conductor line outside elementary school gate. Extreme electrocution risk to children and pedestrians.',
      hi: 'प्राथमिक विद्यालय के गेट के बाहर 11kV की लटकती बिजली की लाइन। बच्चों और पैदल चलने वालों के लिए गंभीर करंट का खतरा।',
      mr: 'प्राथमिक शाळेच्या गेटबाहेर ११ केव्हीची लटकती वीज लाईन. लहान मुले व पादचाऱ्यांना विजेचा धक्का बसण्याचा तीव्र धोका.'
    }
  },
  'inc-104': {
    title: {
      en: 'Dangerous Deep Pothole Array Creating Multiple Vehicle Accidents',
      hi: 'खतरनाक गहरे गड्ढों की श्रृंखला से लगातार वाहन दुर्घटनाएं',
      mr: 'अनेक वाहन अपघातांना कारणीभूत ठरणारी धोकादायक खोल खड्ड्यांची मालिका'
    },
    description: {
      en: 'A series of three 8-inch deep asphalt potholes across both lanes of Commerce Boulevard. Two motorcyclists skid and sustained minor injuries.',
      hi: 'कॉमर्स बुलेवार्ड की दोनों लेनों में 8 इंच गहरे तीन गड्ढे हो गए हैं। दो मोटरसाइकिल चालक फिसल गए और उन्हें मामूली चोटें आईं।',
      mr: 'कॉमर्स बुलेव्हार्डच्या दोन्ही लेनवर ८ इंच खोल तीन खड्डे पडले आहेत. दोन दुचाकीस्वार घसरून किरकोळ जखमी झाले.'
    },
    address: {
      en: 'Commerce Boulevard, Intersection with 14th Cross St',
      hi: 'कॉमर्स बुलेवार्ड, 14वीं क्रॉस स्ट्रीट चौराहा',
      mr: 'कॉमर्स बुलेव्हार्ड, १४ व्या क्रॉस स्ट्रीटचा चौक'
    },
    summary: {
      en: 'Multiple deep structural asphalt pavement craters across active travel lanes causing vehicle wheel damage and two-wheeler accidents.',
      hi: 'व्यस्त सड़क पर कई गहरे गड्ढे वाहन के पहियों को नुकसान पहुंचा रहे हैं और दोपहिया वाहनों के लिए दुर्घटना का कारण बन रहे हैं।',
      mr: 'रस्त्यावरील अनेक खोल खड्ड्यांमुळे वाहनांचे नुकसान होत असून दुचाकी वाहनांचे अपघात होत आहेत.'
    }
  },
  'inc-105': {
    title: {
      en: 'Uncontrolled Garbage Overflow & Chemical Leachate Accumulation',
      hi: 'अनियंत्रित कचरा ओवरफ्लो और दुर्गंधयुक्त दूषित पानी का जमाव',
      mr: 'कचऱ्याचे अनिर्बंध साचणे आणि दुर्गंधीयुक्त दूषित पाण्याचा निचरा'
    },
    description: {
      en: 'Community dumpster has not been cleared for 6 days. Waste overflow is blocking sidewalk and rotting food waste is leaking foul liquid into storm drain.',
      hi: 'सामुदायिक कचरादान 6 दिनों से साफ नहीं किया गया है। कचरा फुटपाथ को अवरुद्ध कर रहा है और सड़ा हुआ कचरा नाले में बदबूदार तरल बहा रहा है।',
      mr: 'सामुदायिक कचराकुंडी ६ दिवसांपासून साफ केलेली नाही. कचरा पदपथावर पसरला असून सडणाऱ्या अन्नातून दुर्गंधीयुक्त पाणी नाल्यात वाहत आहे.'
    },
    address: {
      en: 'Behind Green Valley Apartments, Sector 5',
      hi: 'ग्रीन वैली अपार्टमेंट्स के पीछे, सेक्टर 5',
      mr: 'ग्रीन व्हॅली अपार्टमेंट्सच्या मागे, सेक्टर ५'
    },
    summary: {
      en: 'Solid municipal waste accumulation exceeding container volume by 300%. Biohazard risks from pest breeding and foul odor near market area.',
      hi: 'कचरा डिब्बे की क्षमता से 300% अधिक कचरा जमा हो गया है। बाजार क्षेत्र के पास कीट-पतंगों और दुर्गंध से स्वास्थ्य जोखिम।',
      mr: 'कचरापेटीच्या क्षमतेपेक्षा ३००% जास्त कचरा साचला आहे. बाजार परिसराजवळ कीटक आणि दुर्गंधीमुळे आरोग्यास धोका.'
    }
  },
  'inc-106': {
    title: {
      en: 'Major Traffic Signal Outage at Busy 4-Way Intersection',
      hi: 'व्यस्त 4-तरफा चौराहे पर मुख्य ट्रैफिक सिग्नल पूरी तरह बंद',
      mr: 'व्यस्त ४-रस्त्यांच्या चौकातील प्रमुख ट्रॅफिक सिग्नल पूर्णपणे बंद'
    },
    description: {
      en: 'Traffic signals on all 4 quadrants are completely blacked out following transformer failure. Heavy congestion and near-collisions occurring.',
      hi: 'ट्रांसफार्मर की खराबी के बाद चारों दिशाओं के ट्रैफिक सिग्नल पूरी तरह बंद हैं। भारी जाम और वाहनों के टकराने का खतरा बना हुआ है।',
      mr: 'ट्रान्सफॉर्मर बिघाडामुळे चारही बाजूंचे ट्रॅफिक सिग्नल पूर्णपणे बंद आहेत. प्रचंड वाहतूक कोंडी आणि अपघातांची शक्यता निर्माण झाली आहे.'
    },
    address: {
      en: 'Grand Junction 4-Way Crossing, Ward 11',
      hi: 'ग्रैंड जंक्शन 4-वे क्रॉसिंग, वार्ड 11',
      mr: 'ग्रँड जंक्शन ४-वे क्रॉसिंग, वॉर्ड ११'
    },
    summary: {
      en: 'Complete power loss to traffic management signal controller box at high density intersection.',
      hi: 'अत्यधिक व्यस्त चौराहे पर ट्रैफिक सिग्नल कंट्रोलर बॉक्स की बिजली पूरी तरह गुल हो गई है।',
      mr: 'अत्यंत गर्दीच्या चौकातील वाहतूक नियंत्रण सिग्नल बॉक्सचा वीजपुरवठा पूर्णपणे खंडित झाला आहे.'
    }
  },
  'inc-107': {
    title: {
      en: 'Broken High-Mast Streetlight Array Leaving Dark Corridor',
      hi: 'हाई-मास्ट स्ट्रीट लाइट खराब होने से अंधेरा गलियारा बना',
      mr: 'हाय-मास्ट पथदिवे बंद पडल्यामुळे अंधाराचे साम्राज्य'
    },
    description: {
      en: 'Eight consecutive streetlights along Riverside Promenade are dark for 3 nights, raising safety concerns for pedestrians and evening joggers.',
      hi: 'रिवरसाइड प्रोमेनेड पर लगातार आठ स्ट्रीटलाइट्स 3 रातों से बंद हैं, जिससे पैदल चलने वालों और शाम के धावकों के लिए सुरक्षा चिंताएं बढ़ गई हैं।',
      mr: 'रिव्हरसाइड प्रोमेनेडवरील सलग आठ पथदिवे ३ रात्रींपासून बंद आहेत, ज्यामुळे पादचारी आणि संध्याकाळच्या धावपटूंच्या सुरक्षेचा प्रश्न निर्माण झाला आहे.'
    },
    address: {
      en: 'Riverside Walkway Promenade, Zone 1',
      hi: 'रिवरसाइड वॉकवे प्रोमेनेड, जोन 1',
      mr: 'रिव्हरसाइड वॉकवे प्रोमेनेड, झोन १'
    },
    summary: {
      en: 'Non-functional LED streetlight luminaires along pedestrian park path.',
      hi: 'पैदल मार्ग पर गैर-कार्यात्मक एलईडी स्ट्रीटलाइट्स।',
      mr: 'पादचारी मार्गावरील बंद पडलेले एलईडी पथदिवे.'
    }
  }
};

// Comprehensive dictionary for civic phrases and common reports
interface PhraseEntry {
  patterns: (string | RegExp)[];
  hi: string;
  mr: string;
}

const civicPhraseDictionary: PhraseEntry[] = [
  // Pipe / Water line leakage variations
  {
    patterns: [
      'water pipe line leakage',
      'water pipeline leakage',
      'water pipe leakage',
      'pipe line leakage',
      'pipeline leakage',
      'water leakage',
      'pipe leak',
      'water pipe line leak',
      'water pipeline leak'
    ],
    hi: 'पानी की पाइपलाइन में लीकेज / रिसाव',
    mr: 'पाण्याच्या पाईपलाईनमध्ये गळती'
  },
  {
    patterns: [
      /A water pipeline has broken near the roadside.*?causing continuous water leakage.*?waterlogging/i,
      /water pipeline has broken near the roadside/i,
      /water pipeline broken near roadside/i
    ],
    hi: 'सड़क किनारे पानी की पाइपलाइन टूट गई है, जिससे लगातार पानी का रिसाव हो रहा है और आसपास के क्षेत्र में जलभराव हो रहा है।',
    mr: 'रस्त्याच्या कडेला पाण्याची पाईपलाईन फुटली असून त्यामुळे सतत पाणी गळती होत आहे आणि लगतच्या परिसरात पाणी साचले आहे.'
  },
  {
    patterns: [
      'Severe water pipeline leakage on the main subway intersection',
      'Severe water pipeline leakage on the main subway intersection, causing road flooding and hazard to pedestrians.',
      /Severe water pipeline leakage/i
    ],
    hi: 'मुख्य सबवे चौराहे पर पानी की पाइपलाइन में भारी रिसाव, जिससे सड़क पर जलभराव और पैदल यात्रियों के लिए खतरा पैदा हो गया है।',
    mr: 'मुख्य सबवे चौकात पाण्याच्या पाईपलाईनमध्ये तीव्र गळती, ज्यामुळे रस्त्यावर पाणी साचले असून पादचाऱ्यांसाठी धोका निर्माण झाला आहे.'
  },
  {
    patterns: [
      'Deep pothole near the school bus stop with exposed metal rebar, risking tire punctures and vehicle accidents.',
      'Deep pothole near the school bus stop',
      /Deep pothole near the school/i
    ],
    hi: 'स्कूल बस स्टॉप के पास गहरा गड्ढा और निकला हुआ सरिया, जिससे टायर पंक्चर और वाहन दुर्घटनाओं का खतरा है।',
    mr: 'शाळेच्या बस थांब्याजवळ खोल खड्डा आणि उघडे लोखंडी गज, ज्यामुळे वाहनांचे नुकसान आणि अपघातांचा धोका आहे.'
  },
  {
    patterns: [
      'Streetlights have been out completely for three blocks, making the sidewalk dark and unsafe at night.',
      'Streetlights have been out completely',
      /Streetlights have been out completely/i
    ],
    hi: 'लगातार तीन ब्लॉकों में स्ट्रीट लाइट पूरी तरह बंद हैं, जिससे रात में फुटपाथ पर अंधेरा और असुरक्षा बढ़ गई है।',
    mr: 'सलग तीन ब्लॉक्समधील पथदिवे पूर्णपणे बंद आहेत, ज्यामुळे रात्रीच्या वेळी पदपथावर अंधार आणि असुरक्षितता निर्माण झाली आहे.'
  },
  {
    patterns: [
      'Overflowing garbage containers spilling waste onto the public sidewalk, creating severe health hazard.',
      'Overflowing garbage containers',
      /Overflowing garbage containers/i
    ],
    hi: 'कचरे के डिब्बे ओवरफ्लो होकर सार्वजनिक फुटपाथ पर कचरा फैला रहे हैं, जिससे गंभीर स्वास्थ्य जोखिम पैदा हो रहा है।',
    mr: 'कचराकुंडी तुडुंब भरून सार्वजनिक पदपथावर कचरा सांडत आहे, ज्यामुळे आरोग्यासाठी गंभीर धोका निर्माण झाला आहे.'
  },
  {
    patterns: ['Reported Civic Issue', 'Reported Issue'],
    hi: 'दर्ज की गई नागरिक समस्या',
    mr: 'नोंदवलेली नागरी समस्या'
  },
  {
    patterns: ['Civic infrastructure report', 'Civic incident report'],
    hi: 'नागरिक अवसंरचना रिपोर्ट',
    mr: 'नागरी पायाभूत सुविधा अहवाल'
  },
  {
    patterns: ['Central Subway Area, Zone 4', 'Central Subway Underpass, District 4', 'Central Subway Area'],
    hi: 'सेंट्रल सबवे क्षेत्र, जोन 4',
    mr: 'मध्यवर्ती सबवे परिसर, झोन ४'
  },
  {
    patterns: ['City Metropolitan Area'],
    hi: 'शहर महानगरीय क्षेत्र',
    mr: 'शहर महानगर क्षेत्र'
  }
];

// In-memory dynamic translation cache for user-created content
const translationCache: Record<string, Record<Language, string>> = {};

// Helper: Translate arbitrary text via smart dictionary and linguistic rules
export function translateCivicText(text: string, language: Language): string {
  if (language === 'en' || !text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Check in-memory cache
  const cacheKey = `${trimmed}___${language}`;
  if (translationCache[cacheKey]?.[language]) {
    return translationCache[cacheKey][language];
  }

  // 2. Check phrase dictionary
  for (const entry of civicPhraseDictionary) {
    for (const pat of entry.patterns) {
      if (typeof pat === 'string') {
        if (trimmed.toLowerCase() === pat.toLowerCase()) {
          return entry[language];
        }
        if (trimmed.toLowerCase().includes(pat.toLowerCase()) && trimmed.length < pat.length + 20) {
          return entry[language];
        }
      } else if (pat instanceof RegExp && pat.test(trimmed)) {
        return entry[language];
      }
    }
  }

  // 3. Fallback semantic sentence transformer for common civic phrases
  const lower = trimmed.toLowerCase();
  
  if (lower.includes('water') && (lower.includes('pipe') || lower.includes('pipeline')) && (lower.includes('leak') || lower.includes('burst') || lower.includes('broken'))) {
    if (trimmed.split(' ').length <= 6) {
      return language === 'hi' ? 'पानी की पाइपलाइन में लीकेज / रिसाव' : 'पाण्याच्या पाईपलाईनमध्ये गळती';
    }
    return language === 'hi'
      ? 'पानी की पाइपलाइन में रिसाव/टूट-फूट के कारण पानी बह रहा है और आसपास के क्षेत्र में समस्या उत्पन्न हो रही है।'
      : 'पाण्याच्या पाईपलाईनमध्ये गळती/फुटल्यामुळे पाणी साचले असून परिसरातील नागरिकांना त्रास होत आहे.';
  }

  if (lower.includes('pothole') || (lower.includes('road') && (lower.includes('damage') || lower.includes('crack') || lower.includes('cave')))) {
    if (trimmed.split(' ').length <= 6) {
      return language === 'hi' ? 'सड़क पर गहरा गड्ढा / क्षति' : 'रस्त्यावरील खड्डा / नुकसान';
    }
    return language === 'hi'
      ? 'सड़क पर गहरे गड्ढे और सतह की क्षति के कारण वाहनों और पैदल यात्रियों के लिए दुर्घटना का खतरा है।'
      : 'रस्त्यावरील खड्ड्यांमुळे आणि डांबराच्या नुकसानामुळे वाहनांचे नुकसान व अपघाताचा धोका निर्माण झाला आहे.';
  }

  if (lower.includes('streetlight') || (lower.includes('light') && lower.includes('dark'))) {
    if (trimmed.split(' ').length <= 6) {
      return language === 'hi' ? 'स्ट्रीट लाइट बंद / खराब' : 'पथदिवे बंद / बिघाड';
    }
    return language === 'hi'
      ? 'स्ट्रीट लाइट बंद होने के कारण रात में अंधेरा रहता है और सुरक्षा चिंताएं बढ़ गई हैं।'
      : 'पथदिवे बंद असल्यामुळे परिसरात अंधार पसरला असून सुरक्षेचा प्रश्न निर्माण झाला आहे.';
  }

  if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste') || lower.includes('dump')) {
    if (trimmed.split(' ').length <= 6) {
      return language === 'hi' ? 'कचरा ओवरफ्लो / अस्वच्छता' : 'कचरा साचणे / अस्वच्छता';
    }
    return language === 'hi'
      ? 'कचरा न उठाए जाने के कारण दुर्गंध और अस्वच्छता फैल रही है, जिससे स्वास्थ्य को खतरा है।'
      : 'कचरा नियमित न उचलल्यामुळे दुर्गंधी पसरली असून आरोग्यास धोका निर्माण झाला आहे.';
  }

  if (lower.includes('wire') || lower.includes('electric') || lower.includes('spark') || lower.includes('transformer')) {
    if (trimmed.split(' ').length <= 6) {
      return language === 'hi' ? 'बिजली का तार / ट्रांसफार्मर खतरा' : 'विजेची तार / ट्रान्सफॉर्मर धोका';
    }
    return language === 'hi'
      ? 'बिजली का खुला तार या ट्रांसफार्मर में खराबी से करंट लगने का गंभीर खतरा है।'
      : 'उघडी विजेची तार किंवा ट्रान्सफॉर्मरमधील बिघाडामुळे विजेचा धक्का बसण्याचा तीव्र धोका आहे.';
  }

  if (lower.includes('flood') || lower.includes('waterlog') || lower.includes('drain')) {
    if (trimmed.split(' ').length <= 6) {
      return language === 'hi' ? 'जलभराव / नाली रुकावट' : 'पाणी साचणे / गटार तुंबणे';
    }
    return language === 'hi'
      ? 'भारी बारिश और जल निकासी अवरुद्ध होने के कारण सड़क पर जलभराव हो गया है।'
      : 'पावसामुळे आणि ड्रेनेज बंद झाल्यामुळे रस्त्यावर मोठ्या प्रमाणावर पाणी साचले आहे.';
  }

  return trimmed;
}

/**
 * Returns translated text for an incident title, description, or other field.
 */
export function getTranslatedIncidentText(
  incidentId: string | undefined,
  field: 'title' | 'description' | 'address' | 'summary',
  originalText: string,
  language: Language
): string {
  if (language === 'en' || !originalText) return originalText;

  // 1. Check if known incident by ID
  if (incidentId && knownIncidentTranslations[incidentId]) {
    const map = knownIncidentTranslations[incidentId];
    if (field === 'title' && map.title && map.title[language]) return map.title[language];
    if (field === 'description' && map.description && map.description[language]) return map.description[language];
    if (field === 'address' && map.address && map.address[language]) return map.address[language];
    if (field === 'summary' && map.summary && map.summary[language]) return map.summary[language];
  }

  // 2. Use civic text translator
  return translateCivicText(originalText, language);
}

/**
 * Returns a clone of the incident with translated title, description, address, AI summary and department.
 */
export function translateIncidentObject(incident: Incident, language: Language): Incident {
  if (language === 'en') return incident;

  // 1. Check if incident has embedded translations object from server/creation
  if (incident.translations && incident.translations[language]) {
    const embedded = incident.translations[language];
    const deptKey = incident.assignedDepartmentName || '';
    const translatedDept = departmentTranslations[deptKey]?.[language] || incident.assignedDepartmentName;

    return {
      ...incident,
      title: embedded?.title || getTranslatedIncidentText(incident.id, 'title', incident.title, language),
      description: embedded?.description || getTranslatedIncidentText(incident.id, 'description', incident.description, language),
      location: {
        ...incident.location,
        address: embedded?.address || getTranslatedIncidentText(incident.id, 'address', incident.location.address, language)
      },
      assignedDepartmentName: translatedDept,
      aiAnalysis: incident.aiAnalysis ? {
        ...incident.aiAnalysis,
        summary: embedded?.summary || getTranslatedIncidentText(incident.id, 'summary', incident.aiAnalysis.summary, language),
        recommendedDepartment: departmentTranslations[incident.aiAnalysis.recommendedDepartment]?.[language] || incident.aiAnalysis.recommendedDepartment
      } : undefined
    };
  }

  // 2. Translate using known dictionary and semantic heuristic engine
  const translatedTitle = getTranslatedIncidentText(incident.id, 'title', incident.title, language);
  const translatedDescription = getTranslatedIncidentText(incident.id, 'description', incident.description, language);
  const translatedAddress = getTranslatedIncidentText(incident.id, 'address', incident.location.address, language);

  let translatedSummary = incident.aiAnalysis?.summary;
  if (translatedSummary) {
    translatedSummary = getTranslatedIncidentText(incident.id, 'summary', translatedSummary, language);
  }

  const deptKey = incident.assignedDepartmentName || '';
  const translatedDept = departmentTranslations[deptKey]?.[language] || incident.assignedDepartmentName;

  return {
    ...incident,
    title: translatedTitle,
    description: translatedDescription,
    location: {
      ...incident.location,
      address: translatedAddress
    },
    assignedDepartmentName: translatedDept,
    aiAnalysis: incident.aiAnalysis ? {
      ...incident.aiAnalysis,
      summary: translatedSummary || incident.aiAnalysis.summary,
      recommendedDepartment: departmentTranslations[incident.aiAnalysis.recommendedDepartment]?.[language] || incident.aiAnalysis.recommendedDepartment
    } : undefined
  };
}
