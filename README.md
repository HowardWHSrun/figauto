# Figure Annotation Tool

A simple web application for annotating images with comments and exporting fully documented figures, specifically designed for radiated emissions test documentation.

## Features

- **Image Upload**: Upload images via file selector or drag & drop
- **Smart Filename Parsing**: Automatically extracts Run ID and Band from image filenames
- **Test Information**: Add run ID, band, description, traces, and comments
- **FCC Frequency Reference**: Built-in FCC frequency allocation chart for quick peak identification
- **Smart Peak Identification**: Auto-identify frequency bands when clicking on spectrum peaks
- **Click-to-Annotate**: Click anywhere on the image to add numbered annotations
- **Export**: Export annotated images with header information and formatted filename

## Usage

### 1. Upload Image
- **File Upload**: Click "Choose File" to select an image
- **Drag & Drop**: Simply drag an image file into the designated area
- **Smart Filename Parsing**: Automatically extracts Run ID, Band, and Description from filename patterns like:
  - `"Run 127-71, B6 Ambient.png"`
  - `"127-71_B6_Ambient.jpg"`
  - `"Figure 3-1 Run 127-71, B6v Ambient.png"`

### 2. Fill Test Information
- **Run ID**: Test run identifier (auto-detected from filename)
- **Band**: Frequency band designation (auto-detected from filename)  
- **Description**: Test description (auto-detected from filename)
- **Traces**: Trace information (e.g., "Top - maximum peak hold, Bottom - minimum peak hold")
- **General Comment**: Additional notes

### 3. Add Professional EMC Annotations
- **Auto-Identification Mode** (Recommended): Check "Auto-identify frequency bands" and click on peaks
  - **Automatically identifies** frequency allocations using comprehensive FCC database
  - **Professional formatting**: "TV Broadcasting (Ch. 7-13)", "Amateur Radio (2m band)", etc.
  - **Frequency ranges included**: Shows exact frequency ranges for each service
- **Manual Mode**: Uncheck auto-identify to enter custom annotations via prompts
- **Professional Display**: Annotations follow EMC testing standards with numbered markers and clear labels

### 4. Use FCC Frequency Reference (Enhanced)
- **Single Frequency Lookup**: Enter a frequency in MHz/GHz/THz to see official FCC allocations
  - Shows **complete service designations** (FIXED, MOBILE, RADIO ASTRONOMY, etc.)
  - Displays **FCC rule part references** [US342, US74, US246, etc.]
  - Includes **ITU footnote numbers** [5.340, 5.558, 5.562H, etc.]
  - Shows **satellite service directions** (space-to-Earth, Earth-to-space)
- **🆕 FREQUENCY RANGE SEARCH**: Enter a frequency range to get all allocations in that range
  - **Examples**: "3-4 GHz", "24-24.25 GHz", "400-500 MHz", "2.4-2.5 GHz"
  - **Supports multiple units**: MHz, GHz, THz automatically converted
  - **Color-coded results** by service type with detailed information
  - **Perfect for spectrum analysis** - see exactly what's allocated in any frequency range
- **Frequency Chart**: Click "Show/Hide Frequency Chart" to view the complete FCC allocation table
- **Auto-Identify**: Check the "Auto-identify frequency bands" checkbox for automatic peak identification

### 5. Export Professional Figure
- **Professional Tenco Format**: Creates clean, corporate-style documentation following Tenco engineering standards
  - **Clean White Background**: Professional appearance suitable for engineering reports
  - **Tenco Logo Integration**: Automatically displays company logo (place `tenco-logo.png` or `tenco-logo.svg` in the same folder)
  - **Standard Typography**: Arial Bold for headings, Times New Roman for body text (per Tenco Style Guide)
  - **Conservative Color Scheme**: Professional grays and minimal color for corporate documentation
- **Spectrum Analyzer Style Layout**:
  - **Table Header**: Run | Band | Location format matching professional spectrum analyzer displays
  - **Comment Section**: Right-side comment area for analysis summary and observations  
  - **Large Description Text**: Prominent, easy-to-read description section (16pt font)
  - **Professional Table Formatting**: Clean borders and structured information layout
  - **Integrated Logo Placement**: Tenco logo positioned in comment section
- **Clean Annotation Markers**: Simple red circles with white borders and clear callout boxes
- **High Resolution Export**: Original image quality with professional overlay
- **Tenco-Standard Naming**: Files named as `Figure_[RunID]_[Band]_Professional.png`

### Key Features:
- **📊 EMC Testing Optimized**: Designed specifically for electromagnetic compatibility testing
- **🏢 Tenco Corporate Standards**: Follows official Tenco Style Guide formatting
- **🎯 Professional Annotations**: Clean, conservative annotation style suitable for engineering reports
- **📋 Auto Summary Generation**: Creates professional summary comments for regulatory documentation
- **🔍 Comprehensive Database**: Complete FCC frequency allocations from 30 kHz to 3 THz
- **⚡ Smart Filename Parsing**: Automatically extracts test information from filenames
- **📈 Range Search**: Find all allocations in any frequency range (e.g., "3-4 GHz")
- **🏗️ Corporate Branding**: Integrated Tenco logo and professional layout

## Controls

- **Clear Image**: Remove the current image and start over
- **Clear All Annotations**: Remove all annotations but keep the image
- **Export Annotated Figure**: Download the final annotated image

## File Format

Exported files are saved as PNG images with automatically generated filenames like:
`Figure_127-71_B6v.png`

## Browser Compatibility

Works with any modern web browser that supports HTML5 Canvas and File API.

## Comprehensive FCC Frequency Database

This tool includes the **complete FCC Table of Frequency Allocations** covering the entire spectrum from **30 kHz to 3 THz**:

### Complete Spectrum Coverage:
- **LF Band (30-300 kHz)**: RADIONAVIGATION, Low Frequency Navigation, Part 15 devices
- **MF Band (300 kHz-3 MHz)**: AM Broadcasting, Marine Radio Beacon, AERONAUTICAL RADIONAVIGATION
- **HF Band (3-30 MHz)**: **Complete Amateur allocations**, Shortwave Broadcasting, Citizens Band, ISM bands
- **VHF Band (30-300 MHz)**: **Complete VHF allocations**, FM Broadcasting, TV Channels, Amateur 6m/2m, Aviation
- **UHF Band (300 MHz-3 GHz)**: **Complete UHF allocations**, TV Channels, Amateur 70cm/33cm, Cellular, WiFi, ISM bands
- **SHF Band (3-30 GHz)**: WiFi, Amateur bands, Part 15 ISM, Radar systems, Ku-band satellite
- **EHF Low Band (30-155.5 GHz)**: mmWave, Amateur bands, Automotive radar, Ka-band satellite, 60 GHz mmWave
- **EHF High Band (155.5 GHz-3 THz)**: **Complete FCC Table of Frequency Allocations including:**
  - **FIXED, MOBILE, RADIO ASTRONOMY** with US rule references [US342, US74, US246]
  - **FIXED-SATELLITE** services with directional designations (space-to-Earth, Earth-to-space)
  - **EARTH EXPLORATION-SATELLITE (passive)** services with ITU footnotes [5.340, 5.563A]
  - **SPACE RESEARCH (passive)** and **INTER-SATELLITE** communications [5.562H, 5.558]
  - **MOBILE-SATELLITE** and **RADIONAVIGATION-SATELLITE** services [5.341, 5.554]
  - **Amateur and Amateur-Satellite** allocations (241-248 GHz, 248-250 GHz) with **Part 97** designation
  - **ISM Equipment** designation under **Part 18** for 241-248 GHz band
  - **Radiolocation** and **RADIONAVIGATION** services
  - **Unallocated spectrum** above 275 GHz [5.564A, 5.565, US565] - available for **Amateur Radio (Part 97)**
  
  **All entries include official FCC rule part references and ITU footnote numbers exactly as published in the FCC Table of Frequency Allocations.**

### Color-coded by service type:
- 🔴 Amateur Radio
- 🔵 Broadcasting (TV/FM)
- 🟢 Licensed Mobile/Cellular
- 🟠 Satellite/Navigation
- 🟣 ISM/Science bands
- 🟡 Part 15 Unlicensed devices

**Filename Auto-Detection**: The tool automatically parses common filename patterns to extract:
- Run ID (e.g., "127-71")
- Band designation (e.g., "B6v")
- Test description (e.g., "Ambient")

Supported filename formats:
- `Run 127-71, B6 Ambient.png`
- `127-71_B6_Ambient.jpg`
- `Figure 3-1 Run 127-71, B6v Ambient.png`
- `B6v_127-71.png`

## Perfect for

- **EMC test documentation** (FCC Part 15 compliance testing)
- **Spectrum analyzer result annotation** with FCC frequency identification
- **RF interference investigation** using U.S. frequency allocations
- **Part 15 unlicensed device testing** and documentation
- **Frequency coordination** and spectrum management
- **Technical figure documentation** for regulatory submissions
- **Test report preparation** for FCC certification 

## Installation

1. Download all files to a folder on your computer
2. **Logo Options**: 
   - A basic Tenco logo (`tenco-logo.svg`) is included
   - **Optional**: Replace with your own logo by placing `tenco-logo.png` or `tenco-logo.svg` in the same folder as `index.html`
3. Open `index.html` in any modern web browser
4. No additional setup required - the tool runs entirely in your browser

## Requirements

Works with any modern web browser that supports HTML5 Canvas and File API.
**Logo**: A basic logo is included, or place your own `tenco-logo.png` or `tenco-logo.svg` in the project folder. 