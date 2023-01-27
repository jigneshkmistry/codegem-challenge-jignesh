/**
 * Returns {emoji, color} for a given sentiment score
 * @param sentiment Number
 */
export function emojiAndColorForSentiment(sentiment) {
    switch (sentiment) {
        case 1:
        case 2:
            return {
                color: '#DC3047',
                emoji: '😔',
            };
        case 3:
            return {
                color: '#FFC74A',
                emoji: '😐'
            };
        case 4:
        case 5:
            return {
                color: '#46C895',
                emoji: '😊'
            };
        default:
            return {};
    }
}

export function textForSentiment(sentiment) {
    switch (sentiment) {
        default:
            return '';
        case 1:
            return 'Very Positive';
        case 2:
            return 'Negative';
        case 3:
            return 'Meh';
        case 4:
            return 'Positive';
        case 5:
            return 'Very Positive';
    }
}
