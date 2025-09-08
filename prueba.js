function orderFrequency(text) {
    const frequency = {};
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (frequency[c] === undefined) {
            frequency[c] = 1;
        } else {
            frequency[c]++;
        }
    }
    const dup = [];
    for (const c in frequency) {
        if (frequency.hasOwnProperty(c)) {
            dup.push({ char: c, count: frequency[c] });
        }
    }
    for (let i = 0; i < dup.length; i++) {
        for (let j = 0; j < dup.length - 1; j++) {
            if (dup[j].count < dup[j + 1].count) {
                const temp = dup[j];
                dup[j] = dup[j + 1];
                dup[j + 1] = temp;
            }
        }
    }
    let result = '';
    for (let i = 0; i < dup.length; i++) {
        const count = dup[i].count || 0;  
        for (let j = 0; j < count; j++) {
            result += dup[i].char;
        }
    }
    return result;
}

console.log(orderFrequency("helloaaa"));  
