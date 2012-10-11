/*	CALI Author 5 - CAJA Authoring Full HTML Editor 
 	03/30/2012 
*/

$(document).ready(function () {
   // Everything loaded, execute.
   lang.set('en');


   // Declare TinyMCE Editor options
   // Notice: The simple theme does not use all options some of them are limited to the advanced theme
   tinyMCE.init({
      theme: "advanced",
      //theme_advanced_toolbar_location : "top",
      //theme_toolbar_location : "top",
      theme_advanced_toolbar_location: "external",
      theme_advanced_layout_manager: 'SimpleLayout',
      //mode : "none",

      //	plugins: "autoresize",//8/3/12 SJG hid the progress spinner - too distracting

      theme_advanced_buttons1: "cut,copy,paste,undo,redo,separator,bold,italic,underline,separator,sub,sup,separator,justifyleft,justifycenter,separator,bullist,numlist,blockquote,separator,outdent,separator,indent,separator,link,image,charmap,spellchecker,separator",
      theme_advanced_buttons2: "",
      theme_advanced_buttons3: "",
      //theme_advanced_buttons1 : "separator,insertdate,inserttime,preview,zoom,separator,forecolor,backcolor",
      //theme_advanced_buttons2 : "bullist,numlist,separator,outdent,indent,separator,undo,redo,separator",
      //theme_advanced_buttons3 : "hr,removeformat,visualaid,separator,sub,sup,separator,charmap"

      // 8/2/12 SJG Keep underline as U rather than text-decoration
      inline_styles: false,
      formats: {
         underline: { inline: 'u', exact: true }
      },
      //http://www.tinymce.com/wiki.php/Configuration:valid_elements
      valid_elements: "@[id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|"
	+ "onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|"
	+ "onkeydown|onkeyup],a[rel|rev|charset|hreflang|tabindex|accesskey|type|"

      // 8/2/12 SJG CSS simple: U is underline, B is bold, i it italics, not emphasis.
	+ "name|href|target|title|class|onfocus|onblur],b/strong,i/em,strike,u,"
      //	+ "name|href|target|title|class|onfocus|onblur],strong/b,em/i,strike,u,"
	+ "#p,-ol[type|compact],-ul[type|compact],-li,br,img[longdesc|usemap|"
	+ "src|border|alt=|title|hspace|vspace|width|height|align],-sub,-sup,"
	+ "-blockquote,-table[border=0|cellspacing|cellpadding|width|frame|rules|"
	+ "height|align|summary|bgcolor|background|bordercolor],-tr[rowspan|width|"
	+ "height|align|valign|bgcolor|background|bordercolor],tbody,thead,tfoot,"
	+ "#td[colspan|rowspan|width|height|align|valign|bgcolor|background|bordercolor"
	+ "|scope],#th[colspan|rowspan|width|height|align|valign|scope],caption,-div,"
	+ "-span,-code,-pre,address,-h1,-h2,-h3,-h4,-h5,-h6,hr[size|noshade],-font[face"
	+ "|size|color],dd,dl,dt,cite,abbr,acronym,del[datetime|cite],ins[datetime|cite],"
	+ "object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width"
	+ "|height|src|*],script[src|type],map[name],area[shape|coords|href|alt|target],bdo,"
	+ "button,col[align|char|charoff|span|valign|width],colgroup[align|char|charoff|span|"
	+ "valign|width],dfn,fieldset,form[action|accept|accept-charset|enctype|method],"
	+ "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value],"
	+ "kbd,label[for],legend,noscript,optgroup[label|disabled],option[disabled|label|selected|value],"
	+ "q[cite],samp,select[disabled|multiple|name|size],small,"
	+ "textarea[cols|rows|disabled|name|readonly],tt,var,big"

   });
});
