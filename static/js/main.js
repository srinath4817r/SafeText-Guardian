document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const analyzeBtn = document.getElementById('analyzeBtn');
    const readAloudBtn = document.getElementById('readAloudBtn');
    const warnFamilyBtn = document.getElementById('warnFamilyBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    const textInput = document.getElementById('textInput');
    const imageInput = document.getElementById('imageInput');
    const langSelect = document.getElementById('language');

    const dropZone = document.getElementById('dropZone');
    const uploadIdle = document.getElementById('uploadIdle');
    const uploadSelected = document.getElementById('uploadSelected');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFileBtn');

    const btnIdleContent = analyzeBtn.querySelector('.btn-idle-content');
    const btnActiveAnalyzing = analyzeBtn.querySelector('.btn-active-analyzing');
    const btnActiveModel = document.getElementById('btnActiveModel');

    const resultSection = document.getElementById('resultSection');
    const resultModelName = document.getElementById('resultModelName');
    const errorSection = document.getElementById('errorSection');
    const errorText = document.getElementById('errorText');

    const riskBadge = document.getElementById('riskBadge');
    const explanationText = document.getElementById('explanationText');
    const linkList = document.getElementById('linkList');
    const nextStepsList = document.getElementById('nextStepsList');

    // Translatable Elements
    const appSubtitle = document.getElementById('appSubtitle');
    const uploadMainText = document.getElementById('uploadMainText');
    const uploadSubText = document.getElementById('uploadSubText');
    const btnIdleText = document.getElementById('btnIdleText');
    const btnStatusLabel = document.getElementById('btnStatusLabel');
    const analysedByPrefix = document.getElementById('analysedByPrefix');
    const explanationTitle = document.getElementById('explanationTitle');
    const readAloudLabel = document.getElementById('readAloudLabel');
    const linkCheckTitle = document.getElementById('linkCheckTitle');
    const nextStepsTitle = document.getElementById('nextStepsTitle');
    const reminderText = document.getElementById('reminderText');
    const warnFamilyLabel = document.getElementById('warnFamilyLabel');
    const privacyText = document.getElementById('privacyText');

    let currentVerdict = null;
    let configuredModel = 'gemma-4-31b-it';

    // --- Translations Dictionary ---
    const I18N = {
        English: {
            subtitle: "Protecting you from scam texts & phishing",
            placeholder: "Paste the message here...",
            uploadMain: "Upload Screenshot",
            uploadSub: "Click to browse or drop image (PNG, JPG, WebP)",
            analyzeBtn: "Analyze Message",
            analyzingStatus: "Analyzing message...",
            analysedBy: "Analysed by",
            explanationHeading: "Explanation",
            readAloud: "Read Aloud",
            linkCheckHeading: "Link Check",
            nextStepsHeading: "Next Steps",
            reminder: "<strong>Reminder:</strong> Do not click links, block the sender, call 1930, or report at cybercrime.gov.in",
            warnFamily: "Warn my family",
            privacy: "<strong>Privacy Assurance:</strong> No photos or messages are stored on our servers. Messages are sent to Google's Gemini API for analysis. Screenshots are NOT masked, so avoid images with OTPs or personal numbers.",
            emptyLinks: "No links found in this message.",
            emptyInputAlert: "Please paste a message or upload a screenshot to analyze.",
            waAlertHeader: "SafeText Guardian Warning: I received a message flagged as"
        },
        Hindi: {
            subtitle: "धोखाधड़ी वाले संदेशों और फ़िशिंग से आपकी सुरक्षा",
            placeholder: "संदेश यहाँ पेस्ट करें...",
            uploadMain: "स्क्रीनशॉट अपलोड करें",
            uploadSub: "फ़ोटो चुनने के लिए क्लिक करें या यहाँ छोड़ें (PNG, JPG, WebP)",
            analyzeBtn: "संदेश की जांच करें",
            analyzingStatus: "संदेश का विश्लेषण किया जा रहा है...",
            analysedBy: "विश्लेषण किया गया:",
            explanationHeading: "स्पष्टीकरण",
            readAloud: "बोलकर सुनाएं",
            linkCheckHeading: "वेबसाइट लिंक जांच",
            nextStepsHeading: "सावधानी के अगले कदम",
            reminder: "<strong>याद रखें:</strong> किसी लिंक पर क्लिक न करें, भेजने वाले को ब्लॉक करें, 1930 पर कॉल करें, या cybercrime.gov.in पर रिपोर्ट दर्ज करें।",
            warnFamily: "परिवार को सावधान करें",
            privacy: "<strong>गोपनीयता आश्वासन:</strong> हमारे सर्वर पर कोई भी संदेश या फ़ोटो सहेजी नहीं जाती है। रीयल-टाइम विश्लेषण के लिए संदेश Google کے Gemini API को भेजे जाते हैं। स्क्रीनशॉट मास्क नहीं होते, इसलिए OTP या व्यक्तिगत नंबर वाली तस्वीरें न अपलोड करें।",
            emptyLinks: "इस संदेश में कोई वेबसाइट लिंक नहीं मिला।",
            emptyInputAlert: "कृपया जांच के लिए कोई संदेश पेस्ट करें या स्क्रीनशॉट अपलोड करें।",
            waAlertHeader: "SafeText Guardian चेतावनी: मुझे एक संदिग्ध संदेश मिला है जो इस श्रेणी में है:"
        },
        Telugu: {
            subtitle: "స్కామ్ మెసేజ్‌లు మరియు ఫిషింగ్ లింకుల నుండి మీ రక్షణ",
            placeholder: "సందేశాన్ని ఇక్కడ పేస్ట్ చేయండి...",
            uploadMain: "స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి",
            uploadSub: "ఫోటోను ఎంచుకోవడానికి క్లిక్ చేయండి లేదా ఇక్కడ వేయండి (PNG, JPG, WebP)",
            analyzeBtn: "సందేశాన్ని విశ్లేషించండి",
            analyzingStatus: "సందేశాన్ని పరిశీలిస్తోంది...",
            analysedBy: "విశ్లేషించిన మోడల్:",
            explanationHeading: "వివరణ",
            readAloud: "చదివి వినిపించు",
            linkCheckHeading: "లింక్ భద్రతా తనిఖీ",
            nextStepsHeading: "తదుపరి తీసుకోవాల్సిన చర్యలు",
            reminder: "<strong>గుర్తుంచుకోండి:</strong> అనుమానాస్పద లింక్‌లపై క్లిక్ చేయవద్దు, పంపినవారిని బ్లాక్ చేయండి, 1930 హెల్ప్‌లైన్‌కు కాల్ చేయండి లేదా cybercrime.gov.in లో ఫిర్యాదు చేయండి.",
            warnFamily: "కుటుంబాన్ని హెచ్చరించండి",
            privacy: "<strong>గోప్యతా హామీ:</strong> మా సర్వర్‌లలో ఎటువంటి సందేశాలు లేదా ఫోటోలు నిల్వ చేయబడవు. తనిఖీ కోసం సందేశాలు Google Gemini APIకి పంపబడతాయి. స్క్రీన్‌షాట్‌లు మాస్క్ చేయబడవు, కాబట్టి OTP లేదా వ్యక్తిగత నంబర్లు ఉన్న చిత్రాలను అప్‌లోడ్ చేయవద్దు.",
            emptyLinks: "ఈ సందేశంలో ఎటువంటి వెబ్‌సైట్ లింకులు కనుగొనబడలేదు.",
            emptyInputAlert: "దయచేసి విశ్లేషించడానికి సందేశాన్ని పేస్ట్ చేయండి లేదా స్క్రీన్‌షాట్‌ను అప్‌లోడ్ చేయండి.",
            waAlertHeader: "SafeText Guardian హెచ్చరిక: నాకు అనుమానాస్పద సందేశం వచ్చింది, రిస్క్ స్థాయి:"
        }
    };

    function applyLanguage(lang) {
        const t = I18N[lang] || I18N.English;
        appSubtitle.textContent = t.subtitle;
        textInput.placeholder = t.placeholder;
        uploadMainText.textContent = t.uploadMain;
        uploadSubText.textContent = t.uploadSub;
        btnIdleText.textContent = t.analyzeBtn;
        btnStatusLabel.textContent = t.analyzingStatus;
        analysedByPrefix.textContent = t.analysedBy;
        explanationTitle.textContent = t.explanationHeading;
        readAloudLabel.textContent = t.readAloud;
        linkCheckTitle.textContent = t.linkCheckHeading;
        nextStepsTitle.textContent = t.nextStepsHeading;
        reminderText.innerHTML = t.reminder;
        warnFamilyLabel.textContent = t.warnFamily;
        privacyText.innerHTML = t.privacy;

        // If links list is showing empty state, update text
        const emptyEl = linkList.querySelector('.empty-links-text');
        if (emptyEl) {
            emptyEl.textContent = t.emptyLinks;
        }
    }

    langSelect.addEventListener('change', () => {
        applyLanguage(langSelect.value);
    });

    // --- Dark / Light Theme Toggle ---
    function initTheme() {
        const savedTheme = localStorage.getItem('safetext-guardian-theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('safetext-guardian-theme', theme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    initTheme();

    // Fetch configured model info from backend
    fetch('/api/model-info')
        .then(res => res.json())
        .then(data => {
            if (data && data.model) {
                configuredModel = data.model;
                if (btnActiveModel) {
                    btnActiveModel.textContent = `Gemma 4 (${configuredModel})`;
                }
            }
        })
        .catch(() => {});

    // Upload Dropzone Handlers
    function updateFileView(file) {
        if (!file) {
            uploadIdle.classList.remove('hidden');
            uploadSelected.classList.add('hidden');
            return;
        }
        fileName.textContent = file.name;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        fileSize.textContent = `${sizeMb} MB`;
        uploadIdle.classList.add('hidden');
        uploadSelected.classList.remove('hidden');
    }

    dropZone.addEventListener('click', (e) => {
        if (e.target.closest('#removeFileBtn')) return;
        imageInput.click();
    });

    dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            imageInput.click();
        }
    });

    imageInput.addEventListener('change', () => {
        if (imageInput.files && imageInput.files[0]) {
            updateFileView(imageInput.files[0]);
        } else {
            updateFileView(null);
        }
    });

    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageInput.value = '';
        updateFileView(null);
    });

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-active');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            imageInput.files = e.dataTransfer.files;
            updateFileView(e.dataTransfer.files[0]);
        }
    });

    function setButtonLoading(isLoading) {
        if (isLoading) {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('btn-analyzing');
            btnIdleContent.classList.add('hidden');
            btnActiveAnalyzing.classList.remove('hidden');
            if (btnActiveModel) {
                btnActiveModel.textContent = `Gemma 4 (${configuredModel})`;
            }
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('btn-analyzing');
            btnIdleContent.classList.remove('hidden');
            btnActiveAnalyzing.classList.add('hidden');
        }
    }

    async function analyze() {
        const textVal = textInput.value ? textInput.value.trim() : '';
        const hasImage = imageInput.files && imageInput.files[0];
        const currentLang = langSelect.value || 'English';
        const t = I18N[currentLang] || I18N.English;

        if (!textVal && !hasImage) {
            showError(t.emptyInputAlert);
            return;
        }

        const formData = new FormData();
        formData.append('text', textVal);
        formData.append('language', currentLang);
        if (hasImage) {
            formData.append('image', imageInput.files[0]);
        }

        setButtonLoading(true);
        resultSection.classList.add('hidden');
        errorSection.classList.add('hidden');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Server error');

            showResult(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setButtonLoading(false);
        }
    }

    function showResult(data) {
        currentVerdict = data.verdict;
        const { verdict, evidence } = data;
        const currentLang = langSelect.value || 'English';
        const t = I18N[currentLang] || I18N.English;

        riskBadge.textContent = verdict.risk_level;
        riskBadge.className = 'badge badge-' + verdict.risk_level.toLowerCase();
        explanationText.textContent = verdict.explanation;

        const modelUsed = data.model_used || configuredModel || 'gemma-4-31b-it';
        if (resultModelName) {
            resultModelName.textContent = `Gemma 4 (${modelUsed})`;
        }

        linkList.innerHTML = '';
        if (!evidence.links || evidence.links.length === 0) {
            const emptySpan = document.createElement('span');
            emptySpan.className = 'empty-links-text';
            emptySpan.textContent = t.emptyLinks;
            linkList.appendChild(emptySpan);
        } else {
            evidence.links.forEach(link => {
                const div = document.createElement('div');
                div.className = 'link-item';
                const urlEl = document.createElement('strong');
                urlEl.textContent = link.url;
                const reasonsEl = document.createElement('small');
                reasonsEl.textContent = link.reasons.join(', ') || 'No issues detected';
                div.appendChild(urlEl);
                div.appendChild(document.createElement('br'));
                div.appendChild(reasonsEl);
                linkList.appendChild(div);
            });
        }

        nextStepsList.innerHTML = '';
        if (verdict.next_steps && Array.isArray(verdict.next_steps)) {
            verdict.next_steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                nextStepsList.appendChild(li);
            });
        }

        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function showError(msg) {
        errorText.textContent = msg;
        errorSection.classList.remove('hidden');
        errorSection.scrollIntoView({ behavior: 'smooth' });
    }

    analyzeBtn.addEventListener('click', analyze);

    readAloudBtn.addEventListener('click', () => {
        if (!explanationText.textContent) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(explanationText.textContent);
        const lang = langSelect.value;
        if (lang === 'Hindi') {
            utterance.lang = 'hi-IN';
        } else if (lang === 'Telugu') {
            utterance.lang = 'te-IN';
        } else {
            utterance.lang = 'en-IN';
        }
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    });

    warnFamilyBtn.addEventListener('click', () => {
        if (!currentVerdict) return;
        const currentLang = langSelect.value || 'English';
        const t = I18N[currentLang] || I18N.English;
        const text = encodeURIComponent(`⚠️ ${t.waAlertHeader} ${currentVerdict.risk_level}.\n\n${currentVerdict.explanation}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    });

    // Initialize with current language setting
    applyLanguage(langSelect.value);
});
