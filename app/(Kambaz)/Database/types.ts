export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  availableFrom: string;
  dueDate: string;
}

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  author?: string;
  image?: string;
}

export interface Module {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: any[];
}

export interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
}


