import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, Language } from '../types';
import { translateIncidentObject, departmentTranslations } from '../lib/incidentTranslator';
import { useAuth } from './AuthContext';

export type { Language };

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  platformName: {
    en: 'Community Crisis Intelligence Platform',
    hi: 'सामुदायिक संकट बुद्धिमत्ता मंच',
    mr: 'समुदाय आपत्कालीन बुद्धिमत्ता प्लॅटफॉर्म'
  },
  tagline: {
    en: 'Turn Community Problems Into Action',
    hi: 'सामुदायिक समस्याओं को कार्रवाई में बदलें',
    mr: 'नागरी समस्यांचे त्वरित निवारणात रूपांतर करा'
  },
  home: {
    en: 'Home',
    hi: 'होम',
    mr: 'मुख्यपृष्ठ'
  },
  citizen: {
    en: 'Citizen',
    hi: 'नागरिक',
    mr: 'नागरिक'
  },
  authority: {
    en: 'Authority',
    hi: 'प्राधिकरण',
    mr: 'प्रशासन'
  },
  admin: {
    en: 'Admin',
    hi: 'प्रशासक',
    mr: 'प्रशासक'
  },
  civicAI: {
    en: 'CivicAI',
    hi: 'सिविक-एआई',
    mr: 'सिव्हिक AI'
  },
  askCivicAI: {
    en: 'Ask CivicAI Assistant',
    hi: 'सिविक-एआई सहायक से पूछें',
    mr: 'सिव्हिक AI सहाय्यकास विचारा'
  },
  reportAnIssue: {
    en: 'Report an Issue',
    hi: 'समस्या की रिपोर्ट करें',
    mr: 'समस्येची नोंद करा'
  },
  citizenAccount: {
    en: 'Citizen Account',
    hi: 'नागरिक खाता',
    mr: 'नागरिक खाते'
  },
  authorityOfficer: {
    en: 'Authority Officer',
    hi: 'प्राधिकरण अधिकारी',
    mr: 'प्रशासन अधिकारी'
  },
  systemAdmin: {
    en: 'System Admin',
    hi: 'सिस्टम प्रशासक',
    mr: 'सिस्टम प्रशासक'
  },
  switchRole: {
    en: 'Switch Role / Switch Account',
    hi: 'भूमिका / खाता बदलें',
    mr: 'भूमिका / खाते बदला'
  },
  signOut: {
    en: 'Sign Out',
    hi: 'साइन आउट',
    mr: 'बाहेर पडा'
  },

  // Citizen Dashboard
  citizenPortal: {
    en: 'Citizen Portal',
    hi: 'नागरिक पोर्टल',
    mr: 'नागरिक पोर्टल'
  },
  welcomeBack: {
    en: 'Welcome Back',
    hi: 'स्वागत है',
    mr: 'स्वागत आहे'
  },
  trackReportsSub: {
    en: 'Track your civic reports, monitor resolution timelines, and keep your community resilient.',
    hi: 'अपनी नागरिक रिपोर्टों को ट्रैक करें, समाधान समय-सीमा की निगरानी करें और अपने समुदाय को सशक्त बनाएं।',
    mr: 'तुमच्या नागरी तक्रारींचा मागोवा घ्या, निवारण कालावधी तपासा आणि समुदायाला सक्षम बनवा.'
  },
  myReports: {
    en: 'My Reports',
    hi: 'मेरी रिपोर्ट',
    mr: 'माझे अहवाल'
  },
  totalSubmitted: {
    en: 'Total submitted to platform',
    hi: 'प्लेटफ़ॉर्म पर कुल सबमिट की गई',
    mr: 'प्लॅटफॉर्मवर नोंदवलेले एकूण अहवाल'
  },
  activeTriage: {
    en: 'Active Triage',
    hi: 'सक्रिय जांच व कार्रवाई',
    mr: 'सक्रिय तपासणी व कृती'
  },
  inProgressAssigned: {
    en: 'In progress & assigned',
    hi: 'प्रगति पर और आवंटित',
    mr: 'प्रगतीपथावर आणि नियुक्त'
  },
  resolved: {
    en: 'Resolved',
    hi: 'हल किया गया',
    mr: 'निवारण झाले'
  },
  verifiedFixed: {
    en: 'Verified fixed by officers',
    hi: 'अधिकारियों द्वारा सत्यापित व ठीक',
    mr: 'अधिकाऱ्यांनी पडताळणी करून सोडवले'
  },
  pendingReview: {
    en: 'Pending Review',
    hi: 'समीक्षा लंबित',
    mr: 'पडताळणी प्रलंबित'
  },
  queuedForAI: {
    en: 'Queued for AI department routing',
    hi: 'एआई विभाग रूटिंग हेतु कतार में',
    mr: 'AI विभाग वाटपासाठी रांगेत'
  },
  searchReportsPlaceholder: {
    en: 'Search reports by ID, keyword or address...',
    hi: 'आईडी, कीवर्ड या पते से रिपोर्ट खोजें...',
    mr: 'आयडी, कीवर्ड किंवा पत्त्यावरून शोधा...'
  },
  allCategories: {
    en: 'All Categories',
    hi: 'सभी श्रेणियां',
    mr: 'सर्व वर्ग'
  },
  allStatuses: {
    en: 'All Statuses',
    hi: 'सभी स्थितियां',
    mr: 'सर्व स्थिती'
  },
  submittedReportsHeading: {
    en: 'Submitted Incident Reports',
    hi: 'दर्ज की गई घटना रिपोर्ट',
    mr: 'नोंदवलेले घटना अहवाल'
  },
  noReportsMatch: {
    en: 'No reports match your search filter',
    hi: 'आपके खोज फ़िल्टर से कोई रिपोर्ट मेल नहीं खाती',
    mr: 'कोणताही अहवाल सापडला नाही'
  },
  adjustFilters: {
    en: 'Try adjusting your category or status filters.',
    hi: 'अपनी श्रेणी या स्थिति फ़िल्टर को समायोजित करने का प्रयास करें।',
    mr: 'कृपया श्रेणी किंवा स्थिती फिल्टर बदला.'
  },
  viewDetailsAndProgress: {
    en: 'View Details & Progress',
    hi: 'विवरण व प्रगति देखें',
    mr: 'तपशील व प्रगती पहा'
  },
  priority: {
    en: 'Priority',
    hi: 'प्राथमिकता',
    mr: 'प्राधान्य'
  },
  issuePhotoVerified: {
    en: 'Issue Photo Verified',
    hi: 'समस्या फोटो सत्यापित',
    mr: 'समस्या फोटो पडताळणीकृत'
  },

  // Categories
  cat_Flood: {
    en: 'Flood',
    hi: 'बाढ़ / जलभराव',
    mr: 'पूर / पाणी साचणे'
  },
  cat_RoadDamage: {
    en: 'Road Damage',
    hi: 'सड़क क्षति / गड्ढे',
    mr: 'रस्त्यावरील खड्डे'
  },
  cat_Garbage: {
    en: 'Garbage',
    hi: 'कचरा / स्वच्छता',
    mr: 'कचरा / स्वच्छता'
  },
  cat_WaterLeakage: {
    en: 'Water Leakage',
    hi: 'पानी का रिसाव / पाइपलाइन',
    mr: 'पाण्याची गळती'
  },
  cat_Electricity: {
    en: 'Electricity',
    hi: 'बिजली / तार खतरा',
    mr: 'वीज / धोकादायक तारा'
  },
  cat_Streetlight: {
    en: 'Streetlight',
    hi: 'स्ट्रीट लाइट',
    mr: 'पथदिवे'
  },
  cat_TrafficAccident: {
    en: 'Traffic Accident',
    hi: 'यातायात दुर्घटना',
    mr: 'वाहतूक अपघात'
  },
  cat_Drainage: {
    en: 'Drainage',
    hi: 'नाली / सीवरेज',
    mr: 'सांडपाणी निचरा'
  },
  cat_Pollution: {
    en: 'Pollution',
    hi: 'प्रदूषण',
    mr: 'प्रदूषण'
  },
  cat_PublicSafety: {
    en: 'Public Safety',
    hi: 'सार्वजनिक सुरक्षा',
    mr: 'सार्वजनिक सुरक्षा'
  },

  // Statuses
  status_SUBMITTED: {
    en: 'Submitted',
    hi: 'दर्ज किया गया',
    mr: 'नोंदवले'
  },
  status_UNDER_REVIEW: {
    en: 'Under Review',
    hi: 'समीक्षाधीन',
    mr: 'तपासणी सुरू'
  },
  status_ASSIGNED: {
    en: 'Assigned',
    hi: 'आवंटित',
    mr: 'नियुक्त केले'
  },
  status_IN_PROGRESS: {
    en: 'In Progress',
    hi: 'प्रगति पर',
    mr: 'प्रगतीपथावर'
  },
  status_ON_HOLD: {
    en: 'On Hold',
    hi: 'रोका गया',
    mr: 'थांबवले'
  },
  status_RESOLVED: {
    en: 'Resolved',
    hi: 'हल हो चुका',
    mr: 'निवारण झाले'
  },
  status_REJECTED: {
    en: 'Rejected',
    hi: 'अस्वीकृत',
    mr: 'नाकारले'
  },

  // Severities
  sev_LOW: {
    en: 'Low Urgency',
    hi: 'कम तात्कालिकता',
    mr: 'कमी निकड'
  },
  sev_MEDIUM: {
    en: 'Medium Urgency',
    hi: 'मध्यम तात्कालिकता',
    mr: 'मध्यम निकड'
  },
  sev_HIGH: {
    en: 'High Urgency',
    hi: 'उच्च तात्कालिकता',
    mr: 'उच्च निकड'
  },
  sev_CRITICAL: {
    en: 'Critical Urgency',
    hi: 'अत्यंत गंभीर',
    mr: 'अति-गंभीर'
  },

  // Report Wizard Steps & Fields
  reportModalTitle: {
    en: 'Report Civic Emergency or Issue',
    hi: 'नागरिक समस्या या आपातकाल की रिपोर्ट करें',
    mr: 'नागरी समस्या किंवा आणीबाणी नोंदवा'
  },
  step1Title: {
    en: 'Issue Information',
    hi: 'समस्या की जानकारी',
    mr: 'समस्येची माहिती'
  },
  step1Desc: {
    en: 'Describe what happened and select category',
    hi: 'क्या हुआ बताएं और श्रेणी चुनें',
    mr: 'काय घडले ते सांगा आणि श्रेणी निवडा'
  },
  step2Title: {
    en: 'Location Details',
    hi: 'स्थान का विवरण',
    mr: 'स्थानाचा तपशील'
  },
  step2Desc: {
    en: 'Pinpoint address and GPS coordinates',
    hi: 'पता और जीपीएस निर्देशांक निर्धारित करें',
    mr: 'पत्ता आणि GPS स्थान निश्चित करा'
  },
  step3Title: {
    en: 'Media & Evidence',
    hi: 'फोटो और साक्ष्य',
    mr: 'फोटो आणि पुरावे'
  },
  step3Desc: {
    en: 'Attach photos, audio recording or documents',
    hi: 'फोटो, ऑडियो रिकॉर्डिंग या दस्तावेज़ संलग्न करें',
    mr: 'फोटो, ऑडिओ किंवा दस्तऐवज जोडा'
  },
  step4Title: {
    en: 'AI Triage & Review',
    hi: 'एआई विश्लेषण व समीक्षा',
    mr: 'AI विश्लेषण आणि पुनरावलोकन'
  },
  step4Desc: {
    en: 'Verify AI department routing and severity score',
    hi: 'एआई विभाग रूटिंग और गंभीरता स्कोर सत्यापित करें',
    mr: 'AI विभाग वाटप आणि तीव्रता तपासा'
  },
  step5Title: {
    en: 'Report Confirmed',
    hi: 'रिपोर्ट दर्ज हो गई',
    mr: 'अहवाल यशस्वीरीत्या नोंदवला'
  },
  issueTitleLabel: {
    en: 'Issue Title',
    hi: 'समस्या का शीर्षक',
    mr: 'समस्येचे शीर्षक'
  },
  issueTitlePlaceholder: {
    en: 'e.g., Massive Pothole Near School Gate',
    hi: 'उदा., स्कूल गेट के पास बड़ा गड्ढा',
    mr: 'उदा., शाळेच्या गेटजवळ मोठा खड्डा'
  },
  categoryLabel: {
    en: 'Category',
    hi: 'श्रेणी',
    mr: 'श्रेणी'
  },
  descriptionLabel: {
    en: 'Detailed Description',
    hi: 'विस्तृत विवरण',
    mr: 'सविस्तर माहिती'
  },
  descriptionPlaceholder: {
    en: 'Provide details on what you observed, estimated size, safety hazards...',
    hi: 'आपने क्या देखा, अनुमानित आकार, सुरक्षा खतरे आदि का विवरण दें...',
    mr: 'तुम्ही काय पाहिले, अंदाजे आकार, धोके इत्यादी माहिती द्या...'
  },
  contactInfoLabel: {
    en: 'Contact Information (Optional for Updates)',
    hi: 'संपर्क जानकारी (अपडेट हेतु वैकल्पिक)',
    mr: 'संपर्क माहिती (अपडेटसाठी पर्यायी)'
  },
  emailLabel: {
    en: 'Email Address',
    hi: 'ईमेल पता',
    mr: 'ईमेल पत्ता'
  },
  phoneLabel: {
    en: 'Phone Number',
    hi: 'फ़ोन नंबर',
    mr: 'फोन नंबर'
  },
  nextButton: {
    en: 'Next',
    hi: 'आगे बढ़ें',
    mr: 'पुढे जा'
  },
  prevButton: {
    en: 'Back',
    hi: 'पीछे जाएं',
    mr: 'मागे जा'
  },
  useCurrentGPS: {
    en: 'Use Current GPS',
    hi: 'वर्तमान जीपीएस का उपयोग करें',
    mr: 'सध्याचे GPS स्थान वापरा'
  },
  addressLabel: {
    en: 'Street Address / Landmark',
    hi: 'सड़क का पता / लैंडमार्क',
    mr: 'रस्त्याचा पत्ता / लँडमार्क'
  },
  coordinatesLabel: {
    en: 'Coordinates',
    hi: 'निर्देशांक',
    mr: 'अक्षांश व रेखांश'
  },
  uploadPhotoEvidence: {
    en: 'Upload Photo Evidence',
    hi: 'फोटो साक्ष्य अपलोड करें',
    mr: 'फोटो पुरावा अपलोड करा'
  },
  recordVoiceDescription: {
    en: 'Record Voice Description',
    hi: 'आवाज़ में बताएं (Voice Record)',
    mr: 'आवाजात माहिती सांगा'
  },
  recordingActive: {
    en: 'Recording... Speak now',
    hi: 'रिकॉर्डिंग चालू है... बोलें',
    mr: 'रेकॉर्डिंग सुरू आहे... बोला'
  },
  stopRecording: {
    en: 'Stop Recording',
    hi: 'रिकॉर्डिंग रोकें',
    mr: 'रेकॉर्डिंग थांबवा'
  },
  attachSamplePhoto: {
    en: 'Attach Sample Photo',
    hi: 'सैंपल फोटो जोड़ें',
    mr: 'नमुना फोटो जोडा'
  },
  runAITriage: {
    en: 'Run AI Triage & Analysis',
    hi: 'एआई विश्लेषण चलाएं',
    mr: 'AI विश्लेषण सुरू करा'
  },
  analyzingReport: {
    en: 'AI Analyzing Incident...',
    hi: 'एआई रिपोर्ट का विश्लेषण कर रहा है...',
    mr: 'AI अहवालाचे विश्लेषण करत आहे...'
  },
  triageSummary: {
    en: 'AI Triage & Prioritization Summary',
    hi: 'एआई प्राथमिकता व रूटिंग सारांश',
    mr: 'AI प्राधान्य व वाटप सारांश'
  },
  recommendedDepartment: {
    en: 'Recommended Department',
    hi: 'अनुशंसित विभाग',
    mr: 'शिफारस केलेला विभाग'
  },
  potentialImpact: {
    en: 'Potential Community Impact',
    hi: 'संभावित सामुदायिक प्रभाव',
    mr: 'संभाव्य नागरी परिणाम'
  },
  immediateActions: {
    en: 'Immediate Action Steps',
    hi: 'तत्काल आवश्यक कदम',
    mr: 'तातडीची पावले'
  },
  submitOfficialReport: {
    en: 'Submit Official Report',
    hi: 'आधिकारिक रिपोर्ट सबमिट करें',
    mr: 'अहवाल सादर करा'
  },
  reportSubmittedSuccess: {
    en: 'Report Successfully Registered!',
    hi: 'रिपोर्ट सफलतापूर्वक दर्ज की गई!',
    mr: 'तक्रार यशस्वीरीत्या नोंदवली गेली!'
  },
  incidentNumber: {
    en: 'Incident Number',
    hi: 'घटना संख्या',
    mr: 'घटना क्रमांक'
  },
  downloadReceipt: {
    en: 'Download PDF Receipt',
    hi: 'पीडीएफ रसीद डाउनलोड करें',
    mr: 'PDF पावती डाउनलोड करा'
  },
  estimatedSLA: {
    en: 'Estimated Response SLA',
    hi: 'अनुमानित प्रतिक्रिया समय (SLA)',
    mr: 'अंदाजे निवारण वेळ (SLA)'
  },
  trackStatus: {
    en: 'Track Incident Status',
    hi: 'स्थिति ट्रैक करें',
    mr: 'स्थिती तपासा'
  },
  doneClose: {
    en: 'Done & Return to Dashboard',
    hi: 'पूर्ण व डैशबोर्ड पर लौटें',
    mr: 'पूर्ण व डॅशबोर्डवर परत जा'
  },
  step1: {
    en: 'Issue Info',
    hi: 'समस्या की जानकारी',
    mr: 'समस्येची माहिती'
  },
  step2: {
    en: 'Location',
    hi: 'स्थान',
    mr: 'स्थान'
  },
  step3: {
    en: 'Media',
    hi: 'फोटो व मीडिया',
    mr: 'फोटो व मीडिया'
  },
  step4: {
    en: 'AI Triage',
    hi: 'एआई विश्लेषण',
    mr: 'AI विश्लेषण'
  },
  currentAddressAndCoordinates: {
    en: 'Location & Address Details',
    hi: 'स्थान एवं पते का विवरण',
    mr: 'स्थान आणि पत्त्याचा तपशील'
  },
  manualAddressAdjustment: {
    en: 'Enter Custom Address / Location',
    hi: 'कस्टम पता / स्थान दर्ज करें',
    mr: 'स्वतःचा पत्ता / स्थान प्रविष्ट करा'
  },
  detectGPS: {
    en: 'Auto-detect GPS (Optional)',
    hi: 'जीपीएस ऑटो-डिटेक्ट (वैकल्पिक)',
    mr: 'GPS ऑटो-डिटेक्ट (पर्यायी)'
  },
  customLocation: {
    en: 'Provide Your Own Location (No GPS Required)',
    hi: 'अपना स्वयं का स्थान दर्ज करें (जीपीएस की आवश्यकता नहीं)',
    mr: 'स्वतःचे स्थान प्रविष्ट करा (GPS ची गरज नाही)'
  },
  manualLocationDesc: {
    en: 'Type your exact address, landmark, or locality. You do not need GPS turned on.',
    hi: 'अपना सटीक पता, लैंडमार्क या क्षेत्र टाइप करें। जीपीएस चालू करने की आवश्यकता नहीं है।',
    mr: 'तुमचा अचूक पत्ता, लँडमार्क किंवा परिसर टाइप करा. GPS सुरू ठेवण्याची आवश्यकता नाही.'
  },
  popularAreas: {
    en: 'Popular Localities / Wards',
    hi: 'प्रमुख क्षेत्र / वार्ड',
    mr: 'प्रमुख परिसर / प्रभाग'
  },
  streetAddressLabel: {
    en: 'Street / Building / Road Name',
    hi: 'सड़क / भवन / मार्ग का नाम',
    mr: 'रस्ता / इमारत / मार्गाचे नाव'
  },
  landmarkLabel: {
    en: 'Nearby Landmark (e.g. Near Metro Station, Opp. Garden)',
    hi: 'नजदीकी लैंडमार्क (उदा. मेट्रो स्टेशन के पास)',
    mr: 'जवळचा लँडमार्क (उदा. मेट्रो स्टेशनजवळ, बागेसमोर)'
  },
  areaZoneLabel: {
    en: 'Area / Zone / Sector',
    hi: 'क्षेत्र / ज़ोन / सेक्टर',
    mr: 'परिसर / झोन / सेक्टर'
  },
  nextMedia: {
    en: 'Next: Media Evidence',
    hi: 'आगे: फोटो व मीडिया',
    mr: 'पुढे: फोटो व मीडिया'
  },
  nextLocation: {
    en: 'Next: Location',
    hi: 'आगे: स्थान',
    mr: 'पुढे: स्थान'
  },
  back: {
    en: 'Back',
    hi: 'पीछे जाएं',
    mr: 'मागे जा'
  },

  // Landing Page
  heroBadge: {
    en: 'Next-Generation Civic Intelligence & Triage System',
    hi: 'अगली पीढ़ी का नागरिक संकट बुद्धिमत्ता मंच',
    mr: 'पुढील पिढीची नागरी संकट बुद्धिमत्ता प्रणाली'
  },
  heroTitle1: {
    en: 'Turn Community Problems Into',
    hi: 'सामुदायिक समस्याओं को बदलें',
    mr: 'नागरी समस्यांचे करा'
  },
  heroTitle2: {
    en: 'Action.',
    hi: 'त्वरित कार्रवाई में।',
    mr: 'त्वरित निवारण.'
  },
  heroSub: {
    en: 'AI-powered civic reporting that helps citizens report problems and enables authorities to respond faster, smarter, and more effectively.',
    hi: 'एआई-संचालित नागरिक रिपोर्टिंग जो नागरिकों को समस्याओं की रिपोर्ट करने में मदद करती है और अधिकारियों को तेजी से और स्मार्ट तरीके से कार्रवाई करने में सक्षम बनाती है।',
    mr: 'AI-आधारित नागरी तक्रार प्रणाली जी नागरिकांना समस्या नोंदवण्यास मदत करते आणि प्रशासनाला जलद, अचूक कारवाई करण्यास सक्षम करते.'
  },
  explorePlatform: {
    en: 'Explore Platform',
    hi: 'डैशबोर्ड देखें',
    mr: 'प्लॅटफॉर्म पहा'
  },
  totalReportsSubmitted: {
    en: 'Total Reports Submitted',
    hi: 'कुल दर्ज रिपोर्ट',
    mr: 'एकूण नोंदवलेले अहवाल'
  },
  activeHighUrgency: {
    en: 'Active High Urgency Triage',
    hi: 'सक्रिय उच्च तात्कालिकता',
    mr: 'सक्रिय उच्च निकडीचे अहवाल'
  },
  verifiedResolved: {
    en: 'Verified Resolved',
    hi: 'सत्यापित समाधान',
    mr: 'निवारण झालेले'
  },
  avgResponseTime: {
    en: 'Avg Initial Response',
    hi: 'औसत प्रारंभिक प्रतिक्रिया',
    mr: 'सरासरी प्रतिसाद वेळ'
  },
  howItWorks: {
    en: 'How The Platform Works',
    hi: 'यह कैसे काम करता है',
    mr: 'हे कसे कार्य करते'
  },
  processOverview: {
    en: 'Process Overview',
    hi: 'प्रक्रिया अवलोकन',
    mr: 'प्रक्रिया विहंगावलोकन'
  },
  step1Hero: {
    en: '1. Report',
    hi: '1. रिपोर्ट करें',
    mr: '1. नोंदवा'
  },
  step1HeroDesc: {
    en: 'Citizens snap photos, record voice notes, or provide their exact address and landmark.',
    hi: 'नागरिक फोटो खींचते हैं, वॉयस नोट रिकॉर्ड करते हैं या अपना सटीक पता और लैंडमार्क दर्ज करते हैं।',
    mr: 'नागरिक फोटो काढतात, व्हॉइस नोट रेकॉर्ड करतात किंवा अचूक पत्ता व लँडमार्क नोंदवतात.'
  },
  step2Hero: {
    en: '2. AI Triage',
    hi: '2. एआई विश्लेषण',
    mr: '2. AI विश्लेषण'
  },
  step2HeroDesc: {
    en: 'AI models analyze hazard severity, verify evidence, and calculate priority scores.',
    hi: 'एआई मॉडल खतरे की गंभीरता का विश्लेषण करते हैं, साक्ष्य सत्यापित करते हैं और प्राथमिकता स्कोर निकालते हैं।',
    mr: 'AI मॉडेल धोक्याची तीव्रता तपासतात, पुरावे पडताळतात आणि प्राधान्य गुण मोजतात.'
  },
  step3Hero: {
    en: '3. Resolve',
    hi: '3. समाधान व कार्रवाई',
    mr: '3. निवारण व कृती'
  },
  step3HeroDesc: {
    en: 'Authorities track status, dispatch crews, and provide verified resolution updates to citizens.',
    hi: 'अधिकारी स्थिति ट्रैक करते हैं, टीमों को भेजते हैं और नागरिकों को सत्यापित समाधान अपडेट प्रदान करते हैं।',
    mr: 'अधिकारी स्थितीचा मागोवा घेतात, पथके पाठवतात आणि नागरिकांना खात्रीशीर निवारण अपडेट देतात.'
  },
  liveMapHeading: {
    en: 'Live Civic Incidents Map',
    hi: 'लाइव नागरिक घटना मानचित्र',
    mr: 'थेट नागरी घटना नकाशा'
  },
  liveMapSub: {
    en: 'Real-time spatial visualization of community reports, hazard zones, and department dispatches.',
    hi: 'सामुदायिक रिपोर्टों, खतरा क्षेत्रों और विभाग कार्रवाई का वास्तविक समय में नक्शा।',
    mr: 'नागरी अहवाल, धोक्याचे क्षेत्र आणि प्रशासकीय कारवाईचा रिअल-टाइम नकाशा.'
  },

  // Authority & Admin
  authorityCenter: {
    en: 'Authority Command Center',
    hi: 'प्राधिकरण कमान केंद्र',
    mr: 'प्रशासन कमांड सेंटर'
  },
  adminPortal: {
    en: 'Admin Portal',
    hi: 'प्रशासकीय पोर्टल',
    mr: 'प्रशासक पोर्टल'
  },
  activeReports: {
    en: 'Active Reports',
    hi: 'सक्रिय रिपोर्ट',
    mr: 'सक्रिय अहवाल'
  },
  resolvedReports: {
    en: 'Resolved Issues',
    hi: 'हल की गई समस्याएं',
    mr: 'सोडवलेल्या समस्या'
  },
  priorityScore: {
    en: 'AI Priority Score',
    hi: 'एआई प्राथमिकता स्कोर',
    mr: 'AI प्राधान्य स्कोर'
  },
  civicAssistant: {
    en: 'CivicAI Assistant',
    hi: 'सिविक-एआई सहायक',
    mr: 'सिव्हिक AI सहाय्यक'
  },
  severityLow: {
    en: 'Low Urgency',
    hi: 'कम तात्कालिकता',
    mr: 'कमी निकड'
  },
  severityMedium: {
    en: 'Medium Urgency',
    hi: 'मध्यम तात्कालिकता',
    mr: 'मध्यम निकड'
  },
  severityHigh: {
    en: 'High Urgency',
    hi: 'उच्च तात्कालिकता',
    mr: 'उच्च निकड'
  },
  severityCritical: {
    en: 'Critical Urgency',
    hi: 'अत्यंत गंभीर',
    mr: 'अति-गंभीर'
  },

  // Footer & Navigation Translations
  footerDesc: {
    en: 'AI-powered civic issue reporting, crisis intelligence, and authority response system. Empowering citizens and enabling municipality command centers.',
    hi: 'एआई-संचालित नागरिक समस्या रिपोर्टिंग, संकट बुद्धिमत्ता और प्राधिकरण प्रतिक्रिया प्रणाली। नागरिकों को सशक्त बनाना और नगर पालिका नियंत्रण केंद्रों को सक्षम करना।',
    mr: 'AI-आधारित नागरी समस्या निवारण, आपत्कालीन बुद्धिमत्ता आणि प्रशासकीय प्रतिसाद प्रणाली. नागरिकांचे सक्षमीकरण आणि महानगरपालिका नियंत्रण केंद्रांना साहाय्य.'
  },
  encryptedData: {
    en: 'AES-256 Encrypted Data',
    hi: 'AES-256 एन्क्रिप्टेड डेटा',
    mr: 'AES-256 एन्क्रिप्टेड डेटा'
  },
  officialMunicipalIntegration: {
    en: 'Official Municipal Integration',
    hi: 'आधिकारिक नगरपालिका एकीकरण',
    mr: 'अधिकृत महानगरपालिका समन्वय'
  },
  platformNavigation: {
    en: 'Platform Navigation',
    hi: 'प्लेटफॉर्म नेविगेशन',
    mr: 'प्लॅटफॉर्म नेव्हिगेशन'
  },
  interactiveMap: {
    en: 'Interactive Incident Map',
    hi: 'इंटरएक्टिव घटना मानचित्र',
    mr: 'परस्परसंवादी घटना नकाशा'
  },
  civicKnowledgeBase: {
    en: 'Civic Knowledge Base',
    hi: 'नागरिक ज्ञान केंद्र',
    mr: 'नागरी माहिती व ज्ञान केंद्र'
  },
  emergencyNotice: {
    en: 'Emergency Notice',
    hi: 'आपातकालीन सूचना',
    mr: 'तातडीची सूचना'
  },
  emergencyNoticeSub: {
    en: 'If you are in immediate life-threatening physical danger, contact emergency services directly at',
    hi: 'यदि आप तत्काल जानलेवा शारीरिक खतरे में हैं, तो सीधे आपातकालीन सेवाओं से संपर्क करें:',
    mr: 'आपण तातडीच्या जीवघेण्या धोक्यात असल्यास, थेट आपत्कालीन सेवांशी संपर्क साधा:'
  },
  triageEngineActive: {
    en: '24/7 AI Incident Triage Engine Active',
    hi: '24/7 एआई घटना विश्लेषण इंजन सक्रिय',
    mr: '२४/७ AI घटना विश्लेषण प्रणाली सक्रिय'
  },
  builtForCivicResilience: {
    en: 'Built for civic resilience.',
    hi: 'नागरिक सुरक्षा और लचीलेपन के लिए निर्मित।',
    mr: 'नागरी सक्षमता आणि सुरक्षिततेसाठी विकसित.'
  },
  designedWith: {
    en: 'Designed with',
    hi: 'निर्मित',
    mr: 'विकसित'
  },
  forCommunityWelfare: {
    en: 'for community welfare.',
    hi: 'सामुदायिक कल्याण के लिए।',
    mr: 'नागरी कल्याणासाठी.'
  },

  // Landing Page Extended Bulletins & Features
  emergencyResponseBulletins: {
    en: 'Emergency Response & Community Bulletins',
    hi: 'आपातकालीन प्रतिक्रिया और सामुदायिक बुलेटिन',
    mr: 'आपत्कालीन प्रतिसाद आणि नागरी सूचना'
  },
  activeCivicHelplines: {
    en: 'Active Civic Helplines & Public Alerts',
    hi: 'सक्रिय नागरिक हेल्पलाइन और सार्वजनिक अलर्ट',
    mr: 'सक्रिय नागरी हेल्पलाइन आणि सार्वजनिक सतर्कता'
  },
  disasterRelief: {
    en: 'Disaster Relief',
    hi: 'आपदा राहत',
    mr: 'आपत्ती निवारण'
  },
  floodFireRescue: {
    en: '24/7 Flood & Fire Rescue',
    hi: '24/7 बाढ़ एवं अग्निशमन बचाव',
    mr: '२४/७ पूर व अग्निशामक बचाव'
  },
  municipalHelpline: {
    en: 'Municipal Helpline',
    hi: 'नगर निगम हेल्पलाइन',
    mr: 'महानगरपालिका हेल्पलाइन'
  },
  roadsWaterSanitation: {
    en: 'Roads, Water & Sanitation',
    hi: 'सड़क, पानी एवं स्वच्छता',
    mr: 'रस्ते, पाणी आणि स्वच्छता'
  },
  powerGridEmergency: {
    en: 'Power Grid Emergency',
    hi: 'विद्युत ग्रिड आपातकाल',
    mr: 'विद्युत ग्रिड आपत्कालीन'
  },
  highVoltageHazardUnit: {
    en: 'High Voltage Hazard Unit',
    hi: 'हाई वोल्टेज खतरा इकाई',
    mr: 'हाय व्होल्टेज आपत्ती कक्ष'
  },
  citizenGrievanceCell: {
    en: 'Citizen Grievance Cell',
    hi: 'नागरिक शिकायत प्रकोष्ठ',
    mr: 'नागरी तक्रार निवारण कक्ष'
  },
  officialEscalations: {
    en: 'Official Escalations',
    hi: 'आधिकारिक निवारण',
    mr: 'अधिकृत तक्रार निवारण'
  },
  publicCivicBulletins: {
    en: 'Public Civic Bulletins',
    hi: 'सार्वजनिक नागरिक बुलेटिन',
    mr: 'सार्वजनिक नागरी सूचना'
  },
  activeAdvisory: {
    en: 'Active Advisory',
    hi: 'सक्रिय परामर्श',
    mr: 'सक्रिय सूचना'
  },
  advisory1Title: {
    en: 'Monsoon Storm Drain Inspections',
    hi: 'मानसून स्टॉर्म ड्रेन निरीक्षण',
    mr: 'पावसाळी गटार तपासणी मोहीम'
  },
  advisory1Desc: {
    en: 'Disaster Management crews are conducting preventive drain clearing along Sector 4 and MG Road. Drive carefully.',
    hi: 'आपदा प्रबंधन दल सेक्टर 4 और एमजी रोड पर नालों की सफाई कर रहे हैं। कृपया सावधानी से वाहन चलाएं।',
    mr: 'आपत्ती व्यवस्थापन पथके सेक्टर ४ आणि एमजी रोडवर नालेसफाई करत आहेत. कृपया काळजीपूर्वक वाहन चालवा.'
  },
  advisory1Meta: {
    en: 'Issued 2 hours ago • Public Works Dept',
    hi: '2 घंटे पहले जारी • लोक निर्माण विभाग',
    mr: '२ तासांपूर्वी जारी • सार्वजनिक बांधकाम विभाग'
  },
  serviceRestored: {
    en: 'Service Restored',
    hi: 'सेवा बहाल',
    mr: 'सेवा पूर्ववत'
  },
  advisory2Title: {
    en: 'Water Main Pipeline Repaired',
    hi: 'मुख्य पानी की पाइपलाइन की मरम्मत पूर्ण',
    mr: 'मुख्य पाण्याची पाईपलाईन दुरुस्त'
  },
  advisory2Desc: {
    en: 'Pressure pipeline maintenance at Central Avenue completed. Normal water supply resumed.',
    hi: 'सेंट्रल एवेन्यू में पाइपलाइन का रखरखाव पूरा हो गया है। सामान्य जल आपूर्ति फिर से शुरू कर दी गई है।',
    mr: 'सेंट्रल अव्हेन्यू येथील पाईपलाईनची दुरुस्ती पूर्ण झाली आहे. सुरळीत पाणीपुरवठा पुन्हा सुरू झाला आहे.'
  },
  advisory2Meta: {
    en: 'Completed Today • Water Supply Dept',
    hi: 'आज पूर्ण हुआ • जल आपूर्ति विभाग',
    mr: 'आज पूर्ण झाले • पाणी पुरवठा विभाग'
  },
  recentVerifiedResolutions: {
    en: 'Recent Verified Resolutions',
    hi: 'हाल ही में सत्यापित समाधान',
    mr: 'नुकतेच पडताळलेले निवारण'
  },
  platformFeatures: {
    en: 'Platform Features',
    hi: 'मंच की विशेषताएं',
    mr: 'प्लॅटफॉर्म वैशिष्ट्ये'
  },
  engineeredForCivicReliability: {
    en: 'Engineered for Civic Reliability',
    hi: 'नागरिक विश्वसनीयता के लिए निर्मित',
    mr: 'नागरी विश्वासासाठी विकसित'
  },
  multimodalReporting: {
    en: 'Multimodal Reporting',
    hi: 'मल्टीमॉडल रिपोर्टिंग',
    mr: 'मल्टीमॉडल रिपोर्टिंग'
  },
  multimodalReportingDesc: {
    en: 'Accepts images, videos, PDF municipal notices, and audio voice messages with native speech-to-text.',
    hi: 'छवियां, वीडियो, पीडीएफ नोटिस और आवाज संदेश (स्पीच-टू-टेक्स्ट) स्वीकार करता है।',
    mr: 'फोटो, व्हिडिओ, पीडीएफ सूचना आणि व्हॉइस मेसेज स्वीकारतो.'
  },
  ocrAiClassification: {
    en: 'OCR & AI Classification',
    hi: 'ओसीआर एवं एआई वर्गीकरण',
    mr: 'OCR आणि AI वर्गीकरण'
  },
  ocrAiClassificationDesc: {
    en: 'Automatically extracts text from uploaded documents and classifies civic issue into correct municipal categories.',
    hi: 'दस्तावेजों से स्वचालित रूप से पाठ निकालता है और समस्या को सही नगरपालिका श्रेणी में वर्गीकृत करता है।',
    mr: 'कागदपत्रांमधून मजकूर काढून समस्या योग्य महानगरपालिका वर्गात वर्गीकृत करतो.'
  },
  multilingualCivicAI: {
    en: 'Multilingual Civic AI',
    hi: 'बहुभाषी नागरिक एआई',
    mr: 'बहुभाषिक नागरी AI'
  },
  multilingualCivicAIDesc: {
    en: 'Allows citizens to communicate and receive updates in English, Hindi (हिंदी), and Marathi (मराठी).',
    hi: 'नागरिकों को अंग्रेजी, हिंदी (हिंदी) और मराठी (मराठी) में संवाद करने और अपडेट प्राप्त करने की अनुमति देता है।',
    mr: 'नागरिकांना इंग्रजी, हिंदी आणि मराठीमध्ये संवाद साधण्याची व अपडेट्स मिळवण्याची सुविधा.'
  },
  ragKnowledgeAssistant: {
    en: 'RAG Knowledge Assistant',
    hi: 'आरएजी ज्ञान सहायक',
    mr: 'RAG ज्ञान सहाय्यक'
  },
  ragKnowledgeAssistantDesc: {
    en: 'Answers citizen questions by retrieving official municipal code and department operating guidelines with source citations.',
    hi: 'आधिकारिक नगरपालिका कोड और संचालन दिशानिर्देशों के साथ नागरिक प्रश्नों का उत्तर देता है।',
    mr: 'अधिकृत महापालिका नियम व मार्गदर्शक तत्त्वांच्या आधारे नागरिकांच्या प्रश्नांची उत्तरे देतो.'
  },
  officialPdfExport: {
    en: 'Official PDF Export',
    hi: 'आधिकारिक पीडीएफ निर्यात',
    mr: 'अधिकृत PDF डाउनलोड'
  },
  officialPdfExportDesc: {
    en: 'Generates formal complaint documents and official government reports ready for printing and records archiving.',
    hi: 'औपचारिक शिकायत दस्तावेज और मुद्रण योग्य आधिकारिक सरकारी रिपोर्ट तैयार करता है।',
    mr: 'औपचारिक तक्रार दस्तऐवज आणि मुद्रणयोग्य शासकीय अहवाल तयार करतो.'
  },
  auditLogTransparency: {
    en: 'Audit Log Transparency',
    hi: 'ऑडिट लॉग पारदर्शिता',
    mr: 'ऑडिट लॉग पारदर्शकता'
  },
  auditLogTransparencyDesc: {
    en: 'Maintains immutable audit records for priority overrides, status updates, and department reassignments.',
    hi: 'प्राथमिकता परिवर्तन, स्थिति अपडेट और विभाग पुनर्वितरण के लिए पारदर्शी ऑडिट रिकॉर्ड बनाए रखता है।',
    mr: 'प्राधान्य बदल, स्थिती अपडेट आणि विभाग वाटपासाठी पारदर्शक नोंद ठेवतो.'
  },
  details: {
    en: 'Details',
    hi: 'विवरण',
    mr: 'तपशील'
  },
  launchAssistant: {
    en: 'Launch Assistant',
    hi: 'सहायक शुरू करें',
    mr: 'सहाय्यक सुरू करा'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  translateCategory: (cat: string) => string;
  translateStatus: (status: string) => string;
  translateSeverity: (sev: string) => string;
  translateIncident: (incident: Incident) => Incident;
  translateDepartment: (deptName?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const isAuthorityOrAdmin = role === 'AUTHORITY' || role === 'ADMIN';

  const [citizenLanguage, setCitizenLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('civic_crisis_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved;
      }
    }
    return 'en';
  });

  // For Authority and Admin, language is strictly English ('en') only.
  // For Citizens, use their selected language.
  const language: Language = isAuthorityOrAdmin ? 'en' : citizenLanguage;

  const setLanguage = (lang: Language) => {
    // If the active role is Authority or Admin, do not allow changing language.
    if (isAuthorityOrAdmin) {
      return;
    }
    setCitizenLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('civic_crisis_lang', lang);
    }
  };

  const t = (key: string, defaultText?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    return defaultText !== undefined ? defaultText : key;
  };

  const translateCategory = (cat: string): string => {
    const keyMap: Record<string, string> = {
      'Flood': 'cat_Flood',
      'Road Damage': 'cat_RoadDamage',
      'Garbage': 'cat_Garbage',
      'Water Leakage': 'cat_WaterLeakage',
      'Electricity': 'cat_Electricity',
      'Streetlight': 'cat_Streetlight',
      'Traffic Accident': 'cat_TrafficAccident',
      'Drainage': 'cat_Drainage',
      'Pollution': 'cat_Pollution',
      'Public Safety': 'cat_PublicSafety'
    };
    const transKey = keyMap[cat];
    if (transKey && translations[transKey] && translations[transKey][language]) {
      return translations[transKey][language];
    }
    return cat;
  };

  const translateStatus = (status: string): string => {
    const transKey = `status_${status}`;
    if (translations[transKey] && translations[transKey][language]) {
      return translations[transKey][language];
    }
    return status;
  };

  const translateSeverity = (sev: string): string => {
    const transKey = `sev_${sev}`;
    if (translations[transKey] && translations[transKey][language]) {
      return translations[transKey][language];
    }
    return sev;
  };

  const translateIncident = (incident: Incident): Incident => {
    return translateIncidentObject(incident, language);
  };

  const translateDepartment = (deptName?: string): string => {
    if (!deptName) return '';
    return departmentTranslations[deptName]?.[language] || deptName;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateCategory,
        translateStatus,
        translateSeverity,
        translateIncident,
        translateDepartment
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
