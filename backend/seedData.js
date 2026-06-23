export const initialStats = {
  totalMembers: "500+",
  eventsConducted: "40+",
  yearsOfInnovation: "8+"
};

export const initialAchievements = [
  {
    title: "State Level Hardware Hackathon",
    category: "1st Place",
    date: "Sept 2024",
    organizer: "Kerala Startup Mission",
    team: "Team: Arun K, Sneha R, Rahul M, Farsana A",
    description: "Secured first place for developing an AI-powered smart irrigation prototype that monitors soil conditions in real time using IoT sensors.",
    image: "https://images.unsplash.com/photo-1555374018-13a8994ab246?w=600&q=80"
  },
  {
    title: "Regional Startup Pitch Competition",
    category: "1st Place",
    date: "Aug 2024",
    organizer: "IIT Palakkad Tech Fest",
    team: "Team: Kevin J, Maria T, Jithin P",
    description: "Recognized for the most scalable business model in the sustainability sector among 60+ competing teams from across Kerala.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
  }
];

export const initialEvents = [
  {
    title: "HackSurface 3.0",
    category: "hackathon",
    date: "Jan 15, 2026",
    location: "AWH Campus",
    description: "The flagship hardware hackathon returns — 24-hour build marathon focused on robotics, IoT and embedded systems.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
    isUpcoming: true,
    registrationUrl: "https://iedc.startupmission.in/register",
    eventReport: ""
  },
  {
    title: "AWH Startup Bootcamp 2026",
    category: "bootcamp",
    date: "Feb 10–12, 2026",
    location: "AWH Campus",
    description: "Intensive 3-day ideation and business modeling workshop for aspiring student founders.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    isUpcoming: true,
    registrationUrl: "https://iedc.startupmission.in/register",
    eventReport: ""
  },
  {
    title: "Idea Fest 2026",
    category: "idea",
    date: "Mar 5, 2026",
    location: "AWH Campus",
    description: "Annual KSUM programme — pitch your raw idea in 5 minutes and get feedback from mentors and investors.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
    isUpcoming: true,
    registrationUrl: "https://iedc.startupmission.in/register",
    eventReport: ""
  },
  {
    title: "HackSurface 2.0",
    category: "hackathon",
    date: "Oct 12, 2024",
    location: "AWH Campus",
    description: "24-hour hardware hackathon with 200+ participants from 15 colleges. Theme: Smart Agriculture and Rural Innovation.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    isUpcoming: false,
    registrationUrl: "",
    eventReport: "Successfully completed hardware hackathon with participants pitching IoT agricultural solutions. Chief guest from KSUM distributed prizes."
  },
  {
    title: "AWH Bootcamp 2024",
    category: "bootcamp",
    date: "Oct 25–27, 2024",
    location: "AWH Campus",
    description: "Intensive 3-day bootcamp with 80 student founders learning lean canvas, customer discovery and MVP prototyping.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    isUpcoming: false,
    registrationUrl: "",
    eventReport: "A 3-day workshop where students developed business pitches. 5 teams shortlisted for regional seed funding round."
  },
  {
    title: "Founder Stories",
    category: "talk",
    date: "Aug 05, 2024",
    location: "AWH Seminar Hall",
    description: "Interactive session with 3 successful AWH alumni entrepreneurs sharing startup journeys, failures and lessons learnt.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
    isUpcoming: false,
    registrationUrl: "",
    eventReport: "Inspiring talks from alumni sharing their business scale-up stories. Followed by a Q&A session with 150+ students."
  },
  {
    title: "IoT & Embedded Systems Workshop",
    category: "workshop",
    date: "Jun 18, 2024",
    location: "Maker Space, AWH",
    description: "Hands-on 2-day workshop on Arduino, Raspberry Pi and sensor integration. 60 students built working prototypes by day 2.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
    isUpcoming: false,
    registrationUrl: "",
    eventReport: "60+ students participated, creating smart home and automated watering hardware prototypes."
  }
];

export const initialTeam = [
  // Faculty
  { name: "Jasmine", role: "Nodal Officer", department: "Faculty", image: "https://randomuser.me/api/portraits/women/44.jpg", linkedin: "#", year: "Faculty" },
  { name: "Murali Krishna", role: "Asst. Nodal Officer", department: "Faculty", image: "https://randomuser.me/api/portraits/men/32.jpg", linkedin: "#", year: "Faculty" },
  
  // 2026
  { name: "Abhiraj", role: "Student Lead", department: "S7 CSE", image: "https://randomuser.me/api/portraits/men/45.jpg", linkedin: "#", year: "2026" },
  { name: "Aysha Fathima", role: "Co-Lead", department: "S7 ECE", image: "https://randomuser.me/api/portraits/women/65.jpg", linkedin: "#", year: "2026" },
  { name: "Rahul Menon", role: "Tech Lead", department: "S5 CSE", image: "https://randomuser.me/api/portraits/men/22.jpg", linkedin: "#", year: "2026" },
  { name: "Sneha R", role: "Design Lead", department: "S5 CSE", image: "https://randomuser.me/api/portraits/women/33.jpg", linkedin: "#", year: "2026" },
  { name: "Kevin Jose", role: "Events Lead", department: "S5 ME", image: "https://randomuser.me/api/portraits/men/55.jpg", linkedin: "#", year: "2026" },
  { name: "Maria Thomas", role: "PR & Outreach", department: "S5 ECE", image: "https://randomuser.me/api/portraits/women/55.jpg", linkedin: "#", year: "2026" },
  { name: "Jithin P", role: "Content Lead", department: "S5 CSE", image: "https://randomuser.me/api/portraits/men/67.jpg", linkedin: "#", year: "2026" },
  { name: "Farsana A", role: "Finance & Admin", department: "S5 EEE", image: "https://randomuser.me/api/portraits/women/12.jpg", linkedin: "#", year: "2026" },

  // 2025
  { name: "Arun K", role: "Student Lead", department: "Batch 2025, CSE", image: "https://randomuser.me/api/portraits/men/77.jpg", linkedin: "#", year: "2025" },
  { name: "Nisha M", role: "Co-Lead", department: "Batch 2025, ECE", image: "https://randomuser.me/api/portraits/women/77.jpg", linkedin: "#", year: "2025" },
  { name: "Sreerag V", role: "Tech Lead", department: "Batch 2025, CSE", image: "https://randomuser.me/api/portraits/men/88.jpg", linkedin: "#", year: "2025" },
  { name: "Amina T", role: "Design Lead", department: "Batch 2025, CSE", image: "https://randomuser.me/api/portraits/women/88.jpg", linkedin: "#", year: "2025" },
  { name: "Rohith S", role: "Events Lead", department: "Batch 2025, ME", image: "https://randomuser.me/api/portraits/men/66.jpg", linkedin: "#", year: "2025" },
  { name: "Anjali R", role: "PR & Outreach", department: "Batch 2025, ECE", image: "https://randomuser.me/api/portraits/women/66.jpg", linkedin: "#", year: "2025" },

  // 2024
  { name: "Arjun Nair", role: "Student Lead", department: "Batch 2024, CSE", image: "https://randomuser.me/api/portraits/men/35.jpg", linkedin: "#", year: "2024" },
  { name: "Devika P", role: "Co-Lead", department: "Batch 2024, ECE", image: "https://randomuser.me/api/portraits/women/35.jpg", linkedin: "#", year: "2024" },
  { name: "Fahad K", role: "Tech Lead", department: "Batch 2024, CSE", image: "https://randomuser.me/api/portraits/men/36.jpg", linkedin: "#", year: "2024" },
  { name: "Merina S", role: "Design Lead", department: "Batch 2024, ECE", image: "https://randomuser.me/api/portraits/women/36.jpg", linkedin: "#", year: "2024" }
];

export const initialGallery = [
  { title: "HackSurface 2.0", category: "hackathon", date: "Oct 2024", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80" },
  { title: "HackSurface 2.0 - Teamwork", category: "hackathon", date: "Oct 2024", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80" },
  { title: "Prize Distribution", category: "hackathon", date: "Oct 2024", image: "https://images.unsplash.com/photo-1555374018-13a8994ab246?w=600&q=80" },
  { title: "AWH Bootcamp 2024 - Day 1", category: "bootcamp", date: "Oct 2024", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" },
  { title: "AWH Bootcamp 2024 - Activity", category: "bootcamp", date: "Oct 2024", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" },
  { title: "Founder Stories", category: "talk", date: "Aug 2024", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80" },
  { title: "Founder Stories - Q&A", category: "talk", date: "Aug 2024", image: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=600&q=80" },
  { title: "IoT Workshop", category: "workshop", date: "Jun 2024", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" },
  { title: "IoT Workshop - Prototyping", category: "workshop", date: "Jun 2024", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80" }
];

export const initialAlumni = [
  { name: "Arjun Nair", startup: "GreenSort Technologies", description: "Built an AI-powered waste sorting startup deployed in 3 municipalities in Kerala. Batch of 2021, CSE.", image: "https://randomuser.me/api/portraits/men/36.jpg" },
  { name: "Merina Sebastian", startup: "EduBridge Kerala", description: "Founded an EdTech platform connecting rural students with quality tutors. Raised seed funding through KSUM in 2023. Batch of 2020, ECE.", image: "https://randomuser.me/api/portraits/women/28.jpg" },
  { name: "Fahad K", startup: "AgriSense IoT", description: "Developed low-cost IoT sensors for crop monitoring used by 500+ farmers in Wayanad. IEDC Summit 2022 winner. Batch of 2022, EEE.", image: "https://randomuser.me/api/portraits/men/52.jpg" }
];

export const initialGeneralSettings = {
  nextEventTitle: "HackSurface 3.0",
  nextEventDate: "Jan 2026",
  mission: "To cultivate an entrepreneurial mindset among students through innovation, mentorship, and resource ecosystems that transform ideas into real scalable solutions.",
  vision: "To pioneer AWH Engineering College as the finest hub of bold innovation and the birthplace of world-class technology startups in Kerala."
};
