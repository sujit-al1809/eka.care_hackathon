// Comprehensive Multilingual Medical Knowledge Base for Indian Languages
// Covers: Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Malayalam

export const MEDICAL_TRAINING_DATA = [
    // ==========================================
    // HINDI (हिंदी) - NORTH INDIA
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "hindi",
        condition: "diarrhea",
        text: "Patient: Mujhe loose motion ho rahe hain, subah se 5-6 baar ho gaye (I'm having loose motions, 5-6 times since morning)\nDoctor: Aapko diarrhea hai. Turant ORS shuru karein - Electral ya Enerzal 1 packet 1 liter paani mein. Poora din thoda thoda peete rahein. Racecadotril 100mg din mein 3 baar lein. Dudh, spicy khana avoid karein. Agar khoon aaye ya bukhar 101°F se zyada ho toh hospital jaayein."
    },
    {
        language: "hindi",
        condition: "gastroenteritis",
        text: "Patient: Pet kharab hai, ulti bhi ho rahi hai (Stomach upset, also vomiting)\nDoctor: Gastroenteritis lag raha hai. Sabse zaroori hydration hai - ORS ya ghar ka ghol (6 chammach cheeni + aadha chammach namak 1L paani). Ulti ke liye Ondansetron 4mg lein. Khichdi, dahi chawal, kela khayein. Agar 24 ghante mein better na ho toh doctor ko dikhayein."
    },
    {
        language: "hindi",
        condition: "pediatric_diarrhea",
        text: "Patient: Bachhe ko dast lag gaye hain, 2 saal ka hai (Child has diarrhea, 2 years old)\nDoctor: Bachhe mein diarrhea serious ho sakta hai. ORS choti choti sips mein har 5 minute dein. Zinc syrup 10ml roz 10-14 din tak. Breastfeeding jari rakhein agar chal rahi hai. Red flags: aankhein dhasi hui, aansu na aayein, peshab na ho - turant hospital le jaayein."
    },
    
    // Sugar / Diabetes
    {
        language: "hindi",
        condition: "diabetes_high",
        text: "Patient: Mera sugar badh gaya hai, fasting 200 tha (My sugar increased, fasting was 200)\nDoctor: Fasting sugar 200 mg/dL bahut high hai, diabetes control mein nahi hai. Target fasting 100 se kam hona chahiye. Metformin ki dose badhani padegi ya Glimepiride add karni hogi. HbA1c test karwayein. Chawal, roti kam karein, sabzi badhayein. Roz 30 minute walk karein."
    },
    {
        language: "hindi",
        condition: "diabetes_uncontrolled",
        text: "Patient: Sugar ki tablet kha raha hoon par control nahi ho raha (Taking sugar tablets but not controlled)\nDoctor: Dawai review karni hogi. Abhi kya le rahe ho? Agar sirf Metformin hai toh Vildagliptin ya Glimepiride add kar sakte hain. Tests: HbA1c, kidney function, urine microalbumin. Diet: white rice, maida, meetha avoid karein. Karela, methi, jamun faydemand hain."
    },
    {
        language: "hindi",
        condition: "diabetic_neuropathy",
        text: "Patient: Pair sunn ho rahe hain, sugar patient hoon (Feet getting numb, I'm diabetic)\nDoctor: Yeh diabetic neuropathy hai - high sugar se nerves damage hoti hain. Methylcobalamin 1500mcg roz + Pregabalin 75mg raat ko shuru karein. Sugar strict control mein rakhna zaroori hai. Roz pair check karein - cuts, wounds ke liye. Kabhi bhi nange pair mat chalein."
    },
    
    // Body Pain / Myalgia
    {
        language: "hindi",
        condition: "body_pain",
        text: "Patient: Poora badan dard kar raha hai (Whole body is aching)\nDoctor: Badan dard ke kai kaaran ho sakte hain. Bukhar hai? Viral infection tha recently? Monsoon mein dengue, chikungunya bhi ho sakta hai. Abhi Paracetamol 650mg din mein 3 baar lein, aaram karein, paani piyen. Agar bukhar ho toh CBC aur dengue test karwayein."
    },
    {
        language: "hindi",
        condition: "vitamin_d_deficiency",
        text: "Patient: Haath pair mein dard, uthne mein dikkat hoti hai (Pain in limbs, difficulty getting up)\nDoctor: Aise symptoms Vitamin D deficiency mein common hain - India mein bahut logon ko hota hai. Test karwayein: Vitamin D, calcium, ESR. Agar Vitamin D kam hai (usually <10) toh Cholecalciferol 60000 IU hafta mein ek baar 8 weeks tak lein."
    },
    
    // BP / Hypertension
    {
        language: "hindi",
        condition: "hypertension_stage2",
        text: "Patient: BP high aa raha hai, 160/100 tha (BP coming high, was 160/100)\nDoctor: Stage 2 hypertension hai - dawai zaroor leni hogi. Amlodipine 5mg subah shuru karein. Namak kam karein - 5g/din se kam, achar, papad avoid karein. 2 hafte baad BP check karwayein. Target: 130/80 se kam. Kidney function aur ECG bhi karwa lein."
    },
    {
        language: "hindi",
        condition: "hypertensive_crisis",
        text: "Patient: Sir mein dard tha, BP check kiya toh bahut high tha (Had headache, BP was very high when checked)\nDoctor: Headache ke saath high BP serious hai. Kitna tha reading? Agar 180/120 se zyada hai toh emergency hai - aaram karein, Amlodipine 5mg lein, 1 ghante baad dobara check karein. Agar chest pain, nazar mein problem, ya weakness ho toh turant hospital jaayein."
    },
    
    // Fever
    {
        language: "hindi",
        condition: "malaria_fever",
        text: "Patient: Bukhar hai, thand lag ke aata hai (Have fever, comes with chills)\nDoctor: Kaanpte hue bukhar - malaria ho sakta hai, especially endemic area mein. Malaria test (RDT aur slide) karwayein, CBC bhi. Agar malaria positive aaye toh species ke hisaab se treatment milega. Paracetamol 650mg fever ke liye. Hydration maintain karein."
    },
    {
        language: "hindi",
        condition: "pediatric_fever",
        text: "Patient: Bachhe ko 5 din se bukhar hai (Child has fever for 5 days)\nDoctor: 5 din se zyada bukhar bachhe mein concerning hai. Rule out: typhoid, dengue, UTI. Tests turant: CBC with ESR, Widal, blood culture, urine culture, dengue test. Paracetamol syrup weight ke hisaab se dein. Agar rash, laal aankhein, fatey hue honth dikhen - Kawasaki disease ke liye urgent pediatrician dikhayen."
    },
    
    // Dengue
    {
        language: "hindi",
        condition: "dengue_management",
        text: "Patient: Dengue positive hai, platelets 50000 hain (Dengue positive, platelets 50000)\nDoctor: Dengue mein platelets 50000 - ghar pe care ho sakti hai par strict monitoring chahiye. Hydration bahut zaroori - 3-4 liter roz (ORS, nariyal pani, juice). SIRF Paracetamol - Ibuprofen/Aspirin bilkul nahi (bleeding risk). Roz CBC karwayein. Warning signs: ulti, pet dard, bleeding, kamzori - hospital admit ho jaayein."
    },
    {
        language: "hindi",
        condition: "dengue_suspicion",
        text: "Patient: Baarish ke season mein aankh ke peeche dard hai aur bukhar (Eye pain behind eyes and fever in rainy season)\nDoctor: Retro-orbital headache aur fever monsoon mein - classic dengue presentation. NS1 antigen test karwayein agar 5 din se kam bukhar hai, ya IgM/IgG agar zyada din hain. Platelet count ke liye CBC. Aggressive hydration shuru karein. Paracetamol pain ke liye. Koi bhi NSAID mat lein."
    },
    
    // Gas / Acidity
    {
        language: "hindi",
        condition: "gas_bloating",
        text: "Patient: Pet mein gas banti hai, bloating rehti hai (Gas forms in stomach, bloating)\nDoctor: Gas aur bloating common hai kuch foods se (rajma, chole, gobhi). Pantoprazole 40mg khali pet subah, Domperidone 10mg khana khane se pehle lein. Soda drinks avoid karein, dheere dheere chew karein, khane ke baad walk karein. Agar persist kare toh H. pylori test karwa lein."
    },
    {
        language: "hindi",
        condition: "gerd",
        text: "Patient: Seene mein jalan, khatta paani aata hai (Burning in chest, sour water comes up)\nDoctor: GERD hai - acid reflux. Pantoprazole 40mg khali pet + Domperidone 10mg shuru karein. Khane ke 2 ghante baad hi lete. Chai, coffee, spicy, late dinner avoid karein. Bed ka headside thoda oocha rakhein. 2 hafte mein aaram na mile ya nigalne mein dikkat ho toh endoscopy karwayein."
    },

    // Emergency - Cardiac
    {
        language: "hindi",
        condition: "heart_attack",
        text: "Patient: Seene mein bharipan hai aur baayen haath mein dard (Heaviness in chest and left arm pain)\nDoctor: EMERGENCY - yeh heart attack ke classic signs hain. TURANT ACTION: 1) Ambulance bulayein ya cardiac facility wale hospital jaayein ABHI. 2) Aspirin 325mg chaba lein agar allergy na ho. 3) Aadhe baithe position mein aaram karein. 4) Chahe dard aata-jaata ho, ignore mat karein. Har minute heart muscle mar rahi hai. Khud drive mat karein."
    },
    
    // Emergency - Stroke
    {
        language: "hindi",
        condition: "stroke",
        text: "Patient: Papa ka ek side ka haath pair kaam nahi kar raha (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - ek taraf ki kamzori stroke ka sign hai. TURANT ambulance bulayein ya CT scan wale hospital jaayein. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL hai - clot treatment sirf 4.5 ghante mein kaam karta hai. Exact time note karein jab symptoms shuru hue. Muh se kuch mat dein."
    },

    // ==========================================
    // MARATHI (मराठी) - MAHARASHTRA
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "marathi",
        condition: "diarrhea",
        text: "Patient: Mala julabh hot aahet, sakalpasun 6-7 vela zale (I'm having loose motions, 6-7 times since morning)\nDoctor: Tumhala diarrhea aahe. Lagech ORS ghya - Electral kinva Enerzal 1 packet 1 liter panyat. Divas bhar thoda thoda peet raha. Racecadotril 100mg divas madhe 3 vela ghya. Dudh, tikhat avoid kara. Raktashi julabh kinva taap 101°F peksha jast asel tar hospital la ja."
    },
    {
        language: "marathi",
        condition: "gastroenteritis",
        text: "Patient: Potacha tras aahe, ulti pan hote (Stomach trouble, vomiting also)\nDoctor: Gastroenteritis disate. Saglyat mahattvache hydration - ORS kinva gharcha sol (6 chamche sakhar + ardha chamcha meeth 1L panyat). Ulti sathi Ondansetron 4mg ghya. Khichdi, dahi bhat, kel khava. 24 tasanmadhe bara nahi zala tar doctor la dakhva."
    },
    {
        language: "marathi",
        condition: "pediatric_diarrhea",
        text: "Patient: Lekarala hasagedya laglya, 3 varshache aahe (Child has diarrhea, 3 years old)\nDoctor: Lekaranmadhe diarrhea gambhir asu shakte. ORS lahanshansi choti sips madhe dar 5 minute dya. Zinc syrup 10ml roj 10-14 divas. Breastfeeding chalu theva. Dhoka: dole khol gele, ashru nahi, lagna nahi - lagech hospital la nya."
    },
    
    // Sugar / Diabetes
    {
        language: "marathi",
        condition: "diabetes_high",
        text: "Patient: Maza sugar vadhla aahe, fasting 190 hota (My sugar increased, fasting was 190)\nDoctor: Fasting sugar 190 mg/dL khup jast aahe, diabetes control madhe nahi. Target fasting 100 peksha kami pahije. Metformin chi dose vadhvavi lagel kinva Glimepiride add karavi lagel. HbA1c test karva ghya. Bhat, roti kami kara, bhaji vadhva. Roj 30 minute chalane kara."
    },
    {
        language: "marathi",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes aahe, pay bhadh hot aahet (Have diabetes, feet getting numb)\nDoctor: He diabetic neuropathy aahe - jast sugar mule nerves kharab hotat. Methylcobalamin 1500mcg roj + Pregabalin 75mg ratri suru kara. Sugar strict control la theva. Roj pay tapasa - jakmache, wounds sathi. Kadhi pan anvaani pay chalu naka."
    },
    {
        language: "marathi",
        condition: "diabetes_symptoms",
        text: "Patient: Sagla vela thakva, paani piun pan thakva jaate (Always tired, feeling thirsty even after drinking water)\nDoctor: Jast tahan ani thakva - he diabetes che lakshan asu shakte. Random sugar test karva ghya turant. Agar 200 peksha jast asel tar diabetes confirm. Fasting test ani HbA1c pan kara. Tab ghetli tar paani 3-4 liter pya. Goad padarth avoid kara."
    },
    
    // Body Pain
    {
        language: "marathi",
        condition: "body_pain",
        text: "Patient: Sarva angat dukhat aahe (Whole body is paining)\nDoctor: Sarva angat dukh - kai karane asu shaktat. Taap aahe ka? Recent viral infection hota ka? Monsoon madhe dengue, chikungunya pan asu shakte. Ata Paracetamol 650mg divas madhe 3 vela ghya, aram kara, paani pya. Taap asel tar CBC ani dengue test karva ghya."
    },
    {
        language: "marathi",
        condition: "knee_pain",
        text: "Patient: Guda dukhte, uthta yet nahi (Knees hurt, can't get up)\nDoctor: Gudyache dukh - 50 nantar common aahe, osteoarthritis asu shakte. Management: weight kami kara jast asel tar, physiotherapy kara, quadriceps exercises shika. Garam shek ghya. Medicine: Paracetamol pahila, Aceclofenac lagla tar. Jine, mandukasan, palti maran avoid kara."
    },
    
    // BP / Hypertension
    {
        language: "marathi",
        condition: "hypertension",
        text: "Patient: BP vadhla aahe, 150/95 hota (BP increased, was 150/95)\nDoctor: Hypertension aahe - aushadh lagel. Amlodipine 5mg sakali suru kara. Meeth kami kara - 5g/divas peksha kami, lonche, papad avoid kara. 2 athavdya nantar BP check kara. Target: 130/80 peksha kami. Kidney function ani ECG pan karva ghya."
    },
    {
        language: "marathi",
        condition: "hypertensive_crisis",
        text: "Patient: Dokha dukhat aahe, BP check kela tar khup jast hota (Headache, BP was very high when checked)\nDoctor: Dokha dukhne ani jast BP - gambhir aahe. Kiti hota reading? 180/120 peksha jast asel tar emergency aahe. Aram kara, Amlodipine 5mg ghya, 1 tasanantar parat check kara. Chhati dukhte, nazar madhe problem, kamzori asel tar lagech hospital ja."
    },
    
    // Fever / Dengue
    {
        language: "marathi",
        condition: "monsoon_fever",
        text: "Patient: Pawsalyat taap aahe ani ang dukhte (Fever in monsoon and body pain)\nDoctor: Pawsalyat taap ani ang dukh - dengue cha shanka aahe. NS1 test karva ghya agar taap 5 divas peksha kami, kinva IgM/IgG agar jast divas aahet. Platelet sathi CBC. Aggressive hydration suru kara - 3-4 liter roj. Fakt Paracetamol - kuthlahe NSAID nahi."
    },
    {
        language: "marathi",
        condition: "dengue_management",
        text: "Patient: Dengue positive ala, platelets 45000 (Dengue positive, platelets 45000)\nDoctor: Dengue madhe platelets 45000 - careful monitoring lagel. Critical nahi ajun pan approaching aahe. Admit kara agar: platelets 40000 peksha kami, ulti thambt nahi, potdukh, bleeding, kinva paani piun shakle nahi. Gharat: aram, fluids, fakt paracetamol. Roj platelet check karva lagel."
    },
    
    // Typhoid
    {
        language: "marathi",
        condition: "typhoid",
        text: "Patient: 10 divsanpasun taap aahe, potdukh aahe (Fever for 10 days, stomach pain)\nDoctor: Lamb taap ani potdukh - typhoid cha shanka. Widal test karva ghya (7 divas nantar), blood culture (best), CBC. Typhoid confirm zala tar: Azithromycin 1g roj 5-7 divas kinva Cefixime 200mg divas madhe 2 vela 14 divas. Mawaleli, pachali asel ashi bhaji khava. Poorna course purna kara."
    },
    
    // Acidity
    {
        language: "marathi",
        condition: "gerd",
        text: "Patient: Potamadhe jalan hote, khatta pani yete (Burning in stomach, sour water comes)\nDoctor: GERD aahe - acid reflux. Pantoprazole 40mg rikamya poti + Domperidone 10mg suru kara. Jevnanantar 2 tas zopla nahi. Chai, coffee, tikhat, ushira jevna avoid kara. Bed cha headside thoda vadhva. 2 athavdyat aram nahi milla tar endoscopy karva lagel."
    },
    
    // Women's Health
    {
        language: "marathi",
        condition: "menorrhagia",
        text: "Patient: Menses khup jast yetat, guthle yetat (Periods very heavy, getting clots)\nDoctor: Menorrhagia aahe - evaluation lagel. Kiti divas periods yetat? Pads/tampons divas madhe kiti (6-8 peksha jast = heavy)? Test kara: CBC (anemia sathi), pelvic ultrasound (fibroids, polyps sathi). Symptoms sathi: Tranexamic acid (Pause) 500mg divas madhe 3 vela periods madhe. Anemia asel tar iron supplements zaroor."
    },
    {
        language: "marathi",
        condition: "preeclampsia",
        text: "Patient: Pregnancy madhe pay sujle aahet ani BP vadhla (Feet swollen in pregnancy and BP increased)\nDoctor: WARNING - pregnancy madhe suj ani jast BP - PREECLAMPSIA asu shakte - ai ani babycha sathi dhoka. BP reading kiti aahe? Dokha dukhte, nazar problem, potdukh varti aahe? Hoy tar: LAGECH hospital ja. Halka asel tar: bed rest, meeth kami, BP dar 4 tasanla check. OB la dikha - lavkar delivery lagel kadasht."
    },
    
    // Skin Problems
    {
        language: "marathi",
        condition: "skin_rash",
        text: "Patient: Angavar pudle ale aahet, khajto (Rashes on body, itching)\nDoctor: Pudle ani khaj - allergic reaction, gharamula kinva fungal infection asu shakte. Kahi nava khalla, aushadh, sabun vaparla? Ata: Cetirizine 10mg ratri, Calamine lotion lagva. Fungal asel (ring shape, kharkhate): Clotrimazole cream divas madhe 2 vela. Gharamule (summer): sukha theva, cotton kapde, powder."
    },
    {
        language: "marathi",
        condition: "fungal_infection",
        text: "Patient: Botanmadhe fungal infection aahe (Fungal infection between toes)\nDoctor: Tinea pedis - humid climate madhe common. Pay sukha theva, cotton moje ghala, roj badhla. Terbinafine cream lagva 2-4 athavde. Antifungal powder (Candid) bootamadhe ghala. Towel/boot share karu naka. Bara nahi zala tar: Fluconazole 150mg athavdyatun ek vela 4 athavde."
    },
    
    // Emergency
    {
        language: "marathi",
        condition: "vision_emergency",
        text: "Patient: Ek dolyanchi nazar achanak geli (Vision suddenly gone from one eye)\nDoctor: EMERGENCY - achanak ek dolyachi nazar jane. Retinal artery occlusion (dolyacha stroke), retinal detachment, kinva optic neuritis asu shakte. LAGECH eye hospital la ja. 90-120 minutanmadhe gel tar artery occlusion bachavel shakte. Prakashache chamak disle ka aadhi? Diabetic aahet ka? BP check kara. Time critical aahe - dolyacha heart attack sarkha."
    },
    {
        language: "marathi",
        condition: "heart_attack",
        text: "Patient: Chhati dukhte ani dava haath dukhto (Chest pain and left arm pain)\nDoctor: EMERGENCY - he heart attack che signs aahet. LAGECH ACTION: 1) Ambulance bolva kinva cardiac hospital ja ATTA. 2) Aspirin 325mg chava agar allergy nahi. 3) Adha baslela position madhe aram kara. 4) Dukh yet-jaun asu shakte pan ignore naka karu. Swata drive naka karu."
    },

    // ==========================================
    // TAMIL (தமிழ்) - TAMIL NADU
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "tamil",
        condition: "diarrhea",
        text: "Patient: Enakku vayiru pokiradhu, kaalaiyil irundhu 6 thadavai aachu (I have loose motions, 6 times since morning)\nDoctor: Ungalukku diarrhea irukku. Udanadi ORS aarambiungal - Electral or Enerzal 1 packet 1 liter thanneeril. Naal muzhudum konjam konjama kudingal. Racecadotril 100mg naaluku 3 vela saapidungal. Paal, spicy unavugal thavirkavum. Ratham vandhal or kaichal 101°F ku mela irundhal hospital pongal."
    },
    {
        language: "tamil",
        condition: "gastroenteritis",
        text: "Patient: Vayiru kazhichchi, vaandhi varudhu (Stomach upset, vomiting)\nDoctor: Gastroenteritis maadiri therikiradhu. Munnaadiyaaga hydration - ORS or veettu kalandha (6 spoon sakkarai + arai spoon uppu 1L thanneeril). Vaandhi ku Ondansetron 4mg. Kanji, thayir saadam, vaazhai pazham saapidungal. 24 maani neram la better aagalanna doctor kita pongal."
    },
    {
        language: "tamil",
        condition: "pediatric_diarrhea",
        text: "Patient: Kuzhanthaiku vayiru pokiradhu, 2 vayasu (Child has diarrhea, 2 years old)\nDoctor: Kuzhanthaigalil diarrhea serious aagalam. ORS siru siru vaayi 5 nimisham ku oru thadavai kudungal. Zinc syrup 10ml thinam 10-14 naatkal. Breastfeeding thodarungal. Abaayam: kannkal ukkarndha, kanneer varala, siruneer illai - udane hospital koNdu pongal."
    },
    
    // Sugar / Diabetes
    {
        language: "tamil",
        condition: "diabetes_high",
        text: "Patient: Sugar adhigamaachi, fasting 180 vandhadhu (Sugar increased, fasting was 180)\nDoctor: Fasting sugar 180 mg/dL romba adhigam, diabetes control la illai. Target fasting 100 ku keezh irukkaNum. Metformin dose athikarikkaNum or Glimepiride add pannaNum. HbA1c test edungal. Arisi, roti kuRaingal, kaaikari koottungal. Thinam 30 nimisham nadungal."
    },
    {
        language: "tamil",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes irukku, kaal marandhu pokiradhu (Have diabetes, feet getting numb)\nDoctor: Idhu diabetic neuropathy - athiga sugar la nerves kedukiradhu. Methylcobalamin 1500mcg thinam + Pregabalin 75mg iravu aarambiungal. Sugar strict control la vaikkaNum. Thinam kaal paariungal - vettukkal, wounds ku. Evvalavu neram paadam pottu nadakkaadheergal."
    },
    {
        language: "tamil",
        condition: "diabetes_symptoms",
        text: "Patient: Romba thaaham edukkiradhu, adipadi siruneer pokiradhu (Very thirsty, urinating frequently)\nDoctor: Athiga thaaham, adipadi siruneer - diabetes symptoms aagalam. Udane random sugar test pannungal. 200 ku mela irundhal diabetes confirm. Fasting test um HbA1c um pannungal. Thanni 3-4 liter kudingal. Sweet unavugal avoid pannungal."
    },
    
    // Body Pain
    {
        language: "tamil",
        condition: "body_pain",
        text: "Patient: Udambu muzhudum vali (Whole body pain)\nDoctor: Udambu vali - pala kaaranangal irukkalam. Kaichal irukka? Recent viral infection irundhatha? Monsoon la dengue, chikungunya um irukkalam. Ippo Paracetamol 650mg naaluku 3 vela, rest edungal, thanni kudingal. Kaichal irundhal CBC and dengue test pannungal."
    },
    {
        language: "tamil",
        condition: "vitamin_d_deficiency",
        text: "Patient: Kai kaal vali, ezhundhu nikka mudiyala (Hands and legs pain, can't stand up)\nDoctor: Indha symptoms Vitamin D deficiency la common - India la romba perkku irukku. Tests pannungal: Vitamin D, calcium, ESR. Vitamin D kuRaivaa irundhal (usually <10) Cholecalciferol 60000 IU vaaratthukku onnu 8 weeks edungal."
    },
    
    // BP / Hypertension
    {
        language: "tamil",
        condition: "hypertension",
        text: "Patient: BP high aa irukku, 155/100 vandhadhu (BP is high, was 155/100)\nDoctor: Stage 2 hypertension irukku - marundhu edukkaNdum. Amlodipine 5mg kaalaiyil aarambiungal. Uppu kuRaingal - 5g/naal ku keezhae, oorugaai, papad avoid pannungal. 2 vaaram kazhithu BP check pannungal. Target: 130/80 ku keezh. Kidney function and ECG um pannungal."
    },
    {
        language: "tamil",
        condition: "hypertensive_crisis",
        text: "Patient: Thalaivali, BP check pannapo romba high aa irundhadhu (Headache, BP was very high when checked)\nDoctor: Thalaivali um high BP um - serious. Reading evvalavu? 180/120 ku mela irundhal emergency. Rest edungal, Amlodipine 5mg saapidungal, 1 maani neram kazhithu thirumba check pannungal. Chest pain, paarvai problem, or weakness irundhal udane hospital pongal."
    },
    
    // Fever / Dengue
    {
        language: "tamil",
        condition: "monsoon_fever",
        text: "Patient: Mazhai kaalam la kaichal, udambu vali (Fever in rainy season, body pain)\nDoctor: Mazhai kaalam la kaichal and udambu vali - dengue doubt irukku. NS1 test pannungal kaichal 5 naatkal ku kuRaivaa irundhal, or IgM/IgG athigama irundhal. Platelet ku CBC. Aggressive hydration start pannungal - 3-4 liter thinam. Paracetamol mattum - NSAID evvum vendaam."
    },
    {
        language: "tamil",
        condition: "dengue_management",
        text: "Patient: Dengue positive, platelets 48000 (Dengue positive, platelets 48000)\nDoctor: Dengue la platelets 48000 - careful monitoring veNum. Critical illai ippo but approaching. Admit pannungal: platelets 40000 ku keezh, vaandhi niRkaala, vayiru vali, bleeding, or thanni kudikka mudiyala. Veettil: rest, fluids, paracetamol mattum. Thinam platelet check veNum."
    },
    
    // Typhoid
    {
        language: "tamil",
        condition: "typhoid",
        text: "Patient: 10 naal aa kaichal, vayiru vali irukku (Fever for 10 days, stomach pain)\nDoctor: Neenda kaichal and vayiru vali - typhoid doubt. Widal test pannungal (7 naal kazhithu), blood culture (best), CBC. Typhoid confirm aana: Azithromycin 1g thinam 5-7 naatkal or Cefixime 200mg naaluku 2 vela 14 naatkal. Soft, easy digestible unavu saapidungal. Full course complete pannungal."
    },
    
    // Regional Disease - South India specific
    {
        language: "tamil",
        condition: "scrub_typhus",
        text: "Patient: Vivasaayam seiyum idatthil veli kaichal, thalaivali (Fever and headache after farm work)\nDoctor: Vivasaaya veli ku pona piragu kaichal - SCRUB TYPHUS doubt irukku, South India la common. Udambu la karu pulli (eschar) irukka paariungal, usually concealed areas la. Tests: Scrub typhus serology, CBC, LFT. Treatment: Doxycycline 100mg naaluku 2 vela 7-14 naatkal. Treatment late aagaama aarambiungal - complications irukkalam."
    },
    {
        language: "tamil",
        condition: "leptospirosis",
        text: "Patient: Kaalatru irundhappo mazhai thanni la nadanthaen, ippo kaichal (Walked in flood water, now have fever)\nDoctor: Vellam la nadandha piragu kaichal - LEPTOSPIROSIS doubt, Kerala and Tamil Nadu la common especially floods ku piragu. Symptoms: kaichal, thundi vali (especially calf), sivandha kann, thalaivali. Tests: CBC, LFT, KFT, leptospira serology. Doxycycline 100mg naaluku 2 vela start pannungal - reports ku kaakaama. Jaundice or siruneer kuRaivaa irundhal admit pannungal."
    },
    
    // Acidity
    {
        language: "tamil",
        condition: "gerd",
        text: "Patient: Neenju erchchal, pulipu thanni varudhu (Chest burning, sour water coming)\nDoctor: GERD irukku - acid reflux. Pantoprazole 40mg vellai vayiru + Domperidone 10mg start pannungal. Saapittu 2 maani neram padukkaadhingal. Tea, coffee, spicy, late night dinner avoid pannungal. Bed head side konjam uyaraa vaingal. 2 vaaram la better aagalanna endoscopy pannungal."
    },
    
    // Women's Health
    {
        language: "tamil",
        condition: "menorrhagia",
        text: "Patient: Maadha vilakku romba athigam varudhu, kattikkal varudhu (Periods very heavy, getting clots)\nDoctor: Menorrhagia irukku - evaluation veNum. Evvalavu naal periods varudhu? Pads/tampons naaluku evvalavu (6-8 ku mela = heavy)? Tests pannungal: CBC (anemia ku), pelvic ultrasound (fibroids, polyps ku). Symptoms ku: Tranexamic acid (Pause) 500mg naaluku 3 vela periods la. Anemia irundhal iron supplements kattaayam."
    },
    {
        language: "tamil",
        condition: "preeclampsia",
        text: "Patient: Pregnancy la kaal veekkam, BP um high (Feet swelling in pregnancy and BP high)\nDoctor: WARNING - pregnancy la veekkam and high BP - PREECLAMPSIA aagalam - amma and baby ku danger. BP reading evvalavu? Thalaivali, paarvai problem, mela vayiru vali irukka? Aamaa na: UDANE hospital pongal. Light aa irundhal: bed rest, uppu kuRaingal, BP 4 maani neram ku check pannungal. OB kita kattungal."
    },
    
    // Skin
    {
        language: "tamil",
        condition: "skin_rash",
        text: "Patient: Udambu la thadu vandhu irukku, aripu (Rashes on body, itching)\nDoctor: Thadu and aripu - allergy, veyil pudippu or fungal infection aagalam. Pudhu unavu, marundhu, soap use panna? Ippo: Cetirizine 10mg iravu, Calamine lotion thaddungal. Fungal (ring shape, scales): Clotrimazole cream naaluku 2 vela. Veyil pudippu: dry aa vaingal, cotton dress, powder."
    },
    
    // Emergency - Cardiac
    {
        language: "tamil",
        condition: "heart_attack",
        text: "Patient: Neenju baaram, idadhu kai vali (Chest heaviness, left arm pain)\nDoctor: EMERGENCY - idhu heart attack signs. UDANE ACTION: 1) Ambulance or cardiac hospital pongal IPPO. 2) Aspirin 325mg kadingal allergy illanna. 3) Half sitting position la rest edungal. 4) Vali vandhu pogum, ignore pannaadhingal. Heart muscle minute ku keduthukku irukku. Neenga drive pannaadhingal."
    },
    
    // Emergency - Stroke
    {
        language: "tamil",
        condition: "stroke",
        text: "Patient: Appa ku oru pakka kai kaal vaelai seiyala (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - oru pakka weakness stroke sign. UDANE ambulance or CT scan irukka hospital pongal. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL - clot treatment 4.5 hours la mattum vaelai seiyum. Exact time note pannungal symptoms start aana. Vaai vazhi onnum kudukaadhingal."
    },

    // ==========================================
    // TELUGU (తెలుగు) - ANDHRA PRADESH & TELANGANA
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "telugu",
        condition: "diarrhea",
        text: "Patient: Naaku virechanalu avuthunnai, udayam nundi 5-6 sarlu ayyayi (I'm having loose motions, 5-6 times since morning)\nDoctor: Meeku diarrhea undi. Ventane ORS modalu pettandi - Electral or Enerzal 1 packet 1 liter neellalo. Roju antha koncham koncham taagandi. Racecadotril 100mg rojuki 3 sarlu teesukondi. Paalu, spicy food avoid cheyandi. Raktam vasthe or jwaram 101°F kante ekkuva unte hospital vellandi."
    },
    {
        language: "telugu",
        condition: "gastroenteritis",
        text: "Patient: Kallu noppi, vantulu kuda avuthunnai (Stomach ache, vomiting also)\nDoctor: Gastroenteritis la undi. Mundu hydration - ORS or intlo chesina (6 spoons sugar + ara spoon uppu 1L neellalo). Vantiki Ondansetron 4mg. Khichdi, perugu annam, arati pandu tinandi. 24 gantallalo better avvakapothe doctor ki chupinchandi."
    },
    {
        language: "telugu",
        condition: "pediatric_diarrhea",
        text: "Patient: Pillaki virechanalu, 2 years vayasu (Child has diarrhea, 2 years old)\nDoctor: Pillallalo diarrhea serious avvochu. ORS chinna chinna sips lo 5 nimishaalaki okasari ivvandi. Zinc syrup 10ml roju 10-14 rojulu. Breastfeeding continue cheyandi. Warning signs: kallu lopalaki vellte, kannillu raavu, urine raadu - ventane hospital teesukellandi."
    },
    
    // Sugar / Diabetes
    {
        language: "telugu",
        condition: "diabetes_high",
        text: "Patient: Naa sugar penchindi, fasting 195 vachindi (My sugar increased, fasting was 195)\nDoctor: Fasting sugar 195 mg/dL chala ekkuva, diabetes control lo ledu. Target fasting 100 kante takkuva undali. Metformin dose penchali or Glimepiride add cheyali. HbA1c test cheyyandi. Annam, roti thakkuva cheyandi, kooragayalu ekkuva cheyandi. Roju 30 nimishalu nadusthu undandi."
    },
    {
        language: "telugu",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes undi, kaalu thippulu avuthunnai (Have diabetes, feet getting numb)\nDoctor: Idi diabetic neuropathy - ekkuva sugar valla nerves damage avuthunnai. Methylcobalamin 1500mcg roju + Pregabalin 75mg ratri start cheyandi. Sugar strict control lo unchandi. Roju kaalu check cheyandi - cuts, wounds kosam. Eppudu cheppulu lekunda nadavakandi."
    },
    {
        language: "telugu",
        condition: "diabetes_symptoms",
        text: "Patient: Chala daham vestundi, maati maati urine vastundi (Very thirsty, frequent urination)\nDoctor: Ekkuva daham, maati maati urine - diabetes symptoms avvochu. Ventane random sugar test cheyandi. 200 kante ekkuva unte diabetes confirm. Fasting test, HbA1c kuda cheyandi. Neellu 3-4 liters taagandi. Sweet items avoid cheyandi."
    },
    
    // Body Pain
    {
        language: "telugu",
        condition: "body_pain",
        text: "Patient: Oothi noppulu vastunnai (Whole body pain)\nDoctor: Oothi noppi - chala reasons undochu. Jwaram unda? Recent ga viral infection vachinda? Monsoon lo dengue, chikungunya kuda undochu. Ippudu Paracetamol 650mg rojuki 3 sarlu, rest teesukoni, neellu taagandi. Jwaram unte CBC mariyu dengue test cheyandi."
    },
    {
        language: "telugu",
        condition: "vitamin_d_deficiency",
        text: "Patient: Cheyi kaalu noppi, leva kadalatle (Hands and legs pain, can't get up)\nDoctor: Ee symptoms Vitamin D deficiency lo common - India lo chala mandiki untundi. Tests cheyandi: Vitamin D, calcium, ESR. Vitamin D takkuva unte (usually <10) Cholecalciferol 60000 IU vaaraniki okasari 8 weeks teesukundi."
    },
    
    // BP / Hypertension
    {
        language: "telugu",
        condition: "hypertension",
        text: "Patient: BP ekkuva ochindi, 160/100 vachindi (BP came high, was 160/100)\nDoctor: Stage 2 hypertension undi - medicine teesukovalsinde. Amlodipine 5mg udayam start cheyandi. Uppu thakkuva cheyandi - 5g/day kante takkuva, pachadi, papad avoid cheyandi. 2 vaaralu taruvata BP check cheyandi. Target: 130/80 kante takkuva. Kidney function, ECG kuda cheyandi."
    },
    {
        language: "telugu",
        condition: "hypertensive_crisis",
        text: "Patient: Tala noppi, BP check cheste chala ekkuva (Headache, BP was very high when checked)\nDoctor: Tala noppi tho high BP - serious. Reading enta? 180/120 kante ekkuva unte emergency. Rest teesukundi, Amlodipine 5mg teesukundi, 1 ganta taruvata malli check cheyandi. Chest pain, kannu problem, or weakness unte ventane hospital vellandi."
    },
    
    // Fever / Dengue
    {
        language: "telugu",
        condition: "monsoon_fever",
        text: "Patient: Varshaakalam lo jwaram, oothi noppi (Fever in rainy season, body pain)\nDoctor: Varshaakalam lo jwaram and oothi noppi - dengue doubt undi. NS1 test cheyandi jwaram 5 rojulu kante takkuva unte, or IgM/IgG ekkuva rojulu unte. Platelet kosam CBC. Aggressive hydration start cheyandi - 3-4 liters roju. Paracetamol only - NSAID evadu vaddu."
    },
    {
        language: "telugu",
        condition: "dengue_management",
        text: "Patient: Dengue positive, platelets 52000 (Dengue positive, platelets 52000)\nDoctor: Dengue lo platelets 52000 - intlo care avvochu kaani strict monitoring kavali. Hydration chala important - 3-4 liters roju (ORS, kobbari neellu, juices). Paracetamol ONLY - Ibuprofen/Aspirin vaddu (bleeding risk). Roju CBC cheyandi. Warning signs: vantulu, kallu noppi, bleeding - hospital admit avvandi."
    },
    
    // Typhoid
    {
        language: "telugu",
        condition: "typhoid",
        text: "Patient: 10 rojula nundi jwaram, kallu noppi undi (Fever for 10 days, stomach pain)\nDoctor: Pedda jwaram tho kallu noppi - typhoid doubt. Widal test cheyandi (7 rojulu taruvata), blood culture (best), CBC. Typhoid confirm aite: Azithromycin 1g roju 5-7 rojulu or Cefixime 200mg rojuki 2 sarlu 14 rojulu. Soft, easy digestible food tinandi. Full course complete cheyandi."
    },
    
    // Acidity
    {
        language: "telugu",
        condition: "gerd",
        text: "Patient: Kallu lo manta, pula neellu vastunnai (Burning in stomach, sour water coming)\nDoctor: GERD undi - acid reflux. Pantoprazole 40mg khali kallu + Domperidone 10mg start cheyandi. Tinina 2 gantalu taruvate padukundi. Chai, coffee, spicy, late dinner avoid cheyandi. Mancham head side koncham ekkuva pettandi. 2 vaaralalo better avvakapothe endoscopy cheyandi."
    },
    
    // Women's Health
    {
        language: "telugu",
        condition: "menorrhagia",
        text: "Patient: Periods chala ekkuva vastunnai, gaddalu vastunnai (Periods very heavy, getting clots)\nDoctor: Menorrhagia undi - evaluation kavali. Enta rojulu periods vastunnai? Pads/tampons rojuki enta (6-8 kante ekkuva = heavy)? Tests cheyandi: CBC (anemia kosam), pelvic ultrasound (fibroids, polyps kosam). Symptoms kosam: Tranexamic acid (Pause) 500mg rojuki 3 sarlu periods lo. Anemia unte iron supplements tappanisari."
    },
    {
        language: "telugu",
        condition: "preeclampsia",
        text: "Patient: Pregnancy lo kaalu vaapu, BP kuda high (Feet swelling in pregnancy and BP high)\nDoctor: WARNING - pregnancy lo vaapu and high BP - PREECLAMPSIA avvochu - amma and babyki danger. BP reading enta? Tala noppi, kannu problem, paina kallu noppi unda? Avunu ante: VENTANE hospital vellandi. Light ga unte: bed rest, uppu thakkuva cheyandi, BP 4 gantalakoosari check cheyandi. OB ki chupinchandi."
    },
    
    // Regional - Scrub Typhus
    {
        language: "telugu",
        condition: "scrub_typhus",
        text: "Patient: Fields lo pani chesina taruvata jwaram, tala noppi (Fever after working in fields, headache)\nDoctor: Farming taruvata jwaram - SCRUB TYPHUS doubt, Andhra/Telangana lo common. Body mida black spot (eschar) check cheyandi, usually hidden areas lo untundi. Tests: Scrub typhus serology, CBC, LFT. Treatment: Doxycycline 100mg rojuki 2 sarlu 7-14 rojulu. Treatment late cheyakandi - complications undochu."
    },
    
    // Emergency - Cardiac
    {
        language: "telugu",
        condition: "heart_attack",
        text: "Patient: Chest lo baruvu, edama cheyi noppi (Chest heaviness, left arm pain)\nDoctor: EMERGENCY - ivi heart attack signs. VENTANE ACTION: 1) Ambulance or cardiac hospital vellandi IPPUDE. 2) Aspirin 325mg namulandi allergy lekupothe. 3) Half sitting position lo rest teesukundi. 4) Noppi vachi poguttu untundi, ignore cheyakandi. Heart muscle minute ki die avuthundi. Meeru drive cheyakandi."
    },
    
    // Emergency - Stroke  
    {
        language: "telugu",
        condition: "stroke",
        text: "Patient: Nanna ki oka side cheyi kaalu pani cheyatle (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - oka vaipu weakness stroke sign. VENTANE ambulance or CT scan unda hospital vellandi. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL - clot treatment 4.5 hours lo matrame pani chestundi. Exact time note cheyandi symptoms start aina. Noti nundi emi ivvakandi."
    },

    // ==========================================
    // KANNADA (ಕನ್ನಡ) - KARNATAKA
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "kannada",
        condition: "diarrhea",
        text: "Patient: Nanage bidi aagutiide, beligge inda 6 sala aaitu (I'm having loose motions, 6 times since morning)\nDoctor: Nimge diarrhea ide. Takshanave ORS shuru maadi - Electral athava Enerzal 1 packet 1 liter neeralli. Dinavu swalpa swalpa kudiyi. Racecadotril 100mg dinakke 3 sala tegiyiri. Haalu, spicy oota bittubidi. Rakta bandare athava jwara 101°F jasthi idre hospital hogi."
    },
    {
        language: "kannada",
        condition: "gastroenteritis",
        text: "Patient: Hotte kedu, vanti aagutiide (Stomach upset, vomiting)\nDoctor: Gastroenteritis tara kaanutte. Modalige hydration - ORS athava maneli maadida (6 chamcha sakre + ardha chamcha uppu 1L neeralli). Vanthi ge Ondansetron 4mg. Khichdi, mosaru anna, balehannu thinni. 24 gante alli better aagadidre doctor ge torisi."
    },
    {
        language: "kannada",
        condition: "pediatric_diarrhea",
        text: "Patient: Maguvige bidi, 2 varsha vayasu (Child has diarrhea, 2 years old)\nDoctor: Maguvalli diarrhea serious aagbahudu. ORS chikka chikka sips alli 5 nimishakke ondu sala kodi. Zinc syrup 10ml dina 10-14 dina. Breastfeeding munduvareysiri. Warning signs: kannu ollake hodre, kanniru baralla, moothara illa - takshanave hospital ge karedu hogi."
    },
    
    // Sugar / Diabetes
    {
        language: "kannada",
        condition: "diabetes_high",
        text: "Patient: Nanna sugar hechchaagiide, fasting 185 bantu (My sugar increased, fasting was 185)\nDoctor: Fasting sugar 185 mg/dL tumba jasthi, diabetes control alli illa. Target fasting 100 kinte kammi irbeku. Metformin dose hechchisabeku athava Glimepiride add maadabeku. HbA1c test maadisi. Anna, roti kammi maadi, tarkari hechchisi. Dina 30 nimisha nadiyiri."
    },
    {
        language: "kannada",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes ide, kaalu muttu aagutiide (Have diabetes, feet getting numb)\nDoctor: Idu diabetic neuropathy - jasthi sugar inda nerves keduttide. Methylcobalamin 1500mcg dina + Pregabalin 75mg raatri shuru maadi. Sugar strict control alli ittukolliri. Dina kaalu nodiri - cuts, wounds ge. Yaavagalu batte illade nadiyabedi."
    },
    {
        language: "kannada",
        condition: "diabetes_symptoms",
        text: "Patient: Tumba baayi arisuttide, bari bari moothara hogutiide (Very thirsty, frequent urination)\nDoctor: Jasthi daha, bari bari moothara - diabetes symptoms aagbahudu. Takshanave random sugar test maadisi. 200 kinte jasthi idre diabetes confirm. Fasting test, HbA1c kooda maadisi. Neeru 3-4 liters kudiyiri. Sweet items avoid maadi."
    },
    
    // Body Pain
    {
        language: "kannada",
        condition: "body_pain",
        text: "Patient: Meni ella novu (Whole body pain)\nDoctor: Meni novu - tumba kaaranagaliddawe. Jwara ide? Recent aa viral infection aagita? Monsoon alli dengue, chikungunya kooda iragbahudu. Eega Paracetamol 650mg dinakke 3 sala, vishraanti tegiyiri, neeru kudiyiri. Jwara idre CBC mattu dengue test maadisi."
    },
    {
        language: "kannada",
        condition: "vitamin_d_deficiency",
        text: "Patient: Kai kaalu novu, elu nillakke aagutiila (Hands and legs pain, can't stand up)\nDoctor: Ee symptoms Vitamin D deficiency alli common - India alli tumba janarige ide. Tests maadisi: Vitamin D, calcium, ESR. Vitamin D kammi idre (usually <10) Cholecalciferol 60000 IU vaarakke ondu sala 8 weeks tegiyiri."
    },
    
    // BP / Hypertension
    {
        language: "kannada",
        condition: "hypertension",
        text: "Patient: BP jasthi bantu, 155/100 aagitu (BP came high, was 155/100)\nDoctor: Stage 2 hypertension ide - medicine tegedu beku. Amlodipine 5mg beligge shuru maadi. Uppu kammi maadi - 5g/dina kinte kammi, uppinkai, papad avoid maadi. 2 vaara aadmele BP check maadi. Target: 130/80 kinte kammi. Kidney function, ECG kooda maadisi."
    },
    {
        language: "kannada",
        condition: "hypertensive_crisis",
        text: "Patient: Tale novu, BP check maadidre tumba jasthi itu (Headache, BP was very high when checked)\nDoctor: Tale novu jothe high BP - serious. Reading estu? 180/120 kinte jasthi idre emergency. Vishraanti tegiyiri, Amlodipine 5mg tegiyiri, 1 gante aadmele matte check maadi. Chest pain, kannu problem, athava weakness idre takshanave hospital hogi."
    },
    
    // Fever / Dengue
    {
        language: "kannada",
        condition: "monsoon_fever",
        text: "Patient: Maley kaaladi jwara, meni novu (Fever in rainy season, body pain)\nDoctor: Maley kaaladi jwara mattu meni novu - dengue sandeha ide. NS1 test maadisi jwara 5 dinakke kammi idre, athava IgM/IgG jasthi dina idre. Platelet ge CBC. Aggressive hydration shuru maadi - 3-4 liters dina. Paracetamol maatra - NSAID yaavudu beda."
    },
    {
        language: "kannada",
        condition: "dengue_management",
        text: "Patient: Dengue positive, platelets 50000 (Dengue positive, platelets 50000)\nDoctor: Dengue alli platelets 50000 - maneli care aagbahudu aadarae strict monitoring beku. Hydration tumba important - 3-4 liters dina (ORS, elaeneer, juices). Paracetamol MAATRA - Ibuprofen/Aspirin beda (bleeding risk). Dina CBC maadisi. Warning signs: vanti, hotte novu, bleeding - hospital admit aagi."
    },
    
    // Acidity
    {
        language: "kannada",
        condition: "gerd",
        text: "Patient: Hotte yalli uriyuttide, hulli neeru baruttide (Burning in stomach, sour water coming)\nDoctor: GERD ide - acid reflux. Pantoprazole 40mg bari hotte + Domperidone 10mg shuru maadi. Tinda 2 gante aadmele malakkolliri. Chai, coffee, spicy, late dinner avoid maadi. Manchada head side swalpa echchakke ittukolliri. 2 vaara alli better aagadidre endoscopy maadisi."
    },
    
    // Regional - Karnataka specific
    {
        language: "kannada",
        condition: "scrub_typhus",
        text: "Patient: Malenad alli kelsa maadi jwara bantu, tale novu (Fever after working in Western Ghats area, headache)\nDoctor: Malenad/rural area alli kelsa maadi jwara - SCRUB TYPHUS sandeha, Karnataka alli common. Body mele kapppu pulli (eschar) nodiri, usually hidden areas alli iruttade. Tests: Scrub typhus serology, CBC, LFT. Treatment: Doxycycline 100mg dinakke 2 sala 7-14 dina. Treatment late maadabedi - complications iragbahudu."
    },
    {
        language: "kannada",
        condition: "leptospirosis",
        text: "Patient: Neeru ninde holadalli nadede, eega jwara (Walked through flood water, now fever)\nDoctor: Neeru alli nadeda mele jwara - LEPTOSPIROSIS sandeha, floods aadmele common. Symptoms: jwara, kanku novu (especially calf), kempu kannu, tale novu. Tests: CBC, LFT, KFT, leptospira serology. Doxycycline 100mg dinakke 2 sala start maadi - reports ge kaayabedi. Jaundice athava moothara kammi idre admit aagi."
    },
    
    // Women's Health
    {
        language: "kannada",
        condition: "menorrhagia",
        text: "Patient: Periods tumba jasthi baruttide, gattigalu baruttide (Periods very heavy, getting clots)\nDoctor: Menorrhagia ide - evaluation beku. Estu dina periods baruttade? Pads/tampons dinakke estu (6-8 kinte jasthi = heavy)? Tests maadisi: CBC (anemia ge), pelvic ultrasound (fibroids, polyps ge). Symptoms ge: Tranexamic acid (Pause) 500mg dinakke 3 sala periods alli. Anemia idre iron supplements kaddaaya."
    },
    {
        language: "kannada",
        condition: "preeclampsia",
        text: "Patient: Pregnancy alli kaalu baavu, BP kooda high (Feet swelling in pregnancy and BP high)\nDoctor: WARNING - pregnancy alli baavu mattu high BP - PREECLAMPSIA aagbahudu - amma mattu baby ge danger. BP reading estu? Tale novu, kannu problem, mele hotte novu ide? Haudu andre: TAKSHANAVE hospital hogi. Light idre: bed rest, uppu kammi maadi, BP 4 gante ge check maadi. OB ge torisi."
    },
    
    // Emergency - Cardiac
    {
        language: "kannada",
        condition: "heart_attack",
        text: "Patient: Edhe alli bhaara, edha kai novu (Chest heaviness, left arm pain)\nDoctor: EMERGENCY - idu heart attack signs. TAKSHANAVE ACTION: 1) Ambulance athava cardiac hospital hogi EEGA. 2) Aspirin 325mg jagiyiri allergy illadidre. 3) Ardha kootidre position alli vishraanti tegiyiri. 4) Novu bandu hoguttide, ignore maadabedi. Heart muscle nimishakke sayuttide. Nivu drive maadabedi."
    },
    
    // Emergency - Stroke
    {
        language: "kannada",
        condition: "stroke",
        text: "Patient: Appa ge ondu side kai kaalu kelsa maaduttilla (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - ondu kadhe weakness stroke sign. TAKSHANAVE ambulance athava CT scan iruvallae hospital hogi. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL - clot treatment 4.5 gante alli maatra kelsa maaduttade. Exact time note maadi symptoms shuru aada. Baayi inda enu kodabedi."
    },

    // ==========================================
    // BENGALI (বাংলা) - WEST BENGAL
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "bengali",
        condition: "diarrhea",
        text: "Patient: Amar pet kharap, shokal theke 6 baar hoyeche (I have stomach upset, 6 times since morning)\nDoctor: Apnar diarrhea hoyeche. Ekhuni ORS shuru korun - Electral ba Enerzal 1 packet 1 liter jole. Shokal theke raat porjonto ektu ektu kheye jan. Racecadotril 100mg din e 3 baar khaben. Dudh, jhaal khawa bondho korun. Rokte paikhaana hole ba jor 101°F er beshi hole hospital jan."
    },
    {
        language: "bengali",
        condition: "gastroenteritis",
        text: "Patient: Bomi hochhe, pet e byatha (Vomiting, stomach pain)\nDoctor: Gastroenteritis mone hochhe. Prothome hydration - ORS ba ghor e toiri (6 chamoch cheeni + aadha chamoch nun 1L jole). Bomi er jonno Ondansetron 4mg. Khichuri, doi bhaat, kola khaan. 24 ghontar modhye bhalo na hole doctor ke dekhan."
    },
    {
        language: "bengali",
        condition: "pediatric_diarrhea",
        text: "Patient: Bachhar pet kharap, 2 bochhor boyesh (Child has diarrhea, 2 years old)\nDoctor: Bachhader diarrhea serious hote pare. ORS chhoto chhoto chusuki te 5 minute por por din. Zinc syrup 10ml roj 10-14 din. Breastfeeding choliye jan. Danger signs: chokh dhuke gele, chokher jol na ele, peshab na hole - shigghir hospital nie jan."
    },
    
    // Sugar / Diabetes
    {
        language: "bengali",
        condition: "diabetes_high",
        text: "Patient: Amar sugar bereche, fasting 190 esheche (My sugar increased, fasting came 190)\nDoctor: Fasting sugar 190 mg/dL onek beshi, diabetes control e nei. Target fasting 100 er niche howa uchit. Metformin dose barate hobe ba Glimepiride add korte hobe. HbA1c test koran. Bhaat, ruti kom khaan, shobji beshi khaan. Roj 30 minute haatun."
    },
    {
        language: "bengali",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes achhe, paa oshsho hochhe (Have diabetes, feet getting numb)\nDoctor: Eta diabetic neuropathy - beshi sugar theke nerves noshto hochhe. Methylcobalamin 1500mcg roj + Pregabalin 75mg raate shuru korun. Sugar tight control e rakhun. Roj paa dekhin - kata, ghaa er jonno. Kokhono khali paye haatben na."
    },
    {
        language: "bengali",
        condition: "diabetes_symptoms",
        text: "Patient: Khub teeshta laagche, baar baar bathroom jaite hochhe (Very thirsty, frequent urination)\nDoctor: Beshi teeshta, baar baar bathroom - diabetes er lakkhon hote pare. Ekhuni random sugar test koran. 200 er beshi hole diabetes confirm. Fasting test, HbA1c o koran. Jol 3-4 liter khaan. Mishti jinis avoid korun."
    },
    
    // Body Pain
    {
        language: "bengali",
        condition: "body_pain",
        text: "Patient: Shorir e shob jaygay byatha (Body aches everywhere)\nDoctor: Ga byatha - onek kaaron hote pare. Jor achhe? Recently viral infection hoyechilo? Monsoon e dengue, chikungunya o hote pare. Ekhon Paracetamol 650mg din e 3 baar, bishram nin, jol khaan. Jor thakle CBC aar dengue test koran."
    },
    {
        language: "bengali",
        condition: "vitamin_d_deficiency",
        text: "Patient: Haath paa byatha, uthte parchi na (Hands and legs pain, can't get up)\nDoctor: Ei symptoms Vitamin D deficiency te common - India te onek loker hoy. Tests koran: Vitamin D, calcium, ESR. Vitamin D kom thakle (usually <10) Cholecalciferol 60000 IU shoptaahe ekbaar 8 weeks khaan."
    },
    
    // BP / Hypertension
    {
        language: "bengali",
        condition: "hypertension",
        text: "Patient: BP beshi esheche, 158/100 chilo (BP came high, was 158/100)\nDoctor: Stage 2 hypertension achhe - oshudh khete hobe. Amlodipine 5mg shokal e shuru korun. Nun kom khaan - 5g/din er kom, aachaar, papad avoid korun. 2 soptaah por BP check korun. Target: 130/80 er niche. Kidney function, ECG o koran."
    },
    {
        language: "bengali",
        condition: "hypertensive_crisis",
        text: "Patient: Matha byatha, BP check korte giye dekhlam onek beshi (Headache, BP was very high when checked)\nDoctor: Matha byatha ar high BP - serious. Reading koto chilo? 180/120 er beshi hole emergency. Bishram nin, Amlodipine 5mg khaan, 1 ghonta por abar check korun. Buk e byatha, chokhe somoshya, ba durbolota thakle ekhuni hospital jan."
    },
    
    // Fever / Dengue
    {
        language: "bengali",
        condition: "monsoon_fever",
        text: "Patient: Borshakale jor, ga byatha (Fever in rainy season, body pain)\nDoctor: Borshakale jor ar ga byatha - dengue er shondeho achhe. NS1 test koran jor 5 din er kom hole, ba IgM/IgG beshi din hole. Platelet er jonno CBC. Aggressive hydration shuru korun - 3-4 liters roj. Paracetamol only - NSAID kono tai na."
    },
    {
        language: "bengali",
        condition: "dengue_management",
        text: "Patient: Dengue positive, platelets 48000 (Dengue positive, platelets 48000)\nDoctor: Dengue e platelets 48000 - ghore thaka jabe kintu strict monitoring chai. Hydration onek important - 3-4 liters roj (ORS, daber jol, juice). SUDHU Paracetamol - Ibuprofen/Aspirin na (bleeding risk). Roj CBC koran. Warning signs: bomi, pet byatha, bleeding - hospital admit hon."
    },
    
    // Regional - Bengal specific diseases
    {
        language: "bengali",
        condition: "kala_azar",
        text: "Patient: Kala-azar er district theke eshechi, jor achhe, pet boro hoyeche (From kala-azar district, have fever, abdomen enlarged)\nDoctor: Kala-azar endemic area theke eshe jor ar pet boro - VISCERAL LEISHMANIASIS (Kala-azar) shondeho, Bihar/Bengal border e common. Symptoms: prolonged jor, weight loss, boro spleen/liver, kaalo chhamra. Tests: rK39 rapid test, bone marrow/splenic aspiration. Treatment: Liposomal Amphotericin B (Govt e free achhe). Early treatment e shompurno bhalo hoy."
    },
    {
        language: "bengali",
        condition: "leptospirosis",
        text: "Patient: Baan er jol e giye jor esheche (Fever after going in flood water)\nDoctor: Baan er jol e giye jor - LEPTOSPIROSIS shondeho, Bengal e flood er por common. Symptoms: jor, pathar maangshe byatha (especially calf), laal chokh, matha byatha. Tests: CBC, LFT, KFT, leptospira serology. Doxycycline 100mg din e 2 baar shuru korun - report er jonno wait korben na. Jaundice ba kom peshab hole admit hon."
    },
    
    // Acidity
    {
        language: "bengali",
        condition: "gerd",
        text: "Patient: Buke jaalaa porche, teto jol uthe aashche (Burning in chest, sour water coming up)\nDoctor: GERD achhe - acid reflux. Pantoprazole 40mg khali pet e + Domperidone 10mg shuru korun. Khabar por 2 ghonta shuben na. Cha, coffee, jhaal, raate deri kore khawa avoid korun. Bichaanaar matha-r dik ektu unchu rakhun. 2 soptaah e bhalo na hole endoscopy koran."
    },
    
    // Women's Health
    {
        language: "bengali",
        condition: "menorrhagia",
        text: "Patient: Periods onek beshi hochhe, chaka chaka aashche (Periods very heavy, getting clots)\nDoctor: Menorrhagia achhe - dekha dorkar. Koto din periods hochhe? Pads/tampons din e koto (6-8 er beshi = heavy)? Tests koran: CBC (anemia er jonno), pelvic ultrasound (fibroids, polyps er jonno). Symptoms er jonno: Tranexamic acid (Pause) 500mg din e 3 baar periods er shomoy. Anemia thakle iron supplements must."
    },
    {
        language: "bengali",
        condition: "preeclampsia",
        text: "Patient: Pregnancy te paa phule geche, BP o beshi (Feet swelling in pregnancy and BP high)\nDoctor: WARNING - pregnancy te phola ar high BP - PREECLAMPSIA hote pare - maa ar bachha dui joneri danger. BP reading koto? Matha byatha, chokhe somoshya, upor pete byatha achhe? Haan hole: EKHUNI hospital jan. Halka hole: bed rest, nun kom, BP 4 ghonta por por check korun. OB ke dekhan."
    },
    
    // Emergency - Cardiac
    {
        language: "bengali",
        condition: "heart_attack",
        text: "Patient: Buke bhari bhari laagche, baam haate byatha (Chest feels heavy, left arm pain)\nDoctor: EMERGENCY - eta heart attack er lakkhon. EKHUNI ACTION: 1) Ambulance ba cardiac hospital jan EKHON. 2) Aspirin 325mg chibiye khaan allergy na thakle. 3) Aadh bosha position e bishram nin. 4) Byatha ashe-jaay, ignore korben na. Heart muscle minute e morey jacche. Nije drive korben na."
    },
    
    // Emergency - Stroke
    {
        language: "bengali",
        condition: "stroke",
        text: "Patient: Baba r ek diker haath paa cholche na (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - ek pash e durbolota stroke er lakkhon. EKHUNI ambulance ba CT scan achhe emni hospital jan. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL - clot treatment 4.5 ghontar modhyei kaj kore. Exact time note korun kokhon symptoms shuru holo. Mukh diye kichhu deben na."
    },

    // ==========================================
    // GUJARATI (ગુજરાતી) - GUJARAT
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "gujarati",
        condition: "diarrhea",
        text: "Patient: Mane jhada thai rahya che, savare thi 5-6 vakhat thai gaya (I'm having loose motions, 5-6 times since morning)\nDoctor: Tamne diarrhea che. Tarataj ORS sharu karo - Electral ke Enerzal 1 packet 1 liter pani ma. Aakho divas thodu thodu pivo. Racecadotril 100mg divas ma 3 vakhat lo. Dudh, tikhu band karo. Lohini ave ke taav 101°F thi vadhu hoy to hospital jao."
    },
    {
        language: "gujarati",
        condition: "gastroenteritis",
        text: "Patient: Pet ma dukhave che, ulti pan thai che (Stomach ache, vomiting also)\nDoctor: Gastroenteritis laghe che. Pahela hydration - ORS ke ghar nu (6 chamchi khand + adhi chamchi mithu 1L pani ma). Ulti mate Ondansetron 4mg. Khichdi, dahi bhat, kela khao. 24 kalak ma saru na thay to doctor ne batavo."
    },
    {
        language: "gujarati",
        condition: "pediatric_diarrhea",
        text: "Patient: Chhokra ne jhada thai rahya che, 2 varsh no che (Child having diarrhea, 2 years old)\nDoctor: Bachha ma diarrhea serious thai shake che. ORS nana nana sips ma 5 minute na antare aapo. Zinc syrup 10ml roj 10-14 divas. Breastfeeding chalu rakho. Jokhami: aankho andar jaay, aanshu na aave, peshab na aave - tarataj hospital lai jao."
    },
    
    // Sugar / Diabetes
    {
        language: "gujarati",
        condition: "diabetes_high",
        text: "Patient: Maru sugar vadhi gayu che, fasting 200 aavyu (My sugar increased, fasting was 200)\nDoctor: Fasting sugar 200 mg/dL ganu vadhu che, diabetes control ma nathi. Target fasting 100 thi ochu hovu joie. Metformin ni dose vadharvani padse ke Glimepiride add karvi padse. HbA1c test karavjo. Bhaat, rotli ocha karo, shaak vadharo. Roj 30 minute chalo."
    },
    {
        language: "gujarati",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes che, pag thar thai jay che (Have diabetes, feet getting numb)\nDoctor: Aa diabetic neuropathy che - vadhu sugar thi nerves badhay che. Methylcobalamin 1500mcg roj + Pregabalin 75mg raate sharu karo. Sugar tight control ma rakho. Roj pag check karo - chira, ghaa mate. Kyarey chappal vagar na chalo."
    },
    {
        language: "gujarati",
        condition: "diabetes_symptoms",
        text: "Patient: Ganu taras lage che, varamvar bathroom javanu thay che (Very thirsty, frequent urination)\nDoctor: Vadhu taras, varamvar bathroom - diabetes na lakshan hoi shake che. Tarataj random sugar test karavjo. 200 thi vadhu hoy to diabetes confirm. Fasting test, HbA1c pan karavjo. Pani 3-4 liter piyo. Mithai avoid karo."
    },
    
    // Body Pain
    {
        language: "gujarati",
        condition: "body_pain",
        text: "Patient: Aaakhaa shariir ma dukhave che (Whole body is paining)\nDoctor: Shariri dukhavo - gana karan hoi shake. Taav che? Taja ma viral infection thayu hatu? Monsoon ma dengue, chikungunya pan hoi shake. Atyare Paracetamol 650mg divas ma 3 vakhat, aaraam karo, pani piyo. Taav hoy to CBC ane dengue test karavjo."
    },
    {
        language: "gujarati",
        condition: "vitamin_d_deficiency",
        text: "Patient: Haath pag ma dukhave, ubhaa thavatu nathi (Hands and legs pain, can't stand)\nDoctor: Aa lakshano Vitamin D deficiency ma common che - India ma gana loko ne hoy che. Test karavjo: Vitamin D, calcium, ESR. Vitamin D ochu hoy to (usually <10) Cholecalciferol 60000 IU athvadiye ek vakhat 8 weeks lo."
    },
    
    // BP / Hypertension
    {
        language: "gujarati",
        condition: "hypertension",
        text: "Patient: BP vadhu aavyu, 160/100 hatu (BP came high, was 160/100)\nDoctor: Stage 2 hypertension che - dawai levi padse. Amlodipine 5mg savare sharu karo. Mithu ochu karo - 5g/divas thi ochu, athanu, papad band karo. 2 athvadiya pachi BP check karo. Target: 130/80 thi ochu. Kidney function, ECG pan karavjo."
    },
    {
        language: "gujarati",
        condition: "hypertensive_crisis",
        text: "Patient: Matha ma dukhave che, BP check karyu to ganu vadhu hatu (Headache, BP was very high when checked)\nDoctor: Matha no dukhavo ane high BP - serious che. Reading ketlu hatu? 180/120 thi vadhu hoy to emergency che. Aaraam karo, Amlodipine 5mg lo, 1 kalak pachi fari check karo. Chhati ma dukhave, aankh ma problem, ke kamjori hoy to tarataj hospital jao."
    },
    
    // Fever / Dengue
    {
        language: "gujarati",
        condition: "monsoon_fever",
        text: "Patient: Chaumasa ma taav che, ang dukhave che (Fever in monsoon, body pain)\nDoctor: Chaumasa ma taav ane ang dukhavo - dengue ni shanka che. NS1 test karavjo taav 5 divas thi ocho hoy to, ke IgM/IgG vadhu divas hoy to. Platelet mate CBC. Aggressive hydration sharu karo - 3-4 liters roj. Paracetamol j - NSAID koi nahi."
    },
    {
        language: "gujarati",
        condition: "dengue_management",
        text: "Patient: Dengue positive che, platelets 45000 (Dengue positive, platelets 45000)\nDoctor: Dengue ma platelets 45000 - ghar ma thai shake pan strict monitoring joie. Hydration ganu important - 3-4 liters roj (ORS, nariyel pani, juice). FARAJ Paracetamol - Ibuprofen/Aspirin nahi (bleeding risk). Roj CBC karavjo. Warning signs: ulti, pet ma dukhavo, bleeding - hospital admit thao."
    },
    
    // Regional - Gujarat specific
    {
        language: "gujarati",
        condition: "cutaneous_leishmaniasis",
        text: "Patient: Kutch thi aavyu chhu, taav che ane chamdi ma white patches (From Kutch, have fever and white patches on skin)\nDoctor: Kutch thi fever ane skin patches - CUTANEOUS LEISHMANIASIS shanka, Kutch ma endemic che. Painless ulcer ke nodule exposed areas ma dekhay che. Tests: skin smear, biopsy. Treatment: local injections ke Miltefosine tablets. Saru thai shake pan time lage - 2-3 mahina. Sandfly bites thi bachva mate bed nets, repellent vapro."
    },
    {
        language: "gujarati",
        condition: "leptospirosis",
        text: "Patient: Surat thi chhu, paani bharaayela ma gaya hata, taav aavyo (From Surat, went in waterlogging, fever came)\nDoctor: Pani bharaayela ma gaya pachi taav - LEPTOSPIROSIS shanka, Surat ma flood pachi common che. Lakshan: taav, pindia no dukhavo (khase calf), laal aankh, matha no dukhavo. Tests: CBC, LFT, KFT, leptospira serology. Doxycycline 100mg divas ma 2 vakhat sharu karo - report ni wait na karo. Kammlo ke ochu peshab aave to admit thao."
    },
    
    // Acidity
    {
        language: "gujarati",
        condition: "gerd",
        text: "Patient: Chhati ma bale che, khattu pani aave che (Burning in chest, sour water coming)\nDoctor: GERD che - acid reflux. Pantoprazole 40mg khali pet + Domperidone 10mg sharu karo. Jamya pachi 2 kalak suvo nahi. Chai, coffee, tikhu, mode ratri nu jaman band karo. Paltang nu matha nu chhedu thodu uchu rakho. 2 athvadiya ma saru na thay to endoscopy karavo."
    },
    
    // Women's Health
    {
        language: "gujarati",
        condition: "menorrhagia",
        text: "Patient: Periods gana vadhu aave che, gattha aave che (Periods very heavy, getting clots)\nDoctor: Menorrhagia che - tapas karvi padse. Ketla divas periods aave che? Pads/tampons divas ma ketla (6-8 thi vadhu = heavy)? Tests karavjo: CBC (anemia mate), pelvic ultrasound (fibroids, polyps mate). Lakshano mate: Tranexamic acid (Pause) 500mg divas ma 3 vakhat periods ma. Anemia hoy to iron supplements jaruri."
    },
    {
        language: "gujarati",
        condition: "preeclampsia",
        text: "Patient: Pregnancy ma pag sujya che, BP pan vadhu (Feet swelling in pregnancy and BP high)\nDoctor: WARNING - pregnancy ma sujo ane high BP - PREECLAMPSIA hoi shake - maa ane baby banne ne jokhami. BP reading ketlu? Matha dukhave, aankh ma problem, upla pet ma dukhave? Ha to: TARATAJ hospital jao. Halku hoy to: bed rest, mithu ochu, BP 4 kalak na antare check karo. OB ne batavo."
    },
    
    // Emergency - Cardiac
    {
        language: "gujarati",
        condition: "heart_attack",
        text: "Patient: Chhati ma bhar lage che, daba haath ma dukhave che (Chest feels heavy, left arm pain)\nDoctor: EMERGENCY - aa heart attack na lakshano che. TARATAJ ACTION: 1) Ambulance ke cardiac hospital jao ATYARE. 2) Aspirin 325mg chavjo allergy na hoy to. 3) Ardha bethela position ma aaraam karo. 4) Dukhavo aavta-jata rehse, ignore na karo. Heart muscle minute ma marhe che. Tame drive na karo."
    },
    
    // Emergency - Stroke
    {
        language: "gujarati",
        condition: "stroke",
        text: "Patient: Papa no ek taraf no haath pag kam nathi karto (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - ek baju ni kamjori stroke nu lakshan che. TARATAJ ambulance ke CT scan vaali hospital jao. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL - clot treatment 4.5 kalak ma j kam kare che. Exact time note karo lakshano kyare sharu thaya. Mokha thi koi vastu na aapo."
    },

    // ==========================================
    // MALAYALAM (മലയാളം) - KERALA
    // ==========================================
    
    // Loose Motions / Diarrhea
    {
        language: "malayalam",
        condition: "diarrhea",
        text: "Patient: Enikku vayaru ilangunnu, ravile muthal 6 praavashyam aayi (I have loose motions, 6 times since morning)\nDoctor: Ningalkku diarrhea undu. Udane ORS thudanguka - Electral or Enerzal 1 packet 1 liter vellathil. Divasam muzhuvan kurach kurach kudikkuka. Racecadotril 100mg divasam 3 praavashyam kazhikkuka. Paal, spicy food avoid cheyyuka. Raktham varukayo pani 101°F enna kooduthal undenkil hospital poka."
    },
    {
        language: "malayalam",
        condition: "gastroenteritis",
        text: "Patient: Vayar vedana, okshanam undakunnu (Stomach pain, vomiting)\nDoctor: Gastroenteritis aanu ennanu thonnunnathu. Aadyam hydration - ORS or veetil undaakkiya (6 spoon panjasaara + ara spoon uppu 1L vellathil). Okshanam ninnu Ondansetron 4mg. Kanji, thayir choru, pazham kazhikkuka. 24 mani koor kondinu kurakkunillenkil doctor ne kaanuka."
    },
    {
        language: "malayalam",
        condition: "pediatric_diarrhea",
        text: "Patient: Kunjinu vayaru ilangunnu, 2 vayasu (Child has diarrhea, 2 years old)\nDoctor: Kuttikalil diarrhea serious aakaam. ORS cheriya cheriya sips aayi 5 minutinu onnu kodukuka. Zinc syrup 10ml divasavum 10-14 divasam. Breastfeeding thodaru. Warning signs: kannu ullil poyal, kanneer varunnillenkil, moothram illenkil - udane hospital il kondu poka."
    },
    
    // Sugar / Diabetes
    {
        language: "malayalam",
        condition: "diabetes_high",
        text: "Patient: Ente sugar koodi, fasting 195 aayirunnu (My sugar increased, fasting was 195)\nDoctor: Fasting sugar 195 mg/dL valare kooduthal aanu, diabetes control il illa. Target fasting 100 il thaazhae venam. Metformin dose koottanam or Glimepiride add cheyyaanam. HbA1c test cheyyuka. Choru, chappathi kurakuka, pachakkari koottuka. Divasavum 30 nimisham nadakkuka."
    },
    {
        language: "malayalam",
        condition: "diabetic_neuropathy",
        text: "Patient: Diabetes undu, kaal marathu pokunnu (Have diabetes, feet getting numb)\nDoctor: Ithu diabetic neuropathy aanu - koodiya sugar kondanu nerves kedukkunnathu. Methylcobalamin 1500mcg divasavum + Pregabalin 75mg raatri thudanguka. Sugar strict control il vaikkuka. Divasavum kaal pareekshikkuka - murivu, wound onnu. Eppozum cheppillaathe nadakkaruthu."
    },
    {
        language: "malayalam",
        condition: "diabetes_symptoms",
        text: "Patient: Valare dhaaham, adikadi bathroom poka venam (Very thirsty, frequent urination)\nDoctor: Koodiya dhaaham, adikadi bathroom - diabetes nte lakshanangal aakaam. Udane random sugar test cheyyuka. 200 kkalum kooduthal enkil diabetes confirm. Fasting test, HbA1c um cheyyuka. Vellam 3-4 liters kudikkuka. Mittayi avoid cheyyuka."
    },
    
    // Body Pain
    {
        language: "malayalam",
        condition: "body_pain",
        text: "Patient: Udampu muzhuvan vedana (Whole body pain)\nDoctor: Udal vedana - pala kaaranangal undaakaam. Pani undo? Recent aayi viral infection undaayo? Monsoon il dengue, chikungunya um undaakaam. Ippol Paracetamol 650mg divasam 3 praavashyam, rest eduka, vellam kudikkuka. Pani undenkil CBC um dengue test um cheyyuka."
    },
    {
        language: "malayalam",
        condition: "vitamin_d_deficiency",
        text: "Patient: Kai kaal vedana, ezhunnelkaan pattunnilla (Hands and legs pain, can't get up)\nDoctor: Ee lakshanangal Vitamin D deficiency il common aanu - India il valare aalukalkkum undu. Tests cheyyuka: Vitamin D, calcium, ESR. Vitamin D kuravu enkil (usually <10) Cholecalciferol 60000 IU aazchayil onnu 8 weeks kazhikkuka."
    },
    
    // BP / Hypertension
    {
        language: "malayalam",
        condition: "hypertension",
        text: "Patient: BP koodi vannu, 160/100 aayirunnu (BP came high, was 160/100)\nDoctor: Stage 2 hypertension undu - marunu kazhikkanam. Amlodipine 5mg raavile thudanguka. Uppu kurakkuka - 5g/divasam enna thaazhae, achar, papad avoid cheyyuka. 2 aazcha kazhinja BP check cheyyuka. Target: 130/80 il thaazhae. Kidney function, ECG um cheyyuka."
    },
    {
        language: "malayalam",
        condition: "hypertensive_crisis",
        text: "Patient: Thala vedana, BP check cheythappol valare kooduthal (Headache, BP was very high when checked)\nDoctor: Thala vedana um high BP um - serious aanu. Reading ethra? 180/120 il kooduthal enkil emergency aanu. Rest eduka, Amlodipine 5mg kazhikkuka, 1 mani koor kazhinja veendum check cheyyuka. Neravedana, kannu problem, or balam kuravu enkil udane hospital poka."
    },
    
    // Fever / Dengue
    {
        language: "malayalam",
        condition: "monsoon_fever",
        text: "Patient: Mazha kaalathu pani, udampu vedana (Fever in rainy season, body pain)\nDoctor: Mazha kaalathu pani um udampu vedana um - dengue sandeham undu. NS1 test cheyyuka pani 5 divasathil thaazhae enkil, or IgM/IgG kooduthal divasam enkil. Platelet nu CBC. Aggressive hydration thudanguka - 3-4 liters divasavum. Paracetamol maathram - NSAID onnum venda."
    },
    {
        language: "malayalam",
        condition: "dengue_management",
        text: "Patient: Dengue positive, platelets 50000 (Dengue positive, platelets 50000)\nDoctor: Dengue il platelets 50000 - veettil care aakaam pakshe strict monitoring venam. Hydration valare important - 3-4 liters divasavum (ORS, karikkin vellam, juice). Paracetamol MAATHRAM - Ibuprofen/Aspirin venda (bleeding risk). Divasavum CBC cheyyuka. Warning signs: okshanam, vayaru vedana, bleeding - hospital admit aakuka."
    },
    
    // Regional - Kerala specific (CRITICAL - Leptospirosis, Nipah)
    {
        language: "malayalam",
        condition: "leptospirosis",
        text: "Patient: Vellappokkathu vellathil nadannu, ippol pani undu (Walked in flood water, now have fever)\nDoctor: Vellappokkathu vellathil nadannathinu shesham pani - LEPTOSPIROSIS sandeham, Kerala il especially floods kazhinju common aanu. Lakshananangal: pani, maamsapeshi vedana (especially calf), chuvanna kannu, thala vedana. Tests: CBC, LFT, KFT, leptospira serology. Doxycycline 100mg divasam 2 praavashyam thudanguka - report kaakkenda. Jaundice or moothram kuravu enkil admit aakuka."
    },
    {
        language: "malayalam",
        condition: "nipah_suspicion",
        text: "Patient: Kozhikode district il ninnu, pani undu, thala vedana, okshanum (From Kozhikode district, have fever, headache, vomiting)\nDoctor: Kozhikode ninnanu pani, thala vedana, okshanam - NIPAH VIRUS rule out cheyyaanam, especially fruit bats/pigs contact undenkil. Symptoms: severe pani, thala vedana, okshanam, altered consciousness aakaam. IMMEDIATE isolation um tertiary hospital referral venam. Tests: Nipah PCR (only in designated labs). Contact history um exposure history um critically important. ICU care vendivaraam. Close contacts um monitoring venam."
    },
    {
        language: "malayalam",
        condition: "scrub_typhus",
        text: "Patient: Wayanad il thamasikunnu, krishi paniyil ninnu pani vannu (Living in Wayanad, fever came after farm work)\nDoctor: Wayanad il krishi pani kazhinjathu pani - SCRUB TYPHUS sandeham, Western Ghats il common aanu. Body yil karuppu spot (eschar) nokkuka, usually maranjirikkunna idam il undu. Tests: Scrub typhus serology, CBC, LFT. Treatment: Doxycycline 100mg divasam 2 praavashyam 7-14 divasam. Treatment vaikkaaruthu - complications undaakaam."
    },
    
    // Acidity
    {
        language: "malayalam",
        condition: "gerd",
        text: "Patient: Nenjil eriyunnu, pulicha vellam varunnu (Burning in chest, sour water coming)\nDoctor: GERD undu - acid reflux. Pantoprazole 40mg vella vayaru + Domperidone 10mg thudanguka. Unna 2 mani koor kazhinja kidakkuka. Chai, coffee, spicy, raathri vaiki unna avoid cheyyuka. Kattilude thala bhagam kooda uyarathil vaikkuka. 2 aazhcha il kurakkunillenkil endoscopy cheyyuka."
    },
    
    // Women's Health
    {
        language: "malayalam",
        condition: "menorrhagia",
        text: "Patient: Periods valare kooduthal varunnu, kattakal varunnu (Periods very heavy, getting clots)\nDoctor: Menorrhagia undu - pareekshikkaanam. Ethra divasam periods varunnu? Pads/tampons divasam ethra (6-8 il kooduthal = heavy)? Tests cheyyuka: CBC (anemia ku), pelvic ultrasound (fibroids, polyps ku). Lakshananangalku: Tranexamic acid (Pause) 500mg divasam 3 praavashyam periods il. Anemia undenkil iron supplements nishchayamaayi."
    },
    {
        language: "malayalam",
        condition: "preeclampsia",
        text: "Patient: Pregnancy il kaal veengunnu, BP um koodi (Feet swelling in pregnancy and BP high)\nDoctor: WARNING - pregnancy il veekkam um high BP um - PREECLAMPSIA aakaam - amma kum baby kum danger. BP reading ethra? Thala vedana, kannu problem, mele vayaru vedana undo? Yes enkil: UDANE hospital poka. Light enkil: bed rest, uppu kurakuka, BP 4 mani koor idavittum check cheyyuka. OB ne kaanikkuka."
    },
    
    // Emergency - Cardiac
    {
        language: "malayalam",
        condition: "heart_attack",
        text: "Patient: Nenjil bharam, idathu kai vedana (Chest heaviness, left arm pain)\nDoctor: EMERGENCY - ithanu heart attack nte lakshananangal. UDANE ACTION: 1) Ambulance or cardiac hospital poka IPPOL. 2) Aspirin 325mg chavuka allergy illenkil. 3) Pakuthi irikkum position il rest eduka. 4) Vedana varum pokum, ignore cheyyaaruthu. Heart muscle minute nu chaakunnu. Niingal drive cheyyaaruthu."
    },
    
    // Emergency - Stroke
    {
        language: "malayalam",
        condition: "stroke",
        text: "Patient: Achan oru side kai kaal pani cheyyunnilla (Dad's one side hand and leg not working)\nDoctor: STROKE EMERGENCY - oru side balam kuravu stroke nte lakshanamaanu. UDANE ambulance or CT scan ulla hospital poka. FAST check: Face droop, Arm weakness, Speech problem, Time to call help. TIME CRITICAL - clot treatment 4.5 mani koor il mathrame pani cheyyuu. Exact time note cheyyuka lakshananangal thudangiya. Vaayil koodi onnum kodukkaruthu."
    },

    // ==========================================
    // ADDITIONAL COMMON SCENARIOS - MULTILINGUAL
    // ==========================================
    
    // Kidney Stones - Multiple Languages
    {
        language: "hindi",
        condition: "kidney_stones",
        text: "Patient: Pathri ka dard ho raha hai, bahut tez (Having stone pain, very severe)\nDoctor: Renal colic - bahut dardnak hota hai. Turant relief: Diclofenac injection IM ya suppository (best for kidney pain), Tramadol agar zaroorat ho, antispasmodic (Drotin). Bahut paani piyen (3-4 L/din). Size matter karta hai: <5mm usually nikal jaata hai, 5-10mm help chahiye, >10mm surgery (ESWL) chahiye. CT scan KUB karwayein. Tamsulosin stone nikalne mein help karta hai. Agar bukhar ho toh emergency - infection hai."
    },
    {
        language: "malayalam",
        condition: "kidney_stones",
        text: "Patient: Moothra kalu vedana, valare kathinavum (Kidney stone pain, very severe)\nDoctor: Renal colic - valare vedana ullathaanu. Udane aaswaasam: Diclofenac injection IM or suppository (kidney vedanakku best), Tramadol venam enkil, antispasmodic (Drotin). Valare vellam kudikkuka (3-4 L/divasam). Size pradhaanam: <5mm usually purathe pokum, 5-10mm sahayam venam, >10mm surgery (ESWL) venam. CT scan KUB cheyyuka. Tamsulosin stone purathe pokaan sahayikkum. Pani undenkil emergency - infection aanu."
    },
    
    // Thyroid - Multiple Languages  
    {
        language: "hindi",
        condition: "hypothyroidism",
        text: "Patient: Thyroid hai, TSH badha hua hai (Have thyroid, TSH is high)\nDoctor: TSH badha matlab hypothyroidism - thyroid kam kaam kar raha hai. Common hai India mein, especially women mein. Symptoms: thakan, weight badhna, thand lagni, baal girna, irregular periods. Treatment: Levothyroxine (Thyronorm/Eltroxin). Dose TSH aur weight ke hisaab se. 25-50mcg se shuru, khali pet, breakfast se 30 min pehle. Calcium/iron 4 ghante baad hi lein. 6 hafte mein TSH dobara check karein. Lifelong medication hai - theek feel hone par bhi band mat karein."
    },
    {
        language: "tamil",
        condition: "hypothyroidism",
        text: "Patient: Thyroid irukku, TSH jaasthi (Have thyroid, TSH is high)\nDoctor: TSH jaasthi na hypothyroidism - thyroid kammi vaelai seikiradhu. India la common, especially pengalukku. Symptoms: sorvau, edai koottam, kulir, mudi udhirtal, periods sariyilla. Treatment: Levothyroxine (Thyronorm/Eltroxin). Dose TSH um edai um vechi. 25-50mcg la aarambam, vella vayiru, breakfast ku 30 nimisham munnadhi. Calcium/iron 4 maaNi neram kazhindhu thaan. 6 vaaram kazhithu TSH thirumba check pannungal. Vaazhnaall marundhu - nalla feel aanalum niRuthaadheergal."
    }
];

// Helper function to get training data by language
export const getTrainingDataByLanguage = (language: string) => {
    return MEDICAL_TRAINING_DATA.filter(item => item.language === language);
};

// Helper function to get training data by condition
export const getTrainingDataByCondition = (condition: string) => {
    return MEDICAL_TRAINING_DATA.filter(item => item.condition === condition);
};

// Helper function to get all unique languages
export const getAvailableLanguages = () => {
    return [...new Set(MEDICAL_TRAINING_DATA.map(item => item.language))];
};

// Helper function to get all unique conditions
export const getAvailableConditions = () => {
    return [...new Set(MEDICAL_TRAINING_DATA.map(item => item.condition))];
};

// Language metadata for display
export const LANGUAGE_METADATA = {
    hindi: { name: "Hindi", nativeName: "हिंदी", region: "North India" },
    marathi: { name: "Marathi", nativeName: "मराठी", region: "Maharashtra" },
    tamil: { name: "Tamil", nativeName: "தமிழ்", region: "Tamil Nadu" },
    telugu: { name: "Telugu", nativeName: "తెలుగు", region: "Andhra Pradesh & Telangana" },
    kannada: { name: "Kannada", nativeName: "ಕನ್ನಡ", region: "Karnataka" },
    bengali: { name: "Bengali", nativeName: "বাংলা", region: "West Bengal" },
    gujarati: { name: "Gujarati", nativeName: "ગુજરાતી", region: "Gujarat" },
    malayalam: { name: "Malayalam", nativeName: "മലയാളം", region: "Kerala" }
};

// Regional disease awareness
export const REGIONAL_DISEASES = {
    kerala: ["leptospirosis", "nipah_suspicion", "scrub_typhus"],
    karnataka: ["scrub_typhus", "leptospirosis"],
    tamil_nadu: ["scrub_typhus", "leptospirosis"],
    bengal: ["kala_azar", "leptospirosis"],
    gujarat: ["cutaneous_leishmaniasis", "leptospirosis"],
    all_states: ["dengue", "malaria", "typhoid", "chikungunya"]
};

export default MEDICAL_TRAINING_DATA;
