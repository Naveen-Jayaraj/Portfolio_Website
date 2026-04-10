    document.addEventListener('DOMContentLoaded', () => {

        // Scroll Progress Bar
        const scrollProgress = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            if (scrollProgress) scrollProgress.style.width = `${scrollPercentage}%`;
        });

        // --- START: GSAP DEEP-Z PARALLAX ---
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            
            setTimeout(() => {
                const panes = document.querySelectorAll('.glass-pane');
                panes.forEach(pane => {
                    const speed = parseFloat(pane.getAttribute('data-speed')) || 0.5;
                    gsap.to(pane, {
                        y: () => (document.documentElement.scrollHeight - window.innerHeight) * speed * -1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: document.body,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: true,
                            invalidateOnRefresh: true
                        }
                    });
                });
            }, 100);
        }
        // --- END: GSAP DEEP-Z PARALLAX ---

        const timestamp = new Date().getTime(); // Keep timestamp accessible
        const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isSmallScreen = () => window.innerWidth < 768;
        const favicon = document.getElementById('favicon-link');
        const headerLogo = document.getElementById('header-logo'); // Get logo element

        // --- START: GIF Cache Bust (Favicon Only Now) ---
        if (favicon) {
            // UPDATED PATH
            favicon.href = 'assets/logo.png?' + timestamp;
        }
        // --- END: GIF Cache Bust ---

        const aura = document.getElementById('cursor-aura');
        if (aura && hasFinePointer) {
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    aura.style.left = `${e.clientX}px`;
                    aura.style.top = `${e.clientY}px`;
                });
            });
            document.addEventListener('mousedown', () => { aura.style.transform = 'translate(-50%, -50%) scale(0.9)'; });
            document.addEventListener('mouseup', () => { aura.style.transform = 'translate(-50%, -50%) scale(1)'; });
        }

        const themeToggleBtn = document.getElementById('theme-toggle');
        const docElement = document.documentElement;

        // --- START: MATRIX RAIN EFFECT ---
        let matrixInterval;
        let matrixCanvas;
        let matrixResizeHandler;
        
        function startMatrixRain() {
            if (matrixCanvas) return;
            matrixCanvas = document.createElement('canvas');
            matrixCanvas.id = 'matrix-canvas';
            matrixCanvas.className = 'fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-80';
            document.body.appendChild(matrixCanvas);
            
            const ctx = matrixCanvas.getContext('2d');
            const resizeMatrix = () => {
                matrixCanvas.width = window.innerWidth;
                matrixCanvas.height = window.innerHeight;
            };
            matrixResizeHandler = resizeMatrix;
            resizeMatrix();
            window.addEventListener('resize', matrixResizeHandler);
            
            const codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~f';
            const fontSize = 16;
            let columns = Math.floor(matrixCanvas.width / fontSize);
            let drops = [];
            for (let x = 0; x < columns; x++) drops[x] = Math.random() * -100; // Start at different heights
            
            matrixInterval = setInterval(() => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';
                for (let i = 0; i < drops.length; i++) {
                    const text = codes.charAt(Math.floor(Math.random() * codes.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
            }, 33);
        }
        
        function stopMatrixRain() {
            if (matrixInterval) clearInterval(matrixInterval);
            if (matrixCanvas) matrixCanvas.remove();
            matrixCanvas = null;
            matrixInterval = null;
            if (matrixResizeHandler) {
                window.removeEventListener('resize', matrixResizeHandler);
                matrixResizeHandler = null;
            }
        }
        // --- END: MATRIX RAIN EFFECT ---

        // --- START: KONAMI CODE VARIABLES (Moved Up) ---
        let konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        let konamiIndex = 0;
        // --- END: KONAMI CODE VARIABLES ---

        function showMessageBox(message) { // Defined showMessageBox early
            const existingBox = document.querySelector('.message-box');
            if (existingBox) existingBox.remove();
            const messageBox = document.createElement('div');
            messageBox.className = 'message-box';
            messageBox.textContent = message;
            document.body.appendChild(messageBox);
            setTimeout(() => messageBox.remove(), 3500);
        }

        const applyTheme = (theme) => {
            // --- Check if Matrix Mode is active ---
            if (docElement.classList.contains('matrix-mode')) {
                showMessageBox("No turning back now... (Exit Matrix Mode first)");
                return; // Stop execution if in Matrix Mode
            }
            // --- End Check ---

            docElement.classList.toggle('dark', theme === 'dark');
            docElement.classList.toggle('light', theme !== 'dark');

            // Update Header Logo Based on Theme
            if (headerLogo) {
                const currentTimestamp = new Date().getTime();
                if (theme === 'dark') {
                    headerLogo.src = 'assets/white_logo_nobg.gif?' + currentTimestamp;
                } else {
                    headerLogo.src = 'assets/black_logo_nobg.gif?' + currentTimestamp;
                }
            }

            const ghChart = document.getElementById('github-chart');
            if (ghChart) {
                ghChart.src = theme === 'dark' ? 'https://ghchart.rshah.org/a3b18a/Naveen-Jayaraj' : 'https://ghchart.rshah.org/0f172a/Naveen-Jayaraj';
            }

            if (window.VANTA && window.VANTA.NET) {
                if (window.vantaEffect) window.vantaEffect.destroy();
                const mobileLike = isSmallScreen() || !hasFinePointer;
                window.vantaEffect = window.VANTA.NET({
                    el: "#vanta-bg",
                    mouseControls: hasFinePointer,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 0.85,
                    color: theme === 'dark' ? 0xa3b18a : 0x9ca3af,
                    backgroundColor: theme === 'dark' ? 0x121212 : 0xffffff,
                    points: mobileLike || prefersReducedMotion ? 7.00 : 12.00,
                    maxDistance: mobileLike || prefersReducedMotion ? 14.00 : 20.00,
                    spacing: mobileLike ? 22.00 : 18.00
                });
            }
        };

        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme); // Sets initial theme and logo

        themeToggleBtn.addEventListener('click', () => {
            // --- Check if Matrix Mode is active ---
            if (docElement.classList.contains('matrix-mode')) {
                showMessageBox("The Matrix has you... (Exit Matrix Mode first)");
                return; // Stop if in Matrix Mode
            }
            // --- End Check ---
            const newTheme = docElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme); // Updates theme and potentially logo
        });


        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section-container');
        let terminalInitialized = false;
        function showSection(targetId) {
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.add('active');
            navLinks.forEach(link => {
                link.classList.toggle('active-link', link.dataset.target === targetId);
            });
            if (targetId === 'terminal' && !terminalInitialized) {
                showWelcomeMessage();
                terminalInitialized = true;
            }
        }
        const handleHashChange = () => showSection(window.location.hash.substring(1) || 'about');
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);
        handleHashChange();
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.dataset.target;
                history.pushState(null, null, `#${targetId}`);
                showSection(targetId);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
            });
        });

        // Global Reveal Observer Engine
        const initRevealObserver = () => {
            const reveals = document.querySelectorAll('.reveal:not(.reveal-active)');
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-active');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            reveals.forEach(r => observer.observe(r));
        };
        initRevealObserver(); // Run for statics on load

        // +++ START: SUPABASE CONFIG & CMS +++
        const SUPABASE_URL = 'https://ahocghrgdrwollilrzqe.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_yJ-BqKokipJzQZjpNA-Wuw_2QWmTWHQ';
        const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

        // Compress Image Logic
        const compressImage = async (file, maxWidth = 1200, quality = 0.6) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => resolve(blob), 'image/webp', quality);
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        };

        // Upload to Supabase Storage
        const uploadFile = async (file) => {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
            const { data, error } = await supabase.storage.from('portfolio_assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('portfolio_assets').getPublicUrl(fileName);
            return publicUrl;
        };

        window.saveProfileImage = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const btn = document.querySelector('#admin-profile-overlay span');
            if (!btn) return;
            const originalText = btn.textContent;
            try {
                btn.textContent = 'Uploading...';
                const comp = await compressImage(file);
                const imgUrl = await uploadFile(comp);
                const { error } = await supabase.from('portfolio_config').update({ profile_image_url: imgUrl }).eq('id', 'main');
                if (error) {
                    console.error("Supabase Error:", error);
                    throw error;
                }
                btn.textContent = 'Saved!';
                setTimeout(() => location.reload(), 1000);
            } catch (e) {
                btn.textContent = 'Error!';
                console.error(e);
            }
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        };

        let isAdminMode = false;
        window.dynamicCommandsCache = {};

        async function loadPortfolioData() {
            if (!supabase || SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
                console.warn('Supabase not configured.');
                return;
            }
            try {
                // Fetch dynamic commands cache
                const { data: dynCmds } = await supabase.from('portfolio_terminal_commands').select('*');
                if (dynCmds) {
                    dynCmds.forEach(c => window.dynamicCommandsCache[c.command] = c.response);
                }

                // Fetch Config
                const { data: config } = await supabase.from('portfolio_config').select('*').eq('id', 'main').single();
                if (config) {
                    if (config.skills_data) {
                        try {
                            window.constellationData = typeof config.skills_data === 'string' 
                                ? JSON.parse(config.skills_data) 
                                : config.skills_data;
                        } catch(e) {
                            console.error("Invalid skills_data from DB:", e);
                        }
                    }

                    // Check Profile Image
                    const profileImg = document.getElementById('profile-img');
                    const profileSvg = document.getElementById('profile-svg');
                    const profileOverlay = document.getElementById('admin-profile-overlay');
                    if (profileImg && profileSvg && profileOverlay) {
                        if (config.profile_image_url) {
                            profileImg.src = config.profile_image_url;
                            profileImg.classList.remove('hidden');
                            profileSvg.classList.add('hidden');
                        } else {
                            profileImg.classList.add('hidden');
                            profileSvg.classList.remove('hidden');
                        }
                        if (isAdminMode) {
                            profileOverlay.classList.remove('hidden');
                            profileOverlay.classList.add('flex');
                        } else {
                            profileOverlay.classList.add('hidden');
                            profileOverlay.classList.remove('flex');
                        }
                    }

                    const heroNameEl = document.querySelector('.hero-name');
                    const heroTaglineEl = document.querySelector('#about p.text-lg');
                    const aboutTextEl = document.querySelector('#about p.leading-relaxed');
                    if (heroNameEl) { 
                        heroNameEl.className = 'hero-name transition-all duration-300';
                        heroNameEl.textContent = config.hero_name; 
                        if(isAdminMode) { heroNameEl.contentEditable="true"; heroNameEl.classList.add('border-b', 'border-dashed', 'border-red-500'); }
                    }
                    if (heroTaglineEl) { 
                        heroTaglineEl.className = 'text-lg transition-all duration-300';
                        if(isAdminMode) { 
                            heroTaglineEl.textContent = config.hero_tagline;
                            heroTaglineEl.contentEditable="true"; heroTaglineEl.classList.add('border-b', 'border-dashed', 'border-red-500'); 
                        } else {
                            if (!window.typewriterRunning) {
                                window.typewriterRunning = true;
                                heroTaglineEl.innerHTML = '';
                                const txt = config.hero_tagline || '';
                                let speed = 50;
                                let i = 0;
                                function typeWriter() {
                                    if (i < txt.length) {
                                        heroTaglineEl.innerHTML += txt.charAt(i);
                                        i++;
                                        setTimeout(typeWriter, speed);
                                    }
                                }
                                typeWriter();
                            }
                        }
                    }
                    if (aboutTextEl) { 
                        aboutTextEl.className = 'leading-relaxed max-w-4xl mx-auto text-left sm:text-center text-base sm:text-lg transition-all duration-300';
                        aboutTextEl.innerHTML = config.about_text; 
                        if(isAdminMode) { aboutTextEl.contentEditable="true"; aboutTextEl.classList.add('border', 'border-dashed', 'border-red-500', 'p-2'); }
                    }
                    const emailLink = document.querySelector('a[href^="mailto:"]');
                    if (emailLink) emailLink.href = `mailto:${config.contact_email}`;

                    // Append Save About Button if Admin
                    const aboutSection = document.getElementById('about');
                    let saveBtn = document.getElementById('inline-save-about');
                    if (isAdminMode && !saveBtn) {
                        const btnDiv = document.createElement('div');
                        btnDiv.innerHTML = `<button id="inline-save-about" onclick="window.saveInlineAbout()" class="mt-6 px-4 py-2 bg-red-600 text-white rounded font-bold shadow-lg hover:bg-red-700">Save Config</button><span id="inline-about-status" class="ml-4 text-red-500 font-bold"></span>`;
                        btnDiv.className = "text-center";
                        aboutSection.querySelector('.max-w-4xl').parentElement.appendChild(btnDiv);
                    }
                }

                // Fetch Certificates
                let certQuery = supabase.from('portfolio_certificates').select('*').order('sort_order', { ascending: true });
                if (!isAdminMode) certQuery = certQuery.eq('is_visible', true);
                const { data: certs } = await certQuery;
                
                const certificatesGrid = document.getElementById('certificates-grid');
                if (certs && certificatesGrid) {
                    let html = certs.map(cert => `
                        <div class="themed-card rounded-lg overflow-hidden reveal relative ${cert.is_visible === false ? 'opacity-50 grayscale' : ''}" data-id="${cert.id}">
                        ${isAdminMode ? `
                            <div class="absolute top-2 right-2 flex gap-2 z-10">
                                <button class="bg-gray-700/80 rounded p-1 text-white text-xs w-6 h-6 flex items-center justify-center hover:bg-gray-900 shadow" onclick="window.toggleInlineCert('${cert.id}', ${cert.is_visible})">${cert.is_visible === false ? '🙈' : '👁️'}</button>
                                <button class="bg-red-600/80 rounded p-1 text-white text-xs font-bold w-6 h-6 flex items-center justify-center hover:bg-red-800 shadow" onclick="window.deleteInlineCert('${cert.id}')">X</button>
                            </div>
                        ` : ''}
                        <img src="${cert.image_url}" alt="${cert.title || 'Certificate'}" loading="lazy" class="object-cover w-full h-full cursor-pointer" onclick="showModal('${cert.image_url}')">
                        </div>`).join('');
                    
                    if (isAdminMode) {
                        html += `
                        <button id="add-cert-btn" class="themed-card rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 flex justify-center items-center h-full min-h-[150px] text-4xl text-gray-400 hover:text-[var(--text-link)] hover:border-[var(--text-link)] transition-all cursor-pointer" onclick="document.getElementById('add-cert-form').classList.remove('hidden'); this.classList.add('hidden')">+</button>
                        <div id="add-cert-form" class="hidden themed-card rounded-xl flex flex-col p-4 border-2 border-dashed border-[var(--text-link)] justify-center items-center text-center h-full min-h-[150px]">
                            <h3 class="font-bold text-sm mb-2 text-primary">Deploy Cert</h3>
                            <input type="text" id="inline-c-title" placeholder="Title" class="w-full mb-2 p-1 border rounded text-black text-xs">
                            <input type="file" id="inline-c-file" accept="image/*" class="w-full mb-2 text-xs text-primary">
                            <button onclick="window.saveInlineCert()" class="bg-[var(--text-link)] text-[var(--bg-body-start)] px-2 py-1 mt-2 rounded font-bold text-xs">Deploy</button>
                            <button onclick="document.getElementById('add-cert-form').classList.add('hidden'); document.getElementById('add-cert-btn').classList.remove('hidden')" class="text-xs text-gray-500 mt-2">Cancel</button>
                            <span id="inline-c-status" class="mt-2 text-xs font-bold text-[var(--text-link)]"></span>
                        </div>`;
                    }
                    certificatesGrid.innerHTML = html;
                    if (isAdminMode) {
                        new Sortable(certificatesGrid, { 
                            animation: 350, 
                            onEnd: async () => {
                                const els = Array.from(certificatesGrid.children).filter(el => el.hasAttribute('data-id'));
                                const updates = els.map((el, i) => ({ id: el.getAttribute('data-id'), sort_order: i }));
                                await supabase.from('portfolio_certificates').upsert(updates);
                            }
                        });
                    }
                }

                // Fetch Works
                let workQuery = supabase.from('portfolio_works').select('*').order('sort_order', { ascending: true });
                if (!isAdminMode) workQuery = workQuery.eq('is_visible', true);
                const { data: works } = await workQuery;

                const worksGrid = document.getElementById('works-grid');
                if (works && worksGrid) {
                    let html = works.map(work => {
                        const liveLinkButton = work.live_url ? `<a href="${work.live_url}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center px-4 py-2 font-semibold text-[var(--text-link)] border border-[var(--text-link)] rounded-lg hover:bg-[var(--text-link)] hover:text-[var(--bg-body-start)] transition-all duration-200">View Site</a>` : '';
                        return `
                        <div class="themed-card rounded-xl flex flex-col overflow-hidden reveal relative ${work.is_visible === false ? 'opacity-50 grayscale' : ''}" data-id="${work.id}">
                            ${isAdminMode ? `
                            <div class="absolute top-2 right-2 flex gap-2 z-10">
                                <button class="bg-gray-700/80 rounded p-1 text-white text-sm w-8 h-8 flex items-center justify-center hover:bg-gray-900 shadow" onclick="window.toggleInlineWork('${work.id}', ${work.is_visible})">${work.is_visible === false ? '🙈' : '👁️'}</button>
                                <button class="bg-red-600/80 rounded p-1 text-white text-sm font-bold w-8 h-8 flex items-center justify-center hover:bg-red-800 shadow" onclick="window.deleteInlineWork('${work.id}')">X</button>
                            </div>` : ''}
                            <div class="overflow-hidden"><img src="${work.image_url}" alt="${work.title}" loading="lazy" class="rounded-t-lg object-cover w-full h-56"></div>
                            <div class="p-6 flex flex-col flex-grow">
                                <h3 class="text-xl font-bold mb-2 text-primary">${work.title}</h3>
                                <p class="mb-4 flex-grow project-description">${work.description || ''}</p>
                                <div class="mt-auto pt-4 border-t border-[var(--border-color)]">
                                    <div class="flex items-center justify-center gap-4">
                                        ${liveLinkButton}
                                        ${work.repo_url ? `<a href="${work.repo_url}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center px-4 py-2 font-semibold text-secondary border border-[var(--border-color)] rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200">View Repo</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }).join('');

                    if (isAdminMode) {
                        html += `
                        <button id="add-work-btn" class="themed-card rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 flex justify-center items-center h-full min-h-[300px] text-5xl text-gray-400 hover:text-[var(--text-link)] hover:border-[var(--text-link)] transition-all cursor-pointer" onclick="document.getElementById('add-work-form').classList.remove('hidden'); this.classList.add('hidden')">+</button>
                        <div id="add-work-form" class="hidden themed-card rounded-xl flex flex-col p-6 border-2 border-dashed border-[var(--text-link)] justify-center items-center text-center h-full min-h-[300px]">
                            <h3 class="font-bold text-lg mb-2 text-primary">Deploy New Project</h3>
                            <input type="text" id="inline-w-title" placeholder="Title" class="w-full mb-2 p-1 border rounded text-black text-sm">
                            <textarea id="inline-w-desc" placeholder="Desc" class="w-full mb-2 p-1 border rounded text-black text-sm h-16"></textarea>
                            <input type="text" id="inline-w-live" placeholder="Live URL" class="w-full mb-2 p-1 border rounded text-black text-sm">
                            <input type="text" id="inline-w-repo" placeholder="Repo URL" class="w-full mb-2 p-1 border rounded text-black text-sm">
                            <input type="file" id="inline-w-file" accept="image/*" class="w-full mb-2 text-sm text-primary">
                            <button onclick="window.saveInlineWork()" class="bg-[var(--text-link)] text-[var(--bg-body-start)] px-4 py-2 mt-2 rounded font-bold shadow-lg">Compress & Deploy</button>
                            <button onclick="document.getElementById('add-work-form').classList.add('hidden'); document.getElementById('add-work-btn').classList.remove('hidden')" class="text-sm text-gray-500 mt-3">Cancel</button>
                            <span id="inline-w-status" class="mt-2 text-xs font-bold text-[var(--text-link)]"></span>
                        </div>`;
                    }
                    worksGrid.innerHTML = html;
                    if (isAdminMode) {
                        new Sortable(worksGrid, { 
                            animation: 350, 
                            onEnd: async () => {
                                const els = Array.from(worksGrid.children).filter(el => el.hasAttribute('data-id'));
                                const updates = els.map((el, i) => ({ id: el.getAttribute('data-id'), sort_order: i }));
                                await supabase.from('portfolio_works').upsert(updates);
                            }
                        });
                    }
                }
                initRevealObserver();
                
                // Initialize VanillaTilt on project and certificate cards
                if (window.VanillaTilt && hasFinePointer && !isSmallScreen() && !prefersReducedMotion) {
                    VanillaTilt.init(document.querySelectorAll(".themed-card"), {
                        max: 5,
                        speed: 400,
                        glare: true,
                        "max-glare": 0.2
                    });
                }
            } catch (err) {
                console.error('Supabase load error:', err);
            }
        }
        const runBootSequence = async () => {
            const bootScreen = document.getElementById('boot-screen');
            const bootText = document.getElementById('boot-text');
            
            if (sessionStorage.getItem('hasBooted')) {
                bootScreen.style.display = 'none';
                loadPortfolioData();
                return;
            }

            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
            bootScreen.style.display = 'flex';
            
            const logs = [
                "Linux version 6.1.0-18-amd64 (gcc-12) (SUDO-CORE)",
                "Command line: BOOT_IMAGE=/boot/vmlinuz root=UUID=74b... ro quiet",
                "[ OK ] Reached target Basic System.",
                "[ OK ] Started Backend Auditing Service.",
                "[ OK ] Initializing core neural physics engine...",
                "[ OK ] Mounting visual drivers [WebGL_VANTA]...",
                "[ OK ] Configuring dynamic DOM rendering pipeline...",
                "[ OK ] Establishing secure zero-trust connection to database...",
                "[....] Fetching portfolio records..."
            ];

            const sleep = ms => new Promise(r => setTimeout(r, ms));
            
            for (let i = 0; i < logs.length; i++) {
                const div = document.createElement('div');
                div.textContent = logs[i];
                bootText.appendChild(div);
                
                if (logs[i] === "[....] Fetching portfolio records...") {
                    await loadPortfolioData();
                    div.textContent = "[ OK ] Fetching portfolio records... -> SUCCESS";
                    await sleep(300);
                } else {
                    await sleep(Math.random() * 200 + 50);
                }
            }
            
            const closingLogs = [
                "[ OK ] Bypassing security protocols...",
                "[ OK ] Boot sequence complete.",
                "Entering Portfolio GUI..."
            ];
            
            for (let i = 0; i < closingLogs.length; i++) {
                const div = document.createElement('div');
                div.textContent = closingLogs[i];
                bootText.appendChild(div);
                await sleep(150 + Math.random() * 100);
            }
            
            await sleep(400); 
            
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                document.body.style.overflow = '';
                sessionStorage.setItem('hasBooted', 'true');
            }, 700);
        };

        runBootSequence();

        // INLINE ADMIN DOM HOOKS

        window.saveProfileImage = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const btn = document.querySelector('#admin-profile-overlay span');
            if (!btn) return;
            const originalText = btn.textContent;
            try {
                btn.textContent = 'Uploading...';
                const comp = await compressImage(file);
                const imgUrl = await uploadFile(comp);
                const { error } = await supabase.from('portfolio_config').update({ profile_image_url: imgUrl }).eq('id', 'main');
                if (error) throw error;
                btn.textContent = 'Saved!';
                loadPortfolioData();
            } catch (e) {
                btn.textContent = 'Error!';
                console.error(e);
            }
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        };

        window.toggleInlineWork = async (id, currentVis) => {
            await supabase.from('portfolio_works').update({ is_visible: !currentVis }).eq('id', id);
            loadPortfolioData();
        };

        window.toggleInlineCert = async (id, currentVis) => {
            await supabase.from('portfolio_certificates').update({ is_visible: !currentVis }).eq('id', id);
            loadPortfolioData();
        };

        window.saveInlineAbout = async () => {
            const btn = document.getElementById('inline-about-status');
            try {
                btn.textContent = 'Saving...';
                const hn = document.querySelector('.hero-name').textContent;
                const ht = document.querySelector('#about p.text-lg').textContent;
                const at = document.querySelector('#about p.leading-relaxed').innerHTML;
                const { error } = await supabase.from('portfolio_config').update({ hero_name: hn, hero_tagline: ht, about_text: at }).eq('id', 'main');
                if (error) throw error;
                btn.textContent = 'Saved!';
                setTimeout(() => btn.textContent='', 2000);
            } catch(e) { btn.textContent = 'Error: ' + e.message; }
        };

        window.deleteInlineWork = async (id) => {
            if(!confirm("Destroy project from database?")) return;
            await supabase.from('portfolio_works').delete().eq('id', id);
            loadPortfolioData();
        };

        window.saveInlineWork = async () => {
            const btn = document.getElementById('inline-w-status');
            try {
                btn.textContent = 'Compressing...';
                const file = document.getElementById('inline-w-file').files[0];
                let imgUrl = '';
                if(file) {
                    const comp = await compressImage(file);
                    imgUrl = await uploadFile(comp);
                }
                btn.textContent = 'Deploying...';
                await supabase.from('portfolio_works').insert([{
                    title: document.getElementById('inline-w-title').value,
                    description: document.getElementById('inline-w-desc').value,
                    live_url: document.getElementById('inline-w-live').value,
                    repo_url: document.getElementById('inline-w-repo').value,
                    image_url: imgUrl,
                    is_visible: true
                }]);
                loadPortfolioData();
            } catch(e) { btn.textContent = 'Error: ' + e.message; }
        };

        window.deleteInlineCert = async (id) => {
            if(!confirm("Destroy certificate?")) return;
            await supabase.from('portfolio_certificates').delete().eq('id', id);
            loadPortfolioData();
        };

        window.saveInlineCert = async () => {
            const btn = document.getElementById('inline-c-status');
            try {
                btn.textContent = 'Uploading...';
                const file = document.getElementById('inline-c-file').files[0];
                if(!file) throw new Error("File required");
                const comp = await compressImage(file);
                const imgUrl = await uploadFile(comp);
                await supabase.from('portfolio_certificates').insert([{
                    title: document.getElementById('inline-c-title').value || 'Certificate',
                    image_url: imgUrl,
                    is_visible: true
                }]);
                loadPortfolioData();
            } catch(e) { btn.textContent = 'Error: ' + e.message; }
        };
        // +++ END: SUPABASE CONFIG & CMS +++

        // --- START: HASHNODE BLOG FETCH ---
        const blogContainer = document.getElementById('blog-posts-container');
        if (blogContainer) {
            const HASHNODE_API = 'https://gql.hashnode.com/';
            const HASHNODE_HOST = 'naveenjayaraj.hashnode.dev'; // your blog subdomain

            const query = `
            query GetUserPosts($host: String!) {
                publication(host: $host) {
                posts(first: 6) {
                    edges {
                    node {
                        title
                        brief
                        slug
                        url
                        coverImage {
                        url
                        }
                        publishedAt
                    }
                    }
                }
                }
            }
            `;

            fetch(HASHNODE_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    variables: { host: HASHNODE_HOST },
                }),
            })
            .then(res => res.json())
            .then(result => {
                const posts = result.data?.publication?.posts?.edges?.map(edge => edge.node);

                if (!posts || posts.length === 0) {
                    blogContainer.innerHTML = '<p class="text-center text-secondary">No blog posts found on Hashnode.</p>';
                    return;
                }

                blogContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = document.createElement('a');
                    postElement.href = post.url;
                    postElement.target = '_blank';
                    postElement.className = 'themed-card rounded-xl overflow-hidden block blog-post-card';

                    const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const coverImageHTML = post.coverImage?.url
                        ? `<img src="${post.coverImage.url}" alt="${post.title}" loading="lazy" class="w-full h-56 object-cover">`
                        : '';

                    postElement.innerHTML = `
                        ${coverImageHTML}
                        <div class="p-6 sm:p-8">
                            <h3 class="text-2xl font-bold mb-1 text-primary">${post.title}</h3>
                            <p class="text-sm text-secondary mb-4">${formattedDate}</p>
                            <p class="text-primary leading-relaxed">${post.brief}</p>
                            <span class="mt-4 inline-block font-semibold text-[var(--text-link)]">Read More &rarr;</span>
                        </div>
                    `;
                    postElement.classList.add('reveal');
                    blogContainer.appendChild(postElement);
                });
                initRevealObserver();
            })
            .catch(error => {
                console.error("Error fetching Hashnode posts:", error);
                blogContainer.innerHTML = `<p class="text-center" style="color:#c94c4c;">Could not load blog posts from Hashnode.</p>`;
            });
        }
        // --- END: HASHNODE BLOG FETCH ---



        const imageModal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        window.showModal = (imageUrl) => {
            modalImage.src = imageUrl;
            imageModal.style.display = 'flex';
        };
    // showMessageBox moved up before applyTheme

        // --- START: KONAMI CODE LISTENER (Modified) ---
        document.addEventListener('keydown', (e) => {
            const lowerKey = e.key.toLowerCase();

            // Only listen if not in terminal or contact form
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            const requiredKey = konamiCode[konamiIndex];

            if (lowerKey === requiredKey) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    const willBeMatrix = !docElement.classList.contains('matrix-mode'); // Check state *before* toggling
                    docElement.classList.toggle('matrix-mode');
                    showMessageBox(willBeMatrix ? 'Welcome to the Matrix.' : 'Returning to the construct...');

                    if (willBeMatrix) {
                        docElement.classList.add('dark');
                        docElement.classList.remove('light');
                        if (window.vantaEffect) { window.vantaEffect.destroy(); window.vantaEffect = null; }
                        document.getElementById('vanta-bg').style.background = '#000';
                        startMatrixRain();
                        if (headerLogo) headerLogo.src = 'assets/matrix_logo_nobg.gif?' + new Date().getTime();
                    } else {
                        stopMatrixRain();
                        document.getElementById('vanta-bg').style.background = '';
                        applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
                    }
                    konamiIndex = 0;
                }
            } else {
                // Reset if wrong key, unless it's the first key again
                konamiIndex = (lowerKey === konamiCode[0]) ? 1 : 0;
            }
        });
        // --- END: KONAMI CODE LISTENER ---


        const terminalOutput = document.getElementById('terminal-output');
        const terminalInput = document.getElementById('terminal-input');
        const terminalInputLine = document.getElementById('terminal-input-line');
        const terminalBody = document.getElementById('terminal-body');

        let commandHistory = [];
        let historyIndex = -1;
        let terminalState = 'default';

        let isEffectActive = false;
        let gameLoop;
        let gameKeyListener;

        const skillsData = { 'Languages': 'Python, JavaScript, SQL, HTML/CSS', 'AI/ML': 'TensorFlow, PyTorch, Scikit-learn, YOLOv8, OpenCV, Pandas', 'Backend': 'Node.js, Flask, REST APIs', 'Frontend': 'React, Tailwind CSS, HTML5', 'Tools': 'Docker, Git/GitHub, GCP, VS Code' };
        const printToTerminal = (html, styleClass = 'terminal-output-text') => {
            const line = document.createElement('div');
            line.className = styleClass;
            line.innerHTML = html;
            terminalOutput.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        };
        const getTerminalPromptHTML = () => isAdminMode ? `<span class="text-red-500 mr-2 font-bold whitespace-nowrap">admin@portfolio:#</span>` : `<span class="text-blue-600 dark:text-blue-400 mr-2 font-bold whitespace-nowrap transition-colors duration-300">guest@portfolio:~$</span>`;

        const printCommand = (command) => {
            printToTerminal(`${getTerminalPromptHTML()} <span class="text-slate-800 dark:text-gray-300 font-mono transition-colors duration-300">${command}</span>`);
        };

        const executeCommand = async (cmd) => {
            const parts = cmd.trim().split(' ');
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);
            const currentTimestampCmd = new Date().getTime();

            // Supabase Sudo Login
            if (terminalState === 'login') {
                terminalState = 'default';
                
                const fc = document.getElementById('fake-cursor');
                if (fc) fc.remove();
                terminalInput.classList.remove('opacity-0');
                terminalInput.type = 'text';

                if (!supabase) {
                    document.getElementById('terminal-prompt').innerHTML = 'guest@portfolio:~$';
                    document.getElementById('terminal-prompt').className = 'text-blue-600 dark:text-blue-400 mr-2 font-bold whitespace-nowrap transition-colors duration-300';
                    return printToTerminal('Supabase client not initialized.', 'text-red-600 dark:text-red-400 terminal-output-error');
                }
                
                const { data, error } = await supabase.auth.signInWithPassword({ email: 'admin@portfolio.local', password: cmd.trim() });
                if (error) {
                    printToTerminal(`su: Authentication failure`, 'text-red-600 dark:text-red-400 terminal-output-error');
                    document.getElementById('terminal-prompt').innerHTML = 'guest@portfolio:~$';
                    document.getElementById('terminal-prompt').className = 'text-blue-600 dark:text-blue-400 mr-2 font-bold whitespace-nowrap transition-colors duration-300';
                } else {
                    isAdminMode = true;
                    document.getElementById('terminal-prompt').innerHTML = 'admin@portfolio:#';
                    document.getElementById('terminal-prompt').className = 'text-red-500 mr-2 font-bold whitespace-nowrap';
                    printToTerminal(`Access Granted. ROOT mode activated. WYSIWYG Editor UNLOCKED.`);
                    loadPortfolioData();
                }
                return;
            }

            if (command === 'exit' || command === 'logout') {
                if (isAdminMode) {
                    isAdminMode = false;
                    document.getElementById('terminal-prompt').innerHTML = 'guest@portfolio:~$';
                    document.getElementById('terminal-prompt').className = 'text-blue-600 dark:text-blue-400 mr-2 font-bold whitespace-nowrap transition-colors duration-300';
                    if(supabase) supabase.auth.signOut();
                    printToTerminal('Active Session Terminated. WYSIWYG Editor Locked.');
                    // Purge layout visual locks
                    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                        el.removeAttribute('contenteditable');
                        el.classList.remove('border-b', 'border', 'border-dashed', 'border-red-500', 'p-2');
                    });
                    const saveBtn = document.getElementById('inline-save-about');
                    if(saveBtn) saveBtn.parentElement.remove();
                    loadPortfolioData();
                } else {
                    printToTerminal('guest@portfolio has no active session.');
                }
                return;
            }

            if ((command === 'su' || command === 'sudo') && args[0] === 'admin') {
                printToTerminal('SUDO CORE ACCESS TRIGGERED.');
                
                document.getElementById('terminal-prompt').textContent = 'Password: ';
                document.getElementById('terminal-prompt').className = 'text-slate-800 dark:text-gray-300 mr-2 font-bold whitespace-nowrap flex items-center transition-colors duration-300';
                
                terminalInput.type = 'password';
                terminalInput.classList.add('opacity-0');
                
                const fake = document.createElement('span');
                fake.id = 'fake-cursor';
                fake.className = 'w-2.5 h-4 ml-1 bg-slate-800 dark:bg-gray-300 animate-pulse block translate-y-[2px]';
                document.getElementById('terminal-prompt').appendChild(fake);
                
                terminalState = 'login';
                return;
            }

            if (window.dynamicCommandsCache && window.dynamicCommandsCache[command] && command !== 'exit' && command !== 'su') {
                printToTerminal(window.dynamicCommandsCache[command]);
                return;
            }

            switch (command) {
                case 'help':
                    let helpText = `<strong class="text-primary">Available Commands:</strong><div class="grid grid-cols-[100px_auto] gap-x-4 mt-2">
                            <span class="terminal-help-command">help</span><span class="terminal-help-description">Show this list of commands.</span>
                            <span class="terminal-help-command">about</span><span class="terminal-help-description">Display my professional summary.</span>
                            <span class="terminal-help-command">socials</span><span class="terminal-help-description">Display my social media links.</span>
                            <span class="terminal-help-command">resume</span><span class="terminal-help-description">Open my resume in a new tab.</span>
                            <span class="terminal-help-command">projects</span><span class="terminal-help-description">Navigate to the 'Works' section.</span>
                            <span class="terminal-help-command">blog</span><span class="terminal-help-description">Go to the blog section.</span>
                            <span class="terminal-help-command">skills</span><span class="terminal-help-description">Show a list of my technical skills.</span>
                            <span class="terminal-help-command">contact</span><span class="terminal-help-description">Display my contact email.</span>
                            <span class="terminal-help-command">theme</span><span class="terminal-help-description">Change theme. Usage: theme [light|dark]</span>
                            <span class="terminal-help-command">repo</span><span class="terminal-help-description">Opens the portfolio's GitHub repository.</span>
                            <span class="terminal-help-command">donut</span><span class="terminal-help-description">Render an ASCII 3D donut.</span>
                            <span class="terminal-help-command">matrix</span><span class="terminal-help-description">Toggle Matrix mode.</span>
                            <span class="terminal-help-command">whoami</span><span class="terminal-help-description">Print user identity stream.</span>
                            <span class="terminal-help-command">echo</span><span class="terminal-help-description">Print string to terminal.</span>
                            <span class="terminal-help-command">clear</span><span class="terminal-help-description">Clear the terminal screen.</span>
                            <span class="terminal-help-command">exit</span><span class="terminal-help-description">Terminate local admin session.</span></div>`;

                    if (isAdminMode) {
                        helpText += `<div class="mt-4"><strong class="text-red-500">Root Commands:</strong></div><div class="grid grid-cols-[100px_auto] gap-x-4 mt-2">
                            <span class="terminal-help-command text-red-500">glitch</span><span class="terminal-help-description">Trigger visual system disruption.</span>
                            <span class="terminal-help-command text-red-500">hack_target</span><span class="terminal-help-description">Intrusion simulation. Usage: hack_target [ip]</span>
                            <span class="terminal-help-command text-red-500">addcmd</span><span class="terminal-help-description">Override/add command. Usage: addcmd [cmd] [html]</span>
                            <span class="terminal-help-command text-red-500">delcmd</span><span class="terminal-help-description">Delete custom command. Usage: delcmd [cmd]</span></div>`;
                    }
                    printToTerminal(helpText);
                    break;
                case 'about': printToTerminal(document.querySelector('#about .leading-relaxed').textContent.trim()); break;
                case 'blog': window.location.hash = 'blog'; break;
                case 'socials':
                    const socialsText = `
                        <strong class="text-primary">Connect with me:</strong>
                        <div class="mt-2" style="line-height: 1.8;">
                            <div>
                                <a href="https://github.com/Naveen-Jayaraj" target="_blank" rel="noopener noreferrer" class="terminal-help-command underline">GitHub</a>
                                <span class="terminal-help-description"> - github.com/Naveen-Jayaraj</span>
                            </div>
                            <div>
                                <a href="https://www.linkedin.com/in/naveen-jayaraj" target="_blank" rel="noopener noreferrer" class="terminal-help-command underline">LinkedIn</a>
                                <span class="terminal-help-description"> - linkedin.com/in/naveen-jayaraj</span>
                            </div>
                        </div>
                    `;
                    printToTerminal(socialsText);
                    break;
                case 'resume':
                    printToTerminal("Opening resume in a new tab...");
                    window.open('resume.pdf', '_blank');
                    break;
                case 'projects':
                    printToTerminal("Navigating to the 'Works' section...");
                    window.location.hash = 'works';
                    break;
                case 'skills':
                    let skillsOutput = '<strong class="text-primary">Technical Skills:</strong><div class="mt-1">';
                    for (const [category, skills] of Object.entries(skillsData)) { skillsOutput += `<div class="flex"><strong class="w-24 text-[var(--text-link)]">${category}:</strong><span>${skills}</span></div>`; }
                    printToTerminal(skillsOutput + '</div>');
                    break;
                case 'contact': printToTerminal(`You can reach me at: <a href="mailto:naveenpainthouse@gmail.com" class="text-link underline">naveenpainthouse@gmail.com</a>`); break;
                case 'theme':
                    // --- Check if Matrix Mode is active ---
                    if (docElement.classList.contains('matrix-mode')) {
                        printToTerminal("Cannot change theme while in Matrix Mode.", 'terminal-output-error');
                        break; // Stop command execution
                    }
                    // --- End Check ---
                    if (args.length === 1 && (args[0] === 'light' || args[0] === 'dark')) {
                        applyTheme(args[0]); // applyTheme handles logo change
                        localStorage.setItem('theme', args[0]);
                        printToTerminal(`Theme changed to ${args[0]}.`);
                    } else { printToTerminal(`Usage: theme [light|dark]`, 'terminal-output-error'); }
                    break;
                case 'repo':
                    printToTerminal("Opening repository in a new tab...");
                    window.open("https://github.com/Naveen-Jayaraj/Portfolio_Website", "_blank");
                    break;
                case 'donut': startDonutEffect(); break;
                case 'matrix': // Terminal command to toggle matrix mode
                    const willBeMatrixCmd = !docElement.classList.contains('matrix-mode');
                    docElement.classList.toggle('matrix-mode');
                    printToTerminal(`Matrix mode ${willBeMatrixCmd ? 'activated' : 'deactivated'}.`);
                    if (willBeMatrixCmd) {
                        docElement.classList.add('dark');
                        docElement.classList.remove('light');
                        if (window.vantaEffect) { window.vantaEffect.destroy(); window.vantaEffect = null; }
                        document.getElementById('vanta-bg').style.background = '#000';
                        startMatrixRain();
                        if (headerLogo) headerLogo.src = 'assets/matrix_logo_nobg.gif?' + new Date().getTime();
                    } else {
                        stopMatrixRain();
                        document.getElementById('vanta-bg').style.background = '';
                        applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
                    }
                    break;
                case 'whoami': 
                    if (isAdminMode) {
                        printToTerminal(`User Agent: SUDO-CORE-ADMIN<br>Access Level: ROOT / WYSIWYG_UNLOCKED<br>Status: OMNIPOTENT`, 'text-red-500 font-bold');
                    } else {
                        printToTerminal(`User Agent: ${navigator.userAgent}<br>Language: ${navigator.language}<br>Status: Guest User`); 
                    }
                    break;
                case 'echo': 
                    printToTerminal(args.join(' ')); 
                    break;
                case 'clear': terminalOutput.innerHTML = ''; break;
                case '': break;
                default: 
                    if (isAdminMode && command === 'addcmd' && args.length >= 2) {
                        const targetCmd = args[0].toLowerCase();
                        const responseHTML = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
                        try {
                            await supabase.from('portfolio_terminal_commands').upsert({ command: targetCmd, response: responseHTML, description: 'Custom admin command' });
                            window.dynamicCommandsCache[targetCmd] = responseHTML;
                            printToTerminal(`Successfully added memory hook for command [<span class="text-green-500">${targetCmd}</span>].`);
                        } catch(e) { printToTerminal(`Write Failed: ${e.message}`, 'text-red-500'); }
                    } else if (isAdminMode && command === 'delcmd' && args.length >= 1) {
                        const targetCmd = args[0].toLowerCase();
                        await supabase.from('portfolio_terminal_commands').delete().eq('command', targetCmd);
                        delete window.dynamicCommandsCache[targetCmd];
                        printToTerminal(`Erased knowledge of [<span class="text-red-500">${targetCmd}</span>].`);
                    } else if (isAdminMode && command === 'glitch') {
                        printToTerminal('Initiating visual disruption sequence...', 'text-red-500 font-bold animate-pulse');
                        setTimeout(() => {
                            const originalTransform = document.body.style.transform || '';
                            const originalFilter = document.body.style.filter || '';
                            document.body.style.transform = 'skewX(5deg) scale(1.05)';
                            document.body.style.filter = 'invert(1) hue-rotate(180deg) brightness(1.5)';
                            setTimeout(() => {
                                document.body.style.transform = originalTransform;
                                document.body.style.filter = originalFilter;
                            }, 2000);
                        }, 500);
                    } else if (isAdminMode && command === 'hack_target' && args.length > 0) {
                        printToTerminal(`Establishing secure connection to ${args[0]}...`);
                        setTimeout(() => printToTerminal('Bypassing main frame firewalls... [OK]', 'text-green-500'), 1000);
                        setTimeout(() => printToTerminal('Extracting encrypted payload... [OK]', 'text-green-500'), 2000);
                        setTimeout(() => printToTerminal(`Target ${args[0]} compromised. Root shell established.`, 'text-red-500 font-bold'), 3500);
                    } else {
                        if (window.dynamicCommandsCache && window.dynamicCommandsCache[command]) {
                             printToTerminal(window.dynamicCommandsCache[command]);
                        } else {
                             printToTerminal(`bash: ${command}: command not found`, 'text-red-600 dark:text-red-400 font-mono transition-colors duration-300');
                        }
                    }
                    break;
            }
        };

        const endEffect = (effectName) => {
            clearInterval(gameLoop);
            window.removeEventListener('keydown', gameKeyListener);
            isEffectActive = false;
            terminalInputLine.style.display = 'flex';
            printToTerminal(`\n<strong class="text-primary">${effectName} stopped.</strong>`);
            terminalInput.focus();
        };

        const startDonutEffect = () => {
            isEffectActive = true;
            terminalInputLine.style.display = 'none';
            terminalOutput.innerHTML = ''; // Clear everything

            const instruction = document.createElement('div');
            instruction.className = 'terminal-output-text';
            instruction.textContent = 'Rendering 3D Donut... Press "q" to quit.';
            terminalOutput.appendChild(instruction);

            const preEl = document.createElement('pre');
            preEl.className = 'terminal-output-text';
            preEl.style.lineHeight = '1.2';
            preEl.style.fontSize = '12px'; // Make it a bit smaller to fit
            terminalOutput.appendChild(preEl);

            let A = 0, B = 0;

            gameKeyListener = (e) => {
                e.preventDefault();
                if (e.key === 'q') endEffect('Donut');
            };
            window.addEventListener('keydown', gameKeyListener);

            gameLoop = setInterval(() => {
                let b = []; // buffer
                let z = []; // z-buffer
                A += 0.05;
                B += 0.07;
                let cA = Math.cos(A), sA = Math.sin(A),
                    cB = Math.cos(B), sB = Math.sin(B);

                // Adjusted screen size for typical terminal
                const screenHeight = 22;
                const screenWidth = 80;

                for(let k = 0; k < screenWidth * screenHeight; k++) {
                    b[k] = k % screenWidth == (screenWidth - 1) ? "\n" : " ";
                    z[k] = 0;
                }

                for(let j = 0; j < 6.28; j += 0.07) { // j = theta
                    let ct = Math.cos(j), st = Math.sin(j);
                    for(let i = 0; i < 6.28; i += 0.02) { // i = phi
                        let sp = Math.sin(i), cp = Math.cos(i),
                            h = ct + 2, // R1 + R2*cos(theta)
                            D = 1 / (sp * h * sA + st * cA + 5), // 1 / (K2 + z)
                            t = sp * h * cA - st * sA; // z'

                        let x = Math.floor(screenWidth/2 + 30 * D * (cp * h * cB - t * sB));
                        let y = Math.floor(screenHeight/2 + 15 * D * (cp * h * sB + t * cB));

                        let o = x + screenWidth * y;
                        let N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));

                        if(y < screenHeight && y >= 0 && x >= 0 && x < (screenWidth - 1) && D > z[o]) {
                            z[o] = D;
                            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
                        }
                    }
                }
                preEl.innerHTML = b.join("");
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 50);
        };

        const showWelcomeMessage = () => {
            const welcome = `*********************************************************
    * Welcome to Naveen Jayaraj's Interactive Portfolio!   *
    *********************************************************
    Type <span class="terminal-output-command">'help'</span> to see the list of available commands.`;
            printToTerminal(welcome);
        };

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const playKeystrokeSound = () => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime); // randomize pitch
            gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime); // volume
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05); // fast decay
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        };

        terminalInput.addEventListener('keydown', (e) => {
            if (!['Enter', 'Backspace', 'Shift', 'Control', 'Alt', 'ArrowUp', 'ArrowDown', 'Escape', 'Tab'].includes(e.key)) {
                playKeystrokeSound();
            }

            if (terminalState === 'login') {
                if (e.key === 'Enter') {
                    const command = terminalInput.value;
                    printToTerminal('Password: ');
                    executeCommand(command);
                    terminalInput.value = '';
                    e.preventDefault();
                }
                return;
            }

            if (e.key === 'Enter' && !isEffectActive) {
                const command = terminalInput.value.trim();
                printCommand(command);

                if (command) {
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                }
                
                executeCommand(command);
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else if (historyIndex === commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = '';
                }
            }
        });

        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.className = 'pt-2 text-center font-semibold text-primary';
            const data = new FormData(event.target);
            try {
                const response = await fetch(event.target.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = 'var(--text-accent)'; /* Changed success color */
                    form.reset();
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = errorData.errors?.map(e => e.message).join(", ") || 'Oops! There was a problem.';
                    formStatus.style.color = '#c94c4c'; /* Changed error color */
                }
            } catch (error) {
                formStatus.textContent = 'Oops! A network error occurred.';
                formStatus.style.color = '#c94c4c'; /* Changed error color */
                console.error('Form submission error:', error);
            }
            setTimeout(() => { formStatus.textContent = ''; formStatus.style.color = ''; }, 5000);
        });

        // +++ START: MAGNETIC BUTTONS +++
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        if (hasFinePointer && !prefersReducedMotion) {
            magneticBtns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = `translate(0px, 0px)`;
                });
            });
        }
        // +++ END: MAGNETIC BUTTONS +++



        
        // +++ START: D3 CONSTELLATION GRAPH +++
        const initD3Graph = () => {
            const svgEl = document.getElementById('network-canvas');
            if (!svgEl || !window.d3) return;

            svgEl.innerHTML = '';
            
            const width = svgEl.clientWidth || Math.min(window.innerWidth * 0.9, 1000);
            const height = svgEl.clientHeight || (window.innerHeight * 0.6) || 600;
            const isMobile = window.innerWidth < 768;
            const scale = isMobile ? 0.45 : 1.3; // Smaller scale for mobile to avoid tight boundaries

            const svg = d3.select('#network-canvas')
                .attr("viewBox", [-width / 2, -height / 2, width, height]);

            const g = svg.append("g");
            svg.call(d3.zoom()
                .scaleExtent([0.2, 4])
                .on("zoom", (event) => g.attr("transform", event.transform))
            );

            const defaultData = {
                id: "Naveen", group: 0, radius: 45, icon: "github",
                children: [
                    { id: "Programming", group: 1, radius: 25, children: [{id: "Python", group: 1, radius: 16, icon: "python"}, {id: "JavaScript", group: 1, radius: 16, icon: "javascript"}, {id: "TypeScript", group: 1, radius: 16, icon: "typescript"}, {id: "C", group: 1, radius: 16, icon: "c"}, {id: "C++", group: 1, radius: 16, icon: "cplusplus"}] },
                    { id: "Web Tech", group: 2, radius: 25, children: [{id: "HTML", group: 2, radius: 16, icon: "html5"}, {id: "CSS", group: 2, radius: 16, icon: "css3"}] },
                    { id: "AI & ML", group: 3, radius: 25, children: [{id: "Machine Learning", group: 3, radius: 16, icon: "scikitlearn"}, {id: "Deep Learning", group: 3, radius: 16, icon: "keras"}, {id: "NLP", group: 3, radius: 16}, {id: "Computer Vision", group: 3, radius: 16, icon: "opencv"}] },
                    { id: "Frameworks & Libs", group: 4, radius: 25, children: [{id: "FastAPI", group: 4, radius: 16, icon: "fastapi"}, {id: "Flask", group: 4, radius: 16, icon: "flask"}, {id: "TensorFlow", group: 4, radius: 16, icon: "tensorflow"}, {id: "Scikit-learn", group: 4, radius: 16, icon: "scikitlearn"}] },
                    { id: "Data & Vis", group: 5, radius: 25, children: [{id: "Data Analysis", group: 5, radius: 16}, {id: "Statistics", group: 5, radius: 16}, {id: "Plotly", group: 5, radius: 16, icon: "plotly"}] },
                    { id: "Databases", group: 6, radius: 25, children: [{id: "MySQL", group: 6, radius: 16, icon: "mysql"}, {id: "PostgreSQL", group: 6, radius: 16, icon: "postgresql"}, {id: "MongoDB", group: 6, radius: 16, icon: "mongodb"}, {id: "SQLite", group: 6, radius: 16, icon: "sqlite"}] },
                    { id: "Tools & Tech", group: 7, radius: 25, children: [{id: "YOLO", group: 7, radius: 16}, {id: "U-Net", group: 7, radius: 16}, {id: "Ollama", group: 7, radius: 16, icon: "ollama"}] },
                    { id: "Cloud", group: 8, radius: 25, children: [{id: "AWS", group: 8, radius: 16, icon: "amazonaws"}, {id: "GCP", group: 8, radius: 16, icon: "googlecloud"}] },
                    { id: "Concepts", group: 9, radius: 25, children: [{id: "Model Optimization", group: 9, radius: 16}, {id: "Explainable AI", group: 9, radius: 16}, {id: "Geospatial Analysis", group: 9, radius: 16}] },
                    { id: "Soft Skills", group: 10, radius: 25, children: [{id: "Leadership", group: 10, radius: 16}, {id: "Teamwork", group: 10, radius: 16}, {id: "Critical Thinking", group: 10, radius: 16}] },
                    { id: "Languages", group: 11, radius: 25, children: [{id: "English", group: 11, radius: 16}, {id: "Malayalam", group: 11, radius: 16}, {id: "Tamil", group: 11, radius: 16}, {id: "Hindi", group: 11, radius: 16}] }
                ]
            };
            const data = window.constellationData || defaultData;
            window.constellationData = data; // Ensure reference exists

            const nodes = [];
            const links = [];
            
            function flatten(node, parent) {
                node.sc_radius = node.radius * scale;
                nodes.push(node);
                if (parent) links.push({source: parent.id, target: node.id});
                if (node.children) node.children.forEach(child => flatten(child, node));
            }
            const dataCopy = JSON.parse(JSON.stringify(data));
            flatten(dataCopy, null);

            const getLinkDistance = (d) => {
                const baseDist = d.source.id === window.constellationData.id ? 180 : 80;
                return isMobile ? baseDist * 0.45 : baseDist * scale;
            };

            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(getLinkDistance))
                .force("charge", d3.forceManyBody().strength(isMobile ? -150 : -400 * scale))
                .force("center", d3.forceCenter(0, 0))
                .force("collide", d3.forceCollide().radius(d => d.sc_radius + (isMobile ? 5 : 10)).iterations(3));

            const tooltip = document.getElementById('d3-tooltip');

            const link = g.append("g")
                .selectAll("line")
                .data(links)
                .join("line")
                .attr("class", "link");

            const node = g.append("g")
                .selectAll("g")
                .data(nodes)
                .join("g")
                .call(drag(simulation));

            const getColor = (group) => {
                const colors = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4'];
                return colors[group % colors.length];
            };

            node.append("circle")
                .attr("r", d => d.sc_radius)
                .attr("fill", d => d.icon ? "#ffffff" : getColor(d.group))
                .attr("class", "node-circle shadow-lg")
                .on("mouseover", (event, d) => {
                    tooltip.style.opacity = 1;
                    let html = `<strong>${d.id}</strong>${d.children ? `<br/><span class='text-sm text-secondary'>${d.children.length} items</span>` : ''}`;
                    if (d.clickAction) html += `<br/><i class="text-xs text-[var(--text-link)]">${d.clickAction}</i>`;
                    tooltip.innerHTML = html;
                    d3.select(event.currentTarget).attr("stroke", "var(--bg-body-start)").attr("stroke-width", 3);
                    link.attr("stroke", l => l.source.id === d.id || l.target.id === d.id ? "var(--text-primary)" : "var(--text-link)").attr("stroke-opacity", l => l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
                    node.style("opacity", n => n.id === d.id || links.some(l => (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id)) ? 1 : 0.3);
                })
                .on("mousemove", (event) => {
                    const bounds = svgEl.getBoundingClientRect();
                    // On mobile, keep tooltip from overflowing right edge
                    let left = event.clientX - bounds.left + 20;
                    if (isMobile && left > bounds.width - 150) {
                        left = bounds.width - 160;
                    }
                    tooltip.style.left = left + "px";
                    tooltip.style.top = (event.clientY - bounds.top + 20) + "px";
                })
                .on("mouseout", (event) => {
                    tooltip.style.opacity = 0;
                    d3.select(event.currentTarget).attr("stroke", null).attr("stroke-width", null);
                    link.attr("stroke", "var(--text-link)").attr("stroke-opacity", 0.2);
                    node.style("opacity", 1);
                })
                .on("click", (event, d) => {
                    if (isAdminMode) {
                        window.openNodeEditor(d.id);
                    } else if (d.clickAction) {
                        window.showMessageBox(d.clickAction);
                    }
                });

            node.filter(d => d.icon).append("image")
                .attr("href", d => `https://cdn.simpleicons.org/${d.icon}`)
                .attr("width", d => d.sc_radius * 1.5)
                .attr("height", d => d.sc_radius * 1.5)
                .attr("x", d => -(d.sc_radius * 0.75))
                .attr("y", d => -(d.sc_radius * 0.75))
                .attr("pointer-events", "none");

            node.append("text")
                .attr("dy", d => d.sc_radius + 15)
                .attr("text-anchor", "middle")
                .text(d => d.id)
                .attr("class", "node-text text-[10px] sm:text-xs pointer-events-none");

            simulation.on("tick", () => {
                nodes.forEach(d => {
                    const padding = d.sc_radius;
                    d.x = Math.max(-width/2 + padding, Math.min(width/2 - padding, d.x));
                    d.y = Math.max(-height/2 + padding, Math.min(height/2 - padding, d.y));
                });
                
                link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
                node.attr("transform", d => `translate(${d.x},${d.y})`);
            });

            function drag(simulation) {
                function dragstarted(event, d) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x; d.fy = d.y;
                }
                function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
                function dragended(event, d) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null; d.fy = null;
                }
                return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
            }
        };

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if(document.getElementById('network-canvas')) {
                    initD3Graph();
                }
            }, 300);
        });

        const checkD3 = setInterval(() => {
            if (window.d3) {
                initD3Graph();
                clearInterval(checkD3);
            }
        }, 100);
        
        window.initD3Graph = initD3Graph;
        // +++ END: D3 CONSTELLATION GRAPH +++


        // +++ START: D3 NODE EDITOR LOGIC +++
        window.activeEditingNode = null;

        window.openNodeEditor = (nodeId) => {
            const modal = document.getElementById('node-editor-modal');
            if(!modal) return;
            
            function findNode(node, id) {
                if (node.id === id) return node;
                if (node.children) {
                    for (let child of node.children) {
                        const found = findNode(child, id);
                        if (found) return found;
                    }
                }
                return null;
            }

            const data = window.constellationData;
            const target = findNode(data, nodeId);
            if(!target) return;

            window.activeEditingNode = target;
            
            document.getElementById('ne-orig-id').value = target.id;
            document.getElementById('ne-id').value = target.id;
            document.getElementById('ne-icon').value = target.icon || '';
            document.getElementById('ne-click').value = target.clickAction || '';
            document.getElementById('ne-radius').value = target.radius || 16;
            
            document.getElementById('ne-new-child').value = '';

            modal.style.display = 'flex';
        };

        window.saveNode = () => {
            if(!window.activeEditingNode) return;
            const target = window.activeEditingNode;
            
            target.id = document.getElementById('ne-id').value;
            const iconVal = document.getElementById('ne-icon').value.trim();
            target.icon = iconVal === '' ? undefined : iconVal;
            
            const clickVal = document.getElementById('ne-click').value.trim();
            target.clickAction = clickVal === '' ? undefined : clickVal;
            
            target.radius = parseInt(document.getElementById('ne-radius').value) || 16;
            
            document.getElementById('node-editor-modal').style.display = 'none';
            initD3Graph(); // Re-render
            window.showAdminConstellationControls();
        };

        window.addChildNode = () => {
            if(!window.activeEditingNode) return;
            const target = window.activeEditingNode;
            const childId = document.getElementById('ne-new-child').value;
            if(!childId) return;
            
            if(!target.children) target.children = [];
            target.children.push({
                id: childId,
                group: target.group,
                radius: 16
            });
            
            document.getElementById('node-editor-modal').style.display = 'none';
            initD3Graph();
            window.showAdminConstellationControls();
        };

        window.deleteNode = () => {
            if(!window.activeEditingNode) return;
            const targetId = document.getElementById('ne-orig-id').value;
            
            if(window.constellationData.id === targetId) {
                alert("Cannot delete root node!");
                return;
            }

            function deleteFrom(node) {
                if(node.children) {
                    node.children = node.children.filter(c => c.id !== targetId);
                    node.children.forEach(deleteFrom);
                }
            }
            
            deleteFrom(window.constellationData);
            document.getElementById('node-editor-modal').style.display = 'none';
            initD3Graph();
            window.showAdminConstellationControls();
        };

        window.showAdminConstellationControls = () => {
            const controls = document.getElementById('admin-constellation-controls');
            if(controls) {
                controls.classList.remove('hidden');
                controls.classList.add('flex');
            }
        };

        window.saveConstellationToDB = async () => {
            const btn = document.querySelector('#admin-constellation-controls button');
            if(!btn) return;
            const prevText = btn.textContent;
            try {
                btn.textContent = "Saving...";
                const { error } = await supabase.from('portfolio_config').update({ skills_data: window.constellationData }).eq('id', 'main');
                if(error) throw error;
                btn.textContent = "Saved!";
            } catch(e) {
                console.error(e);
                btn.textContent = "Error!";
            }
            setTimeout(() => { btn.textContent = prevText; }, 2000);
        };

        window.showMessageBox = (text) => {
            alert(text);
        };
        // +++ END: D3 NODE EDITOR LOGIC +++
// +++ START: GITHUB CITY +++
        async function initGitHubCity() {
            const container = document.getElementById('github-city-container');
            if (!container || !window.THREE) return;

            const tooltip = document.getElementById('github-tooltip');
            
            // 1. Setup Scene, Camera, Renderer
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x0f172a, 0.002);
            
            const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
            camera.position.set(300, 200, 300);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            // 2. Setup Controls
            let controls;
            if (window.THREE.OrbitControls) {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
            } else if (window.OrbitControls) {
                controls = new OrbitControls(camera, renderer.domElement);
            }
            
            if (controls) {
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.maxPolarAngle = Math.PI / 2 - 0.05;
                controls.minDistance = 50;
                controls.maxDistance = 500;
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.8;
            }

            // 3. Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(100, 150, 50);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            dirLight.shadow.camera.near = 0.5;
            dirLight.shadow.camera.far = 500;
            dirLight.shadow.camera.left = -200;
            dirLight.shadow.camera.right = 200;
            dirLight.shadow.camera.top = 200;
            dirLight.shadow.camera.bottom = -200;
            scene.add(dirLight);

            const hemiLight = new THREE.HemisphereLight(0x4ade80, 0x0f172a, 0.4);
            scene.add(hemiLight);

            // Fetch Data
            let contributions = [];
            try {
                const res = await fetch('https://github-contributions-api.jogruber.de/v4/Naveen-Jayaraj');
                const data = await res.json();
                if (data.contributions) contributions = data.contributions.slice(-365);
            } catch (err) {
                console.error("Failed to fetch Github data", err);
                return;
            }

            if (contributions.length === 0) return;

            // 4. Build City
            const cityGroup = new THREE.Group();
            scene.add(cityGroup);

            const boxSize = 6.5;
            const gap = 2;
            const step = boxSize + gap;
            
            const totalCols = Math.ceil(365 / 7);
            
            // Sleek Color Palette
            const colors = [
                0x1e293b, // Level 0: Slate
                0x0ea5e9, // Level 1: Deep Cyan
                0x14b8a6, // Level 2: Turquoise
                0x22c55e, // Level 3: Green
                0x4ade80  // Level 4: Neon Green
            ];

            const heights = [1, 4, 10, 18, 28]; // Organic exponential height scaling

            const meshes = [];

            // Base plate and Grid
            const plateWidth = totalCols * step + 20;
            const plateDepth = 7 * step + 20;
            
            const plateGeo = new THREE.PlaneGeometry(plateWidth, plateDepth);
            const plateMat = new THREE.MeshStandardMaterial({ 
                color: 0x070b14, 
                roughness: 0.1, 
                metalness: 0.8
            });
            const plate = new THREE.Mesh(plateGeo, plateMat);
            plate.rotation.x = -Math.PI / 2;
            plate.position.y = -0.1;
            plate.receiveShadow = true;
            cityGroup.add(plate);

            const gridHelper = new THREE.GridHelper(Math.max(plateWidth, plateDepth), 60, 0x334155, 0x1e293b);
            gridHelper.position.y = 0;
            cityGroup.add(gridHelper);

            const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);

            const offsetX = (totalCols * step) / 2;
            const offsetZ = (7 * step) / 2;

            let col = 0;
            let row = new Date(contributions[0].date).getDay();

            // Setup cloned materials for smooth hover intensity changes
            const materials = colors.map((c, i) => new THREE.MeshStandardMaterial({
                color: c,
                roughness: i > 0 ? 0.2 : 0.5,
                metalness: i > 0 ? 0.3 : 0.1,
                emissive: c,
                emissiveIntensity: i > 0 ? 0.1 + (i * 0.15) : 0,
                transparent: true,
                opacity: 0.95
            }));

            contributions.forEach((day, index) => {
                const level = day.level || 0;
                let targetH = heights[level];
                
                const mesh = new THREE.Mesh(geometry, materials[level].clone());
                mesh.position.x = col * step - offsetX;
                mesh.position.z = row * step - offsetZ;
                
                // Starts totally flat for spawn animation
                mesh.scale.y = 0.01;
                mesh.position.y = 0.01 / 2;
                
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                mesh.userData = { 
                    date: day.date, 
                    count: day.count, 
                    level: level,
                    targetScaleY: targetH,
                    baseIntensity: materials[level].emissiveIntensity,
                    targetIntensity: materials[level].emissiveIntensity,
                    delay: (col * 0.025) + (row * 0.025) // Cascading wave spawn effect
                };

                cityGroup.add(mesh);
                meshes.push(mesh);

                row++;
                if (row > 6) { row = 0; col++; }
            });

            // 5. Raycaster Tooltip
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            let hoveredMesh = null;

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
                mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(meshes);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (hoveredMesh !== object) {
                        if (hoveredMesh) {
                            hoveredMesh.userData.targetScaleY = heights[hoveredMesh.userData.level];
                            hoveredMesh.userData.targetIntensity = hoveredMesh.userData.baseIntensity;
                        }
                        
                        hoveredMesh = object;
                        hoveredMesh.userData.targetScaleY = heights[hoveredMesh.userData.level] + 6; // Pop out heavily
                        hoveredMesh.userData.targetIntensity = 2.0; // Glow bright white/green

                        tooltip.style.opacity = 1;
                        tooltip.innerHTML = `${hoveredMesh.userData.date}<br/><div class='mt-1 text-[10px] text-[var(--text-accent)] uppercase font-bold tracking-widest leading-none'>${hoveredMesh.userData.count} COMMITS</div>`;
                        container.style.cursor = 'pointer';
                    }
                } else {
                    if (hoveredMesh) {
                        hoveredMesh.userData.targetScaleY = heights[hoveredMesh.userData.level];
                        hoveredMesh.userData.targetIntensity = hoveredMesh.userData.baseIntensity;
                        hoveredMesh = null;
                        
                        tooltip.style.opacity = 0;
                        container.style.cursor = 'grab';
                    }
                }
                tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                tooltip.style.top = (e.clientY - rect.top + 15) + 'px';
            });

            container.addEventListener('mouseleave', () => {
                tooltip.style.opacity = 0;
                if (hoveredMesh) {
                    hoveredMesh.userData.targetScaleY = heights[hoveredMesh.userData.level];
                    hoveredMesh.userData.targetIntensity = hoveredMesh.userData.baseIntensity;
                    hoveredMesh = null;
                }
            });

            const resizeObserver = new ResizeObserver(() => {
                if (!container || !camera || !renderer) return;
                const width = container.clientWidth;
                const height = container.clientHeight;
                if (width === 0 || height === 0) return;
                
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });
            resizeObserver.observe(container);

            // 6. Render Loop
            const clock = new THREE.Clock();
            let elapsedTime = 0;

            function animate() {
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                elapsedTime += delta;

                // Animate bars scaling up & smooth hover
                meshes.forEach(mesh => {
                    if (elapsedTime > mesh.userData.delay) {
                        mesh.scale.y += (mesh.userData.targetScaleY - mesh.scale.y) * 8 * delta;
                        mesh.position.y = mesh.scale.y / 2; 
                        
                        if (mesh.material.emissiveIntensity !== undefined) {
                            mesh.material.emissiveIntensity += (mesh.userData.targetIntensity - mesh.material.emissiveIntensity) * 10 * delta;
                        }
                    }
                });

                // Subtle floating motion of the whole city
                cityGroup.position.y = Math.sin(elapsedTime * 1.5) * 2;

                if (controls) controls.update();
                renderer.render(scene, camera);
            }
            animate();
        }

        // Initialize city after a short delay to ensure Three.js is ready
        setTimeout(initGitHubCity, 500);
        // +++ END: GITHUB CITY +++
    });
