// ========================================================================
// FIGURE EXPORT TOOL v3.3 - EMC TESTING ANNOTATION SYSTEM
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
// Band 4 (Upper HF): 5-30 MHz          | 95 allocations
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
        this.currentInputType = 'csv'; // 'images' or 'csv'
        this.currentCsvMode = 'overlay'; // 'separate' or 'overlay'
        
        // CSV overlay state
        this.csvOverlayState = {
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            showLegend: true,
            datasets: [] // Will store references to loaded datasets
        };
        
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
        
        // CSV dataset colors for overlay mode
        this.csvColors = [
            '#cc0000', // Red
            '#0066cc', // Blue
            '#00cc66', // Green
            '#cc6600', // Orange
            '#6600cc', // Purple
            '#cc0066', // Pink
            '#006666', // Teal
            '#666600'  // Olive
        ];
        
        // Limit lines configuration for EMC testing (NYCT AC Train Standards)
        this.limitLines = {
            enabled: true,
            distance: '50ft', // '50ft' or '100ft'
            limits: {
                // NYCT AC Train Radiated Emission Limits at 50 ft (dBμV/m/MHz)
                'B0': 126,   // 10 kHz – 160 kHz (10 kHz, 150 kHz points)
                'B1': 126,   // 150 kHz – 650 kHz (150 kHz point)
                'B2': 115,   // 500 kHz – 3 MHz (1.6 MHz point)
                'B3': 100,   // 2.5 MHz – 7.5 MHz (3.2 MHz point)
                'B4': 85,    // 5 MHz – 30 MHz (interpolated between 3.2 MHz and 200 MHz)
                'B5': 81,    // 25 MHz – 325 MHz (200 MHz point)
                'B6': 96,    // 300 MHz – 1.3 GHz (1.0 GHz point)
                'B7': 96     // 1 GHz – 6 GHz (1.0 GHz, 6.0 GHz points)
            },
            limits100ft: {
                // NYCT AC Train Radiated Emission Limits at 100 ft (dBμV/m/MHz)
                'B0': 108,   // 10 kHz – 160 kHz (10 kHz, 150 kHz points)
                'B1': 108,   // 150 kHz – 650 kHz (150 kHz point)
                'B2': 97,    // 500 kHz – 3 MHz (1.6 MHz point)
                'B3': 94,    // 2.5 MHz – 7.5 MHz (3.2 MHz point)
                'B4': 84,    // 5 MHz – 30 MHz (interpolated between 3.2 MHz and 200 MHz)
                'B5': 75,    // 25 MHz – 325 MHz (200 MHz point)
                'B6': 90,    // 300 MHz – 1.3 GHz (1.0 GHz point)
                'B7': 90     // 1 GHz – 6 GHz (1.0 GHz, 6.0 GHz points)
            }
        };
        
        // Initialize first page
        this.initializePage(1);
        this.initializeEventListeners();
        this.updateTables();
        
        // Set initial display state based on defaults
        this.setInputType(this.currentInputType);
        this.setCsvMode(this.currentCsvMode);
        
        // Make tool globally accessible
        window.figureExportTool = this;
        window.peakHelper = this;
    }
    
    initializePage(pageId) {
        const pageData = {
            pageId: pageId,
            // Image states
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
            // CSV data states
            csvState1: {
                data: null,
                originalFilename: null,
                frequencyData: [],
                amplitudeData: [],
                minFreq: 0,
                maxFreq: 0,
                minAmp: 0,
                maxAmp: 0,
                rowCount: 0,
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                isDragging: false,
                lastX: 0,
                lastY: 0
            },
            csvState2: {
                data: null,
                originalFilename: null,
                frequencyData: [],
                amplitudeData: [],
                minFreq: 0,
                maxFreq: 0,
                minAmp: 0,
                maxAmp: 0,
                rowCount: 0,
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                isDragging: false,
                lastX: 0,
                lastY: 0
            },
            formData1: { runId: '', band: '', location: '', testType: '', equipmentDescription: '', operatingCondition: '', traces: 'Top - maximum peak hold\nBottom - minimum peak hold' },
            formData2: { runId: '', band: '', location: '', testType: '', equipmentDescription: '', operatingCondition: '', traces: 'Top - maximum peak hold\nBottom - minimum peak hold' },
            comments: ''
        };
        
        this.pages.set(pageId, pageData);
        
        // Initialize basic controls for empty containers
        if (this.currentInputType === 'images') {
            setTimeout(() => {
                this.addBasicImageControls(1);
                this.addBasicImageControls(2);
            }, 100);
        }
        
        return pageData;
    }
    
    getCurrentPage() {
        return this.pages.get(this.currentPageId);
    }
    
    initializeEventListeners() {
        // Input type toggle
        document.querySelectorAll('input[name="inputType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setInputType(e.target.value);
                }
            });
        });
        
        // CSV mode toggle
        document.querySelectorAll('input[name="csvMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setCsvMode(e.target.value);
                }
            });
        });
        
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
        
        // CSV file upload
        this.setupCsvUploadListeners(1);
        this.setupCsvUploadListeners(2);
        this.setupOverlayUploadListeners();
        
        // Form inputs - update tables when values change
        ['runId1', 'band1', 'location1', 'testType1', 'equipmentDescription1', 'operatingCondition1', 'traces1',
         'runId2', 'band2', 'location2', 'testType2', 'equipmentDescription2', 'operatingCondition2', 'traces2', 'comments'].forEach(id => {
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
        
        // CSV canvas interactions
        this.setupCsvCanvasListeners(1);
        this.setupCsvCanvasListeners(2);
        this.setupOverlayCanvasListeners();
        
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
        
        // Limit lines controls
        this.setupLimitLinesListeners();
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
        const dualCsvUpload = document.getElementById('dualCsvUpload');
        const csvSeparateMode = document.getElementById('csvSeparateMode');
        
        if (layout === 'vertical') {
            dualUpload.classList.add('vertical');
            dualFormSection.classList.add('vertical');
            dualInfoTables.classList.add('vertical');
            dualImageContainer.classList.add('vertical');
            if (dualCsvUpload) dualCsvUpload.classList.add('vertical');
            if (csvSeparateMode) csvSeparateMode.classList.add('vertical');
        } else {
            dualUpload.classList.remove('vertical');
            dualFormSection.classList.remove('vertical');
            dualInfoTables.classList.remove('vertical');
            dualImageContainer.classList.remove('vertical');
            if (dualCsvUpload) dualCsvUpload.classList.remove('vertical');
            if (csvSeparateMode) csvSeparateMode.classList.remove('vertical');
        }
        
        // Redraw with new layout
        setTimeout(() => {
            if (this.currentInputType === 'images') {
                this.setupCanvas(1);
                this.setupCanvas(2);
            } else {
                // CSV mode
                if (this.currentCsvMode === 'overlay') {
                    this.setupOverlayCanvas();
                    this.drawOverlayGraph();
                } else {
                    this.setupCsvCanvas(1);
                    this.setupCsvCanvas(2);
                    this.drawCsvGraph(1);
                    this.drawCsvGraph(2);
                }
            }
        }, 300);
    }
    
    setInputType(inputType) {
        this.currentInputType = inputType;
        
        const imageUploadSection = document.getElementById('imageUploadSection');
        const csvUploadSection = document.getElementById('csvUploadSection');
        const dualImageContainer = document.getElementById('dualImageContainer');
        const dualCsvContainer = document.getElementById('dualCsvContainer');
        const dualInfoTables = document.getElementById('dualInfoTables');
        
        // Update export button labels
        this.updateExportButtonLabels();
        
        if (inputType === 'csv') {
            // Show CSV mode
            imageUploadSection.style.display = 'none';
            csvUploadSection.style.display = 'block';
            dualImageContainer.style.display = 'none';
            dualCsvContainer.style.display = 'block';
            
            // Update table headers
            document.getElementById('dataType1Header').textContent = 'CSV Data 1';
            document.getElementById('dataType2Header').textContent = 'CSV Data 2';
            
            // Update form labels
            const formContainers = document.querySelectorAll('.form-container h3');
            if (formContainers[0]) formContainers[0].textContent = 'CSV File 1 Information';
            if (formContainers[1]) formContainers[1].textContent = 'CSV File 2 Information';
            
            // Setup CSV canvases and apply current CSV mode
            setTimeout(() => {
                this.setupCsvCanvas(1);
                this.setupCsvCanvas(2);
                this.setCsvMode(this.currentCsvMode);
                this.applyCsvLayout();
            }, 100);
            
        } else {
            // Show image mode
            imageUploadSection.style.display = 'block';
            csvUploadSection.style.display = 'none';
            dualImageContainer.style.display = 'block';
            dualCsvContainer.style.display = 'none';
            
            // Update table headers
            document.getElementById('dataType1Header').textContent = 'Image 1';
            document.getElementById('dataType2Header').textContent = 'Image 2';
            
            // Update form labels
            const formContainers = document.querySelectorAll('.form-container h3');
            if (formContainers[0]) formContainers[0].textContent = 'Image 1 Information';
            if (formContainers[1]) formContainers[1].textContent = 'Image 2 Information';
            
            // Setup image canvases and apply current layout
            setTimeout(() => {
                this.setupCanvas(1);
                this.setupCanvas(2);
                this.setLayout(this.currentLayout);
                
                // Redraw existing images if any
                const currentPage = this.getCurrentPage();
                if (currentPage) {
                    if (currentPage.imageState1.image) this.drawImage(1);
                    if (currentPage.imageState2.image) this.drawImage(2);
                }
            }, 100);
        }
        
        this.updateTables();
    }
    
    updateExportButtonLabels() {
        const exportBtn1 = document.getElementById('exportImage1');
        const exportBtn2 = document.getElementById('exportImage2');
        const exportBothBtn = document.getElementById('exportBoth');
        
        if (this.currentInputType === 'csv') {
            if (this.currentCsvMode === 'overlay') {
                exportBtn1.textContent = 'Export Overlay';
                exportBtn2.textContent = 'Export Overlay';
                exportBothBtn.textContent = 'Export Overlay';
            } else {
                exportBtn1.textContent = 'Export CSV 1';
                exportBtn2.textContent = 'Export CSV 2';
                exportBothBtn.textContent = 'Export Both CSV';
            }
        } else {
            exportBtn1.textContent = 'Export Image 1';
            exportBtn2.textContent = 'Export Image 2';
            exportBothBtn.textContent = 'Export Both Images';
        }
    }
    
    setCsvMode(csvMode) {
        this.currentCsvMode = csvMode;
        
        const csvSeparateMode = document.getElementById('csvSeparateMode');
        const csvOverlayMode = document.getElementById('csvOverlayMode');
        const dualCsvUpload = document.getElementById('dualCsvUpload');
        const singleCsvUpload = document.getElementById('singleCsvUpload');
        
        // Update export button labels when changing CSV mode
        this.updateExportButtonLabels();
        
        if (csvMode === 'overlay') {
            // Show overlay mode, hide separate mode
            csvSeparateMode.style.display = 'none';
            csvOverlayMode.style.display = 'block';
            dualCsvUpload.style.display = 'none';
            singleCsvUpload.style.display = 'block';
            
            // Update datasets array with currently loaded data
            this.updateOverlayDatasets();
            
            // Setup and draw overlay canvas
            setTimeout(() => {
                this.setupOverlayCanvas();
                this.drawOverlayGraph();
                this.updateLegend();
                this.updateOverlayFileList();
            }, 100);
        } else {
            // Show separate mode, hide overlay mode
            csvSeparateMode.style.display = 'block';
            csvOverlayMode.style.display = 'none';
            dualCsvUpload.style.display = 'block';
            singleCsvUpload.style.display = 'none';
            
            // Redraw individual graphs
            setTimeout(() => {
                this.setupCsvCanvas(1);
                this.setupCsvCanvas(2);
                this.drawCsvGraph(1);
                this.drawCsvGraph(2);
            }, 100);
        }
        
        // Apply current layout to the active mode
        this.applyCsvLayout();
    }
    
    applyCsvLayout() {
        const csvSeparateMode = document.getElementById('csvSeparateMode');
        
        if (this.currentLayout === 'vertical') {
            csvSeparateMode.classList.add('vertical');
        } else {
            csvSeparateMode.classList.remove('vertical');
        }
    }
    
    exportBothImages() {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        if (this.currentInputType === 'csv') {
            if (this.currentCsvMode === 'overlay') {
                // Export overlay mode
                this.exportOverlayData();
            } else {
                // Export both CSV data
                const hasData1 = currentPage.csvState1.frequencyData.length > 0;
                const hasData2 = currentPage.csvState2.frequencyData.length > 0;
                
                if (!hasData1 && !hasData2) {
                    alert('Please load at least one CSV file first.');
                    return;
                }
                
                const canvases = [];
                const formDataArray = [];
                
                if (hasData1) {
                    canvases.push(this.createCsvExportCanvas(1));
                    formDataArray.push(this.getFormData(1));
                }
                
                if (hasData2) {
                    canvases.push(this.createCsvExportCanvas(2));
                    formDataArray.push(this.getFormData(2));
                }
                
                const comments = document.getElementById('comments').value || '-';
                this.createExport(canvases, formDataArray, comments, `Page ${this.currentPageId} - Both CSV`);
            }
        } else {
            // Export both images (existing functionality)
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
    }
    
    setupUploadListeners(imageNumber) {
        const uploadArea = document.getElementById(`uploadArea${imageNumber}`);
        const imageInput = document.getElementById(`imageInput${imageNumber}`);
        
        if (!uploadArea || !imageInput) {
            console.error(`Upload elements not found for image ${imageNumber}`);
            return;
        }
        
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e, imageNumber));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e, imageNumber));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e, imageNumber));
        
        imageInput.addEventListener('change', (e) => this.handleFileSelect(e, imageNumber));
    }
    
    setupCanvasListeners(imageNumber) {
        const canvas = document.getElementById(`annotationCanvas${imageNumber}`);
        
        if (!canvas) return;
        
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e, imageNumber));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e, imageNumber));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e, imageNumber));
        canvas.addEventListener('wheel', (e) => this.handleWheel(e, imageNumber));
        canvas.addEventListener('dblclick', (e) => this.handleImageDoubleClick(e, imageNumber));
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
            location: document.getElementById(`location${imageNumber}`)?.value || '-',
            testType: document.getElementById(`testType${imageNumber}`)?.value || '-',
            equipmentDescription: document.getElementById(`equipmentDescription${imageNumber}`)?.value || '-',
            operatingCondition: document.getElementById(`operatingCondition${imageNumber}`)?.value || '-',
            traces: document.getElementById(`traces${imageNumber}`)?.value || 'Top - maximum peak hold\nBottom - minimum peak hold'
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
                
                // Update dynamic UI after loading image
                this.updateTables();
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
        
        if (!state || !state.image) {
            // Add fullscreen button even when no image is loaded
            this.addBasicImageControls(imageNumber);
            return;
        }
        
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
        
        // Use device pixel ratio for high resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        
        // Scale context for high DPI
        const ctx = this.getContext(imageNumber);
        ctx.scale(dpr, dpr);
        
        // Center the canvas in the container
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        
        // Reset transform for crisp display
        state.offsetX = 0;
        state.offsetY = 0;
        state.scale = 1;
        
        // Store base size for zoom calculations (using logical pixels)
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
    
    addBasicImageControls(imageNumber) {
        // Remove existing controls if any
        const existingControls = document.querySelector(`#imageControls${imageNumber}`);
        if (existingControls) {
            existingControls.remove();
        }
        
        const canvas = this.getCanvas(imageNumber);
        
        // Create basic controls with just full screen button for when no image is loaded
        const controls = document.createElement('div');
        controls.className = 'image-controls basic-controls';
        controls.id = `imageControls${imageNumber}`;
        controls.innerHTML = `
            <div class="zoom-controls">
                <button class="control-btn disabled" disabled>No Image Loaded</button>
                <button class="control-btn" id="fullScreen${imageNumber}" title="Full Screen" disabled>⛶ Full Screen</button>
            </div>
        `;
        
        canvas.parentElement.appendChild(controls);
        
        // Only add full screen listener when image is loaded
        document.getElementById(`fullScreen${imageNumber}`).addEventListener('click', () => {
            const state = this.getImageState(imageNumber);
            if (state && state.image) {
                this.enterFullScreen(imageNumber);
            }
        });
    }
    
    addImageControls(imageNumber) {
        // Remove existing controls if any
        const existingControls = document.querySelector(`#imageControls${imageNumber}`);
        if (existingControls) {
            existingControls.remove();
        }
        
        const canvas = this.getCanvas(imageNumber);
        const state = this.getImageState(imageNumber);
        
        if (!state || !state.image) {
            this.addBasicImageControls(imageNumber);
            return;
        }
        
        // Create full image controls
        const controls = document.createElement('div');
        controls.className = 'image-controls';
        controls.id = `imageControls${imageNumber}`;
        controls.innerHTML = `
            <div class="zoom-controls">
                <button class="control-btn" id="zoomOut${imageNumber}">−</button>
                <span class="zoom-level" id="zoomLevel${imageNumber}">${Math.round(state.scale * 100)}%</span>
                <button class="control-btn" id="resetZoom${imageNumber}">Reset</button>
                <button class="control-btn" id="fitToScreen${imageNumber}">Fit</button>
                <button class="control-btn" id="fullScreen${imageNumber}" title="Full Screen">⛶ Full Screen</button>
            </div>
        `;
        
        canvas.parentElement.appendChild(controls);
        
        // Add event listeners
        document.getElementById(`zoomIn${imageNumber}`).addEventListener('click', () => this.zoomIn(imageNumber));
        document.getElementById(`zoomOut${imageNumber}`).addEventListener('click', () => this.zoomOut(imageNumber));
        document.getElementById(`resetZoom${imageNumber}`).addEventListener('click', () => this.resetZoom(imageNumber));
        document.getElementById(`fitToScreen${imageNumber}`).addEventListener('click', () => this.fitToScreen(imageNumber));
        document.getElementById(`fullScreen${imageNumber}`).addEventListener('click', () => this.enterFullScreen(imageNumber));
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
        
        // Normal sensitivity for panning
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
        
        // Normal zoom sensitivity for better control
        const zoomSensitivity = 0.1;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomSensitivity);
        
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
        
        // Update dynamic UI elements based on loaded data
        this.updateDynamicUI();
    }
    
    updateDynamicUI() {
        if (this.currentInputType === 'csv') {
            if (this.currentCsvMode === 'overlay') {
                this.updateOverlayDynamicUI();
            } else {
                this.updateSeparateDynamicUI();
            }
        } else {
            this.updateImageDynamicUI();
        }
    }
    
    updateOverlayDynamicUI() {
        const datasetCount = this.csvOverlayState.datasets.length;
        
        // Show/hide CSV mode toggle only if datasets exist
        const csvModeControl = document.querySelector('.csv-mode-control');
        if (csvModeControl) {
            csvModeControl.style.display = datasetCount > 0 ? 'block' : 'none';
        }
        
        // Show/hide table headers appropriately
        const dualInfoTables = document.getElementById('dualInfoTables');
        if (dualInfoTables) {
            dualInfoTables.style.display = datasetCount > 1 ? 'block' : 'none';
        }
        
        // Show/hide form section appropriately
        const dualFormSection = document.getElementById('dualFormSection');
        if (dualFormSection) {
            dualFormSection.style.display = datasetCount > 1 ? 'block' : 'none';
        }
    }
    
    updateSeparateDynamicUI() {
        const currentPage = this.getCurrentPage();
        const hasData1 = currentPage && currentPage.csvState1.frequencyData.length > 0;
        const hasData2 = currentPage && currentPage.csvState2.frequencyData.length > 0;
        const dataCount = (hasData1 ? 1 : 0) + (hasData2 ? 1 : 0);
        
        // Show/hide second form only if both files are loaded
        const formContainers = document.querySelectorAll('.form-container');
        if (formContainers.length >= 2) {
            formContainers[1].style.display = hasData2 ? 'block' : 'none';
        }
        
        // Show/hide second table column
        const infoTables = document.querySelectorAll('.info-table');
        if (infoTables.length >= 2) {
            infoTables[1].style.display = hasData2 ? 'block' : 'none';
        }
        
        // Update labels to remove numbering if only one file
        if (dataCount === 1) {
            const formContainers = document.querySelectorAll('.form-container h3');
            if (formContainers[0] && hasData1) {
                formContainers[0].textContent = 'CSV File Information';
            }
            
            const tableHeaders = document.querySelectorAll('.info-table h4');
            if (tableHeaders[0] && hasData1) {
                tableHeaders[0].textContent = 'CSV Data';
            }
        } else if (dataCount === 2) {
            const formContainers = document.querySelectorAll('.form-container h3');
            if (formContainers[0]) formContainers[0].textContent = 'CSV File 1 Information';
            if (formContainers[1]) formContainers[1].textContent = 'CSV File 2 Information';
            
            const tableHeaders = document.querySelectorAll('.info-table h4');
            if (tableHeaders[0]) tableHeaders[0].textContent = 'CSV Data 1';
            if (tableHeaders[1]) tableHeaders[1].textContent = 'CSV Data 2';
        }
    }
    
    updateImageDynamicUI() {
        const currentPage = this.getCurrentPage();
        const hasImage1 = currentPage && currentPage.imageState1.image !== null;
        const hasImage2 = currentPage && currentPage.imageState2.image !== null;
        const imageCount = (hasImage1 ? 1 : 0) + (hasImage2 ? 1 : 0);
        
        // Show/hide second form only if both images are loaded
        const formContainers = document.querySelectorAll('.form-container');
        if (formContainers.length >= 2) {
            formContainers[1].style.display = hasImage2 ? 'block' : 'none';
        }
        
        // Show/hide second table column
        const infoTables = document.querySelectorAll('.info-table');
        if (infoTables.length >= 2) {
            infoTables[1].style.display = hasImage2 ? 'block' : 'none';
        }
        
        // Update labels to remove numbering if only one image
        if (imageCount === 1) {
            const formContainers = document.querySelectorAll('.form-container h3');
            if (formContainers[0] && hasImage1) {
                formContainers[0].textContent = 'Image Information';
            }
            
            const tableHeaders = document.querySelectorAll('.info-table h4');
            if (tableHeaders[0] && hasImage1) {
                tableHeaders[0].textContent = 'Image';
            }
        } else if (imageCount === 2) {
            const formContainers = document.querySelectorAll('.form-container h3');
            if (formContainers[0]) formContainers[0].textContent = 'Image 1 Information';
            if (formContainers[1]) formContainers[1].textContent = 'Image 2 Information';
            
            const tableHeaders = document.querySelectorAll('.info-table h4');
            if (tableHeaders[0]) tableHeaders[0].textContent = 'Image 1';
            if (tableHeaders[1]) tableHeaders[1].textContent = 'Image 2';
        }
    }
    
    clearCurrentPage() {
        if (confirm('Are you sure you want to clear the current page? This cannot be undone.')) {
            const currentPage = this.getCurrentPage();
            
            if (currentPage) {
                // Clear image data
                currentPage.imageState1.image = null;
                currentPage.imageState2.image = null;
                
                // Clear CSV data
                currentPage.csvState1.data = null;
                currentPage.csvState1.frequencyData = [];
                currentPage.csvState1.amplitudeData = [];
                currentPage.csvState1.rowCount = 0;
                currentPage.csvState1.originalFilename = null;
                
                currentPage.csvState2.data = null;
                currentPage.csvState2.frequencyData = [];
                currentPage.csvState2.amplitudeData = [];
                currentPage.csvState2.rowCount = 0;
                currentPage.csvState2.originalFilename = null;
                
                // Clear form data
                currentPage.formData1 = { runId: '', band: '', location: '' };
                currentPage.formData2 = { runId: '', band: '', location: '' };
                currentPage.comments = '';
                
                // Show instruction overlays for both input types
                document.getElementById('instructionOverlay1').style.display = 'block';
                document.getElementById('instructionOverlay2').style.display = 'block';
                document.getElementById('csvInstructionOverlay1').style.display = 'block';
                document.getElementById('csvInstructionOverlay2').style.display = 'block';
                
                // Hide CSV info displays
                document.getElementById('csvInfo1').style.display = 'none';
                document.getElementById('csvInfo2').style.display = 'none';
                
                // Clear CSV overlay state
                this.csvOverlayState.datasets = [];
                this.csvOverlayState.scale = 1;
                this.csvOverlayState.offsetX = 0;
                this.csvOverlayState.offsetY = 0;
                this.csvOverlayState.minFreq = 0;
                this.csvOverlayState.maxFreq = 0;
                this.csvOverlayState.minAmp = 0;
                this.csvOverlayState.maxAmp = 0;
                
                // Clear canvases
                const ctx1 = this.getContext(1);
                const ctx2 = this.getContext(2);
                const canvas1 = this.getCanvas(1);
                const canvas2 = this.getCanvas(2);
                
                const csvCtx1 = this.getCsvContext(1);
                const csvCtx2 = this.getCsvContext(2);
                const csvCanvas1 = this.getCsvCanvas(1);
                const csvCanvas2 = this.getCsvCanvas(2);
                
                const overlayCanvas = document.getElementById('csvOverlayCanvas');
                const overlayCtx = overlayCanvas ? overlayCanvas.getContext('2d') : null;
                
                if (ctx1 && canvas1) ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
                if (ctx2 && canvas2) ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                if (csvCtx1 && csvCanvas1) csvCtx1.clearRect(0, 0, csvCanvas1.width, csvCanvas1.height);
                if (csvCtx2 && csvCanvas2) csvCtx2.clearRect(0, 0, csvCanvas2.width, csvCanvas2.height);
                
                if (overlayCtx) {
                    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                }
                
                // Update overlay display if in overlay mode
                if (this.currentCsvMode === 'overlay') {
                    this.updateLegend();
                    this.updateOverlayFileList();
                    document.getElementById('csvOverlayInstructionOverlay').style.display = 'block';
                }
                
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
        
        // Save form data - including new fields
        ['runId1', 'band1', 'location1', 'testType1', 'equipmentDescription1', 'operatingCondition1', 'traces1',
         'runId2', 'band2', 'location2', 'testType2', 'equipmentDescription2', 'operatingCondition2', 'traces2'].forEach(id => {
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
        
        // Load form data - including new fields
        document.getElementById('runId1').value = page.formData1.runId || '';
        document.getElementById('band1').value = page.formData1.band || '';
        document.getElementById('location1').value = page.formData1.location || '';
        document.getElementById('testType1').value = page.formData1.testType || '';
        document.getElementById('equipmentDescription1').value = page.formData1.equipmentDescription || '';
        document.getElementById('operatingCondition1').value = page.formData1.operatingCondition || '';
        document.getElementById('traces1').value = page.formData1.traces || 'Top - maximum peak hold\nBottom - minimum peak hold';
        
        document.getElementById('runId2').value = page.formData2.runId || '';
        document.getElementById('band2').value = page.formData2.band || '';
        document.getElementById('location2').value = page.formData2.location || '';
        document.getElementById('testType2').value = page.formData2.testType || '';
        document.getElementById('equipmentDescription2').value = page.formData2.equipmentDescription || '';
        document.getElementById('operatingCondition2').value = page.formData2.operatingCondition || '';
        document.getElementById('traces2').value = page.formData2.traces || 'Top - maximum peak hold\nBottom - minimum peak hold';
        
        document.getElementById('comments').value = page.comments || '';
        
        // Update instruction overlays
        document.getElementById('instructionOverlay1').style.display = page.imageState1.image ? 'none' : 'block';
        document.getElementById('instructionOverlay2').style.display = page.imageState2.image ? 'none' : 'block';
    }
    
    exportOverlayData() {
        if (this.csvOverlayState.datasets.length === 0) {
            alert('Please load CSV files for overlay comparison first.');
            return;
        }
        
        const comments = document.getElementById('comments').value || '-';
        
        // Create high-resolution overlay export canvas
        const overlayCanvas = this.createOverlayExportCanvas();
        
        // Use form data from the first file, or create default data
        const formData = this.getFormData(1);
        const exportFormData = {
            runId: formData.runId || 'Overlay',
            band: formData.band || 'Multi-Band', 
            location: formData.location || 'Comparison'
        };
        
        this.createExport([overlayCanvas], [exportFormData], comments, `Page ${this.currentPageId} - Overlay Comparison`);
    }
    
    createOverlayExportCanvas() {
        // Create a high-resolution canvas for overlay export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set very high resolution for better export quality
        const dpr = window.devicePixelRatio || 1;
        const baseWidth = 1400;
        const baseHeight = 1000;
        const width = baseWidth * dpr;
        const height = baseHeight * dpr;
        
        exportCanvas.width = width;
        exportCanvas.height = height;
        
        // Scale for high DPI
        exportCtx.scale(dpr, dpr);
        
        const margin = { top: 80, right: 200, bottom: 160, left: 150 };
        
        // Enable highest quality rendering
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // Clear canvas
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, baseWidth, baseHeight);
        
        // Calculate plot area
        const plotWidth = baseWidth - margin.left - margin.right;
        const plotHeight = baseHeight - margin.top - margin.bottom;
        
        // Draw grid with crisp lines
        exportCtx.strokeStyle = '#e0e0e0';
        exportCtx.lineWidth = 1;
        
        // Vertical grid lines (frequency)
        for (let i = 0; i <= 10; i++) {
            const x = margin.left + (i / 10) * plotWidth;
            exportCtx.beginPath();
            exportCtx.moveTo(x + 0.5, margin.top);
            exportCtx.lineTo(x + 0.5, margin.top + plotHeight);
            exportCtx.stroke();
        }
        
        // Horizontal grid lines (amplitude)
        for (let i = 0; i <= 10; i++) {
            const y = margin.top + (i / 10) * plotHeight;
            exportCtx.beginPath();
            exportCtx.moveTo(margin.left, y + 0.5);
            exportCtx.lineTo(margin.left + plotWidth, y + 0.5);
            exportCtx.stroke();
        }
        
        // Draw axes with crisp lines
        exportCtx.strokeStyle = '#333333';
        exportCtx.lineWidth = 3;
        exportCtx.beginPath();
        // X-axis
        exportCtx.moveTo(margin.left, margin.top + plotHeight + 0.5);
        exportCtx.lineTo(margin.left + plotWidth, margin.top + plotHeight + 0.5);
        // Y-axis
        exportCtx.moveTo(margin.left + 0.5, margin.top);
        exportCtx.lineTo(margin.left + 0.5, margin.top + plotHeight);
        exportCtx.stroke();
        
        // Draw all datasets
        const freqRange = this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq;
        const ampRange = this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp;
        
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            exportCtx.strokeStyle = dataset.color;
            exportCtx.lineWidth = 3;
            exportCtx.lineJoin = 'round';
            exportCtx.lineCap = 'round';
            exportCtx.beginPath();
            
            let firstPoint = true;
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                const x = margin.left + ((freq - this.csvOverlayState.minFreq) / freqRange) * plotWidth;
                const y = margin.top + plotHeight - ((amp - this.csvOverlayState.minAmp) / ampRange) * plotHeight;
                
                if (firstPoint) {
                    exportCtx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    exportCtx.lineTo(x, y);
                }
            }
            exportCtx.stroke();
        });
        
        // Draw axis labels with crisp text
        exportCtx.fillStyle = '#333333';
        exportCtx.font = '20px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        
        // X-axis labels (frequency)
        for (let i = 0; i <= 5; i++) {
            const freq = this.csvOverlayState.minFreq + (freqRange * i / 5);
            const x = margin.left + (i / 5) * plotWidth;
            const freqMHz = freq / 1e6;
            exportCtx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 20);
        }
        
        // Y-axis labels (amplitude)
        exportCtx.textAlign = 'right';
        exportCtx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
            const amp = this.csvOverlayState.minAmp + (ampRange * i / 5);
            const y = margin.top + plotHeight - (i / 5) * plotHeight;
            exportCtx.fillText(amp.toFixed(1) + ' dB', margin.left - 20, y);
        }
        
        // Axis titles
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'bottom';
        exportCtx.font = 'bold 24px Arial';
        exportCtx.fillText('Frequency', margin.left + plotWidth / 2, baseHeight - 30);
        
        exportCtx.save();
        exportCtx.translate(35, margin.top + plotHeight / 2);
        exportCtx.rotate(-Math.PI / 2);
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.fillText('Amplitude (dB)', 0, 0);
        exportCtx.restore();
        
        // Add title
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        exportCtx.font = 'bold 32px Arial';
        exportCtx.fillText('Spectrum Analysis Overlay Comparison', margin.left + plotWidth / 2, 15);
        
        // Draw regulatory limit lines
        const freqStartMHz = this.csvOverlayState.minFreq / 1e6;
        const freqEndMHz = this.csvOverlayState.maxFreq / 1e6;
        this.drawLimitLines(exportCtx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, this.csvOverlayState.minAmp, this.csvOverlayState.maxAmp);
        
        // Add legend outside the graph area at the bottom
        const legendX = margin.left + plotWidth / 2;
        const legendY = margin.top + plotHeight + 90; // In the margin area outside graph
        
        // Calculate legend dimensions
        const itemWidth = 140;
        const maxItemsPerRow = Math.floor(plotWidth / itemWidth);
        const itemsPerRow = Math.min(this.csvOverlayState.datasets.length, maxItemsPerRow);
        
        // Draw legend items horizontally centered
        const totalItemWidth = itemsPerRow * itemWidth;
        const startX = legendX - totalItemWidth / 2;
        
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const itemX = startX + col * itemWidth;
            const itemY = legendY + row * 25;
            
            // Draw color line
            exportCtx.strokeStyle = dataset.color;
            exportCtx.lineWidth = 3;
            exportCtx.beginPath();
            exportCtx.moveTo(itemX, itemY);
            exportCtx.lineTo(itemX + 25, itemY);
            exportCtx.stroke();
            
            // Draw dataset name
            exportCtx.fillStyle = '#333';
            exportCtx.font = 'bold 14px Arial';
            exportCtx.textAlign = 'left';
            exportCtx.textBaseline = 'middle';
            
            // Truncate long names for export
            let displayName = dataset.name;
            if (displayName.length > 12) {
                displayName = displayName.substring(0, 9) + '...';
            }
            
            exportCtx.fillText(displayName, itemX + 30, itemY);
        });
        
        return exportCanvas;
    }
    
    exportSingleImage(imageNumber) {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        if (this.currentInputType === 'csv') {
            if (this.currentCsvMode === 'overlay') {
                // In overlay mode, both buttons export the same overlay data
                this.exportOverlayData();
            } else {
                // In separate mode, export the specific CSV file
                const state = this.getCsvState(imageNumber);
                if (state.frequencyData.length === 0) {
                    alert(`Please load CSV file ${imageNumber} first.`);
                    return;
                }
                
                const canvas = this.createCsvExportCanvas(imageNumber);
                const formData = this.getFormData(imageNumber);
                const comments = document.getElementById('comments').value || '-';
                
                this.createExport([canvas], [formData], comments, `Page ${this.currentPageId} - CSV ${imageNumber}`);
            }
        } else {
            // Image mode
            const state = this.getImageState(imageNumber);
            if (!state.image) {
                alert(`Please load image ${imageNumber} first.`);
                return;
            }
            
            const formData = this.getFormData(imageNumber);
            const comments = document.getElementById('comments').value || '-';
            
            this.createExport([state.image], [formData], comments, `Page ${this.currentPageId} - Image ${imageNumber}`);
        }
    }
    
    exportAllPages() {
        const pageIds = Array.from(this.pages.keys()).sort((a, b) => a - b);
        const allData = [];
        const allFormData = [];
        let combinedComments = '';
        
        pageIds.forEach(pageId => {
            const page = this.pages.get(pageId);
            if (page) {
                // Only include pages that have data AND comments (or at least some data)
                let hasData = false;
                
                if (this.currentInputType === 'csv') {
                    if (this.currentCsvMode === 'overlay' && page.csvOverlayState && page.csvOverlayState.datasets.length > 0) {
                        // Handle overlay data - save current overlay state and restore page overlay state
                        const tempOverlayState = { ...this.csvOverlayState };
                        this.csvOverlayState = page.csvOverlayState;
                        allData.push(this.createOverlayExportCanvas());
                        this.csvOverlayState = tempOverlayState;
                        
                        allFormData.push({
                            runId: page.formData1.runId || 'Overlay',
                            band: page.formData1.band || 'Multi-Band',
                            location: page.formData1.location || 'Comparison'
                        });
                        hasData = true;
                    } else {
                        // Handle separate CSV data - include if it has data
                        if (page.csvState1.frequencyData.length > 0) {
                            allData.push(this.createCsvExportCanvasFromState(page.csvState1));
                            allFormData.push({
                                runId: page.formData1.runId || '-',
                                band: page.formData1.band || '-',
                                location: page.formData1.location || '-'
                            });
                            hasData = true;
                        }
                        if (page.csvState2.frequencyData.length > 0) {
                            allData.push(this.createCsvExportCanvasFromState(page.csvState2));
                            allFormData.push({
                                runId: page.formData2.runId || '-',
                                band: page.formData2.band || '-',
                                location: page.formData2.location || '-'
                            });
                            hasData = true;
                        }
                    }
                } else {
                    // Handle image data - include if it has data
                    if (page.imageState1.image) {
                        allData.push(page.imageState1.image);
                        allFormData.push({
                            runId: page.formData1.runId || '-',
                            band: page.formData1.band || '-',
                            location: page.formData1.location || '-'
                        });
                        hasData = true;
                    }
                    if (page.imageState2.image) {
                        allData.push(page.imageState2.image);
                        allFormData.push({
                            runId: page.formData2.runId || '-',
                            band: page.formData2.band || '-',
                            location: page.formData2.location || '-'
                        });
                        hasData = true;
                    }
                }
                
                // Include comments from pages that have data
                if (hasData && page.comments) {
                    combinedComments += `Page ${pageId}: ${page.comments}\n\n`;
                } else if (hasData) {
                    // Add a note if there's data but no comments
                    combinedComments += `Page ${pageId}: (No additional comments)\n\n`;
                }
            }
        });
        
        if (allData.length === 0) {
            const dataType = this.currentInputType === 'csv' ? 'CSV files' : 'images';
            alert(`No ${dataType} found across all pages.`);
            return;
        }
        
        // Ensure we have comments section even if empty
        const finalComments = combinedComments.trim() || 'No comments provided.';
        
        this.createExport(allData, allFormData, finalComments, 'All Pages Export');
    }
    
    createCsvExportCanvas(csvNumber) {
        const state = this.getCsvState(csvNumber);
        return this.createCsvExportCanvasFromState(state);
    }
    
    createCsvExportCanvasFromState(csvState) {
        // Create a high-resolution canvas for export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set very high resolution for better export quality
        const dpr = window.devicePixelRatio || 1;
        const baseWidth = 1200;
        const baseHeight = 900;
        const width = baseWidth * dpr;
        const height = baseHeight * dpr;
        
        exportCanvas.width = width;
        exportCanvas.height = height;
        
        // Scale for high DPI
        exportCtx.scale(dpr, dpr);
        
        const margin = { top: 60, right: 100, bottom: 120, left: 150 };
        
        // Enable highest quality rendering
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // Clear canvas
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, baseWidth, baseHeight);
        
        // Calculate plot area
        const plotWidth = baseWidth - margin.left - margin.right;
        const plotHeight = baseHeight - margin.top - margin.bottom;
        
        // Draw grid with crisp lines
        exportCtx.strokeStyle = '#e0e0e0';
        exportCtx.lineWidth = 1;
        
        // Vertical grid lines (frequency)
        for (let i = 0; i <= 10; i++) {
            const x = margin.left + (i / 10) * plotWidth;
            exportCtx.beginPath();
            exportCtx.moveTo(x + 0.5, margin.top);
            exportCtx.lineTo(x + 0.5, margin.top + plotHeight);
            exportCtx.stroke();
        }
        
        // Horizontal grid lines (amplitude)
        for (let i = 0; i <= 10; i++) {
            const y = margin.top + (i / 10) * plotHeight;
            exportCtx.beginPath();
            exportCtx.moveTo(margin.left, y + 0.5);
            exportCtx.lineTo(margin.left + plotWidth, y + 0.5);
            exportCtx.stroke();
        }
        
        // Draw axes with crisp lines
        exportCtx.strokeStyle = '#333333';
        exportCtx.lineWidth = 3;
        exportCtx.beginPath();
        // X-axis
        exportCtx.moveTo(margin.left, margin.top + plotHeight + 0.5);
        exportCtx.lineTo(margin.left + plotWidth, margin.top + plotHeight + 0.5);
        // Y-axis
        exportCtx.moveTo(margin.left + 0.5, margin.top);
        exportCtx.lineTo(margin.left + 0.5, margin.top + plotHeight);
        exportCtx.stroke();
        
        // Draw data line with high quality anti-aliasing
        exportCtx.strokeStyle = '#cc0000';
        exportCtx.lineWidth = 3;
        exportCtx.lineJoin = 'round';
        exportCtx.lineCap = 'round';
        exportCtx.beginPath();
        
        const freqRange = csvState.maxFreq - csvState.minFreq;
        const ampRange = csvState.maxAmp - csvState.minAmp;
        
        let firstPoint = true;
        for (let i = 0; i < csvState.frequencyData.length; i++) {
            const freq = csvState.frequencyData[i];
            const amp = csvState.amplitudeData[i];
            
            const x = margin.left + ((freq - csvState.minFreq) / freqRange) * plotWidth;
            const y = margin.top + plotHeight - ((amp - csvState.minAmp) / ampRange) * plotHeight;
            
            if (firstPoint) {
                exportCtx.moveTo(x, y);
                firstPoint = false;
            } else {
                exportCtx.lineTo(x, y);
            }
        }
        exportCtx.stroke();
        
        // Draw axis labels with crisp text
        exportCtx.fillStyle = '#333333';
        exportCtx.font = '20px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        
        // X-axis labels (frequency)
        for (let i = 0; i <= 5; i++) {
            const freq = csvState.minFreq + (freqRange * i / 5);
            const x = margin.left + (i / 5) * plotWidth;
            const freqMHz = freq / 1e6;
            exportCtx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 20);
        }
        
        // Y-axis labels (amplitude)
        exportCtx.textAlign = 'right';
        exportCtx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
            const amp = csvState.minAmp + (ampRange * i / 5);
            const y = margin.top + plotHeight - (i / 5) * plotHeight;
            exportCtx.fillText(amp.toFixed(1) + ' dB', margin.left - 20, y);
        }
        
        // Axis titles
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'bottom';
        exportCtx.font = 'bold 24px Arial';
        exportCtx.fillText('Frequency', margin.left + plotWidth / 2, baseHeight - 30);
        
        exportCtx.save();
        exportCtx.translate(35, margin.top + plotHeight / 2);
        exportCtx.rotate(-Math.PI / 2);
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.fillText('Amplitude (dB)', 0, 0);
        exportCtx.restore();
        
        // Add title
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        exportCtx.font = 'bold 28px Arial';
        exportCtx.fillText('Spectrum Analysis - High Resolution Export', margin.left + plotWidth / 2, 15);
        
        // Draw regulatory limit lines
        const freqStartMHz = csvState.minFreq / 1e6;
        const freqEndMHz = csvState.maxFreq / 1e6;
        this.drawLimitLines(exportCtx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, csvState.minAmp, csvState.maxAmp);
        
        return exportCanvas;
    }
    
    createExport(images, formDataArray, comments, exportType) {
        console.log('Starting export:', { exportType, images: images.length, formDataArray: formDataArray.length });
        console.log('Form data:', formDataArray[0]);
        
        try {
            const exportCanvas = document.createElement('canvas');
            const exportCtx = exportCanvas.getContext('2d');
            
            const margin = 40;
            const imagePadding = 30;
            const commentsWidth = 800;
        
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
        
        // Set table dimensions with larger text and comments section
        const tableWidth = Math.max(totalImageWidth, 1000);
        const titleHeight = 150;
        const headerHeight = 120;
        const dataHeight = 200;
        const tableHeight = titleHeight + headerHeight + dataHeight;
        
        exportCanvas.width = tableWidth + commentsWidth + (3 * margin);
        exportCanvas.height = tableHeight + maxImageHeight + (3 * margin);
        
        // Fill background
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Use first image's data for the table with safe defaults
        const primaryFormData = {
            runId: '-',
            band: '-',
            location: '-',
            testType: '',
            equipmentDescription: '',
            operatingCondition: '',
            traces: 'Top - maximum peak hold\nBottom - minimum peak hold',
            ...formDataArray[0] // Override with actual data
        };
        
        // Create title from run data - exactly like template
        const titleText = `Run ${primaryFormData.runId} ${primaryFormData.band}`;
        
        // Draw title section
        const titleY = margin;
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(margin, titleY, tableWidth, titleHeight);
        exportCtx.strokeStyle = 'black';
        exportCtx.lineWidth = 4;
        exportCtx.strokeRect(margin, titleY, tableWidth, titleHeight);
        
        exportCtx.fillStyle = 'black';
        exportCtx.font = 'bold 80px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.fillText(titleText, margin + tableWidth/2, titleY + titleHeight/2 + 30);
        
        // Define 4 columns (removing comment from table)
        const columnWidths = [
            tableWidth * 0.2,   // Run ID - 20%
            tableWidth * 0.15,  // Band - 15%
            tableWidth * 0.4,   // Description - 40%
            tableWidth * 0.25   // Traces - 25%
        ];
        
        const columnHeaders = ['Run ID', 'Band', 'Description', 'Traces'];
        
        // Draw table header section
        const headerY = titleY + titleHeight;
        const dataY = headerY + headerHeight;
        
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(margin, headerY, tableWidth, headerHeight + dataHeight);
        exportCtx.strokeRect(margin, headerY, tableWidth, headerHeight + dataHeight);
        
        // Draw column headers
        exportCtx.fillStyle = 'black';
        exportCtx.font = 'bold 70px Arial';
        exportCtx.textAlign = 'center';
        
        let currentX = margin;
        for (let i = 0; i < columnHeaders.length; i++) {
            // Draw vertical lines between columns
            if (i > 0) {
                exportCtx.beginPath();
                exportCtx.moveTo(currentX, headerY);
                exportCtx.lineTo(currentX, dataY + dataHeight);
                exportCtx.stroke();
            }
            
            // Draw header text
            exportCtx.fillText(columnHeaders[i], currentX + columnWidths[i]/2, headerY + headerHeight/2 + 25);
            currentX += columnWidths[i];
        }
        
        // Draw horizontal line between header and data
        exportCtx.beginPath();
        exportCtx.moveTo(margin, dataY);
        exportCtx.lineTo(margin + tableWidth, dataY);
        exportCtx.stroke();
        
        // Prepare all data content with safe defaults
        let description = '';
        if (primaryFormData.testType && primaryFormData.testType !== '-' && primaryFormData.testType !== '') {
            description += primaryFormData.testType;
        }
        if (primaryFormData.equipmentDescription && primaryFormData.equipmentDescription !== '-' && primaryFormData.equipmentDescription !== '') {
            if (description) description += ', ';
            description += primaryFormData.equipmentDescription;
        }
        if (primaryFormData.operatingCondition && primaryFormData.operatingCondition !== '-' && primaryFormData.operatingCondition !== '') {
            if (description) description += ', ';
            description += primaryFormData.operatingCondition;
        }
        
        // Use traces from form data with safe default
        const tracesText = primaryFormData.traces || 'Top - maximum peak hold\nBottom - minimum peak hold';
        
        const tableData = [
            primaryFormData.runId,
            primaryFormData.band,
            description || 'EMC test measurement',
            tracesText
        ];
        
        // Draw data cells
        exportCtx.fillStyle = 'black';
        exportCtx.font = '70px Arial';
        exportCtx.textAlign = 'center';
        
        currentX = margin;
        for (let i = 0; i < tableData.length; i++) {
            const cellY = dataY + dataHeight/2 + 25;
            
            if (i === 2 || i === 3) { // Description and Traces columns - use left align
                exportCtx.textAlign = 'left';
                this.wrapTextInCell(exportCtx, tableData[i], currentX + 15, cellY - 60, columnWidths[i] - 30, dataHeight - 40, 80);
            } else {
                exportCtx.textAlign = 'center';
                exportCtx.fillText(tableData[i], currentX + columnWidths[i]/2, cellY);
            }
            
            currentX += columnWidths[i];
        }
        
        // Draw comments section on the right side - connected to table
        const commentsX = margin + tableWidth;
        const commentsY = titleY;
        
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(commentsX, commentsY, commentsWidth, exportCanvas.height - commentsY - margin);
        exportCtx.strokeStyle = 'black';
        exportCtx.lineWidth = 4;
        exportCtx.strokeRect(commentsX, commentsY, commentsWidth, exportCanvas.height - commentsY - margin);
        
        // Comments header with large text
        exportCtx.fillStyle = 'black';
        exportCtx.font = 'bold 80px Arial';
        exportCtx.textAlign = 'left';
        exportCtx.fillText('Comment', commentsX + 30, commentsY + 90);
        
        // Comments content with large text
        exportCtx.fillStyle = 'black';
        exportCtx.font = '60px Arial';
        this.wrapText(exportCtx, comments, commentsX + 30, commentsY + 180, commentsWidth - 60, 70);
        
        // Draw images below the table
        let imageX = margin;
        const imageY = titleY + tableHeight + margin;
        
        images.forEach((image, index) => {
            exportCtx.drawImage(image, imageX, imageY);
            imageX += image.width + imagePadding;
        });
        
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
        
        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error.message}`);
        }
    }
    
    wrapTextInCell(ctx, text, x, y, maxWidth, maxHeight, lineHeight) {
        // Handle null, undefined, or non-string text
        if (!text || typeof text !== 'string') {
            text = '';
        }
        
        const words = text.split(' ');
        let line = '';
        let currentY = y + lineHeight;
        
        // Set font for measurements - large text
        ctx.font = '60px Arial';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                if (currentY < y + maxHeight) {
                    ctx.fillText(line, x, currentY);
                    line = words[n] + ' ';
                    currentY += lineHeight;
                } else {
                    break; // Stop if we exceed cell height
                }
            } else {
                line = testLine;
            }
        }
        
        if (currentY < y + maxHeight && line.trim()) {
            ctx.fillText(line, x, currentY);
        }
    }
    
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        // Ensure font is set for measurements
        ctx.font = '60px Arial';
        
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
    
    // =============================== LIMIT LINES FUNCTIONALITY ===============================
    
    setupLimitLinesListeners() {
        // Show/hide limit lines checkbox
        const showLimitLinesCheckbox = document.getElementById('showLimitLines');
        if (showLimitLinesCheckbox) {
            showLimitLinesCheckbox.addEventListener('change', (e) => {
                this.limitLines.enabled = e.target.checked;
                this.redrawAllCsvGraphs();
            });
        }
        
        // Distance selection dropdown
        const distanceSelect = document.getElementById('distanceSelect');
        if (distanceSelect) {
            distanceSelect.addEventListener('change', (e) => {
                this.limitLines.distance = e.target.value;
                this.switchToDistance(e.target.value);
            });
        }
        
        // Limit input fields
        document.querySelectorAll('.limit-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const band = e.target.dataset.band;
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && band) {
                    this.limitLines.limits[band] = value;
                    this.redrawAllCsvGraphs();
                }
            });
            
            // Also listen for input events for real-time updates
            input.addEventListener('input', (e) => {
                const band = e.target.dataset.band;
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && band) {
                    this.limitLines.limits[band] = value;
                    // Debounce the redraw for performance
                    clearTimeout(this.limitRedrawTimeout);
                    this.limitRedrawTimeout = setTimeout(() => {
                        this.redrawAllCsvGraphs();
                    }, 300);
                }
            });
        });
    }
    
    switchToDistance(distance) {
        // Switch between 50ft and 100ft limits
        if (distance === '100ft') {
            // Update current limits to 100ft values
            this.limitLines.limits = { ...this.limitLines.limits100ft };
        } else {
            // Update current limits to 50ft values (default)
            this.limitLines.limits = {
                'B0': 126,   // 10 kHz – 160 kHz (10 kHz, 150 kHz points)
                'B1': 126,   // 150 kHz – 650 kHz (150 kHz point)
                'B2': 115,   // 500 kHz – 3 MHz (1.6 MHz point)
                'B3': 100,   // 2.5 MHz – 7.5 MHz (3.2 MHz point)
                'B4': 85,    // 5 MHz – 30 MHz (interpolated)
                'B5': 81,    // 25 MHz – 325 MHz (200 MHz point)
                'B6': 96,    // 300 MHz – 1.3 GHz (1.0 GHz point)
                'B7': 96     // 1 GHz – 6 GHz (1.0 GHz, 6.0 GHz points)
            };
        }
        
        // Update input fields
        document.querySelectorAll('.limit-input').forEach(input => {
            const band = input.dataset.band;
            if (band && this.limitLines.limits[band] !== undefined) {
                input.value = this.limitLines.limits[band];
            }
        });
        
        // Redraw graphs
        this.redrawAllCsvGraphs();
        
        console.log(`Switched to NYCT ${distance} limits`);
    }
    
    resetLimitsToDefaults() {
        // Reset to NYCT default values based on current distance
        this.switchToDistance(this.limitLines.distance);
        
        console.log(`Limit lines reset to NYCT ${this.limitLines.distance} default values`);
    }
    
    redrawAllCsvGraphs() {
        // Only redraw if we're in CSV mode
        if (this.currentInputType !== 'csv') return;
        
        if (this.currentCsvMode === 'overlay') {
            // Redraw overlay graph
            this.drawOverlayGraph();
            
            // Redraw full screen overlay if active
            if (this.fullScreenOverlayState) {
                this.drawFullScreenOverlay();
            }
        } else {
            // Redraw separate graphs
            this.drawCsvGraph(1);
            this.drawCsvGraph(2);
            
            // Redraw full screen CSV if active
            if (this.fullScreenCsvState) {
                this.drawFullScreenCsv();
            }
        }
    }
    
    getLimitForFrequency(frequencyMHz) {
        // Find which band this frequency belongs to and return the limit
        for (const [band, bandInfo] of Object.entries(this.bandDefinitions)) {
            if (frequencyMHz >= bandInfo.startMHz && frequencyMHz <= bandInfo.endMHz) {
                return this.limitLines.limits[band];
            }
        }
        return null;
    }
    
    drawLimitLines(ctx, margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd) {
        if (!this.limitLines.enabled) return;
        
        const freqRange = freqEnd - freqStart;
        const ampRange = ampEnd - ampStart;
        
        // Store current drawing state
        ctx.save();
        
        // Draw limit lines for each band that intersects with the visible frequency range
        for (const [band, bandInfo] of Object.entries(this.bandDefinitions)) {
            const limitValue = this.limitLines.limits[band];
            if (limitValue === undefined) continue;
            
            // Convert band frequency range to MHz for comparison
            const bandStartMHz = bandInfo.startMHz;
            const bandEndMHz = bandInfo.endMHz;
            
            // Check if this band intersects with the visible frequency range
            if (bandEndMHz < freqStart || bandStartMHz > freqEnd) continue;
            
            // Check if the limit line is within the visible amplitude range
            if (limitValue < ampStart || limitValue > ampEnd) continue;
            
            // Calculate the frequency range where this limit applies (intersection of band and visible range)
            const limitStartFreq = Math.max(bandStartMHz, freqStart);
            const limitEndFreq = Math.min(bandEndMHz, freqEnd);
            
            // Convert to canvas coordinates
            const x1 = margin.left + ((limitStartFreq - freqStart) / freqRange) * plotWidth;
            const x2 = margin.left + ((limitEndFreq - freqStart) / freqRange) * plotWidth;
            const y = margin.top + plotHeight - ((limitValue - ampStart) / ampRange) * plotHeight;
            
            // Draw the limit line
            ctx.strokeStyle = '#ff0000'; // Red for regulatory limits
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]); // Dashed line pattern
            
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
            
            // Draw limit label
            const labelX = x1 + (x2 - x1) / 2;
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            
            // Add background for better readability
            const labelText = `${band} Limit (${this.limitLines.distance}): ${limitValue} dBμV/m/MHz`;
            const textMetrics = ctx.measureText(labelText);
            const textWidth = textMetrics.width;
            const textHeight = 14;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(labelX - textWidth/2 - 4, y - textHeight - 2, textWidth + 8, textHeight + 4);
            
            ctx.fillStyle = '#ff0000';
            ctx.fillText(labelText, labelX, y - 4);
        }
        
        // Restore drawing state
        ctx.restore();
    }
    
    // =============================== CSV FUNCTIONALITY ===============================
    
    setupCsvUploadListeners(csvNumber) {
        const uploadArea = document.getElementById(`csvUploadArea${csvNumber}`);
        const csvInput = document.getElementById(`csvInput${csvNumber}`);
        
        uploadArea.addEventListener('click', () => csvInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleCsvDragOver(e, csvNumber));
        uploadArea.addEventListener('drop', (e) => this.handleCsvDrop(e, csvNumber));
        uploadArea.addEventListener('dragleave', (e) => this.handleCsvDragLeave(e, csvNumber));
        
        csvInput.addEventListener('change', (e) => this.handleCsvFileSelect(e, csvNumber));
    }
    
    setupOverlayUploadListeners() {
        const uploadArea = document.getElementById('csvOverlayUploadArea');
        const csvInput = document.getElementById('csvOverlayInput');
        
        if (!uploadArea || !csvInput) return;
        
        uploadArea.addEventListener('click', () => csvInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleOverlayDragOver(e));
        uploadArea.addEventListener('drop', (e) => this.handleOverlayDrop(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleOverlayDragLeave(e));
        
        csvInput.addEventListener('change', (e) => this.handleOverlayFileSelect(e));
    }
    
    handleOverlayDragOver(e) {
        e.preventDefault();
        document.getElementById('csvOverlayUploadArea').classList.add('dragover');
    }
    
    handleOverlayDragLeave(e) {
        e.preventDefault();
        document.getElementById('csvOverlayUploadArea').classList.remove('dragover');
    }
    
    handleOverlayDrop(e) {
        e.preventDefault();
        document.getElementById('csvOverlayUploadArea').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.loadOverlayFiles(files);
        }
    }
    
    handleOverlayFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.loadOverlayFiles(files);
        }
    }
    
    loadOverlayFiles(files) {
        // Process each file
        Array.from(files).forEach((file, index) => {
            if (file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.type === 'text/csv') {
                this.loadOverlayCsvFile(file);
            }
        });
    }
    
    loadOverlayCsvFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target.result;
            this.parseOverlayCsvData(csvText, file.name);
        };
        reader.readAsText(file);
    }
    
    parseOverlayCsvData(csvText, filename) {
        const lines = csvText.split('\n').filter(line => line.trim());
        
        const frequencyData = [];
        const amplitudeData = [];
        
        // Try to parse CSV data - support common formats
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Skip header lines that contain text like "Frequency" or "Hz"
            if (i === 0 && (line.toLowerCase().includes('frequency') || line.toLowerCase().includes('hz'))) {
                continue;
            }
            
            // Split by comma, semicolon, or tab
            const values = line.split(/[,;\t]/).map(v => v.trim());
            
            if (values.length >= 2) {
                const freq = parseFloat(values[0]);
                const amp = parseFloat(values[1]);
                
                // Only add valid numeric data
                if (!isNaN(freq) && !isNaN(amp)) {
                    frequencyData.push(freq);
                    amplitudeData.push(amp);
                }
            }
        }
        
        if (frequencyData.length === 0) {
            alert(`No valid frequency/amplitude data found in ${filename}. Expected format: frequency, amplitude`);
            return;
        }
        
        // Add to overlay datasets
        const colorIndex = this.csvOverlayState.datasets.length % this.csvColors.length;
        const newDataset = {
            id: Date.now() + Math.random(), // Unique ID
            name: filename,
            frequencyData: frequencyData,
            amplitudeData: amplitudeData,
            color: this.csvColors[colorIndex],
            visible: true,
            rowCount: frequencyData.length,
            minFreq: Math.min(...frequencyData),
            maxFreq: Math.max(...frequencyData),
            minAmp: Math.min(...amplitudeData),
            maxAmp: Math.max(...amplitudeData)
        };
        
        this.csvOverlayState.datasets.push(newDataset);
        
        // Parse filename for form data if it's the first file
        if (this.csvOverlayState.datasets.length === 1) {
            this.parseFilename(filename, 1);
        }
        
        // Calculate combined ranges
        this.calculateOverlayRanges();
        
        // Update display
        this.setupOverlayCanvas();
        this.drawOverlayGraph();
        this.updateLegend();
        this.updateOverlayFileList();
        
        // Hide instruction overlay
        document.getElementById('csvOverlayInstructionOverlay').style.display = 'none';
        
        // Update dynamic UI after loading overlay data
        this.updateTables();
        
        console.log(`Overlay CSV loaded: ${filename}`, {
            rows: newDataset.rowCount,
            freqRange: `${this.formatFrequency(newDataset.minFreq / 1e6)} - ${this.formatFrequency(newDataset.maxFreq / 1e6)}`,
            ampRange: `${newDataset.minAmp.toFixed(1)} - ${newDataset.maxAmp.toFixed(1)} dB`
        });
    }
    
    updateOverlayFileList() {
        const fileList = document.getElementById('overlayFileList');
        const csvOverlayFiles = document.getElementById('csvOverlayFiles');
        
        if (!fileList || !csvOverlayFiles) return;
        
        fileList.innerHTML = '';
        
        if (this.csvOverlayState.datasets.length === 0) {
            csvOverlayFiles.style.display = 'none';
            return;
        }
        
        csvOverlayFiles.style.display = 'block';
        
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-color" style="background-color: ${dataset.color}"></div>
                    <span class="file-name">${dataset.name}</span>
                    <span class="file-details">${dataset.rowCount.toLocaleString()} points | ${this.formatFrequency(dataset.minFreq / 1e6)} - ${this.formatFrequency(dataset.maxFreq / 1e6)}</span>
                </div>
                <button class="file-remove" onclick="figureExportTool.removeOverlayFile('${dataset.id}')">Remove</button>
            `;
            fileList.appendChild(fileItem);
        });
    }
    
    removeOverlayFile(datasetId) {
        // Remove dataset from array
        this.csvOverlayState.datasets = this.csvOverlayState.datasets.filter(dataset => dataset.id != datasetId);
        
        // Recalculate ranges
        this.calculateOverlayRanges();
        
        // Update display
        this.drawOverlayGraph();
        this.updateLegend();
        this.updateOverlayFileList();
        
        // Show instruction overlay if no files left
        if (this.csvOverlayState.datasets.length === 0) {
            document.getElementById('csvOverlayInstructionOverlay').style.display = 'block';
        }
        
        // Update dynamic UI after removing data
        this.updateTables();
        
        console.log(`Removed overlay file: ${datasetId}`);
    }
    
    setupCsvCanvasListeners(csvNumber) {
        const canvas = document.getElementById(`csvGraphCanvas${csvNumber}`);
        
        canvas.addEventListener('mousedown', (e) => this.handleCsvMouseDown(e, csvNumber));
        canvas.addEventListener('mousemove', (e) => this.handleCsvMouseMove(e, csvNumber));
        canvas.addEventListener('mouseup', (e) => this.handleCsvMouseUp(e, csvNumber));
        canvas.addEventListener('wheel', (e) => this.handleCsvWheel(e, csvNumber));
        canvas.addEventListener('click', (e) => this.handleCsvClick(e, csvNumber));
    }
    
    getCsvState(csvNumber) {
        const currentPage = this.getCurrentPage();
        return csvNumber === 1 ? currentPage.csvState1 : currentPage.csvState2;
    }
    
    getCsvCanvas(csvNumber) {
        return document.getElementById(`csvGraphCanvas${csvNumber}`);
    }
    
    getCsvContext(csvNumber) {
        return this.getCsvCanvas(csvNumber).getContext('2d');
    }
    
    handleCsvDragOver(e, csvNumber) {
        e.preventDefault();
        document.getElementById(`csvUploadArea${csvNumber}`).classList.add('dragover');
    }
    
    handleCsvDragLeave(e, csvNumber) {
        e.preventDefault();
        document.getElementById(`csvUploadArea${csvNumber}`).classList.remove('dragover');
    }
    
    handleCsvDrop(e, csvNumber) {
        e.preventDefault();
        document.getElementById(`csvUploadArea${csvNumber}`).classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.type === 'text/csv') {
                this.loadCsvFile(file, csvNumber);
            }
        }
    }
    
    handleCsvFileSelect(e, csvNumber) {
        const file = e.target.files[0];
        if (file) {
            this.loadCsvFile(file, csvNumber);
        }
    }
    
    loadCsvFile(file, csvNumber) {
        const state = this.getCsvState(csvNumber);
        state.originalFilename = file.name;
        
        // Parse filename and auto-fill the corresponding form fields
        this.parseFilename(file.name, csvNumber);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target.result;
            this.parseCsvData(csvText, csvNumber);
        };
        reader.readAsText(file);
    }
    
    parseCsvData(csvText, csvNumber) {
        const state = this.getCsvState(csvNumber);
        const lines = csvText.split('\n').filter(line => line.trim());
        
        const frequencyData = [];
        const amplitudeData = [];
        
        // Try to parse CSV data - support common formats
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Skip header lines that contain text like "Frequency" or "Hz"
            if (i === 0 && (line.toLowerCase().includes('frequency') || line.toLowerCase().includes('hz'))) {
                continue;
            }
            
            // Split by comma, semicolon, or tab
            const values = line.split(/[,;\t]/).map(v => v.trim());
            
            if (values.length >= 2) {
                const freq = parseFloat(values[0]);
                const amp = parseFloat(values[1]);
                
                // Only add valid numeric data
                if (!isNaN(freq) && !isNaN(amp)) {
                    frequencyData.push(freq);
                    amplitudeData.push(amp);
                }
            }
        }
        
        if (frequencyData.length === 0) {
            alert('No valid frequency/amplitude data found in CSV file. Expected format: frequency, amplitude');
            return;
        }
        
        // Store parsed data
        state.frequencyData = frequencyData;
        state.amplitudeData = amplitudeData;
        state.rowCount = frequencyData.length;
        
        // Calculate min/max values
        state.minFreq = Math.min(...frequencyData);
        state.maxFreq = Math.max(...frequencyData);
        state.minAmp = Math.min(...amplitudeData);
        state.maxAmp = Math.max(...amplitudeData);
        
        // Reset zoom and pan
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        
        // Update CSV info display
        this.updateCsvInfo(csvNumber);
        
        // Setup and draw graph
        this.setupCsvCanvas(csvNumber);
        this.drawCsvGraph(csvNumber);
        
        // Hide instruction overlay
        document.getElementById(`csvInstructionOverlay${csvNumber}`).style.display = 'none';
        
        // If in overlay mode, update the overlay display
        if (this.currentCsvMode === 'overlay') {
            this.updateOverlayDatasets();
            this.setupOverlayCanvas();
            this.drawOverlayGraph();
            this.updateLegend();
        }
        
        // Update dynamic UI after loading data
        this.updateTables();
        
        console.log(`CSV ${csvNumber} loaded:`, {
            rows: state.rowCount,
            freqRange: `${this.formatFrequency(state.minFreq / 1e6)} - ${this.formatFrequency(state.maxFreq / 1e6)}`,
            ampRange: `${state.minAmp.toFixed(1)} - ${state.maxAmp.toFixed(1)} dB`
        });
    }
    
    updateCsvInfo(csvNumber) {
        const state = this.getCsvState(csvNumber);
        const csvInfo = document.getElementById(`csvInfo${csvNumber}`);
        
        if (state.rowCount > 0) {
            csvInfo.style.display = 'block';
            csvInfo.querySelector('.csv-rows').textContent = state.rowCount.toLocaleString();
            csvInfo.querySelector('.csv-freq-range').textContent = 
                `${this.formatFrequency(state.minFreq / 1e6)} - ${this.formatFrequency(state.maxFreq / 1e6)}`;
        } else {
            csvInfo.style.display = 'none';
        }
    }
    
    setupCsvCanvas(csvNumber) {
        const state = this.getCsvState(csvNumber);
        const canvas = this.getCsvCanvas(csvNumber);
        
        if (!state || !state.frequencyData.length) return;
        
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth - 20;
        const containerHeight = container.clientHeight - 60; // Account for header
        
        // Use device pixel ratio for very high resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        // Scale context for high DPI
        const ctx = this.getCsvContext(csvNumber);
        ctx.scale(dpr, dpr);
        
        this.drawCsvGraph(csvNumber);
        this.addCsvControls(csvNumber);
    }
    
    drawCsvGraph(csvNumber) {
        const state = this.getCsvState(csvNumber);
        const canvas = this.getCsvCanvas(csvNumber);
        const ctx = this.getCsvContext(csvNumber);
        
        if (!state || !state.frequencyData.length) return;
        
        // Use logical pixel dimensions for calculations
        const width = canvas.style.width ? parseInt(canvas.style.width) : canvas.width;
        const height = canvas.style.height ? parseInt(canvas.style.height) : canvas.height;
        const margin = { top: 20, right: 40, bottom: 60, left: 80 };
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate plot area
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Apply zoom and pan
        const scaledMargin = {
            left: margin.left + state.offsetX,
            top: margin.top + state.offsetY
        };
        
        // Calculate data ranges with zoom and pan
        const freqRange = (state.maxFreq - state.minFreq) / state.scale;
        const ampRange = (state.maxAmp - state.minAmp) / state.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (state.minFreq + state.maxFreq) / 2 - (state.offsetX / plotWidth) * freqRange;
        const ampCenter = (state.minAmp + state.maxAmp) / 2 + (state.offsetY / plotHeight) * ampRange;
        
        const freqStart = freqCenter - freqRange / 2;
        const freqEnd = freqCenter + freqRange / 2;
        const ampStart = ampCenter - ampRange / 2;
        const ampEnd = ampCenter + ampRange / 2;
        
        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw enhanced grid that aligns with axis labels
        
        // Calculate grid parameters to match axis labels
        const gridMaxLabels = Math.floor(plotWidth / 100);
        const gridMinLabels = 4;
        const gridNumLabels = Math.max(gridMinLabels, Math.min(gridMaxLabels, Math.floor(state.scale * 4) + 4));
        const gridMaxAmpLabels = Math.floor(plotHeight / 40);
        const gridNumAmpLabels = Math.max(gridMinLabels, Math.min(gridMaxAmpLabels, Math.floor(state.scale * 3) + 4));
        
        // Draw minor grid lines (finer subdivisions)
        ctx.strokeStyle = '#f5f5f5';
        ctx.lineWidth = 0.5;
        
        // Minor vertical grid lines (frequency) - 5x subdivision
        for (let i = 0; i <= gridNumLabels * 5; i++) {
            const x = margin.left + (i / (gridNumLabels * 5)) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Minor horizontal grid lines (amplitude) - 5x subdivision
        for (let i = 0; i <= gridNumAmpLabels * 5; i++) {
            const y = margin.top + (i / (gridNumAmpLabels * 5)) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw major grid lines (align with axis labels)
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;
        
        // Major vertical grid lines (frequency) - align with axis labels
        for (let i = 0; i <= gridNumLabels; i++) {
            const x = margin.left + (i / gridNumLabels) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Major horizontal grid lines (amplitude) - align with axis labels
        for (let i = 0; i <= gridNumAmpLabels; i++) {
            const y = margin.top + (i / gridNumAmpLabels) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw axes with crisp lines
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // X-axis
        ctx.moveTo(scaledMargin.left, scaledMargin.top + plotHeight + 0.5);
        ctx.lineTo(scaledMargin.left + plotWidth, scaledMargin.top + plotHeight + 0.5);
        // Y-axis
        ctx.moveTo(scaledMargin.left + 0.5, scaledMargin.top);
        ctx.lineTo(scaledMargin.left + 0.5, scaledMargin.top + plotHeight);
        ctx.stroke();
        
        // Draw data line with anti-aliasing
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        let firstPoint = true;
        for (let i = 0; i < state.frequencyData.length; i++) {
            const freq = state.frequencyData[i];
            const amp = state.amplitudeData[i];
            
            // Skip points outside current zoom range
            if (freq < freqStart || freq > freqEnd) continue;
            
            const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
            const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw enhanced axis labels showing actual visible range
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Calculate optimal number of labels based on zoom and available space
        const maxLabels = Math.floor(plotWidth / 100); // At least 100px between labels for readability
        const minLabels = 4;
        const numLabels = Math.max(minLabels, Math.min(maxLabels, Math.floor(state.scale * 4) + 4));
        
        // X-axis labels (frequency) - show actual visible range
        for (let i = 0; i <= numLabels; i++) {
            const freq = freqStart + (freqRange * i / numLabels);
            const x = margin.left + (i / numLabels) * plotWidth; // Use fixed margin, not scaled
            const freqMHz = freq / 1e6;
            
            ctx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 10);
        }
        
        // Y-axis labels (amplitude) - show actual visible range
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const maxAmpLabels = Math.floor(plotHeight / 40); // At least 40px between labels
        const numAmpLabels = Math.max(minLabels, Math.min(maxAmpLabels, Math.floor(state.scale * 3) + 4));
        
        for (let i = 0; i <= numAmpLabels; i++) {
            const amp = ampStart + (ampRange * i / numAmpLabels);
            const y = margin.top + plotHeight - (i / numAmpLabels) * plotHeight; // Use fixed margin
            
            ctx.fillText(amp.toFixed(1) + ' dB', margin.left - 15, y);
        }
        
        // Axis titles with fixed positioning
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Frequency', margin.left + plotWidth / 2, height - 5);
        
        ctx.save();
        ctx.translate(15, margin.top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Amplitude (dB)', 0, 0);
        ctx.restore();
        
        // Draw data points for peak identification with zoom-adaptive size
        ctx.fillStyle = '#cc0000';
        const pointSize = Math.min(3, Math.max(1, state.scale * 1.5));
        
        for (let i = 0; i < state.frequencyData.length; i++) {
            const freq = state.frequencyData[i];
            const amp = state.amplitudeData[i];
            
            if (freq < freqStart || freq > freqEnd) continue;
            
            const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
            const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Draw regulatory limit lines
        const freqStartMHz = freqStart / 1e6;
        const freqEndMHz = freqEnd / 1e6;
        this.drawLimitLines(ctx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, ampStart, ampEnd);
    }
    
    handleCsvMouseDown(e, csvNumber) {
        const state = this.getCsvState(csvNumber);
        const rect = this.getCsvCanvas(csvNumber).getBoundingClientRect();
        
        state.isDragging = true;
        state.lastX = e.clientX - rect.left;
        state.lastY = e.clientY - rect.top;
        
        this.getCsvCanvas(csvNumber).style.cursor = 'grabbing';
    }
    
    handleCsvMouseMove(e, csvNumber) {
        const state = this.getCsvState(csvNumber);
        const canvas = this.getCsvCanvas(csvNumber);
        
        if (state.isDragging) {
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            const deltaX = currentX - state.lastX;
            const deltaY = currentY - state.lastY;
            
            // Normal sensitivity for panning
            state.offsetX += deltaX;
            state.offsetY += deltaY;
            
            state.lastX = currentX;
            state.lastY = currentY;
            
            this.drawCsvGraph(csvNumber);
        }
    }
    
    handleCsvMouseUp(e, csvNumber) {
        const state = this.getCsvState(csvNumber);
        state.isDragging = false;
        this.getCsvCanvas(csvNumber).style.cursor = 'crosshair';
    }
    
    handleCsvWheel(e, csvNumber) {
        e.preventDefault();
        const state = this.getCsvState(csvNumber);
        
        // Normal zoom sensitivity for control
        const zoomSensitivity = 0.1;
        const zoomFactor = e.deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);
        state.scale *= zoomFactor;
        
        // Limit zoom range
        state.scale = Math.max(0.1, Math.min(state.scale, 10));
        
        this.drawCsvGraph(csvNumber);
    }
    
    handleCsvClick(e, csvNumber) {
        const state = this.getCsvState(csvNumber);
        const canvas = this.getCsvCanvas(csvNumber);
        const rect = canvas.getBoundingClientRect();
        
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Use logical pixel dimensions for calculations
        const width = canvas.style.width ? parseInt(canvas.style.width) : canvas.width;
        const height = canvas.style.height ? parseInt(canvas.style.height) : canvas.height;
        
        // Convert click coordinates to frequency/amplitude values
        const margin = { top: 20, right: 40, bottom: 60, left: 80 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + state.offsetX,
            top: margin.top + state.offsetY
        };
        
        // Check if click is within plot area
        if (clickX < scaledMargin.left || clickX > scaledMargin.left + plotWidth ||
            clickY < scaledMargin.top || clickY > scaledMargin.top + plotHeight) {
            return;
        }
        
        // Calculate clicked frequency and amplitude
        const freqRange = (state.maxFreq - state.minFreq) / state.scale;
        const ampRange = (state.maxAmp - state.minAmp) / state.scale;
        
        const freqStart = state.minFreq + (state.maxFreq - state.minFreq) * 0.5 * (1 - 1/state.scale);
        const ampStart = state.minAmp + (state.maxAmp - state.minAmp) * 0.5 * (1 - 1/state.scale);
        
        const clickedFreq = freqStart + ((clickX - scaledMargin.left) / plotWidth) * freqRange;
        const clickedAmp = ampStart + ((scaledMargin.top + plotHeight - clickY) / plotHeight) * ampRange;
        
        // Find closest data point
        let closestIndex = 0;
        let minDistance = Infinity;
        
        for (let i = 0; i < state.frequencyData.length; i++) {
            const freq = state.frequencyData[i];
            const amp = state.amplitudeData[i];
            
            const freqNorm = (freq - freqStart) / freqRange;
            const ampNorm = (amp - ampStart) / ampRange;
            const clickFreqNorm = (clickedFreq - freqStart) / freqRange;
            const clickAmpNorm = (clickedAmp - ampStart) / ampRange;
            
            const distance = Math.sqrt(
                Math.pow(freqNorm - clickFreqNorm, 2) + 
                Math.pow(ampNorm - clickAmpNorm, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        
        // Get the closest peak data
        const peakFreq = state.frequencyData[closestIndex];
        const peakAmp = state.amplitudeData[closestIndex];
        const peakFreqMHz = peakFreq / 1e6; // Convert to MHz
        
        // Identify the frequency allocation for this peak (without adding to comments)
        this.identifyPeakForFrequencyNoComment(peakFreqMHz, peakAmp, csvNumber);
        
        // Visual feedback - draw a marker on the selected point
        this.drawPeakMarker(csvNumber, closestIndex);
    }
    
    drawPeakMarker(csvNumber, dataIndex) {
        const state = this.getCsvState(csvNumber);
        const canvas = this.getCsvCanvas(csvNumber);
        const ctx = this.getCsvContext(csvNumber);
        
        const freq = state.frequencyData[dataIndex];
        const amp = state.amplitudeData[dataIndex];
        
        const margin = { top: 20, right: 40, bottom: 60, left: 80 };
        const plotWidth = canvas.width - margin.left - margin.right;
        const plotHeight = canvas.height - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + state.offsetX,
            top: margin.top + state.offsetY
        };
        
        const freqRange = (state.maxFreq - state.minFreq) / state.scale;
        const ampRange = (state.maxAmp - state.minAmp) / state.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (state.minFreq + state.maxFreq) / 2 - (state.offsetX / plotWidth) * freqRange;
        const ampCenter = (state.minAmp + state.maxAmp) / 2 + (state.offsetY / plotHeight) * ampRange;
        
        const freqStart = freqCenter - freqRange / 2;
        const ampStart = ampCenter - ampRange / 2;
        
        const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
        const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
        
        // Redraw graph first
        this.drawCsvGraph(csvNumber);
        
        // Draw marker
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ff6600';
        
        // Draw circle marker
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw crosshairs
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.stroke();
    }
    
    identifyPeakForFrequencyNoComment(frequencyMHz, amplitude, csvNumber) {
        // Find the appropriate band for this frequency
        let detectedBand = null;
        for (const [band, bandInfo] of Object.entries(this.bandDefinitions)) {
            if (frequencyMHz >= bandInfo.startMHz && frequencyMHz <= bandInfo.endMHz) {
                detectedBand = band;
                break;
            }
        }
        
        if (detectedBand) {
            // Auto-select the band and show allocations (but don't add to comments)
            this.autoSelectBandButton(detectedBand);
            
            console.log(`CSV ${csvNumber} Peak identified:`, {
                frequency: this.formatFrequency(frequencyMHz),
                amplitude: amplitude.toFixed(1) + ' dB',
                band: detectedBand
            });
        } else {
            console.log(`CSV ${csvNumber} Peak at ${this.formatFrequency(frequencyMHz)} is outside defined bands`);
        }
    }
    
    resetZoomCsv(csvNumber) {
        const state = this.getCsvState(csvNumber);
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        this.drawCsvGraph(csvNumber);
    }
    
    addCsvControls(csvNumber) {
        // Remove existing controls if any
        const existingControls = document.querySelector(`#csvControls${csvNumber}`);
        if (existingControls) {
            existingControls.remove();
        }
        
        const canvas = this.getCsvCanvas(csvNumber);
        const state = this.getCsvState(csvNumber);
        
        if (!state || !state.frequencyData.length) return;
        
        // Create CSV controls
        const controls = document.createElement('div');
        controls.className = 'csv-controls';
        controls.id = `csvControls${csvNumber}`;
        controls.innerHTML = `
            <div class="zoom-controls">
                <button class="control-btn" id="csvZoomOut${csvNumber}">−</button>
                <span class="zoom-level" id="csvZoomLevel${csvNumber}">${Math.round(state.scale * 100)}%</span>
                <button class="control-btn" id="csvZoomIn${csvNumber}">+</button>
                <button class="control-btn" id="csvResetZoom${csvNumber}">Reset</button>
                <button class="control-btn" id="csvAutoScale${csvNumber}">Auto</button>
                <button class="control-btn" id="csvFullScreen${csvNumber}" title="Full Screen">⛶ Full Screen</button>
            </div>
            <div class="peak-detection-controls">
                <button class="control-btn peak-detect-btn" id="csvAutoPeaks${csvNumber}" title="Automatically detect peaks">🔍 Auto Detect Peaks</button>
                <button class="control-btn" id="csvPeakSettings${csvNumber}" title="Peak detection settings">⚙️</button>
            </div>
            <div class="peak-settings-panel" id="csvPeakSettings${csvNumber}Panel" style="display: none;">
                <div class="setting-group">
                    <label>Sensitivity:</label>
                    <select id="csvPeakSensitivity${csvNumber}">
                        <option value="low">Low (Major peaks only)</option>
                        <option value="medium" selected>Medium (Balanced)</option>
                        <option value="high">High (More sensitive)</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="setting-group" id="csvCustomSettings${csvNumber}" style="display: none;">
                    <label>Min Height (dB):</label>
                    <input type="number" id="csvMinHeight${csvNumber}" value="10" step="1">
                    <label>Min Distance (%):</label>
                    <input type="number" id="csvMinDistance${csvNumber}" value="2" step="0.5" min="0.1" max="10">
                </div>
                <div class="setting-group">
                    <label>Frequency Range:</label>
                    <select id="csvFreqRange${csvNumber}">
                        <option value="full">Full spectrum</option>
                        <option value="current">Current view only</option>
                        <option value="band">Current band only</option>
                    </select>
                </div>
            </div>
        `;
        
        canvas.parentElement.appendChild(controls);
        
        // Add event listeners
        document.getElementById(`csvZoomIn${csvNumber}`).addEventListener('click', () => {
            const state = this.getCsvState(csvNumber);
            state.scale = Math.min(state.scale * 1.2, 10);
            this.drawCsvGraph(csvNumber);
            this.updateCsvZoomDisplay(csvNumber);
        });
        
        document.getElementById(`csvZoomOut${csvNumber}`).addEventListener('click', () => {
            const state = this.getCsvState(csvNumber);
            state.scale = Math.max(state.scale / 1.2, 0.1);
            this.drawCsvGraph(csvNumber);
            this.updateCsvZoomDisplay(csvNumber);
        });
        
        document.getElementById(`csvResetZoom${csvNumber}`).addEventListener('click', () => {
            this.resetZoomCsv(csvNumber);
            this.updateCsvZoomDisplay(csvNumber);
        });
        
        document.getElementById(`csvAutoScale${csvNumber}`).addEventListener('click', () => {
            this.autoScaleCsv(csvNumber);
            this.updateCsvZoomDisplay(csvNumber);
        });
        
        document.getElementById(`csvFullScreen${csvNumber}`).addEventListener('click', () => {
            this.enterFullScreenCsv(csvNumber);
        });
        
        // Peak detection controls
        document.getElementById(`csvAutoPeaks${csvNumber}`).addEventListener('click', () => {
            this.autoDetectPeaks(csvNumber);
        });
        
        document.getElementById(`csvPeakSettings${csvNumber}`).addEventListener('click', () => {
            const panel = document.getElementById(`csvPeakSettings${csvNumber}Panel`);
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        document.getElementById(`csvPeakSensitivity${csvNumber}`).addEventListener('change', (e) => {
            const customSettings = document.getElementById(`csvCustomSettings${csvNumber}`);
            customSettings.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
        
        // Update zoom display
        this.updateCsvZoomDisplay(csvNumber);
    }
    
    updateCsvZoomDisplay(csvNumber) {
        const zoomDisplay = document.getElementById(`csvZoomLevel${csvNumber}`);
        const state = this.getCsvState(csvNumber);
        if (zoomDisplay && state) {
            zoomDisplay.textContent = `${Math.round(state.scale * 100)}%`;
        }
    }
    
    autoDetectPeaks(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state || !state.frequencyData.length) {
            alert('No CSV data loaded for automatic peak detection.');
            return;
        }
        
        // Get detection settings
        const sensitivity = document.getElementById(`csvPeakSensitivity${csvNumber}`)?.value || 'medium';
        const freqRange = document.getElementById(`csvFreqRange${csvNumber}`)?.value || 'full';
        
        // Configure detection parameters based on sensitivity
        let minHeightDb, minDistancePercent;
        
        switch (sensitivity) {
            case 'low':
                minHeightDb = 15;
                minDistancePercent = 5;
                break;
            case 'medium':
                minHeightDb = 10;
                minDistancePercent = 2;
                break;
            case 'high':
                minHeightDb = 5;
                minDistancePercent = 1;
                break;
            case 'custom':
                minHeightDb = parseFloat(document.getElementById(`csvMinHeight${csvNumber}`)?.value) || 10;
                minDistancePercent = parseFloat(document.getElementById(`csvMinDistance${csvNumber}`)?.value) || 2;
                break;
            default:
                minHeightDb = 10;
                minDistancePercent = 2;
        }
        
        // Determine frequency range for detection
        let startFreq, endFreq;
        switch (freqRange) {
            case 'current':
                // Use currently visible range based on zoom/pan
                const freqRangeView = (state.maxFreq - state.minFreq) / state.scale;
                const freqCenter = (state.minFreq + state.maxFreq) / 2;
                startFreq = freqCenter - freqRangeView / 2;
                endFreq = freqCenter + freqRangeView / 2;
                break;
            case 'band':
                // Use current selected band range
                const selectedBand = document.querySelector('.band-btn.selected')?.dataset.band;
                if (selectedBand && this.bandDefinitions[selectedBand]) {
                    startFreq = this.bandDefinitions[selectedBand].startMHz * 1e6; // Convert to Hz
                    endFreq = this.bandDefinitions[selectedBand].endMHz * 1e6;
                } else {
                    startFreq = state.minFreq;
                    endFreq = state.maxFreq;
                }
                break;
            default: // 'full'
                startFreq = state.minFreq;
                endFreq = state.maxFreq;
        }
        
        // Find peaks in the specified range
        const peaks = this.findPeaksInData(state.frequencyData, state.amplitudeData, {
            startFreq,
            endFreq,
            minHeightDb,
            minDistancePercent
        });
        
        if (peaks.length === 0) {
            alert(`No significant peaks found with current settings.\n\nTry adjusting sensitivity or frequency range in the settings panel.`);
            return;
        }
        
        // Display results and auto-identify peaks
        this.displayAutoDetectedPeaks(csvNumber, peaks);
        
        console.log(`Auto-detected ${peaks.length} peaks in CSV ${csvNumber}:`, peaks);
    }
    
    findPeaksInData(frequencyData, amplitudeData, options) {
        const { startFreq, endFreq, minHeightDb, minDistancePercent } = options;
        const peaks = [];
        
        // Calculate minimum distance in data points
        const totalFreqRange = Math.max(...frequencyData) - Math.min(...frequencyData);
        const minDistanceHz = totalFreqRange * (minDistancePercent / 100);
        
        // Calculate noise floor (average of bottom 25% of amplitudes)
        const sortedAmps = amplitudeData.slice().sort((a, b) => a - b);
        const noiseFloor = sortedAmps.slice(0, Math.floor(sortedAmps.length * 0.25))
            .reduce((sum, amp) => sum + amp, 0) / Math.floor(sortedAmps.length * 0.25);
        
        const minAbsoluteHeight = noiseFloor + minHeightDb;
        
        // Find local maxima
        for (let i = 1; i < amplitudeData.length - 1; i++) {
            const freq = frequencyData[i];
            const amp = amplitudeData[i];
            
            // Skip if outside frequency range
            if (freq < startFreq || freq > endFreq) continue;
            
            // Check if it's a local maximum
            const prevAmp = amplitudeData[i - 1];
            const nextAmp = amplitudeData[i + 1];
            
            if (amp > prevAmp && amp > nextAmp && amp >= minAbsoluteHeight) {
                // Check minimum distance from existing peaks
                const tooClose = peaks.some(peak => 
                    Math.abs(peak.frequency - freq) < minDistanceHz
                );
                
                if (!tooClose) {
                    // Calculate prominence (height above surrounding local minima)
                    const prominence = this.calculateProminence(amplitudeData, i);
                    
                    peaks.push({
                        index: i,
                        frequency: freq,
                        amplitude: amp,
                        prominence: prominence,
                        frequencyMHz: freq / 1e6
                    });
                }
            }
        }
        
        // Sort peaks by amplitude (highest first)
        peaks.sort((a, b) => b.amplitude - a.amplitude);
        
        // Limit to top 20 peaks to avoid overwhelming the user
        return peaks.slice(0, 20);
    }
    
    calculateProminence(amplitudeData, peakIndex) {
        const peakAmp = amplitudeData[peakIndex];
        
        // Find lowest point to the left
        let leftMin = peakAmp;
        for (let i = peakIndex - 1; i >= 0; i--) {
            leftMin = Math.min(leftMin, amplitudeData[i]);
            // Stop if we encounter a higher peak
            if (amplitudeData[i] > peakAmp) break;
        }
        
        // Find lowest point to the right
        let rightMin = peakAmp;
        for (let i = peakIndex + 1; i < amplitudeData.length; i++) {
            rightMin = Math.min(rightMin, amplitudeData[i]);
            // Stop if we encounter a higher peak
            if (amplitudeData[i] > peakAmp) break;
        }
        
        // Prominence is height above the higher of the two surrounding minima
        return peakAmp - Math.max(leftMin, rightMin);
    }
    
    displayAutoDetectedPeaks(csvNumber, peaks) {
        if (peaks.length === 0) return;
        
        // Clear previous peak markers
        this.drawCsvGraph(csvNumber);
        
        // Create results summary
        let resultsText = `🔍 AUTO-DETECTED ${peaks.length} PEAKS:\n\n`;
        
        peaks.forEach((peak, index) => {
            // Draw visual marker for each peak
            this.drawPeakMarker(csvNumber, peak.index);
            
            // Identify the peak allocation
            this.identifyPeakForFrequencyNoComment(peak.frequencyMHz, peak.amplitude, csvNumber);
            
            // Add to results summary
            resultsText += `${index + 1}. ${this.formatFrequency(peak.frequencyMHz)} @ ${peak.amplitude.toFixed(1)} dB\n`;
            
            // Find band for this frequency
            let bandName = 'Unknown';
            for (const [band, bandInfo] of Object.entries(this.bandDefinitions)) {
                if (peak.frequencyMHz >= bandInfo.startMHz && peak.frequencyMHz <= bandInfo.endMHz) {
                    bandName = `Band ${band} (${bandInfo.range})`;
                    break;
                }
            }
            resultsText += `   ${bandName}\n`;
            resultsText += `   Prominence: ${peak.prominence.toFixed(1)} dB\n\n`;
        });
        
        // Add to comments section
        resultsText += `\nDetection completed at ${new Date().toLocaleTimeString()}\n`;
        resultsText += `Settings: ${document.getElementById(`csvPeakSensitivity${csvNumber}`)?.value || 'medium'} sensitivity\n`;
        resultsText += `Range: ${document.getElementById(`csvFreqRange${csvNumber}`)?.value || 'full'} spectrum\n`;
        resultsText += `========================================\n\n`;
        
        this.addToComments(resultsText);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'peak-detection-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">Auto-detected ${peaks.length} peaks successfully!</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    autoScaleCsv(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state.frequencyData.length) return;
        
        // Find data with significant amplitude (above noise floor)
        const amplitudes = state.amplitudeData.slice();
        amplitudes.sort((a, b) => b - a);
        const significantAmp = amplitudes[Math.floor(amplitudes.length * 0.1)]; // Top 10%
        
        let minFreq = Infinity, maxFreq = -Infinity;
        let minAmp = Infinity, maxAmp = -Infinity;
        
        for (let i = 0; i < state.frequencyData.length; i++) {
            if (state.amplitudeData[i] >= significantAmp - 20) { // Within 20dB of significant signals
                minFreq = Math.min(minFreq, state.frequencyData[i]);
                maxFreq = Math.max(maxFreq, state.frequencyData[i]);
                minAmp = Math.min(minAmp, state.amplitudeData[i]);
                maxAmp = Math.max(maxAmp, state.amplitudeData[i]);
            }
        }
        
        if (minFreq === Infinity) {
            // Fallback to full range
            this.resetZoomCsv(csvNumber);
            return;
        }
        
        // Calculate zoom to fit significant data
        const freqRangeTarget = maxFreq - minFreq;
        const freqRangeFull = state.maxFreq - state.minFreq;
        
        if (freqRangeTarget > 0 && freqRangeTarget < freqRangeFull) {
            state.scale = freqRangeFull / freqRangeTarget;
            
            // Center on the significant data
            const freqCenter = (minFreq + maxFreq) / 2;
            const fullCenter = (state.minFreq + state.maxFreq) / 2;
            const freqOffset = freqCenter - fullCenter;
            
            // This is a simplified offset calculation
            state.offsetX = 0;
            state.offsetY = 0;
        }
        
        this.drawCsvGraph(csvNumber);
    }
    
    // =============================== CSV OVERLAY FUNCTIONALITY ===============================
    
    updateOverlayDatasets() {
        // In the new system, datasets are managed directly in csvOverlayState.datasets
        // This method is primarily for transitioning from separate mode to overlay mode
        
        if (this.csvOverlayState.datasets.length > 0) {
            // Already have overlay datasets, just recalculate ranges
            this.calculateOverlayRanges();
            return;
        }
        
        // If switching from separate mode, try to convert existing data
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        // Add dataset 1 if loaded in separate mode
        if (currentPage.csvState1.frequencyData.length > 0) {
            const dataset1 = {
                id: 'converted_1_' + Date.now(),
                name: currentPage.csvState1.originalFilename || 'CSV File 1',
                frequencyData: currentPage.csvState1.frequencyData,
                amplitudeData: currentPage.csvState1.amplitudeData,
                color: this.csvColors[0],
                visible: true,
                rowCount: currentPage.csvState1.rowCount,
                minFreq: currentPage.csvState1.minFreq,
                maxFreq: currentPage.csvState1.maxFreq,
                minAmp: currentPage.csvState1.minAmp,
                maxAmp: currentPage.csvState1.maxAmp
            };
            this.csvOverlayState.datasets.push(dataset1);
        }
        
        // Add dataset 2 if loaded in separate mode
        if (currentPage.csvState2.frequencyData.length > 0) {
            const dataset2 = {
                id: 'converted_2_' + Date.now(),
                name: currentPage.csvState2.originalFilename || 'CSV File 2',
                frequencyData: currentPage.csvState2.frequencyData,
                amplitudeData: currentPage.csvState2.amplitudeData,
                color: this.csvColors[1],
                visible: true,
                rowCount: currentPage.csvState2.rowCount,
                minFreq: currentPage.csvState2.minFreq,
                maxFreq: currentPage.csvState2.maxFreq,
                minAmp: currentPage.csvState2.minAmp,
                maxAmp: currentPage.csvState2.maxAmp
            };
            this.csvOverlayState.datasets.push(dataset2);
        }
        
        // Calculate combined min/max values
        this.calculateOverlayRanges();
    }
    
    calculateOverlayRanges() {
        if (this.csvOverlayState.datasets.length === 0) return;
        
        let minFreq = Infinity, maxFreq = -Infinity;
        let minAmp = Infinity, maxAmp = -Infinity;
        
        this.csvOverlayState.datasets.forEach(dataset => {
            if (!dataset.visible) return;
            
            dataset.frequencyData.forEach((freq, i) => {
                const amp = dataset.amplitudeData[i];
                minFreq = Math.min(minFreq, freq);
                maxFreq = Math.max(maxFreq, freq);
                minAmp = Math.min(minAmp, amp);
                maxAmp = Math.max(maxAmp, amp);
            });
        });
        
        this.csvOverlayState.minFreq = minFreq;
        this.csvOverlayState.maxFreq = maxFreq;
        this.csvOverlayState.minAmp = minAmp;
        this.csvOverlayState.maxAmp = maxAmp;
    }
    
    setupOverlayCanvasListeners() {
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        
        canvas.addEventListener('mousedown', (e) => this.handleOverlayMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleOverlayMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleOverlayMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.handleOverlayWheel(e));
        canvas.addEventListener('click', (e) => this.handleOverlayClick(e));
    }
    
    setupOverlayCanvas() {
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth - 30;
        const containerHeight = container.clientHeight - 100; // Account for header and legend
        
        // Use device pixel ratio for very high resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        // Scale context for high DPI
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Overlay controls removed - cleaner interface
    }
    
    drawOverlayGraph() {
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        // Use logical pixel dimensions for calculations
        const width = canvas.style.width ? parseInt(canvas.style.width) : canvas.width;
        const height = canvas.style.height ? parseInt(canvas.style.height) : canvas.height;
        // Increase bottom margin to make space for legend outside graph area
        const margin = { top: 20, right: 40, bottom: this.csvOverlayState.datasets.length > 0 ? 100 : 60, left: 80 };
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        if (this.csvOverlayState.datasets.length === 0) {
            // Show instruction message
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Upload CSV files to see overlay comparison', width / 2, height / 2);
            document.getElementById('csvOverlayInstructionOverlay').style.display = 'block';
            return;
        }
        
        document.getElementById('csvOverlayInstructionOverlay').style.display = 'none';
        
        // Calculate plot area
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Apply zoom and pan
        const scaledMargin = {
            left: margin.left + this.csvOverlayState.offsetX,
            top: margin.top + this.csvOverlayState.offsetY
        };
        
        // Calculate data ranges with zoom and pan
        const freqRange = (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) / this.csvOverlayState.scale;
        const ampRange = (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) / this.csvOverlayState.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (this.csvOverlayState.minFreq + this.csvOverlayState.maxFreq) / 2 - (this.csvOverlayState.offsetX / plotWidth) * freqRange;
        const ampCenter = (this.csvOverlayState.minAmp + this.csvOverlayState.maxAmp) / 2 + (this.csvOverlayState.offsetY / plotHeight) * ampRange;
        
        const freqStart = freqCenter - freqRange / 2;
        const freqEnd = freqCenter + freqRange / 2;
        const ampStart = ampCenter - ampRange / 2;
        const ampEnd = ampCenter + ampRange / 2;
        
        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw enhanced grid that aligns with axis labels
        
        // Calculate grid parameters to match axis labels
        const overlayGridMaxLabels = Math.floor(plotWidth / 100);
        const overlayGridMinLabels = 4;
        const overlayGridNumLabels = Math.max(overlayGridMinLabels, Math.min(overlayGridMaxLabels, Math.floor(this.csvOverlayState.scale * 3) + 4));
        const overlayGridMaxAmpLabels = Math.floor(plotHeight / 40);
        const overlayGridNumAmpLabels = Math.max(overlayGridMinLabels, Math.min(overlayGridMaxAmpLabels, Math.floor(this.csvOverlayState.scale * 3) + 4));
        
        // Draw minor grid lines (finer subdivisions)
        ctx.strokeStyle = '#f5f5f5';
        ctx.lineWidth = 0.5;
        
        // Minor vertical grid lines (frequency) - 5x subdivision
        for (let i = 0; i <= overlayGridNumLabels * 5; i++) {
            const x = margin.left + (i / (overlayGridNumLabels * 5)) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Minor horizontal grid lines (amplitude) - 5x subdivision
        for (let i = 0; i <= overlayGridNumAmpLabels * 5; i++) {
            const y = margin.top + (i / (overlayGridNumAmpLabels * 5)) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw major grid lines (align with axis labels)
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;
        
        // Major vertical grid lines (frequency) - align with axis labels
        for (let i = 0; i <= overlayGridNumLabels; i++) {
            const x = margin.left + (i / overlayGridNumLabels) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Major horizontal grid lines (amplitude) - align with axis labels
        for (let i = 0; i <= overlayGridNumAmpLabels; i++) {
            const y = margin.top + (i / overlayGridNumAmpLabels) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw axes with crisp lines
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // X-axis
        ctx.moveTo(scaledMargin.left, scaledMargin.top + plotHeight + 0.5);
        ctx.lineTo(scaledMargin.left + plotWidth, scaledMargin.top + plotHeight + 0.5);
        // Y-axis
        ctx.moveTo(scaledMargin.left + 0.5, scaledMargin.top);
        ctx.lineTo(scaledMargin.left + 0.5, scaledMargin.top + plotHeight);
        ctx.stroke();
        
        // Draw each dataset with high quality
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            if (!dataset.visible) return;
            
            // Draw data line with anti-aliasing
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            let firstPoint = true;
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                // Skip points outside current zoom range
                if (freq < freqStart || freq > freqEnd) continue;
                
                const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
                const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
                
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            // Draw data points for peak identification
            ctx.fillStyle = dataset.color;
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                if (freq < freqStart || freq > freqEnd) continue;
                
                const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
                const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
        
        // Draw axis labels showing actual visible range
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Calculate optimal number of labels based on zoom
        const maxLabels = Math.floor(plotWidth / 100);
        const minLabels = 4;
        const numLabels = Math.max(minLabels, Math.min(maxLabels, Math.floor(this.csvOverlayState.scale * 3) + 4));
        
        // X-axis labels (frequency) - show actual visible range
        for (let i = 0; i <= numLabels; i++) {
            const freq = freqStart + (freqRange * i / numLabels);
            const x = margin.left + (i / numLabels) * plotWidth; // Use fixed margin
            const freqMHz = freq / 1e6;
            ctx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 10);
        }
        
        // Y-axis labels (amplitude) - show actual visible range
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const maxAmpLabels = Math.floor(plotHeight / 40);
        const numAmpLabels = Math.max(minLabels, Math.min(maxAmpLabels, Math.floor(this.csvOverlayState.scale * 3) + 4));
        
        for (let i = 0; i <= numAmpLabels; i++) {
            const amp = ampStart + (ampRange * i / numAmpLabels);
            const y = margin.top + plotHeight - (i / numAmpLabels) * plotHeight; // Use fixed margin
            ctx.fillText(amp.toFixed(1) + ' dB', margin.left - 15, y);
        }
        
        // Axis titles with fixed positioning
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Frequency', margin.left + plotWidth / 2, margin.top + plotHeight + 40);
        
        ctx.save();
        ctx.translate(15, margin.top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Amplitude (dB)', 0, 0);
        ctx.restore();
        
        // Draw regulatory limit lines
        const freqStartMHz = freqStart / 1e6;
        const freqEndMHz = freqEnd / 1e6;
        this.drawLimitLines(ctx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, ampStart, ampEnd);
        
        // Draw legend outside graph area if datasets exist
        if (this.csvOverlayState.datasets.length > 0) {
            this.drawOverlayLegendOutside(ctx, width, height, margin);
        }
    }
    
    updateLegend() {
        const legendItems = document.getElementById('legendItems');
        const csvLegend = document.getElementById('csvLegend');
        
        if (!legendItems || !csvLegend) return;
        
        // Hide HTML legend since we're now drawing it directly on canvas outside graph area
        csvLegend.style.display = 'none';
    }
    
    handleOverlayMouseDown(e) {
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        this.csvOverlayState.isDragging = true;
        this.csvOverlayState.lastX = e.clientX - rect.left;
        this.csvOverlayState.lastY = e.clientY - rect.top;
        
        canvas.style.cursor = 'grabbing';
    }
    
    handleOverlayMouseMove(e) {
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        if (this.csvOverlayState.isDragging) {
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            const deltaX = currentX - this.csvOverlayState.lastX;
            const deltaY = currentY - this.csvOverlayState.lastY;
            
            // Reduced sensitivity for smoother control
            const panSensitivity = 0.6;
            this.csvOverlayState.offsetX += deltaX * panSensitivity;
            this.csvOverlayState.offsetY += deltaY * panSensitivity;
            
            this.csvOverlayState.lastX = currentX;
            this.csvOverlayState.lastY = currentY;
            
            this.drawOverlayGraph();
        }
    }
    
    handleOverlayMouseUp(e) {
        this.csvOverlayState.isDragging = false;
        document.getElementById('csvOverlayCanvas').style.cursor = 'crosshair';
    }
    
    handleOverlayWheel(e) {
        e.preventDefault();
        
        // Normal zoom sensitivity for control
        const zoomSensitivity = 0.1;
        const zoomFactor = e.deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);
        this.csvOverlayState.scale *= zoomFactor;
        
        // Limit zoom range
        this.csvOverlayState.scale = Math.max(0.1, Math.min(this.csvOverlayState.scale, 10));
        
        this.drawOverlayGraph();
    }
    
    handleOverlayClick(e) {
        const canvas = document.getElementById('csvOverlayCanvas');
        const rect = canvas.getBoundingClientRect();
        
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Use logical pixel dimensions for calculations
        const width = canvas.style.width ? parseInt(canvas.style.width) : canvas.width;
        const height = canvas.style.height ? parseInt(canvas.style.height) : canvas.height;
        
        // Convert click coordinates to frequency/amplitude values
        const margin = { top: 20, right: 40, bottom: 60, left: 80 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + this.csvOverlayState.offsetX,
            top: margin.top + this.csvOverlayState.offsetY
        };
        
        // Check if click is within plot area
        if (clickX < scaledMargin.left || clickX > scaledMargin.left + plotWidth ||
            clickY < scaledMargin.top || clickY > scaledMargin.top + plotHeight) {
            return;
        }
        
        // Calculate clicked frequency and amplitude
        const freqRange = (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) / this.csvOverlayState.scale;
        const ampRange = (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) / this.csvOverlayState.scale;
        
        const freqStart = this.csvOverlayState.minFreq + (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) * 0.5 * (1 - 1/this.csvOverlayState.scale);
        const ampStart = this.csvOverlayState.minAmp + (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) * 0.5 * (1 - 1/this.csvOverlayState.scale);
        
        const clickedFreq = freqStart + ((clickX - scaledMargin.left) / plotWidth) * freqRange;
        const clickedAmp = ampStart + ((scaledMargin.top + plotHeight - clickY) / plotHeight) * ampRange;
        
        // Find closest data point across all datasets
        let closestDataset = null;
        let closestIndex = 0;
        let minDistance = Infinity;
        
        this.csvOverlayState.datasets.forEach((dataset, datasetIndex) => {
            if (!dataset.visible) return;
            
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                const freqNorm = (freq - freqStart) / freqRange;
                const ampNorm = (amp - ampStart) / ampRange;
                const clickFreqNorm = (clickedFreq - freqStart) / freqRange;
                const clickAmpNorm = (clickedAmp - ampStart) / ampRange;
                
                const distance = Math.sqrt(
                    Math.pow(freqNorm - clickFreqNorm, 2) + 
                    Math.pow(ampNorm - clickAmpNorm, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDataset = dataset;
                    closestIndex = i;
                }
            }
        });
        
        if (closestDataset) {
            // Get the closest peak data
            const peakFreq = closestDataset.frequencyData[closestIndex];
            const peakAmp = closestDataset.amplitudeData[closestIndex];
            const peakFreqMHz = peakFreq / 1e6; // Convert to MHz
            
            // Identify the frequency allocation for this peak (without adding to comments)
            this.identifyOverlayPeakForFrequencyNoComment(peakFreqMHz, peakAmp, closestDataset);
            
            // Visual feedback - draw a marker on the selected point
            this.drawOverlayPeakMarker(closestDataset, closestIndex);
        }
    }
    
    drawOverlayPeakMarker(dataset, dataIndex) {
        const canvas = document.getElementById('csvOverlayCanvas');
        const ctx = canvas.getContext('2d');
        
        const freq = dataset.frequencyData[dataIndex];
        const amp = dataset.amplitudeData[dataIndex];
        
        const margin = { top: 20, right: 40, bottom: 60, left: 80 };
        const plotWidth = canvas.width - margin.left - margin.right;
        const plotHeight = canvas.height - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + this.csvOverlayState.offsetX,
            top: margin.top + this.csvOverlayState.offsetY
        };
        
        const freqRange = (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) / this.csvOverlayState.scale;
        const ampRange = (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) / this.csvOverlayState.scale;
        const freqStart = this.csvOverlayState.minFreq + (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) * 0.5 * (1 - 1/this.csvOverlayState.scale);
        const ampStart = this.csvOverlayState.minAmp + (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) * 0.5 * (1 - 1/this.csvOverlayState.scale);
        
        const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
        const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
        
        // Redraw graph first
        this.drawOverlayGraph();
        
        // Draw marker
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ff6600';
        
        // Draw circle marker
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw crosshairs
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.stroke();
    }
    
    resetZoomOverlay() {
        this.csvOverlayState.scale = 1;
        this.csvOverlayState.offsetX = 0;
        this.csvOverlayState.offsetY = 0;
        this.drawOverlayGraph();
    }
    
    autoScaleOverlay() {
        if (this.csvOverlayState.datasets.length === 0) return;
        
        // Find data with significant amplitude across all datasets
        const allAmplitudes = [];
        this.csvOverlayState.datasets.forEach(dataset => {
            if (dataset.visible) {
                allAmplitudes.push(...dataset.amplitudeData);
            }
        });
        
        if (allAmplitudes.length === 0) return;
        
        allAmplitudes.sort((a, b) => b - a);
        const significantAmp = allAmplitudes[Math.floor(allAmplitudes.length * 0.1)]; // Top 10%
        
        let minFreq = Infinity, maxFreq = -Infinity;
        
        this.csvOverlayState.datasets.forEach(dataset => {
            if (!dataset.visible) return;
            
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                if (dataset.amplitudeData[i] >= significantAmp - 20) { // Within 20dB of significant signals
                    minFreq = Math.min(minFreq, dataset.frequencyData[i]);
                    maxFreq = Math.max(maxFreq, dataset.frequencyData[i]);
                }
            }
        });
        
        if (minFreq === Infinity) {
            // Fallback to full range
            this.resetZoomOverlay();
            return;
        }
        
        // Calculate zoom to fit significant data
        const freqRangeTarget = maxFreq - minFreq;
        const freqRangeFull = this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq;
        
        if (freqRangeTarget > 0 && freqRangeTarget < freqRangeFull) {
            this.csvOverlayState.scale = freqRangeFull / freqRangeTarget;
            
            // This is a simplified offset calculation
            this.csvOverlayState.offsetX = 0;
            this.csvOverlayState.offsetY = 0;
        }
        
        this.drawOverlayGraph();
    }
    
    toggleLegend() {
        // Legend is now permanently drawn outside the graph area
        // This function is kept for compatibility but does nothing
        console.log('Legend is now permanently displayed outside the graph area');
    }
    
    addOverlayControls() {
        // Remove existing controls if any
        const existingControls = document.querySelector('#csvOverlayControls');
        if (existingControls) {
            existingControls.remove();
        }
        
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        
        // Create overlay controls
        const controls = document.createElement('div');
        controls.className = 'csv-controls';
        controls.id = 'csvOverlayControls';
        controls.innerHTML = `
            <div class="zoom-controls">
                <button class="control-btn" id="overlayZoomOut">−</button>
                <span class="zoom-level" id="overlayZoomLevel">${Math.round(this.csvOverlayState.scale * 100)}%</span>
                <button class="control-btn" id="overlayZoomIn">+</button>
                <button class="control-btn" id="overlayResetZoom">Reset</button>
                <button class="control-btn" id="overlayFullScreen" title="Full Screen">⛶ Full Screen</button>
            </div>
            <div class="peak-detection-controls">
                <button class="control-btn peak-detect-btn" id="overlayAutoPeaks" title="Automatically detect peaks in all datasets">🔍 Auto Detect Peaks (All)</button>
                <button class="control-btn" id="overlayPeakSettings" title="Peak detection settings">⚙️</button>
            </div>
            <div class="peak-settings-panel" id="overlayPeakSettingsPanel" style="display: none;">
                <div class="setting-group">
                    <label>Sensitivity:</label>
                    <select id="overlayPeakSensitivity">
                        <option value="low">Low (Major peaks only)</option>
                        <option value="medium" selected>Medium (Balanced)</option>
                        <option value="high">High (More sensitive)</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="setting-group" id="overlayCustomSettings" style="display: none;">
                    <label>Min Height (dB):</label>
                    <input type="number" id="overlayMinHeight" value="10" step="1">
                    <label>Min Distance (%):</label>
                    <input type="number" id="overlayMinDistance" value="2" step="0.5" min="0.1" max="10">
                </div>
                <div class="setting-group">
                    <label>Frequency Range:</label>
                    <select id="overlayFreqRange">
                        <option value="full">Full spectrum</option>
                        <option value="current">Current view only</option>
                        <option value="band">Current band only</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label>Dataset Selection:</label>
                    <select id="overlayDatasetSelection">
                        <option value="all">All datasets</option>
                        <option value="visible">Visible datasets only</option>
                        <option value="highest">Highest amplitude dataset</option>
                    </select>
                </div>
            </div>
        `;
        
        canvas.parentElement.appendChild(controls);
        
        // Add event listeners
        document.getElementById('overlayZoomIn').addEventListener('click', () => {
            this.csvOverlayState.scale = Math.min(this.csvOverlayState.scale * 1.2, 10);
            this.drawOverlayGraph();
            this.updateOverlayZoomDisplay();
        });
        
        document.getElementById('overlayZoomOut').addEventListener('click', () => {
            this.csvOverlayState.scale = Math.max(this.csvOverlayState.scale / 1.2, 0.1);
            this.drawOverlayGraph();
            this.updateOverlayZoomDisplay();
        });
        
        document.getElementById('overlayResetZoom').addEventListener('click', () => {
            this.resetZoomOverlay();
            this.updateOverlayZoomDisplay();
        });
        
        document.getElementById('overlayFullScreen').addEventListener('click', () => {
            this.enterFullScreenOverlay();
        });
        
        // Peak detection controls for overlay
        document.getElementById('overlayAutoPeaks').addEventListener('click', () => {
            this.autoDetectOverlayPeaks();
        });
        
        document.getElementById('overlayPeakSettings').addEventListener('click', () => {
            const panel = document.getElementById('overlayPeakSettingsPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        document.getElementById('overlayPeakSensitivity').addEventListener('change', (e) => {
            const customSettings = document.getElementById('overlayCustomSettings');
            customSettings.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
        
        // Update zoom display
        this.updateOverlayZoomDisplay();
    }
    
    updateOverlayZoomDisplay() {
        const zoomDisplay = document.getElementById('overlayZoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.csvOverlayState.scale * 100)}%`;
        }
    }
    
    autoDetectOverlayPeaks() {
        if (this.csvOverlayState.datasets.length === 0) {
            alert('No CSV datasets loaded for automatic peak detection.');
            return;
        }
        
        // Get detection settings
        const sensitivity = document.getElementById('overlayPeakSensitivity')?.value || 'medium';
        const freqRange = document.getElementById('overlayFreqRange')?.value || 'full';
        const datasetSelection = document.getElementById('overlayDatasetSelection')?.value || 'all';
        
        // Configure detection parameters based on sensitivity
        let minHeightDb, minDistancePercent;
        
        switch (sensitivity) {
            case 'low':
                minHeightDb = 15;
                minDistancePercent = 5;
                break;
            case 'medium':
                minHeightDb = 10;
                minDistancePercent = 2;
                break;
            case 'high':
                minHeightDb = 5;
                minDistancePercent = 1;
                break;
            case 'custom':
                minHeightDb = parseFloat(document.getElementById('overlayMinHeight')?.value) || 10;
                minDistancePercent = parseFloat(document.getElementById('overlayMinDistance')?.value) || 2;
                break;
            default:
                minHeightDb = 10;
                minDistancePercent = 2;
        }
        
        // Determine frequency range for detection
        let startFreq, endFreq;
        switch (freqRange) {
            case 'current':
                // Use currently visible range based on zoom/pan
                const freqRangeView = (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) / this.csvOverlayState.scale;
                const freqCenter = (this.csvOverlayState.minFreq + this.csvOverlayState.maxFreq) / 2;
                startFreq = freqCenter - freqRangeView / 2;
                endFreq = freqCenter + freqRangeView / 2;
                break;
            case 'band':
                // Use current selected band range
                const selectedBand = document.querySelector('.band-btn.selected')?.dataset.band;
                if (selectedBand && this.bandDefinitions[selectedBand]) {
                    startFreq = this.bandDefinitions[selectedBand].startMHz * 1e6; // Convert to Hz
                    endFreq = this.bandDefinitions[selectedBand].endMHz * 1e6;
                } else {
                    startFreq = this.csvOverlayState.minFreq;
                    endFreq = this.csvOverlayState.maxFreq;
                }
                break;
            default: // 'full'
                startFreq = this.csvOverlayState.minFreq;
                endFreq = this.csvOverlayState.maxFreq;
        }
        
        // Select datasets to analyze
        let datasetsToAnalyze = [];
        switch (datasetSelection) {
            case 'visible':
                datasetsToAnalyze = this.csvOverlayState.datasets.filter(dataset => dataset.visible);
                break;
            case 'highest':
                // Find dataset with highest overall amplitude
                let highestDataset = null;
                let maxAmp = -Infinity;
                this.csvOverlayState.datasets.forEach(dataset => {
                    if (dataset.visible && dataset.maxAmp > maxAmp) {
                        maxAmp = dataset.maxAmp;
                        highestDataset = dataset;
                    }
                });
                if (highestDataset) datasetsToAnalyze = [highestDataset];
                break;
            default: // 'all'
                datasetsToAnalyze = this.csvOverlayState.datasets.slice();
        }
        
        if (datasetsToAnalyze.length === 0) {
            alert('No datasets available for analysis with current selection settings.');
            return;
        }
        
        // Find peaks in all selected datasets
        let allPeaks = [];
        datasetsToAnalyze.forEach(dataset => {
            const peaks = this.findPeaksInData(dataset.frequencyData, dataset.amplitudeData, {
                startFreq,
                endFreq,
                minHeightDb,
                minDistancePercent
            });
            
            peaks.forEach(peak => {
                peak.dataset = dataset;
                peak.datasetName = dataset.name;
                peak.datasetColor = dataset.color;
            });
            
            allPeaks = allPeaks.concat(peaks);
        });
        
        if (allPeaks.length === 0) {
            alert(`No significant peaks found with current settings.\n\nTry adjusting sensitivity or frequency range in the settings panel.`);
            return;
        }
        
        // Sort all peaks by amplitude (highest first)
        allPeaks.sort((a, b) => b.amplitude - a.amplitude);
        
        // Limit to top 30 peaks across all datasets
        allPeaks = allPeaks.slice(0, 30);
        
        // Display results and auto-identify peaks
        this.displayAutoDetectedOverlayPeaks(allPeaks);
        
        console.log(`Auto-detected ${allPeaks.length} peaks across ${datasetsToAnalyze.length} datasets:`, allPeaks);
    }
    
    displayAutoDetectedOverlayPeaks(peaks) {
        if (peaks.length === 0) return;
        
        // Clear previous peak markers and redraw graph
        this.drawOverlayGraph();
        
        // Create results summary
        let resultsText = `🔍 AUTO-DETECTED ${peaks.length} PEAKS ACROSS ALL DATASETS:\n\n`;
        
        // Group peaks by dataset
        const peaksByDataset = {};
        peaks.forEach(peak => {
            if (!peaksByDataset[peak.datasetName]) {
                peaksByDataset[peak.datasetName] = [];
            }
            peaksByDataset[peak.datasetName].push(peak);
        });
        
        // Display peaks grouped by dataset
        Object.keys(peaksByDataset).forEach((datasetName, datasetIndex) => {
            const datasetPeaks = peaksByDataset[datasetName];
            resultsText += `📊 ${datasetName} (${datasetPeaks.length} peaks):\n`;
            
            datasetPeaks.forEach((peak, index) => {
                // Draw visual marker for each peak
                this.drawOverlayPeakMarker(peak.dataset, peak.index);
                
                // Identify the peak allocation
                this.identifyOverlayPeakForFrequencyNoComment(peak.frequencyMHz, peak.amplitude, peak.dataset);
                
                // Add to results summary
                resultsText += `  ${index + 1}. ${this.formatFrequency(peak.frequencyMHz)} @ ${peak.amplitude.toFixed(1)} dB\n`;
                
                // Find band for this frequency
                let bandName = 'Unknown';
                for (const [band, bandInfo] of Object.entries(this.bandDefinitions)) {
                    if (peak.frequencyMHz >= bandInfo.startMHz && peak.frequencyMHz <= bandInfo.endMHz) {
                        bandName = `Band ${band} (${bandInfo.range})`;
                        break;
                    }
                }
                resultsText += `     ${bandName}\n`;
                resultsText += `     Prominence: ${peak.prominence.toFixed(1)} dB\n\n`;
            });
            resultsText += '\n';
        });
        
        // Add summary statistics
        resultsText += `\nSUMMARY:\n`;
        resultsText += `Total peaks detected: ${peaks.length}\n`;
        resultsText += `Datasets analyzed: ${Object.keys(peaksByDataset).length}\n`;
        resultsText += `Detection completed at ${new Date().toLocaleTimeString()}\n`;
        resultsText += `Settings: ${document.getElementById('overlayPeakSensitivity')?.value || 'medium'} sensitivity\n`;
        resultsText += `Range: ${document.getElementById('overlayFreqRange')?.value || 'full'} spectrum\n`;
        resultsText += `Dataset selection: ${document.getElementById('overlayDatasetSelection')?.value || 'all'}\n`;
        resultsText += `========================================\n\n`;
        
        this.addToComments(resultsText);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'peak-detection-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">Auto-detected ${peaks.length} peaks across ${Object.keys(peaksByDataset).length} datasets!</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    drawOverlayLegendOutside(ctx, width, height, margin) {
        if (this.csvOverlayState.datasets.length === 0) return;
        
        // Position legend in the bottom margin area, outside the graph
        const legendX = margin.left + (width - margin.left - margin.right) / 2;
        const legendY = margin.top + (height - margin.top - margin.bottom) + 65; // In the margin area
        
        // Calculate legend dimensions
        const itemWidth = 120;
        const maxItemsPerRow = Math.floor((width - margin.left - margin.right) / itemWidth);
        const itemsPerRow = Math.min(this.csvOverlayState.datasets.length, maxItemsPerRow);
        
        // Draw legend items horizontally centered
        const totalItemWidth = itemsPerRow * itemWidth;
        const startX = legendX - totalItemWidth / 2;
        
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const itemX = startX + col * itemWidth;
            const itemY = legendY + row * 20;
            
            // Draw color line
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(itemX, itemY);
            ctx.lineTo(itemX + 20, itemY);
            ctx.stroke();
            
            // Draw dataset name
            ctx.fillStyle = '#333';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            // Truncate long names
            let displayName = dataset.name;
            if (displayName.length > 12) {
                displayName = displayName.substring(0, 9) + '...';
            }
            
            ctx.fillText(displayName, itemX + 25, itemY);
        });
    }
    
    drawFullScreenLegend(ctx, width, height, margin) {
        if (this.csvOverlayState.datasets.length === 0) return;
        
        // Position legend at the bottom center
        const legendX = width / 2;
        const legendY = height - 50;
        
        // Calculate legend dimensions
        const itemWidth = 150;
        const itemHeight = 25;
        const totalWidth = Math.min(this.csvOverlayState.datasets.length * itemWidth, width - 40);
        const legendWidth = totalWidth + 20;
        const legendHeight = itemHeight + 20;
        
        // Draw legend background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(legendX - legendWidth/2, legendY - legendHeight/2, legendWidth, legendHeight);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(legendX - legendWidth/2, legendY - legendHeight/2, legendWidth, legendHeight);
        
        // Draw legend items horizontally centered
        const startX = legendX - (this.csvOverlayState.datasets.length * itemWidth) / 2;
        
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            const itemX = startX + index * itemWidth;
            const itemY = legendY;
            
            // Draw color line
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(itemX, itemY);
            ctx.lineTo(itemX + 20, itemY);
            ctx.stroke();
            
            // Draw dataset name
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            // Truncate long names
            let displayName = dataset.name;
            if (displayName.length > 15) {
                displayName = displayName.substring(0, 12) + '...';
            }
            
            ctx.fillText(displayName, itemX + 25, itemY);
        });
    }

    handleImageDoubleClick(e, imageNumber) {
        // Enter full screen on double click
        this.enterFullScreen(imageNumber);
    }

    enterFullScreen(imageNumber) {
        const state = this.getImageState(imageNumber);
        if (!state || !state.image) return;

        // Create full screen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <div class="fullscreen-container">
                <canvas id="fullscreenCanvas${imageNumber}"></canvas>
                <div class="fullscreen-controls">
                    <button class="control-btn" onclick="figureExportTool.zoomInFullscreen(${imageNumber})">+</button>
                    <button class="control-btn" onclick="figureExportTool.zoomOutFullscreen(${imageNumber})">−</button>
                    <button class="control-btn" onclick="figureExportTool.resetZoomFullscreen(${imageNumber})">Reset</button>
                    <button class="control-btn" onclick="figureExportTool.exitFullScreen()">Exit</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup full screen canvas with high resolution
        const fsCanvas = document.getElementById(`fullscreenCanvas${imageNumber}`);
        const fsCtx = fsCanvas.getContext('2d');
        
        // Use high resolution for full screen
        const displayWidth = window.innerWidth - 100;
        const displayHeight = window.innerHeight - 100;
        const dpr = window.devicePixelRatio || 1;
        
        fsCanvas.width = displayWidth * dpr;
        fsCanvas.height = displayHeight * dpr;
        fsCanvas.style.width = displayWidth + 'px';
        fsCanvas.style.height = displayHeight + 'px';
        
        // Scale for high DPI
        fsCtx.scale(dpr, dpr);
        
        // Store full screen state
        this.fullScreenState = {
            imageNumber: imageNumber,
            canvas: fsCanvas,
            ctx: fsCtx,
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            displayWidth: displayWidth,
            displayHeight: displayHeight
        };
        
        this.drawFullScreenImage();
        this.setupFullScreenListeners();
    }

    drawFullScreenImage() {
        if (!this.fullScreenState) return;
        
        const state = this.getImageState(this.fullScreenState.imageNumber);
        const fsState = this.fullScreenState;
        const ctx = fsState.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, fsState.displayWidth, fsState.displayHeight);
        
        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Calculate image dimensions to fit screen while maintaining aspect ratio
        const imageAspect = state.image.width / state.image.height;
        const screenAspect = fsState.displayWidth / fsState.displayHeight;
        
        let drawWidth, drawHeight;
        if (imageAspect > screenAspect) {
            drawWidth = fsState.displayWidth * 0.9;
            drawHeight = drawWidth / imageAspect;
        } else {
            drawHeight = fsState.displayHeight * 0.9;
            drawWidth = drawHeight * imageAspect;
        }
        
        // Center the image
        const centerX = fsState.displayWidth / 2;
        const centerY = fsState.displayHeight / 2;
        
        ctx.save();
        ctx.translate(centerX + fsState.offsetX, centerY + fsState.offsetY);
        ctx.scale(fsState.scale, fsState.scale);
        ctx.drawImage(state.image, -drawWidth/2, -drawHeight/2, drawWidth, drawHeight);
        ctx.restore();
    }

    setupFullScreenListeners() {
        const canvas = this.fullScreenState.canvas;
        
        canvas.addEventListener('mousedown', (e) => this.handleFullScreenMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleFullScreenMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleFullScreenMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.handleFullScreenWheel(e));
        
        // ESC key to exit
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.exitFullScreen();
        });
    }

    handleFullScreenMouseDown(e) {
        const rect = this.fullScreenState.canvas.getBoundingClientRect();
        this.fullScreenState.isDragging = true;
        this.fullScreenState.lastX = e.clientX - rect.left;
        this.fullScreenState.lastY = e.clientY - rect.top;
    }

    handleFullScreenMouseMove(e) {
        if (!this.fullScreenState.isDragging) return;
        
        const rect = this.fullScreenState.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // Reduced sensitivity for smoother control
        const sensitivity = 0.8;
        this.fullScreenState.offsetX += (currentX - this.fullScreenState.lastX) * sensitivity;
        this.fullScreenState.offsetY += (currentY - this.fullScreenState.lastY) * sensitivity;
        
        this.fullScreenState.lastX = currentX;
        this.fullScreenState.lastY = currentY;
        
        this.drawFullScreenImage();
    }

    handleFullScreenMouseUp(e) {
        this.fullScreenState.isDragging = false;
    }

    handleFullScreenWheel(e) {
        e.preventDefault();
        
        // Reduced zoom sensitivity for better control
        const zoomSensitivity = 0.05;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomSensitivity);
        
        this.fullScreenState.scale *= zoom;
        this.fullScreenState.scale = Math.max(0.1, Math.min(5, this.fullScreenState.scale));
        
        this.drawFullScreenImage();
    }

    zoomInFullscreen(imageNumber) {
        this.fullScreenState.scale = Math.min(this.fullScreenState.scale * 1.1, 5);
        this.drawFullScreenImage();
    }

    zoomOutFullscreen(imageNumber) {
        this.fullScreenState.scale = Math.max(this.fullScreenState.scale / 1.1, 0.1);
        this.drawFullScreenImage();
    }

    resetZoomFullscreen(imageNumber) {
        this.fullScreenState.scale = 1;
        this.fullScreenState.offsetX = 0;
        this.fullScreenState.offsetY = 0;
        this.drawFullScreenImage();
    }

    exitFullScreen() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.fullScreenState = null;
        
        // Remove ESC key listener
        document.removeEventListener('keydown', this.handleFullScreenEscKey);
    }

    identifyOverlayPeakForFrequencyNoComment(frequencyMHz, amplitude, dataset) {
        // Find the appropriate band for this frequency
        let detectedBand = null;
        for (const [band, bandInfo] of Object.entries(this.bandDefinitions)) {
            if (frequencyMHz >= bandInfo.startMHz && frequencyMHz <= bandInfo.endMHz) {
                detectedBand = band;
                break;
            }
        }
        
        if (detectedBand) {
            // Auto-select the band and show allocations (but don't add to comments)
            this.autoSelectBandButton(detectedBand);
            
            console.log(`Overlay Peak identified:`, {
                dataset: dataset.name,
                frequency: this.formatFrequency(frequencyMHz),
                amplitude: amplitude.toFixed(1) + ' dB',
                band: detectedBand
            });
        } else {
            console.log(`Overlay Peak at ${this.formatFrequency(frequencyMHz)} is outside defined bands`);
        }
    }

    enterFullScreenCsv(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state || !state.frequencyData.length) return;

        // Create full screen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <div class="fullscreen-container">
                <canvas id="fullscreenCsvCanvas${csvNumber}"></canvas>
                <div class="fullscreen-controls">
                    <button class="control-btn" onclick="figureExportTool.zoomInFullscreenCsv(${csvNumber})">+</button>
                    <button class="control-btn" onclick="figureExportTool.zoomOutFullscreenCsv(${csvNumber})">−</button>
                    <button class="control-btn" onclick="figureExportTool.resetZoomFullscreenCsv(${csvNumber})">Reset</button>
                    <button class="control-btn" onclick="figureExportTool.autoScaleFullscreenCsv(${csvNumber})">Auto</button>
                    <button class="control-btn" onclick="figureExportTool.exitFullScreenCsv()">Exit</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup full screen canvas with high resolution
        const fsCanvas = document.getElementById(`fullscreenCsvCanvas${csvNumber}`);
        const fsCtx = fsCanvas.getContext('2d');
        
        // Use high resolution for full screen
        const displayWidth = window.innerWidth - 100;
        const displayHeight = window.innerHeight - 100;
        const dpr = window.devicePixelRatio || 1;
        
        fsCanvas.width = displayWidth * dpr;
        fsCanvas.height = displayHeight * dpr;
        fsCanvas.style.width = displayWidth + 'px';
        fsCanvas.style.height = displayHeight + 'px';
        
        // Scale for high DPI
        fsCtx.scale(dpr, dpr);
        
        // Store full screen CSV state
        this.fullScreenCsvState = {
            csvNumber: csvNumber,
            canvas: fsCanvas,
            ctx: fsCtx,
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            displayWidth: displayWidth,
            displayHeight: displayHeight,
            originalState: { ...state } // Copy original state
        };
        
        this.drawFullScreenCsv();
        this.setupFullScreenCsvListeners();
    }

    drawFullScreenCsv() {
        if (!this.fullScreenCsvState) return;
        
        const state = this.getCsvState(this.fullScreenCsvState.csvNumber);
        const fsState = this.fullScreenCsvState;
        const ctx = fsState.ctx;
        const width = fsState.displayWidth;
        const height = fsState.displayHeight;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Use larger margins for better visibility
        const margin = { top: 60, right: 100, bottom: 120, left: 150 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Apply zoom and pan
        const scaledMargin = {
            left: margin.left + fsState.offsetX,
            top: margin.top + fsState.offsetY
        };
        
        // Calculate data ranges with zoom and pan
        const freqRange = (state.maxFreq - state.minFreq) / fsState.scale;
        const ampRange = (state.maxAmp - state.minAmp) / fsState.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (state.minFreq + state.maxFreq) / 2 - (fsState.offsetX / plotWidth) * freqRange;
        const ampCenter = (state.minAmp + state.maxAmp) / 2 + (fsState.offsetY / plotHeight) * ampRange;
        
        const freqStart = freqCenter - freqRange / 2;
        const freqEnd = freqCenter + freqRange / 2;
        const ampStart = ampCenter - ampRange / 2;
        const ampEnd = ampCenter + ampRange / 2;
        
        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw enhanced grid that aligns with axis labels
        
        // Calculate grid parameters to match axis labels
        const csvGridNumLabels = Math.min(12, Math.max(5, Math.floor(fsState.scale * 6) + 4));
        
        // Draw minor grid lines (finer subdivisions)
        ctx.strokeStyle = '#f5f5f5';
        ctx.lineWidth = 0.8;
        
        // Minor vertical grid lines (frequency) - 5x subdivision
        for (let i = 0; i <= csvGridNumLabels * 5; i++) {
            const x = margin.left + (i / (csvGridNumLabels * 5)) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Minor horizontal grid lines (amplitude) - 5x subdivision
        for (let i = 0; i <= csvGridNumLabels * 5; i++) {
            const y = margin.top + (i / (csvGridNumLabels * 5)) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw major grid lines (align with axis labels)
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 1.5;
        
        // Major vertical grid lines (frequency) - align with axis labels
        for (let i = 0; i <= csvGridNumLabels; i++) {
            const x = margin.left + (i / csvGridNumLabels) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Major horizontal grid lines (amplitude) - align with axis labels
        for (let i = 0; i <= csvGridNumLabels; i++) {
            const y = margin.top + (i / csvGridNumLabels) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw axes with crisp lines
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(scaledMargin.left, scaledMargin.top + plotHeight + 0.5);
        ctx.lineTo(scaledMargin.left + plotWidth, scaledMargin.top + plotHeight + 0.5);
        ctx.moveTo(scaledMargin.left + 0.5, scaledMargin.top);
        ctx.lineTo(scaledMargin.left + 0.5, scaledMargin.top + plotHeight);
        ctx.stroke();
        
        // Draw data line with high quality
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        let firstPoint = true;
        for (let i = 0; i < state.frequencyData.length; i++) {
            const freq = state.frequencyData[i];
            const amp = state.amplitudeData[i];
            
            if (freq < freqStart || freq > freqEnd) continue;
            
            const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
            const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw enhanced axis labels showing actual visible range
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Calculate number of labels based on zoom level
        const csvAxisNumLabels = Math.min(12, Math.max(5, Math.floor(fsState.scale * 6) + 4));
        
        // X-axis labels (frequency) - show actual visible range
        for (let i = 0; i <= csvAxisNumLabels; i++) {
            const freq = freqStart + (freqRange * i / csvAxisNumLabels);
            const x = margin.left + (i / csvAxisNumLabels) * plotWidth; // Use fixed margin
            const freqMHz = freq / 1e6;
            ctx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 15);
        }
        
        // Y-axis labels (amplitude) - show actual visible range
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= csvAxisNumLabels; i++) {
            const amp = ampStart + (ampRange * i / csvAxisNumLabels);
            const y = margin.top + plotHeight - (i / csvAxisNumLabels) * plotHeight; // Use fixed margin
            ctx.fillText(amp.toFixed(1) + ' dB', margin.left - 15, y);
        }
        
        // Axis titles with fixed positioning
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Frequency', margin.left + plotWidth / 2, height - 20);
        
        ctx.save();
        ctx.translate(40, margin.top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Amplitude (dB)', 0, 0);
        ctx.restore();
        
        // Add title with dataset info
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 28px Arial';
        const title = `CSV ${this.fullScreenCsvState.csvNumber} - Spectrum Analysis (${state.rowCount} points)`;
        ctx.fillText(title, width / 2, 20);
        
        // Draw regulatory limit lines
        const freqStartMHz = freqStart / 1e6;
        const freqEndMHz = freqEnd / 1e6;
        this.drawLimitLines(ctx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, ampStart, ampEnd);
    }

    setupFullScreenCsvListeners() {
        const canvas = this.fullScreenCsvState.canvas;
        
        canvas.addEventListener('mousedown', (e) => this.handleFullScreenCsvMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleFullScreenCsvMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleFullScreenCsvMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.handleFullScreenCsvWheel(e));
        canvas.addEventListener('click', (e) => this.handleFullScreenCsvClick(e));
        
        // ESC key to exit
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.exitFullScreenCsv();
        });
    }

    handleFullScreenCsvMouseDown(e) {
        const rect = this.fullScreenCsvState.canvas.getBoundingClientRect();
        this.fullScreenCsvState.isDragging = true;
        this.fullScreenCsvState.lastX = e.clientX - rect.left;
        this.fullScreenCsvState.lastY = e.clientY - rect.top;
    }

    handleFullScreenCsvMouseMove(e) {
        if (!this.fullScreenCsvState.isDragging) return;
        
        const rect = this.fullScreenCsvState.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const sensitivity = 0.8;
        this.fullScreenCsvState.offsetX += (currentX - this.fullScreenCsvState.lastX) * sensitivity;
        this.fullScreenCsvState.offsetY += (currentY - this.fullScreenCsvState.lastY) * sensitivity;
        
        this.fullScreenCsvState.lastX = currentX;
        this.fullScreenCsvState.lastY = currentY;
        
        this.drawFullScreenCsv();
    }

    handleFullScreenCsvMouseUp(e) {
        this.fullScreenCsvState.isDragging = false;
    }

    handleFullScreenCsvWheel(e) {
        e.preventDefault();
        
        const zoomSensitivity = 0.05;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomSensitivity);
        
        this.fullScreenCsvState.scale *= zoom;
        this.fullScreenCsvState.scale = Math.max(0.1, Math.min(20, this.fullScreenCsvState.scale));
        
        this.drawFullScreenCsv();
    }

    handleFullScreenCsvClick(e) {
        // Peak identification in full screen mode
        const rect = this.fullScreenCsvState.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const state = this.getCsvState(this.fullScreenCsvState.csvNumber);
        const fsState = this.fullScreenCsvState;
        
        // Similar click handling as regular CSV but adapted for full screen
        const margin = { top: 60, right: 100, bottom: 120, left: 150 };
        const plotWidth = fsState.displayWidth - margin.left - margin.right;
        const plotHeight = fsState.displayHeight - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + fsState.offsetX,
            top: margin.top + fsState.offsetY
        };
        
        if (clickX < scaledMargin.left || clickX > scaledMargin.left + plotWidth ||
            clickY < scaledMargin.top || clickY > scaledMargin.top + plotHeight) {
            return;
        }
        
        // Find closest data point and identify peak
        const freqRange = (state.maxFreq - state.minFreq) / fsState.scale;
        const ampRange = (state.maxAmp - state.minAmp) / fsState.scale;
        
        const freqStart = state.minFreq + (state.maxFreq - state.minFreq) * 0.5 * (1 - 1/fsState.scale);
        const ampStart = state.minAmp + (state.maxAmp - state.minAmp) * 0.5 * (1 - 1/fsState.scale);
        
        const clickedFreq = freqStart + ((clickX - scaledMargin.left) / plotWidth) * freqRange;
        const clickedAmp = ampStart + ((scaledMargin.top + plotHeight - clickY) / plotHeight) * ampRange;
        
        let closestIndex = 0;
        let minDistance = Infinity;
        
        for (let i = 0; i < state.frequencyData.length; i++) {
            const freq = state.frequencyData[i];
            const amp = state.amplitudeData[i];
            
            const freqNorm = (freq - freqStart) / freqRange;
            const ampNorm = (amp - ampStart) / ampRange;
            const clickFreqNorm = (clickedFreq - freqStart) / freqRange;
            const clickAmpNorm = (clickedAmp - ampStart) / ampRange;
            
            const distance = Math.sqrt(
                Math.pow(freqNorm - clickFreqNorm, 2) + 
                Math.pow(ampNorm - clickAmpNorm, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        
        const peakFreq = state.frequencyData[closestIndex];
        const peakAmp = state.amplitudeData[closestIndex];
        const peakFreqMHz = peakFreq / 1e6;
        
        this.identifyPeakForFrequencyNoComment(peakFreqMHz, peakAmp, this.fullScreenCsvState.csvNumber);
        this.drawFullScreenCsvPeakMarker(closestIndex);
    }

    drawFullScreenCsvPeakMarker(dataIndex) {
        const state = this.getCsvState(this.fullScreenCsvState.csvNumber);
        const fsState = this.fullScreenCsvState;
        const ctx = fsState.ctx;
        
        const freq = state.frequencyData[dataIndex];
        const amp = state.amplitudeData[dataIndex];
        
        const margin = { top: 60, right: 100, bottom: 120, left: 150 };
        const plotWidth = fsState.displayWidth - margin.left - margin.right;
        const plotHeight = fsState.displayHeight - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + fsState.offsetX,
            top: margin.top + fsState.offsetY
        };
        
        const freqRange = (state.maxFreq - state.minFreq) / fsState.scale;
        const ampRange = (state.maxAmp - state.minAmp) / fsState.scale;
        const freqStart = state.minFreq + (state.maxFreq - state.minFreq) * 0.5 * (1 - 1/fsState.scale);
        const ampStart = state.minAmp + (state.maxAmp - state.minAmp) * 0.5 * (1 - 1/fsState.scale);
        
        const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
        const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
        
        // Redraw graph first
        this.drawFullScreenCsv();
        
        // Draw enhanced marker for full screen
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 4;
        ctx.fillStyle = '#ff6600';
        
        // Draw circle marker
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw crosshairs
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x + 20, y);
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y + 20);
        ctx.stroke();
    }

    zoomInFullscreenCsv(csvNumber) {
        this.fullScreenCsvState.scale = Math.min(this.fullScreenCsvState.scale * 1.2, 20);
        this.drawFullScreenCsv();
    }

    zoomOutFullscreenCsv(csvNumber) {
        this.fullScreenCsvState.scale = Math.max(this.fullScreenCsvState.scale / 1.2, 0.1);
        this.drawFullScreenCsv();
    }

    resetZoomFullscreenCsv(csvNumber) {
        this.fullScreenCsvState.scale = 1;
        this.fullScreenCsvState.offsetX = 0;
        this.fullScreenCsvState.offsetY = 0;
        this.drawFullScreenCsv();
    }

    autoScaleFullscreenCsv(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state.frequencyData.length) return;
        
        // Auto scale to show significant data
        const amplitudes = state.amplitudeData.slice();
        amplitudes.sort((a, b) => b - a);
        const significantAmp = amplitudes[Math.floor(amplitudes.length * 0.1)];
        
        let minFreq = Infinity, maxFreq = -Infinity;
        
        for (let i = 0; i < state.frequencyData.length; i++) {
            if (state.amplitudeData[i] >= significantAmp - 20) {
                minFreq = Math.min(minFreq, state.frequencyData[i]);
                maxFreq = Math.max(maxFreq, state.frequencyData[i]);
            }
        }
        
        if (minFreq === Infinity) {
            this.resetZoomFullscreenCsv(csvNumber);
            return;
        }
        
        const freqRangeTarget = maxFreq - minFreq;
        const freqRangeFull = state.maxFreq - state.minFreq;
        
        if (freqRangeTarget > 0 && freqRangeTarget < freqRangeFull) {
            this.fullScreenCsvState.scale = freqRangeFull / freqRangeTarget;
            this.fullScreenCsvState.offsetX = 0;
            this.fullScreenCsvState.offsetY = 0;
        }
        
        this.drawFullScreenCsv();
    }

    exitFullScreenCsv() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.fullScreenCsvState = null;
    }

    enterFullScreenOverlay() {
        if (this.csvOverlayState.datasets.length === 0) return;

        // Create full screen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <div class="fullscreen-container">
                <canvas id="fullscreenOverlayCanvas"></canvas>
                <div class="fullscreen-controls">
                    <button class="control-btn" onclick="figureExportTool.zoomInFullscreenOverlay()">+</button>
                    <button class="control-btn" onclick="figureExportTool.zoomOutFullscreenOverlay()">−</button>
                    <button class="control-btn" onclick="figureExportTool.resetZoomFullscreenOverlay()">Reset</button>
                    <button class="control-btn" onclick="figureExportTool.autoScaleFullscreenOverlay()">Auto</button>
                    <button class="control-btn" onclick="figureExportTool.exitFullScreenOverlay()">Exit</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup full screen canvas with high resolution
        const fsCanvas = document.getElementById('fullscreenOverlayCanvas');
        const fsCtx = fsCanvas.getContext('2d');
        
        // Use high resolution for full screen
        const displayWidth = window.innerWidth - 100;
        const displayHeight = window.innerHeight - 100;
        const dpr = window.devicePixelRatio || 1;
        
        fsCanvas.width = displayWidth * dpr;
        fsCanvas.height = displayHeight * dpr;
        fsCanvas.style.width = displayWidth + 'px';
        fsCanvas.style.height = displayHeight + 'px';
        
        // Scale for high DPI
        fsCtx.scale(dpr, dpr);
        
        // Store full screen overlay state
        this.fullScreenOverlayState = {
            canvas: fsCanvas,
            ctx: fsCtx,
            scale: this.csvOverlayState.scale,
            offsetX: this.csvOverlayState.offsetX,
            offsetY: this.csvOverlayState.offsetY,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            displayWidth: displayWidth,
            displayHeight: displayHeight
        };
        
        this.drawFullScreenOverlay();
        this.setupFullScreenOverlayListeners();
    }

    drawFullScreenOverlay() {
        if (!this.fullScreenOverlayState) return;
        
        const fsState = this.fullScreenOverlayState;
        const ctx = fsState.ctx;
        const width = fsState.displayWidth;
        const height = fsState.displayHeight;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        if (this.csvOverlayState.datasets.length === 0) return;
        
        // Use larger margins for full screen, extra space for legend outside graph
        const margin = { top: 60, right: 100, bottom: 160, left: 150 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Apply zoom and pan
        const scaledMargin = {
            left: margin.left + fsState.offsetX,
            top: margin.top + fsState.offsetY
        };
        
        // Calculate data ranges with zoom and pan
        const freqRange = (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) / fsState.scale;
        const ampRange = (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) / fsState.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (this.csvOverlayState.minFreq + this.csvOverlayState.maxFreq) / 2 - (fsState.offsetX / plotWidth) * freqRange;
        const ampCenter = (this.csvOverlayState.minAmp + this.csvOverlayState.maxAmp) / 2 + (fsState.offsetY / plotHeight) * ampRange;
        
        const freqStart = freqCenter - freqRange / 2;
        const freqEnd = freqCenter + freqRange / 2;
        const ampStart = ampCenter - ampRange / 2;
        const ampEnd = ampCenter + ampRange / 2;
        
        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw enhanced grid that aligns with axis labels
        
        // Calculate grid parameters to match axis labels
        const numLabels = Math.min(12, Math.max(5, Math.floor(fsState.scale * 6) + 4));
        
        // Draw minor grid lines (finer subdivisions)
        ctx.strokeStyle = '#f5f5f5';
        ctx.lineWidth = 0.8;
        
        // Minor vertical grid lines (frequency) - 5x subdivision
        for (let i = 0; i <= numLabels * 5; i++) {
            const x = margin.left + (i / (numLabels * 5)) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Minor horizontal grid lines (amplitude) - 5x subdivision
        for (let i = 0; i <= numLabels * 5; i++) {
            const y = margin.top + (i / (numLabels * 5)) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw major grid lines (align with axis labels)
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 1.5;
        
        // Major vertical grid lines (frequency) - align with axis labels
        for (let i = 0; i <= numLabels; i++) {
            const x = margin.left + (i / numLabels) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, margin.top);
            ctx.lineTo(x + 0.5, margin.top + plotHeight);
            ctx.stroke();
        }
        
        // Major horizontal grid lines (amplitude) - align with axis labels
        for (let i = 0; i <= numLabels; i++) {
            const y = margin.top + (i / numLabels) * plotHeight;
            ctx.beginPath();
            ctx.moveTo(margin.left, y + 0.5);
            ctx.lineTo(margin.left + plotWidth, y + 0.5);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(scaledMargin.left, scaledMargin.top + plotHeight + 0.5);
        ctx.lineTo(scaledMargin.left + plotWidth, scaledMargin.top + plotHeight + 0.5);
        ctx.moveTo(scaledMargin.left + 0.5, scaledMargin.top);
        ctx.lineTo(scaledMargin.left + 0.5, scaledMargin.top + plotHeight);
        ctx.stroke();
        
        // Draw each dataset
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            if (!dataset.visible) return;
            
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            let firstPoint = true;
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                if (freq < freqStart || freq > freqEnd) continue;
                
                const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
                const y = scaledMargin.top + plotHeight - ((amp - ampStart) / ampRange) * plotHeight;
                
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });
        
        // Draw enhanced axis labels showing actual visible range
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // X-axis labels - show actual visible range
        for (let i = 0; i <= numLabels; i++) {
            const freq = freqStart + (freqRange * i / numLabels);
            const x = margin.left + (i / numLabels) * plotWidth; // Use fixed margin
            const freqMHz = freq / 1e6;
            ctx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 15);
        }
        
        // Y-axis labels - show actual visible range
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= numLabels; i++) {
            const amp = ampStart + (ampRange * i / numLabels);
            const y = margin.top + plotHeight - (i / numLabels) * plotHeight; // Use fixed margin
            ctx.fillText(amp.toFixed(1) + ' dB', margin.left - 15, y);
        }
        
        // Axis titles with fixed positioning
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Frequency', margin.left + plotWidth / 2, height - 20);
        
        ctx.save();
        ctx.translate(40, margin.top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Amplitude (dB)', 0, 0);
        ctx.restore();
        
        // Add title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 28px Arial';
        const title = `Spectrum Overlay Analysis (${this.csvOverlayState.datasets.length} datasets)`;
        ctx.fillText(title, width / 2, 20);
        
        // Draw regulatory limit lines
        const freqStartMHz = freqStart / 1e6;
        const freqEndMHz = freqEnd / 1e6;
        this.drawLimitLines(ctx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, ampStart, ampEnd);
        
        // Draw legend at the bottom
        this.drawFullScreenLegend(ctx, width, height, margin);
    }

    setupFullScreenOverlayListeners() {
        const canvas = this.fullScreenOverlayState.canvas;
        
        canvas.addEventListener('mousedown', (e) => this.handleFullScreenOverlayMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleFullScreenOverlayMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleFullScreenOverlayMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.handleFullScreenOverlayWheel(e));
        canvas.addEventListener('click', (e) => this.handleFullScreenOverlayClick(e));
        
        // ESC key to exit
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.exitFullScreenOverlay();
        });
    }

    handleFullScreenOverlayMouseDown(e) {
        const rect = this.fullScreenOverlayState.canvas.getBoundingClientRect();
        this.fullScreenOverlayState.isDragging = true;
        this.fullScreenOverlayState.lastX = e.clientX - rect.left;
        this.fullScreenOverlayState.lastY = e.clientY - rect.top;
    }

    handleFullScreenOverlayMouseMove(e) {
        if (!this.fullScreenOverlayState.isDragging) return;
        
        const rect = this.fullScreenOverlayState.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const sensitivity = 0.8;
        this.fullScreenOverlayState.offsetX += (currentX - this.fullScreenOverlayState.lastX) * sensitivity;
        this.fullScreenOverlayState.offsetY += (currentY - this.fullScreenOverlayState.lastY) * sensitivity;
        
        this.fullScreenOverlayState.lastX = currentX;
        this.fullScreenOverlayState.lastY = currentY;
        
        this.drawFullScreenOverlay();
    }

    handleFullScreenOverlayMouseUp(e) {
        this.fullScreenOverlayState.isDragging = false;
    }

    handleFullScreenOverlayWheel(e) {
        e.preventDefault();
        
        const zoomSensitivity = 0.05;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomSensitivity);
        
        this.fullScreenOverlayState.scale *= zoom;
        this.fullScreenOverlayState.scale = Math.max(0.1, Math.min(20, this.fullScreenOverlayState.scale));
        
        this.drawFullScreenOverlay();
    }

    handleFullScreenOverlayClick(e) {
        // Similar to regular overlay click but for full screen
        const rect = this.fullScreenOverlayState.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const fsState = this.fullScreenOverlayState;
        const margin = { top: 60, right: 100, bottom: 120, left: 150 };
        const plotWidth = fsState.displayWidth - margin.left - margin.right;
        const plotHeight = fsState.displayHeight - margin.top - margin.bottom;
        
        const scaledMargin = {
            left: margin.left + fsState.offsetX,
            top: margin.top + fsState.offsetY
        };
        
        if (clickX < scaledMargin.left || clickX > scaledMargin.left + plotWidth ||
            clickY < scaledMargin.top || clickY > scaledMargin.top + plotHeight) {
            return;
        }
        
        // Find closest point in any dataset
        const freqRange = (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) / fsState.scale;
        const ampRange = (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) / fsState.scale;
        
        const freqStart = this.csvOverlayState.minFreq + (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq) * 0.5 * (1 - 1/fsState.scale);
        const ampStart = this.csvOverlayState.minAmp + (this.csvOverlayState.maxAmp - this.csvOverlayState.minAmp) * 0.5 * (1 - 1/fsState.scale);
        
        const clickedFreq = freqStart + ((clickX - scaledMargin.left) / plotWidth) * freqRange;
        const clickedAmp = ampStart + ((scaledMargin.top + plotHeight - clickY) / plotHeight) * ampRange;
        
        let closestDataset = null;
        let closestIndex = 0;
        let minDistance = Infinity;
        
        this.csvOverlayState.datasets.forEach((dataset) => {
            if (!dataset.visible) return;
            
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                const freqNorm = (freq - freqStart) / freqRange;
                const ampNorm = (amp - ampStart) / ampRange;
                const clickFreqNorm = (clickedFreq - freqStart) / freqRange;
                const clickAmpNorm = (clickedAmp - ampStart) / ampRange;
                
                const distance = Math.sqrt(
                    Math.pow(freqNorm - clickFreqNorm, 2) + 
                    Math.pow(ampNorm - clickAmpNorm, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDataset = dataset;
                    closestIndex = i;
                }
            }
        });
        
        if (closestDataset) {
            const peakFreq = closestDataset.frequencyData[closestIndex];
            const peakAmp = closestDataset.amplitudeData[closestIndex];
            const peakFreqMHz = peakFreq / 1e6;
            
            this.identifyOverlayPeakForFrequencyNoComment(peakFreqMHz, peakAmp, closestDataset);
        }
    }

    zoomInFullscreenOverlay() {
        this.fullScreenOverlayState.scale = Math.min(this.fullScreenOverlayState.scale * 1.2, 20);
        this.drawFullScreenOverlay();
    }

    zoomOutFullscreenOverlay() {
        this.fullScreenOverlayState.scale = Math.max(this.fullScreenOverlayState.scale / 1.2, 0.1);
        this.drawFullScreenOverlay();
    }

    resetZoomFullscreenOverlay() {
        this.fullScreenOverlayState.scale = 1;
        this.fullScreenOverlayState.offsetX = 0;
        this.fullScreenOverlayState.offsetY = 0;
        this.drawFullScreenOverlay();
    }

    autoScaleFullscreenOverlay() {
        // Similar to regular auto scale but for full screen
        this.resetZoomFullscreenOverlay();
    }

    exitFullScreenOverlay() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.fullScreenOverlayState = null;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.figureExportTool = new FigureExportTool();
}); 