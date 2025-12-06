// Liste des mots géants à afficher aléatoirement
export const wordsList = [
  "CREATE",
  "DESIGN",
  "DEVELOP",
  "INNOVATE",
  "EXPLORE",
  "IMAGINE",
  "BUILD",
  "CRAFT",
  "EVOLVE",
  "DREAM",
  "INSPIRE",
  "SHAPE",
  "TRANSFORM",
  "VISION",
  "FUTURE",
  "DIGITAL",
  "PASSION",
  "GENIUS",
  "ARTISTRY",
  "MASTERY"
];

// Fonction pour obtenir un mot aléatoire différent du précédent
export const getRandomWord = (previousWord?: string): string => {
  let newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  
  // Éviter de répéter le même mot
  while (newWord === previousWord && wordsList.length > 1) {
    newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  }
  
  return newWord;
};