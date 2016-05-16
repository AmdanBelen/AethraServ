(function($) {

	$("form.no-reload").submit(function( event ) {
        event.preventDefault();
        var $form = $( this );
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

    $("form.no-reload").on("reset",function( event ) {
        var $form = $(this);
        $("input[name='username']",$form).prop('disabled', false);
     	$("input[name='password']",$form).prop('disabled', false);
     	$("input[name='password']",$form).prop('required', true)
    });

	function refresh_table() {
		var $table =  $( "table#DataTab" );
       $table.load( window.location.href +" table#DataTab" );
    };

    $( document ).on( "click", "table#DataTab #delete",  function(event){
     	var mail = $(this).parents("tr").children().first().text();
     	delete_user(mail);
 	});

	$( document ).on( "click", "table#DataTab #edit",  function(event){
     	var $data = $(this).parents("tr").children();
     	var $form = $('form.no-reload');
     	$("input[name='username']",$form).prop('disabled', true);
     	$("input[name='password']",$form).prop('disabled', true);
     	$("input[name='username']",$form).val($data.eq(0).text());
     	$("input[name='password']",$form).removeAttr('value');
     	$("input[name='password']",$form).prop('required',false);
     	$("input[name='firstName']",$form).val($data.eq(1).text());
     	$("input[name='lastName']",$form).val($data.eq(2).text());
     	$("input[name='permission']",$form).val($data.eq(3).text());
 	});

	function delete_user(mail){
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