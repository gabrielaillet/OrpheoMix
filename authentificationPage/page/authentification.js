document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const pseudo = document.getElementById('pseudoSignup').value;
    const password = document.getElementById('passwordSignup').value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, password }),
    });

    const message = await response.text();
    alert(message);
});



document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    //const pseudo = document.getElementById('pseudoLogin').value;
    const password = document.getElementById('passwordLogin').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //body: JSON.stringify({ pseudo, password })
        body: JSON.stringify({ password})
    })
    .then(response => {
        if (response.ok) {
            // Redirection if authentification succeeded
            window.location.href = '/index.html';  
        } else {
            alert('Login failed: Invalid credentials');
        }
    })
    .catch(error => console.error('Error:', error));
    //const message = await response.text();
    //alert(message);
});
