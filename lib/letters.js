// Mock data for demonstration
const mockLetters = [
  {
    id: "1",
    title: "A letter from Apr 20, 2025",
    content:
      "Dear future self,\n\nI hope you're doing well. I'm writing this letter to remind you of the goals we set for ourselves this year. Remember how excited we were about learning new skills and taking on new challenges?\n\nBy the time you read this, I hope you've made progress on our list:\n\n1. Learn to play the guitar\n2. Read at least 20 books\n3. Run a half marathon\n4. Start that side project we've been thinking about\n\nEven if you haven't accomplished everything, I hope you're proud of the progress you've made. Remember, it's about the journey, not just the destination.\n\nStay curious and keep growing!",
    deliveryDate: new Date("2025-05-13"),
    isPublic: true,
    attachments: [
      {
        id: "a1",
        name: "goals-notebook.jpg",
        type: "image/jpeg",
        url: "/notebook-goals.png",
        size: 1024 * 1024 * 2.3, // 2.3 MB
      },
      {
        id: "a2",
        name: "yearly-schedule.pdf",
        type: "application/pdf",
        url: "#",
        size: 1024 * 512, // 512 KB
      },
      {
        id: "a3",
        name: "progress-tracker.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "#",
        size: 1024 * 256, // 256 KB
      },
    ],
  },
  {
    id: "2",
    title: "Reflections on the past year",
    content:
      "As I look back on the past year, I'm amazed at how much has changed. I've grown in ways I never expected and learned valuable lessons along the way.\n\nThe challenges I faced taught me resilience and patience. The victories, both big and small, reminded me of my strength and capabilities.\n\nI'm grateful for the people who stood by me, offering support and encouragement when I needed it most. Their kindness and generosity made all the difference.\n\nAs I look ahead to the coming year, I'm filled with hope and excitement. There's so much to look forward to, so many new experiences to embrace.\n\nHere's to another year of growth, learning, and joy!",
    deliveryDate: new Date("2025-06-27"),
    isPublic: true,
    attachments: [],
  },
  {
    id: "3",
    title: "Happy Birthday!",
    content:
      "I wanted to wish you a happy birthday in advance! I hope your day is filled with joy, laughter, and all the things that make you happy.\n\nAnother year older, another year wiser. May this new chapter of your life bring you even more happiness and success than the last.\n\nTake some time to celebrate yourself today. You deserve it!\n\nHappy Birthday!",
    deliveryDate: new Date("2025-06-15"),
    isPublic: true,
    attachments: [
      {
        id: "a4",
        name: "birthday-cake.jpg",
        type: "image/jpeg",
        url: "/colorful-birthday-cake.png",
        size: 1024 * 1024 * 1.5, // 1.5 MB
      },
      {
        id: "a5",
        name: "birthday-playlist.mp3",
        type: "audio/mpeg",
        url: "#",
        size: 1024 * 1024 * 5.2, // 5.2 MB
      },
    ],
  },
  {
    id: "4",
    title: "Project Ideas for Next Quarter",
    content:
      "Here are some project ideas I've been thinking about for next quarter:\n\n1. Mobile app for tracking daily habits\n2. E-commerce platform for local artisans\n3. Community forum for tech enthusiasts\n4. Educational platform for coding beginners\n\nI think the mobile app has the most potential, but I'm open to exploring all options. Let's discuss these ideas in our next meeting and decide which one to pursue.",
    deliveryDate: new Date("2025-07-10"),
    isPublic: false,
    attachments: [
      {
        id: "a6",
        name: "project-notes.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        url: "#",
        size: 1024 * 320, // 320 KB
      },
      {
        id: "a7",
        name: "budget-estimates.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "#",
        size: 1024 * 180, // 180 KB
      },
      {
        id: "a8",
        name: "wireframes.zip",
        type: "application/zip",
        url: "#",
        size: 1024 * 1024 * 3.7, // 3.7 MB
      },
      {
        id: "a9",
        name: "notebook-goals.png",
        type: "application/png",
        url: "#",
        size: 1024 * 1024 * 2.1, // 2.1 MB
      },
    ],
  },
]

export async function getLetterById(id) {
  // In a real app, this would fetch from an API or database
  return mockLetters.find((letter) => letter.id === id) || null
}

export async function getPublicLetters() {
  // In a real app, this would fetch from an API or database
  return mockLetters.filter((letter) => letter.isPublic)
}

export async function getMyLetters() {
  // In a real app, this would fetch from an API based on the user's wallet
  return mockLetters.filter((letter) => !letter.isPublic)
}
