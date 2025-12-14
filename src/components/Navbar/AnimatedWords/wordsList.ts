// Liste des mots géants à afficher aléatoirement
export const wordsList = [
  "CREATE",
  "DESIGN",
  "DEVELOP",
  "EXPLORE",
  "IMAGINE",
  "BUILD",
  "CRAFT",
  "EVOLVE",
  "DREAM",
  "INSPIRE",
  "SHAPE",
  "VISION",
  "FUTURE",
  "DIGITAL",
  "PASSION",
  "GENIUS",
  "ARTISTRY",
  "MASTERY",
  "DEVOPS"
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