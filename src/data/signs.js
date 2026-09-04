export const signs = [
  { id: 'hello', term: 'Hello', category: 'Greetings', emoji: '👋🏼', handShape: '👋🏼', motion: 'Side-to-side', representation: 'Waving hand greeting', meaning: 'A friendly greeting.', example: 'Use Hello when starting a conversation.', description: 'A warm greeting to start a conversation.' },
  { id: 'good-morning', term: 'Good Morning', category: 'Greetings', emoji: '🌅☝️', handShape: '☝️', motion: 'Upward from chest', representation: 'Sunrise + pointing up', meaning: 'A greeting used early in the day.', example: 'Say Good Morning when you meet someone before noon.', description: 'Greet someone at the start of the day.' },
  { id: 'thank-you', term: 'Thank You', category: 'Everyday Communication', emoji: '🤲→👋', handShape: '🤲', motion: 'Forward & outward', representation: 'Open palms moving away', meaning: 'An expression of appreciation.', example: 'Use Thank You after receiving help.', description: 'Show appreciation with an open palm.' },
  { id: 'please', term: 'Please', category: 'Everyday Communication', emoji: '🤲↻', handShape: '🤲', motion: 'Circular rotation', representation: 'Palms circling on chest', meaning: 'A polite request.', example: 'Add Please when asking for water.', description: 'A polite request or invitation.' },
  { id: 'sorry', term: 'Sorry', category: 'Everyday Communication', emoji: '✊→❤️', handShape: '✊', motion: 'To the heart', representation: 'Fist touching heart', meaning: 'An apology or expression of regret.', example: 'Use Sorry when you need to repair a misunderstanding.', description: 'Express an apology with care.' },
  { id: 'yes', term: 'Yes', category: 'Everyday Communication', emoji: '☝️↓', handShape: '☝️', motion: 'Up & down nod', representation: 'Finger nodding like head', meaning: 'An affirmative response.', example: 'Use Yes to confirm an answer.', description: 'A clear affirmative response.' },
  { id: 'no', term: 'No', category: 'Everyday Communication', emoji: '✋👈👉', handShape: '✋', motion: 'Side-to-side shake', representation: 'Hand waving left & right', meaning: 'A negative response.', example: 'Use No to politely decline.', description: 'A clear negative response.' },
  { id: 'a', term: 'A', category: 'Alphabet', emoji: '✊', handShape: '✊', motion: 'Static hold', representation: 'Closed fist (A-shape)', meaning: 'The first letter of the alphabet.', example: 'Spell a name beginning with A.', description: 'Practice the handshape for the letter A.' },
  { id: 'b', term: 'B', category: 'Alphabet', emoji: '✋', handShape: '✋', motion: 'Static hold', representation: 'Open hand (B-shape)', meaning: 'The second letter of the alphabet.', example: 'Spell a name beginning with B.', description: 'Practice the handshape for the letter B.' },
  { id: 'one', term: 'One', category: 'Numbers', emoji: '☝️', handShape: '☝️', motion: 'Static hold', representation: 'Single finger raised', meaning: 'The number one.', example: 'Use One when counting a single item.', description: 'Count and share quantities.' },
  { id: 'two', term: 'Two', category: 'Numbers', emoji: '✌️', handShape: '✌️', motion: 'Static hold', representation: 'Two fingers extended', meaning: 'The number two.', example: 'Use Two when counting a pair.', description: 'Count and share quantities.' },
  { id: 'water', term: 'Water', category: 'Food & Drinks', emoji: '🤌→👅', handShape: '🤌', motion: 'To the mouth', representation: 'Pinched fingers touch lips', meaning: 'A drink essential for daily needs.', example: 'Use Water when asking for a drink.', description: 'A useful sign for daily needs.' },
  { id: 'food', term: 'Food', category: 'Food & Drinks', emoji: '🤲→👅', handShape: '🤲', motion: 'To the mouth', representation: 'Open hand to lips', meaning: 'Something we eat.', example: 'Use Food when talking about a meal.', description: 'Talk about meals and nourishment.' },
  { id: 'school', term: 'School', category: 'School', emoji: '🤲⟷', handShape: '🤲', motion: 'Back & forth', representation: 'Palms facing (teaching)', meaning: 'A place for learning.', example: 'Use School when describing where you study.', description: 'Talk about learning and classes.' },
  { id: 'help', term: 'Help', category: 'Emergency', emoji: '👐↑', handShape: '👐', motion: 'Upward', representation: 'Open hands raised up', meaning: 'A request for support.', example: 'Use Help when you need assistance.', description: 'Ask for support when you need it.' },
  { id: 'stop', term: 'Stop', category: 'Emergency', emoji: '✋', handShape: '✋', motion: 'Static hold', representation: 'Open palm facing out', meaning: 'A firm request to pause.', example: 'Use Stop to set a clear boundary.', description: 'Set a clear boundary or pause.' },
  { id: 'doctor', term: 'Doctor', category: 'Emergency', emoji: '☝️→💪', handShape: '☝️', motion: 'To the arm', representation: 'Finger pointing to pulse', meaning: 'A medical professional.', example: 'Use Doctor when asking for medical care.', description: 'A helpful sign in health conversations.' },
]

export const learningCategories = ['Greetings', 'Everyday Communication', 'Alphabet', 'Numbers', 'Food & Drinks', 'School', 'Emergency']

export const lessons = [
  { title: 'Everyday greetings', meta: '6 signs · 12 min', progress: 72, color: 'coral' },
  { title: 'Expressing needs', meta: '8 signs · 18 min', progress: 38, color: 'blue' },
  { title: 'Health & safety', meta: '10 signs · 24 min', progress: 0, color: 'gold' },
]

export const textSignDictionary = signs
  .filter((sign) => ['hello', 'thank-you', 'yes', 'no', 'please', 'help', 'stop', 'water'].includes(sign.id))
  .map((sign) => ({
    ...sign,
    demonstration: 'Placeholder demonstration: add an educator-reviewed ISL image or video here.',
  }))

export const frequentPhrases = [
  { phrase: 'Please help', category: 'School', sequence: ['Please', 'Help'] },
  { phrase: 'Help please', category: 'Hospital', sequence: ['Help', 'Please'] },
  { phrase: 'Water please', category: 'Restaurant', sequence: ['Water', 'Please'] },
  { phrase: 'No thank you', category: 'Shopping', sequence: ['No', 'Thank You'] },
  { phrase: 'Hello', category: 'Travel', sequence: ['Hello'] },
  { phrase: 'Help stop', category: 'Emergency', sequence: ['Help', 'Stop'] },
]
