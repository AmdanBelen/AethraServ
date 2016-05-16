(function($) {

	function refresh_table() {
		var $table =  $( "table#DataTab" );
       $table.load( window.location.href +" table#DataTab" );
       $('#delete',$table).on("click", delete_user($(this).parents("tr").children().first().text()));
    };


	function delete_user(mail){
		console.log(mail);
		var url ='/api/user/delete/' + mail;
		var posting = $.post( url, '' );
        posting.done(function( data ) {
        	refresh_table();
    		//if(data.message) 
           		//$('div > .error-message',$form).text(data.message);
           	//else if(data.redirect)
           		//window.location.href = data.redirect;

        });
    };
     $("form input#save").on("click", refresh_table());

})(jQuery);