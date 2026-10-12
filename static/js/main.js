document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const analyzeBtn = document.getElementById('analyzeBtn');
    const readAloudBtn = document.getElementById('readAloudBtn');
    const warnFamilyBtn = document.getElementById('warnFamilyBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    const textInput = document.getElementById('textInput');
    const charCounter = document.getElementById('charCounter');
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
    const uploadMainText = document.getElementById('uploadMainText');
    const uploadSubText = document.getElementById('uploadSubText');
    const btnIdleText = document.getElementById('btnIdleText');
    const btnStatusLabel = document.getElementById('btnStatusLabel');
    const explanationTitle = document.getElementById('explanationTitle');
    const readAloudLabel = document.getElementById('readAloudLabel');
    const linkCheckTitle = document.getElementById('linkCheckTitle');
    const nextStepsTitle = document.getElementById('nextStepsTitle');
    const reminderText = document.getElementById('reminderText');
    const warnFamilyLabel = document.getElementById('warnFamilyLabel');
    const privacyText = document.getElementById('privacyText');

    let currentVerdict = null;
    let configuredModel = 'gemma-4-31b-it';

    // Character Counter
    if (textInput && charCounter) {
        textInput.addEventListener('input', () => {
            charCounter.textContent = `${textInput.value.length}/5000`;
        });
    }

    // --- Translations Dictionary ---
    const I18N = {
        English: {
            placeholder: "Paste a suspicious SMS, WhatsApp message, or email...",
            uploadMain: "Drop a screenshot here or browse files",
            uploadSub: "PNG, JPG, WebP · Max 5 MB",
            analyzeBtn: "Analyze message",
            analyzingStatus: "Analyzing with Gemma...",
            explanationHeading: "Explanation",
            readAloud: "Read Aloud",
            linkCheckHeading: "Link Check",
            nextStepsHeading: "Next Steps",
            reminder: "<strong>Reminder:</strong> Do not click links, block the sender, call 1930, or report at cybercrime.gov.in",
            warnFamily: "Warn my family",
            privacy: "Your messages aren't stored. Analysis is processed securely using Google's Gemini API. Screenshots are NOT masked, so avoid images with OTPs or personal numbers.",
            emptyLinks: "No links found in this message.",
            emptyInputAlert: "Please paste a message or upload a screenshot to analyze.",
            waAlertHeader: "SafeText Guardian Warning: I received a message flagged as"
        },
        Hindi: {
            placeholder: "संदिग्ध SMS, WhatsApp संदेश या ईमेल यहाँ पेस्ट करें...",
            uploadMain: "स्क्रीनशॉट यहाँ छोड़ें या फ़ाइल चुनें",
            uploadSub: "PNG, JPG, WebP · अधिकतम 5 MB",
            analyzeBtn: "संदेश की जांच करें",
            analyzingStatus: "Gemma द्वारा जांच हो रही है...",
            explanationHeading: "स्पष्टीकरण",
            readAloud: "बोलकर सुनाएं",
            linkCheckHeading: "वेबसाइट लिंक जांच",
            nextStepsHeading: "सावधानी के अगले कदम",
            reminder: "<strong>याद रखें:</strong> किसी लिंक पर क्लिक न करें, प्रेषक को ब्लॉक करें, 1930 पर कॉल करें, या cybercrime.gov.in पर रिपोर्ट दर्ज करें।",
            warnFamily: "परिवार को सावधान करें",
            privacy: "आपके संदेश सहेजे नहीं जाते हैं। रीयल-टाइम जांच Google کے Gemini API द्वारा सुरक्षित रूप से की जाती है। स्क्रीनशॉट मास्क नहीं होते, इसलिए OTP या व्यक्तिगत नंबर वाली तस्वीरें न अपलोड करें।",
            emptyLinks: "इस संदेश में कोई वेबसाइट लिंक नहीं मिला।",
            emptyInputAlert: "कृपया जांच के लिए कोई संदेश पेस्ट करें या स्क्रीनशॉट अपलोड करें।",
            waAlertHeader: "SafeText Guardian चेतावनी: मुझे एक संदिग्ध संदेश मिला है जो इस श्रेणी में है:"
        },
        Telugu: {
            placeholder: "అనుమానాస్పద SMS, WhatsApp లేదా ఇమెయిల్‌ను ఇక్కడ పేస్ట్ చేయండి...",
            uploadMain: "స్క్రీన్‌షాట్‌ను ఇక్కడ వేయండి లేదా ఫైల్స్ ఎంచుకోండి",
            uploadSub: "PNG, JPG, WebP · గరిష్టంగా 5 MB",
            analyzeBtn: "సందేశాన్ని విశ్లేషించండి",
            analyzingStatus: "Gemma విశ్లేషిస్తోంది...",
            explanationHeading: "వివరణ",
            readAloud: "చదివి వినిపించు",
            linkCheckHeading: "లింక్ భద్రతా తనిఖీ",
            nextStepsHeading: "తదుపరి తీసుకోవాల్సిన చర్యలు",
            reminder: "<strong>గుర్తుంచుకోండి:</strong> అనుమానాస్పద లింక్‌లపై క్లిక్ చేయవద్దు, పంపినవారిని బ్లాక్ చేయండి, 1930 హెల్ప్‌లైన్‌కు కాల్ చేయండి లేదా cybercrime.gov.in లో ఫిర్యాదు చేయండి.",
            warnFamily: "కుటుంబాన్ని హెచ్చరించండి",
            privacy: "మీ సందేశాలు నిల్వ చేయబడవు. తనిఖీ Google Gemini API ద్వారా సురక్షితంగా నిర్వహించబడుతుంది. స్క్రీన్‌షాట్‌లు మాస్క్ చేయబడవు, కాబట్టి OTP లేదా వ్యక్తిగత నంబర్లు ఉన్న చిత్రాలను అప్‌లోడ్ చేయవద్దు.",
            emptyLinks: "ఈ సందేశంలో ఎటువంటి వెబ్‌సైట్ లింకులు కనుగొనబడలేదు.",
            emptyInputAlert: "దయచేసి విశ్లేషించడానికి సందేశాన్ని పేస్ట్ చేయండి లేదా స్క్రీన్‌షాట్‌ను అప్‌లోడ్ చేయండి.",
            waAlertHeader: "SafeText Guardian హెచ్చరిక: నాకు అనుమానాస్పద సందేశం వచ్చింది, రిస్క్ స్థాయి:"
        }
    };

    function applyLanguage(lang) {
        const t = I18N[lang] || I18N.English;
        if (textInput) textInput.placeholder = t.placeholder;
        if (btnIdleText) btnIdleText.textContent = t.analyzeBtn;
        if (btnStatusLabel) btnStatusLabel.textContent = t.analyzingStatus;
        if (explanationTitle) explanationTitle.textContent = t.explanationHeading;
        if (readAloudLabel) readAloudLabel.textContent = t.readAloud;
        if (linkCheckTitle) linkCheckTitle.textContent = t.linkCheckHeading;
        if (nextStepsTitle) nextStepsTitle.textContent = t.nextStepsHeading;
        if (reminderText) reminderText.innerHTML = t.reminder;
        if (warnFamilyLabel) warnFamilyLabel.textContent = t.warnFamily;
        if (uploadMainText) uploadMainText.innerHTML = t.uploadMain;
        if (uploadSubText) uploadSubText.textContent = t.uploadSub;

        // If links list is showing empty state, update text
        if (linkList) {
            const emptyEl = linkList.querySelector('.empty-links-text');
            if (emptyEl) {
                emptyEl.textContent = t.emptyLinks;
            }
        }
    }

    // Nav tabs active toggle
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    if (langSelect) {
        langSelect.addEventListener('change', () => {
            applyLanguage(langSelect.value);
        });
    }

    // --- Dark / Light Theme Toggle ---
    function initTheme() {
        const savedTheme = localStorage.getItem('safetext-guardian-theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('dark');
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('safetext-guardian-theme', theme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    initTheme();

    // Fetch configured model info from backend
    fetch('/api/model-info')
        .then(res => res.json())
        .then(data => {
            if (data && data.model) {
                configuredModel = data.model;
                if (btnActiveModel) {
                    btnActiveModel.textContent = configuredModel;
                }
            }
        })
        .catch(() => {});

    // Upload Dropzone Handlers
    function updateFileView(file) {
        if (!file) {
            if (uploadIdle) uploadIdle.classList.remove('hidden');
            if (uploadSelected) uploadSelected.classList.add('hidden');
            return;
        }
        if (fileName) fileName.textContent = file.name;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        if (fileSize) fileSize.textContent = `${sizeMb} MB`;
        if (uploadIdle) uploadIdle.classList.add('hidden');
        if (uploadSelected) uploadSelected.classList.remove('hidden');
    }

    if (dropZone) {
        dropZone.addEventListener('click', (e) => {
            if (e.target.closest('#removeFileBtn')) return;
            if (imageInput) imageInput.click();
        });

        dropZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (imageInput) imageInput.click();
            }
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
                if (imageInput) imageInput.files = e.dataTransfer.files;
                updateFileView(e.dataTransfer.files[0]);
            }
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', () => {
            if (imageInput.files && imageInput.files[0]) {
                updateFileView(imageInput.files[0]);
            } else {
                updateFileView(null);
            }
        });
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (imageInput) imageInput.value = '';
            updateFileView(null);
        });
    }

    function setButtonLoading(isLoading) {
        if (!analyzeBtn) return;
        if (isLoading) {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('btn-analyzing');
            if (btnIdleContent) btnIdleContent.classList.add('hidden');
            if (btnActiveAnalyzing) btnActiveAnalyzing.classList.remove('hidden');
            if (btnActiveModel) {
                btnActiveModel.textContent = configuredModel;
            }
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('btn-analyzing');
            if (btnIdleContent) btnIdleContent.classList.remove('hidden');
            if (btnActiveAnalyzing) btnActiveAnalyzing.classList.add('hidden');
        }
    }

    async function analyze() {
        const textVal = textInput && textInput.value ? textInput.value.trim() : '';
        const hasImage = imageInput && imageInput.files && imageInput.files[0];
        const currentLang = (langSelect && langSelect.value) ? langSelect.value : 'English';
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
        if (resultSection) resultSection.classList.add('hidden');
        if (errorSection) errorSection.classList.add('hidden');

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
        const currentLang = (langSelect && langSelect.value) ? langSelect.value : 'English';
        const t = I18N[currentLang] || I18N.English;

        if (riskBadge) {
            riskBadge.textContent = verdict.risk_level;
            riskBadge.className = 'risk-badge badge-' + verdict.risk_level.toLowerCase();
        }
        if (explanationText) {
            explanationText.textContent = verdict.explanation;
        }

        const modelUsed = data.model_used || configuredModel || 'gemma-4-31b-it';
        if (resultModelName) {
            resultModelName.textContent = `Gemma 4 (${modelUsed})`;
        }

        if (linkList) {
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
        }

        if (nextStepsList) {
            nextStepsList.innerHTML = '';
            if (verdict.next_steps && Array.isArray(verdict.next_steps)) {
                verdict.next_steps.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    nextStepsList.appendChild(li);
                });
            }
        }

        if (resultSection) {
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function showError(msg) {
        if (errorText) errorText.textContent = msg;
        if (errorSection) {
            errorSection.classList.remove('hidden');
            errorSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyze);
    }

    if (readAloudBtn) {
        readAloudBtn.addEventListener('click', () => {
            if (!explanationText || !explanationText.textContent) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(explanationText.textContent);
            const lang = (langSelect && langSelect.value) ? langSelect.value : 'English';
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
    }

    if (warnFamilyBtn) {
        warnFamilyBtn.addEventListener('click', () => {
            if (!currentVerdict) return;
            const currentLang = (langSelect && langSelect.value) ? langSelect.value : 'English';
            const t = I18N[currentLang] || I18N.English;
            const text = encodeURIComponent(`⚠️ ${t.waAlertHeader} ${currentVerdict.risk_level}.\n\n${currentVerdict.explanation}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        });
    }

    // Initialize with current language setting
    if (langSelect) {
        applyLanguage(langSelect.value);
    }
});
