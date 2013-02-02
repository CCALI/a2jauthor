﻿/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Language (INCOMPLETE)
	07/14/2012 Language file for the authoring tool
	Language blocks for each supported language.
	There's a Languages[] structure for A2J Viewer specific code.
	And jQuery UI structs for Calendar.
*/

var lang = {
	Male:'',
	Female:'',
	GoBack:'',
	GoNext:'',
	MyProgress:'',
	SaveAndExit:'',
	ResumeExit:''
};

var Languages={
	default: 'en',
	regional: [],
	set : function(languageID)
	{
		if (typeof this.regional[languageID]==='undefined'){
			languageID='en';
		}
		trace("Set language to "+languageID);
		var region;
		
		region = this.regional[languageID];
		lang = {};
		var e;
		for (e in region){
			lang[e]= String(region[e]);
			//trace(e+"="+region[e]);
		}
		region = this.regional['en'];
		for (e in region){
			if (makestr(lang[e])==='')
			{
				lang[e]= String(region[e]);
				//trace('Missing '+e+"="+lang[e]);
			}
		}
	},
	en : function(txt)
	{	// needs translation
		return txt;
	}
};

// English
Languages.regional['en']= {
	locale:'en',
	
	/* VIEWER */
	/* 05/05/2005, 03/11/2010 External English language file used with A2J Viewer'*/
	Language:'English',
	AskYesNo_Yes:'Yes',
	AskYesNo_No:'No',
	Close:'Close',
	Comment:'Comment',
	GoBack:'BACK',
	GoNext:'NEXT',
	LearnMore:'Learn More',
	MyProgress:'MY PROGRESS',
	ProvideFeedbackOrComment:'Provide feedback or comment on this page',
	SaveAndExit:'EXIT',
	ResumeExit:'RESUME',
	SendFeedback:'SEND FEEDBACK',
	SoundIsOff:'SOUND IS OFF',
	SoundIsOn:'SOUND IS ON',
	SoundPlay:'Play',
	SoundStop:'Stop',
	WhatDoYouMean:'What do you mean?',
	Continue:'Continue',
	Exit:'Exit',
	Male:'Male',
	Female:'Female',
	ChooseListNumber:'Choose:',
	ChooseListText:'Choose from this list:',
	CheckBoxNOTALabel:'None of the above',
	ZoomNormal:'Normal Size',
	ZoomFull:'Full screen',
	TextEnlarge:'Enlarge text box',
	TextShrink:'Shrink text box',
	TextSizeLetter:'A',
	UploadAnswers:'Exiting. Please wait...',
	CalcClear:'Clear',
	CalcEnter:'Enter',
	MonthNamesShort:'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
	MonthNamesLong:'January,February,March,April,May,June,July,August,September,October,November,December',
	FieldPrompts_ResponseRequired:'You must provide a response in the blanks next to the red labels before you can continue.',
	FieldPrompts_SelectionRequired:'You must make a selection before you can continue.',
	FieldPrompts_text:'You must type a response in the highlighted space before you can continue.',
	FieldPrompts_textlong:'You must type a response in the highlighted space before you can continue.',
	FieldPrompts_textpick:'You must make a selection from the highlighted space before you can continue.',
	FieldPrompts_number:'You must type a number in the highlighted space before you can continue.',
	FieldPrompts_numberdollar:'You must type a dollar amount in the highlighted space before you can continue.',
	FieldPrompts_numberssn:'You must type a social security number in the highlighted spaces before you can continue.',
	FieldPrompts_numberphone:'You must type a phone number in the highlighted spaces before you can continue.',
	FieldPrompts_numberzip:'You must type a zip code in the highlighted space before you can continue.',
	FieldPrompts_numberpick:'You must select a number from the highlighted space before you can continue.',
	FieldPrompts_datemdy:'You must enter a month, day and year in the highlighted spaces before you can continue.',
	FieldPrompts_gender:'You must choose either male or female from the highlighted selection before you can continue.',
	FieldPrompts_radio:'You must choose a response from the highlighted selection before you can continue.',
	FieldPrompts_checkbox:'You must select one or more checkboxes to continue.',
	FieldPrompts_checkboxNOTA:'Please select one or more checkboxes or "None of the above" to continue.',
	Ordinals_1:'first',
	Ordinals_2:'second',
	Ordinals_3:'third',
	Ordinals_4:'fourth',
	Ordinals_5:'fifth',
	Ordinals_6:'sixth',
	Ordinals_7:'seventh',
	Ordinals_8:'eighth',
	Ordinals_9:'ninth',
	Ordinals_10:'tenth',
	Ordinals_11:'eleventh',
	Ordinals_12:'twelfth',
	Ordinals_13:'13th',
	
	
	// Tab names
	tabAbout:'About',
	tabInterview:'Interview',
	tabVariables:'Variables',
	tabConstants:'Constants',
	tabSteps:'Steps',
	/*
	// Edit Interview labels
	eiTitle:'Title',
	eiDescription:'Description',
	eoOutline:"Outline",
	eiJurisdiction:'Jurisdiction',
	eiAuthor:'Author',
	eiLogoGraphic:'Logo graphic',
	*/
	// Question branching types
	qIDNOWHERE:"[no where]",
	qIDSUCCESS:"[Success - Process Form]",
	qIDFAIL : "[Exit - User does not qualify]",
	qIDEXIT : "[Exit - Save Incomplete Form]",
	qIDBACK : "[Back to prior question]",
	qIDRESUME : "[Exit - Resume interview]",
	// Unknown ID
	UnknownID : "[Unknown id [{1}]: [{2}",
	
	scriptErrorMissingPage :'Page "{1}" does not exist.',
	scriptErrorUnhandled : 'Unknown command: {1}',
	scriptErrorEndMissing : 'Missing an EndIf',

	app:''
};



// Spanish
Languages.regional['es']= {
	locale:'es',
	
	/* VIEWER */
	// 05/05/2005, 03/11/2010 External Spanish language file used with A2J Viewer'
	Language:'Español',
	AskYesNo_Yes:'Si',
	AskYesNo_No:'No',
	Close:'Cerrar',
	Comment:'Comentario',
	GoBack:'Anterior',
	GoNext:'Siguiente',
	LearnMore:'Aprender más',
	MyProgress:'Mi Progreso',
	ProvideFeedbackOrComment:'Enviar comentarios y sugerencias',
	SaveAndExit:'Salida',
	ResumeExit:'Anterior',
	SendFeedback:'Enviar comentarios',
	SoundIsOff:'Sonido está apagado',
	SoundIsOn:'Sonido está encendido',
	SoundPlay:'Prender',
	SoundStop:'Parar',
	WhatDoYouMean:'¿Qué significas?',
	Continue:'continúe',
	Exit:'Salida',
	Male:'Masculino',
	Female:'Femenina',
	ChooseListNumber:'Escoja:',
	ChooseListText:'Escoja de esta lista:',
	CheckBoxNOTALabel:'ninguna de arriba',
	ZoomNormal:'tamaño normal',
	ZoomFull:'pantalla completa',
	TextEnlarge:'ampliar el cuadro de texto',
	TextShrink:'reducir el cuadro de texto',
	TextSizeLetter:'A',
	UploadAnswers:'Saliendo. Por favor, espere...',
	CalcClear:'Clear!',
	CalcEnter:'Enter!',
	MonthNamesShort:'ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic',
	MonthNamesLong:'enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre',
	FieldPrompts_ResponseRequired:'You must provide a response in the blanks next to the red labels before you can continue.',
	FieldPrompts_SelectionRequired:'You must make a selection before you can continue.',
	FieldPrompts_text:'You must type a response in the highlighted space before you can continue.',
	FieldPrompts_textlong:'You must type a response in the highlighted space before you can continue.',
	FieldPrompts_textpick:'You must make a selection from the highlighted space before you can continue.',
	FieldPrompts_number:'You must type a number in the highlighted space before you can continue.',
	FieldPrompts_numberdollar:'You must type a dollar amount in the highlighted space before you can continue.',
	FieldPrompts_numberssn:'You must type a social security number in the highlighted spaces before you can continue.',
	FieldPrompts_numberphone:'You must type a phone number in the highlighted spaces before you can continue.',
	FieldPrompts_numberzip:'You must type a zip code in the highlighted space before you can continue.',
	FieldPrompts_numberpick:'You must select a number from the highlighted space before you can continue.',
	FieldPrompts_datemdy:'You must enter a month, day and year in the highlighted spaces before you can continue.',
	FieldPrompts_gender:'You must choose either male or female from the highlighted selection before you can continue.',
	FieldPrompts_radio:'You must choose a response from the highlighted selection before you can continue.',
	FieldPrompts_checkbox:'Please select one or more checkboxes to continue.',
	FieldPrompts_checkboxNOTA:'Please select one or more checkboxes or "None of the above" to continue.',
	Ordinals1:'primero',
	Ordinals2:'segundo',
	Ordinals3:'tercero',
	Ordinals4:'cuarto',
	Ordinals5:'quinto',
	Ordinals6:'sexto',
	Ordinals7:'séptimo',
	Ordinals8:'octavo',
	Ordinals9:'noveno',
	Ordinals10:'décimo',
	Ordinals11:'undécimo',
	Ordinals12:'duodécimo',
	Ordinals13:'decimotecero',
	Ordinals14:'decimocuarto',
	Ordinals15:'decimoquinto',
	Ordinals16:'decimosexto',
	Ordinals17:'decimoséptimo',
	Ordinals18:'decimoctavo',
	Ordinals19:'decimonoveno:',
	Ordinals20:'vigésimo',
	Ordinals21:'vigésimoprimero',
	Ordinals22:'vigésimosegundo',
	Ordinals23:'vigésimotercero',
	Ordinals24:'vigésimocuarto',
	Ordinals25:'vigésimoquinto',
	Ordinals26:'vigésimosexto',
	Ordinals27:'vigésimoséptimo',
	Ordinals28:'vigésimooctavo',
	Ordinals29:'vigésimonoveno',
	Ordinals30:'trigésimo',
	Ordinals31:'trigésimoprimero',
	Ordinals32:'trigésimosegundo',
	Ordinals33:'trigésimotercero',
	Ordinals34:'trigésimocuarto',
	Ordinals35:'trigésimoquinto',
	Ordinals36:'trigésimosexto',
	Ordinals37:'trigésimoséptimo',
	Ordinals38:'trigésimooctavo',
	Ordinals39:'trigésimonoveno',
	Ordinals40:'cuadragésimo',
	Ordinals41:'cuadragésimoprimero',
	Ordinals42:'cuadragésimosegundo',
	Ordinals43:'cuadragésimotercero',
	Ordinals44:'cuadragésimocuarto',
	Ordinals45:'cuadragésimoquinto',
	Ordinals46:'cuadragésimosexto',
	Ordinals47:'cuadragésimoséptimo',
	Ordinals48:'cuadragésimooctavo',
	Ordinals49:'cuadragésimonoveno',
	Ordinals50:'quincuagésimo'
};



// Vietnamese
Languages.regional['vi']= {
	locale:'vi',
	
	
		/* VIEWER */
	// 11/23/2011 External Vietnamese language file used with A2J Viewer',
	Language:'Tiếng Anh',
	AskYesNo_Yes:'Có',
	AskYesNo_No:'Không',
	Close:'Đóng',
	Comment:'Ý kiến/lời chú thích',
	GoBack:'TRỞ LẠI',
	GoNext:'TIẾP TỤC',
	LearnMore:'Tìm hiểu thêm',
	MyProgress:'TIẾN ĐỘ',
	ProvideFeedbackOrComment:'Trả lời của tôi hoặc là ý kiến trong trang này',
	SaveAndExit:'RỜI KHỎI TRANG',
	ResumeExit:'TRỞ LẠI TRANG ĐIỀN LẦN CUỐI CÙNG',
	SendFeedback:'GỬI CÂU TRẢ LỜI',
	SoundIsOff:'TẮT ÂM THANH',
	SoundIsOn:'MỞ ÂM THANH',
	SoundPlay:'Bắt đầu',
	SoundStop:'Ngưng',
	WhatDoYouMean:'Quý vị có ý gì?',
	Continue:'Tiếp tục',
	Exit:'Rời khỏi trang',
	Male:'Nam',
	Female:'Nữ',
	ChooseListNumber:'Chọn',
	ChooseListText:'Chọn từ danh sách',
	CheckBoxNOTALabel:'Không có câu nào được áp dụng',
	ZoomNormal:'Chữ cỡ bình thưởng',
	ZoomFull:'Nguyên màn hình',
	TextEnlarge:'Làm chữ lớn hơn',
	TextShrink:'Làm chữ nhỏ hơn',
	TextSizeLetter:'A',
	UploadAnswers:'Rời khỏi trang. Xin đợi một chút',
	CalcClear:'Xóa',
	CalcEnter:'Vào trong',
	MonthNamesShort:'Tháng 1,Tháng 2,Tháng 3,Tháng 4,Tháng 5,Tháng 6,Tháng 7,Tháng 8,Tháng 9,Tháng 10,Tháng 11,Tháng 12',
	MonthNamesLong:'Tháng 1,Tháng 2,Tháng 3,Tháng 4,Tháng 5,Tháng 6,Tháng 7,Tháng 8,Tháng 9,Tháng 10,Tháng 11,Tháng 12',
	FieldPrompts_ResponseRequired:'Quý vị phải điền một câu trả lời vào ô trống ngay bên cạnh nhãn hiệu màu đỏ trước khi quý vị có thể tiếp tục.',
	FieldPrompts_SelectionRequired:'Quý vị phải chọn một câu trả lời trước khi quý vị có thể tiếp tục.',
	FieldPrompts_text:'Quý vị phải trả lời bằng cách đánh máy vào chỗ được tô đậm trước khi quý vị có thể tiếp tục.',
	FieldPrompts_textlong:'Quý vị phải trả lời bằng cách đánh máy vào chỗ được tô đậm trước khi quý vị có thể tiếp tục.',
	FieldPrompts_textpick:'Quý vị phải chọn một câu trả lời từ chỗ được tô đậm trước khi quý vị tiếp tục.',
	FieldPrompts_number:'Quý vị phải đánh một con số vào trong chỗ được tô đậm trước khi quý vị có thể tiếp tục.',
	FieldPrompts_numberdollar:'Quý vị phải đánh số tiền vào chỗ được tô đậm trước khi quý vị có thể được tiếp tục.',
	FieldPrompts_numberssn:'Quý vị phải đánh số an sinh xã hội vào chỗ được tô đậm trước khi quý vị có thể tiếp tục.',
	FieldPrompts_numberphone:'Quý vị phải đánh vào số điện thoại vào chỗ được tô đậm trước khi quý vị có thể tiếp tục. ',
	FieldPrompts_numberzip:'Quý vị phải đánh vào số ZIP vào chỗ được tô đậm trước khi quý vị có thể tiếp tục. ',
	FieldPrompts_numberpick:'Quý vị phải chọn một số từ chỗ được tô đậm trước khi quý vị có thể tiếp tục. ',
	FieldPrompts_datemdy:'Xin điền tháng, ngày, và năm vào chỗ được tô đậm trước khi quý vị có thể tiếp tục. ',
	FieldPrompts_gender:'Quý vị phải chọn nam hay nữ từ chỗ được tô đậm trước khi quý vị có thể tiếp tục. ',
	FieldPrompts_radio:'Quý vị phải chọn một câu trả lời từ chỗ được tô đậm trước khi quý vị tiếp tục.',
	FieldPrompts_checkbox:'Quý vị phải đánh dấu vào một ô trống hoặc nhiều hơn để tiếp tục. ',
	FieldPrompts_checkboxNOTA:'Xin đánh dấu vào một ô trống hoặc nhiều hơn hoặc chọn "Không có câu nào áp dụng" để tiếp tục. ',
	Ordinals1:'Một',
	Ordinals2:'Hai',
	Ordinals3:'Ba',
	Ordinals4:'Bốn',
	Ordinals5:'Năm ',
	Ordinals6:'Sáu',
	Ordinals7:'Bảy ',
	Ordinals8:'Tám',
	Ordinals9:'Chín',
	Ordinals10:'Mười',
	Ordinals11:'Mười một',
	Ordinals12:'Mười hai',
	Ordinals13:'Mười ba'
	
	
	
};



// Simplified Chinese
Languages.regional['zh-cn']= {
	locale:'zh-cn',
	
	/* VIEWER */
	//   11/23/2011 External Simplified Chinese language file used with A2J Viewer',
	Language:'英语',
	AskYesNo_Yes:'是',
	AskYesNo_No:'否',
	Close:'关闭',
	Comment:'评论',
	GoBack:'返回/上一页',
	GoNext:'前进/下一页',
	LearnMore:'了解更多',
	MyProgress:'我的进度',
	ProvideFeedbackOrComment:'在本页作出回应或评论',
	SaveAndExit:'退出',
	ResumeExit:'恢复',
	SendFeedback:'送出回应',
	SoundIsOff:'关闭音效',
	SoundIsOn:'打开音效',
	SoundPlay:'播放',
	SoundStop:'停止',
	WhatDoYouMean:'你的意思是？',
	Continue:'继续',
	Exit:'退出',
	Male:'男性',
	Female:'女性',
	ChooseListNumber:'选择：',
	ChooseListText:'从以下选项选择',
	CheckBoxNOTALabel:'以上皆非',
	ZoomNormal:'正常尺寸',
	ZoomFull:'全荧幕',
	TextEnlarge:'放大文字框',
	TextShrink:'缩小文字框',
	TextSizeLetter:'大',
	UploadAnswers:'退出中，请稍候…',
	CalcClear:'清除',
	CalcEnter:'输入',
	MonthNamesShort:'一月, 二月, 三月, 四月, 五月, 六月, 七月, 八月, 九月, 十月, 十一月, 十二月,',
	MonthNamesLong:'一月, 二月, 三月, 四月, 五月, 六月, 七月, 八月, 九月, 十月, 十一月, 十二月',
	FieldPrompts_ResponseRequired:'你必须先在红色标签旁的空位上作出回应才能继续下去',
	FieldPrompts_SelectionRequired:'你必须作出一项选择才能继续下去',
	FieldPrompts_text:'你必须先在黃色标记的栏位上作出回应才能继续下去',
	FieldPrompts_textlong:'你必须先在黃色标记的栏位上作出回应才能继续下去',
	FieldPrompts_textpick:'你必须先在黃色标记的栏位上作出一项选择才能继续下去',
	FieldPrompts_number:'你必须先在黃色标记的栏位上输入一个号码才能继续下去',
	FieldPrompts_numberdollar:'你必须先在黃色标记的栏位上输入一个价钱才能继续下去',
	FieldPrompts_numberssn:'你必须先在黃色标记的栏位上输入社会安全号码才能继续下去',
	FieldPrompts_numberphone:'你必须先在黃色标记的栏位上输入一个电话号码才能继续下去',
	FieldPrompts_numberzip:'你必须先在黃色标记的栏位上输入一个邮区号码才能继续下去',
	FieldPrompts_numberpick:'你必须先在黃色标记的栏位上选择一个号码才能继续下去',
	FieldPrompts_datemdy:'你必须先在黃色标记的栏位上输入月、日及年份才能继续下去',
	FieldPrompts_gender:'你必须先在黃色标记的栏位上选择男或女才能继续下去',
	FieldPrompts_radio:'你必须先在黃色标记的栏位上选择一项回应才能继续下去',
	FieldPrompts_checkbox:'你必须先在复选框里选择一项或以上才能继续下去',
	FieldPrompts_checkboxNOTA:'请在复选框选择一项或以上，或选择“以上皆非”以继续下去',
	Ordinals1:'第一',
	Ordinals2:'第二',
	Ordinals3:'第三',
	Ordinals4:'第四',
	Ordinals5:'第五',
	Ordinals6:'第六',
	Ordinals7:'第七',
	Ordinals8:'第八',
	Ordinals9:'第九',
	Ordinals10:'第十',
	Ordinals11:'第十一',
	Ordinals12:'第十二',
	Ordinals13:'第十三'
};



/* Inicialización en español para la extensión 'UI date picker' para jQuery. */
/* Traducido por Vester (xvester@gmail.com). */
jQuery(function($){
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '&#x3c;Ant',
		nextText: 'Sig&#x3e;',
		currentText: 'Hoy',
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
		'Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
		dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['es']);
});


/* Vietnamese initialisation for the jQuery UI date picker plugin. */
/* Translated by Le Thanh Huy (lthanhhuy@cit.ctu.edu.vn). */
jQuery(function($){
	$.datepicker.regional['vi'] = {
		closeText: 'Đóng',
		prevText: '&#x3c;Trước',
		nextText: 'Tiếp&#x3e;',
		currentText: 'Hôm nay',
		monthNames: ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
		'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'],
		monthNamesShort: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
		'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
		dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
		dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
		dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
		weekHeader: 'Tu',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['vi']);
});







/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Cloudream (cloudream@gmail.com). */
jQuery(function($){
	$.datepicker.regional['zh-CN'] = {
		closeText: '关闭',
		prevText: '&#x3c;上月',
		nextText: '下月&#x3e;',
		currentText: '今天',
		monthNames: ['一月','二月','三月','四月','五月','六月',
		'七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['一','二','三','四','五','六',
		'七','八','九','十','十一','十二'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		weekHeader: '周',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '年'};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});



/* */
