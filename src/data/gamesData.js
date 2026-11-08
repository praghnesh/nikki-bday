// Data & Configurations for all 12 Birthday Arcade Games

export const arcadeGamesList = [
  {
    id: "catch-hearts",
    title: "Catch The Hearts",
    icon: "❤️",
    tagline: "Move your basket & catch falling love!",
    difficulty: "Easy",
    category: "Action",
    color: "from-pink-400 to-rose-500",
    description: "Catch the falling hearts, grab golden stars for mega bonus points, and avoid broken hearts!"
  },
  {
    id: "memory-match",
    title: "Memory Match",
    icon: "🧠",
    tagline: "Pair up the birthday charms!",
    difficulty: "Medium",
    category: "Puzzle",
    color: "from-purple-400 to-indigo-500",
    description: "Flip over 16 magical cards and find all 8 matching pairs with the fewest moves."
  },
  {
    id: "balloon-pop",
    title: "Balloon Pop",
    icon: "🎈",
    tagline: "Pop balloons to unveil Nikki's sweet photos & notes!",
    difficulty: "Relaxing",
    category: "Casual",
    color: "from-amber-400 to-pink-500",
    description: "Floating colorful party balloons featuring Nikki! Pop them to reveal heartfelt sweet notes & photo surprises."
  },
  {
    id: "guess-word",
    title: "Guess The Word",
    icon: "🔤",
    tagline: "Decode Nikki's secret birthday keywords!",
    difficulty: "Medium",
    category: "Word",
    color: "from-teal-400 to-pink-400",
    description: "Test your wits! Guess the hidden birthday words letter by letter with helpful clues."
  },
  {
    id: "birthday-quiz",
    title: "Nikki's Birthday Quiz",
    icon: "📝",
    tagline: "10 fun questions about the Queen!",
    difficulty: "Easy",
    category: "Trivia",
    color: "from-violet-400 to-pink-500",
    description: "10 hilarious and sweet multiple-choice questions celebrating Nikki's one-of-a-kind personality."
  },
  {
    id: "hidden-heart",
    title: "Find The Hidden Hearts",
    icon: "💗",
    tagline: "Spot the camouflaged hearts before time runs out!",
    difficulty: "Challenging",
    category: "Seek & Find",
    color: "from-rose-400 to-amber-400",
    description: "Search across an enchanted birthday dreamscape to spot all hidden glowing hearts."
  },
  {
    id: "tic-tac-toe",
    title: "Hearts vs Stars",
    icon: "❌⭕",
    tagline: "The classic duel of wits!",
    difficulty: "Medium",
    category: "Strategy",
    color: "from-pink-400 to-purple-600",
    description: "Play as Hearts (💖) against Computer's Stars (⭐) in a magical pastel Tic-Tac-Toe arena."
  },
  {
    id: "whack-a-mole",
    title: "Whack-A-Cutie",
    icon: "🐹",
    tagline: "Tap the cute bunnies before they burrow!",
    difficulty: "Fast-Paced",
    category: "Arcade",
    color: "from-amber-400 to-rose-400",
    description: "Cute birthday mascots pop up from pastel burrows! Tap them quickly to rack up points."
  },
  {
    id: "candy-catch",
    title: "Birthday Candy Catch",
    icon: "🍬",
    tagline: "Collect cupcakes & dodge storm clouds!",
    difficulty: "Action",
    category: "Arcade",
    color: "from-rose-400 to-fuchsia-500",
    description: "Catch delicious cupcakes, strawberries, and candies into your dessert tray while avoiding clouds!"
  },
  {
    id: "scratch-card",
    title: "Scratch To Reveal",
    icon: "🪙",
    tagline: "Scratch the foil to unveil secret wishes!",
    difficulty: "Interactive",
    category: "Surprise",
    color: "from-yellow-400 to-amber-600",
    description: "Realistic interactive scratch card! Use mouse or finger to scratch off the golden shimmer."
  },
  {
    id: "memory-challenge",
    title: "Crystal Simon Says",
    icon: "🔮",
    tagline: "Repeat the musical glowing crystal rhythm!",
    difficulty: "Hard",
    category: "Memory",
    color: "from-cyan-400 to-purple-500",
    description: "Listen to and watch the glowing crystal sequence, then repeat it note for note!"
  }
];

// Balloon Pop Compliments
export const balloonCompliments = [
  "Your smile lights up the room brighter than a thousand stars! ✨",
  "You have the kindest, most generous heart in the universe. 💖",
  "May this year bring you twice the happiness you give others! 🌸",
  "You are effortlessly stylish, witty, and wonderful! 👑",
  "The world is undeniably better with you in it! 🌍❤️",
  "Your laugh is literally the sweetest sound ever! 🎶",
  "May every dream you hold in your heart come true! 🌟",
  "Never forget how truly irreplaceable you are! 💎",
  "Sending you an infinite supply of hugs & happiness today! 🧸",
  "You deserve all the sweet treats and warm coffee in the world! 🍰☕",
  "You're not just a year older, you're a year more fabulous! 💅",
  "Keep blooming into the breathtaking soul you are! 🌺"
];

// Surprise Wheel Slices
export const wheelSlices = [
  { id: 1, text: "Queen For A Day 👑", color: "#FF69B4", reward: "You have full veto power over everything today! Everyone must treat you like royal royalty!" },
  { id: 2, text: "Secret Wish Granted ✨", color: "#BA55D3", reward: "Close your eyes, count to 3, and make a secret wish. The cosmos promises to conspire in your favor!" },
  { id: 3, text: "Sweet Dessert Pass 🍰", color: "#FFA07A", reward: "Token for unlimited birthday cake, pastries, and ice cream with zero guilt allowed!" },
  { id: 4, text: "Hilarious Dance Dare 💃", color: "#9370DB", reward: "You must stand up right now and do your best 5-second victory wiggle! No excuses!" },
  { id: 5, text: "Compliment Shower 🌸", color: "#FFB6C1", reward: "You are smart, gorgeous, incredibly thoughtful, hilarious, and universally adored!" },
  { id: 6, text: "Infinite Hugs Pass 🫂", color: "#20B2AA", reward: "Redeemable for 100 warm, cozy bear hugs whenever you need a boost!" },
  { id: 7, text: "Karaoke Spotlight 🎤", color: "#FF6347", reward: "Sing the chorus of your favorite feel-good song right now with pure passion!" },
  { id: 8, text: "Grand Cosmic Blessing ⭐", color: "#FFD700", reward: "A 365-day shield of good fortune, radiant health, and unforgettable joy!" }
];

// Word Guessing Game Data
export const wordGuessingWords = [
  { word: "SUNSHINE", hint: "What you bring into everyone's life every single day ☀️", difficulty: "Easy" },
  { word: "BIRTHDAY", hint: "The special event we are celebrating today! 🎂", difficulty: "Easy" },
  { word: "MAGICAL", hint: "The best word to describe your energy and spirit ✨", difficulty: "Medium" },
  { word: "PRINCESS", hint: "Your official royal status today and always 👑", difficulty: "Medium" },
  { word: "GORGEOUS", hint: "How you look 24/7 without even trying 💖", difficulty: "Medium" },
  { word: "LAUGHTER", hint: "The sweetest melody you share with the world 🎶", difficulty: "Hard" },
  { word: "IRREPLACEABLE", hint: "How unique and rare you truly are 💎", difficulty: "Hard" }
];

// Birthday Quiz 10 Questions
export const birthdayQuizQuestions = [
  {
    id: 1,
    question: "Who is the absolute Queen of the Universe today?",
    options: ["Beyonce", "Nikki ❤️", "The Queen of England", "Wonder Woman"],
    correct: 1,
    explanation: "Obviously Nikki! Nobody else even comes close today! 👑"
  },
  {
    id: 2,
    question: "What is Nikki's official superpower?",
    options: [
      "Invisibility",
      "Flying like Superman",
      "Making everyone smile effortlessly with her warmth",
      "Eating pizza in 2 seconds"
    ],
    correct: 2,
    explanation: "True fact: A 3-second conversation with Nikki can boost morale by 500%!"
  },
  {
    id: 3,
    question: "What should Nikki's birthday cake be topped with?",
    options: ["Extra candles", "Sparkles and love", "Golden sprinkles", "All of the above!"],
    correct: 3,
    explanation: "All of the above! And an extra bucket of delicious frosting! 🎂"
  },
  {
    id: 4,
    question: "If Nikki was a season, which one would she be?",
    options: [
      "Spring — fresh blooms, pastel colors, and warm sunshine 🌸",
      "Summer — vibrant energy and bright beach days ☀️",
      "Autumn — cozy sweaters, warm drinks, and golden leaves 🍂",
      "All seasons combined into one masterpiece ✨"
    ],
    correct: 0,
    explanation: "Spring! Because you bring life, color, and gentle warmth everywhere you go!"
  },
  {
    id: 5,
    question: "What happens when Nikki laughs?",
    options: [
      "Angels high-five in heaven",
      "Bad vibes immediately evaporate",
      "Everyone around can't help but smile too",
      "All of the above! 💖"
    ],
    correct: 3,
    explanation: "Scientifically proven: Nikki's laugh is the most contagious joyous sound ever recorded!"
  },
  {
    id: 6,
    question: "What is the recommended prescription for Nikki on her birthday?",
    options: [
      "100% pampering and zero work",
      "Favorite snacks and delicious drinks",
      "Lots of love, hugs, and laughter",
      "Unlimited pampering & all the love in the universe"
    ],
    correct: 3,
    explanation: "Doctor's orders: Queen Nikki must only do things that spark pure joy today!"
  },
  {
    id: 7,
    question: "How many compliments does Nikki deserve today?",
    options: ["10", "100", "1,000", "Infinity and beyond 🚀"],
    correct: 3,
    explanation: "Calculators broke trying to count how many compliments Nikki deserves! ♾️"
  },
  {
    id: 8,
    question: "If Nikki had a personalized emoji, what would it look like?",
    options: ["👑✨💖 (Queen with sparkle heart)", "😴 (Sleepy head)", "🦖 (Dinosaur)", "🤖 (Robot)"],
    correct: 0,
    explanation: "Pure royalty, infinite sparkles, and boundless love!"
  },
  {
    id: 9,
    question: "What is Nikki's best aesthetic quality?",
    options: [
      "Her stunning eyes",
      "Her radiant warm smile",
      "Her impeccable style",
      "Her whole breathtaking vibe"
    ],
    correct: 3,
    explanation: "The entire package is breathtakingly gorgeous!"
  },
  {
    id: 10,
    question: "What is the universe's ultimate plan for Nikki this year?",
    options: [
      "A year filled with endless good news",
      "Deep peace, high achievements, and great adventures",
      "Being surrounded by people who adore her",
      "An absolutely legendary, unforgettable year! 🌟"
    ],
    correct: 3,
    explanation: "This year is going to be your most extraordinary chapter yet! Happy Birthday, Nikki! 🎉"
  }
];

// Scratch Card Secret Messages
export const scratchCards = [
  {
    id: "card-1",
    theme: "Rose Gold Elegance",
    title: "Card #1: The Soul Oracle 🌸",
    hiddenTitle: "A Cosmic Truth Just For You ✨",
    hiddenMessage: "You possess a gentle strength and heart so pure that anyone who knows you is blessed. May you walk through this year with head held high, knowing you are deeply cherished!",
    badge: "👑 QUEEN NIKKI 👑"
  },
  {
    id: "card-2",
    theme: "Lavender Dreams",
    title: "Card #2: The Golden Birthday Coupon 🎟️",
    hiddenTitle: "Universal Wish Pass ✨",
    hiddenMessage: "This official token entitles Nikki to 1 UNCONDITIONAL WISH granted by destiny! Make it big, make it bold, and trust that you deserve every ounce of it!",
    badge: "⭐ WISH APPROVED ⭐"
  },
  {
    id: "card-3",
    theme: "Pastel Sunshine",
    title: "Card #3: Secret Love Note 💌",
    hiddenTitle: "A Warm Little Whisper 💖",
    hiddenMessage: "No matter where life takes you or how many candles go on your cake, you will always be that radiant, sweet, irreplaceable Nikki who makes life truly magical.",
    badge: "💖 ALWAYS & FOREVER 💖"
  }
];

