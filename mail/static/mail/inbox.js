document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

   // Show compose view and hide other views
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'block';


   // Clear out composition fields
   document.querySelector('#compose-recipients').value = '';
   document.querySelector('#compose-subject').value = '';
   document.querySelector('#compose-body').value = '';

   document.querySelector('#compose-form').onsubmit = () => {
     fetch('/emails', {
       method: 'POST',
       body: JSON.stringify({
         recipients: document.querySelector('#compose-recipients').value,
         subject: document.querySelector('#compose-subject').value,
         body: document.querySelector('#compose-body').value
       })
     })
         .then(response => response.json())
         .then(result => {
            if (result["error"]) {
            document.querySelector('#message').innerHTML = result["error"];
            document.querySelector('.alert').style.display = 'block';
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          }
        else {
          document.querySelector('.alert').style.display = 'none';
          load_mailbox('sent')
        }
      });

    return false;
   };
}

function show_emails(emails) {
  for (let i = 0; i < emails.length; i++) {
    console.log(emails[i].id);
    const element = document.createElement('div');
    element.className = 'email-display';
    element.innerHTML = `
       <div style="display: flex;">
        <div>${emails[i].sender.bold()}</div>
        <div class="topic">${emails[i].subject}</div>
        <div class="time">${emails[i].timestamp}</div>
       </div>
    `;

    // Add post to DOM
    document.querySelector('#emails-view').appendChild(element);
  }
}

function load_mailbox(mailbox) {
  // Showing mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // Fetching emails
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    if (emails.length === 0) {
      // No emails in inbox
      document.querySelector('#emails-view').innerHTML += `Woohoo! You've read all of your emails!`;
    } else {
      show_emails(emails);
    }
  });
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

}

