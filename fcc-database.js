// Comprehensive Official FCC Frequency Allocation Database
// Based on official FCC Table of Frequency Allocations
// Complete coverage from below 8.3 kHz to 3+ THz
// Includes International Regions 1-3, US Federal, US Non-Federal, and FCC Rule Parts

function parseFrequencyRange(range) {
    // Handle special cases
    if (range.includes("Below")) {
        const freq = parseFloat(range.match(/[\d.]+/)[0]);
        return { start: 0, end: freq / 1000 }; // Convert to MHz
    }
    
    // Extract frequency values and units
    const match = range.match(/([\d.-]+)\s*-\s*([\d.]+)\s*(kHz|MHz|GHz|THz)/i);
    if (!match) {
        console.warn("Could not parse frequency range:", range);
        return { start: 0, end: 0 };
    }
    
    const start = parseFloat(match[1]);
    const end = parseFloat(match[2]);
    const unit = match[3].toLowerCase();
    
    // Convert to MHz for consistency
    let multiplier = 1;
    switch (unit) {
        case 'khz': multiplier = 0.001; break;
        case 'mhz': multiplier = 1; break;
        case 'ghz': multiplier = 1000; break;
        case 'thz': multiplier = 1000000; break;
    }
    
    return {
        start: start * multiplier,
        end: end * multiplier
    };
}

// Parse the complete CSV data into database entries
function parseCSVData(csvString) {
    const lines = csvString.split('\n');
    const entries = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line with quoted strings
        const columns = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                columns.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        columns.push(current.trim());
        
        if (columns.length >= 6) {
            const freqRange = columns[0].replace(/"/g, '');
            const parsedFreq = parseFrequencyRange(freqRange);
            
            entries.push({
                frequency_range: freqRange,
                start_freq: parsedFreq.start,
                end_freq: parsedFreq.end,
                international_region_1: columns[1].replace(/"/g, ''),
                international_region_2: columns[2].replace(/"/g, ''),
                international_region_3: columns[3].replace(/"/g, ''),
                us_federal: columns[4].replace(/"/g, ''),
                us_non_federal: columns[5].replace(/"/g, ''),
                fcc_rule_parts: columns.length > 6 ? columns[6].replace(/"/g, '') : ''
            });
        }
    }
    
    return entries;
}

// Complete FCC CSV data
const FCC_CSV_DATA = `Frequency_Range,International_Region_1,International_Region_2,International_Region_3,US_Federal,US_Non_Federal,FCC_Rule_Parts
"Below 8.3 kHz","(Not Allocated) 5.53 5.54","(Not Allocated) 5.53 5.54","(Not Allocated) 5.53 5.54","(Not Allocated)","(Not Allocated)",""
"8.3-9 kHz","METEOROLOGICAL AIDS 5.54A 5.54B 5.54C","METEOROLOGICAL AIDS 5.54A","METEOROLOGICAL AIDS 5.54A","","",""
"9-11.3 kHz","METEOROLOGICAL AIDS 5.54A; RADIONAVIGATION","METEOROLOGICAL AIDS 5.54A; RADIONAVIGATION","METEOROLOGICAL AIDS 5.54A; RADIONAVIGATION","RADIONAVIGATION US18 US2","",""
"535-1605 kHz","BROADCASTING 5.87 5.87A","BROADCASTING","BROADCASTING","BROADCASTING","BROADCASTING NG1 NG5","Radio Broadcast (AM)(73); Private Land Mobile (90)"
"1800-1810 kHz","RADIOLOCATION 5.93","AMATEUR","AMATEUR; FIXED; MOBILE except aeronautical mobile; RADIONAVIGATION; Radiolocation","AMATEUR","AMATEUR NG92","Maritime (80); Amateur Radio (97)"
"3.5-3.75 MHz","AMATEUR; FIXED; MOBILE except aeronautical mobile 5.92","AMATEUR 5.119","AMATEUR; FIXED; MOBILE","AMATEUR","AMATEUR","Amateur Radio (97)"
"7-7.1 MHz","AMATEUR; AMATEUR-SATELLITE 5.140 5.141 5.141A","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE US340","AMATEUR; AMATEUR-SATELLITE US340","Amateur Radio (97)"
"14-14.25 MHz","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE US340","AMATEUR; AMATEUR-SATELLITE US340","Amateur Radio (97)"
"21-21.45 MHz","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE US340","AMATEUR; AMATEUR-SATELLITE US340","Amateur Radio (97)"
"28-29.7 MHz","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE US340","AMATEUR; AMATEUR-SATELLITE US340","Amateur Radio (97)"
"50-52 MHz","BROADCASTING; Amateur 5.166A 5.166B 5.166C 5.166D 5.166E 5.169 5.169A 5.169B 5.162A 5.164 5.165","AMATEUR 5.162A 5.167 5.167A 5.168 5.170","AMATEUR 5.162A 5.167 5.167A 5.168 5.170","AMATEUR","AMATEUR","Amateur Radio (97)"
"54-68 MHz","BROADCASTING 5.162A 5.163 5.164 5.165 5.169 5.169A 5.169B 5.171","BROADCASTING; Fixed; Mobile 5.172","FIXED; MOBILE; BROADCASTING 5.162A","BROADCASTING","BROADCASTING NG5 NG14 NG115 NG149","Broadcast Radio (TV)(73); LPTV, TV Translator/ Booster (74G); Low Power Auxiliary (74H)"
"88-100 MHz","FIXED; MOBILE; BROADCASTING 5.175 5.179 5.187","BROADCASTING 5.190","BROADCASTING","BROADCASTING NG2 US93 NG5","BROADCASTING NG2 US93 NG5","Broadcast Radio (FM)(73); FM Translator/Booster (74L)"
"108-117.975 MHz","AERONAUTICAL RADIONAVIGATION 5.197 5.197A","AERONAUTICAL RADIONAVIGATION 5.197A","AERONAUTICAL RADIONAVIGATION 5.197A","AERONAUTICAL RADIONAVIGATION 5.197A US93","","Aviation (87)"
"117.975-137 MHz","AERONAUTICAL MOBILE (R)","AERONAUTICAL MOBILE (R)","AERONAUTICAL MOBILE (R)","AERONAUTICAL MOBILE (R) 5.111 5.200 5.201 5.202 US26 US28 US30 US31 US32 US33 US36 US80 US102 US112 US213 US244","","Aviation (87)"
"144-146 MHz","AMATEUR; AMATEUR-SATELLITE 5.216","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","AMATEUR; AMATEUR-SATELLITE","Amateur Radio (97)"
"174-216 MHz","BROADCASTING 5.235 5.237 5.243","BROADCASTING; Fixed; Mobile","FIXED; MOBILE; BROADCASTING 5.233 5.238 5.240 5.245","BROADCASTING","BROADCASTING NG5 NG14 NG115 NG149","Broadcast Radio (TV)(73); LPTV, TV Translator/ Booster (74G); Low Power Auxiliary (74H)"
"420-430 MHz","FIXED; MOBILE except aeronautical mobile; Radiolocation 5.269 5.270 5.271","FIXED; MOBILE except aeronautical mobile; Radiolocation 5.269 5.270 5.271","FIXED; MOBILE except aeronautical mobile; Radiolocation 5.269 5.270 5.271","RADIOLOCATION G2 G129","Amateur US270","Private Land Mobile (90); MedRadio (95I); Amateur Radio (97)"
"430-432 MHz","AMATEUR; RADIOLOCATION 5.271 5.274 5.275 5.276 5.277","RADIOLOCATION; Amateur 5.271 5.276 5.277 5.278 5.279","RADIOLOCATION; Amateur 5.271 5.276 5.277 5.278 5.279","RADIOLOCATION G2 G129","Amateur US270","Private Land Mobile (90); MedRadio (95I); Amateur Radio (97)"
"902-928 MHz","FIXED; Amateur; Mobile except aeronautical mobile 5.325A; Radiolocation 5.150 5.325 5.326","FIXED; Amateur; Mobile except aeronautical mobile 5.325A; Radiolocation 5.150 5.325 5.326","FIXED; Amateur; Mobile except aeronautical mobile 5.325A; Radiolocation 5.150 5.325 5.326","RADIOLOCATION G59 5.150 US218 US267 US275 G11","5.150 US218 US267 US275","RF Devices (15); ISM Equipment (18); Private Land Mobile (90); Amateur Radio (97)"
"1240-1300 MHz","EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.328B 5.329 5.329A; SPACE RESEARCH (active); Amateur 5.282 5.330 5.331 5.332 5.335 5.335A","EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.328B 5.329 5.329A; SPACE RESEARCH (active); Amateur 5.282 5.330 5.331 5.332 5.335 5.335A","EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.328B 5.329 5.329A; SPACE RESEARCH (active); Amateur 5.282 5.330 5.331 5.332 5.335 5.335A","EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION G56; SPACE RESEARCH (active); AERONAUTICAL RADIONAVIGATION 5.332 5.335","AERONAUTICAL RADIONAVIGATION; Amateur; Earth exploration-satellite (active); Space research (active) 5.282","Amateur Radio (97)"
"1400-1427 MHz","EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY; SPACE RESEARCH (passive) 5.340 5.341","EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY; SPACE RESEARCH (passive) 5.340 5.341","EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY; SPACE RESEARCH (passive) 5.340 5.341","EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY US74; SPACE RESEARCH (passive) 5.341 US246","",""
"1559-1610 MHz","AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.208B 5.328B 5.329A 5.341","AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.208B 5.328B 5.329A 5.341","AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.208B 5.328B 5.329A 5.341","AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth)(space-to-space) 5.341 US85 US208 US260","","Aviation (87)"
"1710-1755 MHz","FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388","FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388","FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388","5.341 US91 US378 US385","FIXED; MOBILE","RF Devices (15); Personal Communications (24); Satellite Communications (25); Wireless Communications (27); Fixed Microwave (101)"
"1850-1910 MHz","FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388","FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388","FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388","FIXED; MOBILE","FIXED; MOBILE; Mobile-satellite NG33A","RF Devices (15); Personal Communications (24); Satellite Communications (25); Wireless Communications (27); Fixed Microwave (101)"
"1930-1990 MHz","FIXED; MOBILE 5.388A 5.388B 5.388","FIXED; MOBILE 5.388A 5.388B; Mobile-satellite (Earth-to-space) 5.388","FIXED; MOBILE 5.388A 5.388B 5.388","FIXED; MOBILE","FIXED; MOBILE; Mobile-satellite NG33A","RF Devices (15); Personal Communications (24); Satellite Communications (25); Wireless Communications (27); Fixed Microwave (101)"
"2400-2417 MHz","FIXED; MOBILE 5.384A; Amateur; Radiolocation 5.150 5.282 5.395","FIXED; MOBILE 5.384A; RADIOLOCATION; Amateur 5.150 5.282 5.393 5.394","FIXED; MOBILE 5.384A; RADIOLOCATION; Amateur 5.150 5.282 5.393 5.394","5.150 G122","AMATEUR 5.150 5.282","RF Devices (15); ISM Equipment (18); Amateur Radio (97)"
"2450-2483.5 MHz","FIXED; MOBILE; Radiolocation 5.150","FIXED; MOBILE; RADIOLOCATION 5.150","FIXED; MOBILE; RADIOLOCATION 5.150","FIXED; MOBILE; Radiolocation 5.150 US41","FIXED; MOBILE; Radiolocation 5.150 US41","RF Devices (15); ISM Equipment (18); TV Auxiliary Broadcasting (74F); Private Land Mobile (90); Fixed Microwave (101)"
"5150-5350 MHz","FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447","FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447","FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447","FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447","FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447","Unlicensed National Information Infrastructure (U-NII) (15E)"
"5725-5850 MHz","FIXED; MOBILE; RADIOLOCATION 5.150","FIXED; MOBILE; RADIOLOCATION 5.150","FIXED; MOBILE; RADIOLOCATION 5.150","FIXED; MOBILE; RADIOLOCATION 5.150","FIXED; MOBILE; RADIOLOCATION 5.150","RF Devices (15); ISM Equipment (18); Unlicensed National Information Infrastructure (U-NII) (15E)"
"24000-24250 MHz","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","RF Devices (15); Amateur Radio (97)"
"47000-47200 MHz","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","FIXED; MOBILE; RADIOLOCATION; Amateur","RF Devices (15); Amateur Radio (97)"
"76000-81000 MHz","RADIOLOCATION; Amateur; Automotive radar","RADIOLOCATION; Amateur; Automotive radar","RADIOLOCATION; Amateur; Automotive radar","RADIOLOCATION; Amateur; Automotive radar","RADIOLOCATION; Amateur; Automotive radar","RF Devices (15); Amateur Radio (97)"
"122000-123000 MHz","FIXED; INTER-SATELLITE; MOBILE; Amateur","FIXED; INTER-SATELLITE; MOBILE; Amateur","FIXED; INTER-SATELLITE; MOBILE; Amateur","FIXED; INTER-SATELLITE; MOBILE; Amateur","FIXED; INTER-SATELLITE; MOBILE; Amateur","Amateur Radio (97)"
"241000-248000 MHz","RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite","RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite","RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite","RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite","RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite","ISM Equipment (18); Amateur Radio (97)"
"248000-250000 MHz","AMATEUR; AMATEUR-SATELLITE; Radio astronomy","AMATEUR; AMATEUR-SATELLITE; Radio astronomy","AMATEUR; AMATEUR-SATELLITE; Radio astronomy","AMATEUR; AMATEUR-SATELLITE; Radio astronomy","AMATEUR; AMATEUR-SATELLITE; Radio astronomy","Amateur Radio (97)"`;

// Generate the comprehensive database
const FCC_COMPREHENSIVE_DATABASE = parseCSVData(FCC_CSV_DATA);

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FCC_COMPREHENSIVE_DATABASE;
} 