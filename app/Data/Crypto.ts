// Data/Crypto.ts
import CryptoJS from 'crypto-js';

export class Encryption {
  // Salt that matches C# implementation: "Ivan Medvedev"
  private static readonly SALT = new Uint8Array([
    73, 118, 97, 110, 32, 77, 101, 100, 118, 101, 100, 101, 118
  ]);

  /**
   * Derives key using PBKDF1 (to match C# PasswordDeriveBytes)
   * This mimics the behavior of PasswordDeriveBytes in C#
   */
  private deriveKeyPBKDF1(
    password: string,
    salt: Uint8Array,
    iterations: number,
    keySize: number
  ): Uint8Array {
    // For UTF-16LE encoding (matching C# Encoding.Unicode)
    const utf16Password = new Uint8Array(password.length * 2);
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i);
      utf16Password[i * 2] = charCode & 0xff;
      utf16Password[i * 2 + 1] = (charCode >> 8) & 0xff;
    }

    // Concatenate password and salt
    const combined = new Uint8Array(utf16Password.length + salt.length);
    combined.set(utf16Password);
    combined.set(salt, utf16Password.length);

    // Hash using SHA1 (PBKDF1 uses SHA1 by default in C#)
    let hash = CryptoJS.SHA1(
      CryptoJS.lib.WordArray.create(combined as any)
    );

    // Perform iterations
    for (let i = 1; i < iterations; i++) {
      hash = CryptoJS.SHA1(hash);
    }

    // Extend hash if needed
    let result = hash;
    while (result.sigBytes < keySize) {
      const temp = CryptoJS.SHA1(result);
      result = CryptoJS.lib.WordArray.create(
        [...result.words, ...temp.words]
      );
      result.sigBytes = result.words.length * 4;
    }

    // Convert to Uint8Array and truncate to required size
    const words = result.words;
    const bytes = new Uint8Array(keySize);
    for (let i = 0; i < keySize; i++) {
      bytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    return bytes;
  }

  /**
   * Encrypts data matching C# AES encryption
   */
  private encryptBytes(clearData: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
    // Convert Uint8Array to WordArray for CryptoJS
    const keyWords = CryptoJS.lib.WordArray.create(key as any);
    const ivWords = CryptoJS.lib.WordArray.create(iv as any);
    const dataWords = CryptoJS.lib.WordArray.create(clearData as any);

    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(dataWords, keyWords, {
      iv: ivWords,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert to Uint8Array
    const cipherText = encrypted.ciphertext;
    const resultArray = new Uint8Array(cipherText.sigBytes);
    for (let i = 0; i < cipherText.sigBytes; i++) {
      resultArray[i] = (cipherText.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    return resultArray;
  }

  /**
   * Encrypts string with password (matching C# implementation)
   */
  public encryptString(clearText: string, password: string = 'dmsswe'): string {
    try {
      // Convert string to UTF-16LE bytes (matching C# Encoding.Unicode)
      const utf16Bytes = new Uint8Array(clearText.length * 2);
      for (let i = 0; i < clearText.length; i++) {
        const charCode = clearText.charCodeAt(i);
        utf16Bytes[i * 2] = charCode & 0xff;
        utf16Bytes[i * 2 + 1] = (charCode >> 8) & 0xff;
      }

      // Derive key and IV (32 bytes for key, 16 bytes for IV)
      const keyBytes = this.deriveKeyPBKDF1(password, Encryption.SALT, 100, 32);
      const ivBytes = this.deriveKeyPBKDF1(password, Encryption.SALT, 100, 16);

      // Encrypt
      const encrypted = this.encryptBytes(utf16Bytes, keyBytes, ivBytes);

      // Convert to Base64
      return btoa(String.fromCharCode(...encrypted));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts data matching C# AES decryption
   */
  private decryptBytes(cipherData: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
    // Convert Uint8Array to WordArray for CryptoJS
    const keyWords = CryptoJS.lib.WordArray.create(key as any);
    const ivWords = CryptoJS.lib.WordArray.create(iv as any);
    const cipherWords = CryptoJS.lib.WordArray.create(cipherData as any);

    // Create CipherParams object
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: cipherWords
    });

    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWords, {
      iv: ivWords,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert to Uint8Array
    const resultArray = new Uint8Array(decrypted.sigBytes);
    for (let i = 0; i < decrypted.sigBytes; i++) {
      resultArray[i] = (decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    return resultArray;
  }

  /**
   * Decrypts string with password (matching C# implementation)
   */
  public decryptString(cipherText: string, password: string = 'dmsswe'): string {
    try {
      // Convert from Base64
      const binaryString = atob(cipherText);
      const cipherData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        cipherData[i] = binaryString.charCodeAt(i);
      }

      // Derive key and IV (32 bytes for key, 16 bytes for IV)
      const keyBytes = this.deriveKeyPBKDF1(password, Encryption.SALT, 100, 32);
      const ivBytes = this.deriveKeyPBKDF1(password, Encryption.SALT, 100, 16);

      // Decrypt
      const decrypted = this.decryptBytes(cipherData, keyBytes, ivBytes);

      // Convert from UTF-16LE to string
      let result = '';
      for (let i = 0; i < decrypted.length; i += 2) {
        const charCode = decrypted[i] | (decrypted[i + 1] << 8);
        result += String.fromCharCode(charCode);
      }

      return result;
    } catch (error) {
      console.error('Decryption failed:', error);
      return 'error';
    }
  }
}

// Usage:
// const encryption = new Encryption();
// const encrypted = encryption.encryptString("Hello World", "dmsswe");
// const decrypted = encryption.decryptString(encrypted, "dmsswe");