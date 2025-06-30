// ========================================================================
// FIGURE EXPORT TOOL v4.1 - EMC TESTING ANNOTATION SYSTEM
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
        
        // Set initial theme and display state based on defaults
        this.switchToMode('csv'); // Initialize with CSV mode and navy theme
        this.setCsvMode(this.currentCsvMode);
        
        // Set up basic CSV functionality immediately
        setTimeout(() => {
            this.enableCsvUploadImmediately();
        }, 50);
        
        // Force immediate UI update for initial load - single reliable initialization
        setTimeout(() => {
            console.log('Initializing CSV mode on startup...');
            this.setInputType('csv'); // Ensure CSV mode is properly set
            this.updateExportButtonLabels(); // Force update of export buttons
            this.updateTables(); // Update any table displays
            
            // Set up CSV upload listeners immediately after UI is ready
            setTimeout(() => {
                console.log('Setting up CSV upload listeners...');
                this.setupOverlayUploadListeners();
                this.addCsvUploadFallback();
            }, 200);
        }, 100);
        
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
        // Mode selector tabs (new prominent buttons)
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchToMode(mode);
            });
        });

        // Input type toggle (hidden for compatibility)
        document.querySelectorAll('input[name="inputType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setInputType(e.target.value);
                }
            });
        });
        
        // CSV mode is always overlay mode (simplified)
        
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
        
        // CSV file upload (separate mode - not used in simplified version)
        this.setupCsvUploadListeners(1);
        this.setupCsvUploadListeners(2);
        // Set up overlay upload listeners immediately to prevent timing issues
        this.setupOverlayUploadListeners();
        this.enableCsvUploadImmediately();
        this.setupClickableOverlay();
        
        // Initialize enhanced folder-based CSV selection
        this.setupFolderBasedSelection();
        
        // Form inputs - update tables when values change
        ['runId1', 'band1', 'location1', 'testType1', 'equipmentDescription1', 'operatingCondition1', 'traces1',
         'runId2', 'band2', 'location2', 'testType2', 'equipmentDescription2', 'operatingCondition2', 'traces2', 
         'csvRunId', 'csvBand', 'csvDescription', 'csvTraces',
         'comments'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                                    element.addEventListener('input', () => {
                        this.saveCurrentPageData();
                        this.updateTables();
                        
                        // Update CSV title display when CSV form fields or comments change
                        if ((id.startsWith('csv') || id === 'comments') && this.currentInputType === 'csv') {
                            const csvFormData = this.getCsvFormData();
                            this.updateCsvTitle(csvFormData);
                        }
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
        
        // Band selection buttons - TEMPORARILY COMMENTED OUT
        // document.querySelectorAll('.band-btn').forEach(btn => {
        //     btn.addEventListener('click', (e) => {
        //         this.handleBandSelection(e.target.dataset.band);
        //     });
        // });
        
        // Export buttons - Add null checks to prevent errors
        const exportBtn1 = document.getElementById('exportImage1');
        const exportBtn2 = document.getElementById('exportImage2');
        const exportBothBtn = document.getElementById('exportBoth');
        const exportAllBtn = document.getElementById('exportAllPages');
        
        if (exportBtn1) exportBtn1.addEventListener('click', () => this.exportSingleImage(1));
        if (exportBtn2) exportBtn2.addEventListener('click', () => this.exportSingleImage(2));
        if (exportBothBtn) exportBothBtn.addEventListener('click', () => this.exportBothImages());
        if (exportAllBtn) exportAllBtn.addEventListener('click', () => this.exportAllPages());
        
        // Clear buttons - Add null checks to prevent errors
        const clearStatsBtn = document.getElementById('clearStats');
        const clearAllBtn = document.getElementById('clearAllPages');
        
        if (clearStatsBtn) clearStatsBtn.addEventListener('click', () => this.clearCurrentPage());
        if (clearAllBtn) clearAllBtn.addEventListener('click', () => this.clearAllPages());
        
        // Page tab clicks
        this.setupPageTabListeners();
        
        // Limit lines controls - TEMPORARILY COMMENTED OUT
        // this.setupLimitLinesListeners();
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
    
    switchToMode(mode) {
        // Update the container theme
        const container = document.getElementById('appContainer');
        container.classList.remove('csv-theme', 'image-theme', 'correction-theme');
        
        if (mode === 'csv') {
            container.classList.add('csv-theme');
            this.currentInputType = 'csv';
            // Update hidden radio for compatibility
            document.getElementById('hiddenCsvInput').checked = true;
        } else if (mode === 'images') {
            container.classList.add('image-theme');
            this.currentInputType = 'images';
            // Update hidden radio for compatibility
            document.getElementById('hiddenImageInput').checked = true;
        } else if (mode === 'correction') {
            container.classList.add('correction-theme'); // Use yellow correction theme
            this.currentInputType = 'correction';
        }
        
        // Update mode tab active states
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Call existing setInputType method to handle UI updates
        this.setInputType(this.currentInputType);
        
        console.log(`Switched to ${mode} mode`);
    }

    setInputType(inputType) {
        this.currentInputType = inputType;
        
        const imageUploadSection = document.getElementById('imageUploadSection');
        const csvUploadSection = document.getElementById('csvUploadSection');
        const correctionSection = document.getElementById('correctionSection');
        const dualImageContainer = document.getElementById('dualImageContainer');
        const dualCsvContainer = document.getElementById('dualCsvContainer');
        const correctionVisualizationMode = document.getElementById('correctionVisualizationMode');
        const csvOverlayMode = document.getElementById('csvOverlayMode');
        const dualInfoTables = document.getElementById('dualInfoTables');
        
        // Update export button labels
        this.updateExportButtonLabels();
        
        if (inputType === 'csv') {
            // Show CSV mode
            imageUploadSection.style.display = 'none';
            csvUploadSection.style.display = 'block';
            if (correctionSection) correctionSection.style.display = 'none';
            dualImageContainer.style.display = 'none';
            dualCsvContainer.style.display = 'block';
            if (correctionVisualizationMode) correctionVisualizationMode.style.display = 'none';
            if (csvOverlayMode) csvOverlayMode.style.display = 'block';
            dualInfoTables.style.display = 'none';
            document.getElementById('dualFormSection').style.display = 'none';
            document.getElementById('csvFormSection').style.display = 'block';
            document.getElementById('layoutControl').style.display = 'none';
            
            // Restore right panel and center panel layout
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) rightPanel.style.display = 'block';
            const centerPanel = document.querySelector('.center-panel');
            if (centerPanel) {
                centerPanel.style.gridColumn = '';
                centerPanel.style.maxWidth = '';
            }
            
            // Setup CSV overlay mode (simplified) - single setup call
            setTimeout(() => {
                this.setCsvMode('overlay');
                // Force setup of upload listeners to ensure they work
                console.log('Setting up CSV upload listeners...');
                this.setupOverlayUploadListeners();
                this.addCsvUploadFallback();
                this.enableCsvUploadImmediately();
                
                // Initialize CSV title display
                const csvFormData = this.getCsvFormData();
                this.updateCsvTitle(csvFormData);
                
                // Setup clickable overlay functionality
                this.setupClickableOverlay();
                
                // Verify setup after a short delay
                setTimeout(() => {
                    this.debugCsvUpload();
                }, 200);
            }, 150);
            
        } else if (inputType === 'correction') {
            // Show EMI Correction mode
            imageUploadSection.style.display = 'none';
            csvUploadSection.style.display = 'none';
            if (correctionSection) correctionSection.style.display = 'block';
            dualImageContainer.style.display = 'none';
            dualCsvContainer.style.display = 'block';
            if (correctionVisualizationMode) correctionVisualizationMode.style.display = 'block';
            if (csvOverlayMode) csvOverlayMode.style.display = 'none';
            dualInfoTables.style.display = 'none';
            document.getElementById('dualFormSection').style.display = 'none';
            document.getElementById('csvFormSection').style.display = 'none';
            document.getElementById('layoutControl').style.display = 'none';
            
            // Hide right panel (comments section) for correction mode
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) rightPanel.style.display = 'none';
            
            // Extend center panel to fill the space
            const centerPanel = document.querySelector('.center-panel');
            if (centerPanel) {
                centerPanel.style.gridColumn = 'span 2';
                centerPanel.style.maxWidth = 'none';
            }
            
            // Initialize EMI correction tool
            setTimeout(() => {
                if (window.emiCorrectionTool) {
                    window.emiCorrectionTool.setupCanvas();
                    // Force re-setup event listeners to ensure they work after mode switch
                    window.emiCorrectionTool.setupEventListeners(true);
                }
            }, 150);
            
        } else {
            // Show image mode
            imageUploadSection.style.display = 'block';
            csvUploadSection.style.display = 'none';
            if (correctionSection) correctionSection.style.display = 'none';
            dualImageContainer.style.display = 'block';
            dualCsvContainer.style.display = 'none';
            if (correctionVisualizationMode) correctionVisualizationMode.style.display = 'none';
            if (csvOverlayMode) csvOverlayMode.style.display = 'none';
            dualInfoTables.style.display = 'none';
            document.getElementById('dualFormSection').style.display = 'block';
            document.getElementById('csvFormSection').style.display = 'none';
            document.getElementById('layoutControl').style.display = 'block';
            
            // Restore right panel and center panel layout
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) rightPanel.style.display = 'block';
            const centerPanel = document.querySelector('.center-panel');
            if (centerPanel) {
                centerPanel.style.gridColumn = '';
                centerPanel.style.maxWidth = '';
            }
            
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
        
        // Check if elements exist before trying to modify them
        if (!exportBtn1 || !exportBtn2 || !exportBothBtn) {
            console.warn('Export button elements not found during label update');
            return;
        }
        
        if (this.currentInputType === 'csv') {
            // For CSV mode, show only one export button
            exportBtn1.textContent = 'Export CSV Overlay';
            exportBtn1.style.display = 'inline-block';
            exportBtn2.style.display = 'none';
            exportBothBtn.style.display = 'none';
            console.log('Updated export buttons for CSV mode');
        } else if (this.currentInputType === 'correction') {
            // For correction mode, hide all export buttons (correction has its own export)
            exportBtn1.style.display = 'none';
            exportBtn2.style.display = 'none';
            exportBothBtn.style.display = 'none';
            console.log('Updated export buttons for Correction mode');
        } else {
            // For image mode, show all three buttons
            exportBtn1.textContent = 'Export Image 1';
            exportBtn2.textContent = 'Export Image 2';
            exportBothBtn.textContent = 'Export Both Images';
            exportBtn1.style.display = 'inline-block';
            exportBtn2.style.display = 'inline-block';
            exportBothBtn.style.display = 'inline-block';
            console.log('Updated export buttons for Image mode');
        }
    }
    
    setCsvMode(csvMode = 'overlay') {
        this.currentCsvMode = 'overlay'; // Always use overlay mode
        
        const csvOverlayMode = document.getElementById('csvOverlayMode');
        
        // Update export button labels
        this.updateExportButtonLabels();
        
        // Always show overlay mode (simplified)
        if (csvOverlayMode) {
            csvOverlayMode.style.display = 'block';
        }
        
        // Ensure CSV upload listeners are set up
        this.setupOverlayUploadListeners();
        
        // Update datasets array with currently loaded data
        this.updateOverlayDatasets();
        
        // Setup and draw overlay canvas
        setTimeout(() => {
            this.setupOverlayCanvas();
            this.drawOverlayGraph();
            this.updateLegend();
            this.updateOverlayFileList();
            this.setupClickableOverlay();
        }, 100);
    }
    
    applyCsvLayout() {
        // No longer needed for simplified CSV overlay mode
    }
    
    exportBothImages() {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        if (this.currentInputType === 'csv') {
            // CSV mode is always overlay mode (simplified)
            this.exportOverlayData();
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
        const instructionOverlay = document.getElementById(`instructionOverlay${imageNumber}`);
        
        if (!uploadArea || !imageInput) {
            console.error(`Upload elements not found for image ${imageNumber}`);
            return;
        }
        
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e, imageNumber));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e, imageNumber));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e, imageNumber));
        
        // Add click listener to the center instruction overlay
        if (instructionOverlay) {
            instructionOverlay.addEventListener('click', () => imageInput.click());
            instructionOverlay.style.cursor = 'pointer';
        }
        
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
        if (this.currentInputType === 'csv') {
            return this.getCsvFormData();
        }
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
    
    getCsvFormData() {
        return {
            runId: document.getElementById('csvRunId')?.value || '-',
            band: document.getElementById('csvBand')?.value || '-',
            description: document.getElementById('csvDescription')?.value || '-',
            traces: document.getElementById('csvTraces')?.value || ''
        };
    }
    
    // TEMPORARILY COMMENTED OUT - Band Selection Feature
    // handleBandSelection(band) {
    //     // Update frequency range display
    //     const bandInfo = this.bandDefinitions[band];
    //     if (bandInfo) {
    //         document.getElementById('frequencyRange').value = bandInfo.range;
    //     }
    //     
    //     // Visual feedback - highlight selected band
    //     document.querySelectorAll('.band-btn').forEach(btn => {
    //         btn.classList.remove('active');
    //     });
    //     document.querySelector(`[data-band="${band}"]`).classList.add('active');
    //     
    //     // Update peak identification helper for selected band
    //     this.identifyPeakForBand(band, bandInfo);
    //     
    //     // Redraw CSV graphs with band filtering when band is selected
    //     if (this.currentInputType === 'csv') {
    //         this.redrawAllCsvGraphs();
    //     }
    // }
    
    // TEMPORARILY COMMENTED OUT - Auto Band Selection
    // autoSelectBandButton(detectedBand) {
    //     if (this.bandDefinitions[detectedBand]) {
    //         this.handleBandSelection(detectedBand);
    //     }
    // }
    
    // TEMPORARILY COMMENTED OUT - Peak Identification Feature
    // clearPeakIdentification() {
    //     const resultsContainer = document.getElementById('peakResults');
    //     const bandInfoDisplay = document.querySelector('.band-info-display');
    //     
    //     bandInfoDisplay.classList.remove('active');
    //     bandInfoDisplay.innerHTML = '<p class="helper-hint">Select an EMC band above to see frequency allocations for that range.</p>';
    //     resultsContainer.innerHTML = '<p class="helper-hint">Choose a band (B0-B7) to view all services allocated in that frequency range.</p>';
    // }
    
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
                
                // The hideInstructionOverlay is now handled in drawImage() method
                // This ensures the overlay is only hidden after successful image rendering
                
                // Update dynamic UI after loading image
                this.updateTables();
            };
            img.onerror = () => {
                // If image fails to load, keep the instruction overlay visible
                console.error(`Failed to load image ${imageNumber}: ${file.name}`);
                // Reset the state if image loading fails
                state.image = null;
                state.originalFilename = null;
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
        
        // Auto-fill detected values - use CSV fields if in CSV mode, otherwise image fields
        if (this.currentInputType === 'csv') {
            if (runId) {
                document.getElementById('csvRunId').value = runId;
                console.log(`Detected Run ID for CSV:`, runId);
            }
            
            if (band) {
                document.getElementById('csvBand').value = band;
                // this.autoSelectBandButton(band); // TEMPORARILY COMMENTED OUT
                console.log(`Detected Band for CSV:`, band);
            }
            
            if (location) {
                if (!document.getElementById('csvDescription').value) {
                    document.getElementById('csvDescription').value = location;
                    console.log(`Detected Location for CSV Description:`, location);
                }
            }
        } else {
            if (runId) {
                document.getElementById(`runId${imageNumber}`).value = runId;
                console.log(`Detected Run ID for Image ${imageNumber}:`, runId);
            }
            
            if (band) {
                document.getElementById(`band${imageNumber}`).value = band;
                // Only auto-select band button for first image to avoid conflicts
                if (imageNumber === 1) {
                    // this.autoSelectBandButton(band); // TEMPORARILY COMMENTED OUT
                }
                console.log(`Detected Band for Image ${imageNumber}:`, band);
            }
            
            if (location) {
                if (!document.getElementById(`location${imageNumber}`).value) {
                    document.getElementById(`location${imageNumber}`).value = location;
                    console.log(`Detected Location for Image ${imageNumber}:`, location);
                }
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
            // Ensure instruction overlay is visible when no image is loaded
            this.showInstructionOverlay(imageNumber);
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
        
        if (!state || !state.image) {
            // Show instruction overlay if no image is available
            this.showInstructionOverlay(imageNumber);
            return;
        }
        
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
        
        // Hide instruction overlay after successful image drawing
        this.hideInstructionOverlay(imageNumber);
    }
    
    showInstructionOverlay(imageNumber) {
        const overlay = document.getElementById(`instructionOverlay${imageNumber}`);
        if (overlay) {
            overlay.style.display = 'block';
        }
    }
    
    hideInstructionOverlay(imageNumber) {
        const overlay = document.getElementById(`instructionOverlay${imageNumber}`);
        if (overlay) {
            overlay.style.display = 'none';
        }
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
        if (this.currentInputType === 'csv') {
            // For CSV mode, use single CSV form data for both table columns
            const csvFormData = this.getCsvFormData();
            
            // Update first table column with CSV data
            const tableRunElement1 = document.getElementById('tableRun1');
            const tableBandElement1 = document.getElementById('tableBand1');
            const tableLocationElement1 = document.getElementById('tableLocation1');
            
            if (tableRunElement1) tableRunElement1.textContent = csvFormData.runId;
            if (tableBandElement1) tableBandElement1.textContent = csvFormData.band;
            if (tableLocationElement1) tableLocationElement1.textContent = csvFormData.location;
            
            // Clear second table column for CSV mode
            const tableRunElement2 = document.getElementById('tableRun2');
            const tableBandElement2 = document.getElementById('tableBand2');
            const tableLocationElement2 = document.getElementById('tableLocation2');
            
            if (tableRunElement2) tableRunElement2.textContent = '-';
            if (tableBandElement2) tableBandElement2.textContent = '-';
            if (tableLocationElement2) tableLocationElement2.textContent = '-';
            
            // Update CSV title display
            this.updateCsvTitle(csvFormData);
        } else {
            // Update both tables for image mode
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
        
        // Update dynamic UI elements based on loaded data
        this.updateDynamicUI();
    }
    
    updateCsvTitle(csvFormData) {
        // Update the CSV title area with form data - matching export format
        const titleRunId = document.getElementById('titleRunId');
        const titleBand = document.getElementById('titleBand');
        const titleDescription = document.getElementById('titleDescription');
        const titleTraces = document.getElementById('titleTraces');
        const titleComment = document.getElementById('titleComment');
        
        // Get comment from the comments field
        const commentsElement = document.getElementById('comments');
        const commentText = commentsElement ? commentsElement.value : '';
        
        // Update display elements with direct field values
        if (titleRunId) titleRunId.textContent = csvFormData.runId || '-';
        if (titleBand) titleBand.textContent = csvFormData.band || '-';
        if (titleDescription) titleDescription.textContent = csvFormData.description || '-';
        if (titleTraces) titleTraces.textContent = csvFormData.traces || '-';
        if (titleComment) titleComment.textContent = commentText || '-';
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
        
        // Hide table headers (removed per user request)
        const dualInfoTables = document.getElementById('dualInfoTables');
        if (dualInfoTables) {
            dualInfoTables.style.display = 'none';
        }
        
        // NEVER show dual form section in CSV mode - we use the clean single form
        const dualFormSection = document.getElementById('dualFormSection');
        if (dualFormSection) {
            dualFormSection.style.display = 'none';
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
                this.showInstructionOverlay(1);
                this.showInstructionOverlay(2);
                
                // Only access CSV elements if they exist (they don't in overlay-only mode)
                const csvInstructionOverlay1 = document.getElementById('csvInstructionOverlay1');
                const csvInstructionOverlay2 = document.getElementById('csvInstructionOverlay2');
                const csvInfo1 = document.getElementById('csvInfo1');
                const csvInfo2 = document.getElementById('csvInfo2');
                
                if (csvInstructionOverlay1) csvInstructionOverlay1.style.display = 'block';
                if (csvInstructionOverlay2) csvInstructionOverlay2.style.display = 'block';
                if (csvInfo1) csvInfo1.style.display = 'none';
                if (csvInfo2) csvInfo2.style.display = 'none';
                
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
                    const csvOverlayInstructionOverlay = document.getElementById('csvOverlayInstructionOverlay');
                    if (csvOverlayInstructionOverlay) {
                        csvOverlayInstructionOverlay.style.display = 'block';
                    }
                }
                
                // Remove image controls
                document.querySelector('#imageControls1')?.remove();
                document.querySelector('#imageControls2')?.remove();
                
                // Clear form fields
                            if (this.currentInputType === 'csv') {
                // Clear CSV form fields
                const csvFields = ['csvRunId', 'csvBand', 'csvDescription', 'csvTraces'];
                csvFields.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.value = '';
                });
            } else {
                    // Clear image form fields
                    const imageFields = [
                        'runId1', 'band1', 'location1', 'testType1', 'equipmentDescription1', 'operatingCondition1', 'traces1',
                        'runId2', 'band2', 'location2', 'testType2', 'equipmentDescription2', 'operatingCondition2', 'traces2'
                    ];
                    imageFields.forEach(id => {
                        const element = document.getElementById(id);
                        if (element) element.value = '';
                    });
                }
                
                // Clear comments
                const commentsElement = document.getElementById('comments');
                if (commentsElement) commentsElement.value = '';
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
        
        if (this.currentInputType === 'csv') {
            // Save CSV form data
            ['csvRunId', 'csvBand', 'csvDescription', 'csvTraces'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const fieldName = id.replace('csv', '').charAt(0).toLowerCase() + id.replace('csv', '').slice(1);
                    if (!currentPage.csvFormData) currentPage.csvFormData = {};
                    currentPage.csvFormData[fieldName] = element.value;
                }
            });
        } else {
            // Save image form data
            ['runId1', 'band1', 'location1', 'testType1', 'equipmentDescription1', 'operatingCondition1', 'traces1',
             'runId2', 'band2', 'location2', 'testType2', 'equipmentDescription2', 'operatingCondition2', 'traces2'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const imageNum = id.includes('1') ? '1' : '2';
                    const field = id.replace(/[12]$/, '');
                    currentPage[`formData${imageNum}`][field] = element.value;
                }
            });
        }
        
        // Save comments
        const commentsElement = document.getElementById('comments');
        if (commentsElement) {
            currentPage.comments = commentsElement.value;
        }
    }
    
    loadPageData(pageId) {
        const page = this.pages.get(pageId);
        if (!page) return;
        
        if (this.currentInputType === 'csv') {
            // Load CSV form data with null checks
            const csvFormData = page.csvFormData || {};
            const csvRunId = document.getElementById('csvRunId');
            const csvBand = document.getElementById('csvBand');
            const csvDescription = document.getElementById('csvDescription');
            const csvTraces = document.getElementById('csvTraces');
            
            if (csvRunId) csvRunId.value = csvFormData.runId || '';
            if (csvBand) csvBand.value = csvFormData.band || '';
            if (csvDescription) csvDescription.value = csvFormData.description || '';
            if (csvTraces) csvTraces.value = csvFormData.traces || '';
            
            // Update CSV title display
            this.updateCsvTitle(csvFormData);
        } else {
            // Load image form data
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
            
            // Update instruction overlays for images
            if (page.imageState1.image) {
                this.hideInstructionOverlay(1);
            } else {
                this.showInstructionOverlay(1);
            }
            if (page.imageState2.image) {
                this.hideInstructionOverlay(2);
            } else {
                this.showInstructionOverlay(2);
            }
        }
        
        const commentsElement = document.getElementById('comments');
        if (commentsElement) {
            commentsElement.value = page.comments || '';
        }
    }
    
    exportOverlayData() {
        if (this.csvOverlayState.datasets.length === 0) {
            alert('Please load CSV files for overlay comparison first.');
            return;
        }
        
        const comments = document.getElementById('comments').value || '-';
        
        // Create high-resolution overlay export canvas
        const overlayCanvas = this.createOverlayExportCanvas();
        
        // Use CSV form data (not image form data)
        const csvFormData = this.getCsvFormData();
        const exportFormData = {
            runId: csvFormData.runId || 'Overlay',
            band: csvFormData.band || 'Multi-Band', 
            description: csvFormData.description || 'CSV Overlay Comparison',
            traces: csvFormData.traces || ''
        };
        
        this.createExport([overlayCanvas], [exportFormData], comments, `Page ${this.currentPageId} - Overlay Comparison`);
    }
    
    createOverlayExportCanvas() {
        // Create export canvas with company's exact template dimensions
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Company template dimensions: 1554×1038
        const baseWidth = 1554;
        const baseHeight = 1038;
        
        exportCanvas.width = baseWidth;
        exportCanvas.height = baseHeight;
        
        // Company template layout coordinates
        // Main Graph Area: (80, 160) with 1400×700 size
        const graphArea = {
            x: 80,
            y: 160,
            width: 1400,
            height: 700
        };
        
        const margin = { 
            top: graphArea.y, 
            right: baseWidth - (graphArea.x + graphArea.width), 
            bottom: baseHeight - (graphArea.y + graphArea.height), 
            left: graphArea.x 
        };
        
        // Enable highest quality rendering
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // Clear canvas
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, baseWidth, baseHeight);
        
        // Detect band range and filter data
        const detectedBand = this.detectBandFromOverlayData();
        const { filteredDatasets, bandInfo } = this.filterOverlayDataToBand(detectedBand);
        
        // Calculate plot area using graph area dimensions
        const plotWidth = graphArea.width;
        const plotHeight = graphArea.height;
        
        // Draw grid with company specifications: 150px vertical, 100px horizontal
        exportCtx.strokeStyle = '#e0e0e0';
        exportCtx.lineWidth = 1;
        
        // Vertical grid lines (frequency) - every 150px
        const verticalSpacing = 150;
        const numVerticalLines = Math.floor(plotWidth / verticalSpacing) + 1;
        for (let i = 0; i <= numVerticalLines; i++) {
            const x = graphArea.x + (i * verticalSpacing);
            if (x <= graphArea.x + plotWidth) {
                exportCtx.beginPath();
                exportCtx.moveTo(x + 0.5, graphArea.y);
                exportCtx.lineTo(x + 0.5, graphArea.y + plotHeight);
                exportCtx.stroke();
            }
        }
        
        // Horizontal grid lines (amplitude) - every 100px  
        const horizontalSpacing = 100;
        const numHorizontalLines = Math.floor(plotHeight / horizontalSpacing) + 1;
        for (let i = 0; i <= numHorizontalLines; i++) {
            const y = graphArea.y + (i * horizontalSpacing);
            if (y <= graphArea.y + plotHeight) {
                exportCtx.beginPath();
                exportCtx.moveTo(graphArea.x, y + 0.5);
                exportCtx.lineTo(graphArea.x + plotWidth, y + 0.5);
                exportCtx.stroke();
            }
        }
        
        // Remove the black axes - they are annoying as requested
        
        // Draw filtered datasets within graph area using company template coordinates
        const freqRange = bandInfo ? (bandInfo.endMHz * 1e6 - bandInfo.startMHz * 1e6) : (this.csvOverlayState.maxFreq - this.csvOverlayState.minFreq);
        const minFreq = bandInfo ? bandInfo.startMHz * 1e6 : this.csvOverlayState.minFreq;
        const maxFreq = bandInfo ? bandInfo.endMHz * 1e6 : this.csvOverlayState.maxFreq;
        
        // Calculate amplitude range from filtered data
        let minAmp = Infinity;
        let maxAmp = -Infinity;
        filteredDatasets.forEach(dataset => {
            dataset.amplitudeData.forEach(amp => {
                if (amp < minAmp) minAmp = amp;
                if (amp > maxAmp) maxAmp = amp;
            });
        });
        
        // Use the same 10dB increment logic as display
        const amplitudeResult = this.generateAmplitudeTicks(minAmp, maxAmp);
        const actualMinAmp = amplitudeResult.extendedMin;
        const actualMaxAmp = amplitudeResult.extendedMax;
        const ampRange = actualMaxAmp - actualMinAmp;
        
        filteredDatasets.forEach((dataset, index) => {
            exportCtx.strokeStyle = dataset.color;
            exportCtx.lineWidth = 3;
            exportCtx.lineJoin = 'round';
            exportCtx.lineCap = 'round';
            exportCtx.beginPath();
            
            let firstPoint = true;
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                const x = graphArea.x + ((freq - minFreq) / freqRange) * plotWidth;
                const y = graphArea.y + plotHeight - ((amp - actualMinAmp) / ampRange) * plotHeight;
                
                if (firstPoint) {
                    exportCtx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    exportCtx.lineTo(x, y);
                }
            }
            exportCtx.stroke();
        });
        
        // Get dynamic title from user input
        const csvFormData = this.getCsvFormData();
        const dynamicTitle = csvFormData.runId && csvFormData.band ? 
            `Run ${csvFormData.runId} ${csvFormData.band}` : 
            (bandInfo ? `Spectrum Analysis - ${detectedBand} (${bandInfo.range})` : 'Spectrum Analysis Overlay Comparison');
        
        // Company template positioning
        // 1. Title: Centered horizontally at y=50, font ~24-28px
        exportCtx.fillStyle = '#333333';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.font = 'bold 26px Arial';
        exportCtx.fillText(dynamicTitle, baseWidth / 2, 50);
        
        // Draw axis labels using company template coordinates
        exportCtx.font = '14px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        
        // X-axis labels (frequency) - using filtered range
        for (let i = 0; i <= 5; i++) {
            const freq = minFreq + (freqRange * i / 5);
            const x = graphArea.x + (i / 5) * plotWidth;
            const freqMHz = freq / 1e6;
            exportCtx.fillText(this.formatFrequency(freqMHz), x, graphArea.y + plotHeight + 15);
        }
        
        // Y-axis labels (amplitude) - using 10dB increments
        exportCtx.textAlign = 'right';
        exportCtx.textBaseline = 'middle';
        for (let i = 0; i < amplitudeResult.ticks.length; i++) {
            const amp = amplitudeResult.ticks[i];
            const y = graphArea.y + plotHeight - ((amp - actualMinAmp) / ampRange) * plotHeight;
            exportCtx.fillText(amp.toFixed(0) + ' dB', graphArea.x - 15, y);
        }
        
        // 3. X-Axis Label: Centered horizontally at y=900
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.font = 'bold 16px Arial';
        exportCtx.fillText('Frequency', baseWidth / 2, 900);
        
        // 2. Y-Axis Label: x=30, rotated 90° counter-clockwise
        exportCtx.save();
        exportCtx.translate(30, baseHeight / 2);
        exportCtx.rotate(-Math.PI / 2);
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.font = 'bold 16px Arial';
        exportCtx.fillText('Amplitude (dB)', 0, 0);
        exportCtx.restore();
        
        // Draw regulatory limit lines for the detected band range using graph area coordinates
        const freqStartMHz = minFreq / 1e6;
        const freqEndMHz = maxFreq / 1e6;
        this.drawLimitLines(exportCtx, { 
            top: graphArea.y, 
            left: graphArea.x, 
            right: baseWidth - (graphArea.x + graphArea.width), 
            bottom: baseHeight - (graphArea.y + graphArea.height) 
        }, plotWidth, plotHeight, freqStartMHz, freqEndMHz, minAmp, maxAmp);
        
        // 5. Legend Box: (1220, 180) with 250×120 size
        const legendArea = {
            x: 1220,
            y: 180,
            width: 250,
            height: 120
        };
        
        // Draw legend background
        exportCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        exportCtx.fillRect(legendArea.x, legendArea.y, legendArea.width, legendArea.height);
        exportCtx.strokeStyle = '#333';
        exportCtx.lineWidth = 1;
        exportCtx.strokeRect(legendArea.x, legendArea.y, legendArea.width, legendArea.height);
        
        // Draw legend title
        exportCtx.fillStyle = '#333';
        exportCtx.font = 'bold 14px Arial';
        exportCtx.textAlign = 'left';
        exportCtx.textBaseline = 'top';
        exportCtx.fillText('Legend', legendArea.x + 10, legendArea.y + 10);
        
        // Draw legend items
        const itemHeight = 20;
        const startY = legendArea.y + 35;
        
        filteredDatasets.forEach((dataset, index) => {
            const itemY = startY + (index * itemHeight);
            
            // Only draw if within legend area
            if (itemY + itemHeight <= legendArea.y + legendArea.height) {
                // Draw color line
                exportCtx.strokeStyle = dataset.color;
                exportCtx.lineWidth = 3;
                exportCtx.beginPath();
                exportCtx.moveTo(legendArea.x + 15, itemY + itemHeight/2);
                exportCtx.lineTo(legendArea.x + 40, itemY + itemHeight/2);
                exportCtx.stroke();
                
                // Draw dataset name
                exportCtx.fillStyle = '#333';
                exportCtx.font = '12px Arial';
                exportCtx.textAlign = 'left';
                exportCtx.textBaseline = 'middle';
                
                // Truncate long names to fit in legend box
                let displayName = dataset.name;
                const maxWidth = legendArea.width - 60;
                const textWidth = exportCtx.measureText(displayName).width;
                if (textWidth > maxWidth) {
                    const avgCharWidth = textWidth / displayName.length;
                    const maxChars = Math.floor(maxWidth / avgCharWidth) - 3;
                    displayName = displayName.substring(0, maxChars) + '...';
                }
                
                exportCtx.fillText(displayName, legendArea.x + 50, itemY + itemHeight/2);
            }
        });
        
        return exportCanvas;
    }
    
    detectBandFromOverlayData() {
        // Analyze all datasets to determine which band they fall into
        if (!this.csvOverlayState.datasets || this.csvOverlayState.datasets.length === 0) {
            return null;
        }
        
        // Get frequency range from all datasets
        let minFreq = Infinity;
        let maxFreq = -Infinity;
        
        this.csvOverlayState.datasets.forEach(dataset => {
            dataset.frequencyData.forEach(freq => {
                if (freq < minFreq) minFreq = freq;
                if (freq > maxFreq) maxFreq = freq;
            });
        });
        
        // Convert to MHz for band comparison
        const minFreqMHz = minFreq / 1e6;
        const maxFreqMHz = maxFreq / 1e6;
        
        // Find the band that best encompasses the data
        const bands = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
        
        for (let band of bands) {
            const bandInfo = this.bandDefinitions[band];
            // Check if the data falls mostly within this band range
            if (minFreqMHz >= bandInfo.startMHz && maxFreqMHz <= bandInfo.endMHz) {
                console.log(`Detected band: ${band} (${bandInfo.range})`);
                return band;
            }
        }
        
        // If no exact match, find the band that contains the most data
        let bestBand = null;
        let maxOverlap = 0;
        
        for (let band of bands) {
            const bandInfo = this.bandDefinitions[band];
            // Calculate overlap between data range and band range
            const overlapStart = Math.max(minFreqMHz, bandInfo.startMHz);
            const overlapEnd = Math.min(maxFreqMHz, bandInfo.endMHz);
            const overlap = Math.max(0, overlapEnd - overlapStart);
            
            if (overlap > maxOverlap) {
                maxOverlap = overlap;
                bestBand = band;
            }
        }
        
        if (bestBand) {
            console.log(`Auto-detected band: ${bestBand} (best overlap)`);
        }
        
        return bestBand;
    }
    
    filterOverlayDataToBand(detectedBand) {
        if (!detectedBand || !this.bandDefinitions[detectedBand]) {
            // No band detected, return original data
            return {
                filteredDatasets: this.csvOverlayState.datasets,
                bandInfo: null
            };
        }
        
        const bandInfo = this.bandDefinitions[detectedBand];
        const startFreq = bandInfo.startMHz * 1e6; // Convert to Hz
        const endFreq = bandInfo.endMHz * 1e6;     // Convert to Hz
        
        console.log(`Filtering data to ${detectedBand} range: ${this.formatFrequency(bandInfo.startMHz)} - ${this.formatFrequency(bandInfo.endMHz)}`);
        
        // Filter each dataset to only include data within the band range
        const filteredDatasets = this.csvOverlayState.datasets.map(dataset => {
            const filteredFreqData = [];
            const filteredAmpData = [];
            
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                if (freq >= startFreq && freq <= endFreq) {
                    filteredFreqData.push(freq);
                    filteredAmpData.push(dataset.amplitudeData[i]);
                }
            }
            
            return {
                ...dataset,
                frequencyData: filteredFreqData,
                amplitudeData: filteredAmpData
            };
        }).filter(dataset => dataset.frequencyData.length > 0); // Remove datasets with no data in the band
        
        console.log(`Filtered datasets: ${filteredDatasets.length} datasets with data in ${detectedBand}`);
        
        return {
            filteredDatasets,
            bandInfo
        };
    }
    
    exportSingleImage(imageNumber) {
        const currentPage = this.getCurrentPage();
        if (!currentPage) return;
        
        if (this.currentInputType === 'csv') {
            // For CSV mode, always export overlay data (since we simplified to overlay only)
            this.exportOverlayData();
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
        // Create export canvas with company's exact template dimensions
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Company template dimensions: 1554×1038
        const baseWidth = 1554;
        const baseHeight = 1038;
        
        exportCanvas.width = baseWidth;
        exportCanvas.height = baseHeight;
        
        // Company template layout coordinates
        // Main Graph Area: (80, 160) with 1400×700 size
        const graphArea = {
            x: 80,
            y: 160,
            width: 1400,
            height: 700
        };
        
        const margin = { 
            top: graphArea.y, 
            right: baseWidth - (graphArea.x + graphArea.width), 
            bottom: baseHeight - (graphArea.y + graphArea.height), 
            left: graphArea.x 
        };
        
        // Enable highest quality rendering
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // Clear canvas
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, baseWidth, baseHeight);
        
        // Calculate plot area using graph area dimensions
        const plotWidth = graphArea.width;
        const plotHeight = graphArea.height;
        
        // Draw grid with company specifications: 150px vertical, 100px horizontal
        exportCtx.strokeStyle = '#e0e0e0';
        exportCtx.lineWidth = 1;
        
        // Vertical grid lines (frequency) - every 150px
        const verticalSpacing = 150;
        const numVerticalLines = Math.floor(plotWidth / verticalSpacing) + 1;
        for (let i = 0; i <= numVerticalLines; i++) {
            const x = graphArea.x + (i * verticalSpacing);
            if (x <= graphArea.x + plotWidth) {
                exportCtx.beginPath();
                exportCtx.moveTo(x + 0.5, graphArea.y);
                exportCtx.lineTo(x + 0.5, graphArea.y + plotHeight);
                exportCtx.stroke();
            }
        }
        
        // Horizontal grid lines (amplitude) - every 100px  
        const horizontalSpacing = 100;
        const numHorizontalLines = Math.floor(plotHeight / horizontalSpacing) + 1;
        for (let i = 0; i <= numHorizontalLines; i++) {
            const y = graphArea.y + (i * horizontalSpacing);
            if (y <= graphArea.y + plotHeight) {
                exportCtx.beginPath();
                exportCtx.moveTo(graphArea.x, y + 0.5);
                exportCtx.lineTo(graphArea.x + plotWidth, y + 0.5);
                exportCtx.stroke();
            }
        }
        
        // Remove the black axes - they are annoying as requested
        
        // Draw data line with high quality anti-aliasing
        exportCtx.strokeStyle = '#cc0000';
        exportCtx.lineWidth = 3;
        exportCtx.lineJoin = 'round';
        exportCtx.lineCap = 'round';
        exportCtx.beginPath();
        
        const freqRange = csvState.maxFreq - csvState.minFreq;
        
        // Use the same 10dB increment logic as display
        const amplitudeResult = this.generateAmplitudeTicks(csvState.minAmp, csvState.maxAmp);
        const actualMinAmp = amplitudeResult.extendedMin;
        const actualMaxAmp = amplitudeResult.extendedMax;
        const ampRange = actualMaxAmp - actualMinAmp;
        
        let firstPoint = true;
        for (let i = 0; i < csvState.frequencyData.length; i++) {
            const freq = csvState.frequencyData[i];
            const amp = csvState.amplitudeData[i];
            
            const x = graphArea.x + ((freq - csvState.minFreq) / freqRange) * plotWidth;
            const y = graphArea.y + plotHeight - ((amp - actualMinAmp) / ampRange) * plotHeight;
            
            if (firstPoint) {
                exportCtx.moveTo(x, y);
                firstPoint = false;
            } else {
                exportCtx.lineTo(x, y);
            }
        }
        exportCtx.stroke();
        
        // Get dynamic title from user input
        const csvFormData = this.getCsvFormData();
        const dynamicTitle = csvFormData.runId && csvFormData.band ? 
            `Run ${csvFormData.runId} ${csvFormData.band}` : 
            'Spectrum Analysis - High Resolution Export';
        
        // Company template positioning
        // 1. Title: Centered horizontally at y=50, font ~24-28px
        exportCtx.fillStyle = '#333333';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.font = 'bold 26px Arial';
        exportCtx.fillText(dynamicTitle, baseWidth / 2, 50);
        
        // Draw axis labels using company template coordinates
        exportCtx.font = '14px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        
        // X-axis labels (frequency)
        for (let i = 0; i <= 5; i++) {
            const freq = csvState.minFreq + (freqRange * i / 5);
            const x = graphArea.x + (i / 5) * plotWidth;
            const freqMHz = freq / 1e6;
            exportCtx.fillText(this.formatFrequency(freqMHz), x, graphArea.y + plotHeight + 15);
        }
        
        // Y-axis labels (amplitude) - using 10dB increments
        exportCtx.textAlign = 'right';
        exportCtx.textBaseline = 'middle';
        for (let i = 0; i < amplitudeResult.ticks.length; i++) {
            const amp = amplitudeResult.ticks[i];
            const y = graphArea.y + plotHeight - ((amp - actualMinAmp) / ampRange) * plotHeight;
            exportCtx.fillText(amp.toFixed(0) + ' dB', graphArea.x - 15, y);
        }
        
        // 3. X-Axis Label: Centered horizontally at y=900
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.font = 'bold 16px Arial';
        exportCtx.fillText('Frequency', baseWidth / 2, 900);
        
        // 2. Y-Axis Label: x=30, rotated 90° counter-clockwise
        exportCtx.save();
        exportCtx.translate(30, baseHeight / 2);
        exportCtx.rotate(-Math.PI / 2);
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.font = 'bold 16px Arial';
        exportCtx.fillText('Amplitude (dB)', 0, 0);
        exportCtx.restore();
        
        // Draw regulatory limit lines using graph area coordinates
        const freqStartMHz = csvState.minFreq / 1e6;
        const freqEndMHz = csvState.maxFreq / 1e6;
        this.drawLimitLines(exportCtx, { 
            top: graphArea.y, 
            left: graphArea.x, 
            right: baseWidth - (graphArea.x + graphArea.width), 
            bottom: baseHeight - (graphArea.y + graphArea.height) 
        }, plotWidth, plotHeight, freqStartMHz, freqEndMHz, actualMinAmp, actualMaxAmp);
        
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
            const commentsWidth = 300;  // Much narrower comments section
        
        // Use company's exact template dimensions
        const targetCanvasWidth = 1554;  // Company template width
        const targetCanvasHeight = 1038; // Company template height
        
        // Images should take 3/4 of canvas width and 2/3 of canvas height
        const targetImageWidth = targetCanvasWidth * 0.75;   // 3/4 of canvas width
        const targetImageHeight = targetCanvasHeight * 0.67;  // 2/3 of canvas height
        
        // Calculate scaling factors to fit images into target area
        let totalOriginalWidth = 0;
        let maxOriginalHeight = 0;
        
        images.forEach(image => {
            totalOriginalWidth += image.width;
            maxOriginalHeight = Math.max(maxOriginalHeight, image.height);
        });
        
        if (images.length > 1) {
            totalOriginalWidth += imagePadding * (images.length - 1);
        }
        
        // Scale factor to fit all images in target area
        const widthScale = targetImageWidth / totalOriginalWidth;
        const heightScale = targetImageHeight / maxOriginalHeight;
        const imageScale = Math.min(widthScale, heightScale); // Use smaller scale to fit both dimensions
        
        // Calculate actual scaled dimensions
        let totalScaledWidth = 0;
        let maxScaledHeight = 0;
        
        images.forEach(image => {
            const scaledWidth = image.width * imageScale;
            const scaledHeight = image.height * imageScale;
            totalScaledWidth += scaledWidth;
            maxScaledHeight = Math.max(maxScaledHeight, scaledHeight);
        });
        
        if (images.length > 1) {
            totalScaledWidth += imagePadding * (images.length - 1);
        }
        
                 // Set very compact table dimensions to make room for larger images
         const tableWidth = Math.max(totalScaledWidth, 800);  // Smaller minimum width
         const titleHeight = 70;    // Much thinner
         const headerHeight = 60;   // Much thinner
         const dataHeight = 90;     // Much thinner
         const tableHeight = titleHeight + headerHeight + dataHeight;
        
        exportCanvas.width = targetCanvasWidth;
        exportCanvas.height = targetCanvasHeight;
        
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
        exportCtx.font = 'bold 22px Arial';  // Even smaller font for thinner table
        exportCtx.textAlign = 'center';
        exportCtx.fillText(titleText, margin + tableWidth/2, titleY + titleHeight/2 + 8);
        
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
        exportCtx.font = 'bold 18px Arial';  // Smaller font for thinner table
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
            exportCtx.fillText(columnHeaders[i], currentX + columnWidths[i]/2, headerY + headerHeight/2 + 6);
            currentX += columnWidths[i];
        }
        
        // Draw horizontal line between header and data
        exportCtx.beginPath();
        exportCtx.moveTo(margin, dataY);
        exportCtx.lineTo(margin + tableWidth, dataY);
        exportCtx.stroke();
        
        // Use form data directly - no need to build description from parts anymore
        const tracesText = primaryFormData.traces || '';
        
        const tableData = [
            primaryFormData.runId,
            primaryFormData.band,
            primaryFormData.description || '-',
            tracesText
        ];
        
        // Draw data cells
        exportCtx.fillStyle = 'black';
        exportCtx.font = '16px Arial';  // Smaller font for thinner table
        exportCtx.textAlign = 'center';
        
        currentX = margin;
        for (let i = 0; i < tableData.length; i++) {
            const cellY = dataY + dataHeight/2 + 6;
            
            if (i === 2 || i === 3) { // Description and Traces columns - use left align
                exportCtx.textAlign = 'left';
                this.wrapTextInCell(exportCtx, tableData[i], currentX + 8, cellY - 15, columnWidths[i] - 16, dataHeight - 20, 18);
            } else {
                exportCtx.textAlign = 'center';
                exportCtx.fillText(tableData[i], currentX + columnWidths[i]/2, cellY);
            }
            
            currentX += columnWidths[i];
        }
        
        // Draw comments section on the right side - connected to table
        const commentsX = margin + tableWidth;
        const commentsY = titleY;
        const commentsHeight = exportCanvas.height - commentsY - margin; // Full height
        
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(commentsX, commentsY, commentsWidth, commentsHeight);
        exportCtx.strokeStyle = 'black';
        exportCtx.lineWidth = 4;
        exportCtx.strokeRect(commentsX, commentsY, commentsWidth, commentsHeight);
        
        // Comments header
        exportCtx.fillStyle = 'black';
        exportCtx.font = 'bold 16px Arial';  // Even smaller font for very narrow comments section
        exportCtx.textAlign = 'left';
        exportCtx.fillText('Comment', commentsX + 10, commentsY + 25);
        
        // Comments content
        exportCtx.fillStyle = 'black';
        exportCtx.font = '14px Arial';  // Smaller font for very narrow comments section
        const maxCommentsHeight = commentsHeight - 60; // Leave room for header and padding
        this.wrapTextWithMaxHeight(exportCtx, comments, commentsX + 10, commentsY + 50, commentsWidth - 20, 18, maxCommentsHeight);
        
        // Draw images below the table with calculated scaling to fill 3/4 width, 2/3 height
        let imageX = margin;
        const imageY = titleY + tableHeight + margin;
        
        images.forEach((image, index) => {
            const scaledWidth = image.width * imageScale;   // Use calculated scale
            const scaledHeight = image.height * imageScale; // Use calculated scale
            exportCtx.drawImage(image, imageX, imageY, scaledWidth, scaledHeight);
            imageX += scaledWidth + imagePadding;
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
        
        // Set font for measurements - smaller text for thinner table
        ctx.font = '16px Arial';
        
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
        
        // Ensure font is set for measurements - smaller text for narrow comments
        ctx.font = '16px Arial';
        
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
    
    wrapTextWithMaxHeight(ctx, text, x, y, maxWidth, lineHeight, maxHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        // Ensure font is set for measurements
        ctx.font = '14px Arial';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                // Check if we have room for another line
                if (currentY + lineHeight > y + maxHeight) {
                    // Truncate with ellipsis if we're out of space
                    const truncatedLine = line.trim() + '...';
                    ctx.fillText(truncatedLine, x, currentY);
                    return;
                }
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        // Draw final line if we have room
        if (currentY <= y + maxHeight && line.trim()) {
            ctx.fillText(line, x, currentY);
        }
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
        
        // Check if elements exist (they don't in our simplified overlay-only mode)
        if (!uploadArea || !csvInput) {
            console.log(`Skipping CSV upload listeners for ${csvNumber} - elements don't exist in overlay-only mode`);
            return;
        }
        
        uploadArea.addEventListener('click', () => csvInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleCsvDragOver(e, csvNumber));
        uploadArea.addEventListener('drop', (e) => this.handleCsvDrop(e, csvNumber));
        uploadArea.addEventListener('dragleave', (e) => this.handleCsvDragLeave(e, csvNumber));
        
        csvInput.addEventListener('change', (e) => this.handleCsvFileSelect(e, csvNumber));
    }
    
    setupOverlayUploadListeners() {
        console.log('🔧 Setting up CSV overlay upload listeners...');
        
        const uploadArea = document.getElementById('csvOverlayUploadArea');
        const csvInput = document.getElementById('csvOverlayInput');
        
        if (!uploadArea) {
            console.error('❌ csvOverlayUploadArea element not found!');
            return;
        }
        if (!csvInput) {
            console.error('❌ csvOverlayInput element not found!');
            return;
        }
        
        console.log('✅ Found CSV upload elements');
        
        // Remove existing listeners by removing the data attribute and re-adding
        uploadArea.removeAttribute('data-listeners-setup');
        
        // Simple, direct click handler
        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ CSV upload area clicked, triggering file input');
            csvInput.click();
        };
        
        // Remove any existing event listeners by cloning only if necessary
        let freshUploadArea = uploadArea;
        if (uploadArea.hasAttribute('data-cloned')) {
            console.log('ℹ️ Using existing upload area element');
        } else {
            console.log('🔄 Cloning upload area to clear old listeners');
            const newUploadArea = uploadArea.cloneNode(true);
            uploadArea.parentNode.replaceChild(newUploadArea, uploadArea);
            freshUploadArea = document.getElementById('csvOverlayUploadArea');
            freshUploadArea.setAttribute('data-cloned', 'true');
        }
        
        const uploadPlaceholder = freshUploadArea.querySelector('.upload-placeholder');
        
        // Set up click handlers
        freshUploadArea.addEventListener('click', clickHandler);
        console.log('✅ Main upload area click handler attached');
        
        if (uploadPlaceholder) {
            uploadPlaceholder.addEventListener('click', clickHandler);
            console.log('✅ Upload placeholder click handler attached');
        } else {
            console.warn('⚠️ Upload placeholder not found');
        }
        
        // Set up drag and drop
        freshUploadArea.addEventListener('dragover', (e) => this.handleOverlayDragOver(e));
        freshUploadArea.addEventListener('drop', (e) => this.handleOverlayDrop(e));
        freshUploadArea.addEventListener('dragleave', (e) => this.handleOverlayDragLeave(e));
        console.log('✅ Drag and drop handlers attached');
        
        // Set up file input change handler
        csvInput.addEventListener('change', (e) => {
            console.log('📁 CSV file input changed:', e.target.files.length, 'files');
            this.handleOverlayFileSelect(e);
        });
        console.log('✅ File input change handler attached');
        
        // Ensure area is clickable and visible
        freshUploadArea.style.cursor = 'pointer';
        freshUploadArea.style.pointerEvents = 'auto';
        freshUploadArea.style.display = 'block';
        freshUploadArea.style.opacity = '1';
        freshUploadArea.style.position = 'relative';
        freshUploadArea.style.zIndex = '1';
        
        if (uploadPlaceholder) {
            uploadPlaceholder.style.cursor = 'pointer';
            uploadPlaceholder.style.pointerEvents = 'auto';
        }
        
        // Mark that listeners have been set up
        freshUploadArea.setAttribute('data-listeners-setup', 'true');
        
        console.log('✅ CSV upload listeners set up successfully');
        
        // Test the setup immediately
        setTimeout(() => {
            const computedStyle = getComputedStyle(freshUploadArea);
            console.log('🧪 Testing CSV upload setup...', {
                element: !!freshUploadArea,
                hasListeners: freshUploadArea.hasAttribute('data-listeners-setup'),
                isVisible: computedStyle.display !== 'none',
                isClickable: computedStyle.pointerEvents !== 'none',
                opacity: computedStyle.opacity,
                zIndex: computedStyle.zIndex,
                position: computedStyle.position,
                dimensions: `${computedStyle.width} x ${computedStyle.height}`
            });
        }, 100);
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
        
        // Add modern overlay controls (only once when first file is loaded)
        if (this.csvOverlayState.datasets.length === 1) {
            this.addOverlayControls();
        }
        
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
        
        // Check if canvas exists (it doesn't in our simplified overlay-only mode)
        if (!canvas) {
            console.log(`Skipping CSV canvas listeners for ${csvNumber} - canvas doesn't exist in overlay-only mode`);
            return;
        }
        
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
        console.log(`DEBUG: loadCsvFile called for CSV ${csvNumber}, file:`, file.name);
        
        const state = this.getCsvState(csvNumber);
        state.originalFilename = file.name;
        
        // Parse filename and auto-fill the corresponding form fields
        this.parseFilename(file.name, csvNumber);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log(`DEBUG: File read successfully for CSV ${csvNumber}`);
            const csvText = e.target.result;
            console.log(`DEBUG: CSV text length:`, csvText.length);
            this.parseCsvData(csvText, csvNumber);
        };
        reader.onerror = (e) => {
            console.error(`DEBUG: File read error for CSV ${csvNumber}:`, e);
        };
        reader.readAsText(file);
        console.log(`DEBUG: FileReader started for CSV ${csvNumber}`);
    }
    
    parseCsvData(csvText, csvNumber) {
        console.log(`DEBUG: parseCsvData called for CSV ${csvNumber}`);
        
        const state = this.getCsvState(csvNumber);
        const lines = csvText.split('\n').filter(line => line.trim());
        console.log(`DEBUG: Found ${lines.length} non-empty lines`);
        
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
            console.log(`DEBUG: No valid data found in CSV ${csvNumber}`);
            alert('No valid frequency/amplitude data found in CSV file. Expected format: frequency, amplitude');
            return;
        }
        
        console.log(`DEBUG: Parsed ${frequencyData.length} data points for CSV ${csvNumber}`);
        
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
        console.log(`DEBUG: About to call setupCsvCanvas for CSV ${csvNumber}`);
        this.setupCsvCanvas(csvNumber);
        console.log(`DEBUG: About to call drawCsvGraph for CSV ${csvNumber}`);
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
        const containerHeight = (container.clientHeight - 60) * 1.5; // Make chart 1.5x taller
        
        // Use device pixel ratio for very high resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        // Scale context for high DPI
        const ctx = this.getCsvContext(csvNumber);
        ctx.scale(dpr, dpr);
        
        // Auto-scale and center data when first imported
        setTimeout(() => {
            this.autoScaleCsvEnhanced(csvNumber);
        }, 100);
        
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
        // Updated margins to match overlay graph for consistency
        const margin = { 
            top: 50, 
            right: 80, 
            bottom: 100, 
            left: 120 
        };
        
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
        
        // Get band-filtered data and ranges
        const filteredData = this.filterCsvDataToBand(csvNumber);
        
        // Prioritize custom view ranges, then filtered data, then original ranges
        let baseMinFreq, baseMaxFreq, baseMinAmp, baseMaxAmp;
        
        // Check for custom view ranges first (from manual range controls)
        if (state.viewMinFreq !== undefined && state.viewMaxFreq !== undefined) {
            baseMinFreq = state.viewMinFreq;
            baseMaxFreq = state.viewMaxFreq;
        } else if (filteredData.bandInfo && filteredData.frequencyData.length > 0) {
            // Use band frequency range
            baseMinFreq = filteredData.bandInfo.startMHz * 1e6;
            baseMaxFreq = filteredData.bandInfo.endMHz * 1e6;
        } else {
            // Use original full data range
            baseMinFreq = state.minFreq;
            baseMaxFreq = state.maxFreq;
        }
        
        // Check for custom amplitude ranges
        if (state.viewMinAmp !== undefined && state.viewMaxAmp !== undefined) {
            baseMinAmp = state.viewMinAmp;
            baseMaxAmp = state.viewMaxAmp;
        } else if (filteredData.bandInfo && filteredData.amplitudeData.length > 0) {
            // Use filtered amplitude range
            baseMinAmp = filteredData.minAmp;
            baseMaxAmp = filteredData.maxAmp;
        } else {
            // Use original full data range
            baseMinAmp = state.minAmp;
            baseMaxAmp = state.maxAmp;
        }
        
        // Calculate data ranges with zoom and pan
        const freqRange = (baseMaxFreq - baseMinFreq) / state.scale;
        const ampRange = (baseMaxAmp - baseMinAmp) / state.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (baseMinFreq + baseMaxFreq) / 2 - (state.offsetX / plotWidth) * freqRange;
        const ampCenter = (baseMinAmp + baseMaxAmp) / 2 + (state.offsetY / plotHeight) * ampRange;
        
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
        
        // Draw data line with anti-aliasing - use filtered data for band display
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        // Use filtered data if band is selected and has data, otherwise use original data
        const displayFreqData = (filteredData.bandInfo && filteredData.frequencyData.length > 0) 
            ? filteredData.frequencyData 
            : state.frequencyData;
        const displayAmpData = (filteredData.bandInfo && filteredData.amplitudeData.length > 0) 
            ? filteredData.amplitudeData 
            : state.amplitudeData;
        
        // Get clean 10dB increment ticks with extended range for drawing calculations
        const amplitudeResult = this.generateAmplitudeTicks(
            Math.min(...displayAmpData), 
            Math.max(...displayAmpData)
        );
        
        // Use extended range for all drawing calculations
        const actualAmpStart = amplitudeResult.extendedMin;
        const actualAmpEnd = amplitudeResult.extendedMax;
        const actualAmpRange = actualAmpEnd - actualAmpStart;
        
        let firstPoint = true;
        for (let i = 0; i < displayFreqData.length; i++) {
            const freq = displayFreqData[i];
            const amp = displayAmpData[i];
            
            // Skip points outside current zoom range
            if (freq < freqStart || freq > freqEnd) continue;
            
            const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
            const y = scaledMargin.top + plotHeight - ((amp - actualAmpStart) / actualAmpRange) * plotHeight;
            
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
        
        // X-axis labels (frequency) - use 10 divisions with nice round numbers
        const frequencyTicks = this.generateFrequencyTicks(freqStart, freqEnd);
        
        for (let i = 0; i < frequencyTicks.length; i++) {
            const freq = frequencyTicks[i];
            const x = margin.left + ((freq - freqStart) / freqRange) * plotWidth;
            const freqMHz = freq / 1e6;
            
            ctx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 10);
        }
        
        // Y-axis labels (amplitude) - use enhanced 10dB increments with extended range
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < amplitudeResult.ticks.length; i++) {
            const amp = amplitudeResult.ticks[i];
            const y = margin.top + plotHeight - ((amp - actualAmpStart) / actualAmpRange) * plotHeight;
            ctx.fillText(amp.toFixed(0) + ' dB', margin.left - 15, y);
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
        
        for (let i = 0; i < displayFreqData.length; i++) {
            const freq = displayFreqData[i];
            const amp = displayAmpData[i];
            
            if (freq < freqStart || freq > freqEnd) continue;
            
            const x = scaledMargin.left + ((freq - freqStart) / freqRange) * plotWidth;
            const y = scaledMargin.top + plotHeight - ((amp - actualAmpStart) / actualAmpRange) * plotHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Draw regulatory limit lines
        const freqStartMHz = freqStart / 1e6;
        const freqEndMHz = freqEnd / 1e6;
        this.drawLimitLines(ctx, margin, plotWidth, plotHeight, freqStartMHz, freqEndMHz, actualAmpStart, actualAmpEnd);
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
        
        // Convert click coordinates to frequency/amplitude values - use same margins as drawCsvGraph
        const margin = { 
            top: 50, 
            right: 80, 
            bottom: 100, 
            left: 120 
        };
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
        
        // Use same margins as drawCsvGraph for consistency
        const margin = { 
            top: 50, 
            right: 80, 
            bottom: 100, 
            left: 120 
        };
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
            // this.autoSelectBandButton(detectedBand); // TEMPORARILY COMMENTED OUT
            
            console.log(`CSV ${csvNumber} Peak identified:`, {
                frequency: this.formatFrequency(frequencyMHz),
                amplitude: amplitude.toFixed(1) + ' dB',
                band: detectedBand
            });
        } else {
            console.log(`CSV ${csvNumber} Peak at ${this.formatFrequency(frequencyMHz)} is outside defined bands`);
        }
    }
    
    /**
     * Calculate nice rounded frequency and amplitude ranges for clean scaling
     * @param {number} minFreq - Minimum frequency in Hz
     * @param {number} maxFreq - Maximum frequency in Hz  
     * @param {number} minAmp - Minimum amplitude in dB
     * @param {number} maxAmp - Maximum amplitude in dB
     * @returns {Object} Object with nice rounded ranges
     */
    calculateNiceRanges(minFreq, maxFreq, minAmp, maxAmp) {
        // Convert frequencies to MHz for easier calculation
        const minFreqMHz = minFreq / 1e6;
        const maxFreqMHz = maxFreq / 1e6;
        const freqRangeMHz = maxFreqMHz - minFreqMHz;
        
        // Calculate nice frequency step size
        let freqStep;
        if (freqRangeMHz >= 2000) {
            freqStep = Math.ceil(freqRangeMHz / 10 / 500) * 500; // 500 MHz steps
        } else if (freqRangeMHz >= 1000) {
            freqStep = Math.ceil(freqRangeMHz / 10 / 100) * 100; // 100 MHz steps
        } else if (freqRangeMHz >= 200) {
            freqStep = Math.ceil(freqRangeMHz / 10 / 50) * 50; // 50 MHz steps
        } else if (freqRangeMHz >= 100) {
            freqStep = Math.ceil(freqRangeMHz / 10 / 10) * 10; // 10 MHz steps
        } else if (freqRangeMHz >= 20) {
            freqStep = Math.ceil(freqRangeMHz / 10 / 5) * 5; // 5 MHz steps
        } else if (freqRangeMHz >= 10) {
            freqStep = Math.ceil(freqRangeMHz / 10 / 2) * 2; // 2 MHz steps
        } else if (freqRangeMHz >= 2) {
            freqStep = Math.ceil(freqRangeMHz / 10); // 1 MHz steps
        } else {
            freqStep = Math.ceil(freqRangeMHz / 10 * 10) / 10; // 0.1 MHz steps
        }
        
        // Calculate nice frequency bounds
        const niceMinFreqMHz = Math.floor(minFreqMHz / freqStep) * freqStep;
        const niceMaxFreqMHz = Math.ceil(maxFreqMHz / freqStep) * freqStep;
        
        // Calculate nice amplitude step size (prefer 10 dB increments)
        const ampRange = maxAmp - minAmp;
        let ampStep;
        if (ampRange >= 100) {
            ampStep = 20; // 20 dB steps for very large ranges
        } else if (ampRange >= 50) {
            ampStep = 10; // 10 dB steps 
        } else if (ampRange >= 20) {
            ampStep = 5; // 5 dB steps
        } else {
            ampStep = Math.max(1, Math.ceil(ampRange / 10)); // At least 1 dB steps
        }
        
        // Calculate nice amplitude bounds with some padding
        const padding = Math.max(5, ampRange * 0.1); // At least 5 dB padding
        const niceMinAmp = Math.floor((minAmp - padding) / ampStep) * ampStep;
        const niceMaxAmp = Math.ceil((maxAmp + padding) / ampStep) * ampStep;
        
        return {
            freqMin: niceMinFreqMHz * 1e6, // Convert back to Hz
            freqMax: niceMaxFreqMHz * 1e6,
            freqStep: freqStep,
            ampMin: niceMinAmp,
            ampMax: niceMaxAmp,
            ampStep: ampStep
        };
    }

    resetZoomCsv(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state.frequencyData.length) return;
        
        // Get data bounds
        const minFreq = Math.min(...state.frequencyData);
        const maxFreq = Math.max(...state.frequencyData);
        const minAmp = Math.min(...state.amplitudeData);
        const maxAmp = Math.max(...state.amplitudeData);
        
        // Calculate nice rounded ranges
        const niceRanges = this.calculateNiceRanges(minFreq, maxFreq, minAmp, maxAmp);
        
        // Set nice view boundaries
        state.viewMinFreq = niceRanges.freqMin;
        state.viewMaxFreq = niceRanges.freqMax;
        state.viewMinAmp = niceRanges.ampMin;
        state.viewMaxAmp = niceRanges.ampMax;
        
        // Reset zoom parameters
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        
        // Mark as using nice scaling
        state.useNiceScaling = true;
        
        this.drawCsvGraph(csvNumber);
    }
    
    // =============================== ENHANCED SPECTRUM FEATURES ===============================
    
    /**
     * Generate amplitude ticks with clean 10dB increments and extended range
     * @param {number} minAmp - Minimum amplitude value
     * @param {number} maxAmp - Maximum amplitude value
     * @returns {Object} Object with extended range and tick values
     */
    generateAmplitudeTicks(minAmp, maxAmp) {
        // Extend the range beyond the signal for better visualization
        const range = maxAmp - minAmp;
        const extension = Math.max(10, range * 0.15); // At least 10dB extension
        
        const extendedMin = minAmp - extension;
        const extendedMax = maxAmp + extension;
        
        // Round to nice 10dB boundaries
        const minTick = Math.floor(extendedMin / 10) * 10;
        const maxTick = Math.ceil(extendedMax / 10) * 10;
        
        const ticks = [];
        for (let amp = minTick; amp <= maxTick; amp += 10) {
            ticks.push(amp);
        }
        
        return {
            ticks: ticks,
            extendedMin: minTick,
            extendedMax: maxTick
        };
    }
    
    /**
     * Generate frequency ticks with exactly 10 divisions
     * @param {number} minFreq - Minimum frequency in Hz
     * @param {number} maxFreq - Maximum frequency in Hz
     * @returns {Array} Array of frequency tick values in Hz
     */
    generateFrequencyTicks(minFreq, maxFreq) {
        const minFreqMHz = minFreq / 1e6;
        const maxFreqMHz = maxFreq / 1e6;
        const rangeMHz = maxFreqMHz - minFreqMHz;
        
        // Calculate nice step size for exactly 10 divisions
        const rawStep = rangeMHz / 10;
        
        // Round to nice numbers
        let step;
        if (rawStep >= 1000) {
            step = Math.ceil(rawStep / 1000) * 1000; // Round to nearest 1000 MHz
        } else if (rawStep >= 500) {
            step = Math.ceil(rawStep / 500) * 500; // Round to nearest 500 MHz
        } else if (rawStep >= 100) {
            step = Math.ceil(rawStep / 100) * 100; // Round to nearest 100 MHz
        } else if (rawStep >= 50) {
            step = Math.ceil(rawStep / 50) * 50; // Round to nearest 50 MHz
        } else if (rawStep >= 10) {
            step = Math.ceil(rawStep / 10) * 10; // Round to nearest 10 MHz
        } else if (rawStep >= 1) {
            step = Math.ceil(rawStep); // Round to nearest 1 MHz
        } else {
            step = Math.ceil(rawStep * 10) / 10; // Round to nearest 0.1 MHz
        }
        
        // Find nice starting point
        const startMHz = Math.floor(minFreqMHz / step) * step;
        
        const ticks = [];
        for (let i = 0; i <= 12; i++) { // Generate a few extra to ensure coverage
            const freqMHz = startMHz + (i * step);
            if (freqMHz >= minFreqMHz && freqMHz <= maxFreqMHz) {
                ticks.push(freqMHz * 1e6); // Convert back to Hz
            }
        }
        
        // Ensure we have at least the start and end points
        if (!ticks.includes(minFreq)) {
            ticks.unshift(minFreq);
        }
        if (!ticks.includes(maxFreq)) {
            ticks.push(maxFreq);
        }
        
        return ticks.sort((a, b) => a - b);
    }
    
    /**
     * Auto-scale and center the CSV data intelligently
     * @param {number} csvNumber - CSV graph number
     */
    autoScaleCsvEnhanced(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state.frequencyData.length) return;
        
        // Get current band selection for filtering
        const selectedBand = this.getSelectedBand();
        let filteredFreqData = state.frequencyData;
        let filteredAmpData = state.amplitudeData;
        
        // Filter to band range if a band is selected
        if (selectedBand && this.bandDefinitions[selectedBand]) {
            const bandInfo = this.bandDefinitions[selectedBand];
            const startFreq = bandInfo.startMHz * 1e6;
            const endFreq = bandInfo.endMHz * 1e6;
            
            const tempFreq = [];
            const tempAmp = [];
            
            for (let i = 0; i < state.frequencyData.length; i++) {
                const freq = state.frequencyData[i];
                if (freq >= startFreq && freq <= endFreq) {
                    tempFreq.push(freq);
                    tempAmp.push(state.amplitudeData[i]);
                }
            }
            
            if (tempFreq.length > 0) {
                filteredFreqData = tempFreq;
                filteredAmpData = tempAmp;
            }
        }
        
        // Find data range from filtered data
        const minFreq = Math.min(...filteredFreqData);
        const maxFreq = Math.max(...filteredFreqData);
        const minAmp = Math.min(...filteredAmpData);
        const maxAmp = Math.max(...filteredAmpData);
        
        // Calculate center points
        const freqCenter = (minFreq + maxFreq) / 2;
        const ampCenter = (minAmp + maxAmp) / 2;
        
        // Reset zoom and center on the data
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        
        // Store the centered range for drawing
        state.centeredMinFreq = minFreq;
        state.centeredMaxFreq = maxFreq;
        state.centeredMinAmp = minAmp;
        state.centeredMaxAmp = maxAmp;
        state.autoScaled = true;
        
        this.drawCsvGraph(csvNumber);
    }
    
    /**
     * Get currently selected band from UI
     * @returns {string|null} Selected band identifier
     */
    getSelectedBand() {
        const selectedButton = document.querySelector('.band-btn.active');
        return selectedButton ? selectedButton.dataset.band : null;
    }
    
    /**
     * Filter CSV data to selected band range
     * @param {number} csvNumber - CSV graph number
     * @returns {Object} Filtered frequency and amplitude data
     */
    filterCsvDataToBand(csvNumber) {
        const state = this.getCsvState(csvNumber);
        const selectedBand = this.getSelectedBand();
        
        if (!selectedBand || !this.bandDefinitions[selectedBand]) {
            return {
                frequencyData: state.frequencyData,
                amplitudeData: state.amplitudeData,
                minFreq: state.minFreq,
                maxFreq: state.maxFreq,
                minAmp: state.minAmp,
                maxAmp: state.maxAmp,
                bandInfo: null
            };
        }
        
        const bandInfo = this.bandDefinitions[selectedBand];
        const startFreq = bandInfo.startMHz * 1e6;
        const endFreq = bandInfo.endMHz * 1e6;
        
        const filteredFreqData = [];
        const filteredAmpData = [];
        
        for (let i = 0; i < state.frequencyData.length; i++) {
            const freq = state.frequencyData[i];
            if (freq >= startFreq && freq <= endFreq) {
                filteredFreqData.push(freq);
                filteredAmpData.push(state.amplitudeData[i]);
            }
        }
        
        const minFreq = filteredFreqData.length > 0 ? Math.min(...filteredFreqData) : startFreq;
        const maxFreq = filteredFreqData.length > 0 ? Math.max(...filteredFreqData) : endFreq;
        const minAmp = filteredAmpData.length > 0 ? Math.min(...filteredAmpData) : state.minAmp;
        const maxAmp = filteredAmpData.length > 0 ? Math.max(...filteredAmpData) : state.maxAmp;
        
        return {
            frequencyData: filteredFreqData,
            amplitudeData: filteredAmpData,
            minFreq,
            maxFreq,
            minAmp,
            maxAmp,
            bandInfo
        };
    }
    
    addCsvControls(csvNumber) {
        console.log(`DEBUG: addCsvControls called for CSV ${csvNumber}`);
        
        // Remove existing controls if any
        const existingControls = document.querySelector(`#csvControls${csvNumber}`);
        if (existingControls) {
            console.log(`DEBUG: Removing existing controls for CSV ${csvNumber}`);
            existingControls.remove();
        }

        const canvas = this.getCsvCanvas(csvNumber);
        const state = this.getCsvState(csvNumber);

        if (!state || !state.frequencyData.length) {
            console.log(`DEBUG: No state or frequency data for CSV ${csvNumber}`);
            return;
        }

        console.log(`DEBUG: Creating modern controls for CSV ${csvNumber}`);

        // Create modern CSV controls with manual range inputs
        const controls = document.createElement('div');
        controls.className = 'csv-controls-modern';
        controls.id = `csvControls${csvNumber}`;
        controls.innerHTML = `
            <div class="control-panel-header">
                <span class="panel-title">📊 Plot Controls</span>
                <button class="panel-collapse-btn" id="togglePanel${csvNumber}">−</button>
            </div>
            
            <div class="control-panel-content" id="panelContent${csvNumber}">
                <!-- Primary Controls Row -->
                <div class="control-row primary-controls">
                    <div class="control-group zoom-group">
                        <button class="modern-btn zoom-btn" id="csvZoomOut${csvNumber}" title="Zoom Out">
                            <span class="btn-icon">🔍</span>−
                        </button>
                        <div class="zoom-display" id="csvZoomLevel${csvNumber}">${Math.round(state.scale * 100)}%</div>
                        <button class="modern-btn zoom-btn" id="csvZoomIn${csvNumber}" title="Zoom In">
                            <span class="btn-icon">🔍</span>+
                        </button>
                    </div>
                    
                    <div class="control-group action-group">
                        <button class="modern-btn reset-btn" id="csvResetZoom${csvNumber}" title="Reset to Nice View">
                            <span class="btn-icon">🎯</span>Reset Zoom
                        </button>
                        <button class="modern-btn auto-btn" id="csvAutoScale${csvNumber}" title="Auto Scale to Data">
                            <span class="btn-icon">📏</span>Auto Scale
                        </button>
                        <button class="modern-btn fullscreen-btn" id="csvFullScreen${csvNumber}" title="Full Screen View">
                            <span class="btn-icon">⛶</span>Full Screen
                        </button>
                    </div>
                </div>

                <!-- Manual Range Controls -->
                <div class="control-row range-controls">
                    <div class="range-group frequency-range">
                        <label class="range-label">📶 Frequency Range (MHz)</label>
                        <div class="input-pair">
                            <input type="number" class="range-input" id="csvFreqMin${csvNumber}" 
                                   placeholder="Min" step="0.1" title="Minimum Frequency">
                            <span class="input-separator">to</span>
                            <input type="number" class="range-input" id="csvFreqMax${csvNumber}" 
                                   placeholder="Max" step="0.1" title="Maximum Frequency">
                            <button class="apply-btn" id="csvApplyFreq${csvNumber}" title="Apply Frequency Range">Apply</button>
                        </div>
                    </div>
                    
                    <div class="range-group amplitude-range">
                        <label class="range-label">📈 Amplitude Range (dB)</label>
                        <div class="input-pair">
                            <input type="number" class="range-input" id="csvAmpMin${csvNumber}" 
                                   placeholder="Min" step="1" title="Minimum Amplitude">
                            <span class="input-separator">to</span>
                            <input type="number" class="range-input" id="csvAmpMax${csvNumber}" 
                                   placeholder="Max" step="1" title="Maximum Amplitude">
                            <button class="apply-btn" id="csvApplyAmp${csvNumber}" title="Apply Amplitude Range">Apply</button>
                        </div>
                    </div>
                </div>

                <!-- Peak Detection Controls -->
                <div class="control-row peak-controls">
                    <button class="modern-btn peak-detect-btn" id="csvAutoPeaks${csvNumber}" title="Automatically detect peaks">
                        <span class="btn-icon">🔍</span>Auto Detect Peaks
                    </button>
                    <button class="modern-btn settings-btn" id="csvPeakSettings${csvNumber}" title="Peak detection settings">
                        <span class="btn-icon">⚙️</span>Settings
                    </button>
                </div>
            </div>

            <!-- Collapsible Peak Settings Panel -->
            <div class="peak-settings-panel-modern" id="csvPeakSettings${csvNumber}Panel" style="display: none;">
                <div class="settings-header">
                    <span class="settings-title">🎯 Peak Detection Settings</span>
                </div>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label>Sensitivity Level</label>
                        <select id="csvPeakSensitivity${csvNumber}">
                            <option value="low">Low (Major peaks only)</option>
                            <option value="medium" selected>Medium (Balanced)</option>
                            <option value="high">High (More sensitive)</option>
                            <option value="custom">Custom Parameters</option>
                        </select>
                    </div>
                    <div class="setting-item custom-settings" id="csvCustomSettings${csvNumber}" style="display: none;">
                        <label>Min Height (dB)</label>
                        <input type="number" id="csvMinHeight${csvNumber}" value="10" step="1" min="1" max="50">
                    </div>
                    <div class="setting-item custom-settings" id="csvCustomSettings2${csvNumber}" style="display: none;">
                        <label>Min Distance (%)</label>
                        <input type="number" id="csvMinDistance${csvNumber}" value="2" step="0.5" min="0.1" max="10">
                    </div>
                    <div class="setting-item">
                        <label>Detection Range</label>
                        <select id="csvFreqRange${csvNumber}">
                            <option value="full">Full spectrum</option>
                            <option value="current">Current view only</option>
                            <option value="band">Current band only</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        // Find where to append - use document.body as fallback
        const parentElement = canvas.parentElement || document.body;
        parentElement.appendChild(controls);
        
        console.log(`DEBUG: Controls created and appended to:`, parentElement);
        console.log(`DEBUG: Controls element:`, controls);

        // Add event listeners for the new controls
        this.setupModernControlListeners(csvNumber);
        
        // Initialize range inputs with current view
        this.updateRangeInputs(csvNumber);
        
        // Update zoom display
        this.updateCsvZoomDisplay(csvNumber);
        
        console.log(`DEBUG: Modern controls setup complete for CSV ${csvNumber}`);
    }

    setupModernControlListeners(csvNumber) {
        // Panel collapse/expand
        document.getElementById(`togglePanel${csvNumber}`).addEventListener('click', () => {
            const content = document.getElementById(`panelContent${csvNumber}`);
            const btn = document.getElementById(`togglePanel${csvNumber}`);
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = '−';
            } else {
                content.style.display = 'none';
                btn.textContent = '+';
            }
        });

        // Zoom controls
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
            this.updateRangeInputs(csvNumber);
        });

        document.getElementById(`csvAutoScale${csvNumber}`).addEventListener('click', () => {
            this.autoScaleCsvEnhanced(csvNumber);
            this.updateCsvZoomDisplay(csvNumber);
            this.updateRangeInputs(csvNumber);
        });

        document.getElementById(`csvFullScreen${csvNumber}`).addEventListener('click', () => {
            this.enterFullScreenCsv(csvNumber);
        });

        // Manual range controls
        document.getElementById(`csvApplyFreq${csvNumber}`).addEventListener('click', () => {
            this.applyFrequencyRange(csvNumber);
        });

        document.getElementById(`csvApplyAmp${csvNumber}`).addEventListener('click', () => {
            this.applyAmplitudeRange(csvNumber);
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
            const customSettings = document.querySelectorAll(`#csvCustomSettings${csvNumber}, #csvCustomSettings2${csvNumber}`);
            customSettings.forEach(setting => {
                setting.style.display = e.target.value === 'custom' ? 'block' : 'none';
            });
        });

        // Enter key support for range inputs
        [
            `csvFreqMin${csvNumber}`, `csvFreqMax${csvNumber}`,
            `csvAmpMin${csvNumber}`, `csvAmpMax${csvNumber}`
        ].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (id.includes('Freq')) {
                        this.applyFrequencyRange(csvNumber);
                    } else {
                        this.applyAmplitudeRange(csvNumber);
                    }
                }
            });
        });
    }

    updateRangeInputs(csvNumber) {
        const state = this.getCsvState(csvNumber);
        if (!state.frequencyData.length) return;

        // Get current view bounds (either nice scaling or data bounds)
        let minFreq = state.viewMinFreq || Math.min(...state.frequencyData);
        let maxFreq = state.viewMaxFreq || Math.max(...state.frequencyData);
        let minAmp = state.viewMinAmp || Math.min(...state.amplitudeData);
        let maxAmp = state.viewMaxAmp || Math.max(...state.amplitudeData);

        // Convert frequency to MHz for display
        document.getElementById(`csvFreqMin${csvNumber}`).value = (minFreq / 1e6).toFixed(1);
        document.getElementById(`csvFreqMax${csvNumber}`).value = (maxFreq / 1e6).toFixed(1);
        document.getElementById(`csvAmpMin${csvNumber}`).value = Math.round(minAmp);
        document.getElementById(`csvAmpMax${csvNumber}`).value = Math.round(maxAmp);
    }

    applyFrequencyRange(csvNumber) {
        const minInput = document.getElementById(`csvFreqMin${csvNumber}`);
        const maxInput = document.getElementById(`csvFreqMax${csvNumber}`);
        
        const minFreqMHz = parseFloat(minInput.value);
        const maxFreqMHz = parseFloat(maxInput.value);
        
        if (isNaN(minFreqMHz) || isNaN(maxFreqMHz) || minFreqMHz >= maxFreqMHz) {
            alert('Please enter valid frequency range (Min < Max)');
            return;
        }

        const state = this.getCsvState(csvNumber);
        state.viewMinFreq = minFreqMHz * 1e6; // Convert to Hz
        state.viewMaxFreq = maxFreqMHz * 1e6;
        state.useNiceScaling = true;
        
        // Reset zoom parameters to show the full custom range
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        
        // Clear any existing pan/zoom to ensure we see the exact specified range
        state.isDragging = false;
        
        this.drawCsvGraph(csvNumber);
        this.updateCsvZoomDisplay(csvNumber);
    }

    applyAmplitudeRange(csvNumber) {
        const minInput = document.getElementById(`csvAmpMin${csvNumber}`);
        const maxInput = document.getElementById(`csvAmpMax${csvNumber}`);
        
        const minAmp = parseFloat(minInput.value);
        const maxAmp = parseFloat(maxInput.value);
        
        if (isNaN(minAmp) || isNaN(maxAmp) || minAmp >= maxAmp) {
            alert('Please enter valid amplitude range (Min < Max)');
            return;
        }

        const state = this.getCsvState(csvNumber);
        state.viewMinAmp = minAmp;
        state.viewMaxAmp = maxAmp;
        state.useNiceScaling = true;
        
        // Reset zoom parameters to show the full custom range
        state.scale = 1;
        state.offsetX = 0;
        state.offsetY = 0;
        
        // Clear any existing pan/zoom to ensure we see the exact specified range
        state.isDragging = false;
        
        this.drawCsvGraph(csvNumber);
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
        const containerWidth = container.clientWidth - 40; // More padding for margins
        
        // Implement 1:2 aspect ratio (height:width)
        const targetHeight = containerWidth / 2;  // 1:2 ratio
        const containerHeight = Math.max(300, Math.min(targetHeight, container.clientHeight - 150));
        
        // Use device pixel ratio for very high resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        // Scale context for high DPI
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        console.log(`Canvas set to ${containerWidth}x${containerHeight} (${(containerWidth/containerHeight).toFixed(2)}:1 ratio)`);
    }
    
    drawOverlayGraph() {
        const canvas = document.getElementById('csvOverlayCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        // Use logical pixel dimensions for calculations
        const width = canvas.style.width ? parseInt(canvas.style.width) : canvas.width;
        const height = canvas.style.height ? parseInt(canvas.style.height) : canvas.height;
        // Increased margins to ensure axes are fully visible
        const margin = { 
            top: 50, 
            right: 80, 
            bottom: this.csvOverlayState.datasets.length > 0 ? 140 : 100, 
            left: 120 
        };
        
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
        
        // For folder-based selection, skip filtering since we already ensure same-band files
        // For old CSV upload method, detect band and filter data for cleaner on-screen display
        const usingFolderSelection = this.folderSelectionState && this.folderSelectionState.plottedFiles.length > 0;
        
        let displayDatasets, detectedBand, bandInfo;
        
        if (usingFolderSelection) {
            // Use all datasets directly - no filtering needed since folder selection ensures same band
            displayDatasets = this.csvOverlayState.datasets;
            detectedBand = this.csvOverlayState.datasets.length > 0 ? 
                this.detectBandFromFilename(this.csvOverlayState.datasets[0].name) : 'Unknown';
            bandInfo = null; // We'll get this if needed for title
            
            console.log('=== Folder-Based Overlay Drawing (No Filtering) ===');
        } else {
            // Original filtering logic for old CSV upload method
            detectedBand = this.detectBandFromOverlayData();
            const filterResult = this.filterOverlayDataToBand(detectedBand);
            displayDatasets = filterResult.filteredDatasets.length > 0 ? 
                filterResult.filteredDatasets : this.csvOverlayState.datasets;
            bandInfo = filterResult.bandInfo;
            
            console.log('=== Traditional CSV Overlay Drawing (With Filtering) ===');
        }
        
        console.log(`Total datasets loaded: ${this.csvOverlayState.datasets.length}`);
        console.log('Datasets info:', this.csvOverlayState.datasets.map(d => ({
            name: d.name,
            color: d.color,
            visible: d.visible,
            dataPoints: d.frequencyData.length
        })));
        console.log(`Detected band: ${detectedBand}`);
        console.log(`Using datasets for display: ${displayDatasets.length} datasets`);
        console.log('Display datasets:', displayDatasets.map(d => ({
            name: d.name,
            color: d.color,
            visible: d.visible
        })));
        
        // Update the display title to show detected band
        if (detectedBand !== 'Unknown') {
            const titleElement = document.querySelector('.csv-overlay-title');
            if (titleElement) {
                const titleText = bandInfo ? 
                    `Spectrum Analysis - ${detectedBand} (${bandInfo.range})` :
                    `Spectrum Analysis - ${detectedBand}`;
                titleElement.textContent = titleText;
            }
        }
        
        // Calculate plot area
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Apply zoom and pan
        const scaledMargin = {
            left: margin.left + this.csvOverlayState.offsetX,
            top: margin.top + this.csvOverlayState.offsetY
        };
        
        // Calculate data ranges - prioritize custom ranges, then band range, then full data range
        let baseMinFreq, baseMaxFreq, baseMinAmp, baseMaxAmp;
        
        // Check for custom frequency range first
        if (this.csvOverlayState.viewMinFreq !== undefined && this.csvOverlayState.viewMaxFreq !== undefined) {
            baseMinFreq = this.csvOverlayState.viewMinFreq;
            baseMaxFreq = this.csvOverlayState.viewMaxFreq;
        } else if (bandInfo && filteredDatasets.length > 0) {
            baseMinFreq = bandInfo.startMHz * 1e6;
            baseMaxFreq = bandInfo.endMHz * 1e6;
        } else {
            baseMinFreq = this.csvOverlayState.minFreq;
            baseMaxFreq = this.csvOverlayState.maxFreq;
        }
        
        // Check for custom amplitude range first - THIS IS THE KEY FIX!
        if (this.csvOverlayState.viewMinAmp !== undefined && this.csvOverlayState.viewMaxAmp !== undefined) {
            baseMinAmp = this.csvOverlayState.viewMinAmp;
            baseMaxAmp = this.csvOverlayState.viewMaxAmp;
        } else if (bandInfo && filteredDatasets.length > 0) {
            // Calculate amplitude range from filtered data
            baseMinAmp = Infinity;
            baseMaxAmp = -Infinity;
            filteredDatasets.forEach(dataset => {
                dataset.amplitudeData.forEach(amp => {
                    if (amp < baseMinAmp) baseMinAmp = amp;
                    if (amp > baseMaxAmp) baseMaxAmp = amp;
                });
            });
        } else {
            // Use original full range
            baseMinAmp = this.csvOverlayState.minAmp;
            baseMaxAmp = this.csvOverlayState.maxAmp;
        }
        
        // Calculate ranges with zoom and pan
        const freqRange = (baseMaxFreq - baseMinFreq) / this.csvOverlayState.scale;
        const ampRange = (baseMaxAmp - baseMinAmp) / this.csvOverlayState.scale;
        
        // Calculate center point based on pan offset
        const freqCenter = (baseMinFreq + baseMaxFreq) / 2 - (this.csvOverlayState.offsetX / plotWidth) * freqRange;
        const ampCenter = (baseMinAmp + baseMaxAmp) / 2 + (this.csvOverlayState.offsetY / plotHeight) * ampRange;
        
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
        
        // Axis lines removed for cleaner appearance - professional look without distracting black lines
        
        // Get band frequency ranges for filtering 
        const bandRanges = this.getBandRanges();
        
        // Draw each filtered dataset with high quality
        console.log(`=== Drawing ${displayDatasets.length} datasets ===`);
        displayDatasets.forEach((dataset, index) => {
            console.log(`Drawing dataset ${index}: ${dataset.name}, color: ${dataset.color}, visible: ${dataset.visible}`);
            if (!dataset.visible) {
                console.log(`Skipping dataset ${index} - not visible`);
                return;
            }
            
            // Detect band for this dataset to apply frequency filtering
            const datasetBand = this.detectBandFromFilename(dataset.name);
            const bandRange = bandRanges[datasetBand];
            console.log(`Dataset ${index} detected as ${datasetBand}, frequency range: ${bandRange ? `${bandRange.min/1e6}-${bandRange.max/1e6} MHz` : 'no limit'}`);
            
            // Draw data line with anti-aliasing
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 3; // Make lines slightly thicker for better visibility
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            let firstPoint = true;
            let pointsDrawn = 0;
            let pointsFiltered = 0;
            
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                // Apply band frequency filtering - only plot data within band range
                if (bandRange && (freq < bandRange.min || freq > bandRange.max)) {
                    pointsFiltered++;
                    continue;
                }
                
                // Skip points outside current zoom range
                if (freq < freqStart || freq > freqEnd) continue;
                
                pointsDrawn++;
                
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
            console.log(`Dataset ${index} (${dataset.name}): drew ${pointsDrawn} points, filtered out ${pointsFiltered} points outside band, total ${dataset.frequencyData.length}`);
            
            // Draw data points for peak identification (with same band filtering)
            ctx.fillStyle = dataset.color;
            for (let i = 0; i < dataset.frequencyData.length; i++) {
                const freq = dataset.frequencyData[i];
                const amp = dataset.amplitudeData[i];
                
                // Apply same band frequency filtering
                if (bandRange && (freq < bandRange.min || freq > bandRange.max)) continue;
                
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
            ctx.fillText(this.formatFrequency(freqMHz), x, margin.top + plotHeight + 25);
        }
        
        // Y-axis labels (amplitude) - show actual visible range
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const maxAmpLabels = Math.floor(plotHeight / 40);
        const numAmpLabels = Math.max(minLabels, Math.min(maxAmpLabels, Math.floor(this.csvOverlayState.scale * 3) + 4));
        
        for (let i = 0; i <= numAmpLabels; i++) {
            const amp = ampStart + (ampRange * i / numAmpLabels);
            const y = margin.top + plotHeight - (i / numAmpLabels) * plotHeight; // Use fixed margin
            ctx.fillText(amp.toFixed(1) + ' dB', margin.left - 25, y);
        }
        
        // Axis titles with fixed positioning
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Frequency', margin.left + plotWidth / 2, margin.top + plotHeight + 70);
        
        ctx.save();
        ctx.translate(25, margin.top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 16px Arial';
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
        
        // Convert click coordinates to frequency/amplitude values - use same margins as drawOverlayGraph
        const margin = { 
            top: 50, 
            right: 80, 
            bottom: this.csvOverlayState.datasets.length > 0 ? 140 : 100, 
            left: 120 
        };
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
        
        // Use same margins as drawOverlayGraph for consistency
        const margin = { 
            top: 50, 
            right: 80, 
            bottom: this.csvOverlayState.datasets.length > 0 ? 140 : 100, 
            left: 120 
        };
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
        if (this.csvOverlayState.datasets.length === 0) return;
        
        // Reset to band range, not full data range
        console.log('Resetting zoom to band range...');
        this.setViewToBandRange();
        
        // Reset zoom parameters
        this.csvOverlayState.scale = 1;
        this.csvOverlayState.offsetX = 0;
        this.csvOverlayState.offsetY = 0;
        
        // Mark as using nice scaling
        this.csvOverlayState.useNiceScaling = true;
        
    }
    
    // Fallback reset zoom to full data range (for unknown bands)
    resetZoomOverlayToDataRange() {
        if (this.csvOverlayState.datasets.length === 0) return;
        
        console.log('Resetting zoom to full data range (fallback for unknown band)...');
        
        // Get data bounds from all visible datasets
        let minFreq = Infinity, maxFreq = -Infinity;
        let minAmp = Infinity, maxAmp = -Infinity;
        
        this.csvOverlayState.datasets.forEach(dataset => {
            if (dataset.visible) {
                dataset.frequencyData.forEach((freq, i) => {
                    minFreq = Math.min(minFreq, freq);
                    maxFreq = Math.max(maxFreq, freq);
                    minAmp = Math.min(minAmp, dataset.amplitudeData[i]);
                    maxAmp = Math.max(maxAmp, dataset.amplitudeData[i]);
                });
            }
        });
        
        if (minFreq === Infinity) return; // No visible data
        
        // Calculate nice rounded ranges
        const niceRanges = this.calculateNiceRanges(minFreq, maxFreq, minAmp, maxAmp);
        
        // Set nice view boundaries
        this.csvOverlayState.viewMinFreq = niceRanges.freqMin;
        this.csvOverlayState.viewMaxFreq = niceRanges.freqMax;
        this.csvOverlayState.viewMinAmp = niceRanges.ampMin;
        this.csvOverlayState.viewMaxAmp = niceRanges.ampMax;
        
        // Reset zoom parameters
        this.csvOverlayState.scale = 1;
        this.csvOverlayState.offsetX = 0;
        this.csvOverlayState.offsetY = 0;
        
        // Mark as using nice scaling
        this.csvOverlayState.useNiceScaling = true;
        
        this.drawOverlayGraph();
        this.updateOverlayRangeInputs();
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
        
        // Create modern overlay controls
        const controls = document.createElement('div');
        controls.className = 'csv-controls-modern';
        controls.id = 'csvOverlayControls';
        controls.innerHTML = `
            <div class="control-panel-header">
                <span class="panel-title">Plot Controls</span>
                <button class="panel-collapse-btn" id="toggleOverlayPanel">−</button>
            </div>
            
            <div class="control-panel-content" id="overlayPanelContent">
                <!-- Primary Controls Row -->
                <div class="control-row primary-controls">
                    <button class="modern-btn zoom-btn" id="overlayZoomOut" title="Zoom Out">Zoom Out</button>
                    <div class="zoom-display" id="overlayZoomLevel">${Math.round(this.csvOverlayState.scale * 100)}%</div>
                    <button class="modern-btn zoom-btn" id="overlayZoomIn" title="Zoom In">Zoom In</button>
                    <button class="modern-btn reset-btn" id="overlayResetZoom" title="Reset to Nice View">Reset Zoom</button>
                    <button class="modern-btn fullscreen-btn" id="overlayFullScreen" title="Full Screen View">Full Screen</button>
                </div>

                <!-- Manual Range Controls - Horizontal Layout -->
                <div class="control-row range-controls">
                    <div class="range-group">
                        <label class="range-label">Frequency (MHz):</label>
                        <input type="number" class="range-input" id="overlayFreqMin" placeholder="Min" step="0.1" title="Minimum Frequency">
                        <span>to</span>
                        <input type="number" class="range-input" id="overlayFreqMax" placeholder="Max" step="0.1" title="Maximum Frequency">
                        <button class="apply-btn" id="overlayApplyFreq" title="Apply Frequency Range">Apply</button>
                    </div>
                    
                    <div class="range-group">
                        <label class="range-label">Amplitude (dB):</label>
                        <input type="number" class="range-input" id="overlayAmpMin" placeholder="Min" step="1" title="Minimum Amplitude">
                        <span>to</span>
                        <input type="number" class="range-input" id="overlayAmpMax" placeholder="Max" step="1" title="Maximum Amplitude">
                        <button class="apply-btn" id="overlayApplyAmp" title="Apply Amplitude Range">Apply</button>
                    </div>
                </div>
            </div>
        `;
        
        const parentElement = canvas.parentElement || document.body;
        parentElement.appendChild(controls);
        
        // Add event listeners
        this.setupOverlayModernControlListeners();
        
        // Update zoom display
        this.updateOverlayZoomDisplay();
        
        // Initialize range inputs with current view
        this.updateOverlayRangeInputs();
    }

    setupOverlayModernControlListeners() {
        // Panel collapse/expand
        document.getElementById('toggleOverlayPanel').addEventListener('click', () => {
            const content = document.getElementById('overlayPanelContent');
            const btn = document.getElementById('toggleOverlayPanel');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = '−';
            } else {
                content.style.display = 'none';
                btn.textContent = '+';
            }
        });

        // Zoom controls
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
            this.updateOverlayRangeInputs();
        });

        document.getElementById('overlayFullScreen').addEventListener('click', () => {
            this.enterFullScreenOverlay();
        });

        // Manual range controls
        const freqButton = document.getElementById('overlayApplyFreq');
        const ampButton = document.getElementById('overlayApplyAmp');
        
        if (freqButton) {
            freqButton.addEventListener('click', () => {
                this.applyOverlayFrequencyRange();
            });
        }

        if (ampButton) {
            ampButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.applyOverlayAmplitudeRange();
            });
        }



        // Enter key support for range inputs
        ['overlayFreqMin', 'overlayFreqMax', 'overlayAmpMin', 'overlayAmpMax'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (id.includes('Freq')) {
                        this.applyOverlayFrequencyRange();
                    } else {
                        this.applyOverlayAmplitudeRange();
                    }
                }
            });
        });
    }

    updateOverlayRangeInputs() {
        if (this.csvOverlayState.datasets.length === 0) return;

        // Get current view bounds (either nice scaling or data bounds)
        let minFreq = this.csvOverlayState.viewMinFreq || this.csvOverlayState.minFreq;
        let maxFreq = this.csvOverlayState.viewMaxFreq || this.csvOverlayState.maxFreq;
        let minAmp = this.csvOverlayState.viewMinAmp || this.csvOverlayState.minAmp;
        let maxAmp = this.csvOverlayState.viewMaxAmp || this.csvOverlayState.maxAmp;

        // Convert frequency to MHz for display
        document.getElementById('overlayFreqMin').value = (minFreq / 1e6).toFixed(1);
        document.getElementById('overlayFreqMax').value = (maxFreq / 1e6).toFixed(1);
        document.getElementById('overlayAmpMin').value = Math.round(minAmp);
        document.getElementById('overlayAmpMax').value = Math.round(maxAmp);
    }

    applyOverlayFrequencyRange() {
        const minInput = document.getElementById('overlayFreqMin');
        const maxInput = document.getElementById('overlayFreqMax');
        
        const minFreqMHz = parseFloat(minInput.value);
        const maxFreqMHz = parseFloat(maxInput.value);
        
        if (isNaN(minFreqMHz) || isNaN(maxFreqMHz) || minFreqMHz >= maxFreqMHz) {
            alert('Please enter valid frequency range (Min < Max)');
            return;
        }

        this.csvOverlayState.viewMinFreq = minFreqMHz * 1e6; // Convert to Hz
        this.csvOverlayState.viewMaxFreq = maxFreqMHz * 1e6;
        this.csvOverlayState.useNiceScaling = true;
        
        // Reset zoom parameters to show the full custom range
        this.csvOverlayState.scale = 1;
        this.csvOverlayState.offsetX = 0;
        this.csvOverlayState.offsetY = 0;
        
        // Clear any existing pan/zoom to ensure we see the exact specified range
        this.csvOverlayState.isDragging = false;
        
        this.drawOverlayGraph();
        this.updateOverlayZoomDisplay();
    }

    applyOverlayAmplitudeRange() {
        const minInput = document.getElementById('overlayAmpMin');
        const maxInput = document.getElementById('overlayAmpMax');
        
        if (!minInput || !maxInput) {
            alert('ERROR: Cannot find amplitude input fields');
            return;
        }
        
        const minAmp = parseFloat(minInput.value);
        const maxAmp = parseFloat(maxInput.value);
        
        if (isNaN(minAmp) || isNaN(maxAmp) || minAmp >= maxAmp) {
            alert('Please enter valid amplitude range (Min < Max)');
            return;
        }

        this.csvOverlayState.viewMinAmp = minAmp;
        this.csvOverlayState.viewMaxAmp = maxAmp;
        this.csvOverlayState.useNiceScaling = true;
        
        // Reset zoom parameters to show the full custom range
        this.csvOverlayState.scale = 1;
        this.csvOverlayState.offsetX = 0;
        this.csvOverlayState.offsetY = 0;
        
        // Clear any existing pan/zoom to ensure we see the exact specified range
        this.csvOverlayState.isDragging = false;
        
        this.drawOverlayGraph();
        this.updateOverlayZoomDisplay();
        this.updateOverlayRangeInputs();
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
        const legendY = margin.top + (height - margin.top - margin.bottom) + 85; // In the margin area, below frequency label
        
        // Calculate dynamic item width based on longest filename
        ctx.font = 'bold 11px Arial';
        let maxTextWidth = 0;
        this.csvOverlayState.datasets.forEach(dataset => {
            const textWidth = ctx.measureText(dataset.name).width;
            maxTextWidth = Math.max(maxTextWidth, textWidth);
        });
        
        // Add padding for color line and spacing
        const itemWidth = Math.max(140, maxTextWidth + 35);
        const availableWidth = width - margin.left - margin.right;
        const maxItemsPerRow = Math.floor(availableWidth / itemWidth);
        const itemsPerRow = Math.min(this.csvOverlayState.datasets.length, maxItemsPerRow);
        
        // Calculate legend background
        const totalWidth = itemsPerRow * itemWidth;
        const legendHeight = Math.ceil(this.csvOverlayState.datasets.length / itemsPerRow) * 22 + 10;
        
        // Draw legend background with border
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(legendX - totalWidth/2 - 5, legendY - 15, totalWidth + 10, legendHeight);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(legendX - totalWidth/2 - 5, legendY - 15, totalWidth + 10, legendHeight);
        
        // Draw legend items horizontally centered
        const startX = legendX - totalWidth / 2;
        
        this.csvOverlayState.datasets.forEach((dataset, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const itemX = startX + col * itemWidth;
            const itemY = legendY + row * 22;
            
            // Draw color line
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(itemX, itemY);
            ctx.lineTo(itemX + 20, itemY);
            ctx.stroke();
            
            // Draw dataset name (full filename, no truncation)
            ctx.fillStyle = '#333';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            // Measure text to ensure it fits
            const textWidth = ctx.measureText(dataset.name).width;
            const availableSpace = itemWidth - 30;
            
            let displayName = dataset.name;
            if (textWidth > availableSpace) {
                // If text is too long, use a smaller font
                ctx.font = 'bold 9px Arial';
                const smallerTextWidth = ctx.measureText(dataset.name).width;
                if (smallerTextWidth > availableSpace) {
                    // If still too long, truncate smartly (keep extension)
                    const parts = dataset.name.split('.');
                    if (parts.length > 1) {
                        const extension = '.' + parts[parts.length - 1];
                        const baseName = parts.slice(0, -1).join('.');
                        const maxBaseLength = Math.floor((availableSpace - ctx.measureText(extension + '...').width) / ctx.measureText('M').width);
                        displayName = baseName.substring(0, maxBaseLength) + '...' + extension;
                    } else {
                        const maxLength = Math.floor(availableSpace / ctx.measureText('M').width) - 3;
                        displayName = dataset.name.substring(0, maxLength) + '...';
                    }
                }
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
            // this.autoSelectBandButton(detectedBand); // TEMPORARILY COMMENTED OUT
            
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
            const y = margin.top + plotHeight - (i / numLabels) * plotHeight;
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
    
    // ENHANCED FOLDER-BASED CSV SELECTION SYSTEM
    setupFolderBasedSelection() {
        console.log('Setting up folder-based CSV selection...');
        
        // Initialize folder selection state
        this.folderSelectionState = {
            selectedFolder: null,
            availableFiles: [],
            selectedFiles: [],
            selectedFileData: [],
            plottedFiles: []
        };
        
        // Setup event listeners
        this.setupFolderSelectionListeners();
    }
    
    setupFolderSelectionListeners() {
        // Folder input
        const folderInput = document.getElementById('folderInput');
        const folderUploadArea = document.getElementById('folderUploadArea');
        
        if (folderInput && folderUploadArea) {
            folderUploadArea.addEventListener('click', () => folderInput.click());
            folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));
        }
        
        // Band filter
        const bandFilter = document.getElementById('bandFilter');
        if (bandFilter) {
            bandFilter.addEventListener('change', (e) => this.filterFilesByBand(e.target.value));
        }
        
        // Control buttons
        const clearSelectionBtn = document.getElementById('clearSelection');
        const plotSelectedBtn = document.getElementById('plotSelectedBtn');
        const refreshFolderBtn = document.getElementById('refreshFolderBtn');
        const clearPlotBtn = document.getElementById('clearPlotBtn');
        const selectNewBtn = document.getElementById('selectNewBtn');
        
        if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', () => this.clearFileSelection());
        if (plotSelectedBtn) plotSelectedBtn.addEventListener('click', () => this.plotSelectedFiles());
        if (refreshFolderBtn) refreshFolderBtn.addEventListener('click', () => this.refreshFolderContents());
        if (clearPlotBtn) clearPlotBtn.addEventListener('click', () => this.clearCurrentPlot());
        if (selectNewBtn) selectNewBtn.addEventListener('click', () => this.returnToFileSelection());
    }
    
    handleFolderSelection(event) {
        const files = Array.from(event.target.files);
        console.log(`Folder selected with ${files.length} files`);
        
        // Filter for CSV files
        const csvFiles = files.filter(file => 
            file.name.toLowerCase().endsWith('.csv') || 
            file.name.toLowerCase().endsWith('.txt')
        );
        
        if (csvFiles.length === 0) {
            alert('No CSV files found in the selected folder. Please select a folder containing CSV data files.');
            return;
        }
        
        // Store folder info
        this.folderSelectionState.selectedFolder = files[0].webkitRelativePath.split('/')[0];
        this.folderSelectionState.availableFiles = csvFiles;
        
        // Update UI
        this.updateFolderStatus();
        this.displayAvailableFiles();
        this.showFileSelectionStep();
        
        console.log(`Found ${csvFiles.length} CSV files in folder: ${this.folderSelectionState.selectedFolder}`);
    }
    
    updateFolderStatus() {
        const folderStatus = document.getElementById('folderStatus');
        if (folderStatus && this.folderSelectionState.selectedFolder) {
            folderStatus.innerHTML = `<span>📁 ${this.folderSelectionState.selectedFolder} (${this.folderSelectionState.availableFiles.length} CSV files)</span>`;
            folderStatus.classList.add('has-folder');
        }
    }
    
    async displayAvailableFiles() {
        const availableFilesList = document.getElementById('availableFilesList');
        if (!availableFilesList) return;
        
        // Show loading state
        availableFilesList.innerHTML = '<div class="empty-state">📊 Analyzing CSV files...</div>';
        
        // Analyze files for band information
        const analyzedFiles = await this.analyzeFiles(this.folderSelectionState.availableFiles);
        
        // Sort files by band, then by name
        analyzedFiles.sort((a, b) => {
            if (a.band !== b.band) {
                if (a.band === 'Unknown') return 1;
                if (b.band === 'Unknown') return -1;
                return a.band.localeCompare(b.band);
            }
            return a.name.localeCompare(b.name);
        });
        
        // Create file list
        availableFilesList.innerHTML = '';
        
        if (analyzedFiles.length === 0) {
            availableFilesList.innerHTML = '<div class="empty-state">No CSV files found</div>';
            return;
        }
        
        // Update band filter with file counts
        this.updateBandFilterWithCounts(analyzedFiles);
        
        analyzedFiles.forEach((fileInfo, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <input type="checkbox" id="file_${index}" data-index="${index}">
                <div class="file-item-info">
                    <div class="file-name">${fileInfo.name}</div>
                    <div class="file-details">
                        <span class="file-band">${fileInfo.band}</span>
                        <span>${fileInfo.rows} data points</span>
                        <span>${fileInfo.freqRange}</span>
                    </div>
                </div>
            `;
            
            // Add click listener for file selection
            const checkbox = fileItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => this.handleFileSelection(e, fileInfo));
            fileItem.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            
            availableFilesList.appendChild(fileItem);
        });
        
        this.folderSelectionState.analyzedFiles = analyzedFiles;
    }
    
    updateBandFilterWithCounts(analyzedFiles) {
        const bandFilter = document.getElementById('bandFilter');
        if (!bandFilter) return;
        
        // Count files by band
        const bandCounts = {};
        analyzedFiles.forEach(file => {
            bandCounts[file.band] = (bandCounts[file.band] || 0) + 1;
        });
        
        // Store original options if not already stored
        if (!this.originalBandOptions) {
            this.originalBandOptions = Array.from(bandFilter.options).map(option => ({
                value: option.value,
                text: option.textContent.split(' (')[0] // Remove any existing count
            }));
        }
        
        // Update options with counts
        bandFilter.innerHTML = '';
        this.originalBandOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            
            if (option.value === 'all') {
                optionElement.textContent = `${option.text} (${analyzedFiles.length} files)`;
            } else {
                const count = bandCounts[option.value] || 0;
                optionElement.textContent = `${option.text} (${count} file${count !== 1 ? 's' : ''})`;
                if (count === 0) {
                    optionElement.disabled = true;
                    optionElement.style.color = '#999';
                }
            }
            
            bandFilter.appendChild(optionElement);
        });
        
        console.log('Band distribution:', bandCounts);
    }
    
    async analyzeFiles(files) {
        const analyzedFiles = [];
        
        for (const file of files) {
            try {
                const text = await this.readFileAsText(file);
                const analysis = this.quickAnalyzeCsvContent(text, file.name);
                analyzedFiles.push({
                    file: file,
                    name: file.name,
                    ...analysis
                });
            } catch (error) {
                console.warn(`Failed to analyze file ${file.name}:`, error);
                analyzedFiles.push({
                    file: file,
                    name: file.name,
                    band: 'Unknown',
                    rows: 0,
                    freqRange: 'Unable to read'
                });
            }
        }
        
        return analyzedFiles;
    }
    
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    quickAnalyzeCsvContent(csvText, filename) {
        console.log(`Analyzing CSV content for: ${filename}`);
        const lines = csvText.trim().split('\n').filter(line => line.trim());
        console.log(`Found ${lines.length} lines in CSV`);
        
        if (lines.length === 0) {
            return { band: 'Unknown', rows: 0, freqRange: 'No data' };
        }
        
        // Try to detect separator and find first valid data line
        const separators = [',', ';', '\t'];
        let separator = ',';
        let firstDataLineIndex = 0;
        let minFreq = null, maxFreq = null;
        
        // Skip potential header lines and find first data line
        for (let lineIndex = 0; lineIndex < Math.min(5, lines.length); lineIndex++) {
            const line = lines[lineIndex];
            console.log(`Checking line ${lineIndex}: "${line.substring(0, 50)}..."`);
            
            // Skip obvious header lines
            if (line.toLowerCase().includes('frequency') || 
                line.toLowerCase().includes('amplitude') ||
                line.toLowerCase().includes('freq') ||
                line.toLowerCase().includes('amp')) {
                console.log(`Skipping header line ${lineIndex}`);
                continue;
            }
            
            // Try different separators
            for (const sep of separators) {
                const values = line.split(sep).map(v => v.trim());
                if (values.length >= 2) {
                    // Try to parse as numbers
                    const freq = this.parseNumber(values[0]);
                    const amp = this.parseNumber(values[1]);
                    
                    if (!isNaN(freq) && !isNaN(amp)) {
                        separator = sep;
                        firstDataLineIndex = lineIndex;
                        minFreq = freq;
                        console.log(`Found valid data starting at line ${lineIndex} with separator '${sep}'`);
                        console.log(`First data point: freq=${freq}, amp=${amp}`);
                        break;
                    }
                }
            }
            
            if (minFreq !== null) break;
        }
        
        if (minFreq === null) {
            console.log('Could not find valid numeric data in CSV');
            return { band: 'Unknown', rows: lines.length, freqRange: 'Invalid format' };
        }
        
        // Get data lines (skip to first valid data)
        const dataLines = lines.slice(firstDataLineIndex);
        
        // Find last valid data point for frequency range
        try {
            for (let i = dataLines.length - 1; i >= 0; i--) {
                const values = dataLines[i].split(separator).map(v => v.trim());
                if (values.length >= 2) {
                    const freq = this.parseNumber(values[0]);
                    if (!isNaN(freq)) {
                        maxFreq = freq;
                        break;
                    }
                }
            }
            
            if (isNaN(maxFreq)) {
                maxFreq = minFreq; // Fallback if we can't find last frequency
            }
        } catch (error) {
            console.log('Error finding max frequency:', error);
            maxFreq = minFreq;
        }
        
        console.log(`Frequency range: ${minFreq} - ${maxFreq}`);
        
        // Prioritize band detection from filename, fallback to frequency analysis
        let band = this.detectBandFromFilename(filename);
        let detectionMethod = 'filename';
        
        if (band === 'Unknown') {
            band = this.detectBandFromFrequencyRange(minFreq / 1e6, maxFreq / 1e6); // Convert to MHz
            detectionMethod = 'frequency';
        }
        
        console.log(`${filename}: Band ${band} detected from ${detectionMethod}`);
        
        // Format frequency range
        const freqRange = `${this.formatFrequency(minFreq / 1e6)} - ${this.formatFrequency(maxFreq / 1e6)}`;
        
        const result = {
            band: band,
            rows: dataLines.length,
            freqRange: freqRange,
            minFreq: minFreq,
            maxFreq: maxFreq
        };
        
        console.log(`Analysis result:`, result);
        return result;
    }
    
    // Helper function to parse numbers that might be in different formats
    parseNumber(str) {
        if (!str) return NaN;
        
        // Remove any whitespace
        str = str.trim();
        
        // Handle scientific notation, decimal points, etc.
        // Replace comma decimal separator with period if needed
        if (str.includes(',') && !str.includes('.')) {
            str = str.replace(',', '.');
        }
        
        // Try direct parsing first
        let num = parseFloat(str);
        if (!isNaN(num)) {
            return num;
        }
        
        // Try removing any non-numeric characters except decimal point and e/E
        const cleaned = str.replace(/[^0-9.eE+-]/g, '');
        num = parseFloat(cleaned);
        
        return num;
    }
    
    detectBandFromFilename(filename) {
        console.log(`Analyzing filename: "${filename}"`);
        
        // Look for band patterns in filename - more comprehensive patterns
        const bandPatterns = [
            /\sB([0-7])(?:\s|\.)/i,    // " B0 " or " B0." (most common for your files)
            /\bB([0-7])\b/i,          // B0, B1, B2, etc. (case insensitive)
            /\sB([0-7])$/i,           // " B0" at end
            /\sB([0-7])\s/i,          // " B0 " (surrounded by spaces)
            /\bBAND\s*([0-7])\b/i,    // BAND0, BAND 1, etc.
            /\bBND([0-7])\b/i,        // BND0, BND1, etc.
            /\b([0-7])GHZ\b/i,        // 0GHZ, 1GHZ, etc.
            /\b([0-7])G\b/i,          // 0G, 1G, etc.
            /\bB-([0-7])\b/i,         // B-0, B-1, etc.
            /\bBAND-([0-7])\b/i,      // BAND-0, BAND-1, etc.
            /_B([0-7])_/i,            // _B0_, _B1_, etc.
            /-B([0-7])-/i,            // -B0-, -B1-, etc.
            /\bFREQ([0-7])\b/i,       // FREQ0, FREQ1, etc.
            /B([0-7])\.csv$/i,        // B0.csv, B1.csv at end
            /([0-7])\.csv$/i,         // 0.csv, 1.csv, etc.
            /Band([0-7])/i,           // Band0, Band1, etc.
        ];
        
        for (let i = 0; i < bandPatterns.length; i++) {
            const pattern = bandPatterns[i];
            const match = filename.match(pattern);
            if (match) {
                const bandNumber = match[1];
                // Validate band number is 0-7
                if (bandNumber >= '0' && bandNumber <= '7') {
                    console.log(`Found band B${bandNumber} using pattern ${i}: ${pattern}`);
                    return `B${bandNumber}`;
                }
            }
        }
        
        // Convert to uppercase for frequency-based detection
        const upperFilename = filename.toUpperCase();
        
        // Look for frequency-based indicators in filename - updated to correct specification
        if (upperFilename.includes('10KHZ') || upperFilename.includes('160KHZ')) return 'B0';    // 10 to 160 kHz
        if (upperFilename.includes('150KHZ') || upperFilename.includes('650KHZ')) return 'B1';   // 150 to 650 kHz
        if (upperFilename.includes('500KHZ') || upperFilename.includes('3MHZ')) return 'B2';     // 500 kHz to 3 MHz
        if (upperFilename.includes('2.5MHZ') || upperFilename.includes('7.5MHZ')) return 'B3';   // 2.5 to 7.5 MHz
        if (upperFilename.includes('5MHZ') || upperFilename.includes('30MHZ')) return 'B4';      // 5 to 30 MHz
        if (upperFilename.includes('25MHZ') || upperFilename.includes('325MHZ')) return 'B5';    // 25 to 325 MHz
        if (upperFilename.includes('300MHZ') || upperFilename.includes('1.3GHZ') || upperFilename.includes('1300MHZ')) return 'B6';  // 0.3 to 1.3 GHz
        if (upperFilename.includes('1GHZ') || upperFilename.includes('6GHZ') || upperFilename.includes('6000MHZ')) return 'B7';      // 1.0 to 6.0 GHz
        
        console.log('No band pattern found in filename');
        return 'Unknown';
    }
    
    detectBandFromFrequencyRange(minFreqMHz, maxFreqMHz) {
        // Check which band this frequency range most likely belongs to
        for (const [bandKey, bandInfo] of Object.entries(this.bandDefinitions || {})) {
            if (minFreqMHz >= bandInfo.startMHz * 0.8 && maxFreqMHz <= bandInfo.endMHz * 1.2) {
                return `B${bandKey}`;
            }
        }
        
        // Fallback band detection based on frequency ranges - updated to correct specification
        if (maxFreqMHz <= 0.16) return 'B0';    // 10 to 160 kHz
        if (maxFreqMHz <= 0.65) return 'B1';    // 150 to 650 kHz
        if (maxFreqMHz <= 3) return 'B2';       // 500 kHz to 3 MHz
        if (maxFreqMHz <= 7.5) return 'B3';     // 2.5 to 7.5 MHz
        if (maxFreqMHz <= 30) return 'B4';      // 5 to 30 MHz
        if (maxFreqMHz <= 325) return 'B5';     // 25 to 325 MHz
        if (maxFreqMHz <= 1300) return 'B6';    // 0.3 to 1.3 GHz
        if (maxFreqMHz <= 6000) return 'B7';    // 1.0 to 6.0 GHz
        
        return 'Unknown';
    }
    
    handleFileSelection(event, fileInfo) {
        const checkbox = event.target;
        const isSelected = checkbox.checked;
        
        if (isSelected) {
            // Check if we already have 2 files selected
            if (this.folderSelectionState.selectedFiles.length >= 2) {
                checkbox.checked = false;
                alert('You can only select up to 2 files for comparison at a time.');
                return;
            }
            
            // Check for mixed band warning
            if (this.folderSelectionState.selectedFiles.length > 0) {
                const existingBand = this.folderSelectionState.selectedFiles[0].band;
                const newBand = fileInfo.band;
                
                if (existingBand !== newBand && existingBand !== 'Unknown' && newBand !== 'Unknown') {
                    const proceed = confirm(
                        `⚠️ MIXED BAND WARNING ⚠️\n\n` +
                        `You are selecting files from different bands:\n` +
                        `• Currently selected: ${existingBand}\n` +
                        `• New selection: ${newBand}\n\n` +
                        `For accurate analysis, it's recommended to compare files from the same band.\n\n` +
                        `Do you want to proceed with this mixed-band comparison?`
                    );
                    
                    if (!proceed) {
                        checkbox.checked = false;
                        return;
                    }
                }
            }
            
            // Add to selection
            this.folderSelectionState.selectedFiles.push(fileInfo);
            checkbox.closest('.file-item').classList.add('selected');
        } else {
            // Remove from selection
            this.folderSelectionState.selectedFiles = this.folderSelectionState.selectedFiles.filter(f => f.name !== fileInfo.name);
            checkbox.closest('.file-item').classList.remove('selected');
        }
        
        this.updateSelectionCounter();
        this.updatePlotButton();
        this.updateSelectionWarnings();
    }
    
    updateSelectionCounter() {
        const selectionCounter = document.getElementById('selectionCounter');
        if (selectionCounter) {
            const count = this.folderSelectionState.selectedFiles.length;
            selectionCounter.textContent = `${count}/2 files selected`;
        }
    }
    
    updatePlotButton() {
        const plotSelectedBtn = document.getElementById('plotSelectedBtn');
        if (plotSelectedBtn) {
            const hasSelection = this.folderSelectionState.selectedFiles.length > 0;
            plotSelectedBtn.disabled = !hasSelection;
            
            if (hasSelection) {
                const count = this.folderSelectionState.selectedFiles.length;
                plotSelectedBtn.textContent = `Plot ${count} Selected File${count > 1 ? 's' : ''}`;
            } else {
                plotSelectedBtn.textContent = 'Plot Selected Files';
            }
        }
    }
    
    updateSelectionWarnings() {
        const selectionCounter = document.getElementById('selectionCounter');
        if (!selectionCounter) return;
        
        // Check for mixed bands in selection
        if (this.folderSelectionState.selectedFiles.length > 1) {
            const bands = this.folderSelectionState.selectedFiles.map(f => f.band);
            const uniqueBands = [...new Set(bands)].filter(b => b !== 'Unknown');
            
            if (uniqueBands.length > 1) {
                // Add warning styling and text
                selectionCounter.style.background = '#fee';
                selectionCounter.style.color = '#c53030';
                selectionCounter.style.border = '1px solid #fc8181';
                selectionCounter.innerHTML = `⚠️ ${this.folderSelectionState.selectedFiles.length}/2 files selected (Mixed bands: ${uniqueBands.join(', ')})`;
            } else {
                // Normal styling
                selectionCounter.style.background = 'rgba(63, 82, 119, 0.1)';
                selectionCounter.style.color = '#3f5277';
                selectionCounter.style.border = 'none';
                const count = this.folderSelectionState.selectedFiles.length;
                selectionCounter.textContent = `${count}/2 files selected`;
            }
        } else {
            // Normal styling for single or no selection
            selectionCounter.style.background = 'rgba(63, 82, 119, 0.1)';
            selectionCounter.style.color = '#3f5277';
            selectionCounter.style.border = 'none';
            const count = this.folderSelectionState.selectedFiles.length;
            selectionCounter.textContent = `${count}/2 files selected`;
        }
    }
    
    filterFilesByBand(selectedBand) {
        const fileItems = document.querySelectorAll('.file-item');
        
        fileItems.forEach(item => {
            const bandSpan = item.querySelector('.file-band');
            if (!bandSpan) return;
            
            const fileBand = bandSpan.textContent;
            
            if (selectedBand === 'all') {
                item.style.display = 'flex';
            } else {
                if (fileBand === selectedBand) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                    // Uncheck if hidden
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    if (checkbox && checkbox.checked) {
                        checkbox.checked = false;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                }
            }
        });
    }
    
    clearFileSelection() {
        // Clear all checkboxes
        document.querySelectorAll('.file-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear selection state
        this.folderSelectionState.selectedFiles = [];
        
        // Remove visual selection
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        this.updateSelectionCounter();
        this.updatePlotButton();
        this.updateSelectionWarnings();
    }
    
    async plotSelectedFiles() {
        if (this.folderSelectionState.selectedFiles.length === 0) {
            alert('Please select at least one file to plot.');
            return;
        }
        
        // Final check for mixed bands before plotting
        if (this.folderSelectionState.selectedFiles.length > 1) {
            const bands = this.folderSelectionState.selectedFiles.map(f => f.band);
            const uniqueBands = [...new Set(bands)].filter(b => b !== 'Unknown');
            
            if (uniqueBands.length > 1) {
                const fileNames = this.folderSelectionState.selectedFiles.map(f => `• ${f.name} (${f.band})`).join('\n');
                const proceed = confirm(
                    `🔍 FINAL MIXED BAND CHECK 🔍\n\n` +
                    `You are about to plot files from different bands:\n\n${fileNames}\n\n` +
                    `Mixed band comparisons may not provide meaningful analysis results.\n` +
                    `Consider selecting files from the same band for better insights.\n\n` +
                    `Do you want to proceed with plotting these files?`
                );
                
                if (!proceed) {
                    return;
                }
            }
        }
        
        try {
            // Clear existing overlay data completely
            this.csvOverlayState.datasets = [];
            console.log('Cleared existing datasets, loading new files...');
            
            // Load selected files with small delay to ensure proper color assignment
            for (let i = 0; i < this.folderSelectionState.selectedFiles.length; i++) {
                const fileInfo = this.folderSelectionState.selectedFiles[i];
                console.log(`Loading file ${i + 1}/${this.folderSelectionState.selectedFiles.length}: ${fileInfo.name}`);
                await this.loadSelectedFile(fileInfo);
                
                // Small delay between files to ensure proper processing
                if (i < this.folderSelectionState.selectedFiles.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            
            // Update plotting state
            this.folderSelectionState.plottedFiles = [...this.folderSelectionState.selectedFiles];
            
            // Final verification of loaded datasets
            console.log('=== FINAL DATASET VERIFICATION ===');
            console.log(`Total datasets loaded: ${this.csvOverlayState.datasets.length}`);
            this.csvOverlayState.datasets.forEach((dataset, index) => {
                console.log(`Dataset ${index}: ${dataset.name} - Color: ${dataset.color} - Visible: ${dataset.visible} - Points: ${dataset.frequencyData.length}`);
            });
            
            // Auto-zoom to band frequency range
            this.setViewToBandRange();
            
            // Update UI
            this.showPlottedFilesStep();
            this.updateOverlayDatasets();
            this.setupOverlayCanvas();
            this.setupOverlayCanvasListeners();  // Add mouse/wheel interactions
            this.addOverlayControls();  // Add the plot control panel
            this.updateOverlayRangeInputs();  // Update range inputs to show band range
            this.drawOverlayGraph();
            this.updateLegend();
            
            // Log success with band information
            const plotInfo = this.folderSelectionState.selectedFiles.map(f => `${f.name} (${f.band})`).join(', ');
            console.log(`Successfully plotted ${this.folderSelectionState.selectedFiles.length} files: ${plotInfo}`);
            
        } catch (error) {
            console.error('Error plotting files:', error);
            alert('Error loading files. Please check the file format and try again.');
        }
    }
    
    async loadSelectedFile(fileInfo) {
        const text = await this.readFileAsText(fileInfo.file);
        
        // Parse CSV data using existing function logic
        const datasetId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Generate color for this dataset - ensure different colors for each file
        const colors = ['#cc0000', '#0066cc', '#009900', '#ff6600', '#9900cc', '#cc6600'];
        const colorIndex = this.csvOverlayState.datasets.length % colors.length;
        const color = colors[colorIndex];
        
        console.log(`Loading file: ${fileInfo.name}`);
        console.log(`Dataset index: ${this.csvOverlayState.datasets.length}, Color index: ${colorIndex}, Color: ${color}`);
        console.log(`Assigned color: ${color} to file: ${fileInfo.name}`);
        
        const dataset = {
            id: datasetId,
            name: fileInfo.name,
            color: color,
            visible: true,
            frequencyData: [],
            amplitudeData: []
        };
        
        // Parse the CSV data
        const lines = text.trim().split('\n');
        
        for (let i = 1; i < lines.length; i++) { // Skip header
            const line = lines[i].trim();
            if (!line) continue;
            
            const [freqStr, ampStr] = line.split(',').map(s => s.trim());
            const frequency = parseFloat(freqStr);
            const amplitude = parseFloat(ampStr);
            
            if (!isNaN(frequency) && !isNaN(amplitude)) {
                dataset.frequencyData.push(frequency);
                dataset.amplitudeData.push(amplitude);
            }
        }
        
        if (dataset.frequencyData.length === 0) {
            throw new Error(`No valid data found in ${fileInfo.name}`);
        }
        
        // Add dataset to overlay state
        this.csvOverlayState.datasets.push(dataset);
        
        // Auto-fill form data using existing parseFilename function
        if (this.csvOverlayState.datasets.length === 1) {
            // For the first file, parse filename and auto-fill form data
            this.parseFilename(fileInfo.name, 1); // Use CSV 1 slot for form data
            console.log(`Auto-filled form data from filename: ${fileInfo.name}`);
        }
        
        console.log(`Loaded ${dataset.frequencyData.length} data points from ${fileInfo.name}`);
        console.log(`Dataset added to overlay state. Total datasets: ${this.csvOverlayState.datasets.length}`);
        console.log(`Dataset info:`, {
            name: dataset.name,
            color: dataset.color,
            visible: dataset.visible,
            dataPoints: dataset.frequencyData.length
        });
    }
    
    showFileSelectionStep() {
        document.getElementById('fileSelectionContainer').style.display = 'block';
        document.getElementById('plottedFilesContainer').style.display = 'none';
    }
    
    showPlottedFilesStep() {
        document.getElementById('fileSelectionContainer').style.display = 'none';
        document.getElementById('plottedFilesContainer').style.display = 'block';
        
        this.updatePlottedFilesList();
    }
    
    updatePlottedFilesList() {
        const plottedFilesList = document.getElementById('plottedFilesList');
        if (!plottedFilesList) return;
        
        if (this.folderSelectionState.plottedFiles.length === 0) {
            plottedFilesList.innerHTML = '<div class="empty-state">No files currently plotted</div>';
            return;
        }
        
        plottedFilesList.innerHTML = '';
        
        this.folderSelectionState.plottedFiles.forEach((fileInfo, index) => {
            const dataset = this.csvOverlayState.datasets[index];
            const fileItem = document.createElement('div');
            fileItem.className = 'plotted-file-item';
            fileItem.innerHTML = `
                <div class="plotted-file-info">
                    <div class="plotted-file-name">${fileInfo.name}</div>
                    <div class="plotted-file-meta">
                        <span class="file-band">${fileInfo.band}</span>
                        <span>${fileInfo.rows} points</span>
                        <span>${fileInfo.freqRange}</span>
                    </div>
                </div>
                <div class="file-color-indicator" style="background-color: ${dataset?.color || '#999'}"></div>
            `;
            
            plottedFilesList.appendChild(fileItem);
        });
    }
    
    refreshFolderContents() {
        if (!this.folderSelectionState.selectedFolder) {
            alert('Please select a folder first.');
            return;
        }
        
        // Trigger folder input click to re-select
        const folderInput = document.getElementById('folderInput');
        if (folderInput) {
            folderInput.click();
        }
    }
    
    clearCurrentPlot() {
        // Clear plotted data
        this.csvOverlayState.datasets = [];
        this.folderSelectionState.plottedFiles = [];
        
        // Update UI
        this.drawOverlayGraph();
        this.updateLegend();
        this.returnToFileSelection();
        
        console.log('Cleared current plot');
    }
    
    returnToFileSelection() {
        // Clear current selection
        this.clearFileSelection();
        
        // Show file selection step
        this.showFileSelectionStep();
        
        console.log('Returned to file selection');
    }
    
    // Add fallback upload button for CSV if click area isn't working
    addCsvUploadFallback() {
        const uploadArea = document.getElementById('csvOverlayUploadArea');
        const csvInput = document.getElementById('csvOverlayInput');
        
        if (!uploadArea || !csvInput) {
            console.warn('Cannot add CSV upload fallback - elements not found');
            return;
        }
        
        // Check if fallback button already exists
        if (uploadArea.querySelector('.fallback-upload-btn')) {
            console.log('Fallback button already exists');
            return;
        }
        
        // Create fallback button
        const fallbackBtn = document.createElement('button');
        fallbackBtn.className = 'fallback-upload-btn btn btn-primary';
        fallbackBtn.textContent = 'Browse CSV Files';
        fallbackBtn.style.marginTop = '10px';
        fallbackBtn.style.display = 'block';
        fallbackBtn.style.width = '150px';
        fallbackBtn.style.margin = '10px auto';
        
        fallbackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Fallback button clicked - opening file dialog');
            csvInput.click();
        });
        
        // Add button to upload area
        uploadArea.appendChild(fallbackBtn);
        
        console.log('Added fallback CSV upload button');
    }
    
    // Manual function to trigger CSV file dialog
    openCsvFileDialog() {
        const csvInput = document.getElementById('csvOverlayInput');
        if (csvInput) {
            console.log('Manual CSV file dialog triggered');
            csvInput.click();
        } else {
            console.error('CSV input not found');
        }
    }
    
    // Manual function to fix CSV mode UI state
    fixCsvModeUI() {
        console.log('=== Fixing CSV Mode UI ===');
        
        // Force CSV mode
        this.currentInputType = 'csv';
        this.setInputType('csv');
        this.updateExportButtonLabels();
        
        // Check and fix export buttons
        const exportBtn1 = document.getElementById('exportImage1');
        const exportBtn2 = document.getElementById('exportImage2');
        const exportBothBtn = document.getElementById('exportBoth');
        
        if (exportBtn1) {
            exportBtn1.textContent = 'Export CSV Overlay';
            exportBtn1.style.display = 'inline-block';
        }
        if (exportBtn2) exportBtn2.style.display = 'none';
        if (exportBothBtn) exportBothBtn.style.display = 'none';
        
        // Check and fix form sections
        const csvFormSection = document.getElementById('csvFormSection');
        const dualFormSection = document.getElementById('dualFormSection');
        
        if (csvFormSection) csvFormSection.style.display = 'block';
        if (dualFormSection) dualFormSection.style.display = 'none';
        
        // Check and fix upload sections
        const csvUploadSection = document.getElementById('csvUploadSection');
        const imageUploadSection = document.getElementById('imageUploadSection');
        
        if (csvUploadSection) csvUploadSection.style.display = 'block';
        if (imageUploadSection) imageUploadSection.style.display = 'none';
        
        console.log('CSV mode UI state manually corrected');
        return {
            exportBtn1: exportBtn1?.textContent,
            exportBtn2Visible: exportBtn2?.style.display !== 'none',
            exportBothVisible: exportBothBtn?.style.display !== 'none',
            csvFormVisible: csvFormSection?.style.display !== 'none',
            dualFormVisible: dualFormSection?.style.display !== 'none'
        };
    }
    
    // Debug function to test CSV upload
    // Immediate CSV upload setup - called very early in initialization
    enableCsvUploadImmediately() {
        console.log('Setting up immediate CSV upload functionality...');
        
        const uploadArea = document.getElementById('csvOverlayUploadArea');
        const csvInput = document.getElementById('csvOverlayInput');
        
        if (!uploadArea || !csvInput) {
            console.log('CSV elements not ready yet, will retry...');
            // Retry in 100ms
            setTimeout(() => this.enableCsvUploadImmediately(), 100);
            return;
        }
        
        // Force visibility and basic styling
        uploadArea.style.display = 'block';
        uploadArea.style.pointerEvents = 'auto';
        uploadArea.style.cursor = 'pointer';
        
        // Add immediate click handler
        const immediateClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Immediate CSV click handler triggered');
            csvInput.click();
        };
        
        uploadArea.addEventListener('click', immediateClickHandler);
        
        // Add immediate file change handler
        const immediateFileHandler = (e) => {
            console.log('Immediate file handler triggered with', e.target.files.length, 'files');
            if (e.target.files.length > 0) {
                this.loadOverlayFiles(e.target.files);
            }
        };
        
        csvInput.addEventListener('change', immediateFileHandler);
        
        console.log('Immediate CSV upload setup complete');
    }
    
    setupClickableOverlay() {
        // Make the CSV overlay instruction area clickable for file upload
        const instructionOverlay = document.getElementById('csvOverlayInstructionOverlay');
        const csvOverlayInput = document.getElementById('csvOverlayInput');
        
        if (instructionOverlay && csvOverlayInput) {
            // Remove any existing event listeners to prevent duplicates
            instructionOverlay.removeEventListener('click', this.overlayClickHandler);
            
            // Create a bound click handler
            this.overlayClickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Instruction overlay clicked - triggering file upload dialog');
                csvOverlayInput.click();
            };
            
            // Add click event listener
            instructionOverlay.addEventListener('click', this.overlayClickHandler);
            
            // Also handle drag and drop on the instruction overlay
            instructionOverlay.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                instructionOverlay.style.borderColor = '#3b82f6';
                instructionOverlay.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%)';
            });
            
            instructionOverlay.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                instructionOverlay.style.borderColor = '#1e3a8a';
                instructionOverlay.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)';
            });
            
            instructionOverlay.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Files dropped on instruction overlay');
                
                // Reset overlay appearance
                instructionOverlay.style.borderColor = '#1e3a8a';
                instructionOverlay.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)';
                
                // Handle the dropped files
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log(`Processing ${files.length} dropped files`);
                    this.loadOverlayFiles(files);
                }
            });
            
            console.log('Clickable overlay setup completed');
        } else {
            console.warn('Could not find instruction overlay or file input elements');
        }
    }
    
    debugCsvUpload() {
        console.log('=== CSV Upload Debug ===');
        
        const uploadArea = document.getElementById('csvOverlayUploadArea');
        const csvInput = document.getElementById('csvOverlayInput');
        const csvSection = document.getElementById('csvUploadSection');
        
        console.log('Upload area element:', uploadArea);
        console.log('CSV input element:', csvInput);
        console.log('CSV section element:', csvSection);
        console.log('CSV section display:', csvSection ? csvSection.style.display : 'N/A');
        console.log('Current input type:', this.currentInputType);
        console.log('Current CSV mode:', this.currentCsvMode);
        
        if (uploadArea) {
            console.log('Upload area bounds:', uploadArea.getBoundingClientRect());
            console.log('Upload area computed style cursor:', window.getComputedStyle(uploadArea).cursor);
            console.log('Upload area computed style pointer-events:', window.getComputedStyle(uploadArea).pointerEvents);
            
            // Test manual click
            console.log('Testing manual click...');
            uploadArea.click();
        }
        
        return {uploadArea, csvInput, csvSection};
    }
    
    // Get standardized band frequency ranges (in Hz) - correct specification
    getBandRanges() {
        return {
            'B0': { min: 10e3, max: 160e3 },       // 10 to 160 kHz
            'B1': { min: 150e3, max: 650e3 },      // 150 to 650 kHz  
            'B2': { min: 500e3, max: 3e6 },        // 500 kHz to 3 MHz
            'B3': { min: 2.5e6, max: 7.5e6 },      // 2.5 to 7.5 MHz
            'B4': { min: 5e6, max: 30e6 },         // 5 to 30 MHz
            'B5': { min: 25e6, max: 325e6 },       // 25 to 325 MHz
            'B6': { min: 0.3e9, max: 1.3e9 },      // 0.3 to 1.3 GHz
            'B7': { min: 1.0e9, max: 6.0e9 }       // 1.0 to 6.0 GHz
        };
    }
    
    // Auto-zoom to the detected band's frequency range
    setViewToBandRange() {
        if (this.csvOverlayState.datasets.length === 0) return;
        
        // Detect band from first dataset
        const firstDataset = this.csvOverlayState.datasets[0];
        const detectedBand = this.detectBandFromFilename(firstDataset.name);
        
        console.log(`Setting view to band range for detected band: ${detectedBand}`);
        
        const bandRanges = this.getBandRanges();
        const bandRange = bandRanges[detectedBand];
        
        if (bandRange) {
            // Set frequency view bounds to band range
            this.csvOverlayState.viewMinFreq = bandRange.min;
            this.csvOverlayState.viewMaxFreq = bandRange.max;
            
            console.log(`Set frequency view to band ${detectedBand}: ${bandRange.min/1e6} - ${bandRange.max/1e6} MHz`);
            
            // Calculate amplitude range from all datasets within the band frequency range
            let minAmp = Infinity;
            let maxAmp = -Infinity;
            
            this.csvOverlayState.datasets.forEach(dataset => {
                for (let i = 0; i < dataset.frequencyData.length; i++) {
                    const freq = dataset.frequencyData[i];
                    const amp = dataset.amplitudeData[i];
                    
                    // Only consider data points within band range
                    if (freq >= bandRange.min && freq <= bandRange.max) {
                        minAmp = Math.min(minAmp, amp);
                        maxAmp = Math.max(maxAmp, amp);
                    }
                }
            });
            
            // Set amplitude view bounds with some padding
            if (minAmp !== Infinity && maxAmp !== -Infinity) {
                const ampPadding = (maxAmp - minAmp) * 0.05; // 5% padding
                this.csvOverlayState.viewMinAmp = minAmp - ampPadding;
                this.csvOverlayState.viewMaxAmp = maxAmp + ampPadding;
                
                console.log(`Set amplitude view to: ${this.csvOverlayState.viewMinAmp.toFixed(1)} - ${this.csvOverlayState.viewMaxAmp.toFixed(1)} dB`);
            }
            
            // Reset zoom and pan
            this.csvOverlayState.scale = 1;
            this.csvOverlayState.offsetX = 0;
            this.csvOverlayState.offsetY = 0;
            
            // Recalculate overlay ranges
            this.calculateOverlayRanges();
            
        } else {
            console.log(`Unknown band ${detectedBand}, using full data range`);
            // Fall back to original full data range method for unknown bands
            this.resetZoomOverlayToDataRange();
        }
    }
    
    // Debug function to check overlay state
    debugOverlayState() {
        console.log('=== Overlay State Debug ===');
        console.log('CSV Overlay State:', this.csvOverlayState);
        console.log('Folder Selection State:', this.folderSelectionState);
        console.log('Current datasets:', this.csvOverlayState.datasets.map(d => ({
            name: d.name,
            color: d.color,
            visible: d.visible,
            dataPoints: d.frequencyData?.length || 0
        })));
        
        // Force redraw
        if (this.csvOverlayState.datasets.length > 0) {
            console.log('Forcing redraw...');
            this.drawOverlayGraph();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Figure Export Tool...');
    window.figureExportTool = new FigureExportTool();
    
    // Add debugging helpers to window for easy access
    window.debugCsvUpload = () => window.figureExportTool.debugCsvUpload();
    window.openCsvFiles = () => window.figureExportTool.openCsvFileDialog();
    window.fixCsvMode = () => window.figureExportTool.fixCsvModeUI();
    window.debugOverlay = () => window.figureExportTool.debugOverlayState();
    
    // Immediate CSV setup after tool initialization
    const tool = window.figureExportTool;
    
    // Function to ensure CSV upload is working
    const ensureCsvUploadWorking = () => {
        console.log('Ensuring CSV upload is working...');
        
        // Force CSV mode
        tool.switchToMode('csv');
        tool.setInputType('csv');
        tool.updateExportButtonLabels();
        
        // Set up CSV upload listeners multiple times to ensure they work
        setTimeout(() => {
            console.log('Setting up CSV upload listeners (attempt 1)...');
            tool.setupOverlayUploadListeners();
            tool.addCsvUploadFallback();
        }, 100);
        
        setTimeout(() => {
            console.log('Setting up CSV upload listeners (attempt 2)...');
            tool.setupOverlayUploadListeners();
            tool.addCsvUploadFallback();
        }, 300);
        
        setTimeout(() => {
            console.log('Setting up CSV upload listeners (attempt 3)...');
            tool.setupOverlayUploadListeners();
            tool.addCsvUploadFallback();
            
            // Verify everything is working
            const uploadArea = document.getElementById('csvOverlayUploadArea');
            const csvInput = document.getElementById('csvOverlayInput');
            
            console.log('Final verification:', {
                uploadArea: !!uploadArea,
                csvInput: !!csvInput,
                uploadAreaVisible: uploadArea ? getComputedStyle(uploadArea).display !== 'none' : false,
                inputWorking: csvInput ? csvInput.type === 'file' : false
            });
            
            // Ensure upload area is clickable
            if (uploadArea) {
                uploadArea.style.pointerEvents = 'auto';
                uploadArea.style.cursor = 'pointer';
                
                // Add a direct click handler as extra fallback
                uploadArea.addEventListener('click', () => {
                    console.log('Upload area clicked - fallback handler');
                    if (csvInput) csvInput.click();
                });
            }
        }, 500);
    };
    
    // Run multiple times with different delays to ensure it works
    ensureCsvUploadWorking();
    setTimeout(ensureCsvUploadWorking, 500);
    setTimeout(ensureCsvUploadWorking, 1000);
    setTimeout(ensureCsvUploadWorking, 2000);
    
    // Also add a simple fallback that just makes sure clicking works
    setTimeout(() => {
        const uploadArea = document.getElementById('csvOverlayUploadArea');
        const csvInput = document.getElementById('csvOverlayInput');
        
        if (uploadArea && csvInput && !uploadArea.hasAttribute('data-simple-fallback')) {
            console.log('Adding simple fallback click handler...');
            uploadArea.addEventListener('click', () => csvInput.click());
            uploadArea.setAttribute('data-simple-fallback', 'true');
            uploadArea.style.cursor = 'pointer';
            uploadArea.style.pointerEvents = 'auto';
        }
    }, 100);
    
    console.log('Figure Export Tool loaded. Available debug commands:');
    console.log('- debugCsvUpload() - Debug CSV upload issues');
    console.log('- openCsvFiles() - Manually open CSV file dialog');
    console.log('- fixCsvMode() - Fix CSV mode UI state if broken');
    console.log('- debugOverlay() - Debug overlay plotting state and force redraw');
}); 