let again;

do{

console.log(
    "MENU\n"+
    "1. Idly -  10$\n"+
    "2. Dosa - 12$\n"+
    "3. Roti - 12$\n"+
    "4. Kuska - 10$\n"+
    "5. Chicken 65 - 15$\n"
);

let item = Number(prompt("Enter the item number (1-5):" + 
    "MENU\n"+
    "1. Idly -  10$\n"+
    "2. Dosa - 12$\n"+
    "3. Roti - 12$\n"+
    "4. Kuska - 10$\n"+
    "5. Chicken 65 - 15$\n"));

let amountInput = prompt("Enter the amount of money you have:");
let amount = Number(amountInput);

if(item >=1 && item <= 5 && Number.isInteger(item)){
    if (
        amountInput === null ||
        amountInput.trim() === ""||
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > 10e3
    ) {
        alert("Invalid amount! Please enter a valid, non-negative number.");
    } else {
        console.log("Selected item number: " + item);
        console.log("Amount you have: " + amount + "$");
        chng();
    }
}else{
    alert("Invalid item number! Please select a number between(1-5)")
}

function chng(){
    let  price;
        if(item == 1){
            price = 10;
        }
        else if(item == 2){
            price = 12;
        }
        else if(item == 3){
            price = 12;
        }
        else if(item == 4){
            price = 10;
        }
        else{
            price = 15;
        }
            if(amount < price || isNaN(amount)){
                    alert("You don't have sufficient balance!");
                }
                else{
                    let change = amount - price;
                    //alert("Your change is " + change + "$\n");
                    alert([
                    `Selected item: ${item}`,
                    `Price: ${price}$`,
                    `You had: ${amount}$`,
                    `Your change: ${change}$`
                    ].join("\n")
                    );
                    for (let i =3; i >= 1;i--){
                        console.log(i);
                    }
                    alert("Purchase was sucessful");
                    for(let i = 1; i <= item; i++){
                        let pattern ="";
                        for(let j = 1; j <= i; j++){
                            pattern += j + " ";
                        }
                        console.log(pattern);
                    }
                }
                again = confirm("Do you want to make another purchase?");
}

}while(again ? true : false);

alert("Thank you for visiting!");

