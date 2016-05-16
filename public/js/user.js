(function($) {

	var refresh_table = function () {
        $( "table#DataTab" ).load( window.location.href +" table#DataTab" );
    };


	var delete_user = function($mail){
		var url ='/user/delete/' + $mail.parents("tr").children().first().text();
		var posting = $.post( url, '' );
        posting.done(function( data ) {
        	refresh_table();
    		//if(data.message) 
           		//$('div > .error-message',$form).text(data.message);
           	//else if(data.redirect)
           		//window.location.href = data.redirect;

        });
    };


})(jQuery);