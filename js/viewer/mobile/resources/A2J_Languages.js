/******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие * sprawiedliwość
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Language (INCOMPLETE)
	07/14/2012

	Language file for the authoring tool
	Language blocks for each supported language.
	There's a Languages[] structure for A2J Viewer specific code.
	And jQuery UI structs for Calendar.

	Currently supported languages:
		English
		Spanish
		Vietnamese
		Chinese-Simplified
		Korean
		French
		Polish
		Russian
		Dutch

	Pending:

******************************************************************************/

// Language elements that are translatable
var lang = {
	Language: '',
	Male:'',
	Female:'',
	GoBack:'',
	GoNext:'',
	Continue:'',
	MyProgress:'',
	SaveAndExit:'',
	ResumeExit:'',
	Comment:'',
	SendFeedback:'',
	Close:'',
	LearnMore:'',
	FieldPrompts_text:'',
	RepeatAnd:'', // Used in building comma list from REPEAT.

	qIDNOWHERE:'',
	qIDSUCCESS:'',
	qIDFAIL:'',
	qIDEXIT:'',
	qIDBACK:'',
	qIDRESUME:'',
	UnknownID:'',

	scriptErrorMissingPage :'',
	scriptErrorUnhandled : '',
	scriptErrorEndMissing : ''
};

function readableList(list)
{	// 2014-09-03 Return comma separated, optional 'and' for array.
	var items=[];
	for (var i in list)
	{	// Remove null or blanks.
		var item = list[i];
		if (!isBlankOrNull(item))
		{
			items.push(item);
		}
	}
	var text=items.pop();
	if (items.length>0)
	{
		text=items.join(', ')+' ' + lang.RepeatAnd +' ' + text;
	}
	return text;
}
/**
 * @constructor
 * @struct
 * @this {TLanguages}
 */
function TLanguages()
{
	this.defaultLanguage ='en';
	this.regional =[];
	this.set = /** @this {TLanguages} */ function(languageID)
	{
		if (typeof this.regional[languageID]==='undefined'){
			languageID='en';
		}
		//trace("TLanguages.set",languageID);
		var region;

		region = this.regional[languageID];
		lang = {};
		var e;
		for (e in region){
			if (region.hasOwnProperty(e)) {
				lang[e]= String(region[e]);
			}
		}
		region = this.regional.en;
		for (e in region){
			if (region.hasOwnProperty(e)) {
				if (makestr(lang[e])==='')
				{
					lang[e]= String(region[e]);
					//traceAlert('Missing '+e+"="+lang[e]);
				}
			}
		}
	};
	this.en = function(txt)
	{	// needs translation
		return txt;
	};
	return this;
}


var Languages = new TLanguages();


/* 05/05/2005, 03/11/2010 English language file used with A2J Viewer'*/
Languages.regional.en= {
	locale:'en',
	Language:'English',
	LanguageEN: 'English',
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
	RepeatAnd: 'and',


	// Authoring system, non-translated elements.
	// Tab names
	tabAbout:'About',
	tabInterview:'Interview',
	tabVariables:'Variables',
	tabConstants:'Constants',
	tabSteps:'Steps',
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
	scriptErrorEndMissing : 'Missing an EndIf'

};



// Spanish language file used with A2J Viewer'
Languages.regional.es= {
	locale:'es',
	Language:'Español',
	LanguageEN: 'Spanish',
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
	Ordinals50:'quincuagésimo',
	RepeatAnd: 'y'
};




// French
Languages.regional.fr= {
	locale:'fr',
	Language:'Français',
	LanguageEN: 'French',
	AskYesNo_Yes :'Oui',
	AskYesNo_No :'Non',
	Close:'Fermer',
	Comment:'Commenter',
	GoBack:'Retour',
	GoNext:'Prochain',
	//GoNext:'En apprendre plus',
	MyProgress:'MON PROGRÈS',
	ProvideFeedbackOrComment:'Fournir des suggestions ou des commentaires sur cette page',
	SaveAndExit:'Sortir',
	ResumeExit:'Reprendre',
	SendFeedback:'Envoyer la suggestion',
	SoundIsOff:'Audio désactivé',
	SoundIsOn:'Audio activé',
	SoundPlay:'Jouer',
	SoundStop:'Arrêt',
	WhatDoYouMean:'Qu’est- ce que ça signifie?',
	Continue:'Continuer',
	Exit:'Sortir',
	Male:'Mâle',
	Female:'Femelle',
	ChooseListNumber:'Choisissez:',
	//ChooseListText:'Faites un choix à partir de la liste:',
	ChooseListText:'Aucun des énoncés ',
	ZoomNormal:'Taille normale',
	ZoomFull:'Image complète',
	TextEnlarge:'Agrandir la casse du texte',
	TextShrink:'Réduire la casse du texte',
	TextSizeLetter:'A',
	UploadAnswers:'Veuillez patienter…',
	CalcClear:'Effacer',
	CalcEnter:'Entrer',
	MonthNamesShort:'Janv,Fév,Mars,Avr,Mai,Juin,Juil,Août,Sept,Oct,Nov,Déc',
	MonthNamesLong:'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre',
	ResponseRequired:'Remplissez les champs vides à côté des étiquettes rouges pour pouvoir continuer. ',
	SelectionRequired:'Faites un choix pour pouvoir continuer.',
	text:'Entrez une réponse dans le champ surligné pour pouvoir continuer.',
	textlong:'Entrez une réponse dans le champ surligné pour pouvoir continuer.',
	textpick:'Faites un choix à partir de la liste du champ surligné pour pouvoir continuer. ',
	number:'Entrez un numéro dans le champ surligné pour pouvoir continuer.',
	numberdollar:'Entrez un montant dans le champ surligné pour pouvoir continuer. ',
	numberssn:'Entrez votre numéro de sécurité sociale dans le champ surligné pour pouvoir continuer.',
	numberphone:'Entrez votre numéro de téléphone dans le champ surligné pour pouvoir continuer.',
	numberzip:'Entrez votre code postal dans le champ surligné pour pouvoir continuer.',
	numberpick:'Faites un choix à partir de la liste du champ surligné pour pouvoir continuer.',
	datemdy:'Entrez l’année, le mois et le jour dans le champ surligné pour pouvoir continuer.',
	gender:'Choisissez soit mâle soit femelle dans le champ surligné pour pouvoir continuer.',
	radio:'Faites un choix à partir de la liste du champ surligné pour pouvoir continuer.',
	checkbox:'Sélectionnez une ou plusieurs cases pour pouvoir continuer.',
	checkboxNOTA:'Sélectionnez une ou plusieurs cases, ou « aucun des énoncés » pour pouvoir continuer.',
	Ordinals1:'premier',
	Ordinals2:'deuxième',
	Ordinals3:'troisième',
	Ordinals4:'quatrième',
	Ordinals5:'cinquième',
	Ordinals6:'sixième',
	Ordinals7:'septième',
	Ordinals8:'huitième',
	Ordinals9:'neuvième',
	Ordinals10:'dixième',
	Ordinals11:'onzième',
	Ordinals12:'douzième',
	Ordinals13:'treizième',
	RepeatAnd: 'et'
};


// Polish
Languages.regional.pl= {
	locale:'pl',
	Language:'Polski',
	LanguageEN: 'Polish',
	AskYesNo_Yes:'Tak',
	AskYesNo_No:'Nie',
	Close:'Zamknij',
	Comment:'Komantarz',
	GoBack:'Powrót',
	GoNext:'Następny',
	LearnMore:'Zobacz więcej',
	MyProgress:'Mój postęp',
	ProvideFeedbackOrComment:'Zostaw opinię lub komentarz ',
	SaveAndExit:'Wyjście',
	ResumeExit:'Podsumowanie',
	SendFeedback:'Wyślij podsumowanie',
	SoundIsOff:'Dźwięk wyłączony',
	SoundIsOn:'Dżwięk włączony',
	SoundPlay:'Odtwarzaj',
	SoundStop:'Stop',
	WhatDoYouMean:'Co masz na myśli?',
	Continue:'Dalej',
	Exit:'Wyjście',
	Male:'Mężczyzna',
	Female:'Kobieta',
	ChooseListNumber:'Wybierz',
	ChooseListText:'Wybierz z listy',
	CheckBoxNOTALabel:'Żadne z powyższych',
	ZoomNormal:'Normalny rozmiar',
	ZoomFull:'Pełen ekran',
	TextEnlarge:'Powiększ',
	TextShrink:'Pominiejsz',
	TextSizeLetter:'A',
	UploadAnswers:'Proszę czekać...',
	CalcClear:'Wyczyść',
	CalcEnter:'Akceptuj',
	MonthNamesShort:'1,2,3,4,5,6,7,8,9,10,11,12',
	MonthNamesLong:'Styczeń, Luty, Marzec. Kwiecień, Maj, Cerwiec, Lipiec, Sierpień, Wrzesień, Październik, Listopad, Grudzień',
	ResponseRequired:'Musisz najpierw wybrać odpowiedź w pustych polach obok czerwonych napisów zanim będziesz mógł kontynuować.',
	SelectionRequired:'Musisz wybrać zanim będziesz mógł kontynuować.',
	text:'Musisz podać odpowiedź w zaznaczonym miejscu zanim będziesz mógł kontynuować.',
	textlong:' Musisz podać odpowiedź w zaznaczonym miejscu zanim będziesz mógł kontynuować.',
	textpick:'Musisz wybrać zanim będziesz mógł kontynuować.',
	number:'Musisz wpisać numer w zanaczonym polu zanim będziesz mógł kontynuować.',
	numberdollar:'Musisz wpisać kwotę dolarów w zaznaczonym polu zanim będziesz mógł kontynuować.',
	numberssn:'Musisz wypisać Social Security Number zanim będziesz mógł kontynuować.',
	numberphone:'Musisz wpisać numer telefonu w zaznaczonym polu zanim będziesz mógł kontynuować.',
	numberzip:'Musisz wpisać kod pocztowy w zaznaczonym polu zanim będziesz mógł kontynuować.',
	numberpick:'Musisz wybrać numer z zaznaczonego pola zanim będziesz mógł kontynuować. ',
	datemdy:'Musisz wpisać miesiąc, dzień i rok w zaznaczonym polu zanim będziesz mógł kontynuować. ',
	gender:'Musisz wybrać płeć z zaznaczonego pola zanim będziesz mógł kontynuować.',
	radio:'Musisz wybrać odpowiedź z zaznaczonego pola zanim będziesz mógł kontynuować.',
	checkbox:'Musisz wybrać jedną lub kilka odpowiedzi zanim będziesz mógł kontynuować. ',
	checkboxNOTA:'Proszę wybrać jedną lub więcej odpowiedzi albo zaznaczyć „żadne z powyższych“ aby kontynuować. ',
	Ordinals1:'Lierwszy',
	Ordinals2:'drugi',
	Ordinals3:'trzeci',
	Ordinals4:'czwarty',
	Ordinals5:'piąty',
	Ordinals6:'szósty',
	Ordinals7:'siódmy',
	Ordinals8:'ósmy',
	Ordinals9:'dziewiąty',
	Ordinals10:'dziesiąty',
	Ordinals11:'jedenasty',
	Ordinals12:'dwunasty',
	Ordinals13:'rzynasty'
};


// Vietnamese language file used with A2J Viewer'
Languages.regional.vi= {
	locale:'vi',
	Language:'Tiếng Anh',
	LanguageEN: 'Vietnamese',
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
	Ordinals13:'Mười ba',
	RepeatAnd: 'và'
};



// Russian
Languages.regional.ru= {
	locale:'ru',
	LanguageEN: 'Russian',
	Language:'Русский',
	AskYesNo_Yes:'Да',
	AskYesNo_No:'Нет',
	Close:'Закрыть',
	Comment:'Комментарии',
	GoBack:'НАЗАД',
	GoNext:'ДАЛЕЕ',
	LearnMore:'Дополнительные Сведения',
	MyProgress:'МОЙ ХОД РАБОТЫ',
	ProvideFeedbackOrComment:'Страница для отзывов или комментариев',
	SaveAndExit:'ВЫХОД',
	ResumeExit:'ПРОДОЛЖЕНИЕ',
	SendFeedback:'ОТЗЫВЫ',
	SoundIsOff:'ЗВУК ВЫКЛЮЧЕН',
	SoundIsOn:'ЗВУК ВКЛЮЧЕН',
	SoundPlay:'Пуск',
	SoundStop:'Стоп',
	WhatDoYouMean:'Что это означает?',
	Continue:'Продолжить ',
	Exit:'Выйти',
	Male:'Мужской',
	Female:'Женский',
	ChooseListNumber:'Выбор:',
	ChooseListText:'Выберите из этого списка:',
	CheckBoxNOTALabel:'Ничего из перечисленного',
	ZoomNormal:'Обычный размер',
	ZoomFull:'Во весь экран',
	TextEnlarge:'Увеличить текстовое поле',
	TextShrink:'Уменьшить текстовое поле',
	TextSizeLetter:'A',
	UploadAnswers:'Выход. Пожалуйста, подождите...',
	CalcClear:'Очистка',
	CalcEnter:'Ввод',
	MonthNamesShort:'Янв,Фев,Март,Апр,Май,Июнъ,Июль,Авг,Сент,Окт,Нояб,Дек',
	MonthNamesLong:'Январь,Февраль,Март,Апрель,Май,Июнь,Июль,Август,Сентябрь,Октябрь,Ноябрь,Декабрь',
	ResponseRequired:'Поля с красной пометкой обязательные для заполнения. Введите данные перед тем, как продолжить.',
	SelectionRequired:'Перед тем, как продолжить, необходимо сделать выбор. ',
	text:'Перед тем, как продолжить, необходимо ответить в выделенном поле.',
	textlong:'Перед тем, как продолжить, необходимо ответить в выделенном поле.',
	textpick:'Перед тем, как продолжить, необходимо сделать выбор из выделенного.',
	number:'Перед тем, как продолжить, необходимо ввести число в выделенное поле.',
	numberdollar:'Перед тем, как продолжить, необходимо ввести сумму в долларах в выделенное поле.',
	numberssn:'Перед тем, как продолжить, необходимо ввести номер социального страхования (Social Security Number) в выделенное поле.',
	numberphone:'Перед тем, как продолжить, необходимо ввести номер телефона в выделенное поле.',
	numberzip:'Перед тем, как продолжить, необходимо ввести почтовый индекс в выделенное поле.',
	numberpick:'Перед тем, как продолжить, необходимо выбрать число из выделенного.',
	datemdy:'Перед тем, как продолжить, необходимо ввести месяц, день, и год в выделенные поля.',
	gender:'Перед тем, как продолжить, необходимо выбрать мужской или женский пол из выделенных вариантов.',
	radio:'Перед тем, как продолжить, необходимо выбрать ответ из выделенных вариантов.',
	checkbox:'Чтобы продолжить, необходимо отметить один или несколько флажков.',
	checkboxNOTA:'Чтобы продолжить, отметьте один или несколько флажков или "Ничего из перечисленного".',
	Ordinals1:'первый',
	Ordinals2:'второй',
	Ordinals3:'третий',
	Ordinals4:'четвертый',
	Ordinals5:'пятый',
	Ordinals6:'шестой',
	Ordinals7:'седьмой',
	Ordinals8:'восьмой',
	Ordinals9:'девятый',
	Ordinals10:'десятый',
	Ordinals11:'одиннадцатый',
	Ordinals12:'двенадцатый',
	Ordinals13:'13ый'
};



// Nederlands (Dutch)
Languages.regional.nl= {
	locale:'nl',
	Language:'Nederlands',
	LanguageEN: 'Dutch',
	AskYesNo_Yes:'Ja',
	AskYesNo_No:'Nee',
	Close:'Sluiten',
	Comment:'Commentaar',
	GoBack:'TERUG',
	GoNext:'VOLGENDE',
	LearnMore:'Kom meer te weten',
	MyProgress:'Mijn voortgang',
	ProvideFeedbackOrComment:'Geef feedback of commentaar op deze pagina',
	SaveAndExit:'Afronden',
	ResumeExit:'Hervatten',
	SendFeedback:'VERZEND FEEDBACK',
	SoundIsOff:'GELUID IS UIT',
	SoundIsOn:'GELUID IS AAN',
	SoundPlay:'Afspelen',
	SoundStop:'Stop',
	WhatDoYouMean:'Wat bedoelt U?',
	Continue:'Doorgaan',
	Exit:'Uitgang',
	Male:'Mannelijk',
	Female:'Vrouwelijk',
	ChooseListNumber:'Kies:',
	ChooseListText:'Kies uit deze lijst:',
	CheckBoxNOTALabel:'Geen van de voorgaande',
	ZoomNormal:'Normale afmetingen',
	ZoomFull:'Volledig scherm',
	TextEnlarge:'Vergroot tekstvak',
	TextShrink:'Verklein tekstvak',
	TextSizeLetter:'A',
	UploadAnswers:'Interessant. Even geduld alstublieft...',
	CalcClear:'Wissen',
	CalcEnter:'Invoeren',
	MonthNamesShort:'Jan,Feb,Mrt,Apr,Mei,Jun,Jul,Aug,Sep,Okt,Nov,Dec',
	MonthNamesLong:'Januari,Februari,Maart,April,Mei,Juni,Juli,Augustus,September,Oktober,November,December',
	ResponseRequired:'Voordat U door kunt gaan moet U een antwoord invullen in het lege veld naast de rode labels.',
	SelectionRequired:'Voordat U door kunt gaan  moet U een keuze maken.',
	text:'Voordat U door kunt gaan moet U een antwoord typen in het gearceerde gedeelte.',
	textlong:'Voordat U door kunt gaan moet U een antwoord typen in het gearceerde gedeelte.',
	textpick:'Voordat U door kunt gaan moet U een keuze maken uit het gearceerde gedeelte.',
	number:'Voordat U door kunt gaan moet U een getal typen in het gearceerde gedeelte.',
	numberdollar:'Voordat U door kunt gaan moet U een bedrag (in dollars) typen in het gearceerde gedeelte.',
	numberssn:'Voordat U door kunt gaan moet U een BurgerServiceNummer typen in het gearceerde gedeelte.',
	numberphone:'Voordat U door kunt gaan moet U een telefoonnummer typen in het gearceerde gedeelte.',
	numberzip:'Voordat U door kunt gaan moet U een postcode typen in het gearceerde gedeelte.',
	numberpick:'Voordat U door kunt gaan moet U een getal selecteren uit het gearceerde gedeele.',
	datemdy:'Voordat U door kunt gaan moet U een maand, dag en jaar typen in de gearceerde gedeelten.',
	gender:'Voordat U door kunt gaan moet U ofwel man ofwel vrouw kiezen in het gearceerde gedeelte.',
	radio:'Voordat U door kunt gaan moet U een antwoord kiezen uit het gearceerde gedeelte.',
	checkbox:'Voordat U door kunt gaan moet U een of meer vakjes aanvinken.',
	checkboxNOTA:'Vink alstublieft een of meerdere vakjes of het vakje "Geen van de voorgaande" aan om door te gaan.',
	Ordinals1:'eerste',
	Ordinals2:'tweede',
	Ordinals3:'derde',
	Ordinals4:'vierde',
	Ordinals5:'vijfde',
	Ordinals6:'zesde',
	Ordinals7:'zevende',
	Ordinals8:'achtste',
	Ordinals9:'negende',
	Ordinals10:'tiende',
	Ordinals11:'elfde',
	Ordinals12:'twaalfde',
	Ordinals13:'dertiende'
};


// Simplified Chinese language file used with A2J Viewer
Languages.regional['zh-cn']= {
	locale:'zh-cn',
	Language:'英语',
	LanguageEN: 'Simplified Chinese',
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
	Ordinals13:'第十三',
	RepeatAnd: '和'
};

// Korean
Languages.regional.ko= {
	locale:'ko',

	Language: '영어',
	LanguageEN: 'Korean',
	AskYesNo_Yes:'예',
	AskYesNo_No:'아니요',
	Close:'종료',
	Comment:'의견',
	GoBack:'뒤로',
	GoNext:'다음',
	LearnMore:'자세히',
	MyProgress:'내 진행 상황',
	ProvideFeedbackOrComment:'z',
	SaveAndExit:'나가기',
	ResumeExit:'다시 하기',
	SendFeedback:'피드백 보내기',
	SoundIsOff:'소리 끄기',
	SoundIsOn:'소리 켜기',
	SoundPlay:'재생',
	SoundStop:'정지',
	WhatDoYouMean:'어떤 의미입니까?',
	Continue:'계속',
	Exit:'나가기',
	Male:'남성',
	Female:'여성',
	ChooseListNumber:'선택:',
	ChooseListText:'이 목록에서 선택:',
	CheckBoxNOTALabel:'내용 중 해당 사항 없음',
	ZoomNormal:'정상 크기',
	ZoomFull:'전체 화면',
	TextEnlarge:'글 상자 확대',
	TextShrink:'글 상자 축소',
	TextSizeLetter:'A',
	UploadAnswers:'나가는 중입니다. 기다려 주십시오…',
	CalcClear:'지우기',
	CalcEnter:'입력',
	MonthNamesShort:'1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월',
	MonthNamesLong:'1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월',
	FieldPrompts_ResponseRequired:'계속하기 전에 적색 라벨 옆의 공란에 응답해야 합니다.',
	FieldPrompts_SelectionRequired:'계속하기 전에 선택해야 합니다.',
	FieldPrompts_text:'계속하기 전에 강조 표시된 공간에 응답을 입력해야 합니다.',
	FieldPrompts_textlong:'계속하기 전에 강조 표시된 공간에 응답을 입력해야 합니다.',
	FieldPrompts_textpick:'계속하기 전에 강조 표시된 공간에서 선택해야 합니다.',
	FieldPrompts_number:'계속하기 전에 강조 표시된 공간에 숫자를 입력해야 합니다.',
	FieldPrompts_numberdollar:'계속하기 전에 강조 표시된 공간에 달러 액수를 입력해야 합니다.',
	FieldPrompts_numberssn:'계속하기 전에 강조 표시된 공간에 사회보장번호를 입력해야 합니다.',
	FieldPrompts_numberphone:'계속하기 전에 강조 표시된 공간에 전화번호를 입력해야 합니다.',
	FieldPrompts_numberzip:'계속하기 전에 강조 표시된 공간에 우편번호를 입력해야 합니다.',
	FieldPrompts_numberpick:'계속하기 전에 강조 표시된 공간에 숫자를 선택해야 합니다.',
	FieldPrompts_datemdy:'계속하기 전에 강조 표시된 공간에 월, 일, 연도를 입력해야 합니다.',
	FieldPrompts_gender:'계속하기 전에 강조 표시된 선택란에서 남성 또는 여성을 선택해야 합니다.',
	FieldPrompts_radio:'계속하기 전에 강조 표시된 선택란에서 응답을 선택해야 합니다.',
	FieldPrompts_checkbox:'계속하려면 1개 이상의 체크박스를 선택해야 합니다.',
	FieldPrompts_checkboxNOTA:'계속하려면 2개 이상의 체크박스를 선택하거나 "위 내용 중 해당 사항 없음"을 선택하십시오.',
	Ordinals1:'첫째',
	Ordinals2:'둘째',
	Ordinals3:'셋째',
	Ordinals4:'넷째',
	Ordinals5:'다섯째',
	Ordinals6:'여섯째',
	Ordinals7:'일곱째',
	Ordinals8:'여덟째',
	Ordinals9:'아홉째',
	Ordinals10:'열 번째',
	Ordinals11:'열한 번째',
	Ordinals12:'열두 번째',
	Ordinals13:'열세 번째',
	RepeatAnd: '및'
};



if ($.datepicker) {

jQuery(function($){
	/* Save the English in case author switches back */
	$.datepicker.regional.en = $.datepicker.regional[''];
});

/* Inicialización en español para la extensión 'UI date picker' para jQuery. */
/* Traducido por Vester (xvester@gmail.com). */
jQuery(function($){
	$.datepicker.regional.es = {
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
	//$.datepicker.setDefaults($.datepicker.regional['es']);
});

/* Vietnamese initialisation for the jQuery UI date picker plugin. */
/* Translated by Le Thanh Huy (lthanhhuy@cit.ctu.edu.vn). */
jQuery(function($){
	$.datepicker.regional.vi = {
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
	//$.datepicker.setDefaults($.datepicker.regional['vi']);
});


/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Cloudream (cloudream@gmail.com). */
jQuery(function($){
	$.datepicker.regional['zh-cn'] = {
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
	//$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});

/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com). */
jQuery(function($){
	$.datepicker.regional.ko = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['1월(JAN)','2월(FEB)','3월(MAR)','4월(APR)','5월(MAY)','6월(JUN)',
		'7월(JUL)','8월(AUG)','9월(SEP)','10월(OCT)','11월(NOV)','12월(DEC)'],
		monthNamesShort: ['1월(JAN)','2월(FEB)','3월(MAR)','4월(APR)','5월(MAY)','6월(JUN)',
		'7월(JUL)','8월(AUG)','9월(SEP)','10월(OCT)','11월(NOV)','12월(DEC)'],
		dayNames: ['일','월','화','수','목','금','토'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: '년'};
	//$.datepicker.setDefaults($.datepicker.regional['ko']);
});



/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
jQuery(function($){
	$.datepicker.regional.pl = {
		closeText: 'Zamknij',
		prevText: '&#x3c;Poprzedni',
		nextText: 'Następny&#x3e;',
		currentText: 'Dziś',
		monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
		'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
		monthNamesShort: ['Sty','Lu','Mar','Kw','Maj','Cze',
		'Lip','Sie','Wrz','Pa','Lis','Gru'],
		dayNames: ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
		dayNamesShort: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
		dayNamesMin: ['N','Pn','Wt','Śr','Cz','Pt','So'],
		weekHeader: 'Tydz',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	//$.datepicker.setDefaults($.datepicker.regional.pl);
});

/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
jQuery(function($){
	$.datepicker.regional.ru = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Нед',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	//$.datepicker.setDefaults($.datepicker.regional.ru);
});

/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Mathias Bynens <http://mathiasbynens.be/> */
jQuery(function($){
	$.datepicker.regional.nl = {
		closeText: 'Sluiten',
		prevText: '←',
		nextText: '→',
		currentText: 'Vandaag',
		monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
		'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
		monthNamesShort: ['jan', 'feb', 'maa', 'apr', 'mei', 'jun',
		'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
		dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
		dayNamesShort: ['zon', 'maa', 'din', 'woe', 'don', 'vri', 'zat'],
		dayNamesMin: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
		weekHeader: 'Wk',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	//$.datepicker.setDefaults($.datepicker.regional.nl);
});

}


/* */