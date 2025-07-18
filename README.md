# ImageCipher - CLI-based Image Encryption Tool

**ImageCipher** is a powerful command-line tool for securely encrypting and decrypting images using XOR encryption. With easy-to-use commands, ImageCipher allows you to encrypt any supported image file and later decrypt it using the key generated during the encryption process. ImageCipher supports both PNG and JPEG formats, and is a simple yet effective way to safeguard your images.

## Table of Contents

- [Features](#features)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Commands](#commands)
- [Usage](#usage)
  - [Encrypting an Image](#encrypt-an-image)
  - [Decrypting an Image](#decrypt-an-image)
- [Limitations](#limitations)
- [Contributing](#contributing)

## Features

- **Secure Encryption**: Encrypt images using XOR encryption for added security.
- **Decryption**: Decrypt images back to their original form using the encryption key.
- **Custom Output**: Define custom output file names for encrypted images and keys.
- **Supported Formats**: Works with PNG, JPG, and JPEG image formats.
  
## Dependencies

Ensure you have the following installed before using ImageCipher:

- [Node.js](https://nodejs.org/) (including npm)

## Installation

To get started with ImageCipher:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/AdityaKrSingh26/ImageCipher.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd ImageCipher
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

## Commands

ImageCipher supports a range of commands, outlined below:

```sh
  -h, --help                 # List all available commands
  -e, --encrypt              # Specify the image to encrypt
  -d, --decrypt              # Specify the image to decrypt
  -c, --clear                # Clear the console (Default: false)
  --noClear                  # Don’t clear the console (Default: true)
  -v, --version              # Display the current CLI version (Default: false)
  -k, --key                  # Specify the key file for decryption
  -i, --outputImageFileName  # Specify the output image file name
  -p, --outputKeyFileName    # Specify the output key file name
```

## Usage

### Encrypt an Image

To encrypt an image file:

```bash
pixeldust --encrypt <image_path> --outputImageFileName <output_image> --outputKeyFileName <key_file>
```

- `<image_path>`: Path to the image you want to encrypt.
- `<output_image>`: Desired name for the encrypted image file.
- `<key_file>`: Desired name for the key file.

**Example**:
```bash
pixeldust --encrypt myImage.png --outputImageFileName encryptedImage.png --outputKeyFileName myKey.key
```

### Decrypt an Image

To decrypt an encrypted image file:

```bash
pixeldust --decrypt <encrypted_image_path> --key <key_file> --outputImageFileName <decrypted_image>
```

- `<encrypted_image_path>`: Path to the encrypted image file.
- `<key_file>`: Path to the key file generated during encryption.
- `<decrypted_image>`: Desired name for the decrypted image file.

**Example**:
```bash
pixeldust --decrypt encryptedImage.png --key myKey.key --outputImageFileName decryptedImage.png
```

## Limitations

- **PNG Format**: The encryption and decryption process works seamlessly for PNG files as this format is lossless.
- **JPEG and JPG Formats**: Due to their lossy nature, JPEG and JPG images may exhibit minor pixel changes after decryption. Compression artifacts and color quantization associated with these formats can result in decrypted images that differ slightly from the originals.

## Contributing

Contributions are welcome! If you’d like to report an issue, suggest an improvement, or contribute code, please open a pull request or an issue on the [GitHub repository](https://github.com/AdityaKrSingh26/ImageCipher.git).

---
