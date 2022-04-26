// TextStatistics.js
// Christopher Giffard (2012)
// 1:1 API Fork of TextStatistics.php by Dave Child (Thanks mate!)
// https://github.com/DaveChild/Text-Statistics
// converted to DefineMap for A2J-Author in 2021

// thoughts: the atoms are letterCount, wordCount, and sentenceCount
// sentenceCount currently gets confused by Mrs., Mr., U.K. and other dotted abbreviations
// cleanText was being called before each function which changed answers for re-cleaned text (no manual requirement)

import DefineMap from 'can-define/map/map'

const TextStatistics = DefineMap.extend({
  cleanText (text) {
    // all these tags should be preceded by a full stop.
    const fullStopTags = ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd']

    fullStopTags.forEach(function (tag) {
      text = text.replace('</' + tag + '>', '.')
    })

    text = text
      .replace(/<[^>]+>/g, '') // Strip tags
      //  below replace messes up numbers aka 10,000 for word counts,
      // TODO: should likely just set to '' instead of ' '
      // .replace(/[,:;()\-]/, ' ') // Replace commas, hyphens etc (count them as spaces)
      .replace(/[.!?]/g, '.') // Unify terminators
      .replace(/^\s+/, '') // Strip leading whitespace
      .replace(/[ ]*(\n|\r\n|\r)[ ]*/, ' ') // Replace new lines with spaces
      .replace(/([.])[. ]+/g, '.') // Check for duplicated terminators
      .replace(/[ ]*([.])/, '. ') // Pad sentence terminators
      .replace(/\s+/, ' ') // Remove multiple spaces
      .replace(/\s+$/, '') // Strip trailing whitespace

    const hasFinalTerminator = text[text.length - 1] === '.' ||
      text[text.length - 1] === '?' ||
      text[text.length - 1] === '!'

    if (!hasFinalTerminator) {
      text += '.' // Add final terminator
    }

    return text
  },

  fleschKincaidReadingEase (text) {
    return Math.round((206.835 - (1.015 * this.averageWordsPerSentence(text)) - (84.6 * this.averageSyllablesPerWord(text))) * 10) / 10
  },

  fleschKincaidGradeLevel (text) {
    // Flesch-Kincaid grade level formula: 0.39 x (words/sentences) + 11.8 x (syllables/words) - 15.59.
    return Math.round(((0.39 * this.averageWordsPerSentence(text)) + (11.8 * this.averageSyllablesPerWord(text)) - 15.59) * 10) / 10
  },

  gunningFogScore (text) {
    return Math.round(((this.averageWordsPerSentence(text) + this.percentageWordsWithThreeSyllables(text, false)) * 0.4) * 10) / 10
  },

  colemanLiauIndex (text) {
    // from https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index
    // CLI = 0.0588L - 0.296S - 15.8
    // where L is avg # of letters/100 words and S is avg # of sentences/100 words
    const letterCount = this.letterCount(text)
    const wordCount = this.wordCount(text)
    const sentenceCount = this.sentenceCount(text)
    const L = (letterCount / wordCount) * 100
    const S = (sentenceCount / wordCount) * 100
    // return Math.round(((5.89 * (this.letterCount(text) / this.wordCount(text))) - (0.3 * (this.sentenceCount(text) / this.wordCount(text))) - 15.8) * 10) / 10
    const CLI = (0.0588 * L) - (0.296 * S) - 15.8
    const roundedToTenths = Math.round(CLI * 10) / 10

    return roundedToTenths
  },

  smogIndex (text) {
    return Math.round(1.043 * Math.sqrt((this.wordsWithThreeSyllables(text) * (30 / this.sentenceCount(text))) + 3.1291) * 10) / 10
  },

  automatedReadabilityIndex (text) {
    return Math.round(((4.71 * (this.letterCount(text) / this.wordCount(text))) + (0.5 * (this.wordCount(text) / this.sentenceCount(text))) - 21.43) * 10) / 10
  },

  textLength (text) {
    return text.length
  },

  letterCount (text) {
    text = text.replace(/[^a-z]+/ig, '')
    return text.length
  },

  sentenceCount (text) {
    // Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
    return text.replace(/[^.!?]/g, '').length || 1
  },

  wordCount (text) {
    return text.match(/[^\s]+/g).length || 1
  },

  averageWordsPerSentence (text) {
    return this.wordCount(text) / this.sentenceCount(text)
  },

  averageSyllablesPerWord (text) {
    let syllableCount = 0
    const wordCount = this.wordCount(text)
    const self = this

    text.split(/\s+/).forEach(function (word) {
      syllableCount += self.syllableCount(word)
    })

    // Prevent NaN...
    return (syllableCount || 1) / (wordCount || 1)
  },

  wordsWithThreeSyllables (text, countProperNouns) {
    let longWordCount = 0
    const self = this

    countProperNouns = countProperNouns !== false

    text.split(/\s+/).forEach(function (word) {
      // We don't count proper nouns or capitalised words if the countProperNouns attribute is set.
      // Defaults to true.
      if (!word.match(/^[A-Z]/) || countProperNouns) {
        if (self.syllableCount(word) > 2) longWordCount++
      }
    })

    return longWordCount
  },

  percentageWordsWithThreeSyllables (text, countProperNouns) {
    return (this.wordsWithThreeSyllables(text, countProperNouns) / this.wordCount(text)) * 100
  },

  syllableCount (word) {
    let syllableCount = 0
    let prefixSuffixCount = 0
    let wordPartCount = 0

    // Prepare word - make lower case and remove non-word characters
    word = word.toLowerCase().replace(/[^a-z]/g, '')

    // Specific common exceptions that don't follow the rule set below are handled individually
    // Array of problem words (with word as key, syllable count as value)
    const problemWords = {
      simile: 3,
      forever: 3,
      shoreline: 2
    }

    // Return if we've hit one of those...
    if (problemWords.hasOwnProperty(word)) return problemWords[word]

    // These syllables would be counted as two but should be one
    const subSyllables = [
      /cial/,
      /tia/,
      /cius/,
      /cious/,
      /giu/,
      /ion/,
      /iou/,
      /sia$/,
      /[^aeiuoyt]{2,}ed$/,
      /.ely$/,
      /[cg]h?e[rsd]?$/,
      /rved?$/,
      /[aeiouy][dt]es?$/,
      /[aeiouy][^aeiouydt]e[rsd]?$/,
      /^[dr]e[aeiou][^aeiou]+$/, // Sorts out deal, deign etc
      /[aeiouy]rse$/ // Purse, hearse
    ]

    // These syllables would be counted as one but should be two
    const addSyllables = [
      /ia/,
      /riet/,
      /dien/,
      /iu/,
      /io/,
      /ii/,
      /[aeiouym]bl$/,
      /[aeiou]{3}/,
      /^mc/,
      /ism$/,
      /([^aeiouy])\1l$/,
      /[^l]lien/,
      /^coa[dglx]./,
      /[^gq]ua[^auieo]/,
      /dnt$/,
      /uity$/,
      /ie(r|st)$/
    ]

    // Single syllable prefixes and suffixes
    const prefixSuffix = [
      /^un/,
      /^fore/,
      /ly$/,
      /less$/,
      /ful$/,
      /ers?$/,
      /ings?$/
    ]

    // Remove prefixes and suffixes and count how many were taken
    prefixSuffix.forEach(function (regex) {
      if (word.match(regex)) {
        word = word.replace(regex, '')
        prefixSuffixCount++
      }
    })

    wordPartCount = word
      .split(/[^aeiouy]+/ig)
      .filter(function (wordPart) {
        return !!wordPart.replace(/\s+/ig, '').length
      })
      .length

    // Get preliminary syllable count...
    syllableCount = wordPartCount + prefixSuffixCount

    // Some syllables do not follow normal rules - check for them
    subSyllables.forEach(function (syllable) {
      if (word.match(syllable)) syllableCount--
    })

    addSyllables.forEach(function (syllable) {
      if (word.match(syllable)) syllableCount++
    })

    return syllableCount || 1
  }
})

export default TextStatistics
