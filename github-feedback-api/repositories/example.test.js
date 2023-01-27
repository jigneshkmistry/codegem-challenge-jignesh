require('dotenv').config();

describe('Sample Test', () => {
    it('addition works', () => {
        expect(1 + 1).toBe(2);
    });

    it('substraction works', async () => {
        expect(4 - 1).toBe(3);
    });
});
