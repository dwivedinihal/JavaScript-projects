// document.getElementsByName("Box");
// document.getElementById("start");
// document.querySelector('.my');
let h1 = document.querySelector("h1");
console.log(h1.innerText);
h1.innerText = h1.innerText + " From Nihal Dwivedi\n";

let divs = document.querySelectorAll(".Box");
let idx = 1;
for(div of divs){
     div.innerText = `New Div ${idx}`;
     idx++;
}

// divs[0].innerText = "New Div 1";