const cat = document.getElementById("cats")
const dog = document.getElementById("dogs")
const catPicsLen = 10
const dogPicsLen = 10

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

setInterval(function(){ 
  const index = getRandomInt(catPicsLen);
  cat.setAttribute("src", `/images/cute/cat-${index}.png`)
  dog.setAttribute("src", `/images/cute/dog-${index}.png`)
}, 2000);
