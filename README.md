# ImageCipher - Advanced Image Encryption CLI

**ImageCipher** is a powerful command-line tool for securely encrypting and decrypting images. Built with Node.js and function-based architecture for optimal performance and security.

## What is ImageCipher?

ImageCipher provides encryption for your images using:
- **AES-256-GCM encryption** with password-based key derivation
- **Batch processing** for multiple images
- **Interactive wizard** for easy usage
- **XOR encryption** for backward compatibility

Perfect for securing personal photos, business documents, medical images, and any visual content requiring protection.

## Key Features

- **Multiple Encryption Methods**: AES-256-GCM and XOR encryption
- **Batch Processing**: Encrypt/decrypt entire directories with subdirectory support
- **Interactive Mode**: Step-by-step wizard for beginners
- **Image Analysis**: Metadata and security assessment tools
- **Advanced Security**: PBKDF2 key derivation, unique salts, authentication tags
- **High Performance**: Function-based architecture, reduced memory footprint
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

```bash
# Global installation (recommended)
npm install -g imagecipher

# Or from source
git clone https://github.com/AdityaKrSingh26/ImageCipher.git
cd ImageCipher
npm install
```

## Quick Start

### Interactive Mode (Recommended for beginners)
```bash
imagecipher --interactive
```
**Example workflow:**
```
🎨 Welcome to ImageCipher Interactive Mode!
=====================================

What would you like to do?
1. Encrypt an image
2. Decrypt an image  
3. Batch process
4. Exit

Choice (1-4): 1

🔒 Image Encryption Wizard
==========================

Enter image path: photo.jpg
Use password-based encryption? (y/n): y
Enter password (or press Enter to generate): 
🔑 Generated password: x7K#mP9$nQ2@wR5t
Output path (or press Enter for auto): 

🔄 Encrypting...
✅ Encryption successful!
📁 Output: photo_encrypted.jpg
```

### Basic Usage
```bash
# Encrypt an image
imagecipher --encrypt photo.jpg --password "MySecretPassword123"

# Decrypt an image  
imagecipher --decrypt photo_encrypted.jpg --password "MySecretPassword123"

# Generate secure password automatically
imagecipher --encrypt photo.jpg --generate-password
```

### Batch Processing
```bash
# Encrypt all images in a directory
imagecipher --batch ./photos --operation encrypt --password "batchPassword"

# Include subdirectories
imagecipher --batch ./photos --operation encrypt --recursive --password "myPassword"
```
**Batch Features:**
- Supports PNG, JPG, JPEG formats
- Continues processing even if individual files fail
- Shows progress: "✔ Batch Processing Complete: 15 successful, 2 failed"
- Provides detailed error reports for failed files

### Image Analysis

Analyze image properties and metadata before or after encryption.

```bash
# Analyze a single image
imagecipher --analyze image.jpg

# Example output:
📊 Image Analysis
================
Dimensions: 1920x1080
Format: JPEG  
Channels: 3
Color Space: srgb
File Size: 245.67 KB
Entropy: 7.23
Color Profile: sRGB
```

## Command-Line Reference

### Core Commands

| Command | Alias | Description | Example |
|---------|-------|-------------|---------|
| `--interactive` | `-i` | Launch interactive wizard | `imagecipher -i` |
| `--encrypt <file>` | `-e` | Encrypt an image file | `imagecipher -e photo.jpg` |
| `--decrypt <file>` | `-d` | Decrypt an encrypted image | `imagecipher -d photo_encrypted.jpg` |
| `--analyze <file>` | `-a` | Analyze image properties | `imagecipher -a photo.jpg` |

### Security Options

| Flag | Alias | Description | Example |
|------|-------|-------------|---------|
| `--password <pwd>` | `-p` | Use password-based encryption | `--password "mySecret123"` |
| `--generate-password` | `-g` | Generate secure random password | `--generate-password` |
| `--key <file>` | `-k` | Key file for XOR decryption | `--key encryption.key` |
| `--algorithm <algo>` | `--alg` | Choose encryption algorithm | `--algorithm aes` |

### File Output Options

| Flag | Alias | Description | Example |
|------|-------|-------------|---------|
| `--output-image <file>` | `-o` | Specify output image name | `-o encrypted.png` |
| `--output-key <file>` | `-ok` | Specify output key filename | `-ok mykey.txt` |
| `--format <fmt>` | `-f` | Output format (png,jpg,webp) | `--format png` |
| `--quality <num>` | `-q` | Image quality 1-100 | `--quality 95` |

### Batch Processing Options

| Flag | Alias | Description | Example |
|------|-------|-------------|---------|
| `--batch <dir>` | `-b` | Process directory in batch | `-b ./photos` |
| `--operation <op>` | `--op` | Batch operation (encrypt/decrypt) | `--operation encrypt` |
| `--recursive` | `-r` | Include subdirectories | `--recursive` |
| `--output-dir <dir>` | `-od` | Output directory for batch | `--output-dir ./secured` |

### Utility Options

| Flag | Alias | Description | Example |
|------|-------|-------------|---------|
| `--help` | `-h` | Show help information | `imagecipher --help` |
| `--version` | `-v` | Show version number | `imagecipher --version` |
| `--clear` | `-c` | Clear console before running | `--clear` |
| `--noClear` | | Don't clear console | `--noClear` |

## Security Features

### Password-Based Encryption (Recommended)
- **Algorithm**: AES-256-GCM 
- **Key Derivation**: PBKDF2 with SHA-512, 100,000 iterations
- **Protection**: Unique salt/IV per encryption, authentication tags prevent tampering

### XOR Encryption (Legacy Support)
- **Method**: Pixel-level XOR with cryptographically secure random keys
- **Compatibility**: Backward compatible with older versions
- **Storage**: Base64-encoded key files


## 🧪 Manual Testing

```bash
# Test basic functionality
imagecipher --encrypt test.jpg --password "test123"
imagecipher --decrypt test_encrypted.jpg --password "test123"

# Test batch processing
mkdir test_images
imagecipher --batch test_images --operation encrypt --password "batch123"

# Test analysis
imagecipher --analyze test.jpg
```

## Development

```bash
# Clone and setup
git clone https://github.com/AdityaKrSingh26/ImageCipher.git
cd ImageCipher
npm install
npm test
```

---

**⭐ Star this project: [https://github.com/AdityaKrSingh26/ImageCipher](https://github.com/AdityaKrSingh26/ImageCipher)**

*ImageCipher - Securing your images with modern cryptography.*