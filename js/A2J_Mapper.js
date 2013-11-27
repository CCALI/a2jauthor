
/******************************************************************************
	A2J_Mapper.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Mapper
	04/2012
	04/15/2013

	Uses a simple DOM based map with DIVs for text and lines.
	TODO - replace with CANVAS/SVG flowcharter.
******************************************************************************/

//var gGuide;

var gMapperScale=1.0;
var gMapSize= 1 ; //0 is small, 1 is normal


/** @const */ var GRID_MAP =  {x : 10 , y : 10 };
/** @const */ //var GRID_MAP =  {x : 50 , y : 20 };
/** @const */ var NODE_SIZE = {w : 150, h : 36+8};

function lineV(left,top,height)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:2px;height:'+height+'px;"></div>';
}
function lineH(left,top,width)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:'+width+'px;height:2px;"></div>';
}

function mapLines()
{
	var NW=NODE_SIZE.w;
	var NH=NODE_SIZE.h;
	var $map = $('.map');
	$('.branch, .line',$map).remove();
	var p;
	for (p in gGuide.pages)
	{
		/** @type TPage */
		var page=gGuide.pages[p];
		if (page.mapx!==null)
		{
			var nodeLeft=page.mapx;
			var nodeTop= page.mapy;
			//var downlines=false;
			/* Outgoing branches to show:  
					A2J - Buttons with Destination, Script GOTOs
					CA - Next page, Feedback branches, Script GOTOs
			*/
			var b;
			//if (!page.hasOwnProperty('mapBranches'))
			//{
				var branches=[];
				for (b in page.buttons)
				{
					var btn = page.buttons[b];
					branches.push({text:btn.label, dest: gGuide.pages[btn.next]} );
				}
				page.mapBranches=branches;
			//}
			//var nodeCenterX = nodeLeft + NW/2;
			var nBranches=page.mapBranches.length;
			var boffset =   NW/nBranches/2;
			for (b in page.mapBranches)
			{
				var branch = page.mapBranches[b];
				var branchX=nodeLeft + b/nBranches*NW+boffset;
				var branchTop= nodeTop + NH;
				if (typeof branch.dest!=="undefined")
				{
					//var dy=(branchTop+destTop)/2;//
					var dy=(nBranches-parseInt(b,10))*4;
					var destX = branch.dest.mapx+NW/2;
					var destTop = branch.dest.mapy;
					var x1 = branchX;	var y1 = branchTop;
					var x2 = x1;		var y2 = y1 + 10  + dy;
					var x3,y3,x4,y4;
					if (destTop>nodeTop+NH+16)
					{
						x3 = destX;	y3 = y2;
						x4 = x3;		y4 = destTop - 10  ;
						if (destX<x1 ) {x2=destX;x3=x1;} else {x2=x1;x3=destX;}
						$map.append( lineV(x1,y1,y2-y1) + lineH(x2,y2,x3-x2)+  lineV( x4,y3, y4-y3));
					}
					else
					{
						x3 = (x2 + destX)/2; y3 = y2;
						x4 = x3;		y4 = destTop - 10 ;
						var x5 = destX;// var y5=y4;
						$map.append( lineV(x1,y1,y2-y1) + ( (x2<x3) ? lineH(x2,y2,x3-x2):lineH(x3,y2,x2-x3)) +  lineV( x4,y4, y3-y4) 
							+ ( (x4<x5) ? lineH(x4,y4,x5-x4):lineH(x5,y4,x4-x5)) );
					}
				}
				// $(".map").append('<div class="branch" rel="'+branch.dest+'" style="left:'+(branchLeft)+'px; top:'+branchTop+'px; width:'+branchWidth+'px;">'+branch.text+'</div>');
			}
		}
	}
	//trace('widths:',$map.css('width'),$map.width(),$map.innerWidth());
	//$map.width($map.width()+100).height($map.height()+100);
	//	$('.branch',$map).click(function(){focusNode($('.map > .node[rel="'+$(this).attr('rel')+'"]'));	});
}
function showPageOnMap()
{	// TODO 
	//var target=$(this).attr('target');
}

function buildMap()
{	// Contruct mapper flowcharts.
	var $map = $('.map');
	$map.empty();
	//$('.MapViewer').removeClass('big').addClass(gMapSize==1 ? 'big':'');
	/*
	if (gMapSize==0)
	{	// Render only boxes, no lines
		// Could be used for students but need to remove popups and add coloring.
		var YSC=.15;// YScale
		var XSC=.1 ;
		for (var p in book.pages)
		{
			var page=book.pages[p];
			if (page.mapbounds != null)
			{
				var nodeLeft=XSC*parseInt(page.mapbounds[0]);
				var nodeTop=YSC*parseInt(page.mapbounds[1]);
				$(".map").append(''
					+'<div class="node tiny" rel="'+page.mapid+'" style="left:'+nodeLeft+'px;top:'+nodeTop+'px;"></div>'
					//+'<span class="hovertip">'+page.name+'</span>'
				);
			}
		}
	}*/

	var p;
	var page;
	// Snap to grid
	for (p in gGuide.pages)
	{
		page=gGuide.pages[p];
		if (page.mapx!==null) 
		{
			page.mapx=Math.round(1+page.mapx / GRID_MAP.x)*GRID_MAP.x;
			page.mapy=Math.round(1+page.mapy / GRID_MAP.y)*GRID_MAP.y;
		}
	}
	
	// Full size boxes with question names and simple lines connecting boxes.
	//var NW=NODE_SIZE.w; var NH=NODE_SIZE.h;
	for (p in gGuide.pages)
	{
		page=gGuide.pages[p];
		if (page.mapx!==null)
		{
			var nodeLeft=page.mapx;
			var nodeTop= page.mapy;
			var stepc;//stepcolor
			stepc = (page.step===0) ? 0  :  (page.step%4)+1;
			$map.append(' '
				+'<div class="node Step'+(stepc)+'" rel="'+page.name.asHTML()+'" style="z-index:1; left:'+nodeLeft+'px;top:'+nodeTop+'px;">'
				+(page.type===CONST.ptPopup ? '':'<div class="arrow"></div>')
				+'<div class="text">'+page.name+'</div></div>'
				);
			//$map.append(''
				//+(page.type=="Pop-up page" ? '':'<div class="arrow" style="left:'+(nodeLeft+NW/2-7)+'px; top:'+(nodeTop-16)+'px;"></div>')
				//+'<div class="node" rel="'+page.mapid+'" style="z-index:1; left:'+nodeLeft+'px;top:'+nodeTop+'px;">'+page.name+'</div>'			);
		}
	}
	//$('.branch',$map).click(function(){focusNode($('.map > .node[rel="'+$(this).attr('rel')+'"]'));	});
	$('.node',$map).dblclick(function(){
		var target=$(this).attr('rel');
		//$('#CAJAOutline li, #CAJAIndex li').removeClass('ui-state-active');
		//$(this).addClass('ui-state-active')
		gotoPageEdit(target);
	});
	
	mapLines();
	//$( ".node" ).draggable({	
	$map.traggable({
		grid: [GRID_MAP.x, GRID_MAP.y],
		start: function(event,ui){
		},
		stop:
		/*** @param {{node,position}} ui */
		function(event,ui){
			var node=ui.node;
			var page = gGuide.pages[$(node).attr('rel')];
			page.mapx=ui.position.left;
			page.mapy=ui.position.top;
			mapLines();
		}
		
	});
}
/*
function focusPage()
{
	focusNode($('.map > .node[rel="'+page.mapid+'"]'))
}
*/

function mapZoomClick()
{ 
	var zoom=parseFloat($(this).attr('zoom'));
	if (zoom>0){
		gMapperScale = gMapperScale * zoom;
	}
	if (gMapperScale>=0.9){
		gMapperScale=1;
	}
	$('.map').traggable('changeScale',gMapperScale);
	//$('.map').css({zoom:gMapperScale,"-moz-transform":"scale("+gMapperScale+")","-webkit-transform":"scale("+gMapperScale+")"});
}




/* */
