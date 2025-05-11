
import { Medicine } from "@/contexts/CartContext";

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  image: string;
  experience: number;
  patients: number;
  rating: number;
  about: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  registered: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Speciality {
  id: string;
  name: string;
  image: string;
  description: string;
  doctorCount: number;
}

// Mock Medicines
export const medicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    category: "Pain Relief",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    description: "Antibiotic used to treat bacterial infections",
    price: 12.99,
    category: "Antibiotics",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "3",
    name: "Lisinopril 10mg",
    description: "Used to treat high blood pressure",
    price: 8.49,
    category: "Blood Pressure",
    image: "https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "4",
    name: "Omeprazole 20mg",
    description: "Used to treat heartburn and reflux disease",
    price: 7.99,
    category: "Digestive Health",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "5",
    name: "Metformin 500mg",
    description: "Used to treat type 2 diabetes",
    price: 9.99,
    category: "Diabetes",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "6",
    name: "Atorvastatin 20mg",
    description: "Used to lower cholesterol",
    price: 14.99,
    category: "Cholesterol",
    image: "https://images.unsplash.com/photo-1585435557343-3b348a942da2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "7",
    name: "Albuterol Inhaler",
    description: "Used to treat asthma and COPD",
    price: 24.99,
    category: "Respiratory",
    image: "https://images.unsplash.com/photo-1616279969760-d27104b6929e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "8",
    name: "Loratadine 10mg",
    description: "Antihistamine for allergy relief",
    price: 6.99,
    category: "Allergy",
    image: "https://images.unsplash.com/photo-1559142642-372cc9238a5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
];

// Mock Specialities
export const specialities: Speciality[] = [
  {
    id: "1",
    name: "Cardiology",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Diagnosis and treatment of heart disorders",
    doctorCount: 8
  },
  {
    id: "2",
    name: "Neurology",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Diagnosis and treatment of nervous system disorders",
    doctorCount: 6
  },
  {
    id: "3",
    name: "Orthopedics",
    image: "https://images.unsplash.com/photo-1579684285072-f32e7065a9f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Treatment of the musculoskeletal system",
    doctorCount: 7
  },
  {
    id: "4",
    name: "Pediatrics",
    image: "https://images.unsplash.com/photo-1584516150454-19ebd9de5637?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Medical care for infants, children, and adolescents",
    doctorCount: 10
  },
  {
    id: "5",
    name: "Dermatology",
    image: "https://images.unsplash.com/photo-1564979045531-fa386a275b27?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Diagnosis and treatment of skin disorders",
    doctorCount: 5
  },
  {
    id: "6",
    name: "Ophthalmology",
    image: "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Medical and surgical care of the eye",
    doctorCount: 4
  }
];

// Mock Doctors
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. John Smith",
    speciality: "Cardiology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    experience: 12,
    patients: 5000,
    rating: 4.8,
    about: "Dr. Smith is a board-certified cardiologist with extensive experience in treating heart conditions."
  },
  {
    id: "2",
    name: "Dr. Emily Johnson",
    speciality: "Neurology",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    experience: 8,
    patients: 3200,
    rating: 4.7,
    about: "Dr. Johnson specializes in neurological disorders and has published several research papers on stroke prevention."
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    speciality: "Orthopedics",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    experience: 15,
    patients: 7500,
    rating: 4.9,
    about: "Dr. Chen is an orthopedic surgeon specializing in sports medicine and joint replacements."
  },
  {
    id: "4",
    name: "Dr. Sarah Williams",
    speciality: "Pediatrics",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    experience: 10,
    patients: 6800,
    rating: 4.9,
    about: "Dr. Williams is passionate about child health and has a special interest in developmental pediatrics."
  },
  {
    id: "5",
    name: "Dr. Robert Taylor",
    speciality: "Dermatology",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    experience: 9,
    patients: 4200,
    rating: 4.6,
    about: "Dr. Taylor specializes in treating skin conditions and is known for his expertise in cosmetic dermatology."
  },
  {
    id: "6",
    name: "Dr. Jennifer Lee",
    speciality: "Ophthalmology",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    experience: 11,
    patients: 4800,
    rating: 4.7,
    about: "Dr. Lee is an ophthalmologist with expertise in cataract surgery and glaucoma treatment."
  }
];

// Mock Users (for admin panel)
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@hospital.com",
    role: "admin",
    registered: "2023-01-10"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "patient",
    registered: "2023-02-15"
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "patient",
    registered: "2023-03-22"
  },
  {
    id: "4",
    name: "Dr. John Smith",
    email: "drsmith@hospital.com",
    role: "doctor",
    registered: "2022-11-05"
  },
  {
    id: "5",
    name: "Dr. Emily Johnson",
    email: "drjohnson@hospital.com",
    role: "doctor",
    registered: "2022-12-18"
  }
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "2",
    doctorId: "1",
    doctorName: "Dr. John Smith",
    speciality: "Cardiology",
    date: "2025-05-15",
    time: "10:00 AM",
    status: "scheduled"
  },
  {
    id: "2",
    patientId: "3",
    doctorId: "4",
    doctorName: "Dr. Sarah Williams",
    speciality: "Pediatrics",
    date: "2025-05-18",
    time: "2:30 PM",
    status: "scheduled"
  },
  {
    id: "3",
    patientId: "2",
    doctorId: "3",
    doctorName: "Dr. Michael Chen",
    speciality: "Orthopedics",
    date: "2025-05-05",
    time: "11:15 AM",
    status: "completed"
  },
  {
    id: "4",
    patientId: "3",
    doctorId: "2",
    doctorName: "Dr. Emily Johnson",
    speciality: "Neurology",
    date: "2025-05-02",
    time: "3:00 PM",
    status: "cancelled"
  }
];
