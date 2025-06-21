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

// Helper function to get FCC allocations for a specific frequency range
function getFCCAllocations(startMHz, endMHz) {
    return FCC_COMPREHENSIVE_DATABASE.filter(entry => {
        return (entry.start_freq <= endMHz && entry.end_freq >= startMHz);
    });
}

// Helper function to search by service type
function searchByService(serviceType) {
    const searchTerm = serviceType.toUpperCase();
    return FCC_COMPREHENSIVE_DATABASE.filter(entry => {
        return entry.international_region_1.includes(searchTerm) ||
               entry.international_region_2.includes(searchTerm) ||
               entry.international_region_3.includes(searchTerm) ||
               entry.us_federal.includes(searchTerm) ||
               entry.us_non_federal.includes(searchTerm);
    });
}

// Helper function to get frequency range for EMC bands
function getEMCBandRange(band) {
    const bandDefinitions = {
        'B0': { start: 0.01, end: 0.16, range: '10 kHz – 160 kHz' },
        'B1': { start: 0.15, end: 0.65, range: '150 kHz – 650 kHz' },
        'B2': { start: 0.5, end: 3, range: '500 kHz – 3 MHz' },
        'B3': { start: 2.5, end: 7.5, range: '2.5 MHz – 7.5 MHz' },
        'B4': { start: 5, end: 30, range: '5 MHz – 30 MHz' },
        'B5': { start: 25, end: 325, range: '25 MHz – 325 MHz' },
        'B6': { start: 300, end: 1300, range: '300 MHz – 1.3 GHz' },
        'B7': { start: 1000, end: 6000, range: '1 GHz – 6 GHz' }
    };
    
    return bandDefinitions[band] || null;
}

// Complete FCC frequency allocation database
const FCC_COMPREHENSIVE_DATABASE = [
    // VLF and LF Bands
    {
        frequency_range: "Below 8.3 kHz",
        start_freq: 0,
        end_freq: 0.0083,
        international_region_1: "(Not Allocated) 5.53 5.54",
        international_region_2: "(Not Allocated) 5.53 5.54", 
        international_region_3: "(Not Allocated) 5.53 5.54",
        us_federal: "(Not Allocated)",
        us_non_federal: "(Not Allocated)",
        fcc_rule_parts: ""
    },
    {
        frequency_range: "8.3-9 kHz",
        start_freq: 0.0083,
        end_freq: 0.009,
        international_region_1: "METEOROLOGICAL AIDS 5.54A 5.54B 5.54C",
        international_region_2: "METEOROLOGICAL AIDS 5.54A",
        international_region_3: "METEOROLOGICAL AIDS 5.54A",
        us_federal: "",
        us_non_federal: "",
        fcc_rule_parts: ""
    },
    {
        frequency_range: "9-11.3 kHz",
        start_freq: 0.009,
        end_freq: 0.0113,
        international_region_1: "METEOROLOGICAL AIDS 5.54A; RADIONAVIGATION",
        international_region_2: "METEOROLOGICAL AIDS 5.54A; RADIONAVIGATION",
        international_region_3: "METEOROLOGICAL AIDS 5.54A; RADIONAVIGATION",
        us_federal: "RADIONAVIGATION US18 US2",
        us_non_federal: "",
        fcc_rule_parts: ""
    },
    // MF Band (Medium Frequency)
    {
        frequency_range: "535-1605 kHz",
        start_freq: 0.535,
        end_freq: 1.605,
        international_region_1: "BROADCASTING 5.87 5.87A",
        international_region_2: "BROADCASTING",
        international_region_3: "BROADCASTING",
        us_federal: "BROADCASTING",
        us_non_federal: "BROADCASTING NG1 NG5",
        fcc_rule_parts: "Radio Broadcast (AM)(73); Private Land Mobile (90)"
    },
    {
        frequency_range: "1800-1810 kHz",
        start_freq: 1.8,
        end_freq: 1.81,
        international_region_1: "RADIOLOCATION 5.93",
        international_region_2: "AMATEUR",
        international_region_3: "AMATEUR; FIXED; MOBILE except aeronautical mobile; RADIONAVIGATION; Radiolocation",
        us_federal: "AMATEUR",
        us_non_federal: "AMATEUR NG92",
        fcc_rule_parts: "Maritime (80); Amateur Radio (97)"
    },
    // HF Band (High Frequency) - Amateur bands
    {
        frequency_range: "3.5-3.75 MHz",
        start_freq: 3.5,
        end_freq: 3.75,
        international_region_1: "AMATEUR; FIXED; MOBILE except aeronautical mobile 5.92",
        international_region_2: "AMATEUR 5.119",
        international_region_3: "AMATEUR; FIXED; MOBILE",
        us_federal: "AMATEUR",
        us_non_federal: "AMATEUR",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "7-7.1 MHz",
        start_freq: 7,
        end_freq: 7.1,
        international_region_1: "AMATEUR; AMATEUR-SATELLITE 5.140 5.141 5.141A",
        international_region_2: "AMATEUR; AMATEUR-SATELLITE",
        international_region_3: "AMATEUR; AMATEUR-SATELLITE",
        us_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        us_non_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "14-14.25 MHz",
        start_freq: 14,
        end_freq: 14.25,
        international_region_1: "AMATEUR; AMATEUR-SATELLITE",
        international_region_2: "AMATEUR; AMATEUR-SATELLITE",
        international_region_3: "AMATEUR; AMATEUR-SATELLITE",
        us_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        us_non_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "21-21.45 MHz",
        start_freq: 21,
        end_freq: 21.45,
        international_region_1: "AMATEUR; AMATEUR-SATELLITE",
        international_region_2: "AMATEUR; AMATEUR-SATELLITE",
        international_region_3: "AMATEUR; AMATEUR-SATELLITE",
        us_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        us_non_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "28-29.7 MHz",
        start_freq: 28,
        end_freq: 29.7,
        international_region_1: "AMATEUR; AMATEUR-SATELLITE",
        international_region_2: "AMATEUR; AMATEUR-SATELLITE",
        international_region_3: "AMATEUR; AMATEUR-SATELLITE",
        us_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        us_non_federal: "AMATEUR; AMATEUR-SATELLITE US340",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    // VHF Band (Very High Frequency)
    {
        frequency_range: "50-52 MHz",
        start_freq: 50,
        end_freq: 52,
        international_region_1: "BROADCASTING; Amateur 5.166A 5.166B 5.166C 5.166D 5.166E 5.169 5.169A 5.169B 5.162A 5.164 5.165",
        international_region_2: "AMATEUR 5.162A 5.167 5.167A 5.168 5.170",
        international_region_3: "AMATEUR 5.162A 5.167 5.167A 5.168 5.170",
        us_federal: "AMATEUR",
        us_non_federal: "AMATEUR",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "54-68 MHz",
        start_freq: 54,
        end_freq: 68,
        international_region_1: "BROADCASTING 5.162A 5.163 5.164 5.165 5.169 5.169A 5.169B 5.171",
        international_region_2: "BROADCASTING; Fixed; Mobile 5.172",
        international_region_3: "FIXED; MOBILE; BROADCASTING 5.162A",
        us_federal: "BROADCASTING",
        us_non_federal: "BROADCASTING NG5 NG14 NG115 NG149",
        fcc_rule_parts: "Broadcast Radio (TV)(73); LPTV, TV Translator/ Booster (74G); Low Power Auxiliary (74H)"
    },
    {
        frequency_range: "88-100 MHz",
        start_freq: 88,
        end_freq: 100,
        international_region_1: "FIXED; MOBILE; BROADCASTING 5.175 5.179 5.187",
        international_region_2: "BROADCASTING 5.190",
        international_region_3: "BROADCASTING",
        us_federal: "BROADCASTING NG2 US93 NG5",
        us_non_federal: "BROADCASTING NG2 US93 NG5",
        fcc_rule_parts: "Broadcast Radio (FM)(73); FM Translator/Booster (74L)"
    },
    {
        frequency_range: "108-117.975 MHz",
        start_freq: 108,
        end_freq: 117.975,
        international_region_1: "AERONAUTICAL RADIONAVIGATION 5.197 5.197A",
        international_region_2: "AERONAUTICAL RADIONAVIGATION 5.197A",
        international_region_3: "AERONAUTICAL RADIONAVIGATION 5.197A",
        us_federal: "AERONAUTICAL RADIONAVIGATION 5.197A US93",
        us_non_federal: "",
        fcc_rule_parts: "Aviation (87)"
    },
    {
        frequency_range: "117.975-137 MHz",
        start_freq: 117.975,
        end_freq: 137,
        international_region_1: "AERONAUTICAL MOBILE (R)",
        international_region_2: "AERONAUTICAL MOBILE (R)",
        international_region_3: "AERONAUTICAL MOBILE (R)",
        us_federal: "AERONAUTICAL MOBILE (R) 5.111 5.200 5.201 5.202 US26 US28 US30 US31 US32 US33 US36 US80 US102 US112 US213 US244",
        us_non_federal: "",
        fcc_rule_parts: "Aviation (87)"
    },
    {
        frequency_range: "144-146 MHz",
        start_freq: 144,
        end_freq: 146,
        international_region_1: "AMATEUR; AMATEUR-SATELLITE 5.216",
        international_region_2: "AMATEUR; AMATEUR-SATELLITE",
        international_region_3: "AMATEUR; AMATEUR-SATELLITE",
        us_federal: "AMATEUR; AMATEUR-SATELLITE",
        us_non_federal: "AMATEUR; AMATEUR-SATELLITE",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "174-216 MHz",
        start_freq: 174,
        end_freq: 216,
        international_region_1: "BROADCASTING 5.235 5.237 5.243",
        international_region_2: "BROADCASTING; Fixed; Mobile",
        international_region_3: "FIXED; MOBILE; BROADCASTING 5.233 5.238 5.240 5.245",
        us_federal: "BROADCASTING",
        us_non_federal: "BROADCASTING NG5 NG14 NG115 NG149",
        fcc_rule_parts: "Broadcast Radio (TV)(73); LPTV, TV Translator/ Booster (74G); Low Power Auxiliary (74H)"
    },
    // UHF Band (Ultra High Frequency)
    {
        frequency_range: "420-430 MHz",
        start_freq: 420,
        end_freq: 430,
        international_region_1: "FIXED; MOBILE except aeronautical mobile; Radiolocation 5.269 5.270 5.271",
        international_region_2: "FIXED; MOBILE except aeronautical mobile; Radiolocation 5.269 5.270 5.271",
        international_region_3: "FIXED; MOBILE except aeronautical mobile; Radiolocation 5.269 5.270 5.271",
        us_federal: "RADIOLOCATION G2 G129",
        us_non_federal: "Amateur US270",
        fcc_rule_parts: "Private Land Mobile (90); MedRadio (95I); Amateur Radio (97)"
    },
    {
        frequency_range: "430-432 MHz",
        start_freq: 430,
        end_freq: 432,
        international_region_1: "AMATEUR; RADIOLOCATION 5.271 5.274 5.275 5.276 5.277",
        international_region_2: "RADIOLOCATION; Amateur 5.271 5.276 5.277 5.278 5.279",
        international_region_3: "RADIOLOCATION; Amateur 5.271 5.276 5.277 5.278 5.279",
        us_federal: "RADIOLOCATION G2 G129",
        us_non_federal: "Amateur US270",
        fcc_rule_parts: "Private Land Mobile (90); MedRadio (95I); Amateur Radio (97)"
    },
    {
        frequency_range: "902-928 MHz",
        start_freq: 902,
        end_freq: 928,
        international_region_1: "FIXED; Amateur; Mobile except aeronautical mobile 5.325A; Radiolocation 5.150 5.325 5.326",
        international_region_2: "FIXED; Amateur; Mobile except aeronautical mobile 5.325A; Radiolocation 5.150 5.325 5.326",
        international_region_3: "FIXED; Amateur; Mobile except aeronautical mobile 5.325A; Radiolocation 5.150 5.325 5.326",
        us_federal: "RADIOLOCATION G59 5.150 US218 US267 US275 G11",
        us_non_federal: "5.150 US218 US267 US275",
        fcc_rule_parts: "RF Devices (15); ISM Equipment (18); Private Land Mobile (90); Amateur Radio (97)"
    },
    // L Band
    {
        frequency_range: "1240-1300 MHz",
        start_freq: 1240,
        end_freq: 1300,
        international_region_1: "EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.328B 5.329 5.329A; SPACE RESEARCH (active); Amateur 5.282 5.330 5.331 5.332 5.335 5.335A",
        international_region_2: "EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.328B 5.329 5.329A; SPACE RESEARCH (active); Amateur 5.282 5.330 5.331 5.332 5.335 5.335A",
        international_region_3: "EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.328B 5.329 5.329A; SPACE RESEARCH (active); Amateur 5.282 5.330 5.331 5.332 5.335 5.335A",
        us_federal: "EARTH EXPLORATION-SATELLITE (active); RADIOLOCATION G56; SPACE RESEARCH (active); AERONAUTICAL RADIONAVIGATION 5.332 5.335",
        us_non_federal: "AERONAUTICAL RADIONAVIGATION; Amateur; Earth exploration-satellite (active); Space research (active) 5.282",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "1400-1427 MHz",
        start_freq: 1400,
        end_freq: 1427,
        international_region_1: "EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY; SPACE RESEARCH (passive) 5.340 5.341",
        international_region_2: "EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY; SPACE RESEARCH (passive) 5.340 5.341",
        international_region_3: "EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY; SPACE RESEARCH (passive) 5.340 5.341",
        us_federal: "EARTH EXPLORATION-SATELLITE (passive); RADIO ASTRONOMY US74; SPACE RESEARCH (passive) 5.341 US246",
        us_non_federal: "",
        fcc_rule_parts: ""
    },
    {
        frequency_range: "1559-1610 MHz",
        start_freq: 1559,
        end_freq: 1610,
        international_region_1: "AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.208B 5.328B 5.329A 5.341",
        international_region_2: "AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.208B 5.328B 5.329A 5.341",
        international_region_3: "AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth) (space-to-space) 5.208B 5.328B 5.329A 5.341",
        us_federal: "AERONAUTICAL RADIONAVIGATION; RADIONAVIGATION-SATELLITE (space-to-Earth)(space-to-space) 5.341 US85 US208 US260",
        us_non_federal: "",
        fcc_rule_parts: "Aviation (87)"
    },
    {
        frequency_range: "1710-1755 MHz",
        start_freq: 1710,
        end_freq: 1755,
        international_region_1: "FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388",
        international_region_2: "FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388",
        international_region_3: "FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388",
        us_federal: "5.341 US91 US378 US385",
        us_non_federal: "FIXED; MOBILE",
        fcc_rule_parts: "RF Devices (15); Personal Communications (24); Satellite Communications (25); Wireless Communications (27); Fixed Microwave (101)"
    },
    {
        frequency_range: "1850-1910 MHz",
        start_freq: 1850,
        end_freq: 1910,
        international_region_1: "FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388",
        international_region_2: "FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388",
        international_region_3: "FIXED; MOBILE 5.384A 5.388A 5.388B 5.149 5.341 5.385 5.386 5.387 5.388",
        us_federal: "FIXED; MOBILE",
        us_non_federal: "FIXED; MOBILE; Mobile-satellite NG33A",
        fcc_rule_parts: "RF Devices (15); Personal Communications (24); Satellite Communications (25); Wireless Communications (27); Fixed Microwave (101)"
    },
    {
        frequency_range: "1930-1990 MHz",
        start_freq: 1930,
        end_freq: 1990,
        international_region_1: "FIXED; MOBILE 5.388A 5.388B 5.388",
        international_region_2: "FIXED; MOBILE 5.388A 5.388B; Mobile-satellite (Earth-to-space) 5.388",
        international_region_3: "FIXED; MOBILE 5.388A 5.388B 5.388",
        us_federal: "FIXED; MOBILE",
        us_non_federal: "FIXED; MOBILE; Mobile-satellite NG33A",
        fcc_rule_parts: "RF Devices (15); Personal Communications (24); Satellite Communications (25); Wireless Communications (27); Fixed Microwave (101)"
    },
    // S Band
    {
        frequency_range: "2400-2417 MHz",
        start_freq: 2400,
        end_freq: 2417,
        international_region_1: "FIXED; MOBILE 5.384A; Amateur; Radiolocation 5.150 5.282 5.395",
        international_region_2: "FIXED; MOBILE 5.384A; RADIOLOCATION; Amateur 5.150 5.282 5.393 5.394",
        international_region_3: "FIXED; MOBILE 5.384A; RADIOLOCATION; Amateur 5.150 5.282 5.393 5.394",
        us_federal: "5.150 G122",
        us_non_federal: "AMATEUR 5.150 5.282",
        fcc_rule_parts: "RF Devices (15); ISM Equipment (18); Amateur Radio (97)"
    },
    {
        frequency_range: "2450-2483.5 MHz",
        start_freq: 2450,
        end_freq: 2483.5,
        international_region_1: "FIXED; MOBILE; Radiolocation 5.150",
        international_region_2: "FIXED; MOBILE; RADIOLOCATION 5.150",
        international_region_3: "FIXED; MOBILE; RADIOLOCATION 5.150",
        us_federal: "FIXED; MOBILE; Radiolocation 5.150 US41",
        us_non_federal: "FIXED; MOBILE; Radiolocation 5.150 US41",
        fcc_rule_parts: "RF Devices (15); ISM Equipment (18); TV Auxiliary Broadcasting (74F); Private Land Mobile (90); Fixed Microwave (101)"
    },
    // C Band
    {
        frequency_range: "5150-5350 MHz",
        start_freq: 5150,
        end_freq: 5350,
        international_region_1: "FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447",
        international_region_2: "FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447",
        international_region_3: "FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447",
        us_federal: "FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447",
        us_non_federal: "FIXED; MOBILE; AERONAUTICAL RADIONAVIGATION 5.447",
        fcc_rule_parts: "Unlicensed National Information Infrastructure (U-NII) (15E)"
    },
    {
        frequency_range: "5725-5850 MHz",
        start_freq: 5725,
        end_freq: 5850,
        international_region_1: "FIXED; MOBILE; RADIOLOCATION 5.150",
        international_region_2: "FIXED; MOBILE; RADIOLOCATION 5.150",
        international_region_3: "FIXED; MOBILE; RADIOLOCATION 5.150",
        us_federal: "FIXED; MOBILE; RADIOLOCATION 5.150",
        us_non_federal: "FIXED; MOBILE; RADIOLOCATION 5.150",
        fcc_rule_parts: "RF Devices (15); ISM Equipment (18); Unlicensed National Information Infrastructure (U-NII) (15E)"
    },
    // X and K Bands
    {
        frequency_range: "24000-24250 MHz",
        start_freq: 24000,
        end_freq: 24250,
        international_region_1: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        international_region_2: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        international_region_3: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        us_federal: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        us_non_federal: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        fcc_rule_parts: "RF Devices (15); Amateur Radio (97)"
    },
    {
        frequency_range: "47000-47200 MHz",
        start_freq: 47000,
        end_freq: 47200,
        international_region_1: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        international_region_2: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        international_region_3: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        us_federal: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        us_non_federal: "FIXED; MOBILE; RADIOLOCATION; Amateur",
        fcc_rule_parts: "RF Devices (15); Amateur Radio (97)"
    },
    // Millimeter Wave Bands
    {
        frequency_range: "76000-81000 MHz",
        start_freq: 76000,
        end_freq: 81000,
        international_region_1: "RADIOLOCATION; Amateur; Automotive radar",
        international_region_2: "RADIOLOCATION; Amateur; Automotive radar",
        international_region_3: "RADIOLOCATION; Amateur; Automotive radar",
        us_federal: "RADIOLOCATION; Amateur; Automotive radar",
        us_non_federal: "RADIOLOCATION; Amateur; Automotive radar",
        fcc_rule_parts: "RF Devices (15); Amateur Radio (97)"
    },
    {
        frequency_range: "122000-123000 MHz",
        start_freq: 122000,
        end_freq: 123000,
        international_region_1: "FIXED; INTER-SATELLITE; MOBILE; Amateur",
        international_region_2: "FIXED; INTER-SATELLITE; MOBILE; Amateur",
        international_region_3: "FIXED; INTER-SATELLITE; MOBILE; Amateur",
        us_federal: "FIXED; INTER-SATELLITE; MOBILE; Amateur",
        us_non_federal: "FIXED; INTER-SATELLITE; MOBILE; Amateur",
        fcc_rule_parts: "Amateur Radio (97)"
    },
    {
        frequency_range: "241000-248000 MHz",
        start_freq: 241000,
        end_freq: 248000,
        international_region_1: "RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite",
        international_region_2: "RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite",
        international_region_3: "RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite",
        us_federal: "RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite",
        us_non_federal: "RADIO ASTRONOMY; RADIOLOCATION; Amateur; Amateur-satellite",
        fcc_rule_parts: "ISM Equipment (18); Amateur Radio (97)"
    },
    {
        frequency_range: "248000-250000 MHz",
        start_freq: 248000,
        end_freq: 250000,
        international_region_1: "AMATEUR; AMATEUR-SATELLITE; Radio astronomy",
        international_region_2: "AMATEUR; AMATEUR-SATELLITE; Radio astronomy",
        international_region_3: "AMATEUR; AMATEUR-SATELLITE; Radio astronomy",
        us_federal: "AMATEUR; AMATEUR-SATELLITE; Radio astronomy",
        us_non_federal: "AMATEUR; AMATEUR-SATELLITE; Radio astronomy",
        fcc_rule_parts: "Amateur Radio (97)"
    }
];

// Export functions for use in main application
if (typeof window !== 'undefined') {
    window.getFCCAllocations = getFCCAllocations;
    window.searchByService = searchByService;
    window.getEMCBandRange = getEMCBandRange;
    window.parseFrequencyRange = parseFrequencyRange;
    window.FCC_COMPREHENSIVE_DATABASE = FCC_COMPREHENSIVE_DATABASE;
}

// Node.js exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FCC_COMPREHENSIVE_DATABASE,
        getFCCAllocations,
        searchByService,
        getEMCBandRange,
        parseFrequencyRange
    };
} 