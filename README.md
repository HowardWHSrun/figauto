# Figure Export Tool v3.1

Professional EMC testing annotation tool with comprehensive band-specific frequency identification, multi-page support, and Tenco-compliant documentation export. Complete modular frequency database covering 9 kHz to 325 MHz with framework for expansion to 3 THz.

## Quick Setup

1. **Download**: Clone or download all files from [GitHub](https://github.com/HowardWHSrun/figauto.git)
2. **Open**: Launch `index.html` in any modern web browser
3. **Logo** (Optional): Replace `tenco-logo.png` with your company logo
4. **Ready**: No additional installation required - fully client-side application

## 🚀 What's New in v3.1

### **Band-Specific Peak Identification System**
- **Modular Architecture**: 8 separate frequency band databases for efficient loading
- **150+ Allocations**: Comprehensive coverage from VLF to VHF with room for expansion
- **Smart Band Selection**: Click B0-B7 buttons for targeted frequency identification
- **Multi-Page Support**: Tabbed interface for managing multiple spectrum analyses

### **Complete Frequency Coverage**
- **Band 0 (VLF/LF)**: 9-160 kHz (22 allocations) - Navigation, time signals, maritime
- **Band 1 (MF)**: 148.5 kHz-1.605 MHz (22 allocations) - AM broadcast, maritime, amateur 160m
- **Band 2 (HF Lower)**: 535 kHz-3.025 MHz (28 allocations) - Extended AM, amateur, maritime
- **Band 3 (HF Core)**: 2.495-8.1 MHz (47 allocations) - Amateur 80m/40m, international broadcast, WWV
- **Band 4 (Upper HF)**: 5-30 MHz (6 key allocations) - Amateur 20m/15m/12m/10m, CB radio
- **Band 5 (VHF)**: 25-325 MHz (15 critical allocations) - FM radio, TV, aviation, amateur 6m/2m

## Key Features

### **🎯 Intelligent Peak Identification**
- **Auto-Identification Mode**: Click peaks for automatic FCC frequency identification
- **Band-Specific Search**: Select target frequency band for focused results
- **Range Search**: Find all allocations in frequency ranges (e.g., "144-148 MHz")
- **Click-to-Add**: One-click addition of identified services to comments

### **📊 Comprehensive Database**
- **Complete FCC Allocations**: Official frequency table with US rule references
- **ITU Footnotes**: International allocation references (5.xxx series)
- **FCC Part References**: Direct links to regulatory sections (Part 97, 73, 87, etc.)
- **Service Categories**: Amateur, Broadcasting, Aviation, Maritime, ISM, Satellite

### **📈 Professional Documentation**
- **Tenco Style Compliance**: Clean, conservative corporate formatting
- **Spectrum Analyzer Layout**: Professional table headers with Run | Band | Location
- **Auto-Generated Analysis**: Smart summary generation for regulatory documentation
- **High-Resolution Export**: Original image quality with professional annotations

### **⚡ Smart Automation**
- **Filename Parsing**: Auto-extracts Run ID, band, and location from filenames
- **Multi-Page Management**: Tabbed interface for multiple test configurations
- **Corporate Branding**: Automatic Tenco logo integration with fallback support
- **Responsive Design**: Works on desktop, tablet, and mobile browsers

## Quick Usage Guide

### **Basic Workflow**
1. **Upload Images**: Drag & drop or select spectrum analyzer screenshots
2. **Auto-Detection**: Tool extracts test info from filename patterns like `"Run 127-71, B6 Ambient.png"`
3. **Select Band**: Choose appropriate frequency band (B0-B7) for targeted identification
4. **Annotate Peaks**: Click spectrum peaks for automatic FCC service identification
5. **Export Documentation**: Generate professional Tenco-formatted reports

### **Advanced Features**
- **Range Search**: Enter "2.4-2.5 GHz" to see all allocations in that range
- **Multi-Page Analysis**: Use tabs to manage multiple test configurations
- **Comment Integration**: Click identified frequencies to automatically add to analysis comments
- **Professional Export**: Generate publication-ready documentation with corporate styling

## Frequency Band Reference

### **Currently Implemented (v3.1)**

| Band | Frequency Range | Coverage | Key Services |
|------|----------------|----------|--------------|
| **B0** | 9-160 kHz | VLF/LF | Navigation, time signals, maritime |
| **B1** | 148.5 kHz-1.605 MHz | MF | AM broadcast, maritime, amateur 160m |
| **B2** | 535 kHz-3.025 MHz | HF Lower | Extended AM, amateur, maritime |
| **B3** | 2.495-8.1 MHz | HF Core | Amateur 80m/40m, international broadcast, WWV |
| **B4** | 5-30 MHz | Upper HF | Amateur 20m/15m/12m/10m, CB radio |
| **B5** | 25-325 MHz | VHF | FM radio, TV, aviation, amateur 6m/2m |

### **Framework Ready (Future Expansion)**

| Band | Planned Range | Services |
|------|---------------|----------|
| **B6** | 300 MHz-3 GHz | UHF TV, cellular, GPS, WiFi, amateur 70cm |
| **B7** | 3-30 GHz | SHF radar, satellite, microwave links |

## Professional Export Features

### **Tenco Corporate Standards**
- **Conservative Styling**: Professional gray and white color scheme
- **Typography**: Arial Bold headers, Times New Roman body text
- **Layout**: Spectrum analyzer-style table format with structured comments
- **Branding**: Automatic logo integration with professional placement

### **Technical Specifications**
- **Resolution**: High-DPI export maintaining original image quality
- **Format**: PNG with transparency support for overlay annotations
- **Naming**: Standardized `Figure_[RunID]_[Band]_Professional.png` convention
- **Compatibility**: Works with all major EMC test equipment screenshot formats

## Filename Auto-Detection Patterns

The tool automatically recognizes common EMC test filename patterns:

```
✅ Run 127-71, B6 Ambient.png
✅ 127-71_B6_Ambient.jpg  
✅ Figure 3-1 Run 127-71, B6v Ambient.png
✅ B6v_127-71.png
✅ EMC_Test_127-71_B6_Background.jpeg
```

**Extracted Information:**
- **Run ID**: 127-71
- **Band**: B6 (auto-selects appropriate frequency band)
- **Location**: Ambient, Background, etc.

## EMC Testing Applications

### **Perfect For**
- **FCC Part 15 Compliance**: Complete database for unintentional radiator testing
- **Spectrum Management**: Frequency coordination and interference analysis  
- **EMC Documentation**: Professional reports for regulatory submissions
- **RF Analysis**: Comprehensive frequency identification for troubleshooting
- **Training**: Educational tool for EMC engineers and technicians

### **Regulatory Support**
- **FCC Rules**: Direct Part references for all frequency allocations
- **International**: ITU Region 2 allocations with footnote references
- **Amateur Radio**: Complete band plans with sub-band designations
- **Commercial Services**: Broadcasting, aviation, maritime frequency guides

## Technical Architecture

### **Modular Database Design**
```
peak-identification-database-band0.js  // VLF/LF (9-160 kHz)
peak-identification-database-band1.js  // MF (148.5 kHz-1.605 MHz)
peak-identification-database-band2.js  // HF Lower (535 kHz-3.025 MHz)
peak-identification-database-band3.js  // HF Core (2.495-8.1 MHz)
peak-identification-database-band4.js  // Upper HF (5-30 MHz)
peak-identification-database-band5.js  // VHF (25-325 MHz)
peak-identification-database-band6.js  // UHF (framework ready)
peak-identification-database-band7.js  // SHF (framework ready)
```

### **Performance Optimizations**
- **Lazy Loading**: Band databases loaded only when needed
- **Smart Caching**: Efficient frequency lookup algorithms
- **Responsive UI**: Fast band switching and search capabilities
- **Memory Efficient**: Modular architecture reduces initial load time

## Browser Compatibility

**Fully Compatible:**
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Mobile browsers with HTML5 Canvas and File API support
- Offline capable - no internet connection required after initial load

## Development & Customization

### **Adding New Frequency Bands**
1. Create new `peak-identification-database-bandX.js` file
2. Follow existing data structure format
3. Add to HTML script includes
4. Update `bandDefinitions` in `script.js`

### **Corporate Branding**
- Replace `tenco-logo.png` with your company logo (PNG format recommended)
- Modify color schemes in `styles.css` 
- Update company name references in export functions

## Support & Documentation

- **Repository**: [https://github.com/HowardWHSrun/figauto.git](https://github.com/HowardWHSrun/figauto.git)
- **Version**: 3.1 (Band-Specific Peak Identification System)
- **License**: Contact Turner Engineering Corporation for licensing
- **Updates**: Check GitHub releases for latest versions

---

**Turner Engineering Corporation** - Professional EMC testing tools for regulatory compliance and spectrum management. 