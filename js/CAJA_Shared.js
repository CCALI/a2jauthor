/*
 	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Shared GUI/IO
	12/12/2012
	04/15/2013

	Required by Author and Viewers

*/


function dialogAlert(args)
{  // args.title = dialog title, args.message = message body
   if (typeof args === "string"){
		args={message:args};
	}
   if (args.title===null){
		args.title="Alert";
	}
   var $d=$( "#dialog-confirm" );
   $d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.message+'</p>');
   $d.dialog({
      title: args.title,
      resizable: false,
      width: 350,
      height:250,
      modal: true,
      buttons: {
          OK: function() {
              $( this ).dialog( "close" );
          }
      }
   });
}


/* */
