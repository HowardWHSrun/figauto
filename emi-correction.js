/**
 * EMI Correction Module
 * Turner Engineering Corporation - Figure Export Tool v3.5
 * 
 * Handles EMI measurement file corrections with add/subtract logic
 * Based on PCEP correction methodology
 */

class EMICorrectionTool {
    constructor() {
        this.measurementFile = null;
        this.addCorrectionFile = null;
        this.subtractCorrectionFile = null;
        
        this.measurementData = null;
        this.addCorrectionData = null;
        this.subtractCorrectionData = null;
        this.correctedData = null;
        
        this.canvas = null;
        this.ctx = null;
        
        // Visualization state
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Event listener setup flag
        this.listenersSetup = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners(force = false) {
        // Prevent duplicate listener setup unless forced
        if (this.listenersSetup && !force) return;
        
        console.log('Setting up EMI correction event listeners...');
        
        // File upload listeners
        const measurementInput = document.getElementById('measurementFileInput');
        if (measurementInput) {
            measurementInput.addEventListener('change', (e) => {
                console.log('Measurement file input changed');
                this.handleMeasurementFileUpload(e);
            });
            console.log('Measurement file input listener attached');
        } else {
            console.warn('measurementFileInput element not found');
        }
        
        const addCorrectionInput = document.getElementById('addCorrectionFileInput');
        if (addCorrectionInput) {
            addCorrectionInput.addEventListener('change', (e) => {
                console.log('Add correction file input changed');
                this.handleAddCorrectionFileUpload(e);
            });
            console.log('Add correction file input listener attached');
        } else {
            console.warn('addCorrectionFileInput element not found');
        }
        
        const subtractCorrectionInput = document.getElementById('subtractCorrectionFileInput');
        if (subtractCorrectionInput) {
            subtractCorrectionInput.addEventListener('change', (e) => {
                console.log('Subtract correction file input changed');
                this.handleSubtractCorrectionFileUpload(e);
            });
            console.log('Subtract correction file input listener attached');
        } else {
            console.warn('subtractCorrectionFileInput element not found');
        }
        
        // Control buttons
        document.getElementById('applyCorrectionBtn')?.addEventListener('click', () => {
            this.applyCorrection();
        });
        
        document.getElementById('exportCorrectedBtn')?.addEventListener('click', () => {
            this.exportCorrectedData();
        });
        
        document.getElementById('resetCorrectionBtn')?.addEventListener('click', () => {
            this.resetCorrection();
        });
        
        // Zoom controls
        document.getElementById('correctionZoomIn')?.addEventListener('click', () => {
            this.zoomIn();
        });
        
        document.getElementById('correctionZoomOut')?.addEventListener('click', () => {
            this.zoomOut();
        });
        
        document.getElementById('correctionResetZoom')?.addEventListener('click', () => {
            this.resetZoom();
        });
        
        // Drag and drop for measurement file
        this.setupDragAndDrop('measurementUploadArea', (files) => {
            this.loadMeasurementFile(files[0]);
        });
        
        // Drag and drop for correction files
        this.setupDragAndDrop('addCorrectionUploadArea', (files) => {
            this.loadAddCorrectionFile(files[0]);
        });
        
        this.setupDragAndDrop('subtractCorrectionUploadArea', (files) => {
            this.loadSubtractCorrectionFile(files[0]);
        });

        // Add click handlers for upload areas
        this.setupClickHandler('measurementUploadArea', 'measurementFileInput');
        this.setupClickHandler('addCorrectionUploadArea', 'addCorrectionFileInput');
        this.setupClickHandler('subtractCorrectionUploadArea', 'subtractCorrectionFileInput');
        
        // Mark listeners as set up
        this.listenersSetup = true;
        console.log('EMI correction event listeners setup complete');
    }
    
    setupDragAndDrop(elementId, onFilesDropped) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('dragover');
        });
        
        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            element.classList.remove('dragover');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onFilesDropped(files);
            }
        });
    }

    setupClickHandler(uploadAreaId, fileInputId) {
        const uploadArea = document.getElementById(uploadAreaId);
        const fileInput = document.getElementById(fileInputId);
        
        if (!uploadArea) {
            console.warn(`Upload area element not found: ${uploadAreaId}`);
            return;
        }
        if (!fileInput) {
            console.warn(`File input element not found: ${fileInputId}`);
            return;
        }
        
        uploadArea.addEventListener('click', () => {
            console.log(`Upload area clicked: ${uploadAreaId}`);
            fileInput.click();
        });
        
        console.log(`Click handler set up for ${uploadAreaId} -> ${fileInputId}`);
    }
    
    // File handling methods
    handleMeasurementFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadMeasurementFile(file);
        }
    }
    
    handleAddCorrectionFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadAddCorrectionFile(file);
        }
    }
    
    handleSubtractCorrectionFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadSubtractCorrectionFile(file);
        }
    }
    
    loadMeasurementFile(file) {
        console.log('Loading measurement file:', file.name);
        this.measurementFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.measurementData = this.parseDataFile(e.target.result, file.name);
                this.updateFileStatus('measurementStatus', file.name, true);
                this.updateVisualization();
                this.updateApplyButton();
            } catch (error) {
                console.error('Error parsing measurement file:', error);
                this.updateFileStatus('measurementStatus', file.name, false, error.message);
            }
        };
        reader.readAsText(file);
    }
    
    loadAddCorrectionFile(file) {
        console.log('Loading add correction file:', file.name);
        this.addCorrectionFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.addCorrectionData = this.parseCorrectionFile(e.target.result, file.name);
                this.updateFileStatus('addCorrectionStatus', file.name, true);
                this.updateApplyButton();
            } catch (error) {
                console.error('Error parsing add correction file:', error);
                this.updateFileStatus('addCorrectionStatus', file.name, false, error.message);
            }
        };
        reader.readAsText(file);
    }
    
    loadSubtractCorrectionFile(file) {
        console.log('Loading subtract correction file:', file.name);
        this.subtractCorrectionFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.subtractCorrectionData = this.parseCorrectionFile(e.target.result, file.name);
                this.updateFileStatus('subtractCorrectionStatus', file.name, true);
                this.updateApplyButton();
            } catch (error) {
                console.error('Error parsing subtract correction file:', error);
                this.updateFileStatus('subtractCorrectionStatus', file.name, false, error.message);
            }
        };
        reader.readAsText(file);
    }
    
    // File parsing methods
    parseDataFile(content, filename) {
        const lines = content.split('\n');
        let dataStartIndex = -1;
        
        // Find where data starts (look for "DATA" or "DATA,")
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === 'DATA' || line === 'DATA,') {
                dataStartIndex = i + 1;
                break;
            }
        }
        
        if (dataStartIndex === -1) {
            throw new Error('Could not find DATA line in file');
        }
        
        // Store header for later export
        const header = lines.slice(0, dataStartIndex);
        
        // Parse data
        const frequencies = [];
        const measurements = [];
        
        for (let i = dataStartIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && line.includes(',')) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const freq = parseFloat(parts[0]);
                    const measurement = parseFloat(parts[1]);
                    
                    if (!isNaN(freq) && !isNaN(measurement)) {
                        frequencies.push(freq); // Hz
                        measurements.push(measurement); // dBuV/m
                    }
                }
            }
        }
        
        if (frequencies.length === 0) {
            throw new Error('No valid data found in file');
        }
        
        return {
            filename: filename,
            header: header,
            frequencies: frequencies, // Hz
            measurements: measurements, // dBuV/m
            frequenciesMHz: frequencies.map(f => f / 1e6) // MHz for visualization
        };
    }
    
    parseCorrectionFile(content, filename) {
        const lines = content.split('\n');
        let dataStartIndex = -1;
        
        // Find where data starts (look for "DATA" or "DATA,")
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === 'DATA' || line === 'DATA,') {
                dataStartIndex = i + 1;
                break;
            }
        }
        
        if (dataStartIndex === -1) {
            throw new Error('Could not find DATA line in correction file');
        }
        
        // Parse correction data
        const frequencies = [];
        const corrections = [];
        
        for (let i = dataStartIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && line.includes(',')) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const freq = parseFloat(parts[0]); // MHz
                    const correction = parseFloat(parts[1]); // dB
                    
                    if (!isNaN(freq) && !isNaN(correction)) {
                        frequencies.push(freq * 1e6); // Convert to Hz for consistency
                        corrections.push(correction);
                    }
                }
            }
        }
        
        if (frequencies.length === 0) {
            throw new Error('No valid correction data found in file');
        }
        
        return {
            filename: filename,
            frequencies: frequencies, // Hz
            corrections: corrections // dB
        };
    }
    
    // Interpolation function
    interpolateCorrection(targetFreq, correctionData) {
        if (!correctionData || correctionData.frequencies.length === 0) {
            return 0; // No correction if no data
        }
        
        const freqs = correctionData.frequencies;
        const corrections = correctionData.corrections;
        
        // If target frequency is outside range, extrapolate using nearest value
        if (targetFreq <= freqs[0]) {
            return corrections[0];
        }
        if (targetFreq >= freqs[freqs.length - 1]) {
            return corrections[corrections.length - 1];
        }
        
        // Find surrounding points for linear interpolation
        for (let i = 0; i < freqs.length - 1; i++) {
            if (targetFreq >= freqs[i] && targetFreq <= freqs[i + 1]) {
                // Linear interpolation
                const t = (targetFreq - freqs[i]) / (freqs[i + 1] - freqs[i]);
                return corrections[i] + t * (corrections[i + 1] - corrections[i]);
            }
        }
        
        return 0; // Fallback
    }
    
    // Apply correction logic
    applyCorrection() {
        if (!this.measurementData) {
            alert('Please upload a measurement file first');
            return;
        }
        
        console.log('Applying corrections...');
        
        const correctedMeasurements = [];
        const addCorrections = [];
        const subtractCorrections = [];
        
        for (let i = 0; i < this.measurementData.frequencies.length; i++) {
            const freq = this.measurementData.frequencies[i]; // Hz
            const originalMeasurement = this.measurementData.measurements[i];
            
            // Get corrections via interpolation
            const addCorrection = this.interpolateCorrection(freq, this.addCorrectionData);
            const subtractCorrection = this.interpolateCorrection(freq, this.subtractCorrectionData);
            
            // Apply correction: Original + Add - Subtract
            const correctedMeasurement = originalMeasurement + addCorrection - subtractCorrection;
            
            correctedMeasurements.push(correctedMeasurement);
            addCorrections.push(addCorrection);
            subtractCorrections.push(subtractCorrection);
        }
        
        // Store corrected data
        this.correctedData = {
            frequencies: this.measurementData.frequencies,
            frequenciesMHz: this.measurementData.frequenciesMHz,
            originalMeasurements: this.measurementData.measurements,
            correctedMeasurements: correctedMeasurements,
            addCorrections: addCorrections,
            subtractCorrections: subtractCorrections,
            netCorrections: addCorrections.map((add, i) => add - subtractCorrections[i])
        };
        
        // Update visualization
        this.updateVisualization();
        
        // Enable export button
        const exportBtn = document.getElementById('exportCorrectedBtn');
        if (exportBtn) {
            exportBtn.disabled = false;
        }
        
        // Show statistics
        this.updateStatistics();
        
        console.log('Correction applied successfully');
    }
    
    updateStatistics() {
        if (!this.correctedData) return;
        
        const original = this.correctedData.originalMeasurements;
        const corrected = this.correctedData.correctedMeasurements;
        const net = this.correctedData.netCorrections;
        
        const stats = {
            originalRange: `${Math.min(...original).toFixed(1)} to ${Math.max(...original).toFixed(1)} dBuV/m`,
            correctedRange: `${Math.min(...corrected).toFixed(1)} to ${Math.max(...corrected).toFixed(1)} dBuV/m`,
            avgNetCorrection: `${(net.reduce((a, b) => a + b, 0) / net.length).toFixed(2)} dB`,
            maxNetCorrection: `${Math.max(...net).toFixed(2)} dB`,
            minNetCorrection: `${Math.min(...net).toFixed(2)} dB`
        };
        
        // Update statistics display
        const statsElement = document.getElementById('correctionStatistics');
        if (statsElement) {
            statsElement.innerHTML = `
                <h4>Correction Statistics</h4>
                <p><strong>Original Range:</strong> ${stats.originalRange}</p>
                <p><strong>Corrected Range:</strong> ${stats.correctedRange}</p>
                <p><strong>Average Net Correction:</strong> ${stats.avgNetCorrection}</p>
                <p><strong>Correction Range:</strong> ${stats.minNetCorrection} to ${stats.maxNetCorrection}</p>
            `;
        }
    }
    
    exportCorrectedData() {
        if (!this.correctedData || !this.measurementData) {
            alert('No corrected data to export');
            return;
        }
        
        // Create corrected file content
        let content = '';
        
        // Add original header
        for (const line of this.measurementData.header) {
            content += line;
            if (!line.endsWith('\n')) content += '\n';
        }
        
        // Add corrected data
        for (let i = 0; i < this.correctedData.frequencies.length; i++) {
            const freq = this.correctedData.frequencies[i];
            const measurement = this.correctedData.correctedMeasurements[i];
            content += `${freq},${measurement}\n`;
        }
        
        // Create download
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename
        const originalName = this.measurementFile.name;
        const baseName = originalName.replace('.csv', '');
        a.download = `${baseName}_corrected.csv`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Corrected data exported');
    }
    
    resetCorrection() {
        this.measurementFile = null;
        this.addCorrectionFile = null;
        this.subtractCorrectionFile = null;
        this.measurementData = null;
        this.addCorrectionData = null;
        this.subtractCorrectionData = null;
        this.correctedData = null;
        
        // Reset file inputs
        const inputs = ['measurementFileInput', 'addCorrectionFileInput', 'subtractCorrectionFileInput'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        
        // Reset status displays
        this.updateFileStatus('measurementStatus', '', false);
        this.updateFileStatus('addCorrectionStatus', '', false);
        this.updateFileStatus('subtractCorrectionStatus', '', false);
        
        // Clear canvas
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.showInstructionText();
        }
        
        // Clear statistics
        const statsElement = document.getElementById('correctionStatistics');
        if (statsElement) {
            statsElement.innerHTML = '<p class="helper-hint">Upload files and apply correction to see statistics</p>';
        }
        
        // Disable buttons
        this.updateApplyButton();
        const exportBtn = document.getElementById('exportCorrectedBtn');
        if (exportBtn) exportBtn.disabled = true;
        
        console.log('Correction tool reset');
    }
    
    updateFileStatus(statusId, filename, success, error = '') {
        const statusElement = document.getElementById(statusId);
        if (!statusElement) return;
        
        if (!filename) {
            statusElement.innerHTML = '<span class="file-status">No file selected</span>';
            statusElement.className = 'file-status';
            return;
        }
        
        if (success) {
            statusElement.innerHTML = `<span class="file-status loaded">✓ ${filename}</span>`;
            statusElement.className = 'file-status loaded';
        } else {
            statusElement.innerHTML = `<span class="file-status error">✗ ${filename} - ${error}</span>`;
            statusElement.className = 'file-status error';
        }
    }
    
    updateApplyButton() {
        const applyBtn = document.getElementById('applyCorrectionBtn');
        if (!applyBtn) return;
        
        // Enable if we have measurement data and at least one correction file
        const hasData = this.measurementData !== null;
        const hasCorrection = this.addCorrectionData !== null || this.subtractCorrectionData !== null;
        
        applyBtn.disabled = !(hasData && hasCorrection);
    }
    
    // Visualization methods
    setupCanvas() {
        this.canvas = document.getElementById('correctionCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Setup mouse listeners
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        
        // Setup resize listener
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Show initial instruction
        this.showInstructionText();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        // Make canvas 3 times taller
        this.canvas.height = Math.max(container.clientHeight * 3, 600);
        
        this.updateVisualization();
    }
    
    showInstructionText() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.fillText('Upload measurement and correction files', centerX, centerY - 20);
        this.ctx.fillText('to see visualization', centerX, centerY + 20);
    }
    
    updateVisualization() {
        if (!this.canvas || !this.ctx) {
            // Try to setup canvas if not done yet
            this.setupCanvas();
            return;
        }
        
        if (!this.measurementData) {
            this.showInstructionText();
            return;
        }
        
        this.drawGraph();
    }
    
    drawGraph() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
        
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Get data ranges
        const freqData = this.measurementData.frequenciesMHz;
        const originalData = this.measurementData.measurements;
        
        let allData = [...originalData];
        if (this.correctedData) {
            allData = [...allData, ...this.correctedData.correctedMeasurements];
        }
        
        const minFreq = Math.min(...freqData);
        const maxFreq = Math.max(...freqData);
        
        // Calculate amplitude range with 10dB increments
        const dataMinAmp = Math.min(...allData);
        const dataMaxAmp = Math.max(...allData);
        const range = dataMaxAmp - dataMinAmp;
        const padding = Math.max(range * 0.15, 10); // At least 15% padding or 10dB
        
        // Round to 10dB boundaries
        const minAmp = Math.floor((dataMinAmp - padding) / 10) * 10;
        const maxAmp = Math.ceil((dataMaxAmp + padding) / 10) * 10;
        
        // Apply zoom and pan
        const freqRange = (maxFreq - minFreq) / this.scale;
        const ampRange = (maxAmp - minAmp) / this.scale;
        
        const freqCenter = (minFreq + maxFreq) / 2 - (this.offsetX / plotWidth) * freqRange;
        const ampCenter = (minAmp + maxAmp) / 2 + (this.offsetY / plotHeight) * ampRange;
        
        const freqStart = freqCenter - freqRange / 2;
        const freqEnd = freqCenter + freqRange / 2;
        const ampStart = ampCenter - ampRange / 2;
        const ampEnd = ampCenter + ampRange / 2;
        
        // Draw grid
        this.drawGrid(margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd);
        
        // Draw axes
        this.drawAxes(margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd);
        
        // Draw original data
        this.drawDataLine(freqData, originalData, '#0066cc', 'Original', margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd);
        
        // Draw corrected data if available
        if (this.correctedData) {
            this.drawDataLine(freqData, this.correctedData.correctedMeasurements, '#cc0000', 'Corrected', margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd);
        }
        
        // Draw legend
        this.drawLegend(margin);
    }
    
    drawGrid(margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd) {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = margin.left + (i / 10) * plotWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, margin.top);
            this.ctx.lineTo(x, margin.top + plotHeight);
            this.ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 10; i++) {
            const y = margin.top + (i / 10) * plotHeight;
            this.ctx.beginPath();
            this.ctx.moveTo(margin.left, y);
            this.ctx.lineTo(margin.left + plotWidth, y);
            this.ctx.stroke();
        }
    }
    
    drawAxes(margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd) {
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(margin.left, margin.top + plotHeight);
        this.ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(margin.left, margin.top);
        this.ctx.lineTo(margin.left, margin.top + plotHeight);
        this.ctx.stroke();
        
        // Labels
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X-axis labels
        for (let i = 0; i <= 5; i++) {
            const freq = freqStart + (freqEnd - freqStart) * (i / 5);
            const x = margin.left + (i / 5) * plotWidth;
            this.ctx.fillText(freq.toFixed(0) + ' MHz', x, margin.top + plotHeight + 20);
        }
        
        // Y-axis labels with 10dB increments
        this.ctx.textAlign = 'right';
        const ampRange = ampEnd - ampStart;
        const ampStep = 10; // 10dB increments
        const numTicks = Math.ceil(ampRange / ampStep);
        
        for (let i = 0; i <= numTicks; i++) {
            const amp = Math.round((ampStart + i * ampStep) / 10) * 10; // Round to nearest 10
            if (amp >= ampStart && amp <= ampEnd) {
                const y = margin.top + plotHeight - ((amp - ampStart) / (ampEnd - ampStart)) * plotHeight;
                this.ctx.fillText(amp.toFixed(0) + ' dB', margin.left - 10, y + 4);
            }
        }
        
        // Axis titles
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Frequency (MHz)', margin.left + plotWidth / 2, margin.top + plotHeight + 45);
        
        this.ctx.save();
        this.ctx.translate(25, margin.top + plotHeight / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Amplitude (dBuV/m)', 0, 0);
        this.ctx.restore();
    }
    
    drawDataLine(freqData, ampData, color, label, margin, plotWidth, plotHeight, freqStart, freqEnd, ampStart, ampEnd) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        let firstPoint = true;
        for (let i = 0; i < freqData.length; i++) {
            const freq = freqData[i];
            const amp = ampData[i];
            
            if (freq >= freqStart && freq <= freqEnd) {
                const x = margin.left + ((freq - freqStart) / (freqEnd - freqStart)) * plotWidth;
                const y = margin.top + plotHeight - ((amp - ampStart) / (ampEnd - ampStart)) * plotHeight;
                
                if (firstPoint) {
                    this.ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        }
        this.ctx.stroke();
    }
    
    drawLegend(margin) {
        const legendX = margin.left + 20;
        const legendY = margin.top + 20;
        
        // Legend background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(legendX - 10, legendY - 10, 120, this.correctedData ? 50 : 30);
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(legendX - 10, legendY - 10, 120, this.correctedData ? 50 : 30);
        
        // Original data legend
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(legendX, legendY);
        this.ctx.lineTo(legendX + 20, legendY);
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Original', legendX + 25, legendY + 4);
        
        // Corrected data legend (if available)
        if (this.correctedData) {
            this.ctx.strokeStyle = '#cc0000';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(legendX, legendY + 20);
            this.ctx.lineTo(legendX + 20, legendY + 20);
            this.ctx.stroke();
            
            this.ctx.fillText('Corrected', legendX + 25, legendY + 24);
        }
    }
    
    // Mouse interaction methods
    handleMouseDown(e) {
        this.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastMouseX = e.clientX - rect.left;
        this.lastMouseY = e.clientY - rect.top;
        this.canvas.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const deltaX = mouseX - this.lastMouseX;
        const deltaY = mouseY - this.lastMouseY;
        
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
        
        this.updateVisualization();
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.scale = Math.max(0.1, Math.min(this.scale * zoomFactor, 10));
        
        this.updateVisualization();
    }
    
    // Control methods
    resetZoom() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateVisualization();
    }
    
    zoomIn() {
        this.scale = Math.min(this.scale * 1.2, 10);
        this.updateVisualization();
    }
    
    zoomOut() {
        this.scale = Math.max(this.scale / 1.2, 0.1);
        this.updateVisualization();
    }
}

// Global instance
let emiCorrectionTool = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    emiCorrectionTool = new EMICorrectionTool();
    // Don't setup canvas here - let it be called when correction mode is activated
    window.emiCorrectionTool = emiCorrectionTool; // Make it globally accessible
});

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMICorrectionTool;
} 