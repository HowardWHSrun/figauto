import pandas as pd
import numpy as np
import os
import glob
from scipy.interpolate import interp1d
import re

def load_correction_data(correction_file):
    """Load correction data from PCEP files"""
    print(f"Loading correction data from: {correction_file}")
    
    # Read the file and find where the data starts
    with open(correction_file, 'r') as f:
        lines = f.readlines()
    
    # Find the line with "DATA,"
    data_start = None
    for i, line in enumerate(lines):
        if line.strip() == 'DATA,':
            data_start = i + 1
            break
    
    if data_start is None:
        raise ValueError(f"Could not find 'DATA,' line in {correction_file}")
    
    # Read frequency and correction data
    frequencies = []
    corrections = []
    
    for line in lines[data_start:]:
        line = line.strip()
        if line and ',' in line:
            parts = line.split(',')
            if len(parts) >= 2:
                try:
                    freq = float(parts[0])  # MHz
                    correction = float(parts[1])  # dBuV/m
                    frequencies.append(freq)
                    corrections.append(correction)
                except ValueError:
                    continue
    
    return np.array(frequencies), np.array(corrections)

def create_interpolation_function(frequencies, corrections):
    """Create interpolation function for corrections"""
    # Sort by frequency to ensure proper interpolation
    sorted_indices = np.argsort(frequencies)
    freq_sorted = frequencies[sorted_indices]
    corr_sorted = corrections[sorted_indices]
    
    # Create interpolation function with extrapolation
    interp_func = interp1d(freq_sorted, corr_sorted, 
                          kind='linear', 
                          bounds_error=False, 
                          fill_value='extrapolate')
    return interp_func

def determine_correction_type(filename):
    """Determine which correction to apply based on filename"""
    filename_upper = filename.upper()
    
    if 'B5H' in filename_upper or 'B5V' in filename_upper:
        return '100kHz'
    elif 'B6H' in filename_upper or 'B6V' in filename_upper or 'B7H' in filename_upper or 'B7V' in filename_upper:
        return '300kHz'
    else:
        print(f"Warning: Could not determine correction type for {filename}")
        return None

def find_data_start(filename):
    """Find where the actual measurement data starts in the file"""
    with open(filename, 'r') as f:
        for i, line in enumerate(f):
            # Look for the "DATA" line specifically
            if line.strip() == 'DATA':
                return i + 1  # Return line after DATA
    return None

def process_measurement_file(filename, correction_funcs):
    """Process a single measurement file and apply corrections"""
    print(f"Processing: {filename}")
    
    # Determine which correction to use
    correction_type = determine_correction_type(filename)
    if correction_type is None:
        print(f"Skipping {filename} - could not determine correction type")
        return
    
    # Get the appropriate correction functions
    add_func = correction_funcs[f'add_{correction_type}']
    subtract_func = correction_funcs[f'subtract_{correction_type}']
    
    # Find where data starts
    data_start = find_data_start(filename)
    if data_start is None:
        print(f"Could not find DATA line in {filename}")
        return
    
    # Read the file
    try:
        # Read header lines
        with open(filename, 'r') as f:
            header_lines = []
            for i, line in enumerate(f):
                if i < data_start:
                    header_lines.append(line)
                else:
                    break
        
        # Read data portion
        data = pd.read_csv(filename, skiprows=data_start, header=None)
        
        if len(data.columns) < 2:
            print(f"Not enough columns in {filename}")
            return
        
        # Apply corrections
        frequencies_hz = data.iloc[:, 0].values  # First column is frequency in Hz
        measurements = data.iloc[:, 1].values    # Second column is measurement
        
        # Convert frequency to MHz for correction lookup
        frequencies_mhz = frequencies_hz / 1e6
        
        # Get corrections via interpolation
        corrections_to_add = add_func(frequencies_mhz)      # 06-26 corrections to ADD
        corrections_to_subtract = subtract_func(frequencies_mhz)  # 06-16 corrections to SUBTRACT
        
        # Apply corrections: Original + (06-26) - (06-16)
        corrected_measurements = measurements + corrections_to_add - corrections_to_subtract
        
        # Update the dataframe
        data.iloc[:, 1] = corrected_measurements
        
        # Create output filename
        base_name = os.path.splitext(filename)[0]
        output_filename = f"{base_name} correction added.csv"
        
        # Write corrected file
        with open(output_filename, 'w') as f:
            # Write header
            for line in header_lines:
                f.write(line)
            
            # Write corrected data
            data.to_csv(f, header=False, index=False)
        
        print(f"Saved corrected file: {output_filename}")
        print(f"Applied {correction_type} correction (+06-26, -06-16) to {len(data)} data points")
        
        # Show sample correction values
        avg_add = corrections_to_add.mean()
        avg_subtract = corrections_to_subtract.mean()
        avg_net = avg_add - avg_subtract
        print(f"  Average +06-26: {avg_add:.2f} dB, Average -06-16: {avg_subtract:.2f} dB, Net: {avg_net:.2f} dB")
        
    except Exception as e:
        print(f"Error processing {filename}: {str(e)}")

def main():
    """Main function to process all files"""
    print("PCEP Correction Tool (with 06-16 subtraction)")
    print("==============================================")
    
    # Load correction data for both dates
    print("\n1. Loading correction data...")
    
    # 06-26 corrections (to ADD)
    freq_100k_add, corr_100k_add = load_correction_data("Bilogic 100kHz PCEP 2025-06-26.csv")
    freq_300k_add, corr_300k_add = load_correction_data("Bilogic 300kHz PCEP 2025-06-26.csv")
    
    # 06-16 corrections (to SUBTRACT)
    freq_100k_sub, corr_100k_sub = load_correction_data("Bilogic 100kHz PCEP 2025-06-16.csv")
    freq_300k_sub, corr_300k_sub = load_correction_data("Bilogic 300kHz PCEP 2025-06-16.csv")
    
    # Create interpolation functions
    print("2. Creating interpolation functions...")
    correction_funcs = {
        'add_100kHz': create_interpolation_function(freq_100k_add, corr_100k_add),
        'add_300kHz': create_interpolation_function(freq_300k_add, corr_300k_add),
        'subtract_100kHz': create_interpolation_function(freq_100k_sub, corr_100k_sub),
        'subtract_300kHz': create_interpolation_function(freq_300k_sub, corr_300k_sub)
    }
    
    print(f"06-26 100kHz correction range: {freq_100k_add.min():.1f} - {freq_100k_add.max():.1f} MHz")
    print(f"06-26 300kHz correction range: {freq_300k_add.min():.1f} - {freq_300k_add.max():.1f} MHz")
    print(f"06-16 100kHz correction range: {freq_100k_sub.min():.1f} - {freq_100k_sub.max():.1f} MHz")
    print(f"06-16 300kHz correction range: {freq_300k_sub.min():.1f} - {freq_300k_sub.max():.1f} MHz")
    
    # Show correction differences at key frequencies
    print("\n3. Correction differences at key frequencies:")
    test_freqs = [100, 500, 1000, 2000, 5000]  # MHz
    for freq in test_freqs:
        diff_100k = correction_funcs['add_100kHz'](freq) - correction_funcs['subtract_100kHz'](freq)
        diff_300k = correction_funcs['add_300kHz'](freq) - correction_funcs['subtract_300kHz'](freq)
        print(f"  {freq:4d} MHz: B5 net = {diff_100k:+6.2f} dB, B6/B7 net = {diff_300k:+6.2f} dB")
    
    # Find all measurement files (exclude correction files and already processed files)
    print("\n4. Finding measurement files...")
    all_csv_files = glob.glob("*.csv")
    measurement_files = [f for f in all_csv_files if "PCEP" not in f and "correction added" not in f]
    
    print(f"Found {len(measurement_files)} measurement files to process")
    
    # Process each file
    print("\n5. Processing files...")
    processed_count = 0
    for filename in sorted(measurement_files):
        try:
            process_measurement_file(filename, correction_funcs)
            processed_count += 1
        except Exception as e:
            print(f"Failed to process {filename}: {str(e)}")
    
    print(f"\n==============================================")
    print(f"Processing complete!")
    print(f"Successfully processed {processed_count} files")
    print(f"Applied corrections: +06-26 corrections, -06-16 corrections")

if __name__ == "__main__":
    main() 