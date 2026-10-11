do{
    let nam = window.prompt("enter your name");
    let num,numb,nums;

        do {
                num = window.prompt("Enter your Subject 1 mark");

                if (Number(num) < 0 || Number(num) > 100) {
                    alert("Invalid mark! Enter a number between 0 and 100.");
                } else {
                    num = Number(num);
                    break;
                }
            } while (true);

            do {
                numb = window.prompt("Enter your Subject 2 mark");

                if (Number(numb) < 0 || Number(numb) > 100) {
                    alert("Invalid mark! Enter a number between 0 and 100.");
                } else {
                    numb = Number(numb);
                    break;
                }
            } while (true);

            do {
                nums = window.prompt("Enter your Subject 3 mark");

                if (Number(nums) < 0 || Number(nums) > 100) {
                    alert("Invalid mark! Enter a number between 0 and 100.");
                } else {
                    nums = Number(nums);
                    break;
                }
            } while (true);

        function total(){
            return num+numb+nums;
        }

        function avg(){
            return total()/3;
        }

        alert("Name:\u00A0"+nam+"\n"+
        "Subject1:\u00A0"+num +"\n"+
        "Subject2:\u00A0"+numb+ "\n"+
        "Subject3:\u00A0"+nums+ "\n"+
        "Total:\u00A0"+total()+ "\n"+
        "Average:\u00A0"+avg().toFixed(2)+"\n"
        );

        if(avg()>=90){
            alert("Your Grade is Grade A");
        }
        else if(avg()>=75){
            alert("Your Grade is Grade B");
        }
        else if(avg()>=50){
            alert("Your Grade is Grade C");
        }
        else{
            alert("Your Grade is Grade F");
        }

}while(window.confirm("Do you want to confirm another student's details"));

