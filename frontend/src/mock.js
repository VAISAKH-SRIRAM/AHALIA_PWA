// Mock data for Ahalia Camp App

export const mockCampInfo = {
  campName: "World Diabetes Day Camp 2025",
  campLocation: "Kunnamkulam PHC",
  campDate: "20 Nov 2025",
  campOfficial: "Dr. Sreekumar"
};

export const mockFlashNews = [
  "Free diabetes checkup available",
  "Eye screening till 4 PM",
  "Pharmacy closes at 6 PM",
  "Next camp at Thrissur Medical College on 25 Nov",
  "Bring Aadhar card for registration",
  "Free medication for diabetes patients"
];

export const mockMetrics = {
  totalPatients: 87,
  referredToHospital: 12,
  waitingInQueue: 8
};

export const mockPatients = [
  {
    id: "CAMP-001",
    fullName: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    mobile: "9876543210",
    aadhar: "1234-5678-9012",
    email: "rajesh@example.com",
    addressLine1: "TC 12/345, Jawahar Nagar",
    addressLine2: "Near Post Office",
    post: "Kunnamkulam",
    pincode: "680503",
    district: "Thrissur",
    state: "Kerala",
    country: "India",
    campPlace: "Kunnamkulam PHC",
    campDate: "2025-11-20",
    campOfficial: "Dr. Sreekumar",
    reference: "Health Worker",
    referenceDetails: "Local ASHA worker",
    patientCategory: "General",
    emergencyContact: {
      name: "Suma Rajesh",
      mobile: "9876543211",
      relationship: "Wife"
    },
    status: "In Consultation",
    vitals: {
      height: 170,
      weight: 75,
      bp: "130/85",
      pulse: 78,
      temperature: 98.4,
      randomSugar: 145
    },
    diagnostics: "Type 2 Diabetes - Uncontrolled. Hypertension Grade 1.",
    timestamp: new Date().toISOString()
  },
  {
    id: "CAMP-002",
    fullName: "Lakshmi Menon",
    age: 52,
    gender: "Female",
    mobile: "9876543212",
    addressLine1: "Menon House",
    addressLine2: "Vallachira",
    post: "Kunnamkulam",
    pincode: "680503",
    district: "Thrissur",
    state: "Kerala",
    country: "India",
    campPlace: "Kunnamkulam PHC",
    campDate: "2025-11-20",
    campOfficial: "Dr. Sreekumar",
    reference: "Self",
    patientCategory: "General",
    emergencyContact: {
      name: "Suresh Menon",
      mobile: "9876543213",
      relationship: "Husband"
    },
    status: "Waiting",
    vitals: {
      height: 158,
      weight: 68,
      bp: "120/80",
      pulse: 72,
      temperature: 98.2
    },
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];

export const mockProcedures = [
  { id: 1, name: "Blood Sugar Test - Fasting", category: "Diagnostics", price: 50, discount: 100 },
  { id: 2, name: "Blood Sugar Test - Random", category: "Diagnostics", price: 50, discount: 100 },
  { id: 3, name: "Blood Pressure Monitoring", category: "Diagnostics", price: 30, discount: 100 },
  { id: 4, name: "Eye Examination", category: "Ophthalmology", price: 200, discount: 100 },
  { id: 5, name: "Fundoscopy", category: "Ophthalmology", price: 300, discount: 50 },
  { id: 6, name: "HbA1c Test", category: "Diagnostics", price: 400, discount: 50 },
  { id: 7, name: "Lipid Profile", category: "Diagnostics", price: 500, discount: 30 },
  { id: 8, name: "ECG", category: "Cardiology", price: 200, discount: 100 },
  { id: 9, name: "General Consultation", category: "Consultation", price: 100, discount: 100 },
  { id: 10, name: "Specialist Consultation", category: "Consultation", price: 300, discount: 50 }
];

export const mockMedicines = [
  { id: 1, name: "Metformin 500mg", batch: "MET2025A", expiry: "2026-12-31", stock: 500, price: 2.5, gst: 12 },
  { id: 2, name: "Glimepiride 1mg", batch: "GLM2025B", expiry: "2026-10-31", stock: 300, price: 3.5, gst: 12 },
  { id: 3, name: "Aspirin 75mg", batch: "ASP2025C", expiry: "2027-06-30", stock: 1000, price: 1.0, gst: 12 },
  { id: 4, name: "Atorvastatin 10mg", batch: "ATV2025D", expiry: "2026-08-31", stock: 400, price: 5.0, gst: 12 },
  { id: 5, name: "Amlodipine 5mg", batch: "AML2025E", expiry: "2027-03-31", stock: 600, price: 3.0, gst: 12 },
  { id: 6, name: "Insulin Glargine 100IU", batch: "INS2025F", expiry: "2026-12-31", stock: 50, price: 450.0, gst: 5 },
  { id: 7, name: "Paracetamol 500mg", batch: "PAR2025G", expiry: "2027-01-31", stock: 2000, price: 0.5, gst: 12 },
  { id: 8, name: "Omeprazole 20mg", batch: "OME2025H", expiry: "2026-11-30", stock: 350, price: 2.0, gst: 12 }
];

export const mockDoctors = [
  { id: 1, name: "Dr. Sreekumar K.V.", specialization: "General Medicine" },
  { id: 2, name: "Dr. Priya Menon", specialization: "Ophthalmology" },
  { id: 3, name: "Dr. Anand Kumar", specialization: "Diabetology" },
  { id: 4, name: "Dr. Suma Devi", specialization: "Cardiology" }
];

export const mockCategories = [
  "General",
  "BPL",
  "Insurance",
  "Senior Citizen",
  "Student"
];

export const mockReferences = [
  "Self",
  "Health Worker",
  "ASHA Worker",
  "Previous Patient",
  "Camp Volunteer",
  "Social Media",
  "Local Advertisement"
];

export const mockDistricts = [
  "Thrissur",
  "Ernakulam",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Kannur",
  "Kottayam",
  "Alappuzha"
];

export const mockStates = [
  "Kerala",
  "Tamil Nadu",
  "Karnataka",
  "Andhra Pradesh"
];
