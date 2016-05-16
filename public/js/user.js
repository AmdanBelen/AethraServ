(function($) {

	function refresh_table() {
        $( "table#DataTab" ).load( window.location.href +" table#DataTab" );
    };


	function delete_user($mail){
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