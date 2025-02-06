// Fetch the text file
fetch('corpus.txt')
    .then(response => response.text())
    .then(text => {
        // Create RiTa markov model
        let markov = RiTa.markov(3);
        
        // Load the text into the model
        markov.addText(text);
        
        // Generate and display sentences
        const outputDiv = document.getElementById('output');
        for (let i = 0; i < 1; i++) {
            const sentence = markov.generate();
            const p = document.createElement('p');
            p.textContent = sentence;
            outputDiv.appendChild(p);
        }
    })
    .catch(error => console.error('Error loading text:', error));