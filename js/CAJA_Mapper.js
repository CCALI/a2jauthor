/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Mapper
*/

var mapperScale=1;
var mapSize= 1 ; //0 is small, 1 is normal



function showPageOnMap()
{
	var target=$(this).attr('target');
}


function buildMap()
{	// Contruct mapper flowcharts. 
	var $map = $('.map');
	$map.empty();
	//$('.MapViewer').removeClass('big').addClass(mapSize==1 ? 'big':'');
	/*
	if (mapSize==0)
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
	if (mapSize==1)
	{	// Full size boxes with question names and simple lines connecting boxes.
		//var YSC=1.45;// YScale
		var NW=150;
		var NH=36+8;
		for (var p in gGuide.pages)
		{
			var page=gGuide.pages[p];
			if (page.mapx>0) 
			{
				var nodeLeft=page.mapx;
				var nodeTop= page.mapy;
				$map.append(''
					+(page.type=="Pop-up page" ? '':'<div class="arrow" style="left:'+(nodeLeft+NW/2-7)+'px; top:'+(nodeTop-16)+'px;"></div>')
					+'<div class="node" rel="'+page.mapid+'" style="z-index:1; left:'+nodeLeft+'px;top:'+nodeTop+'px;">'+page.name+'</div>'
					//+lineV(nodeLeft+NW/2,nodeTop+NH,20)
					);
				var downlines=false;
				/* Outgoing branches to show:  
						A2J - Buttons with Destination, Script GOTOs
						CA - Next page, Feedback branches, Script GOTOs
				*/
				if (page.mapBranches==null)
				{
					var branches=[];
					for (var b in page.buttons)
					{
						var btn = page.buttons[b];
						branches.push({text:btn.label, dest: gGuide.pages[btn.next]} );
					}
					page.mapBranches=branches;
				}
				var nodeCenterX = nodeLeft + NW/2;
				var nBranches=page.mapBranches.length;
				var boffset =   NW/nBranches/2;
				for (var b in page.mapBranches)
				{
					var branch = page.mapBranches[b];
					var branchX=nodeLeft + b/nBranches*NW+boffset;
					var branchTop= nodeTop + NH;
					if (typeof branch.dest!="undefined")
					{
						var dy=(nBranches-parseInt(b))*2;
						var destX = branch.dest.mapx+NW/2;
						var destTop = branch.dest.mapy;
						var x1 = branchX;	var y1 = branchTop;
						var x2 = x1;		var y2 = y1 + 10  + dy;
						var x3,y3,x4,y4;
						if (destTop>nodeTop)
						{
							x3 = destX;	y3 = y2;
							x4 = x3;		y4 = destTop - 20  ;
							if (destX<x1 ) {x2=destX;x3=x1;} else {x2=x1;x3=destX;};
							$map.append( lineV(x1,y1,y2-y1) + ( (x2<x3) ? lineH(x2,y2,x3-x2):lineH(x3,y2,x2-x3)) +  lineV( x3,y3, y4-y3) );
						}
						else
						{
							//if (destX<x1 ) {x3=destX+NW;} else {x3=destX-NW};
							x3 = (x2 + destX)/2; y3 = y2;
							x4 = x3;		y4 = destTop - 20 ;
							var x5 = destX; var y5=y4;
							$map.append( lineV(x1,y1,y2-y1) + ( (x2<x3) ? lineH(x2,y2,x3-x2):lineH(x3,y2,x2-x3)) +  lineV( x4,y4, y3-y4) 
								+ ( (x4<x5) ? lineH(x4,y4,x5-x4):lineH(x5,y4,x4-x5)) );
						}
					}
					// $(".map").append('<div class="branch" rel="'+branch.dest+'" style="left:'+(branchLeft)+'px; top:'+branchTop+'px; width:'+branchWidth+'px;">'+branch.text+'</div>');
				}
			}
		}
		$('.branch',$map).click(function(){focusNode($('.map > .node[rel="'+$(this).attr('rel')+'"]'));	});
	}
	$('.node',$map).click(function(){	focusNode($(this));});
//	focusPage()
}
function lineV(left,top,height)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:1px;height:'+height+'px;"></div>';
}
function lineH(left,top,width)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:'+width+'px;height:1px;"></div>';
}
/*
function focusPage()
{
	focusNode($('.map > .node[rel="'+page.mapid+'"]'))
}
*/

