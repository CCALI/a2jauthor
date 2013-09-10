/* jquery.xml.min.js  */
jQuery.fn.xml=function(all){var s="";if(this.length)
(((typeof all!='undefined')&&all)?this:jQuery(this[0]).contents()).each(function(){s+=window.ActiveXObject?this.xml:(new XMLSerializer()).serializeToString(this);});return s;};

/* */