// ========================================================================
// FIGURE EXPORT TOOL v3.1 - EMC TESTING ANNOTATION SYSTEM
// ========================================================================
// Turner Engineering Corporation - Professional EMC Testing Support
// 
// SYSTEM OVERVIEW:
// Comprehensive EMC testing annotation tool with modular frequency database,
// multi-page support, and professional Tenco-compliant documentation export.
// 
// ========================================================================
// BAND DATABASE ARCHITECTURE
// ========================================================================
// 
// TOTAL: 8 Band Database Files (Band 0 through Band 7)
// COVERAGE: 9 kHz to 6+ GHz (Complete EMC testing spectrum)
// ALLOCATIONS: 400+ individual frequency segments with full FCC/ITU data
// 
// Band 0 (VLF/LF): 9-160 kHz           | 22 allocations
//   • Standard time signals (20, 60 kHz)
//   • Maritime navigation and communications
//   • Amateur radio 2200m band (135.7-137.8 kHz)
//   • Radiolocation and fixed services
// 
// Band 1 (MF): 148.5 kHz-1.605 MHz     | 22 allocations  
//   • AM broadcasting band (535-1605 kHz)
//   • Maritime distress (500 kHz)
//   • Amateur radio 630m band (472-479 kHz)
//   • Aeronautical radionavigation (NDB)
// 
// Band 2 (HF Lower): 535 kHz-3.025 MHz | 27 allocations
//   • Extended AM broadcasting
//   • Amateur radio 160m band (1800-2000 kHz)
//   • Standard frequency signals (2.5 MHz)
//   • Maritime mobile communications
// 
// Band 3 (HF Core): 2.495-8.1 MHz      | 47 allocations
//   • WWV time signals (2.5, 5 MHz)
//   • Amateur radio 80m (3.5-4.0 MHz) and 40m (7.0-7.2 MHz)
//   • International broadcasting (5.9-6.2 MHz)
//   • Maritime mobile (4.063-4.438 MHz)
// 
// Band 4 (Upper HF): 5-30 MHz          | ~95 allocations
//   • Amateur radio: 20m, 17m, 15m, 12m, 10m bands
//   • Citizens Band (26.965-27.405 MHz)
//   • ISM band (26.957-27.283 MHz)  
//   • WWV/WWVH (10, 15, 20 MHz)
//   • International broadcasting
// 
// Band 5 (VHF): 25-325 MHz             | ~65 allocations
//   • FM broadcasting (88-108 MHz)
//   • TV VHF channels 2-13
//   • Aviation (108-137 MHz)
//   • Amateur radio 6m (50-54 MHz), 2m (144-148 MHz)
//   • Weather satellites (137-138 MHz)
//   • Maritime VHF (156-162 MHz)
// 
// Band 6 (UHF): 273 MHz-1.3 GHz        | ~66 allocations
//   • UHF TV channels 14-69 (470-806 MHz)
//   • Cellular/PCS systems
//   • Amateur radio 70cm (420-450 MHz)
//   • GPS L2 (1227.6 MHz)
//   • ISM band (902-928 MHz)
// 
// Band 7 (SHF): 960 MHz-6 GHz          | ~55 allocations
//   • GPS L1 (1575.42 MHz)
//   • Cellular/PCS/AWS (1710-1980 MHz)
//   • WiFi 2.4 GHz (2400-2500 MHz)
//   • WiFi 5 GHz (5150-5925 MHz)
//   • Amateur radio 23cm, 13cm bands
// 
// ========================================================================
// FEATURES SUMMARY
// ========================================================================
// 
// CORE FUNCTIONALITY:
// • Multi-page annotation workflow
// • Dual-image side-by-side comparison
// • Smart filename parsing and auto-extraction
// • Professional Tenco-compliant export formatting
// • Band-specific frequency identification
// • Comprehensive FCC Part and ITU footnote references
// 
// EXPORT CAPABILITIES:
// • Individual image export with annotations
// • Dual-image professional reports
// • Multi-page batch export with structured naming
// • High-resolution PNG with transparency support
// • Corporate branding and logo integration
// 
// TECHNICAL SPECIFICATIONS:
// • HTML5 Canvas-based annotation system
// • Modular JavaScript database architecture
// • Client-side processing (no server required)
// • Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
// • Professional typography (Arial Bold, Times New Roman)
// 
// ========================================================================

// Figure Export Tool - Enhanced EMC Testing Interface with Multi-Page Support
class FigureExportTool {
    constructor() {
        // Page management
        this.currentPageId = 1;
        this.nextPageId = 2;
        this.pages = new Map();
        this.currentLayout = 'horizontal';
        
        // Band definitions for EMC testing
        this.bandDefinitions = {
            'B0': { range: '10 kHz – 160 kHz', startMHz: 0.01, endMHz: 0.16 },
            'B1': { range: '150 kHz – 650 kHz', startMHz: 0.15, endMHz: 0.65 },
            'B2': { range: '500 kHz – 3 MHz', startMHz: 0.5, endMHz: 3 },
            'B3': { range: '2.5 MHz – 7.5 MHz', startMHz: 2.5, endMHz: 7.5 },
            'B4': { range: '5 MHz – 30 MHz', startMHz: 5, endMHz: 30 },
            'B5': { range: '25 MHz – 325 MHz', startMHz: 25, endMHz: 325 },
            'B6': { range: '300 MHz – 1.3 GHz', startMHz: 300, endMHz: 1300 },
            'B7': { range: '1 GHz – 6 GHz', startMHz: 1000, endMHz: 6000 }
        };
        
        // Initialize first page
        this.initializePage(1);
        this.initializeEventListeners();
        this.updateTables();
        
        // Make tool globally accessible
        window.figureExportTool = this;
        window.peakHelper = this;
    }
    
    initializePage(pageId) {
        const pageData = {
            pageId: pageId,
            imageState1: {
                image: null,
                originalFilename: null,
                isDragging: false,
                lastX: 0,
                lastY: 0,
                offsetX: 0,
                offsetY: 0,
                scale: 1,
                baseWidth: 0,
                baseHeight: 0
            },
            imageState2: {
                image: null,
                originalFilename: null,
                isDragging: false,
                lastX: 0,
                lastY: 0,
                offsetX: 0,
                offsetY: 0,
                scale: 1,
                baseWidth: 0,
                baseHeight: 0
            },
            formData1: { runId: '', band: '', location: '' },
            formData2: { runId: '', band: '', location: '' },
            comments: ''
        };
        
        this.pages.set(pageId, pageData);
        return pageData;
    }
    
    getCurrentPage() {
        return this.pages.get(this.currentPageId);
    }
    
    initializeEventListeners() {
        // Layout toggle
        document.querySelectorAll('input[name="layout"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setLayout(e.target.value);
                }
            });
        });
        
        // File upload for both images
        this.setupUploadListeners(1);
        this.setupUploadListeners(2);
        
        // Form inputs - update tables when values change
        ['runId1', 'band1', 'location1', 'runId2', 'band2', 'location2', 'comments'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.saveCurrentPageData();
                    this.updateTables();
                });
            }
        });
        
        // Canvas interactions for both images
        this.setupCanvasListeners(1);
        this.setupCanvasListeners(2);
        
        // Band selection buttons
        document.querySelectorAll('.band-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleBandSelection(e.target.dataset.band);
            });
        });
        
        // Export buttons
        document.getElementById('exportImage1').addEventListener('click', () => this.exportSingleImage(1));
        document.getElementById('exportImage2').addEventListener('click', () => this.exportSingleImage(2));
        document.getElementById('exportBoth').addEventListener('click', () => this.exportBothImages());
        document.getElementById('exportAllPages').addEventListener('click', () => this.exportAllPages());
        
        // Clear buttons
        document.getElementById('clearStats').addEventListener('click', () => this.clearCurrentPage());
        document.getElementById('clearAllPages').addEventListener('click', () => this.clearAllPages());
        
        // Page tab clicks
        this.setupPageTabListeners();
    }
    
    setupPageTabListeners() {
        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('close-tab')) {
                    const pageId = parseInt(tab.dataset.page);
                    this.switchToPage(pageId);
                }
            });
        });
    }
    
    setLayout(layout) {
        this.currentLayout = layout;
        
        const dualUpload = document.getElementById('dualUpload');
        const dualFormSection = document.getElementById('dualFormSection');
        const dualInfoTables = document.getElementById('dualInfoTables');
        const dualImageContainer = document.getElementById('dualImageContainer');
        
        if (layout === 'vertical') {
            dualUpload.classList.add('vertical');
            dualFormSection.classList.add('vertical');
            dualInfoTables.classList.add('vertical');
            dualImageContainer.classList.add('vertical');
        } else {
            dualUpload.classList.remove('vertical');
            dualFormSection.classList.remove('vertical');
            dualInfoTables.classList.remove('vertical');
            dualImageContainer.classList.remove('vertical');
        }
        
        // Redraw images with new layout
        setTimeout(() => {
            this.setupCanvas(1);
            this.setupCanvas(2);
        }, 300);
    }
    
    addNewPage() {
        const newPageId = this.nextPageId++;
        this.initializePage(newPageId);
        this.addPageTab(newPageId);
        this.switchToPage(newPageId);
    }
    
    addPageTab(pageId) {
        const pageTabs = document.getElementById('pageTabs');
        const newTab = document.createElement('div');
        newTab.className = 'page-tab';
        newTab.dataset.page = pageId;
        newTab.innerHTML = `
            <span>Page ${pageId}</span>
            <button class="close-tab" onclick="figureExportTool.removePage(${pageId})" title="Close Page">×</button>
        `;
        
        newTab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('close-tab')) {
                this.switchToPage(pageId);
            }
        });
        
        pageTabs.appendChild(newTab);
    }
    
    removePage(pageId) {
        if (this.pages.size <= 1) {
            alert('Cannot remove the last page.');
            return;
        }
        
        if (confirm(`Are you sure you want to remove Page ${pageId}?`)) {
            this.pages.delete(pageId);
            
            // Remove tab
            const tab = document.querySelector(`[data-page="${pageId}"]`);
            if (tab) {
                tab.remove();
            }
            
            // Switch to another page if current page was removed
            if (this.currentPageId === pageId) {
                const remainingPages = Array.from(this.pages.keys());
                this.switchToPage(remainingPages[0]);
            }
        }
    }
    
    switchToPage(pageId) {
        // Save current page data before switching
        this.saveCurrentPageData();
        
        // Update current page
        this.currentPageId = pageId;
        
        // Update tab appearance
        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.classList.toggle('active', parseInt(tab.dataset.page) === pageId);
        });
        
        // Load page data
        this.loadPageData(pageId);
        
        // Refresh UI
        this.setupCanvas(1);
        this.setupCanvas(2);
        this.updateTables();
    }
    
    saveCurrentPageData() {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        // Save form data
        ['runId1', 'band1', 'location1', 'runId2', 'band2', 'location2'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const imageNum = id.includes('1') ? '1' : '2';
                const field = id.replace(/[12]$/, '');
                currentPage[`formData${imageNum}`][field] = element.value;
            }
        });
        
        // Save comments
        const commentsElement = document.getElementById('comments');
        if (commentsElement) {
            currentPage.comments = commentsElement.value;
        }
    }
    
    loadPageData(pageId) {
        const page = this.pages.get(pageId);
        if (!page) return;
        
        // Load form data
        document.getElementById('runId1').value = page.formData1.runId || '';
        document.getElementById('band1').value = page.formData1.band || '';
        document.getElementById('location1').value = page.formData1.location || '';
        document.getElementById('runId2').value = page.formData2.runId || '';
        document.getElementById('band2').value = page.formData2.band || '';
        document.getElementById('location2').value = page.formData2.location || '';
        document.getElementById('comments').value = page.comments || '';
        
        // Update instruction overlays
        document.getElementById('instructionOverlay1').style.display = page.imageState1.image ? 'none' : 'block';
        document.getElementById('instructionOverlay2').style.display = page.imageState2.image ? 'none' : 'block';
    }
    
    setupUploadListeners(imageNumber) {
        const uploadArea = document.getElementById(`uploadArea${imageNumber}`);
        const imageInput = document.getElementById(`imageInput${imageNumber}`);
        
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e, imageNumber));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e, imageNumber));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e, imageNumber));
        
        imageInput.addEventListener('change', (e) => this.handleFileSelect(e, imageNumber));
    }
    
    setupCanvasListeners(imageNumber) {
        const canvas = document.getElementById(`annotationCanvas${imageNumber}`);
        
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e, imageNumber));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e, imageNumber));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e, imageNumber));
        canvas.addEventListener('wheel', (e) => this.handleWheel(e, imageNumber));
    }
    
    getImageState(imageNumber) {
        const currentPage = this.getCurrentPage();
        return imageNumber === 1 ? currentPage.imageState1 : currentPage.imageState2;
    }
    
    getCanvas(imageNumber) {
        return document.getElementById(`annotationCanvas${imageNumber}`);
    }
    
    getContext(imageNumber) {
        return this.getCanvas(imageNumber).getContext('2d');
    }
    
    getFormData(imageNumber) {
        return {
            runId: document.getElementById(`runId${imageNumber}`)?.value || '-',
            band: document.getElementById(`band${imageNumber}`)?.value || '-',
            location: document.getElementById(`location${imageNumber}`)?.value || '-'
        };
    }
    
    handleBandSelection(band) {
        // Update frequency range display
        const bandInfo = this.bandDefinitions[band];
        if (bandInfo) {
            document.getElementById('frequencyRange').value = bandInfo.range;
        }
        
        // Visual feedback - highlight selected band
        document.querySelectorAll('.band-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-band="${band}"]`).classList.add('active');
        
        // Update peak identification helper for selected band
        this.identifyPeakForBand(band, bandInfo);
    }
    
    autoSelectBandButton(detectedBand) {
        if (this.bandDefinitions[detectedBand]) {
            this.handleBandSelection(detectedBand);
        }
    }
    
    clearPeakIdentification() {
        const resultsContainer = document.getElementById('peakResults');
        const bandInfoDisplay = document.querySelector('.band-info-display');
        
        bandInfoDisplay.classList.remove('active');
        bandInfoDisplay.innerHTML = '<p class="helper-hint">Select an EMC band above to see frequency allocations for that range.</p>';
        resultsContainer.innerHTML = '<p class="helper-hint">Choose a band (B0-B7) to view all services allocated in that frequency range.</p>';
    }
    
    handleDragOver(e, imageNumber) {
        e.preventDefault();
        document.getElementById(`uploadArea${imageNumber}`).classList.add('dragover');
    }
    
    handleDragLeave(e, imageNumber) {
        e.preventDefault();
        document.getElementById(`uploadArea${imageNumber}`).classList.remove('dragover');
    }
    
    handleDrop(e, imageNumber) {
        e.preventDefault();
        document.getElementById(`uploadArea${imageNumber}`).classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImage(files[0], imageNumber);
        }
    }
    
    handleFileSelect(e, imageNumber) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file, imageNumber);
        }
    }
    
    loadImage(file, imageNumber) {
        const state = this.getImageState(imageNumber);
        state.originalFilename = file.name;
        
        // Parse filename and auto-fill the corresponding form fields
        this.parseFilename(file.name, imageNumber);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.image = img;
                this.setupCanvas(imageNumber);
                document.getElementById(`instructionOverlay${imageNumber}`).style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    parseFilename(filename, imageNumber) {
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        let runId = '';
        let band = '';
        let location = '';
        
        console.log(`Parsing filename for Image ${imageNumber}:`, nameWithoutExt);
        
        // Improved pattern matching with proper regex
        // First, try to find run ID pattern (digits-digits)
        const runMatch = nameWithoutExt.match(/(\d+-\d+)/);
        if (runMatch) {
            runId = runMatch[1];
        }
        
        // Then find band pattern (B followed by digit(s), optional letters)
        const bandMatch = nameWithoutExt.match(/([Bb]\d+[a-zA-Z]*)/);
        if (bandMatch) {
            band = bandMatch[1].toUpperCase(); // Ensure uppercase
        }
        
        // Find location by removing run ID and band from filename
        if (runId || band) {
            let tempLocation = nameWithoutExt;
            
            // Remove common prefixes
            tempLocation = tempLocation.replace(/^(Figure\s+\d+-\d+\s+)?Run\s+/i, '');
            
            // Remove run ID
            if (runId) {
                tempLocation = tempLocation.replace(new RegExp(runId.replace('-', '\\-'), 'g'), '');
            }
            
            // Remove band
            if (band) {
                tempLocation = tempLocation.replace(new RegExp(band, 'gi'), '');
            }
            
            // Clean up location string
            location = tempLocation
                .replace(/[_,-]+/g, ' ')  // Replace underscores, commas, dashes with spaces
                .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
                .trim();
                
            // Remove empty or very short locations
            if (location.length < 2) {
                location = '';
            }
        }
        
        // Auto-fill detected values for this specific image
        if (runId) {
            document.getElementById(`runId${imageNumber}`).value = runId;
            console.log(`Detected Run ID for Image ${imageNumber}:`, runId);
        }
        
        if (band) {
            document.getElementById(`band${imageNumber}`).value = band;
            // Only auto-select band button for first image to avoid conflicts
            if (imageNumber === 1) {
                this.autoSelectBandButton(band);
            }
            console.log(`Detected Band for Image ${imageNumber}:`, band);
        }
        
        if (location) {
            if (!document.getElementById(`location${imageNumber}`).value) {
                document.getElementById(`location${imageNumber}`).value = location;
                console.log(`Detected Location for Image ${imageNumber}:`, location);
            }
        }
        
        this.saveCurrentPageData();
        this.updateTables();
        
        const detected = [];
        if (runId) detected.push('Run ' + runId);
        if (band) detected.push('Band ' + band);
        if (location) detected.push('Location ' + location);
        
        if (detected.length > 0) {
            console.log(`Auto-detected for Image ${imageNumber}:`, detected.join(', '));
        } else {
            console.log(`No run ID, band, or location detected in filename for Image ${imageNumber}`);
        }
    }
    
    setupCanvas(imageNumber) {
        const state = this.getImageState(imageNumber);
        const canvas = this.getCanvas(imageNumber);
        
        if (!state || !state.image) return;
        
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        
        // Prefer larger display size but limit to reasonable maximum
        const maxDisplayWidth = Math.min(state.image.width * 1.0, containerWidth, 600);
        const maxDisplayHeight = Math.min(state.image.height * 1.0, containerHeight, 500);
        
        const imageAspect = state.image.width / state.image.height;
        const containerAspect = maxDisplayWidth / maxDisplayHeight;
        
        let displayWidth, displayHeight;
        
        if (imageAspect > containerAspect) {
            displayWidth = maxDisplayWidth;
            displayHeight = maxDisplayWidth / imageAspect;
        } else {
            displayHeight = maxDisplayHeight;
            displayWidth = maxDisplayHeight * imageAspect;
        }
        
        // Ensure minimum readable size
        const minSize = 300;
        if (displayWidth < minSize || displayHeight < minSize) {
            if (displayWidth < displayHeight) {
                displayWidth = minSize;
                displayHeight = minSize / imageAspect;
            } else {
                displayHeight = minSize;
                displayWidth = minSize * imageAspect;
            }
        }
        
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        // Center the canvas in the container
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        
        // Reset transform for crisp display
        state.offsetX = 0;
        state.offsetY = 0;
        state.scale = 1;
        
        // Store base size for zoom calculations
        state.baseWidth = displayWidth;
        state.baseHeight = displayHeight;
        
        this.drawImage(imageNumber);
        this.addImageControls(imageNumber);
    }
    
    drawImage(imageNumber) {
        const state = this.getImageState(imageNumber);
        const ctx = this.getContext(imageNumber);
        const canvas = this.getCanvas(imageNumber);
        
        if (!state || !state.image) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.save();
        ctx.translate(state.offsetX, state.offsetY);
        ctx.scale(state.scale, state.scale);
        
        // Draw image at base size for crisp display
        ctx.drawImage(state.image, 0, 0, state.baseWidth, state.baseHeight);
        
        ctx.restore();
    }
    
    addImageControls(imageNumber) {
        // Remove existing controls if any
        const existingControls = document.querySelector(`#imageControls${imageNumber}`);
        if (existingControls) {
            existingControls.remove();
        }
        
        const canvas = this.getCanvas(imageNumber);
        const state = this.getImageState(imageNumber);
        
        if (!state || !state.image) return;
        
        // Create image controls
        const controls = document.createElement('div');
        controls.className = 'image-controls';
        controls.id = `imageControls${imageNumber}`;
        controls.innerHTML = `
            <div class="zoom-controls">
                <button class="control-btn" id="zoomOut${imageNumber}">−</button>
                <span class="zoom-level" id="zoomLevel${imageNumber}">${Math.round(state.scale * 100)}%</span>
                <button class="control-btn" id="zoomIn${imageNumber}">+</button>
                <button class="control-btn" id="resetZoom${imageNumber}">Reset</button>
                <button class="control-btn" id="fitToScreen${imageNumber}">Fit</button>
            </div>
        `;
        
        canvas.parentElement.appendChild(controls);
        
        // Add event listeners
        document.getElementById(`zoomIn${imageNumber}`).addEventListener('click', () => this.zoomIn(imageNumber));
        document.getElementById(`zoomOut${imageNumber}`).addEventListener('click', () => this.zoomOut(imageNumber));
        document.getElementById(`resetZoom${imageNumber}`).addEventListener('click', () => this.resetZoom(imageNumber));
        document.getElementById(`fitToScreen${imageNumber}`).addEventListener('click', () => this.fitToScreen(imageNumber));
    }
    
    zoomIn(imageNumber) {
        const state = this.getImageState(imageNumber);
        if (!state) return;
        state.scale = Math.min(state.scale * 1.2, 5);
        this.drawImage(imageNumber);
        this.updateZoomDisplay(imageNumber);
    }
    
    zoomOut(imageNumber) {
        const state = this.getImageState(imageNumber);
        if (!state) return;
        state.scale = Math.max(state.scale / 1.2, 0.1);
        this.drawImage(imageNumber);
        this.updateZoomDisplay(imageNumber);
    }
    
    resetZoom(imageNumber) {
        const state = this.getImageState(imageNumber);
        if (!state) return;
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        this.drawImage(imageNumber);
        this.updateZoomDisplay(imageNumber);
    }
    
    fitToScreen(imageNumber) {
        const state = this.getImageState(imageNumber);
        const canvas = this.getCanvas(imageNumber);
        if (!state) return;
        
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        
        const scaleX = containerWidth / state.baseWidth;
        const scaleY = containerHeight / state.baseHeight;
        state.scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%
        
        state.offsetX = 0;
        state.offsetY = 0;
        this.drawImage(imageNumber);
        this.updateZoomDisplay(imageNumber);
    }
    
    updateZoomDisplay(imageNumber) {
        const zoomDisplay = document.getElementById(`zoomLevel${imageNumber}`);
        const state = this.getImageState(imageNumber);
        if (zoomDisplay && state) {
            zoomDisplay.textContent = `${Math.round(state.scale * 100)}%`;
        }
    }
    
    handleMouseDown(e, imageNumber) {
        const state = this.getImageState(imageNumber);
        const canvas = this.getCanvas(imageNumber);
        
        if (!state || !state.image) return;
        
        state.isDragging = true;
        const rect = canvas.getBoundingClientRect();
        state.lastX = e.clientX - rect.left;
        state.lastY = e.clientY - rect.top;
    }
    
    handleMouseMove(e, imageNumber) {
        const state = this.getImageState(imageNumber);
        const canvas = this.getCanvas(imageNumber);
        
        if (!state || !state.isDragging || !state.image) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        state.offsetX += currentX - state.lastX;
        state.offsetY += currentY - state.lastY;
        
        state.lastX = currentX;
        state.lastY = currentY;
        
        this.drawImage(imageNumber);
    }
    
    handleMouseUp(e, imageNumber) {
        const state = this.getImageState(imageNumber);
        if (state) {
            state.isDragging = false;
        }
    }
    
    handleWheel(e, imageNumber) {
        const state = this.getImageState(imageNumber);
        const canvas = this.getCanvas(imageNumber);
        
        if (!state || !state.image) return;
        
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * 0.1);
        
        state.scale *= zoom;
        state.scale = Math.max(0.1, Math.min(5, state.scale));
        
        state.offsetX = mouseX - (mouseX - state.offsetX) * zoom;
        state.offsetY = mouseY - (mouseY - state.offsetY) * zoom;
        
        this.drawImage(imageNumber);
        this.updateZoomDisplay(imageNumber);
    }
    
    updateTables() {
        // Update both tables for current page
        for (let i = 1; i <= 2; i++) {
            const formData = this.getFormData(i);
            
            const tableRunElement = document.getElementById(`tableRun${i}`);
            const tableBandElement = document.getElementById(`tableBand${i}`);
            const tableLocationElement = document.getElementById(`tableLocation${i}`);
            
            if (tableRunElement) tableRunElement.textContent = formData.runId;
            if (tableBandElement) tableBandElement.textContent = formData.band;
            if (tableLocationElement) tableLocationElement.textContent = formData.location;
        }
    }
    
    clearCurrentPage() {
        if (confirm('Are you sure you want to clear all data for the current page?')) {
            // Clear all input fields for current page
            ['runId1', 'band1', 'location1', 'runId2', 'band2', 'location2', 'comments'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = '';
                }
            });
            
            document.getElementById('frequencyRange').value = '';
            
            // Clear band selection
            document.querySelectorAll('.band-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Clear peak identification helper
            this.clearPeakIdentification();
            
            // Clear current page images
            const currentPage = this.getCurrentPage();
            if (currentPage) {
                currentPage.imageState1.image = null;
                currentPage.imageState2.image = null;
                currentPage.formData1 = { runId: '', band: '', location: '' };
                currentPage.formData2 = { runId: '', band: '', location: '' };
                currentPage.comments = '';
                
                // Show instruction overlays
                document.getElementById('instructionOverlay1').style.display = 'block';
                document.getElementById('instructionOverlay2').style.display = 'block';
                
                // Clear canvases
                const ctx1 = this.getContext(1);
                const ctx2 = this.getContext(2);
                const canvas1 = this.getCanvas(1);
                const canvas2 = this.getCanvas(2);
                
                ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
                ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                
                // Remove image controls
                document.querySelector('#imageControls1')?.remove();
                document.querySelector('#imageControls2')?.remove();
            }
            
            // Update tables
            this.updateTables();
            
            console.log('Current page cleared');
        }
    }
    
    clearAllPages() {
        if (confirm('Are you sure you want to clear ALL pages? This cannot be undone.')) {
            // Clear all pages except first one
            const pageIds = Array.from(this.pages.keys());
            pageIds.forEach(pageId => {
                if (pageId !== 1) {
                    this.removePage(pageId);
                }
            });
            
            // Clear first page
            this.switchToPage(1);
            this.clearCurrentPage();
            
            console.log('All pages cleared');
        }
    }
    
    exportSingleImage(imageNumber) {
        const state = this.getImageState(imageNumber);
        
        if (!state || !state.image) {
            alert(`Please load Image ${imageNumber} first.`);
            return;
        }
        
        const formData = this.getFormData(imageNumber);
        const comments = document.getElementById('comments').value || '-';
        
        this.createExport([state.image], [formData], comments, `Page ${this.currentPageId} - Image ${imageNumber}`);
    }
    
    exportBothImages() {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        const hasImage1 = currentPage.imageState1.image !== null;
        const hasImage2 = currentPage.imageState2.image !== null;
        
        if (!hasImage1 && !hasImage2) {
            alert('Please load at least one image first.');
            return;
        }
        
        const images = [];
        const formDataArray = [];
        
        if (hasImage1) {
            images.push(currentPage.imageState1.image);
            formDataArray.push(this.getFormData(1));
        }
        
        if (hasImage2) {
            images.push(currentPage.imageState2.image);
            formDataArray.push(this.getFormData(2));
        }
        
        const comments = document.getElementById('comments').value || '-';
        this.createExport(images, formDataArray, comments, `Page ${this.currentPageId} - Both Images`);
    }
    
    exportAllPages() {
        const pageIds = Array.from(this.pages.keys()).sort((a, b) => a - b);
        const allImages = [];
        const allFormData = [];
        let combinedComments = '';
        
        pageIds.forEach(pageId => {
            const page = this.pages.get(pageId);
            if (page) {
                if (page.imageState1.image) {
                    allImages.push(page.imageState1.image);
                    allFormData.push({
                        runId: page.formData1.runId || '-',
                        band: page.formData1.band || '-',
                        location: page.formData1.location || '-'
                    });
                }
                if (page.imageState2.image) {
                    allImages.push(page.imageState2.image);
                    allFormData.push({
                        runId: page.formData2.runId || '-',
                        band: page.formData2.band || '-',
                        location: page.formData2.location || '-'
                    });
                }
                if (page.comments) {
                    combinedComments += `Page ${pageId}: ${page.comments}\n\n`;
                }
            }
        });
        
        if (allImages.length === 0) {
            alert('No images found across all pages.');
            return;
        }
        
        this.createExport(allImages, allFormData, combinedComments || '-', 'All Pages');
    }
    
    createExport(images, formDataArray, comments, exportType) {
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        const tableHeight = 80;
        const commentsWidth = 400;
        const margin = 20;
        const imagePadding = 20;
        
        // Calculate dimensions based on available images
        let totalImageWidth = 0;
        let maxImageHeight = 0;
        
        images.forEach(image => {
            totalImageWidth += image.width;
            maxImageHeight = Math.max(maxImageHeight, image.height);
        });
        
        if (images.length > 1) {
            totalImageWidth += imagePadding * (images.length - 1);
        }
        
        exportCanvas.width = Math.max(totalImageWidth, 800) + commentsWidth + 10;
        exportCanvas.height = maxImageHeight + tableHeight;
        
        // Fill background
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Draw table header
        const tableY = margin;
        const tableWidth = Math.max(totalImageWidth, 600);
        const cellHeight = 30;
        const headerHeight = 25;
        
        exportCtx.strokeStyle = '#333';
        exportCtx.lineWidth = 2;
        exportCtx.fillStyle = '#f8f9fa';
        
        exportCtx.fillRect(margin, tableY, tableWidth, headerHeight + cellHeight);
        exportCtx.strokeRect(margin, tableY, tableWidth, headerHeight + cellHeight);
        
        // Draw table content
        exportCtx.fillStyle = '#1a472a';
        exportCtx.font = 'bold 14px Arial';
        exportCtx.textAlign = 'center';
        
        const cellWidth = tableWidth / 3;
        exportCtx.fillText('Run', margin + cellWidth/2, tableY + headerHeight/2 + 5);
        exportCtx.fillText('Band', margin + cellWidth + cellWidth/2, tableY + headerHeight/2 + 5);
        exportCtx.fillText('Location', margin + 2*cellWidth + cellWidth/2, tableY + headerHeight/2 + 5);
        
        // Draw vertical lines
        exportCtx.beginPath();
        exportCtx.moveTo(margin + cellWidth, tableY);
        exportCtx.lineTo(margin + cellWidth, tableY + headerHeight + cellHeight);
        exportCtx.moveTo(margin + 2*cellWidth, tableY);
        exportCtx.lineTo(margin + 2*cellWidth, tableY + headerHeight + cellHeight);
        exportCtx.stroke();
        
        // Draw horizontal line between header and data
        exportCtx.beginPath();
        exportCtx.moveTo(margin, tableY + headerHeight);
        exportCtx.lineTo(margin + tableWidth, tableY + headerHeight);
        exportCtx.stroke();
        
        // Fill data cells
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(margin + 1, tableY + headerHeight + 1, tableWidth - 2, cellHeight - 2);
        
        exportCtx.fillStyle = '#333';
        exportCtx.font = '16px "Times New Roman"';
        
        // Use first image's data for the table, or combine if needed
        const primaryFormData = formDataArray[0];
        exportCtx.fillText(primaryFormData.runId, margin + cellWidth/2, tableY + headerHeight + cellHeight/2 + 5);
        exportCtx.fillText(primaryFormData.band, margin + cellWidth + cellWidth/2, tableY + headerHeight + cellHeight/2 + 5);
        exportCtx.fillText(primaryFormData.location, margin + 2*cellWidth + cellWidth/2, tableY + headerHeight + cellHeight/2 + 5);
        
        // Draw images
        let imageX = margin;
        const imageY = tableY + headerHeight + cellHeight + margin;
        
        images.forEach((image, index) => {
            exportCtx.drawImage(image, imageX, imageY);
            imageX += image.width + imagePadding;
        });
        
        // Draw comments section
        const commentsX = Math.max(totalImageWidth, 600) + margin + 10;
        const commentsY = tableY;
        
        exportCtx.fillStyle = '#f8f9fa';
        exportCtx.fillRect(commentsX, commentsY, commentsWidth - 10, exportCanvas.height - commentsY - margin);
        exportCtx.strokeRect(commentsX, commentsY, commentsWidth - 10, exportCanvas.height - commentsY - margin);
        
        exportCtx.fillStyle = '#1a472a';
        exportCtx.font = 'bold 16px Arial';
        exportCtx.textAlign = 'left';
        exportCtx.fillText('Comments:', commentsX + 10, commentsY + 25);
        
        // Word wrap comments
        exportCtx.fillStyle = '#333';
        exportCtx.font = '14px "Times New Roman"';
        this.wrapText(exportCtx, comments, commentsX + 10, commentsY + 50, commentsWidth - 30, 18);
        
        // Convert to blob and download
        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate filename
            let filename = 'Figure';
            if (primaryFormData.runId !== '-') filename += `_${primaryFormData.runId}`;
            if (primaryFormData.band !== '-') filename += `_${primaryFormData.band}`;
            if (primaryFormData.location !== '-') filename += `_${primaryFormData.location}`;
            if (images.length > 1) filename += '_Multi';
            filename += '.png';
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`Exported ${exportType}: ${filename}`);
        });
    }
    
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }
    
    identifyPeakForBand(band, bandInfo) {
        const resultsContainer = document.getElementById('peakResults');
        const bandInfoDisplay = document.querySelector('.band-info-display');
        
        if (!bandInfo) {
            resultsContainer.innerHTML = '<p class="helper-hint">Choose a band (B0-B7) to view all services allocated in that frequency range.</p>';
            bandInfoDisplay.classList.remove('active');
            bandInfoDisplay.innerHTML = '<p class="helper-hint">Select an EMC band above to see frequency allocations for that range.</p>';
            return;
        }
        
        // Update band info display
        bandInfoDisplay.classList.add('active');
        bandInfoDisplay.innerHTML = `<p class="band-info-text">Band ${band}: ${bandInfo.range}</p>`;
        
        // Search for allocations that overlap with this band's frequency range
        const allocations = this.findAllocationsForBandRange(bandInfo.startMHz, bandInfo.endMHz);
        
        if (allocations.length === 0) {
            resultsContainer.innerHTML = `<p class="no-results">No frequency allocations found for Band ${band} (${bandInfo.range}).</p>`;
            return;
        }
        
        this.displayBandResults(allocations, band, bandInfo);
    }
    
    findAllocationsForBandRange(startMHz, endMHz) {
        // Load band-specific database if not already loaded
        if (!this.peakDatabase) {
            this.loadBandDatabases();
        }
        
        if (!this.peakDatabase || this.peakDatabase.length === 0) {
            console.warn('Peak identification database not loaded');
            return [];
        }
        
        // Find all allocations that overlap with the band range
        // Convert MHz to the appropriate units for comparison
        return this.peakDatabase.filter(allocation => {
            // Convert allocation frequencies to MHz for comparison
            let allocStartMHz = allocation.startFreq;
            let allocEndMHz = allocation.endFreq;
            
            if (allocation.unit === 'kHz') {
                allocStartMHz = allocation.startFreq / 1000;
                allocEndMHz = allocation.endFreq / 1000;
            } else if (allocation.unit === 'GHz') {
                allocStartMHz = allocation.startFreq * 1000;
                allocEndMHz = allocation.endFreq * 1000;
            } else if (allocation.unit === 'THz') {
                allocStartMHz = allocation.startFreq * 1000000;
                allocEndMHz = allocation.endFreq * 1000000;
            }
            
            // Check if allocation overlaps with band range
            return allocStartMHz <= endMHz && allocEndMHz >= startMHz;
        }).sort((a, b) => {
            // Sort by frequency for better display
            let aFreqMHz = a.startFreq;
            let bFreqMHz = b.startFreq;
            
            if (a.unit === 'kHz') aFreqMHz = a.startFreq / 1000;
            else if (a.unit === 'GHz') aFreqMHz = a.startFreq * 1000;
            else if (a.unit === 'THz') aFreqMHz = a.startFreq * 1000000;
            
            if (b.unit === 'kHz') bFreqMHz = b.startFreq / 1000;
            else if (b.unit === 'GHz') bFreqMHz = b.startFreq * 1000;
            else if (b.unit === 'THz') bFreqMHz = b.startFreq * 1000000;
            
            return aFreqMHz - bFreqMHz;
        });
    }
    
    loadBandDatabases() {
        // Initialize combined database
        this.peakDatabase = [];
        
        console.log('Loading band databases...');
        
        // Access already loaded band databases (loaded via HTML script tags)
        const bandVariables = [
            'peakIdentificationBand0',
            'peakIdentificationBand1',
            'peakIdentificationBand2',
            'peakIdentificationBand3',
            'peakIdentificationBand4',
            'peakIdentificationBand5',
            'peakIdentificationBand6',
            'peakIdentificationBand7'
        ];
        
        // Check what variables are available
        console.log('Available window variables:', Object.keys(window).filter(key => key.includes('peakIdentification')));
        
        // Combine all band databases
        bandVariables.forEach((varName, index) => {
            console.log(`Checking ${varName}:`, window[varName]);
            if (window[varName] && Array.isArray(window[varName])) {
                this.peakDatabase = this.peakDatabase.concat(window[varName]);
                console.log(`✓ Loaded band ${index} database: ${window[varName].length} allocations`);
            } else {
                console.warn(`✗ Band ${index} database not found or empty: ${varName}`, window[varName]);
            }
        });
        
        console.log(`🎯 Combined peak database loaded: ${this.peakDatabase.length} total allocations`);
        
        // Debug first few allocations
        if (this.peakDatabase.length > 0) {
            console.log('First allocation:', this.peakDatabase[0]);
        }
    }
    
    displayBandResults(allocations, band, bandInfo) {
        const resultsContainer = document.getElementById('peakResults');
        
        let html = `<div class="allocation-header">Band ${band} Allocations: ${bandInfo.range} (${allocations.length} allocation${allocations.length > 1 ? 's' : ''} found)</div>`;
        
        allocations.forEach((allocation, index) => {
            // Format frequency range for display
            const freqRange = `${allocation.startFreq}-${allocation.endFreq} ${allocation.unit}`;
            
            html += `<div class="allocation-result">`;
            html += `<div class="allocation-header">${freqRange}</div>`;
            
            // Add services that have content, prioritizing most relevant ones
            const services = [];
            
            if (allocation.primaryService) {
                services.push({ label: 'Primary Service', content: allocation.primaryService });
            }
            
            if (allocation.secondaryService) {
                services.push({ label: 'Secondary Service', content: allocation.secondaryService });
            }
            
            if (allocation.usAllocations) {
                services.push({ label: 'US Allocations', content: allocation.usAllocations });
            }
            
            if (allocation.fccPart) {
                services.push({ label: 'FCC Part', content: allocation.fccPart });
            }
            
            if (allocation.notes) {
                services.push({ label: 'Notes', content: allocation.notes });
            }
            
            services.forEach(service => {
                if (service.content && service.content.trim()) {
                    // Clean up the content for onclick - escape quotes and newlines
                    const cleanContent = service.content.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, ' ');
                    
                    html += `<div class="allocation-service" onclick="window.figureExportTool.addToComments('${freqRange} - ${cleanContent}')">`;
                    html += `<div class="service-label">${service.label}:</div>`;
                    html += `<div class="service-content">${service.content}</div>`;
                    html += `</div>`;
                }
            });
            
            // Add description if available
            if (allocation.description) {
                html += `<div class="allocation-description">`;
                html += `<div class="service-label">Description:</div>`;
                html += `<div class="service-content">${allocation.description}</div>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        });
        
        html += '<div class="click-hint">Click on any allocation above to add it to your comments</div>';
        
        resultsContainer.innerHTML = html;
    }
    
    formatFrequency(frequencyMHz) {
        if (frequencyMHz < 1) {
            return `${(frequencyMHz * 1000).toFixed(3)} kHz`;
        } else if (frequencyMHz < 1000) {
            return `${frequencyMHz.toFixed(3)} MHz`;
        } else if (frequencyMHz < 1000000) {
            return `${(frequencyMHz / 1000).toFixed(3)} GHz`;
        } else {
            return `${(frequencyMHz / 1000000).toFixed(3)} THz`;
        }
    }
    
    addToComments(text) {
        const commentsTextarea = document.getElementById('comments');
        const currentText = commentsTextarea.value.trim();
        
        if (currentText) {
            commentsTextarea.value = currentText + '\n\n' + text;
        } else {
            commentsTextarea.value = text;
        }
        
        // Scroll to the bottom of the textarea
        commentsTextarea.scrollTop = commentsTextarea.scrollHeight;
        
        // Brief visual feedback
        commentsTextarea.style.backgroundColor = '#e7f3ff';
        setTimeout(() => {
            commentsTextarea.style.backgroundColor = '';
        }, 300);
        
        // Save to current page
        this.saveCurrentPageData();
        
        console.log('Added to comments:', text);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.figureExportTool = new FigureExportTool();
}); 