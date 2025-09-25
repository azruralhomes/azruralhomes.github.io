async function init() {
    markCurrent('contact');
    resizeHeader();

    emailjs.init({
              publicKey: "T6NncZswpsqKexUJC",
            });

    document.getElementById('contact_form').addEventListener('submit', function (event) {
        console.log('submitted')
        event.preventDefault();

        /**
        let fields = ['user_name', 'user_email', 'input_area]

        for (let i = 0; i < 2; i++) {
            let field = document.getElementById(fields[i]);

            if (field.value === '') {
                field.style.border = "thick solid #bb2024";
                field.placeholder = "required field"
                console.log('invalid ' + fields[i] + " element.")
                return;
            }
        }
         */

        emailjs.sendForm('service_revwqmc', 'template_p3140au', this)
            .then(() => {
                console.log('send SUCCESS!');
                alert("Email Sent!")
                window.location.reload();
            }, (error) => {
                console.log('send FAILED...', error);
                alert("Send failed, please try again later. ")
            });
    });
}