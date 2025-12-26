function vowel(str){
     let cnt = 0;
     for(let i = 0; i < str.length; i++){
          let c = str[i];
          if(c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u'){
               cnt++;
          }
     }
     return cnt;
}
const arrowVowel = (str) => {
     let cnt = 0;
     for(let i = 0; i < str.length; i++){
          let c = str[i];
          if(c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u'){
               cnt++;
          }
     }
     return cnt;
}
let cnt = vowel("Nihal Dwivedi");
console.log("Number of vowels in string : ", cnt);