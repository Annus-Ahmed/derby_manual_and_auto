export const business = {
  name: "DERBY MANUAL & AUTO",
  legalName: "A1 Driving Academy Ltd",
  tagline: "Learn with Confidence. Drive with Freedom.",
  phone: "0333 789 0089",
  phoneHref: "tel:+443337890089",
  textPhone: "07970 327609",
  email: "info@a1drivingacademy.co.uk",
  address: "36 Joseph Street, Derby, DE23 8QH",
  hours: "Monday–Sunday, 9am–8pm",
  areas: ["Derby", "Nottingham", "Leicester", "Burton-upon-Trent"],
  approved: process.env.NEXT_PUBLIC_BUSINESS_APPROVED === "true",
  source: "https://a1drivingacademy.co.uk/",
  // Only exact business-owned profile URLs found in the source audit belong here.
  socials: [
    {
      name: "Facebook",
      url: "https://m.facebook.com/A1DrivingSchoolDerbyOfficial",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/a1drivingacademyderby/",
    },
    { name: "Twitter / X", url: "https://twitter.com/A1DrivingAcade1" },
    { name: "YouTube", url: "https://www.youtube.com/c/A1DrivingAcademy" },
    { name: "TikTok", url: "https://vm.tiktok.com/ZMeFgUE7E/" },
    {
      name: "WhatsApp",
      url: "https://api.whatsapp.com/send?phone=%2B447935431662&text=Hi%2CNeed+Help%28+A1+Driving+website%29",
    },
  ],
};
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const courses = [
  {
    slug: "manual-lesson",
    name: "Manual lessons",
    label: "Manual Driving Lessons",
    tag: "THE CLASSIC ROUTE",
    description:
      "Get comfortable with the gears. Build control, road awareness and the confidence to take the wheel.",
    detail:
      "Work through clutch control, smooth gear changes, junctions, manoeuvres and independent driving. Tell us what you have already practised so we can discuss the right starting point.",
    image: "photo-1449965408869-eaa3f722e40d",
    price: "Request hourly price",
  },
  {
    slug: "automatic-lesson",
    name: "Automatic lessons",
    label: "Automatic Driving Lessons",
    tag: "KEEP IT SIMPLE",
    description:
      "Less to think about. More room to focus on the road and enjoy your learning journey.",
    detail:
      "With no clutch pedal or manual gear changes, you can focus on observation, positioning and planning. Ask about automatic lesson availability in your area.",
    image: "photo-1503376780353-7e6692767b70",
    price: "Request hourly price",
  },
  {
    slug: "crash-courses",
    name: "Intensive courses",
    label: "Intensive Driving Courses",
    tag: "FIND YOUR MOMENTUM",
    description:
      "Make learning your focus with a concentrated course shaped around your experience.",
    detail:
      "Discuss your experience, theory preparation and availability with the team. Course length and pace are agreed individually; a test date or pass is never guaranteed.",
    image: "photo-1464822759023-fed622ff2c3b",
    price: "Ask for a tailored quote",
  },
];
export const photo = (id: string, _w = 1400) => `/images/${id}.jpg`;
export const faqs = [
  [
    "Which lesson type should I choose?",
    "Tell us about your experience and preferences. We can discuss manual, automatic or an intensive course before you decide.",
  ],
  [
    "Is my lesson confirmed when I submit a request?",
    "No. The team will review your preferred details and contact you to confirm availability, price and arrangements.",
  ],
  [
    "Can I request a particular pick-up location?",
    "Yes. Include your postcode and preferred meeting place in your request. The team will confirm whether it can be accommodated.",
  ],
  [
    "Can I find out about current prices and packages?",
    "Absolutely. Ask for a current quote before committing. Lesson prices, package conditions and instructor availability will be confirmed directly.",
  ],
  [
    "Do you offer refresher lessons?",
    "You can enquire about refresher lessons using the booking form. Include the skills or situations you would like to work on.",
  ],
];
