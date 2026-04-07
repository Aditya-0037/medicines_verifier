// ============================================================
// MedVerify - Global Medicine Mock Database
// ============================================================

export type MedicineType = 'Branded' | 'Generic';
export type VerificationStatus = 'GENUINE' | 'EXPIRED' | 'COUNTERFEIT';

export interface Medicine {
  id: string;
  qrId: string;
  name: string;
  salt: string;
  type: MedicineType;
  price: number; // in INR
  manufacturer: string;
  expiryDate: string; // ISO format
  batchNo: string;
  scanCount: number;
  interactions: string[]; // incompatible salts
  category: string;
  dosage: string;
  description: string;
}

export interface LockerMedicine {
  id: string;
  medicineId: string;
  name: string;
  salt: string;
  expiryDate: string;
  dosage: string;
  addedDate: string;
  prescribedFor?: string;
}

export interface Interaction {
  salts: [string, string];
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

// ============================================================
// Medicine Database
// ============================================================
export const MEDICINES: Medicine[] = [
  // --- Antibiotics ---
  {
    id: 'MED001',
    qrId: 'QR-AUG-2024-A1B2C3',
    name: 'Augmentin 625',
    salt: 'Amoxicillin + Clavulanic Acid',
    type: 'Branded',
    price: 285,
    manufacturer: 'GlaxoSmithKline',
    expiryDate: '2026-08-31',
    batchNo: 'AUG-B2024-001',
    scanCount: 2,
    interactions: ['Warfarin', 'Methotrexate'],
    category: 'Antibiotic',
    dosage: '625mg',
    description: 'Used to treat bacterial infections.',
  },
  {
    id: 'MED002',
    qrId: 'QR-AMOX-2024-D4E5F6',
    name: 'Amoxyclav 625',
    salt: 'Amoxicillin + Clavulanic Acid',
    type: 'Generic',
    price: 89,
    manufacturer: 'Cipla Ltd.',
    expiryDate: '2026-06-30',
    batchNo: 'AMOX-C2024-042',
    scanCount: 1,
    interactions: ['Warfarin', 'Methotrexate'],
    category: 'Antibiotic',
    dosage: '625mg',
    description: 'Generic equivalent of Augmentin for bacterial infections.',
  },
  // --- Pain Relief ---
  {
    id: 'MED003',
    qrId: 'QR-CALPOL-2024-G7H8I9',
    name: 'Calpol 500mg',
    salt: 'Paracetamol',
    type: 'Branded',
    price: 38,
    manufacturer: 'GlaxoSmithKline',
    expiryDate: '2025-03-31', // EXPIRED
    batchNo: 'CAL-A2023-113',
    scanCount: 3,
    interactions: ['Alcohol', 'Warfarin'],
    category: 'Analgesic',
    dosage: '500mg',
    description: 'Fever and pain relief.',
  },
  {
    id: 'MED004',
    qrId: 'QR-PARA-2024-J0K1L2',
    name: 'Paracetamol IP 500',
    salt: 'Paracetamol',
    type: 'Generic',
    price: 9,
    manufacturer: 'Sun Pharma',
    expiryDate: '2026-11-30',
    batchNo: 'PARA-S2024-007',
    scanCount: 0,
    interactions: ['Alcohol', 'Warfarin'],
    category: 'Analgesic',
    dosage: '500mg',
    description: 'Generic paracetamol for fever and pain.',
  },
  // --- Counterfeit simulation ---
  {
    id: 'MED005',
    qrId: 'QR-FAKE-2024-M3N4O5',
    name: 'Pantocid 40',
    salt: 'Pantoprazole',
    type: 'Branded',
    price: 132,
    manufacturer: 'Sun Pharma',
    expiryDate: '2026-09-30',
    batchNo: 'PAN-S2024-019',
    scanCount: 8, // > 5 = COUNTERFEIT
    interactions: ['Clopidogrel', 'Atazanavir'],
    category: 'Antacid',
    dosage: '40mg',
    description: 'Proton pump inhibitor for acid reflux.',
  },
  {
    id: 'MED006',
    qrId: 'QR-PANTO-2024-P6Q7R8',
    name: 'Pantoprazole 40mg',
    salt: 'Pantoprazole',
    type: 'Generic',
    price: 32,
    manufacturer: 'Mankind Pharma',
    expiryDate: '2026-12-31',
    batchNo: 'PANT-M2024-088',
    scanCount: 0,
    interactions: ['Clopidogrel', 'Atazanavir'],
    category: 'Antacid',
    dosage: '40mg',
    description: 'Generic pantoprazole for acid reflux.',
  },
  // --- Diabetes ---
  {
    id: 'MED007',
    qrId: 'QR-MET-2024-S9T0U1',
    name: 'Glycomet 500',
    salt: 'Metformin',
    type: 'Branded',
    price: 62,
    manufacturer: 'USV Ltd.',
    expiryDate: '2026-07-31',
    batchNo: 'GLY-U2024-033',
    scanCount: 1,
    interactions: ['Alcohol', 'Contrast Dye', 'Furosemide'],
    category: 'Antidiabetic',
    dosage: '500mg',
    description: 'Controls blood sugar in type 2 diabetes.',
  },
  {
    id: 'MED008',
    qrId: 'QR-METF-2024-V2W3X4',
    name: 'Metformin HCl 500',
    salt: 'Metformin',
    type: 'Generic',
    price: 18,
    manufacturer: 'Alkem Laboratories',
    expiryDate: '2027-01-31',
    batchNo: 'MET-A2024-156',
    scanCount: 0,
    interactions: ['Alcohol', 'Contrast Dye', 'Furosemide'],
    category: 'Antidiabetic',
    dosage: '500mg',
    description: 'Generic metformin for type 2 diabetes.',
  },
  // --- Blood Pressure ---
  {
    id: 'MED009',
    qrId: 'QR-ATENO-2024-Y5Z6A7',
    name: 'Tenormin 50',
    salt: 'Atenolol',
    type: 'Branded',
    price: 95,
    manufacturer: 'AstraZeneca',
    expiryDate: '2026-05-31',
    batchNo: 'TEN-AZ2024-022',
    scanCount: 4,
    interactions: ['Verapamil', 'Clonidine', 'Amlodipine'],
    category: 'Antihypertensive',
    dosage: '50mg',
    description: 'Beta-blocker for heart conditions and high blood pressure.',
  },
  {
    id: 'MED010',
    qrId: 'QR-ATE-2024-B8C9D0',
    name: 'Atenolol 50mg',
    salt: 'Atenolol',
    type: 'Generic',
    price: 24,
    manufacturer: 'Dr. Reddy\'s Laboratories',
    expiryDate: '2026-10-31',
    batchNo: 'ATE-DR2024-099',
    scanCount: 0,
    interactions: ['Verapamil', 'Clonidine', 'Amlodipine'],
    category: 'Antihypertensive',
    dosage: '50mg',
    description: 'Generic atenolol for blood pressure management.',
  },
  // --- Cholesterol ---
  {
    id: 'MED011',
    qrId: 'QR-ROSU-2024-E1F2G3',
    name: 'Rosuvast 10',
    salt: 'Rosuvastatin',
    type: 'Branded',
    price: 165,
    manufacturer: 'Torrent Pharma',
    expiryDate: '2026-04-30',
    batchNo: 'ROS-T2024-067',
    scanCount: 2,
    interactions: ['Warfarin', 'Niacin', 'Gemfibrozil'],
    category: 'Statin',
    dosage: '10mg',
    description: 'Reduces bad cholesterol and triglycerides.',
  },
  {
    id: 'MED012',
    qrId: 'QR-ROSU2-2024-H4I5J6',
    name: 'Rosuvastatin 10mg',
    salt: 'Rosuvastatin',
    type: 'Generic',
    price: 42,
    manufacturer: 'Lupin Ltd.',
    expiryDate: '2027-02-28',
    batchNo: 'ROSU-L2024-211',
    scanCount: 0,
    interactions: ['Warfarin', 'Niacin', 'Gemfibrozil'],
    category: 'Statin',
    dosage: '10mg',
    description: 'Generic rosuvastatin for cholesterol management.',
  },
  // --- Vitamins ---
  {
    id: 'MED013',
    qrId: 'QR-D3-2024-K7L8M9',
    name: 'D-Rise 60K',
    salt: 'Cholecalciferol (Vitamin D3)',
    type: 'Branded',
    price: 120,
    manufacturer: 'USV Ltd.',
    expiryDate: '2026-08-31',
    batchNo: 'DRI-U2024-014',
    scanCount: 1,
    interactions: ['Thiazide Diuretics', 'Digoxin'],
    category: 'Vitamin',
    dosage: '60,000 IU',
    description: 'Vitamin D3 supplement for bone health.',
  },
  {
    id: 'MED014',
    qrId: 'QR-D3G-2024-N0O1P2',
    name: 'Cholecalciferol 60K',
    salt: 'Cholecalciferol (Vitamin D3)',
    type: 'Generic',
    price: 35,
    manufacturer: 'Zydus Cadila',
    expiryDate: '2026-09-30',
    batchNo: 'CHO-Z2024-088',
    scanCount: 0,
    interactions: ['Thiazide Diuretics', 'Digoxin'],
    category: 'Vitamin',
    dosage: '60,000 IU',
    description: 'Generic Vitamin D3 supplement.',
  },
];

// ============================================================
// Drug Interaction Map
// ============================================================
export const INTERACTIONS: Interaction[] = [
  {
    salts: ['Amoxicillin + Clavulanic Acid', 'Warfarin'],
    severity: 'HIGH',
    description: 'Amoxicillin can enhance the anticoagulant effect of Warfarin, increasing bleeding risk.',
  },
  {
    salts: ['Atenolol', 'Amlodipine'],
    severity: 'MEDIUM',
    description: 'Combined use can cause excessive blood pressure drop and heart rate reduction.',
  },
  {
    salts: ['Metformin', 'Alcohol'],
    severity: 'HIGH',
    description: 'Alcohol increases the risk of lactic acidosis when combined with Metformin.',
  },
  {
    salts: ['Paracetamol', 'Warfarin'],
    severity: 'MEDIUM',
    description: 'Regular Paracetamol use can increase INR levels in patients on Warfarin.',
  },
  {
    salts: ['Rosuvastatin', 'Warfarin'],
    severity: 'MEDIUM',
    description: 'Rosuvastatin may increase the anticoagulant effect of Warfarin.',
  },
  {
    salts: ['Pantoprazole', 'Clopidogrel'],
    severity: 'HIGH',
    description: 'PPIs like Pantoprazole can reduce the antiplatelet effect of Clopidogrel.',
  },
];

// ============================================================
// User Locker (Pre-populated for demo)
// ============================================================
export const USER_LOCKER: LockerMedicine[] = [
  {
    id: 'LOC001',
    medicineId: 'MED007',
    name: 'Glycomet 500',
    salt: 'Metformin',
    expiryDate: '2026-07-31',
    dosage: '500mg - Twice daily',
    addedDate: '2024-01-10',
    prescribedFor: 'Type 2 Diabetes',
  },
  {
    id: 'LOC002',
    medicineId: 'MED009',
    name: 'Tenormin 50',
    salt: 'Atenolol',
    expiryDate: '2026-05-31',
    dosage: '50mg - Once daily',
    addedDate: '2024-01-10',
    prescribedFor: 'Hypertension',
  },
  {
    id: 'LOC003',
    medicineId: 'MED003',
    name: 'Calpol 500mg',
    salt: 'Paracetamol',
    expiryDate: '2025-03-31', // Already expired
    dosage: '500mg - As needed',
    addedDate: '2023-12-01',
    prescribedFor: 'Fever & Pain Relief',
  },
  {
    id: 'LOC004',
    medicineId: 'MED013',
    name: 'D-Rise 60K',
    salt: 'Cholecalciferol (Vitamin D3)',
    expiryDate: '2026-08-31',
    dosage: '60,000 IU - Weekly',
    addedDate: '2024-02-15',
    prescribedFor: 'Vitamin D Deficiency',
  },
  {
    id: 'LOC005',
    medicineId: 'MED011',
    name: 'Rosuvast 10',
    salt: 'Rosuvastatin',
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expiring in 20 days
    dosage: '10mg - Once daily at night',
    addedDate: '2024-01-20',
    prescribedFor: 'High Cholesterol',
  },
];

// ============================================================
// OCR Simulation Text (used for prescription validation)
// ============================================================
export const MOCK_OCR_TEXTS: Record<string, string> = {
  prescription_1: `
    Dr. Rajesh Kumar, MBBS, MD
    Apollo Clinic, Sector 14, Gurgaon
    Date: 07/04/2026
    Patient: Ram Sharma | Age: 45

    Rx:
    1. Augmentin 625 - 1 tab BD x 7 days
    2. Paracetamol 500mg - SOS for fever
    3. Pantocid 40mg - 1 tab AC (before food)

    Follow up after 7 days.
  `,
  prescription_2: `
    Dr. Priya Singh, MBBS
    City Medical Centre, Pune
    Date: 05/04/2026
    Patient: Sunita Devi | Age: 62

    Rx:
    1. Glycomet 500 - 1 tab BD with meals
    2. Tenormin 50mg - 1 tab OD morning
    3. Rosuvast 10mg - 1 tab OD night
    4. D-Rise 60K - 1 cap weekly

    Monitor BP weekly.
  `,
};

// ============================================================
// Helper Functions
// ============================================================

export function getMedicineByQR(qrId: string): Medicine | undefined {
  return MEDICINES.find((m) => m.qrId === qrId);
}

export function getVerificationStatus(medicine: Medicine): VerificationStatus {
  if (medicine.scanCount > 5) return 'COUNTERFEIT';
  const today = new Date();
  const expiry = new Date(medicine.expiryDate);
  if (today > expiry) return 'EXPIRED';
  return 'GENUINE';
}

export function getGenericAlternatives(salt: string): Medicine[] {
  return MEDICINES.filter((m) => m.salt === salt && m.type === 'Generic');
}

export function getBrandedMedicine(name: string): Medicine | undefined {
  const lower = name.toLowerCase();
  return MEDICINES.find(
    (m) =>
      m.type === 'Branded' &&
      (m.name.toLowerCase().includes(lower) ||
        m.salt.toLowerCase().includes(lower))
  );
}

export function checkDrugInteractions(
  newSalt: string,
  lockerMedicines: LockerMedicine[]
): { interaction: Interaction; conflictWith: string }[] {
  const conflicts: { interaction: Interaction; conflictWith: string }[] = [];
  for (const lockerMed of lockerMedicines) {
    for (const interaction of INTERACTIONS) {
      const [saltA, saltB] = interaction.salts;
      if (
        (saltA === newSalt && saltB === lockerMed.salt) ||
        (saltB === newSalt && saltA === lockerMed.salt)
      ) {
        conflicts.push({ interaction, conflictWith: lockerMed.name });
      }
    }
  }
  return conflicts;
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export type ExpiryCategory = 'EXPIRED' | 'EXPIRING_SOON' | 'SAFE';

export function getExpiryCategory(expiryDate: string): ExpiryCategory {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return 'EXPIRED';
  if (days <= 30) return 'EXPIRING_SOON';
  return 'SAFE';
}

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function fuzzyMatch(queryName: string, text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  const query = queryName.toLowerCase();
  let maxScore = 0;
  for (const word of words) {
    const dist = levenshtein(query, word);
    const score = 1 - dist / Math.max(query.length, word.length);
    if (score > maxScore) maxScore = score;
  }
  return Math.round(maxScore * 100);
}

// All QR IDs for the scanner simulation
export const ALL_QR_IDS = MEDICINES.map((m) => m.qrId);

// Mock scan presets for simulation
export const SCAN_PRESETS = [
  { label: 'Genuine Medicine', qrId: 'QR-AUG-2024-A1B2C3' },
  { label: 'Expired Medicine', qrId: 'QR-CALPOL-2024-G7H8I9' },
  { label: 'Counterfeit Alert', qrId: 'QR-FAKE-2024-M3N4O5' },
  { label: 'With Interaction', qrId: 'QR-ATENO-2024-Y5Z6A7' },
];
