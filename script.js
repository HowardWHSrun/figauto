// Figure Annotation Tool - Simplified EMC Testing Interface
class FigureAnnotationTool {
    constructor() {
        this.canvas = document.getElementById('annotationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.annotations = [];
        this.annotationCounter = 0;
        this.originalFilename = null; // Store original filename for export
        
        this.initializeEventListeners();
        this.updateTable();
    }
    
    initializeEventListeners() {
        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        
        imageInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Form inputs - update table when values change
        ['runId', 'band', 'location', 'comments'].forEach(id => {
            const element = document.getElementById(id);
            element.addEventListener('input', this.updateTable.bind(this));
        });
        
        // Canvas click for annotations
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        
        // Action buttons
        document.getElementById('clearAnnotations').addEventListener('click', this.clearAnnotations.bind(this));
        document.getElementById('exportImage').addEventListener('click', this.exportImage.bind(this));
    }
    
    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImage(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file);
        }
    }
    
    loadImage(file) {
        // Store original filename for export
        this.originalFilename = file.name;
        
        // Auto-parse filename for Run ID and Band
        this.parseFilename(file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.setupCanvas();
                this.clearAnnotations();
                document.getElementById('instructionOverlay').style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    parseFilename(filename) {
        // Remove file extension for parsing
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        
        // Pattern 1: "Run 127-71, B6 Ambient.png" or "Figure 3-1 Run 127-71, B6v Ambient.png"
        let match = nameWithoutExt.match(/(?:Figure \d+-\d+ )?Run (\d+-\d+),?\s*([B]\d+[a-zA-Z]*)\s+(.+)/i);
        
        if (!match) {
            // Pattern 2: "127-71_B6_Ambient.jpg"
            match = nameWithoutExt.match(/(\d+-\d+)_([B]\d+[a-zA-Z]*)_(.+)/i);
        }
        
        if (!match) {
            // Pattern 3: "127-71 B6 Ambient"
            match = nameWithoutExt.match(/(\d+-\d+)\s+([B]\d+[a-zA-Z]*)\s+(.+)/i);
        }
        
        if (!match) {
            // Pattern 4: Try to find any run ID and band separately
            const runMatch = nameWithoutExt.match(/(\d+-\d+)/);
            const bandMatch = nameWithoutExt.match(/([B]\d+[a-zA-Z]*)/i);
            
            if (runMatch && bandMatch) {
                match = [null, runMatch[1], bandMatch[1], ''];
            }
        }
        
        if (match) {
            const [, runId, band, location] = match;
            
            // Auto-fill Run ID and Band
            document.getElementById('runId').value = runId || '';
            document.getElementById('band').value = band || '';
            
            // Suggest location if found and field is empty
            if (location && location.trim() && !document.getElementById('location').value) {
                document.getElementById('location').value = location.replace(/_/g, ' ').trim();
            }
            
            this.updateTable();
            
            console.log(`Auto-detected: Run ${runId}, Band ${band}${location ? ', Location ' + location : ''}`);
        } else {
            console.log('Could not auto-detect Run ID and Band from filename');
        }
    }
    
    setupCanvas() {
        if (!this.image) return;
        
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth - 40; // Account for padding
        const containerHeight = container.clientHeight - 40;
        
        // Calculate display size maintaining aspect ratio
        const imageAspect = this.image.width / this.image.height;
        const containerAspect = containerWidth / containerHeight;
        
        let displayWidth, displayHeight;
        
        if (imageAspect > containerAspect) {
            displayWidth = containerWidth;
            displayHeight = containerWidth / imageAspect;
        } else {
            displayHeight = containerHeight;
            displayWidth = containerHeight * imageAspect;
        }
        
        this.canvas.width = displayWidth;
        this.canvas.height = displayHeight;
        
        this.drawImage();
    }
    
    drawImage() {
        if (!this.image) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        
        // Redraw annotations
        this.annotations.forEach(annotation => {
            this.drawAnnotation(annotation);
        });
    }
    
    handleCanvasClick(e) {
        if (!this.image) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Prompt for annotation text
        const text = prompt('Enter annotation text:');
        if (text && text.trim()) {
            this.addAnnotation(x, y, text.trim());
        }
    }
    
    addAnnotation(x, y, text) {
        this.annotationCounter++;
        const annotation = {
            id: this.annotationCounter,
            x: x,
            y: y,
            text: text,
            number: this.annotationCounter
        };
        
        this.annotations.push(annotation);
        this.drawAnnotation(annotation);
    }
    
    drawAnnotation(annotation) {
        // Draw marker circle
        this.ctx.save();
        this.ctx.fillStyle = '#1a472a';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(annotation.x, annotation.y, 12, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw number
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(annotation.number, annotation.x, annotation.y);
        
        // Draw callout box
        const boxWidth = Math.max(120, annotation.text.length * 8);
        const boxHeight = 30;
        const boxX = annotation.x + 20;
        const boxY = annotation.y - 15;
        
        // Callout box background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.strokeStyle = '#1a472a';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Callout line
        this.ctx.beginPath();
        this.ctx.moveTo(annotation.x + 12, annotation.y);
        this.ctx.lineTo(boxX, boxY + boxHeight / 2);
        this.ctx.stroke();
        
        // Annotation text
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(annotation.text, boxX + 5, boxY + boxHeight / 2);
        
        this.ctx.restore();
    }
    
    clearAnnotations() {
        this.annotations = [];
        this.annotationCounter = 0;
        if (this.image) {
            this.drawImage();
        }
    }
    
    updateTable() {
        const runId = document.getElementById('runId').value || '-';
        const band = document.getElementById('band').value || '-';
        const location = document.getElementById('location').value || '-';
        const comments = document.getElementById('comments').value || '-';
        
        document.getElementById('tableRun').textContent = runId;
        document.getElementById('tableBand').textContent = band;
        document.getElementById('tableLocation').textContent = location;
        document.getElementById('tableComment').textContent = comments;
    }
    
    exportImage() {
        if (!this.image) {
            alert('Please load an image first.');
            return;
        }
        
        // Get table data
        const runId = document.getElementById('runId').value || '-';
        const band = document.getElementById('band').value || '-';
        const location = document.getElementById('location').value || '-';
        const comments = document.getElementById('comments').value || '-';
        
        // Create export canvas with space for table header and comments section
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Calculate dimensions
        const tableHeight = 100; // Space for compact table header
        const commentsWidth = 400; // Width for comments section
        const margin = 20;
        
        // Set export size: original image width + comments width, image height + table space
        exportCanvas.width = this.image.width + commentsWidth + margin;
        exportCanvas.height = this.image.height + tableHeight;
        
        console.log(`Export canvas size: ${exportCanvas.width} x ${exportCanvas.height}`);
        console.log(`Image size: ${this.image.width} x ${this.image.height}`);
        console.log(`Table data: Run=${runId}, Band=${band}, Location=${location}, Comments=${comments}`);
        
        // Fill background
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Draw compact table header (only over image area, excluding comments section)
        const tableY = margin;
        const tableWidth = this.image.width;
        const cellHeight = 35;
        const headerHeight = 25;
        
        // Table styling
        exportCtx.strokeStyle = '#333';
        exportCtx.lineWidth = 2;
        exportCtx.fillStyle = '#f8f9fa';
        
        // Draw table background
        exportCtx.fillRect(margin, tableY, tableWidth, headerHeight + cellHeight);
        exportCtx.strokeRect(margin, tableY, tableWidth, headerHeight + cellHeight);
        
        // Calculate column widths (without comment column since it's moving to the right)
        const col1Width = tableWidth * 0.3; // Run
        const col2Width = tableWidth * 0.3; // Band  
        const col3Width = tableWidth * 0.4; // Location
        
        // Draw vertical lines
        exportCtx.beginPath();
        exportCtx.moveTo(margin + col1Width, tableY);
        exportCtx.lineTo(margin + col1Width, tableY + headerHeight + cellHeight);
        exportCtx.moveTo(margin + col1Width + col2Width, tableY);
        exportCtx.lineTo(margin + col1Width + col2Width, tableY + headerHeight + cellHeight);
        exportCtx.stroke();
        
        // Draw horizontal line between header and data
        exportCtx.beginPath();
        exportCtx.moveTo(margin, tableY + headerHeight);
        exportCtx.lineTo(margin + tableWidth, tableY + headerHeight);
        exportCtx.stroke();
        
        // Draw header text
        exportCtx.fillStyle = '#333';
        exportCtx.font = 'bold 16px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        
        exportCtx.fillText('Run', margin + col1Width/2, tableY + headerHeight/2);
        exportCtx.fillText('Band', margin + col1Width + col2Width/2, tableY + headerHeight/2);
        exportCtx.fillText('Location', margin + col1Width + col2Width + col3Width/2, tableY + headerHeight/2);
        
        // Draw data text
        exportCtx.font = '14px Times New Roman';
        const dataY = tableY + headerHeight + cellHeight/2;
        
        exportCtx.fillText(runId, margin + col1Width/2, dataY);
        exportCtx.fillText(band, margin + col1Width + col2Width/2, dataY);
        exportCtx.fillText(location, margin + col1Width + col2Width + col3Width/2, dataY);
        
        // Draw comments section on the right side
        const commentsX = this.image.width + margin * 2;
        const commentsY = tableY;
        const commentsBoxWidth = commentsWidth - margin;
        const commentsBoxHeight = this.image.height + tableHeight - margin;
        
        // Comments section background
        exportCtx.fillStyle = '#f8f9fa';
        exportCtx.strokeStyle = '#333';
        exportCtx.lineWidth = 2;
        exportCtx.fillRect(commentsX, commentsY, commentsBoxWidth, commentsBoxHeight);
        exportCtx.strokeRect(commentsX, commentsY, commentsBoxWidth, commentsBoxHeight);
        
        // Comments header
        exportCtx.fillStyle = '#1a472a';
        exportCtx.font = 'bold 18px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'top';
        exportCtx.fillText('Comments', commentsX + commentsBoxWidth/2, commentsY + 15);
        
        // Comments text
        if (comments && comments !== '-') {
            exportCtx.fillStyle = '#333';
            exportCtx.font = '14px Times New Roman';
            exportCtx.textAlign = 'left';
            exportCtx.textBaseline = 'top';
            
            // Word wrap comments text
            const words = comments.split(' ');
            const lines = [];
            let currentLine = '';
            const maxWidth = commentsBoxWidth - 30;
            
            for (const word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                if (exportCtx.measureText(testLine).width <= maxWidth) {
                    currentLine = testLine;
                } else {
                    if (currentLine) lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) lines.push(currentLine);
            
            // Draw wrapped lines
            const lineHeight = 20;
            const startY = commentsY + 50;
            
            for (let i = 0; i < lines.length; i++) {
                const y = startY + i * lineHeight;
                if (y < commentsY + commentsBoxHeight - 20) { // Stay within bounds
                    exportCtx.fillText(lines[i], commentsX + 15, y);
                }
            }
        }
        
        // Draw original image below table (on the left side)
        const imageY = tableHeight + margin;
        const imageX = margin;
        exportCtx.drawImage(this.image, imageX, imageY);
        
        // Calculate scale factor for annotations (same as display canvas)
        const scaleX = this.image.width / this.canvas.width;
        const scaleY = this.image.height / this.canvas.height;
        
        console.log(`Scale factors: X=${scaleX}, Y=${scaleY}`);
        console.log(`Number of annotations: ${this.annotations.length}`);
        
        // Draw annotations at full resolution (offset by image position)
        this.annotations.forEach((annotation, index) => {
            const scaledX = (annotation.x * scaleX) + imageX; // Offset by image X position
            const scaledY = (annotation.y * scaleY) + imageY; // Offset by image Y position
            
            console.log(`Annotation ${index + 1}: Original (${annotation.x}, ${annotation.y}) -> Scaled (${scaledX}, ${scaledY})`);
            
            // Draw marker circle
            exportCtx.save();
            exportCtx.fillStyle = '#1a472a';
            exportCtx.strokeStyle = 'white';
            exportCtx.lineWidth = 6;
            
            exportCtx.beginPath();
            exportCtx.arc(scaledX, scaledY, 24, 0, 2 * Math.PI);
            exportCtx.fill();
            exportCtx.stroke();
            
            // Draw number
            exportCtx.fillStyle = 'white';
            exportCtx.font = 'bold 20px Arial';
            exportCtx.textAlign = 'center';
            exportCtx.textBaseline = 'middle';
            exportCtx.fillText(annotation.number, scaledX, scaledY);
            
            // Draw callout box
            const boxWidth = Math.max(250, annotation.text.length * 16);
            const boxHeight = 60;
            const boxX = scaledX + 40;
            const boxY = scaledY - 30;
            
            // Ensure box stays within image bounds (not overlapping comments section)
            const maxBoxX = imageX + this.image.width - boxWidth - 10;
            const adjustedBoxX = Math.min(Math.max(boxX, imageX + 10), maxBoxX);
            const adjustedBoxY = Math.max(imageY + 10, Math.min(boxY, exportCanvas.height - boxHeight - 10));
            
            // Callout box background
            exportCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            exportCtx.strokeStyle = '#1a472a';
            exportCtx.lineWidth = 4;
            exportCtx.fillRect(adjustedBoxX, adjustedBoxY, boxWidth, boxHeight);
            exportCtx.strokeRect(adjustedBoxX, adjustedBoxY, boxWidth, boxHeight);
            
            // Callout line
            exportCtx.strokeStyle = '#1a472a';
            exportCtx.lineWidth = 3;
            exportCtx.beginPath();
            exportCtx.moveTo(scaledX + 24, scaledY);
            exportCtx.lineTo(adjustedBoxX, adjustedBoxY + boxHeight / 2);
            exportCtx.stroke();
            
            // Annotation text
            exportCtx.fillStyle = '#333';
            exportCtx.font = '18px Arial';
            exportCtx.textAlign = 'left';
            exportCtx.textBaseline = 'middle';
            
            // Word wrap for long text
            const words = annotation.text.split(' ');
            const maxWidth = boxWidth - 20;
            let y = adjustedBoxY + boxHeight / 2;
            
            if (exportCtx.measureText(annotation.text).width <= maxWidth) {
                exportCtx.fillText(annotation.text, adjustedBoxX + 10, y);
            } else {
                // Split into two lines if too long
                const midPoint = Math.ceil(words.length / 2);
                const firstLine = words.slice(0, midPoint).join(' ');
                const secondLine = words.slice(midPoint).join(' ');
                
                exportCtx.fillText(firstLine, adjustedBoxX + 10, y - 10);
                exportCtx.fillText(secondLine, adjustedBoxX + 10, y + 10);
            }
            
            exportCtx.restore();
        });
        
        // Generate filename: "annotated_" + original filename
        let filename = 'annotated_image.png';
        if (this.originalFilename) {
            const nameWithoutExt = this.originalFilename.replace(/\.[^/.]+$/, "");
            filename = `annotated_${nameWithoutExt}.png`;
        }
        
        // Download
        exportCanvas.toBlob(blob => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                console.log(`Successfully exported as: ${filename}`);
                console.log(`Export completed with table data and ${this.annotations.length} annotations`);
            } else {
                console.error('Failed to create blob for export');
                alert('Failed to export image. Please try again.');
            }
        }, 'image/png', 1.0);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new FigureAnnotationTool();
}); 