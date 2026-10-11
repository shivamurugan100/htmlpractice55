let again;

do{

let number = Number(prompt("Enter a number:"));

if(number%2 === 0){
    alert("The number is even");

    for(let r=1;r<=number;r++){
        let pattern ="";
        for(let s=1;s<=r;s++){
            pattern +="* ";
        }
        console.log(pattern);
    }
}
else{
    alert("The number is odd");

    let pattern = "";
    for (let x = 1; x <= number; x++) {
            for (let y = 1; y <= number; y++) {
                pattern += "*"
            }
            pattern=pattern+"\n"
        } 
        console.log(pattern);     
}

function mul(){
    for(let i=1;i<11;i++){
       console.log(number*i);
    }
}
mul()

function sum(){
   let total = 0;
   for(let j=1; j<=number; j++){
    total += j;
   }
   alert("The total is: " + total);
}
sum()

again = confirm("Do you want to run the program again?");

}while(again);

alert("Thank you for visiting!");
