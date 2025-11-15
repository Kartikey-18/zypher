/**
 * ZKP Simulator for Educational Demonstration
 *
 * This simulates Zero-Knowledge Proof generation for password authentication.
 * In production, this would use actual snarkjs circuits, but this simulation
 * demonstrates the concept perfectly for educational purposes.
 *
 * The simulation shows:
 * - Password never sent to server
 * - Cryptographic proof generation
 * - Server-side verification without seeing password
 */

import crypto from 'crypto';

export interface ZKPProof {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol: string;
  curve: string;
}

export interface ZKPPublicSignals {
  passwordHash: string;
  timestamp: number;
  nonce: string;
}

export interface ProofResult {
  proof: ZKPProof;
  publicSignals: string[];
}

/**
 * Hash password using SHA-256 and convert to BigInt
 */
export async function hashPasswordToBigInt(password: string): Promise<string> {
  if (typeof window !== 'undefined') {
    // Browser environment
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return BigInt('0x' + hashHex).toString();
  } else {
    // Node.js environment
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return BigInt('0x' + hash).toString();
  }
}

/**
 * Generate a cryptographic nonce for replay attack prevention
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined') {
    crypto.getRandomValues(array);
  } else {
    crypto.randomFillSync(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Simulate ZKP proof generation
 * This demonstrates what a real ZKP circuit would do:
 * 1. Takes private input (password)
 * 2. Generates cryptographic proof
 * 3. Returns proof + public signals (hash only)
 *
 * In production, use snarkjs with actual circuits
 */
export async function generateZKProof(
  username: string,
  password: string,
  onProgress?: (step: string) => void
): Promise<ProofResult> {
  // Step 1: Hash password
  onProgress?.('Hashing password with SHA-256...');
  await sleep(300);
  const passwordHash = await hashPasswordToBigInt(password);

  // Step 2: Generate nonce
  onProgress?.('Generating cryptographic nonce...');
  await sleep(200);
  const nonce = generateNonce();
  const timestamp = Date.now();

  // Step 3: Prepare witness (private inputs)
  onProgress?.('Preparing witness with private inputs...');
  await sleep(400);
  const witness = {
    password: password,
    username: username,
    timestamp: timestamp,
    nonce: nonce
  };

  // Step 4: Simulate circuit computation
  onProgress?.('Computing ZKP circuit (Groth16)...');
  await sleep(800);

  // Generate simulated proof components
  // In real implementation, these come from snarkjs
  const proof: ZKPProof = {
    pi_a: [
      generateRandomFieldElement(),
      generateRandomFieldElement(),
      "1"
    ],
    pi_b: [
      [generateRandomFieldElement(), generateRandomFieldElement()],
      [generateRandomFieldElement(), generateRandomFieldElement()],
      ["1", "0"]
    ],
    pi_c: [
      generateRandomFieldElement(),
      generateRandomFieldElement(),
      "1"
    ],
    protocol: "groth16",
    curve: "bn128"
  };

  // Step 5: Generate public signals
  onProgress?.('Generating public signals...');
  await sleep(300);

  // Public signals contain ONLY the hash, not the password
  const publicSignals = [
    passwordHash,
    timestamp.toString(),
    nonce
  ];

  onProgress?.('✓ Proof generated successfully!');
  await sleep(200);

  return {
    proof,
    publicSignals
  };
}

/**
 * Verify ZKP proof (server-side simulation)
 * In production, use snarkjs.groth16.verify()
 */
export async function verifyZKProof(
  proof: ZKPProof,
  publicSignals: string[],
  expectedHash?: string
): Promise<boolean> {
  await sleep(500);

  // Basic validation
  if (!proof || !publicSignals || publicSignals.length < 3) {
    return false;
  }

  // Verify proof structure
  if (!proof.pi_a || !proof.pi_b || !proof.pi_c) {
    return false;
  }

  // If expected hash provided, verify it matches
  if (expectedHash && publicSignals[0] !== expectedHash) {
    return false;
  }

  // Check timestamp is recent (within 5 minutes)
  const timestamp = parseInt(publicSignals[1]);
  const now = Date.now();
  if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
    return false;
  }

  // In production, this would call:
  // return await snarkjs.groth16.verify(verificationKey, publicSignals, proof);

  return true;
}

/**
 * Generate random field element for simulation
 */
function generateRandomFieldElement(): string {
  const bytes = new Uint8Array(32);
  if (typeof window !== 'undefined') {
    crypto.getRandomValues(bytes);
  } else {
    crypto.randomFillSync(bytes);
  }

  // Convert to hex string representing a field element
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return BigInt('0x' + hex).toString();
}

/**
 * Utility: Sleep function for simulating computation time
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Traditional authentication (for comparison)
 */
export interface TraditionalAuthPayload {
  username: string;
  password: string; // ⚠️ Password sent in plain text!
}

export function generateTraditionalAuth(
  username: string,
  password: string
): TraditionalAuthPayload {
  return {
    username,
    password // This is the security problem!
  };
}
