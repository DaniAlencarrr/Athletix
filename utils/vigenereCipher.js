const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%^&*()-_=+[]{}|;:\'"<>,./`~\n\r\t';
const NONCE_LENGTH = 8;

/**
 * Função para criptografar.
 * @param {string} text - O texto a ser criptografado.
 * @param {string} key - A chave secreta.
 * @returns {string} - O texto criptografado.
 */
export function encryptVigenere(text, key) {
  if (!key) return text;

  let encryptedText = '';
  const keyLength = key.length;
  const alphabetLength = ALPHABET.length;

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i];
    const keyChar = key[i % keyLength];
    const textIndex = ALPHABET.indexOf(textChar);

    if (textIndex === -1) {
      encryptedText += textChar;
      continue;
    }

    const keyIndex = ALPHABET.indexOf(keyChar);
    if (keyIndex === -1) {
      encryptedText += textChar;
      continue;
    }

    const encryptedIndex = (textIndex + keyIndex) % alphabetLength;
    encryptedText += ALPHABET[encryptedIndex];
  }

  return encryptedText;
}

/**
 * Função para descriptografar.
 * @param {string} encryptedText - O texto a ser descriptografado.
 * @param {string} key - A chave secreta.
 * @returns {string} - O texto original.
 */
export function decryptVigenere(encryptedText, key) {
  if (!key) return encryptedText;

  let decryptedText = '';
  const keyLength = key.length;
  const alphabetLength = ALPHABET.length;

  for (let i = 0; i < encryptedText.length; i++) {
    const encryptedChar = encryptedText[i];
    const keyChar = key[i % keyLength];
    const encryptedIndex = ALPHABET.indexOf(encryptedChar);

    if (encryptedIndex === -1) {
      decryptedText += encryptedChar;
      continue;
    }

    const keyIndex = ALPHABET.indexOf(keyChar);
    if (keyIndex === -1) {
      decryptedText += encryptedChar;
      continue;
    }

    const decryptedIndex = (encryptedIndex - keyIndex + alphabetLength) % alphabetLength;
    decryptedText += ALPHABET[decryptedIndex];
  }

  return decryptedText;
}

/**
 * Gera uma string aleatória.
 * @param {number} length - O comprimento do Nonce.
 * @returns {string} - O Nonce gerado.
 */
function generateNonce(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
}

/**
 * Função aprimorada para criptografar senhas para o TCC.
 * @param {string} password - A senha a ser criptografada.
 * @param {string} key - A chave secreta.
 * @returns {string} - O texto final para salvar no banco.
 */
export function encryptPasswordForTCC(password, key) {
  if (!key) return password;

  const nonce = generateNonce(NONCE_LENGTH);
  const textToEncrypt = nonce + password;
  const base64Encoded = btoa(unescape(encodeURIComponent(textToEncrypt)));
  
  const encryptedPayload = encryptVigenere(base64Encoded, key); 

  return nonce + encryptedPayload;
}

/**
 * Função para descriptografar a senha do TCC.
 * @param {string} fullEncryptedText - O texto vindo do banco (nonce + cifrado).
 * @param {string} key - A chave secreta.
 * @returns {string|null} - A senha original ou null se falhar.
 */
export function decryptPasswordForTCC(fullEncryptedText, key) {
  if (!key || !fullEncryptedText || fullEncryptedText.length < NONCE_LENGTH) return null;

  const nonce = fullEncryptedText.substring(0, NONCE_LENGTH);
  const encryptedPayload = fullEncryptedText.substring(NONCE_LENGTH);

  const base64Encoded = decryptVigenere(encryptedPayload, key);

  try {
    const decryptedText = decodeURIComponent(escape(atob(base64Encoded)));
    if (decryptedText.startsWith(nonce)) {
      return decryptedText.substring(NONCE_LENGTH);
    }
    return null;
  } catch (error) {
    console.error("Erro ao decodificar Base64:", error);
    return null;
  }
}