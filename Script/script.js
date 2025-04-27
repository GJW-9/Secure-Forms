const readline= require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
        function signup(){
      readline.question('Enter email here: ', (email)=>{
            if (!email.includes('@')) {
                console.log('Please enter a valid email address');
                return signup();
            }
            readline.question('Your username: ', (username)=> {
                if (username.length < 3) {
                    console.log('Username must be at least 3 characters long');
                    return signup();
                } 
                readline.question('Password here: ', (password)=> {
                    const passwordError= validatePassword(password);
                    if (passwordError) {
                        console.log(passwordError);
                        return signup;
                    }
                    readline.question('Verify password: ', (verifyPassword)=> {
                        if (password !== verifypassword) {
                            console.log('Passwords do not match');
                            return signup();
                        }
                    console.log('Successful!', {email,username});
                    readline.close();
                    });
                });
            });
      });
    }
    signup();  
 