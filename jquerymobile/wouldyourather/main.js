$(document).ready(function(){

    var choices = [
        {
            a : 'Apple',
            b : 'microsoft'
        },
        {
            a : 'Eten',
            b : 'Drinken'
        },
        {
            a : 'Hertog jan',
            b : 'Jupiler'
        },
        {
            a : 'Alex',
            b : 'Jia Yun'
        },
        {
            a : 'IK',
            b : 'mezelf'
        }
    ];

    function refresh(){
        $('#btn-a').text(choices[0].a);
        $('#btn-b').text(choices[0].b);

        document.location.href = "#home";
    }

    refresh();

    var choice;

    $('.btn').on('click',function(){
        var choice = $(this).text();
        $('#user-choice').text(choice);

    });

    $('.next').on('click',function(){
        if(choices.length > 1){
            choices.shift();
            refresh();
        }else{
            document.location.href = "#enddialog"
        }



    });


});
