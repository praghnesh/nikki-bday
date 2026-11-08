// Central configuration file for Nikki's Magical Birthday Universe
// All text, messages, dates, and personal touches can be easily customized here!

export const birthdayData = {
  // Birthday Girl Details
  recipient: {
    name: "Nikki",
    nickname: "Nikki ❤️",
    title: "The Queen of Today 👑",
    birthdayDate: "2026-11-08T00:00:00", // Format: YYYY-MM-DDTHH:mm:ss
    favoriteColors: ["Pastel Pink", "Lavender", "Rose Gold", "Soft Peach"],
  },

  // Section 2: Cinematic Intro Screen
  intro: {
    greeting: "Hey Nikki! ❤️",
    subheading: "Today is not just another day...",
    body: "It's the day someone as special as you came into this world.",
    question: "Are you ready for your little surprise?",
    buttonText: "ENTER MY WORLD ✨",
    quote: "You bring so much warmth, kindness, and magic everywhere you go.",
  },

  // Section 3: Interactive Birthday Gift Box
  giftBox: {
    buttonText: "OPEN YOUR SURPRISE 🎁",
    title: "A Box Full of Sunshine & Magic ✨",
    wishes: [
      "May your day be filled with endless smiles, pure laughter, and all the sweet moments you deserve! 🌸",
      "You deserve the entire universe and every star that shines in it! ⭐",
      "Keep shining your light, Nikki. The world is so much brighter with you in it! 💖",
      "Here is to another year of unforgettable adventures and beautiful memories! 🎂"
    ],
    hiddenMessage: "P.S. You are genuinely one of the most incredible people to ever walk this planet. Don't ever forget how deeply loved and appreciated you are! 💖✨",
    giftItems: [
      { name: "Endless Joy", icon: "✨", desc: "A lifetime subscription to genuine happiness" },
      { name: "Sweet Dreams", icon: "🌙", desc: "Every wish you make under the stars coming true" },
      { name: "Warm Hugs", icon: "🧸", desc: "Unlimited cozy warmth whenever you need it" },
      { name: "Golden Smiles", icon: "🌸", desc: "Moments that make your heart skip a beat" },
    ]
  },

  // Section 6: How Special Are You? (Personality Experience)
  personalityQuiz: {
    title: "How Special Are You, Nikki? ✨",
    subtitle: "A scientific (and 100% accurate!) assessment of your infinite charm",
    questions: [
      {
        id: 1,
        question: "How much does your smile light up a room?",
        options: [
          { text: "More than a million fireworks on New Year's Eve! 🎆", score: 10, trait: "Radiant Sunshine" },
          { text: "Enough to turn any bad day into a magical one ☀️", score: 10, trait: "Heart Warmer" },
          { text: "Brighter than the northern lights 🌌", score: 10, trait: "Celestial Wonder" },
          { text: "So much that flowers literally bloom faster 🌸", score: 10, trait: "Pure Enchantment" },
        ]
      },
      {
        id: 2,
        question: "What makes you happiest on an ordinary afternoon?",
        options: [
          { text: "Cozy drinks, cute music, and peaceful vibes ☕🎶", score: 10, trait: "Peaceful Soul" },
          { text: "Uncontrollable laughing fits with favorite people 😂", score: 10, trait: "Joy Sparker" },
          { text: "Exploring dreamy aesthetics and sweet treats 🍰", score: 10, trait: "Sweet Dreamer" },
          { text: "Knowing that someone I care about is smiling 😊", score: 10, trait: "Angel Energy" },
        ]
      },
      {
        id: 3,
        question: "What is your ultimate dream destination?",
        options: [
          { text: "A lavender-scented cottage in the countryside 🏡💜", score: 10, trait: "Cottagecore Muse" },
          { text: "Under the starlight by a glowing beach shore 🌊✨", score: 10, trait: "Ocean Dreamer" },
          { text: "A fairytale European town with pastries and cobblestones 🥐", score: 10, trait: "Fairytale Spirit" },
          { text: "Anywhere surrounded by endless love and laughter 💖", score: 10, trait: "Golden Heart" },
        ]
      },
      {
        id: 4,
        question: "What superpower do you secretly possess?",
        options: [
          { text: "Making people feel comfortable and safe instantly 🤍", score: 10, trait: "Empath Queen" },
          { text: "Being effortlessly adorable 24/7 🥰", score: 10, trait: "Natural Charmer" },
          { text: "Having the most contagious laugh in history 🌟", score: 10, trait: "Joy Alchemist" },
          { text: "Looking gorgeous without even trying ✨", score: 10, trait: "Stunning Goddess" },
        ]
      },
      {
        id: 5,
        question: "What makes your birthday so extraordinarily special?",
        options: [
          { text: "Because it celebrates the day my favorite soul was born! 🎂", score: 10, trait: "One in a Billion" },
          { text: "It's the annual holiday of pure cuteness and kindness 👑", score: 10, trait: "Living Blessing" },
          { text: "A fresh chapter of dreams coming true 🚀", score: 10, trait: "Destiny Maker" },
          { text: "All of the above multiplied by infinity! ♾️❤️", score: 10, trait: "Universal Treasure" },
        ]
      }
    ],
    resultCertificate: {
      title: "CERTIFICATE OF SUPREME UNIQUENESS 📜✨",
      certifiedTo: "Nikki",
      verdict: "1000% Rare, Magical, and Irreplaceable",
      summary: "Scientific data confirms: Nikki is made of 40% stardust, 30% golden honey laughs, 20% sweetest soul, and 10% pure mischief. Warning: Being around Nikki may cause sudden bursts of genuine happiness!",
      badge: "★ ULTIMATE TREASURE OF THE UNIVERSE ★"
    }
  },

  // Section 7: Secret Envelope & Handwritten Letter
  secretLetter: {
    envelopeTitle: "A Letter from the Heart 💌",
    waxSealText: "N",
    buttonOpen: "OPEN LETTER ✨",
    date: "Today & Forever",
    greeting: "Dearest Nikki,",
    paragraphs: [
      "If I had a single flower for every time you brought a genuine smile to my face, I would walk forever in a never-ending garden.",
      "You have this rare, quiet magic about you — the kind that doesn't need to shout to be felt. You make ordinary moments feel like warm hugs, and tough days feel so much lighter just with your presence.",
      "As you celebrate your birthday today, my biggest wish for you is that life treats you with the same kindness, tenderness, and breathtaking joy that you give out into the world every single day.",
      "May you laugh until your stomach hurts, chase every wild dream without hesitation, and always remember how deeply cherished, celebrated, and loved you are.",
      "Happy Birthday, beautiful soul. The world is a hundred times sweeter with you in it."
    ],
    closing: "With all my fondness and warmest love,",
    signature: "Yours Always ❤️"
  },

  // Section 8: Birthday Cake Celebration
  cake: {
    candleCount: 5,
    instruction: "Click on each glowing flame or tap the button to blow out the candles and make your secret wish!",
    buttonText: "💨 BLOW OUT ALL CANDLES",
    wishPrompt: "Make a wish in your heart, Nikki...",
    wishMadeText: "✨ Your wish is sealed with stardust and destined to come true! ✨",
    cakeFlavors: "Strawberry Champagne & Vanilla Cream with Rose Gold Frosting 🎂"
  },

  // Section 9: Secret Treasure Hunt
  treasureHunt: {
    title: "Nikki's Secret Birthday Quest 🗺️✨",
    subtitle: "Crack the 4 secret clues to unlock the Golden Birthday Vault!",
    levels: [
      {
        level: 1,
        title: "Clue #1: The Star of the Show",
        riddle: "I am five letters long, starts with 'N' and ends with 'I'. She has the sweetest smile and owns today completely. Who is she?",
        hint: "Look in the mirror! It's your lovely name.",
        acceptedAnswers: ["nikki", "nikki❤️", "nikita"],
        solvedMessage: "Spot on! You are indeed the undisputed star of today! 🌟"
      },
      {
        level: 2,
        title: "Clue #2: The Sweetest Celebration",
        riddle: "I have layers, frosting, glowing candles on top, and people sing when I arrive. What am I?",
        hint: "You blow candles on this!",
        acceptedAnswers: ["cake", "birthday cake", "a cake"],
        solvedMessage: "Deliciously right! Save a big slice with extra frosting! 🍰"
      },
      {
        level: 3,
        title: "Clue #3: The Magic Power",
        riddle: "It costs nothing to give, yet it warms any cold day, shows your pearly teeth, and makes everyone around you instantly happier. What is it?",
        hint: "Curved line that sets everything straight.",
        acceptedAnswers: ["smile", "your smile", "a smile", "laughter"],
        solvedMessage: "Yes! Your smile is literally world-class magic. Keep smiling! 😊"
      },
      {
        level: 4,
        title: "Clue #4: The Eternal Promise",
        riddle: "It beats inside you, it has four letters, it starts with 'L', rhymes with 'dove', and it is what everyone feels for you today. What is it?",
        hint: "All you need is...",
        acceptedAnswers: ["love", "pure love"],
        solvedMessage: "Unlocked! You have cracked all four sacred clues! 💖"
      }
    ],
    finalVaultMessage: {
      title: "👑 THE GOLDEN VAULT UNLOCKED 👑",
      tribute: "Congratulations, Detective Nikki! You solved the treasure hunt. But the real treasure was never hidden in a chest — the real treasure in our lives has always been YOU. Happy Birthday! 💎✨"
    }
  },

  // Section 10: Final Birthday Surprise
  finalSurprise: {
    headline: "HAPPY BIRTHDAY NIKKI ❤️",
    subheadline: "May your journey ahead be as breathtaking as your spirit.",
    emotionalTribute: "You are one of those rare, beautiful souls who make the world a little brighter. May every dream come true, every day bring happiness, and every moment give you a reason to smile. Keep being the wonderful, radiant human being you are.",
    wishesList: [
      "365 Days of Pure Bliss 🌸",
      "Endless Success in Everything You Touch 🌟",
      "Unbreakable Peace and Joy 🕊️",
      "Magical Surprise Adventures 🎈"
    ],
    replayButton: "REPLAY THE MAGIC ✨",
    shareLoveButton: "SEND VIRTUAL HUG 🫂💖"
  }
};

