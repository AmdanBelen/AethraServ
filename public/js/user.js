(function($) {

	$("form.no-reload").submit(function( event ) {
        event.preventDefault();
        var $form = $( this ),
        //term = $form.find( "input[name='s']" ).val(),
        url = $form.attr( "action" );
        var posting = $.post( url, $form.serialize() );
        posting.done(function( data ) {
        	if(data.error)
        		$form.reset();
    		if(data.message) 
           		$('div > .error-message',$form).text(data.message);
           	else if(data.redirect)
           		window.location.href = data.redirect;
           	refresh_table();

        });
    });

	function refresh_table() {
		var $table =  $( "table#DataTab" );
       $table.load( window.location.href +" table#DataTab" );
    };

     $("table#DataTab #delete").on("click", delete_user($(this).parents("tr").children().first().text()));

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

})(jQuery);