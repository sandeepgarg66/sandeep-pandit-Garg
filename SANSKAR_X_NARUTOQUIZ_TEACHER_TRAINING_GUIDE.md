# Sanskar-X-NarutoQuiz — शिक्षक प्रशिक्षण मार्गदर्शिका (Teacher Training Guide)

**संस्करण:** वर्तमान लाइव प्रोजेक्ट कोडबेस पर आधारित वास्तविक मार्गदर्शिका  
**भाषा:** सरल हिंदी (आवश्यक तकनीकी व स्क्रीन नाम अंग्रेज़ी में ब्रैकेट सहित)  
**उद्देश्य:** नए शिक्षकों (Teachers) को पंजीकरण, लॉगिन, प्रश्न निर्माण (MCQ, AI Generator, Bulk Import), पूर्ण टेस्ट निर्माण, एडमिन अनुमोदन (Admin Approval) और स्वामित्व नियमों (Ownership Rules) की संपूर्ण व्यावहारिक ट्रेनिंग देना।

> **महत्वपूर्ण सूचना (Transparency Note):** यह गाइड **Sanskar-X-NarutoQuiz** के वास्तविक सिस्टम (Live Codebase) को देखकर तैयार की गई है। जो सुविधाएँ वेबसाइट में मौजूद हैं, उनके सटीक स्क्रीन/बटन नाम दिए गए हैं। जो सुविधाएँ अभी वेबसाइट में लागू नहीं हैं, उनके आगे स्पष्ट रूप से **"अभी उपलब्ध नहीं है"** लिखा गया है।

---

## अनुभाग 1: संपूर्ण शिक्षक प्रशिक्षण मैनुअल (Complete Teacher Training Manual)

### 1.1 शिक्षक पैनल परिचय (Teacher Panel Introduction)

#### 1. Sanskar-X-NarutoQuiz क्या है?
**Sanskar-X-NarutoQuiz** एक ऑनलाइन प्रतियोगी परीक्षा (Competitive Examination) और मॉक टेस्ट अभ्यास मंच (Platform) है। यहाँ विद्यार्थी **5-Option OMR Standard** (जहाँ **Option E = Unattempted / अनुत्तरित** होता है ताकि नेगेटिव मार्किंग से बचा जा सके) के साथ रियल-टाइम परीक्षाएँ दे सकते हैं, अभ्यास कर सकते हैं और अपनी रैंक व प्रदर्शन देख सकते हैं।

#### 2. Teacher Panel का उद्देश्य क्या है?
**Teacher Panel** (शिक्षक कार्यक्षेत्र) योग्य शिक्षकों और विषय-विशेषज्ञों के लिए बनाया गया है ताकि वे:
- उच्च गुणवत्ता वाले बहुविकल्पीय प्रश्न (MCQs) तैयार कर सकें और अपने निजी प्रश्न बैंक (**My Question Bank**) में सहेज सकें।
- चुने हुए प्रश्नों से व्यवस्थित मॉक टेस्ट, अध्याय-वार टेस्ट (**Chapter Test**), साप्ताहिक टेस्ट (**Weekly Test**), या दैनिक अभ्यास टेस्ट (**Daily Test**) बना सकें।
- तैयार किए गए टेस्ट को **Admin Review (एडमिन समीक्षा)** के लिए भेज सकें ताकि स्वीकृति के बाद विद्यार्थी उन्हें हल कर सकें।

#### 3. एक Teacher वेबसाइट पर क्या-क्या कर सकता है?
- **Question Bank बनाना:** एक-एक करके या एक साथ (Bulk Import / AI Template Generator द्वारा) प्रश्न जोड़ना।
- **Complete Test बनाना:** अपने Question Bank से प्रश्न चुनकर नया टेस्ट बनाना और Admin Approval के लिए सबमिट करना।
- **अपने टेस्ट की स्थिति देखना:** `My Tests Catalog` में अपने बनाए टेस्ट का स्टेटस (`Pending Approval`, `Published`, `Rejected` आदि) देखना और अप्रकाशित (Non-Published) टेस्ट डिलीट करना।
- **Student Panel का उपयोग करना:** उसी एक खाते से छात्र की तरह टेस्ट देकर अभ्यास करना, लीडरबोर्ड देखना और OMR अनुभव जांचना।

#### 4. Teacher Panel और Student Panel में क्या अंतर है?

| तुलना बिंदु | Student Panel (विद्यार्थी पैनल) | Teacher Panel (शिक्षक पैनल) |
| :--- | :--- | :--- |
| **मुख्य उद्देश्य** | टेस्ट देना, अभ्यास करना और अपनी रैंक व विश्लेषण देखना | नए प्रश्न बनाना, क्वेश्चन बैंक संभालना और टेस्ट तैयार करके Admin को भेजना |
| **उपलब्ध मुख्य विकल्प** | `Dashboard`, `New Tests`, `Practice Hub`, `Performance`, `Leaderboard`, `My Previous Rank`, `Bookmarks`, `Profile & Settings` | `My Tests Catalog`, `Create Assessment Form`, `AI Question Generator & Bulk Import`, `MCQ Builder (Manual)` |
| **टेस्ट प्रकाशन (Publishing)** | केवल Admin द्वारा प्रकाशित (Published) टेस्ट ही देख व दे सकते हैं | केवल अपने बनाए टेस्ट और अपना निजी Question Bank देख सकते हैं; टेस्ट लाइव करने के लिए Admin की मंज़ूरी आवश्यक है |
| **पहुँच (Access)** | रजिस्ट्रेशन के तुरंत बाद सक्रिय | रजिस्ट्रेशन के बाद **Admin Approval** (`Approved` स्टेटस) मिलने पर सक्रिय |

#### 5. Teacher अपने ही खाते से Student Panel का उपयोग कैसे कर सकता है?
सिस्टम हर Teacher खाते के लिए `studentProfiles` भी स्वचालित रूप से तैयार करता है। इसका अर्थ है कि:
1. लॉगिन करने के बाद आप डिफ़ॉल्ट रूप से **Student Panel** में ही प्रवेश करते हैं।
2. आप शीर्ष नेविगेशन बार (**Navbar**) में मौजूद **`Student`** / **`Teacher`** स्विचर बटन से कभी भी दोनों पैनल के बीच बदल सकते हैं।
3. मोबाइल और डेस्कटॉप साइडबार (Student Panel के भीतर) में भी **`Teacher Workspace`** का बटन दिया गया है।
4. **खास लाभ:** जब तक Admin आपका Teacher खाता Approve नहीं करता, तब भी आप तुरंत **Student Panel** का पूरा उपयोग कर सकते हैं।

#### 6. Teacher की अनुमतियाँ और सीमाएँ (Permissions & Restrictions)

**अनुमतियाँ (Allowed):**
- ईमेल/पासवर्ड या Google से Teacher के रूप में पंजीकरण करना।
- Student Panel में सभी प्रकाशित टेस्ट देना और अभ्यास करना।
- Admin Approval मिलने के बाद अपना निजी Question Bank बनाना (`MCQ Builder (Manual)` और `AI Question Generator & Bulk Import`)।
- केवल **अपने बनाए प्रश्नों** से नया टेस्ट बनाना और Admin को Approval के लिए भेजना।
- अपने अप्रकाशित (`Pending Approval` या `Rejected`) टेस्ट को `My Tests Catalog` से डिलीट करना।

**सीमाएँ (Restrictions):**
- Teacher **अपना खुद का खाता** Approve नहीं कर सकता (केवल Admin कर सकता है)।
- Teacher **अपना खुद का बनाया टेस्ट** स्वचालित रूप से Publish या Approve नहीं कर सकता।
- Teacher **किसी दूसरे शिक्षक** के बनाए टेस्ट या प्रश्न नहीं देख, बदल या डिलीट कर सकता।
- Teacher **Admin Panel** (जैसे `Test Approvals`, `Teacher Management`, `User Control`) नहीं खोल सकता।
- `Published` हो चुके टेस्ट को Teacher सीधे डिलीट नहीं कर सकता (`Locked` दिखता है)।

---

### 1.2 शिक्षक पंजीकरण एवं लॉगिन प्रक्रिया (Teacher Registration & Login)

नीचे दिए गए चरणों का क्रम से पालन करें:

1. **वेबसाइट खोलें:** अपने ब्राउज़र में Sanskar-X-NarutoQuiz वेबसाइट खोलें।
   - लाइव डेवलपमेंट URL: `https://ais-dev-vbh6jt72t4dek5snhtt7jl-791267952374.asia-southeast1.run.app`
   - शेयर की गई वेबसाइट URL: `https://ais-pre-vbh6jt72t4dek5snhtt7jl-791267952374.asia-southeast1.run.app`
2. **Login मोडल खोलें:**
   - डेस्कटॉप पर ऊपर दाईं ओर नारंगी रंग के **`Login`** बटन पर क्लिक करें।
   - मोबाइल पर ऊपर दाईं ओर मेन्यू आइकन (`☰`) दबाएँ और **`Login / Create Account`** पर क्लिक करें।
3. **पंजीकरण का तरीका चुनें (दो विकल्प हैं):**
   - **विकल्प A — Google Sign-In द्वारा (सबसे तेज़ तरीका):**
     1. **`Continue with Google`** बटन पर क्लिक करें और अपना Gmail/Google खाता चुनें।
     2. पहली बार लॉगिन करने पर स्क्रीन पर **"आप Sanskar-X-NarutoQuiz पर किस रूप में जुड़ना चाहते हैं?"** शीर्षक वाला Role Selection विंडो खुलेगा।
     3. यहाँ दो कार्ड दिखेंगे: **`Student (विद्यार्थी)`** और **`Teacher (शिक्षक / परीक्षक)`**।
     4. **`Teacher (शिक्षक / परीक्षक)`** कार्ड के नीचे **`Continue as Teacher`** बटन पर क्लिक करें।
     5. अब **Teacher Details** फॉर्म खुलेगा। इसमें भरें:
        - **`Academic Qualification / Faculty Designation *`** (जैसे: `M.Sc, B.Ed, Science Mentor`)
        - **`Primary Subject Domain *`** (ड्रॉपडाउन से अपना मुख्य विषय चुनें)
     6. **`Submit & Register as Teacher`** बटन पर क्लिक करें।
   - **विकल्प B — Email और Password द्वारा नया खाता बनाना:**
     1. लॉगिन मोडल के सबसे नीचे **`Create an Account`** लिंक पर क्लिक करें।
     2. **`Account Type *`** में **`Student`** के बजाय **`Teacher`** कार्ड चुनें।
     3. निम्नलिखित जानकारी भरें:
        - **`Full Name *`** (आपका पूरा नाम)
        - **`Email Address *`** (आपका ईमेल)
        - **`Password *`** (कम से कम 6 अक्षर)
        - **`Confirm Password *`** (दोबारा वही पासवर्ड)
        - **`Qualification`** (योग्यता, जैसे `M.Sc, B.Ed`)
        - **`Subject Domain`** (मुख्य विषय, जैसे `General Science`)
     4. नीचे **`Create Teacher Account`** बटन पर क्लिक करें।
4. **Admin Approval की प्रतीक्षा करें:**
   - रजिस्ट्रेशन होते ही सिस्टम आपके खाते को स्टूडेंट पैनल पर ले जाता है, और आपका शिक्षक स्टेटस **`Pending`** रहता है।
   - यदि आप इस दौरान ऊपर नेविगेशन बार में **`Teacher`** बटन दबाते हैं, तो **`Teacher Application Pending Approval`** (*Jonin Educator Verification*) स्क्रीन दिखेगी। यहाँ से आप **`Open Student Panel (Practice & Attempt Tests)`** दबाकर छात्र पैनल इस्तेमाल कर सकते हैं।
5. **Approval के बाद Teacher Panel खोलें:**
   - जब संस्थान के Admin (प्रशासक) Admin Panel में जाकर आपके नाम के सामने **`Approve`** बटन दबा देते हैं, तो आपका स्टेटस `Approved` हो जाता है।
   - अब यदि आप लॉगिन करते हैं (या पहले से लॉगिन हैं), तो शीर्ष बार में **`Teacher`** बटन (या मोबाइल मेन्यू में **`Teacher Panel`** / Student साइडबार में **`Teacher Workspace`**) पर क्लिक करते ही पूरा **Teacher Dashboard** खुल जाएगा।
6. **दोबारा लॉगिन करना (Returning Login):**
   - अगली बार वेबसाइट खोलकर **`Login`** बटन दबाएँ।
   - यदि आपने Google से खाता बनाया था तो **`Continue with Google`** दबाएँ; यदि ईमेल-पासवर्ड से बनाया था तो **`Email Address`**, **`Password`** डालकर **`Sign In`** दबाएँ। (पासवर्ड भूलने पर **`Forgot Password?`** का उपयोग करें।)
   - ध्यान रखें: लॉगिन करने के तुरंत बाद आप हमेशा **Student Panel** पर पहुँचते हैं। शिक्षक कार्य करने के लिए ऊपर **`Teacher`** बटन पर क्लिक करें।
7. **Student Panel और Teacher Panel के बीच स्विच करना:**
   - **डेस्कटॉप Navbar में:** ऊपर दाईं ओर **`Student`** और **`Teacher`** का टॉगल स्विच है। एक क्लिक में पैनल बदलें।
   - **मोबाइल मेन्यू में:** `☰` मेन्यू खोलकर `Authorized Panels` सेक्शन में **`Student Panel`** या **`Teacher Panel`** चुनें।
   - **Student साइडबार में:** सबसे ऊपर बैंगनी रंग का **`Teacher Workspace`** बटन मिलता है; और **Teacher Dashboard** के हेडर में **`Open Student Panel`** बटन मिलता है।

---

### 1.3 शिक्षक डैशबोर्ड टूर और टेस्ट स्थितियाँ (Teacher Dashboard Tour & Test Statuses)

जब Admin द्वारा Approve होने के बाद आप **Teacher Panel** खोलते हैं, तो सबसे ऊपर **Verified Educator / Academic Faculty** बैज, आपका नाम व ईमेल, और 3 त्वरित बटन दिखते हैं:
- **`Open Student Panel`** (स्टूडेंट पैनल में जाने के लिए)
- **`AI Question Generator`** (सीधे AI/बल्क प्रश्न टैब खोलने के लिए)
- **`Create New Test`** (सीधे नया टेस्ट बनाने का फॉर्म खोलने के लिए)

इसके ठीक नीचे 4 आंकड़ा कार्ड (**Stat Cards**) दिखते हैं:
1. **`My Authored Tests`**: आपके द्वारा बनाए गए कुल टेस्ट की संख्या।
2. **`Published`**: आपके कितने टेस्ट Admin द्वारा स्वीकृत होकर विद्यार्थियों के लिए लाइव हो चुके हैं।
3. **`Pending Approval`**: कितने टेस्ट अभी Admin की समीक्षा के लिए प्रतीक्षारत हैं।
4. **`My Question Bank`**: आपके निजी क्वेश्चन बैंक में सहेजे गए कुल प्रश्नों की संख्या।

#### डैशबोर्ड के प्रत्येक विकल्प का पूरा विवरण

| क्रमांक | विकल्प / टैब का नाम | उपलब्धता स्थिति | उद्देश्य (Purpose) | कब और कैसे उपयोग करें + व्यावहारिक उदाहरण |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Dashboard (मुख्य सारांश एवं हेडर बार)** | **उपलब्ध** | आपके सभी टेस्ट व प्रश्नों की त्वरित गिनती (4 Stat Cards) दिखाना और मुख्य टैब्स तक पहुँचाना। | लॉगिन के बाद स्थिति देखने के लिए। *उदाहरण:* यह देखना कि आपके भेजे 3 टेस्ट में से कितने `Published` हो चुके हैं। |
| 2 | **`Create Assessment Form` (Create New Test)** | **उपलब्ध** | टेस्ट का नाम, विषय, समय, नेगेटिव मार्किंग सेट करना और अपने Question Bank से प्रश्न चुनकर टेस्ट सबमिट करना। | जब आपके Question Bank में प्रश्न तैयार हों। *उदाहरण:* "General Science Practice Test" बनाना और 10 प्रश्न जोड़कर **`Submit Complete Test for Admin Approval`** दबाना। |
| 3 | **`My Tests Catalog`** (My Tests) | **उपलब्ध** | आपके बनाए सभी टेस्ट की सूची, प्रश्न संख्या, `Status` और `Approval Workflow` देखना। | यह जांचने के लिए कि टेस्ट Approve हुआ, Pending है या Reject हुआ। अप्रकाशित टेस्ट को **`Delete`** (कूड़ेदान आइकन) से हटाया जा सकता है (`Published` टेस्ट पर `Locked` दिखता है)। |
| 4 | **`MCQ Builder (Manual)`** एवं **`AI Question Generator & Bulk Import`** (Question Bank) | **उपलब्ध** | मैन्युअल रूप से एक-एक MCQ बनाना, AI टेम्पलेट से प्रश्न जनरेट करना, या TXT/CSV/JSON फाइल व कॉपी-पेस्ट द्वारा बल्क में प्रश्न जोड़ना। | टेस्ट बनाने से पहले प्रश्न संग्रह तैयार करने के लिए। *उदाहरण:* विज्ञान के 10 प्रश्न बनाकर `My Question Bank` में सेव करना। |
| 5 | **Student Results (शिक्षक पैनल के भीतर)** | **अभी उपलब्ध नहीं है** | शिक्षक के टेस्ट देने वाले छात्रों के परिणाम देखना। | **अभी उपलब्ध नहीं है।** *(नोट: वर्तमान में परिणाम एवं प्रयास विवरण केवल Student Panel के `Performance`/`My Previous Rank` और Admin Panel के `Results & Attempts` में दिखते हैं; Teacher Panel में अलग टैब अभी उपलब्ध नहीं है।)* |
| 6 | **Performance Reports (शिक्षक पैनल के भीतर)** | **अभी उपलब्ध नहीं है** | टेस्ट-वार विश्लेषण रिपोर्ट देखना। | **अभी उपलब्ध नहीं है।** *(नोट: `Reports & Analytics` अभी केवल Admin Panel में उपलब्ध है, Teacher Panel में नहीं।)* |
| 7 | **Notifications (शिक्षक पैनल के भीतर)** | **अभी उपलब्ध नहीं है** | स्वीकृति/अस्वीकृति की अलर्ट घंटी या इनबॉक्स देखना। | **अभी उपलब्ध नहीं है।** *(वर्तमान में टेस्ट Reject या Approve होने का स्टेटस व कारण सीधे `My Tests Catalog` की `Approval Workflow` कॉलम में दिखाई देता है।)* |
| 8 | **Profile (शिक्षक पैनल के भीतर)** | **अभी उपलब्ध नहीं है** | शिक्षक प्रोफ़ाइल संपादन पेज। | **अभी उपलब्ध नहीं है।** *(डैशबोर्ड के ऊपरी हेडर में केवल आपका नाम, ईमेल और Qualification/Subject बैज दिखता है। छात्र-प्रोफ़ाइल व सेटिंग्स के लिए Student Panel में `Profile & Settings` मौजूद है।)* |
| 9 | **Settings (शिक्षक पैनल के भीतर)** | **अभी उपलब्ध नहीं है** | शिक्षक खाता या पैनल सेटिंग्स बदलना। | **अभी उपलब्ध नहीं है।** *(पैनल के अंदर अलग Settings टैब नहीं है।)* |

#### टेस्ट की सभी स्थितियाँ (All Test Statuses)

1. **`Draft` (ड्राफ्ट / अनसबमिटेड):** अधूरा या अभी तक सबमिट न किया गया टेस्ट। *(ध्यान दें: वर्तमान `Create Assessment Form` में अलग से `Save as Draft` बटन **अभी उपलब्ध नहीं है** — फॉर्म से सबमिट करते ही टेस्ट सीधे `Pending Approval` में जाता है। यदि डेटा में कोई पुराना ड्राफ्ट हो तो `My Tests Catalog` में `Unsubmitted Draft` दिखता है।)*
2. **`Pending Approval` (समीक्षा प्रतीक्षारत):** जब Teacher टेस्ट बनाकर **`Submit Complete Test for Admin Approval`** बटन दबाता है, तो स्टेटस **`Pending Approval`** और `Approval Workflow` में **`Awaiting Admin Review`** दिखता है। यह अभी छात्रों को नहीं दिखता।
3. **`Approved` (स्वीकृत):** Admin द्वारा जाँचा और स्वीकृत किया गया टेस्ट। *(वर्तमान सिस्टम में जब Admin `Approve & Publish` दबाता है, तो टेस्ट का स्टेटस सीधे **`Published`** और वर्कफ़्लो **`Approved by Admin` / `Published (Institutional)`** हो जाता है।)*
4. **`Published` (प्रकाशित / लाइव):** टेस्ट अब पूरी तरह लाइव है और **Student Panel** में सभी विद्यार्थियों को दिखाई देता है।
5. **`Scheduled` (निर्धारित समय के लिए तय):** भविष्य की किसी तारीख/समय पर लाइव होने के लिए तय टेस्ट। *(सिस्टम मॉडल में यह स्टेटस परिभाषित है, लेकिन Teacher Panel से किसी टेस्ट को Schedule करने की सुविधा **अभी उपलब्ध नहीं है**।)*
6. **`Rejected` (अस्वीकृत):** यदि टेस्ट में गलत उत्तर, कम प्रश्न या त्रुटि हो, तो Admin उसे अस्वीकार कर सकता है। `My Tests Catalog` में लाल रंग में **`Rejected by Admin`** और उसके नीचे **`Note: [Admin का कारण]`** दिखाई देता है।
7. **`Archived` (संग्रहीत / पुराना):** पुराने या बंद किए गए टेस्ट। *(Teacher Panel से किसी टेस्ट को Archive करने की सुविधा **अभी उपलब्ध नहीं है**; यह केवल Admin प्रबंधन में सीमित है।)*

#### टेस्ट सबमिट करने के बाद क्या होता है?
- आपका टेस्ट डेटाबेस (`tests` कलेक्शन) में `status: "Pending Approval"`, `approvalStatus: "Pending"`, और `createdBy: [आपका UID]` के साथ सुरक्षित हो जाता है।
- यह तुरंत **Student Panel** या **Homepage** पर प्रकाशित **नहीं** होता।
- यह Admin के **`Test Approvals`** कतार में पहुँच जाता है। जब तक Admin इसे Approve नहीं करते, आप अपने **`My Tests Catalog`** में इसका स्टेटस `PENDING APPROVAL` देखते रहेंगे।

---

### 1.4 शिक्षक टेस्ट स्वामित्व और सुरक्षा नियम (Teacher Test Ownership Rules)

सिस्टम में डेटा सुरक्षा और भूमिका नियंत्रण (RBAC) **Firestore Security Rules** और कोड दोनों स्तरों पर लागू है:

1. **अपने टेस्ट संपादित (Edit) या डिलीट (Delete) करना:**
   - आप `My Tests Catalog` में केवल अपने द्वारा बनाए गए टेस्ट देख सकते हैं।
   - यदि आपका टेस्ट अभी **`Published` नहीं** हुआ है (`Pending Approval` या `Rejected`), तो आप **`Actions`** कॉलम में लाल कूड़ेदान (`Delete`) आइकन दबाकर उसे हटा सकते हैं।
   - **महत्वपूर्ण सीमा:** Teacher Panel में मौजूदा टेस्ट को सीधे खोलकर **Edit करने का बटन अभी उपलब्ध नहीं है**। यदि कोई अप्रकाशित टेस्ट गलत बन गया है, तो उसे Delete करके नया टेस्ट बना सकते हैं (आपके प्रश्न Question Bank में सुरक्षित रहते हैं)।
2. **दूसरे शिक्षक का टेस्ट या प्रश्न छूना (Strict Isolation):**
   - **पूरी तरह प्रतिबंधित।** आप दूसरे शिक्षक के बनाए निजी प्रश्न (`questions`) या उनके अप्रकाशित टेस्ट न देख सकते हैं, न एडिट कर सकते हैं और न डिलीट कर सकते हैं।
3. **खुद का टेस्ट Approve या Publish करना:**
   - **पूरी तरह प्रतिबंधित।** सुरक्षा नियमों के तहत केवल सत्यापित **Admin** ही किसी टेस्ट को `Approved` या `Published` कर सकता है।
4. **Admin Panel का उपयोग करना:**
   - **पूरी तरह प्रतिबंधित।** Teacher के Navbar में `Admin` विकल्प दिखाई ही नहीं देता और न ही कोई Teacher Admin पेज खोल सकता है।
5. **Student Panel का उपयोग करना:**
   - **अनुमति प्राप्त।** हर Teacher अपने ही खाते से Student Panel में लॉगिन रहकर प्रकाशित टेस्ट अटेम्प्ट कर सकता है।
6. **Published टेस्ट में बदलाव करने पर पुनः अनुमोदन (Re-approval Rule):**
   - एक बार टेस्ट **`Published`** हो जाने पर Teacher के लिए वह **`Locked`** हो जाता है ताकि परीक्षा दे रहे छात्रों का रिकॉर्ड खराब न हो। यदि उसमें कोई सुधार आवश्यक हो, तो शिक्षक Admin से अनुरोध कर सकता है (या नया संशोधित टेस्ट बनाकर पुनः Admin Approval के लिए भेज सकता है)।

**व्यावहारिक उदाहरण (क्या कर सकते हैं / क्या नहीं कर सकते):**
- *उदाहरण 1 (अनुमति है):* शिक्षक **रमेश जी** ने 10 प्रश्नों का "General Science Practice Test" सबमिट किया। तुरंत उन्हें ध्यान आया कि समय 15 की जगह 20 मिनट रखना था। चूँकि टेस्ट अभी `Pending Approval` में है, वे `My Tests Catalog` में जाकर **`Delete`** बटन दबाते हैं और तुरंत Question Bank से वही 10 प्रश्न दोबारा चुनकर 20 मिनट का सही टेस्ट सबमिट कर देते हैं।
- *उदाहरण 2 (अनुमति नहीं है):* शिक्षक **रमेश जी** चाहते हैं कि उनके सहकर्मी शिक्षक **सुरेश जी** के Question Bank से 5 प्रश्न लेकर अपने टेस्ट में जोड़ लें या अपना नया टेस्ट खुद Approve कर दें — सिस्टम उन्हें न सुरेश जी के प्रश्न दिखाएगा और न ही खुद Approve करने का कोई बटन देगा।

---

## अनुभाग 2: शिक्षक पैनल की सभी सुविधाओं का विवरण (Teacher Panel Feature Explanation)

Teacher Dashboard में वर्तमान में मौजूद सभी मुख्य भागों और फीचर उपलब्धता की स्पष्ट तालिका नीचे दी गई है:

1. **हेडर एवं त्वरित कार्य बार (Header & Quick Action Bar):**
   - यहाँ शिक्षक की पहचान (`Verified Educator` बैज), आपका नाम, ईमेल और 3 बटन हैं: **`Open Student Panel`**, **`AI Question Generator`**, और **`Create New Test`**।
2. **4 लाइव आँकड़ा कार्ड (Summary Stat Cards):**
   - **`My Authored Tests`**, **`Published`**, **`Pending Approval`**, और **`My Question Bank`** — ये कार्ड रियल-टाइम में आपके खाते की प्रगति दिखाते हैं।
3. **टैब 1 — `My Tests Catalog (N)`:**
   - आपके द्वारा बनाए गए सभी टेस्ट की तालिका: `Test Title`, `Category`, `Subject`, `Questions`, `Status`, `Approval Workflow`, और `Actions` (`Delete` या `Locked`)।
   - यदि कोई टेस्ट अस्वीकृत हो तो इसी टेबल में **`Rejected by Admin`** के नीचे **`Note:`** में Admin की टिप्पणी दिखती है।
4. **टैब 2 — `Create Assessment Form`:**
   - इसमें 3 भाग होते हैं:
     - भाग A: **Create New Assessment Configuration** (टेस्ट की जानकारी व नेगेटिव मार्किंग सेटिंग)।
     - भाग B: **Select Questions from My Question Bank** (सर्च बार, Subject फिल्टर, Difficulty फिल्टर, **`Select All`**, **`Clear`**, चेकबॉक्स व व्याख्या प्रीव्यू)।
     - भाग C: **Live Test Blueprint Preview** (कुल प्रश्न, कुल अंक, नेगेटिव अंक और **`Submit Complete Test for Admin Approval`** बटन)।
5. **टैब 3 — `AI Question Generator & Bulk Import`:**
   - इसमें 3 इनपुट विधियाँ (**Method A: Generate Questions with AI**, **Method B: Import Questions from Files**, **Method C: Bulk Copy-Paste Editor**) और नीचे एक **Staged Questions Review Workspace** होता है जहाँ आप सेव करने से पहले हर प्रश्न को जाँच और सुधार सकते हैं।
6. **टैब 4 — `MCQ Builder (Manual)`:**
   - एक-एक करके पूर्ण शुद्धता के साथ नया प्रश्न बनाने और तुरंत अपने `My Question Bank` में सहेजने का फॉर्म।

> **जो सुविधाएँ Teacher Panel के भीतर अभी उपलब्ध नहीं हैं (स्पष्ट सूची):**
> - Teacher Panel के अंदर अलग `Student Results`, `Performance Reports`, `Notifications`, `Profile`, या `Settings` टैब → **अभी उपलब्ध नहीं है**।
> - प्रश्नों में फोटो/इमेज अपलोड (`Question Image upload`) → **अभी उपलब्ध नहीं है**।
> - मैन्युअल MCQ फॉर्म में अलग `Topic` इनपुट और अलग `Marks` इनपुट बॉक्स → **अभी उपलब्ध नहीं है** *(स्वचालित `General Topic` और `2 Marks` सहेजा जाता है)*।
> - टेस्ट फॉर्म में `Save as Draft` बटन और कस्टम अंक (`1 Mark` / `-0.25`) सेट करने का विकल्प → **अभी उपलब्ध नहीं है**।
> - Teacher के लिए बने हुए टेस्ट को सीधे `Edit` करने, `Schedule` करने या `Archive` करने का विकल्प → **अभी उपलब्ध नहीं है**।
> - लाइव Gemini/AI सर्वर से कस्टम नए प्रश्न जनरेट करना (`/api/ai/generate-questions` बैकएंड) → **अभी उपलब्ध नहीं है** *(वर्तमान में ऑफ़लाइन/फ़ॉलबैक टेम्पलेट प्रश्न लोड होते हैं)*।
> - सीधे `.pdf`, `.docx`, `.xlsx` बाइनरी फाइल पार्स करना या स्कैन की गई फोटो से OCR → **अभी उपलब्ध नहीं है** *(केवल `.txt`, `.csv`, `.json` फाइल सीधे पढ़ी जाती हैं)*।

---

## अनुभाग 3: व्यावहारिक MCQ निर्माण उदाहरण (Practical MCQ Creation Example)

### 3.1 मैन्युअल MCQ बनाने के नियम और 5-Option OMR Standard

1. **Teacher Panel** खोलें और चौथे टैब **`MCQ Builder (Manual)`** पर क्लिक करें।
2. **इस फॉर्म में कौन-कौन से फील्ड वास्तव में मौजूद हैं और कौन से नहीं:**
   - **मौजूद फील्ड:** `Question Statement *`, `Option A *`, `Option B *`, `Option C *`, `Option D *`, `Correct Answer Key *` (`Option A` से `Option D`), `Subject` (ड्रॉपडाउन), `Difficulty` (`Easy`, `Medium`, `Hard`), और `Detailed Authoritative Explanation *`।
   - **जो फील्ड इस फॉर्म में अभी उपलब्ध नहीं हैं:**
     - **Question Image (Optional Upload):** **अभी उपलब्ध नहीं है** — प्रश्न केवल टेक्स्ट में लिखा जाता है।
     - **अलग Topic इनपुट बॉक्स:** **अभी उपलब्ध नहीं है** — मैन्युअल फॉर्म से प्रश्न सहेजने पर सिस्टम स्वचालित रूप से Topic को `'General Topic'` सहेजता है। *(सुझाव: आप चाहें तो प्रश्न या व्याख्या के साथ विषय-शीर्षक लिख सकते हैं, या Bulk Copy-Paste में `[Topic]` टैग से Topic दर्ज कर सकते हैं।)*
     - **अलग Marks इनपुट बॉक्स:** **अभी उपलब्ध नहीं है** — सिस्टम हर प्रश्न के लिए मानक **`2 Marks`** निर्धारित करता है।

3. **5-Option OMR Standard (Option E का नियम) समझें:**
   - परीक्षा देते समय विद्यार्थी को 5 गोले दिखते हैं: **A, B, C, D और E**।
   - **Options A, B, C, D:** ये आपके लिखे गए चार तथ्यात्मक विकल्प होते हैं। सही उत्तर हमेशा इन्हीं चार (**A, B, C या D**) में से कोई एक होना चाहिए।
   - **Option E ("अनुत्तरित / No Response / Skip Question"):** इसे सिस्टम परीक्षा स्क्रीन पर अपने-आप पाँचवें विकल्प के रूप में जोड़ता है। यदि विद्यार्थी को उत्तर नहीं आता, तो वह Option E भरकर नेगेटिव मार्किंग (`0 penalty`) से बच सकता है।
   - **शिक्षक के लिए नियम:** प्रश्न बनाते समय आपको **केवल Options A, B, C और D** ही लिखने हैं और **Correct Answer Key हमेशा A, B, C या D** में से चुनना है। **Option E आपको स्वयं टाइप नहीं करना है और न ही Option E को सही उत्तर चुनना है।**

---

### 3.2 लाइव उदाहरण: General Science का एक प्रश्न बनाना

अब हम निम्नलिखित प्रश्न को **`MCQ Builder (Manual)`** टैब में भरकर सहेजने का पूरा अभ्यास देखेंगे:

| फॉर्म फील्ड (Screen Field Name) | दर्ज किया जाने वाला मान (Value to Enter) | वर्तमान सिस्टम टिप्पणी |
| :--- | :--- | :--- |
| **Question Statement \*** | `मानव शरीर में रक्त को पूरे शरीर में पंप करने वाला अंग कौन-सा है?` | ज्यों का त्यों टाइप करें |
| **Question Image (optional)** | — | **अभी उपलब्ध नहीं है** |
| **Option A \*** | `फेफड़े` | पहला विकल्प |
| **Option B \*** | `हृदय` | सही विकल्प |
| **Option C \*** | `गुर्दे` | तीसरा विकल्प |
| **Option D \*** | `यकृत` | चौथा विकल्प |
| **Correct Answer Key \*** | `Option B` | चूँकि सही उत्तर `हृदय` है |
| **Subject** | `General Science & Technology` *(ड्रॉपडाउन में उपलब्ध निकटतम विज्ञान श्रेणी)* | नोट: अलग `General Science` नाम की बजाय ड्रॉपडाउन में `General Science & Technology` चुनें |
| **Topic** | *(अपेक्षित: `Human Body`)* | मैन्युअल फॉर्म में अलग बॉक्स **अभी उपलब्ध नहीं है** (सिस्टम स्वचालित `General Topic` रखता है) |
| **Difficulty** | `Easy` | ड्रॉपडाउन से `Easy` चुनें |
| **Marks** | *(अपेक्षित: `1`)* | अलग Marks बॉक्स **अभी उपलब्ध नहीं है** (सिस्टम मानक `2 Marks` सेट करता है) |
| **Detailed Authoritative Explanation \*** | `हृदय एक पेशीय अंग है जो रक्त को पंप करके पूरे शरीर में पहुँचाता है। (Topic: Human Body)` | कम से कम 1 स्पष्ट वाक्य आवश्यक |

**सहेजने के चरण:**
1. ऊपर दिए गए सभी विवरण **`MCQ Builder (Manual)`** के बॉक्स में भरें।
2. सबसे नीचे नारंगी बटन **`Add to My Question Bank`** पर क्लिक करें।
3. ऊपर दाईं ओर हरा संदेश आएगा और आपका **`My Question Bank`** कार्ड संख्या `1` से बढ़ जाएगी।
4. अब **`Create Assessment Form`** टैब में जाकर नीचे **`Select Questions from My Question Bank`** सूची में यह प्रश्न तुरंत दिखाई देगा।

---

## अनुभाग 4: AI Question Generator ट्यूटोरियल (AI Question Generator Tutorial)

### 4.1 यह सुविधा वर्तमान में कैसे काम करती है? (ईमानदार तकनीकी स्थिति)

Teacher Panel के **`AI Question Generator & Bulk Import`** टैब में **Method A: `Generate Questions with AI`** कार्ड दिया गया है।

> **महत्वपूर्ण वास्तविक स्थिति (कृपया ध्यान से पढ़ें):**  
> वर्तमान प्रोजेक्ट में सर्वर-साइड लाइव AI API (`/api/ai/generate-questions`) **अभी उपलब्ध नहीं है**। जब आप **`Generate Questions Now`** बटन दबाते हैं, तो सिस्टम सर्वर से जुड़ने की कोशिश के बाद स्वचालित रूप से **Local Curriculum Fallback Templates** (पूर्व-निर्मित डेमो प्रश्न टेम्पलेट) को **Staged Questions Review Workspace** में लोड कर देता है।  
> इसलिए यदि आप बिल्कुल नए कस्टम हिंदी विषय (जैसे `"राजस्थान के लोकदेवता"`) के 10 नए AI प्रश्न एक क्लिक में बनवाना चाहते हैं, तो लाइव AI जनरेशन **अभी उपलब्ध नहीं है** — तब तक आप जनरेट हुए डेमो प्रश्नों को Review Workspace में **`Edit`** कर सकते हैं या **Method C: Bulk Copy-Paste Editor** से अपने प्रश्न तुरंत जोड़ सकते हैं।

### 4.2 AI Question Generator उपयोग करने के चरण (Rajasthan GK उदाहरण सहित)

फिर भी आपको इस टूल के पूरे वर्कफ़्लो का अभ्यास होना चाहिए। उदाहरण मान: **Subject:** `Rajasthan GK`, **Topic:** `राजस्थान के लोकदेवता`, **Questions:** `10`, **Difficulty:** `Medium`, **Language:** `Hindi Only`.

1. **टैब खोलें:** Teacher Dashboard के ऊपर **`AI Question Generator`** बटन या तीसरे टैब **`AI Question Generator & Bulk Import`** पर क्लिक करें।
2. **Method A फॉर्म भरें:**
   - **`Subject *`**: ड्रॉपडाउन में मौजूद विषय चुनें या यदि आपके पास विषय सूची में कस्टम नाम न हो तो `History of India & National Movement` / उपलब्ध विषय चुनें *(ध्यान दें: वर्तमान ड्रॉपडाउन में तय विषय हैं जैसे `Indian Polity & Governance`, `General Science & Technology`, `History of India & National Movement` आदि; कस्टम `Rajasthan GK` टाइप करने की सुविधा **अभी उपलब्ध नहीं है**, इसे आप बाद में स्टेज्ड कार्ड एडिट में या Bulk Editor में लिख सकते हैं)*।
   - **`Topic *`**: लिखें — `राजस्थान के लोकदेवता`
   - **`Number of Questions`**: चुनें — `10`
   - **`Difficulty`**: चुनें — `Medium`
   - **`Language`**: चुनें — `Hindi Only` *(विकल्प: `Both (EN + HI)`, `English`, `Hindi Only`)*
   - **`Optional Instructions or Source Paragraph`**: चाहें तो कोई निर्देश लिखें (जैसे: *पाबूजी, तेजाजी, गोगाजी, रामदेवजी पर आधारित प्रश्न रखिए*)।
3. **जनरेट करें:** बैंगनी बटन **`Generate Questions Now`** पर क्लिक करें।
4. **रिव्यू वर्कस्पेस में जाँचें (सबसे ज़रूरी कदम):**
   - जनरेट किए गए प्रश्न तुरंत Question Bank में सेव **नहीं** होते। वे पहले नीचे **`Staged Questions Review Workspace`** में आते हैं।
   - पीले रंग की चेतावनी पढ़कर हर प्रश्न की **Edit (`✎`)** बटन दबाएँ।
   - प्रत्येक प्रश्न का **English/Hindi Statement**, **Options A–D**, **Correct Answer Key** (A/B/C/D गोले पर क्लिक करके), और **Explanation** जाँचें व सुधारें।
5. **Question Bank में सहेजें:**
   - केवल जाँचे हुए सही प्रश्नों पर चेकबॉक्स (`☑`) लगाएँ या **`Select All`** चुनें।
   - नीचे हरे बटन **`Save [N] to Question Bank`** पर क्लिक करें। (सिस्टम डुप्लीकेट प्रश्नों को खुद ही रोक देगा।)

> **कठोर चेतावनी (Critical Rule):**  
> AI द्वारा जनरेट किए गए किसी भी प्रश्न या उत्तर को **बिना पढ़े और बिना सत्यापित किए कभी भी Question Bank में सेव न करें**। हर उत्तर-कुंजी (Answer Key) और व्याख्या की जिम्मेदारी शिक्षक की होती है।

---

## अनुभाग 5: बल्क प्रश्न इम्पोर्ट ट्यूटोरियल — PDF, Word, Excel और Copy-Paste (Bulk Question Import Tutorial)

**`AI Question Generator & Bulk Import`** टैब के भीतर दो अन्य तरीके उपलब्ध हैं: **Method B (File Upload)** और **Method C (Bulk Copy-Paste Editor)**।

### 5.1 फाइल अपलोड द्वारा इम्पोर्ट (Method B: `Import Questions from Files`)

- **फाइल अपलोड कैसे करें:**
  1. **`Browse File to Ingest`** पर क्लिक करें और अपने कंप्यूटर/मोबाइल से फाइल चुनें।
  2. फाइल पढ़ने के बाद सिस्टम अपने-आप प्रश्नों को नीचे **Staged Questions Review Workspace** में दिखा देगा।
- **फाइल फॉर्मेट की वास्तविक स्थिति (Honest Support Status):**
  - **`.txt` (सादा टेक्स्ट), `.csv` (Excel से सेव किया हुआ CSV), और `.json` फाइलें:** **पूरी तरह समर्थित (Supported)** हैं। ब्राउज़र का `FileReader` इन्हें सीधे पढ़कर अलग-अलग प्रश्न और ऑप्शन निकाल लेता है।
  - **`.pdf` (PDF फाइल), `.docx` (MS Word फाइल), और `.xlsx` (बाइनरी Excel फाइल):** फाइल पिकर में ये एक्सटेंशन दिखते जरूर हैं, लेकिन इनके अंदर से टेक्स्ट निकालने वाला **PDF/Word/XLSX पार्सर अभी उपलब्ध नहीं है** (सिस्टम इन्हें साधारण टेक्स्ट मानकर पढ़ता है, जिससे बाइनरी अक्षर खराब दिखते हैं)।
  - **Scanned PDF / Image OCR (फोटो से प्रश्न निकालना):** **अभी उपलब्ध नहीं है**।

**सर्वोत्तम समाधान (PDF / Word / Excel के लिए):**  
यदि आपके प्रश्न PDF, Word या Excel में हैं, तो फाइल को खोलकर प्रश्न **Copy (`Ctrl+C`)** करें और नीचे बताए गए **Method C: Bulk Copy-Paste Editor** में पेस्ट कर दें (या Excel फाइल को `Save As -> CSV (UTF-8)` करके अपलोड करें)।

---

### 5.2 बल्क कॉपी-पेस्ट एडिटर (Method C: `Bulk Copy-Paste Editor`)

यह बड़े पैमाने पर हिंदी या अंग्रेज़ी प्रश्न एक साथ अपलोड करने का सबसे भरोसेमंद तरीका है:

1. **`Default Subject`** ड्रॉपडाउन से अपना विषय चुनें (जैसे `General Science & Technology`) और **`Default Topic`** बॉक्स में विषय का शीर्षक लिखें (जैसे `Human Body`)।
2. यदि आप पहली बार कर रहे हैं, तो **`Load 4 Sample Questions`** बटन दबाकर सैंपल फॉर्मेट देख सकते हैं।
3. बड़े टेक्स्ट बॉक्स में अपने प्रश्न नीचे दिए गए **मान्य फॉर्मेट (Sample Bulk Format)** में पेस्ट करें:

```text
Q1. मानव शरीर में रक्त को पूरे शरीर में पंप करने वाला अंग कौन-सा है?
A) फेफड़े
B) हृदय
C) गुर्दे
D) यकृत
Answer: B
Explanation: हृदय एक पेशीय अंग है जो रक्त को पंप करके पूरे शरीर में पहुँचाता है।

Q2. लाल रक्त कणिकाओं (RBC) का मुख्य कार्य क्या है?
A) पाचन करना
B) ऑक्सीजन का परिवहन करना
C) हड्डियाँ बनाना
D) बाल उगाना
Answer: B
Explanation: हीमोग्लोबिन युक्त RBC फेफड़ों से ऊतकों तक ऑक्सीजन पहुँचाती हैं।
```

4. नीले बटन **`Parse & Ingest into Review Workspace`** पर क्लिक करें।

---

### 5.3 समीक्षा, त्रुटि सुधार, डुप्लीकेट हटाना और एक साथ सेव करना

पेस्ट या अपलोड करने के बाद नीचे **`Staged Questions Review Workspace`** में यह जाँच जरूर करें:

1. **त्रुटियों वाले प्रश्न पहचानें (`Needs Verification` फिल्टर दबाएँ):**
   - यदि किसी प्रश्न में उत्तर कुंजी छूट गई है, तो उस पर लाल बैज **`Missing Correct Key`** दिखेगा।
   - यदि 4 में से कोई विकल्प खाली रह गया है, तो **`Incomplete Options`** दिखेगा।
   - ऐसे कार्ड पर **`Edit` (पेंसिल आइकन)** दबाकर छूटा हुआ विकल्प लिखें या सही गोले `A / B / C / D` पर क्लिक करके उत्तर चुनें और **`Save Edits`** दबाएँ।
2. **डुप्लीकेट प्रश्न हटाना (Duplicate Removal):**
   - वर्कस्पेस में ऊपर-नीचे देखकर यदि एक जैसा प्रश्न दो बार दिखे, तो अतिरिक्त कार्ड के **`Trash` (हटाएँ)** आइकन पर क्लिक करें।
   - इसके अतिरिक्त, जब आप **`Save [N] to Question Bank`** दबाते हैं, तो सिस्टम स्वतः ही जाँच लेता है कि आपके Question Bank में पहले से वही प्रश्न (Exact Statement Match) मौजूद तो नहीं है — यदि होगा तो वह डुप्लीकेट को अपने-आप छोड़ देगा और बताएगा कि कितने नए प्रश्न सेव हुए।
3. **सभी सही प्रश्नों को एक साथ सहेजना:**
   - ऊपर **`Ready & Valid`** फिल्टर या **`Select All`** चुनें।
   - **`Save [N] to Question Bank`** पर क्लिक करें (या आप चाहें तो **`Add [N] to Existing Test`** से सीधे अपने किसी अप्रकाशित टेस्ट में भी जोड़ सकते हैं)।

---

## अनुभाग 6: पूर्ण टेस्ट बनाने का व्यावहारिक उदाहरण (Complete Test Creation Example)

अब हम Question Bank में सहेजे गए प्रश्नों से एक पूरा टेस्ट तैयार करेंगे।

**अभ्यास उदाहरण विवरण:**
- **Test Title:** `General Science Practice Test`
- **Category:** `Chapter Test`
- **Subject:** `General Science` *(ड्रॉपडाउन में उपलब्ध निकटतम `General Science & Technology` चुनें या लिखें)*
- **Topic:** `Human Body`
- **Questions:** `10 Questions`
- **Time Limit:** `15 Minutes`
- **Marks per Correct Answer:** अपेक्षित `1` *(सिस्टम सीमा नीचे देखें)*
- **Negative Marking:** `Enabled`, अपेक्षित `0.25` *(सिस्टम सीमा नीचे देखें)*

> **वर्तमान सिस्टम की महत्वपूर्ण सीमाएँ (Honest Notes):**
> 1. **अंक व नेगेटिव मार्किंग नियम:** `Create Assessment Form` में प्रति प्रश्न कस्टम अंक (`1 Mark`) या कस्टम नेगेटिव अंक (`0.25`) भरने का अलग इनपुट **अभी उपलब्ध नहीं है**। वर्तमान सिस्टम अपने-आप **हर प्रश्न के लिए `+2 Marks`** और Negative Marking टिक करने पर **`-0.5` प्रति गलत उत्तर** (25% नेगेटिव मार्किंग) की गणना करता है।  
> 2. **Draft विकल्प:** टेस्ट फॉर्म में **`Save as Draft` बटन अभी उपलब्ध नहीं है**। सबमिट करने पर टेस्ट सीधे **`Pending Approval`** में जाता है।

### चरण-दर-चरण टेस्ट निर्माण विधि:

1. **फॉर्म खोलें:** Teacher Dashboard पर ऊपर **`Create New Test`** बटन या **`Create Assessment Form`** टैब पर क्लिक करें।
2. **भाग 1 — `Create New Assessment Configuration` भरें:**
   - **`Test Title *`**: लिखें `General Science Practice Test`
   - **`Description & Target Audience *`**: लिखें `मानव शरीर (Human Body) अध्याय पर आधारित 10 प्रश्नों का अभ्यास टेस्ट।`
   - **`Test Category *`**: ड्रॉपडाउन से चुनें **`Chapter Test`**
   - **`Subject Domain *`**: चुनें **`General Science & Technology`**
   - **`Topic / Syllabus Scope *`**: लिखें `Human Body`
   - **`Duration (Minutes) *`**: लिखें `15`
   - **Negative Marking बॉक्स**: **`Enable Negative Marking (-0.5 per wrong answer; Option E has 0 penalty as per Ninja Rule)`** चेकबॉक्स पर टिक (`☑`) लगाएँ।
3. **भाग 2 — `Select Questions from My Question Bank` से प्रश्न चुनें:**
   - यहाँ केवल **आपके द्वारा बनाए गए प्रश्न** ही दिखाई देते हैं।
   - सर्च बॉक्स या `All Subjects` / `All Difficulties` फिल्टर से अपने `Human Body` से जुड़े प्रश्न खोजें।
   - प्रत्येक प्रश्न के सामने **चेकबॉक्स** (या **`Select`** बटन) पर क्लिक करके अपने **10 प्रश्न** चुनें। *(आप चाहें तो प्रश्न के टेक्स्ट पर क्लिक करके उसका `Author Explanation` भी जाँच सकते हैं।)*
   - *(वैकल्पिक: यदि सभी दिखाई दे रहे प्रश्न लेने हों, तो ऊपर **`Select All`** बटन दबाएँ; गलत चुनने पर **`Clear`** दबाएँ।)*
4. **भाग 3 — `Live Test Blueprint Preview` में जाँचें और सबमिट करें:**
   - नीचे प्रीव्यू बॉक्स में जाँचें कि **Questions: `10`** दिख रहा है। *(सिस्टम गणना अनुसार 10 प्रश्नों के लिए `Marks: 20` और `Negative: -0.5` दिखेगा।)*
   - आप चाहें तो किसी भी प्रश्न चिप के `X` बटन से उसे हटा सकते हैं।
   - सब कुछ सही होने पर सबसे नीचे बैंगनी-नारंगी बटन **`Submit Complete Test for Admin Approval`** पर क्लिक करें।
5. **सबमिट के बाद क्या दिखेगा?**
   - स्क्रीन स्वचालित रूप से **`My Tests Catalog`** टैब पर जाएगी।
   - सबसे ऊपर आपका नया टेस्ट **`General Science Practice Test`** दिखेगा, जिसके सामने:
     - **Status:** `PENDING APPROVAL`
     - **Approval Workflow:** `Awaiting Admin Review`

---

## अनुभाग 7: एडमिन अनुमोदन और प्रकाशन प्रक्रिया (Admin Approval Workflow)

### 7.1 संपूर्ण कार्य-प्रवाह चित्र (Flowchart)

```text
[Teacher] नया टेस्ट बनाता है (Create Assessment Form)
      │
      ▼
[Teacher] "Submit Complete Test for Admin Approval" दबाता है
      │   (Status = Pending Approval | केवल Teacher & Admin को दिखता है)
      ▼
[Admin] Admin Panel -> "Test Approvals" टैब में टेस्ट की समीक्षा करता है
      │
      ├──► (यदि सब सही है) ──► [Admin] "Approve & Publish" दबाता है
      │                              │
      │                              ▼
      │                        Status = Published (Approved by Admin)
      │                              │
      │                              ▼
      │                        [Students] Student Panel में टेस्ट लाइव!
      │
      └──► (यदि त्रुटि है) ──► [Admin] कारण लिखकर "Reject" दबाता है
                                     │
                                     ▼
                               Status = Rejected (Rejected by Admin + Note)
                                     │
                                     ▼
                               [Teacher] "My Tests Catalog" में Note पढ़ता है
                                     │
                                     ▼
                               [Teacher] पुराना टेस्ट Delete कर सुधार के साथ नया टेस्ट सबमिट करता है
```

### 7.2 Admin की समीक्षा प्रक्रिया
- एडमिन अपने **Admin Panel** के **`Test Approvals`** सेक्शन में जाकर आपका टेस्ट खोलते हैं (जहाँ लेखक का नाम, कुल प्रश्न, समय, नेगेटिव मार्किंग और हर प्रश्न व उसकी व्याख्या की जाँच की जा सकती है)।
- सब सही होने पर Admin **`Approve & Publish`** दबाते हैं, जिससे टेस्ट तुरंत विद्यार्थियों के लिए लाइव (`Published`) हो जाता है।

### 7.3 टेस्ट अस्वीकृत (Reject) होने पर Teacher क्या करें?
1. **`My Tests Catalog`** टैब खोलें।
2. `Approval Workflow` कॉलम में लाल रंग में **`Rejected by Admin`** और उसके ठीक नीचे **`Note: [Admin द्वारा लिखा कारण]`** पढ़ें (जैसे: *"प्रश्न 4 का उत्तर गलत है"* या *"कम से कम 5 प्रश्न जोड़ें"*)।
3. **`MCQ Builder (Manual)`** में नया सही प्रश्न जोड़ लें (या ध्यान रखें कि कौन-सा गलत प्रश्न हटाना है)।
4. पुराने अस्वीकृत टेस्ट की लाइन में **`Actions`** कॉलम के लाल **`Delete`** आइकन पर क्लिक करके उसे हटा दें। *(चूँकि सीधे Reject टेस्ट को `Edit` करने का बटन अभी उपलब्ध नहीं है, इसलिए Delete करके नया टेस्ट बनाना सही तरीका है।)*
5. **`Create Assessment Form`** में जाकर सही प्रश्नों के साथ पुनः **`Submit Complete Test for Admin Approval`** दबाएँ।

---

## अनुभाग 8: शिक्षक अभ्यास सत्र एवं सत्यापन चेकलिस्ट (Teacher Practice Checklist)

हर नए शिक्षक को ट्रेनिंग पूरी करने के लिए नीचे दिए गए **8 व्यावहारिक चरण** स्वयं कंप्यूटर पर करके देखने चाहिए:

1. **लॉगिन व रोल जांच:** वेबसाइट पर लॉगिन करें और सुनिश्चित करें कि Navbar में **`Student`** व **`Teacher`** दोनों स्विच दिख रहे हैं (और Teacher अकाउंट Admin से `Approved` है)।
2. **Teacher Dashboard खोलें:** Navbar से **`Teacher`** बटन दबाकर अपने 4 Stat Cards देखें।
3. **1 मैन्युअल प्रश्न बनाएँ:** **`MCQ Builder (Manual)`** में जाकर अनुभाग 3.2 वाला "हृदय" वाला प्रश्न भरें, `Option B` सही उत्तर चुनें और **`Add to My Question Bank`** दबाएँ।
4. **AI Generator से प्रश्न स्टेज करें:** **`AI Question Generator & Bulk Import`** में Method A से विषय चुनकर **`Generate Questions Now`** दबाएँ और Staged Workspace में 1 प्रश्न **`Edit`** करके जाँचें (बिना जाँचे सेव न करें)।
5. **2 बल्क प्रश्न इम्पोर्ट करें:** **Method C (Bulk Copy-Paste Editor)** में अनुभाग 5.2 वाले 2 विज्ञान प्रश्न पेस्ट करें, **`Parse & Ingest into Review Workspace`** दबाएँ, त्रुटियाँ जाँचें और **`Save to Question Bank`** दबाएँ।
6. **नया टेस्ट तैयार करें:** **`Create Assessment Form`** में `General Science Practice Test` भरें, अपने Question Bank से प्रश्न चुनें और Blueprint Preview की पुष्टि करें।
7. **Admin Approval के लिए भेजें:** **`Submit Complete Test for Admin Approval`** दबाएँ और **`My Tests Catalog`** में `PENDING APPROVAL` स्टेटस देखें।
8. **Student Panel स्विच जाँचें:** ऊपर **`Open Student Panel`** दबाकर जांचें कि आप छात्र रूप में भी वेबसाइट का उपयोग कर सकते हैं और आपका अप्रकाशित टेस्ट अभी छात्रों को दिखाई **नहीं** दे रहा है।

### त्वरित सत्यापन चेकलिस्ट (Verification Checklist)

| क्रम | जांच बिंदु (Checklist Item) | स्थिति (`[ ]`) |
| :---: | :--- | :---: |
| 1 | क्या Teacher खाता Admin द्वारा `Approved` है और Teacher Dashboard खुल रहा है? | `[ ]` |
| 2 | क्या बनाए गए प्रश्न में केवल 4 विकल्प (A–D) भरे गए हैं और Option E स्वयं नहीं लिखा गया? | `[ ]` |
| 3 | क्या Correct Answer Key सही विकल्प (A/B/C/D) पर सेट है और Explanation स्पष्ट लिखा है? | `[ ]` |
| 4 | क्या AI/Bulk से लिए गए सभी प्रश्नों को सेव करने से पहले `Staged Review Workspace` में जाँचा गया? | `[ ]` |
| 5 | क्या टेस्ट फॉर्म में `Test Title`, `Category`, `Subject`, `Topic`, `Duration` सही भरे गए? | `[ ]` |
| 6 | क्या टेस्ट में कम से कम 1 (और अभ्यास हेतु 10) प्रश्न Question Bank से चुने गए? | `[ ]` |
| 7 | क्या सबमिट करने के बाद `My Tests Catalog` में `PENDING APPROVAL` दिखाई दे रहा है? | `[ ]` |
| 8 | क्या किसी गलत/अप्रकाशित टेस्ट को हटाने का नियम समझ आ गया है? | `[ ]` |

---

## अनुभाग 9: सामान्य गलतियाँ और उनसे बचाव (Common Mistakes)

नए शिक्षक आमतौर पर ये **9 गलतियाँ** करते हैं — इनसे अवश्य बचें:

1. **गलत उत्तर कुंजी (Wrong Answer Key) सेट करना:**  
   *गलती:* Option C में सही उत्तर लिखकर गलती से `Option A` या `Option B` चुन लेना।  
   *बचाव:* सेव करने से पहले हमेशा `Correct Answer Key` और Question Bank की हरी पट्टी वाले उत्तर को दोबारा मिलाएँ।
2. **एक ही प्रश्न बार-बार डालना (Duplicate Questions):**  
   *गलती:* बल्क इम्पोर्ट और मैन्युअल दोनों से एक जैसा प्रश्न जोड़ देना।  
   *बचाव:* स्टेज्ड वर्कस्पेस में `Trash` आइकन से डुप्लीकेट हटाएँ और सिस्टम की ऑटो-डुप्लीकेट चेतावनी पर ध्यान दें।
3. **अधूरे विकल्प या Option E टाइप कर देना (Missing Options / Writing Option E):**  
   *गलती:* केवल 3 ऑप्शन लिखना या Option D में "इनमें से कोई नहीं / Skip" की जगह Option E मैन्युअल जोड़ने की कोशिश करना।  
   *बचाव:* चारों विकल्प A, B, C, D हमेशा पूरे भरें; Option E परीक्षा में सिस्टम स्वचालित जोड़ता है।
4. **गलत Subject या Topic चुनना (Wrong Subject / Topic):**  
   *गलती:* विज्ञान के प्रश्न को `Indian Polity` में सेव कर देना, जिससे बाद में फिल्टर करने पर प्रश्न न मिले।  
   *बचाव:* प्रश्न और टेस्ट दोनों में हमेशा सही Subject और स्पष्ट Topic का उपयोग करें।
5. **अस्पष्ट या अधूरी भाषा (Unclear Question Wording):**  
   *गलती:* प्रश्न ऐसा लिखना जिसके दो अर्थ निकलें या वर्तनी (Spelling) गलत हो।  
   *बचाव:* छोटे, सटीक और मानक प्रतियोगी परीक्षा स्तर के वाक्य लिखें।
6. **व्याख्या खाली या कामचलाऊ छोड़ना (Missing / Weak Explanation):**  
   *गलती:* `Explanation` में केवल `"B सही है"` लिखकर छोड़ देना।  
   *बचाव:* कम से कम 1–2 पंक्ति में तथ्यात्मक कारण लिखें, क्योंकि परीक्षा के बाद विद्यार्थी इसी से सीखते हैं।
7. **अंक नियम न समझना (Wrong Marks Expectation):**  
   *गलती:* यह मान लेना कि कस्टम `1 Mark` प्रति प्रश्न सेट हो जाएगा।  
   *बचाव:* ध्यान रखें कि वर्तमान सिस्टम प्रत्येक सही उत्तर के लिए **`+2 Marks`** गिनता है (कस्टम अंक सेटिंग अभी उपलब्ध नहीं है), इसलिए Blueprint Preview में कुल अंक जांचें।
8. **नेगेटिव मार्किंग विकल्प भूल जाना (Wrong Negative Marking Toggle):**  
   *गलती:* प्रतियोगी मॉक टेस्ट बनाते समय `Enable Negative Marking` चेकबॉक्स टिक करना भूल जाना (या अनचाहे टेस्ट में टिक कर देना)।  
   *बचाव:* सबमिट करने से पहले `Live Test Blueprint Preview` में `Negative: -0.5` या `0` जरूर देखें।
9. **बिना प्रीव्यू जाँचे टेस्ट सबमिट कर देना (Submitting Without Checking):**  
   *गलती:* AI/Bulk से आए प्रश्नों या चुने गए प्रश्नों की गिनती देखे बिना तुरंत **`Submit Complete Test for Admin Approval`** दबा देना।  
   *बचाव:* हर टेस्ट को भेजने से पहले Blueprint Preview और Question Bank के व्याख्या पैनल में 1 बार अवश्य पढ़ें।

---

## अनुभाग 10: प्रशिक्षक द्वारा बोलकर समझाने की स्क्रिप्ट (Ready-to-Speak Hindi Training Script)

*(प्रशिक्षक कंप्यूटर स्क्रीन सामने रखकर नए शिक्षकों से बिल्कुल स्वाभाविक और सरल हिंदी में इस प्रकार बात कर सकते हैं:)*

> **"नमस्कार शिक्षकों! आज के इस लाइव प्रशिक्षण सत्र में आप सभी का स्वागत है। आज हम सीखेंगे कि हमारे परीक्षा मंच `Sanskar-X-NarutoQuiz` के Teacher Panel का उपयोग करके आप बहुत ही आसानी से प्रश्न कैसे बना सकते हैं, पूरा मॉक टेस्ट कैसे तैयार कर सकते हैं और उसे विद्यार्थियों के लिए लाइव होने हेतु Admin Approval के लिए कैसे भेज सकते हैं।**
>
> **सबसे पहले आइए वेबसाइट के लॉगिन पेज पर चलते हैं। देखिए, ऊपर दाईं ओर नारंगी रंग का `Login` बटन है। जब कोई नया शिक्षक पहली बार जुड़ता है, तो वह या तो `Continue with Google` से साइन इन करता है या फिर `Create an Account` पर क्लिक करके `Teacher` विकल्प चुनता है। इसमें आपको अपना नाम, ईमेल, योग्यता और मुख्य विषय भरना होता है। एक बहुत अच्छी बात यह है कि एक ही खाते से आप Student Panel पर प्रैक्टिस भी कर सकते हैं और Approval मिलने के बाद Teacher Panel पर टेस्ट भी बना सकते हैं। जब तक Admin आपका Teacher खाता Approve करते हैं, तब तक आप Student Panel पर सारे फीचर चला सकते हैं।**
>
> **अब देखिए, जैसे ही Admin हमें Approve कर देते हैं, ऊपर बार में `Student` के साथ `Teacher` बटन काम करने लगता है। मैं इस पर क्लिक करता हूँ — यह खुल गया हमारा `Teacher Dashboard`! यहाँ सबसे ऊपर आपको चार कार्ड दिख रहे हैं: आपने कितने टेस्ट बनाए, कितने Publish हुए, कितने Pending हैं और आपके `My Question Bank` में कितने प्रश्न जमा हैं। ध्यान रखिएगा, अभी टीचर पैनल में अलग से Student Results, Notifications या Settings के टैब नहीं दिए गए हैं — आपका मुख्य सारा काम इन चार टैब्स से ही होता है: `My Tests Catalog`, `Create Assessment Form`, `AI Question Generator & Bulk Import` और `MCQ Builder (Manual)`।**
>
> **चलिए सबसे पहले चौथे टैब `MCQ Builder (Manual)` पर क्लिक करके एक प्रश्न बनाते हैं। उदाहरण के लिए हम General Science का एक सरल प्रश्न लिखते हैं: 'मानव शरीर में रक्त को पूरे शरीर में पंप करने वाला अंग कौन-सा है?' अब हम चारों विकल्प भरते हैं — Option A में फेफड़े, Option B में हृदय, Option C में गुर्दे और Option D में यकृत। यहाँ एक ज़रूरी नियम समझ लीजिए: हमारी परीक्षा `5-Option OMR Standard` पर चलती है, जहाँ पांचवाँ विकल्प Option E ('अनुत्तरित') होता है ताकि नेगेटिव मार्किंग से बचा जा सके। लेकिन आपको यहाँ Option E नहीं लिखना है — वह सिस्टम परीक्षा में अपने-आप जोड़ता है। आपको केवल A, B, C, D लिखना है और `Correct Answer Key` में सही विकल्प चुनना है। अभी हमने `Option B` चुना। नीचे Subject और Difficulty `Easy` चुनकर अच्छी-सी व्याख्या लिख दीजिए और `Add to My Question Bank` पर क्लिक कर दीजिए। देखिए, आपका प्रश्न सुरक्षित हो गया! ध्यान दें कि इस मैन्युअल फॉर्म में अभी फोटो अपलोड करने या 1 नंबर/कस्टम टॉपिक बदलने का बॉक्स नहीं है, सिस्टम अपने-आप `2 Marks` प्रति प्रश्न सेट करता है।**
>
> **अब आइए तीसरे टैब `AI Question Generator & Bulk Import` पर। यदि आप एक साथ कई प्रश्न जोड़ना चाहते हैं, तो यहाँ तीन विकल्प हैं। पहले बॉक्स में `Generate Questions with AI` है — ध्यान रखिएगा कि अभी लाइव सर्वर AI कनेक्शन जुड़ा नहीं है, इसलिए यहाँ से अभी पूर्व-निर्मित सैंपल प्रश्न टेम्पलेट लोड होते हैं। दूसरा है फाइल अपलोड, जहाँ से आप `.txt`, `.csv` या `.json` फाइल सीधे डाल सकते हैं। अगर आपके प्रश्न PDF या Word में हैं, तो उनका टेक्स्ट कॉपी करके तीसरे बॉक्स `Bulk Copy-Paste Editor` में पेस्ट कीजिए और `Parse & Ingest into Review Workspace` दबाइए। एक सुनहरा नियम हमेशा याद रखिए: कोई भी प्रश्न — चाहे AI से आया हो या बल्क पेस्ट से — नीचे Review Workspace में बिना पढ़े, बिना सही उत्तर चेक किए और बिना डुप्लीकेट हटाए कभी भी Question Bank में सेव मत कीजिए!**
>
> **अब हमारे प्रश्न Question Bank में तैयार हैं, तो चलिए दूसरे टैब `Create Assessment Form` में चलकर एक पूरा टेस्ट बनाते हैं। टेस्ट का नाम लिखिए `General Science Practice Test`, कैटेगरी में `Chapter Test`, विषय और टॉपिक में `Human Body`, और समय `15` मिनट रखिए। अगर नेगेटिव मार्किंग रखनी है, तो इस चेकबॉक्स पर टिक लगाइए — सिस्टम हर गलत उत्तर पर `-0.5` अंक काटेगा। अब थोड़ा नीचे आइए: `Select Questions from My Question Bank` में आपको केवल आपके अपने बनाए प्रश्न दिखेंगे। अन्य किसी शिक्षक के प्रश्न यहाँ नहीं दिखते। इनमें से अपने 10 प्रश्नों पर टिक लगाइए। नीचे `Live Test Blueprint Preview` में गिनती जांच लीजिए और `Submit Complete Test for Admin Approval` बटन दबा दीजिए।**
>
> **देखिए! स्क्रीन सीधे `My Tests Catalog` पर आ गई है और हमारे टेस्ट के सामने लिखा है `PENDING APPROVAL — Awaiting Admin Review`। कोई भी शिक्षक अपना टेस्ट खुद Publish नहीं कर सकता। अब Admin अपने पैनल से इसे जांचेंगे। अगर सब सही रहा, तो वे `Approve & Publish` दबाएंगे और टेस्ट सभी विद्यार्थियों के लिए लाइव हो जाएगा। अगर किसी कारण से टेस्ट `Rejected` होता है, तो यहीं `Note` में कारण लिखा आएगा — तब आप पुराने टेस्ट को `Delete` करके नया सुधारा हुआ टेस्ट भेज सकते हैं।**
>
> **तो शिक्षकों, यह था पूरे Teacher Panel का आसान और व्यावहारिक सफर। अब आप सब अपने-अपने सिस्टम पर कम से कम एक मैन्युअल प्रश्न, दो बल्क प्रश्न और एक अभ्यास टेस्ट सबमिट करके देखें। कहीं भी कोई प्रश्न हो तो बेझिझक पूछिए। धन्यवाद!"**
