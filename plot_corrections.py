import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import glob
import os
from matplotlib.gridspec import GridSpec

# Define folder paths
CORRECTED_FILES_FOLDER = "corrected_files"
ORIGINAL_FILES_FOLDER = "."

def find_data_start(filename):
    """Find where the actual measurement data starts in the file"""
    with open(filename, 'r') as f:
        for i, line in enumerate(f):
            if line.strip() == 'DATA':
                return i + 1
    return None

def load_measurement_data(filename):
    """Load measurement data from a file"""
    data_start = find_data_start(filename)
    if data_start is None:
        raise ValueError(f"Could not find DATA line in {filename}")
    
    # Read the data
    data = pd.read_csv(filename, skiprows=data_start, header=None)
    
    # Extract frequency (Hz) and measurement (dBuV/m)
    frequencies_hz = data.iloc[:, 0].values
    measurements = data.iloc[:, 1].values
    
    # Convert frequency to MHz for plotting
    frequencies_mhz = frequencies_hz / 1e6
    
    return frequencies_mhz, measurements

def get_band_type(filename):
    """Get the band type from filename"""
    filename_upper = filename.upper()
    if 'B5H' in filename_upper:
        return 'B5H'
    elif 'B5V' in filename_upper:
        return 'B5V'
    elif 'B6H' in filename_upper:
        return 'B6H'
    elif 'B6V' in filename_upper:
        return 'B6V'
    elif 'B7H' in filename_upper:
        return 'B7H'
    elif 'B7V' in filename_upper:
        return 'B7V'
    else:
        return 'Unknown'

def get_test_type(filename):
    """Get the test type from filename"""
    if "50 Ohm" in filename:
        return "50_Ohm_Term"
    elif "Bilog" in filename:
        return "Bilogic_Antenna"
    else:
        return "Unknown"

def get_site_info(filename):
    """Extract site information from filename"""
    if "Site" in filename:
        # Extract site number
        import re
        match = re.search(r'Site\s*(\d+)', filename)
        if match:
            return f"Site_{match.group(1)}"
    elif "Hotel" in filename:
        return "Hotel_Run"
    else:
        return "General"

def find_corrected_file(original_file):
    """Find the corresponding corrected file for an original file"""
    base_name = os.path.splitext(os.path.basename(original_file))[0]
    corrected_filename = f"{base_name} correction added.csv"
    corrected_path = os.path.join(CORRECTED_FILES_FOLDER, corrected_filename)
    
    if os.path.exists(corrected_path):
        return corrected_path
    return None

def plot_single_comparison(original_file, corrected_file=None, save_plot=True, output_dir="plots"):
    """Plot comparison between original and corrected data for a single file"""
    
    # If corrected file not provided, find it automatically
    if corrected_file is None:
        corrected_file = find_corrected_file(original_file)
        if corrected_file is None:
            print(f"No corrected file found for: {original_file}")
            return
    
    # Load data
    try:
        freq_orig, meas_orig = load_measurement_data(original_file)
        freq_corr, meas_corr = load_measurement_data(corrected_file)
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Calculate correction applied
    correction_applied = meas_corr - meas_orig
    
    # Create figure with subplots
    fig = plt.figure(figsize=(15, 10))
    gs = GridSpec(3, 2, figure=fig, height_ratios=[2, 2, 1], hspace=0.3, wspace=0.3)
    
    # Get band type and test type
    band_type = get_band_type(original_file)
    test_type = get_test_type(original_file)
    
    # Main comparison plot
    ax1 = fig.add_subplot(gs[0, :])
    ax1.plot(freq_orig, meas_orig, 'b-', linewidth=1, label='Original Data', alpha=0.8)
    ax1.plot(freq_corr, meas_corr, 'r-', linewidth=1, label='Corrected Data', alpha=0.8)
    ax1.set_xlabel('Frequency (MHz)')
    ax1.set_ylabel('Measurement (dBuV/m)')
    ax1.set_title(f'Original vs Corrected Data - {band_type} - {test_type.replace("_", " ")}\n{os.path.basename(original_file)}')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    ax1.set_xlim(freq_orig.min(), freq_orig.max())
    
    # Zoomed view - low frequency
    ax2 = fig.add_subplot(gs[1, 0])
    mask_low = freq_orig <= 1000  # First 1000 MHz
    if np.any(mask_low):
        ax2.plot(freq_orig[mask_low], meas_orig[mask_low], 'b-', linewidth=1, label='Original', alpha=0.8)
        ax2.plot(freq_corr[mask_low], meas_corr[mask_low], 'r-', linewidth=1, label='Corrected', alpha=0.8)
        ax2.set_xlabel('Frequency (MHz)')
        ax2.set_ylabel('Measurement (dBuV/m)')
        ax2.set_title('Low Frequency Detail (0-1000 MHz)')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
    
    # Zoomed view - high frequency
    ax3 = fig.add_subplot(gs[1, 1])
    mask_high = freq_orig >= 1000  # Above 1000 MHz
    if np.any(mask_high):
        ax3.plot(freq_orig[mask_high], meas_orig[mask_high], 'b-', linewidth=1, label='Original', alpha=0.8)
        ax3.plot(freq_corr[mask_high], meas_corr[mask_high], 'r-', linewidth=1, label='Corrected', alpha=0.8)
        ax3.set_xlabel('Frequency (MHz)')
        ax3.set_ylabel('Measurement (dBuV/m)')
        ax3.set_title('High Frequency Detail (1000+ MHz)')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
    
    # Correction applied plot
    ax4 = fig.add_subplot(gs[2, :])
    ax4.plot(freq_orig, correction_applied, 'g-', linewidth=1, label='Applied Correction')
    ax4.set_xlabel('Frequency (MHz)')
    ax4.set_ylabel('Correction Applied (dB)')
    ax4.set_title('Correction Applied vs Frequency')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    ax4.set_xlim(freq_orig.min(), freq_orig.max())
    
    # Add statistics
    stats_text = f"""Statistics:
Original Range: {meas_orig.min():.1f} to {meas_orig.max():.1f} dBuV/m
Corrected Range: {meas_corr.min():.1f} to {meas_corr.max():.1f} dBuV/m
Correction Range: {correction_applied.min():.1f} to {correction_applied.max():.1f} dB
Mean Correction: {correction_applied.mean():.1f} dB"""
    
    fig.text(0.02, 0.02, stats_text, fontsize=9, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightgray"))
    
    plt.tight_layout()
    
    if save_plot:
        # Create organized directory structure
        band_type = get_band_type(original_file)
        test_type = get_test_type(original_file)
        site_info = get_site_info(original_file)
        
        plot_dir = os.path.join(output_dir, "individual_plots", band_type, test_type, site_info)
        os.makedirs(plot_dir, exist_ok=True)
        
        # Generate plot filename
        base_name = os.path.splitext(os.path.basename(original_file))[0]
        plot_filename = os.path.join(plot_dir, f"{base_name}_comparison.png")
        plt.savefig(plot_filename, dpi=300, bbox_inches='tight')
        print(f"Saved plot: {plot_filename}")
    
    plt.close(fig)  # Close to save memory when processing many files
    return fig

def plot_all_comparisons(output_dir="plots_organized"):
    """Plot comparisons for ALL corrected files against their originals"""
    
    print("Plotting ALL Corrected Files vs Originals")
    print("==========================================")
    
    # Find all corrected files in the corrected_files folder
    corrected_files = glob.glob(os.path.join(CORRECTED_FILES_FOLDER, "*correction added.csv"))
    corrected_files = sorted(corrected_files)
    
    if not corrected_files:
        print(f"No corrected files found in {CORRECTED_FILES_FOLDER}/ folder!")
        return
    
    print(f"Found {len(corrected_files)} corrected files to plot")
    
    # Group files by categories for organized plotting
    file_groups = {
        'B5H': [],
        'B5V': [],
        'B6H': [],
        'B6V': [],
        'B7H': [],
        'B7V': []
    }
    
    successful_plots = 0
    failed_plots = 0
    
    # Process each corrected file
    for corrected_file in corrected_files:
        # Find corresponding original file
        corrected_basename = os.path.basename(corrected_file)
        original_basename = corrected_basename.replace(" correction added.csv", ".csv")
        original_file = os.path.join(ORIGINAL_FILES_FOLDER, original_basename)
        
        if not os.path.exists(original_file):
            print(f"Original file not found for: {corrected_basename}")
            failed_plots += 1
            continue
        
        try:
            # Create individual comparison plot
            plot_single_comparison(original_file, corrected_file, save_plot=True, output_dir=output_dir)
            
            # Group by band type for summary plots
            band_type = get_band_type(original_file)
            if band_type in file_groups:
                file_groups[band_type].append((original_file, corrected_file))
            
            successful_plots += 1
            
        except Exception as e:
            print(f"Error plotting {corrected_basename}: {str(e)}")
            failed_plots += 1
    
    # Create summary plots by band type
    print(f"\nCreating summary plots by band type...")
    for band_type, file_pairs in file_groups.items():
        if file_pairs:
            create_band_summary_plot(file_pairs, band_type, output_dir)
    
    # Create overall correction summary
    plot_correction_summary(output_dir)
    
    print(f"\n==========================================")
    print(f"Plotting complete!")
    print(f"Successful plots: {successful_plots}")
    print(f"Failed plots: {failed_plots}")
    print(f"Plots saved to: {output_dir}")

def create_band_summary_plot(file_pairs, band_type, output_dir):
    """Create summary plot for a specific band type"""
    
    print(f"Creating {band_type} summary plot with {len(file_pairs)} files...")
    
    # Limit to first 12 files for readability
    file_pairs = file_pairs[:12]
    
    n_files = len(file_pairs)
    n_cols = min(4, n_files)
    n_rows = (n_files + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(4*n_cols, 3*n_rows))
    if n_files == 1:
        axes = [axes]
    elif n_rows == 1:
        axes = axes.reshape(1, -1)
    
    for i, (original_file, corrected_file) in enumerate(file_pairs):
        try:
            # Load data
            freq_orig, meas_orig = load_measurement_data(original_file)
            freq_corr, meas_corr = load_measurement_data(corrected_file)
            
            # Plot
            row = i // n_cols
            col = i % n_cols
            ax = axes[row, col] if n_rows > 1 else axes[col]
            
            ax.plot(freq_orig, meas_orig, 'b-', linewidth=0.8, label='Original', alpha=0.7)
            ax.plot(freq_corr, meas_corr, 'r-', linewidth=0.8, label='Corrected', alpha=0.7)
            
            ax.set_xlabel('Frequency (MHz)', fontsize=8)
            ax.set_ylabel('Measurement (dBuV/m)', fontsize=8)
            
            # Shortened title
            short_name = os.path.basename(original_file)[:25] + "..." if len(os.path.basename(original_file)) > 25 else os.path.basename(original_file)
            ax.set_title(short_name, fontsize=8)
            ax.legend(fontsize=6)
            ax.grid(True, alpha=0.3)
            
        except Exception as e:
            print(f"Error in summary plot for {original_file}: {e}")
    
    # Hide empty subplots
    for i in range(n_files, n_rows * n_cols):
        if n_rows > 1:
            axes[i // n_cols, i % n_cols].set_visible(False)
        else:
            axes[i].set_visible(False)
    
    plt.suptitle(f'{band_type} Band - Original vs Corrected Data Summary', fontsize=16)
    plt.tight_layout()
    
    # Save plot
    summary_dir = os.path.join(output_dir, "summary_plots")
    os.makedirs(summary_dir, exist_ok=True)
    plt.savefig(os.path.join(summary_dir, f'{band_type}_summary.png'), dpi=300, bbox_inches='tight')
    print(f"Saved {band_type} summary plot")
    plt.close(fig)

def plot_multiple_comparisons(file_pattern="*B5h*", max_files=6, output_dir="plots"):
    """Plot comparisons for multiple files matching a pattern"""
    
    # Find matching original files
    original_files = glob.glob(os.path.join(ORIGINAL_FILES_FOLDER, file_pattern))
    original_files = [f for f in original_files if "PCEP" not in f]
    original_files = sorted(original_files)[:max_files]
    
    if not original_files:
        print(f"No files found matching pattern: {file_pattern}")
        return
    
    # Create subplots
    n_files = len(original_files)
    n_cols = min(3, n_files)
    n_rows = (n_files + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(5*n_cols, 4*n_rows))
    if n_files == 1:
        axes = [axes]
    elif n_rows == 1:
        axes = axes.reshape(1, -1)
    
    for i, original_file in enumerate(original_files):
        # Find corresponding corrected file
        corrected_file = find_corrected_file(original_file)
        
        if corrected_file is None:
            print(f"Corrected file not found for: {original_file}")
            continue
        
        try:
            # Load data
            freq_orig, meas_orig = load_measurement_data(original_file)
            freq_corr, meas_corr = load_measurement_data(corrected_file)
            
            # Plot
            row = i // n_cols
            col = i % n_cols
            ax = axes[row, col] if n_rows > 1 else axes[col]
            
            ax.plot(freq_orig, meas_orig, 'b-', linewidth=0.8, label='Original', alpha=0.7)
            ax.plot(freq_corr, meas_corr, 'r-', linewidth=0.8, label='Corrected', alpha=0.7)
            
            ax.set_xlabel('Frequency (MHz)')
            ax.set_ylabel('Measurement (dBuV/m)')
            ax.set_title(f'{get_band_type(original_file)} - {os.path.basename(original_file)[:20]}...', fontsize=10)
            ax.legend(fontsize=8)
            ax.grid(True, alpha=0.3)
            
        except Exception as e:
            print(f"Error plotting {original_file}: {e}")
    
    # Hide empty subplots
    for i in range(n_files, n_rows * n_cols):
        if n_rows > 1:
            axes[i // n_cols, i % n_cols].set_visible(False)
        else:
            axes[i].set_visible(False)
    
    plt.tight_layout()
    
    # Save plot
    os.makedirs(output_dir, exist_ok=True)
    plt.savefig(os.path.join(output_dir, f'multiple_comparison_{file_pattern.replace("*", "").replace(".", "_")}.png'), 
                dpi=300, bbox_inches='tight')
    print(f"Saved multiple comparison plot")
    plt.close(fig)

def plot_correction_summary(output_dir="plots"):
    """Plot summary of all corrections by band type"""
    
    # Load correction data for reference
    try:
        from pcep_correction import load_correction_data
        
        # Load both sets of corrections
        freq_100k_add, corr_100k_add = load_correction_data("Bilogic 100kHz PCEP 2025-06-26.csv")
        freq_300k_add, corr_300k_add = load_correction_data("Bilogic 300kHz PCEP 2025-06-26.csv")
        freq_100k_sub, corr_100k_sub = load_correction_data("Bilogic 100kHz PCEP 2025-06-16.csv")
        freq_300k_sub, corr_300k_sub = load_correction_data("Bilogic 300kHz PCEP 2025-06-16.csv")
        
        # Create plot with 2x2 subplots
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
        
        # Plot 1: Individual correction curves
        ax1.plot(freq_100k_add, corr_100k_add, 'b-', linewidth=2, label='100kHz 06-26 (B5)')
        ax1.plot(freq_300k_add, corr_300k_add, 'r-', linewidth=2, label='300kHz 06-26 (B6/B7)')
        ax1.plot(freq_100k_sub, corr_100k_sub, 'b--', linewidth=2, label='100kHz 06-16 (B5)', alpha=0.7)
        ax1.plot(freq_300k_sub, corr_300k_sub, 'r--', linewidth=2, label='300kHz 06-16 (B6/B7)', alpha=0.7)
        ax1.set_xlabel('Frequency (MHz)')
        ax1.set_ylabel('Correction (dB)')
        ax1.set_title('PCEP Correction Curves (Individual)')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        ax1.set_xlim(25, 7000)
        
        # Plot 2: Net corrections (06-26 minus 06-16)
        from scipy.interpolate import interp1d
        freq_common = np.linspace(max(freq_100k_add.min(), freq_100k_sub.min()), 
                                 min(freq_100k_add.max(), freq_100k_sub.max()), 1000)
        
        interp_100k_add = interp1d(freq_100k_add, corr_100k_add, kind='linear')(freq_common)
        interp_100k_sub = interp1d(freq_100k_sub, corr_100k_sub, kind='linear')(freq_common)
        interp_300k_add = interp1d(freq_300k_add, corr_300k_add, kind='linear')(freq_common)
        interp_300k_sub = interp1d(freq_300k_sub, corr_300k_sub, kind='linear')(freq_common)
        
        net_100k = interp_100k_add - interp_100k_sub
        net_300k = interp_300k_add - interp_300k_sub
        
        ax2.plot(freq_common, net_100k, 'b-', linewidth=2, label='B5 Net Correction')
        ax2.plot(freq_common, net_300k, 'r-', linewidth=2, label='B6/B7 Net Correction')
        ax2.set_xlabel('Frequency (MHz)')
        ax2.set_ylabel('Net Correction (dB)')
        ax2.set_title('Net Applied Corrections (+06-26, -06-16)')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        ax2.axhline(y=0, color='k', linestyle='--', alpha=0.5)
        
        # Plot 3: Difference between bands
        band_difference = net_300k - net_100k
        ax3.plot(freq_common, band_difference, 'g-', linewidth=2, label='B6/B7 - B5 Difference')
        ax3.set_xlabel('Frequency (MHz)')
        ax3.set_ylabel('Correction Difference (dB)')
        ax3.set_title('Difference Between B6/B7 and B5 Net Corrections')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        ax3.axhline(y=0, color='k', linestyle='--', alpha=0.5)
        
        # Plot 4: Correction magnitude comparison
        ax4.plot(freq_100k_add, np.abs(corr_100k_add), 'b-', linewidth=2, label='|100kHz 06-26|')
        ax4.plot(freq_300k_add, np.abs(corr_300k_add), 'r-', linewidth=2, label='|300kHz 06-26|')
        ax4.plot(freq_common, np.abs(net_100k), 'b--', linewidth=2, label='|B5 Net|')
        ax4.plot(freq_common, np.abs(net_300k), 'r--', linewidth=2, label='|B6/B7 Net|')
        ax4.set_xlabel('Frequency (MHz)')
        ax4.set_ylabel('|Correction| (dB)')
        ax4.set_title('Correction Magnitudes')
        ax4.legend()
        ax4.grid(True, alpha=0.3)
        ax4.set_yscale('log')
        
        plt.tight_layout()
        
        # Save plot
        os.makedirs(output_dir, exist_ok=True)
        plt.savefig(os.path.join(output_dir, 'correction_summary.png'), dpi=300, bbox_inches='tight')
        print("Saved correction summary plot")
        plt.close(fig)
        
    except Exception as e:
        print(f"Error creating correction summary: {e}")

def main():
    """Main function with user menu"""
    print("PCEP Data Visualization Tool (Enhanced with Organized Files)")
    print("==========================================================")
    print(f"Corrected files folder: {CORRECTED_FILES_FOLDER}/")
    print(f"Original files folder: {ORIGINAL_FILES_FOLDER}/")
    
    # Check if corrected files folder exists
    if not os.path.exists(CORRECTED_FILES_FOLDER):
        print(f"\nWarning: {CORRECTED_FILES_FOLDER}/ folder not found!")
        print("Please make sure corrected files are in the correct folder.")
        return
    
    # Install matplotlib if needed
    try:
        import matplotlib.pyplot as plt
    except ImportError:
        print("Installing matplotlib...")
        import subprocess
        subprocess.run(["pip", "install", "matplotlib"])
        import matplotlib.pyplot as plt
    
    while True:
        print("\nOptions:")
        print("1. Plot single file comparison")
        print("2. Plot multiple B5 files")
        print("3. Plot multiple B6 files") 
        print("4. Plot multiple B7 files")
        print("5. Plot correction curves summary")
        print("6. Plot custom pattern")
        print("7. *** PLOT ALL CORRECTED FILES *** (Recommended)")
        print("0. Exit")
        
        choice = input("\nEnter your choice (0-7): ").strip()
        
        if choice == '0':
            break
        elif choice == '1':
            # List available original files
            original_files = glob.glob(os.path.join(ORIGINAL_FILES_FOLDER, "*.csv"))
            original_files = [f for f in original_files if "PCEP" not in f]
            original_files = sorted(original_files)
            
            print("\nAvailable files:")
            for i, f in enumerate(original_files[:10]):  # Show first 10
                print(f"{i+1}. {os.path.basename(f)}")
            if len(original_files) > 10:
                print(f"... and {len(original_files)-10} more")
            
            try:
                file_idx = int(input("Enter file number: ")) - 1
                if 0 <= file_idx < len(original_files):
                    original_file = original_files[file_idx]
                    plot_single_comparison(original_file)
                else:
                    print("Invalid file number")
            except ValueError:
                print("Invalid input")
                
        elif choice == '2':
            plot_multiple_comparisons("*B5*", max_files=6)
        elif choice == '3':
            plot_multiple_comparisons("*B6*", max_files=6)
        elif choice == '4':
            plot_multiple_comparisons("*B7*", max_files=6)
        elif choice == '5':
            plot_correction_summary()
        elif choice == '6':
            pattern = input("Enter file pattern (e.g., '*Site 1*', '*B5h*'): ").strip()
            max_files = input("Max files to plot (default 6): ").strip()
            max_files = int(max_files) if max_files else 6
            plot_multiple_comparisons(pattern, max_files)
        elif choice == '7':
            print("\nThis will create plots for ALL corrected files. This may take several minutes...")
            confirm = input("Continue? (y/N): ").strip().lower()
            if confirm == 'y':
                plot_all_comparisons()
        else:
            print("Invalid choice")

if __name__ == "__main__":
    main() 