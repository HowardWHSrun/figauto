# Figure Export Tool v3.3

**Turner Engineering Corporation** - Professional EMC Testing Annotation System  
*Developed by Howard Wang | Supervised by Temba Mateke*

Professional EMC testing annotation tool with comprehensive band-specific frequency identification, multi-page support, and Tenco-compliant documentation export. Complete modular frequency database covering 9 kHz to 6+ GHz with framework for full spectrum analysis.

## 🏢 Corporate Information

**Company**: Turner Engineering Corporation (Tenco)  
**Developer**: Howard Wang  
**Supervisor**: Temba Mateke  
**Version**: 3.3 (Enhanced CSV Analysis with Full Screen & Dynamic Grids)  
**Copyright**: © 2024 Turner Engineering Corporation. All rights reserved.

## Quick Setup

1. **Download**: Clone or download all files from [GitHub](https://github.com/HowardWHSrun/figauto.git)
2. **Open**: Launch `index.html` in any modern web browser
3. **Ready**: No additional installation required - fully client-side application

## 🚀 What's New in v3.3

### **Enhanced CSV Analysis with Professional Features**
- **Full Screen Mode**: High-resolution full screen viewing for all graph types with zoom/pan controls
- **Dynamic Axis System**: Real-time axis labels showing exact visible frequency/amplitude ranges during zoom
- **Professional Grid System**: Two-tier grid with minor/major lines for precise measurements and analysis
- **CSV Overlay Comparison**: Multi-dataset overlay with color-coded legends for comparative analysis
- **Enhanced Zoom Controls**: Improved sensitivity and Auto Scale functionality for optimal data viewing
- **Peak Identification**: Click-to-identify functionality works across all CSV modes with band detection

### **Complete Band Coverage (B0-B7 All Ready)**
✅ **Band 0 (VLF/LF)**: 9-160 kHz (22 allocations) - Navigation, time signals, maritime  
✅ **Band 1 (MF)**: 148.5 kHz-1.605 MHz (22 allocations) - AM broadcast, maritime, amateur 630m  
✅ **Band 2 (HF Lower)**: 535 kHz-3.025 MHz (27 allocations) - Extended AM, amateur, maritime  
✅ **Band 3 (HF Core)**: 2.495-8.1 MHz (47 allocations) - Amateur 80m/40m, WWV, international broadcast  
✅ **Band 4 (Upper HF)**: 5-30 MHz (~95 allocations) - Amateur 20m/15m/12m/10m, CB radio  
✅ **Band 5 (VHF)**: 25-325 MHz (~65 allocations) - FM radio, TV, aviation, amateur 6m/2m  
✅ **Band 6 (UHF)**: 273 MHz-1.3 GHz (~66 allocations) - TV, cellular, GPS, amateur 70cm  
✅ **Band 7 (SHF)**: 960 MHz-6 GHz (~55 allocations) - GPS L1, cellular/PCS, WiFi 2.4/5 GHz

## Key Features

### **🎯 Intelligent Peak Identification**
- **Auto-Identification Mode**: Click peaks for automatic FCC frequency identification
- **Band-Specific Search**: Select target frequency band (B0-B7) for focused results
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

## Complete Band Reference (All Ready for Use)

### **📊 Implemented Bands B0-B7**

| Band | Frequency Range | Allocations | Key Services | Status |
|------|----------------|-------------|--------------|---------|
| **B0** | 9-160 kHz | 22 | VLF/LF: Navigation, time signals, maritime | ✅ **Ready** |
| **B1** | 148.5 kHz-1.605 MHz | 22 | MF: AM broadcast, maritime, amateur 160m | ✅ **Ready** |
| **B2** | 535 kHz-3.025 MHz | 27 | HF Lower: Extended AM, amateur, maritime | ✅ **Ready** |
| **B3** | 2.495-8.1 MHz | 47 | HF Core: Amateur 80m/40m, international broadcast, WWV | ✅ **Ready** |
| **B4** | 5-30 MHz | 95 | Upper HF: Amateur 20m/15m/12m/10m, CB radio | ✅ **Ready** |
| **B5** | 25-325 MHz | 65 | VHF: FM radio, TV, aviation, amateur 6m/2m | ✅ **Ready** |
| **B6** | 273 MHz-1.3 GHz | 66 | UHF: TV, cellular, GPS, amateur 70cm | ✅ **Ready** |
| **B7** | 960 MHz-6 GHz | 55 | SHF: GPS L1, cellular/PCS, WiFi 2.4/5 GHz | ✅ **Ready** |

**📈 Total System Coverage**: 400+ frequency allocations across complete EMC testing spectrum (9 kHz to 6+ GHz)

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
peak-identification-database-band0.js  // B0: VLF/LF (9-160 kHz)
peak-identification-database-band1.js  // B1: MF (148.5 kHz-1.605 MHz)
peak-identification-database-band2.js  // B2: HF Lower (535 kHz-3.025 MHz)
peak-identification-database-band3.js  // B3: HF Core (2.495-8.1 MHz)
peak-identification-database-band4.js  // B4: Upper HF (5-30 MHz)
peak-identification-database-band5.js  // B5: VHF (25-325 MHz)
peak-identification-database-band6.js  // B6: UHF (273 MHz-1.3 GHz)
peak-identification-database-band7.js  // B7: SHF (960 MHz-6 GHz)
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
- **Version**: 3.3 (Enhanced CSV Analysis with Full Screen & Dynamic Grids)
- **Developer**: Howard Wang
- **Supervisor**: Temba Mateke  
- **Company**: Turner Engineering Corporation
- **License**: © 2024 Turner Engineering Corporation. All rights reserved.
- **Updates**: Check GitHub releases for latest versions

## 📋 Changelog

### v3.3 - Enhanced CSV Analysis (Current)
- ✅ **Full Screen Mode**: High-resolution full screen viewing for all graph types
- ✅ **Dynamic Axis Labels**: Real-time frequency/amplitude ranges during zoom/pan
- ✅ **Professional Grid System**: Two-tier minor/major grid lines for precision
- ✅ **CSV Overlay Comparison**: Multi-dataset overlay with color legends
- ✅ **Enhanced Zoom Controls**: Improved sensitivity and auto-scale functionality
- ✅ **Universal Peak Identification**: Click-to-identify across all CSV modes
- 🔧 **Bug Fixes**: Resolved upload function and grid rendering issues

### v3.1 - Band-Specific Peak Identification System
- Band-specific frequency databases (B0-B7)
- 400+ FCC frequency allocations
- Multi-page support with tabbed interface
- Corporate Tenco branding integration

---

**Turner Engineering Corporation** - Professional EMC testing tools for regulatory compliance and spectrum management.  
*Developed by Howard Wang | Supervised by Temba Mateke* 