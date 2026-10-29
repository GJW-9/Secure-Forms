const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

if (signupForm){
    signupForm.addEventListener('submit', async(e)=>{
        e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const verifypassword = document.getElementById('verifypassword').value;

    if(password !==verifypassword)return alert('Passwords do not match');

    const res= await fetch(`/api/signup`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email, username, password})

    });
    const data= await res.json();

    if (!res.ok) return alert(data.error);

    localStorage.setItem('token', data.token);
    location.href= '/User/Submission.html';

});

}

if(signinForm){
    signinForm.addEventListener('submit', async(e)=>{
        e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const res = await fetch(`/api/signin`, {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username,password})
    });
const data = await res.json();
if(! res.ok) return alert(data.error);

localStorage.setItem('token', data.token);
location.href= '/User/Submission.html';
});

}


    