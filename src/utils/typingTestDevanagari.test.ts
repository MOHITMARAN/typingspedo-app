import test from 'node:test';
import assert from 'node:assert';

test('Hindi Typing Test Devanagari Word Preservation', async (t) => {
  await t.test('Devanagari words with attached matras remain intact when tokenized by word', () => {
    const hindiSample = 'कार में बैठकर प्रातःकाल यात्रा की';
    const tokens = hindiSample.split(' ');

    assert.deepStrictEqual(tokens, ['कार', 'में', 'बैठकर', 'प्रातःकाल', 'यात्रा', 'की']);
    
    // Check that combining vowel signs (matras) are glued to their consonants:
    // 'कार' consists of क (U+0915) + ा (U+093E) + र (U+0930)
    assert.strictEqual(tokens[0], 'कार');
    assert.strictEqual(tokens[0].length, 3);
    assert.strictEqual(tokens[0].charCodeAt(0), 0x0915); // क
    assert.strictEqual(tokens[0].charCodeAt(1), 0x093e); // ा (aa matra)
    assert.strictEqual(tokens[0].charCodeAt(2), 0x0930); // र

    // Verify word matching prefixes work with Devanagari combining characters
    assert.strictEqual('कार'.startsWith('क'), true);
    assert.strictEqual('कार'.startsWith('का'), true);
    assert.strictEqual('कार'.startsWith('कार'), true);
  });

  await t.test('Test mode preserves complex ligatures and half-forms in words', () => {
    const complexWords = 'प्रशासनिक दृष्टिकोण न्यायपालिका स्वतंत्रता';
    const tokens = complexWords.split(' ');

    assert.strictEqual(tokens.length, 4);
    assert.strictEqual(tokens[0], 'प्रशासनिक');
    assert.strictEqual(tokens[1], 'दृष्टिकोण');
    assert.strictEqual(tokens[2], 'न्यायपालिका');
    assert.strictEqual(tokens[3], 'स्वतंत्रता');
  });
});
