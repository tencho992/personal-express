const submitAnswerButton = document.querySelectorAll('.submitAnswer');
const trash = document.getElementsByClassName('fa-trash');

submitAnswerButton.forEach(function (element) {
  element.addEventListener('click', function () {
    const answerTextarea = this.parentNode.parentNode.querySelector('textarea[name="answer"]');
    const answer = answerTextarea.value;
    const name = this.parentNode.parentNode.querySelector('span:nth-child(1)').innerText;
    const msg = this.parentNode.parentNode.querySelector('span:nth-child(2)').innerText;

    fetch('/messages/answer', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        msg: msg,
        
        ansr: answer
      })
    })
      .then(response => {
        if (response.ok) return response.json();
      })
      .then(data => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.querySelector('span:nth-child(1)').innerText;
    const msg = this.parentNode.parentNode.querySelector('span:nth-child(2)').innerText;

    fetch('/messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        msg: msg
      })
    })
      .then(function (response) {
        if (response.ok) {
          window.location.reload();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
