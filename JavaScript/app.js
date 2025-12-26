let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

// generate the computer choices
const getCompChoice = () => {
     let options = ["rock", "scissors", "paper"];
     let ridx = Math.floor(Math.random() * 3);
     return options[ridx];
};

const drawGame = () => {
     msg.innerText = "Draw game, Play again";
     msg.style.backgroundColor = "#172e48ff";
}

const showWinner = (userWin, userChoice, compChoice) => {
     if(userWin){
          userScore++;
          userScorePara.innerText = userScore;
          msg.innerText = `YOU WIN ! Your ${userChoice} beats ${compChoice}`;
          msg.style.backgroundColor = "green";
     }
     else{
          compScore++;
          compScorePara.innerText = compScore;
          msg.innerText = `COMP WIN ! Comp ${compChoice} beats ${userChoice}`;
          msg.style.backgroundColor = "red";
     }
};

const playGame = (userChoice) => {
     const compChoice = getCompChoice();

     if(userChoice == compChoice){
          drawGame();
     }
     else{
          let userWin = true;
          if(userChoice === "rock"){
               userWin = compChoice === "paper" ? false : true;
          }
          else if(userChoice === "scissors"){
               userWin = compChoice === "rock" ? false : true;
          }
          else{
               userWin = compChoice === "scissors" ? false : true;
          }
          showWinner(userWin, userChoice, compChoice);
     }
};

choices.forEach((choice) =>{
     choice.addEventListener("click", () => {
          const userChoice = choice.getAttribute("id");
          playGame(userChoice);
     });
});

