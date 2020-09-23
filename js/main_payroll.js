function ValidateEmail(text)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(text.match(mailformat)) return true;
    else return false;

}
jQuery(function($){

    $('.refer-form button[type="submit"]').on('click', function(e) {
        e.preventDefault();
        var parent_form=$(this).closest('form');
        var refer_text=$(parent_form).find('textarea').val();

        // If emails list is empty
        if(refer_text.trim().length==0){
            $(parent_form).find('.error-text').html('Please enter email(s) addresses.');
        }else if(refer_text.trim().length>0 && refer_text.trim().length<=1000){

            var emails=refer_text;

            if(refer_text.includes(',')){
                emails=refer_text.split(',');

            }else if(refer_text.includes(';')){
                emails=refer_text.split(';');
            }else emails=refer_text.split(/\r?\n/);

            if(emails.length>0){
                //array of not valid emails
                var invalid_emails=[];

                emails= emails.filter(function (el) {
                    return el.trim().length>0;
                });
                // Validate emails
                for(var i=0; i<emails.length; i++){
                    if(!ValidateEmail(emails[i]))
                        invalid_emails.push(emails[i]);
                }

                //If have invalid emails
                if(invalid_emails.length>0){
                    var msg="Please provide valid e-mail addresses: ";
                    for(var i=0; i<invalid_emails.length; i++){
                        msg+="'"+invalid_emails[i]+"'";
                        if(i<invalid_emails.length-1) msg+=",";
                    }
                    msg+=".";
                    $(parent_form).find('.error-text').html(msg);
                }else{  //if no invalid emails


                    //Check if emails <= 3
                    if(emails.length<=3){
                        //if all is ok
                        $(parent_form).find('.error-text').html('');


                    }else{

                        $(parent_form).find('.error-text').html("Please enter up to 3 emails.");
                    }

                }
            }

           // console.log(emails);
        }


    });

    $('.story-form button[type="submit"]').on('click', function(e){
        e.preventDefault();
        if($(this).hasClass('disabled')) return false;
        var form_data=$(this).closest('form').serialize();
        var parent_form=$(this).closest('form');


        var story_text=$(parent_form).find('textarea').val();
        //console.log(story_text);

        var lang=$('.wpml-ls-current-language .wpml-ls-native').attr('lang');
        if(story_text.trim().length==0){

            if(lang=="en") $(parent_form).find('.msg').addClass('error-text').text('Story is a mandatory.');
            else $(parent_form).find('.msg').addClass('error-text').text('L\'histoire est obligatoire.');

        }else if(story_text.trim().length<100){

            if(lang=="en") $(parent_form).find('.msg').addClass('error-text').text('Provide at least 100 chars for your story.');
            else $(parent_form).find('.msg').addClass('error-text').text('Fournissez au moins 100 caractères pour votre histoire.');

        }else{


            $.ajax({
                url: _wpUtilSettings.ajax.url,
                type: 'POST',
                data: 'action=tell_story&'+form_data,
                beforeSend: function(){

                    $(parent_form).find('button').addClass("disabled");
                    $(parent_form).find('button .refresh-icn').css('display', 'inline-flex');


                },
                success: function( data ) {
                    $(parent_form).find('button .refresh-icn').css('display', 'none');

                    $(parent_form).find('button').removeClass("disabled");


                    var jsonData = JSON.parse(data);
                    console.log(jsonData);
                    //if all is ok
                    if(jsonData['status'])
                    {
                        $(parent_form).find('.msg').removeClass('error-text');
                        $(parent_form).find('.msg').addClass('success-text').text(jsonData['msg']);
                        $(parent_form).find('textarea').attr('disabled',true);
                        $(parent_form).find('button').remove();
                    }else
                    {
                        //not ok

                        $(parent_form).find('.msg').addClass('error-text').text(jsonData['msg']);

                    }



                }
            });
        }//end else

    });

    $('.leaderboard-archive a.lined-btn').click(function(){
        var offset_items=$(".leaderboard-archive .leaderboard-items .leaderboard-item").length;
        var btn_text=$('.leaderboard-archive a.lined-btn span').text();
        if(!$(this).hasClass('disabled') && offset_items<=200) {
            $.ajax({
                url: _wpUtilSettings.ajax.url,
                type: 'POST',
                data: 'action=get_leaders&leaders_offset='+offset_items+'&leaders_total=10',
                beforeSend: function(){
                    $('.leaderboard-archive a.lined-btn').addClass("disabled");
                    $('.leaderboard-archive a.lined-btn span').html("");
                    $('.leaderboard-archive a.lined-btn i').css("display","inline-block");
                },
                success: function( data ) {

                    $('.leaderboard-archive a.lined-btn').removeClass("disabled");
                    $('.leaderboard-archive a.lined-btn span').html(btn_text);
                    $('.leaderboard-archive a.lined-btn i').css("display","none");

                    var jsonData = JSON.parse(data);
                    if(jsonData.length==0||jsonData.length<10) $('.leaderboard-archive a.lined-btn').remove();
                    for (var i = 0; i < jsonData.length; i++) {
                        var child_leader='<li class="leaderboard-item">\n' +
                            '                    <div class="leaderboard-item--wrap">\n' +
                            '                        <span class="leaderboard-item--number">'+jsonData[i].position+'</span>\n' +
                            '                        <img src="'+jsonData[i].ava+'" alt="" class="leaderboard-item-avatar">\n' +
                            '                        <span class="leaderboard-item--username">'+jsonData[i].name+'</span>\n' +
                            '                        <span class="leaderboard-item--points">'+jsonData[i].points+'</span>\n' +
                            '                    </div>\n' +
                            '                </li>';
                        $(".leaderboard-archive .leaderboard-items:not(.individual-leaderboard)").append(child_leader);

                    }
                    offset_items=$(".leaderboard-archive .leaderboard-items .leaderboard-item").length;
                    if(offset_items>=200) $('.leaderboard-archive a.lined-btn').remove();

                }
            });
        }

        return false;
    });
});